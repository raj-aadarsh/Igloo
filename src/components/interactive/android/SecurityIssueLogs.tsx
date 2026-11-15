import { LogAnatomy, type LogTab } from './LogAnatomy';

// Category 7: nothing crashes, nothing hangs — a feature just silently
// fails, because one of the permission layers said no.

const tabs: LogTab[] = [
  {
    id: 'secex',
    label: 'SecurityException',
    blurb: 'The Java permission layer refusing — the one failure that politely explains itself.',
    source: 'logcat (often swallowed by a catch — search anyway!)',
    lines: [
      { text: 'E DatabaseUtils: java.lang.SecurityException: Permission Denial: opening provider com.android.providers.contacts ... requires android.permission.READ_CONTACTS or android.permission.WRITE_CONTACTS', note: 'The best error message in Android: it names **what was attempted** and **exactly which permission was missing**. It was thrown on the far side of Binder (the `checkCallingUid` flow from the permissions topic) and delivered back to the caller.' },
      { text: '    at android.os.Parcel.createExceptionOrNull(Parcel.java:3011)', note: 'This frame proves it crossed Binder: the exception was *marshalled back* in the reply parcel, then re-thrown in the client. The denial happened in the provider’s process, not yours.' },
      { text: 'W PermissionManager: Camera permission check failed for uid 10057: appop mode 1 (MODE_IGNORED)', note: 'The subtle variant: a permission can be *granted* yet gated off by **AppOps** (the per-app operation switches behind Settings toggles). Mode 1 = ignored → many APIs then return empty data instead of throwing. Silent empty results? Check `dumpsys appops <pkg>`.' },
      { text: '$ adb shell dumpsys package com.example.notes | grep -A1 READ_CONTACTS   →   granted=false', note: 'Close the loop with PMS’s database (the package-record widget!): is it declared, and is it granted for this user? `granted=false` on a runtime permission = the dialog was denied — that’s a UX bug, not a framework one.' },
    ],
    greps: [
      { pattern: 'SecurityException', where: 'logcat — including W/ lines where code caught and ignored it' },
      { pattern: 'Permission Denial', where: 'logcat — AMS/provider-side denials with full detail' },
      { pattern: 'appop', where: 'logcat + dumpsys appops — the second gate after the permission itself' },
    ],
  },
  {
    id: 'privapp',
    label: 'Priv-app allowlist',
    blurb: 'An OEM app in /system/priv-app wants a privileged permission — but nobody allowlisted it. The device boots angry.',
    source: 'logcat system (PackageManager) — right at boot',
    lines: [
      { text: 'W PackageManager: Privileged permission android.permission.READ_PRIVILEGED_PHONE_STATE for package com.oem.diag (/system_ext/priv-app/OemDiag) not in privapp-permissions allowlist', note: 'The rule from the permissions topic: privileged permissions need location in priv-app **AND** an explicit entry in an XML under `/etc/permissions/privapp-permissions-*.xml`. This line = the XML entry is missing.' },
      { text: 'E PackageManager: Signature|privileged permissions not in privapp-permissions allowlist: {com.oem.diag: android.permission.READ_PRIVILEGED_PHONE_STATE}', note: 'The summary list PMS prints at the end of its scan. What happens next depends on `ro.control_privapp_permissions`: **log** = just warn, **enforce** = the permission is denied — and on many builds PMS **throws at boot**, giving you a bootloop whose root cause is one missing XML line. A top-3 OEM bring-up bug.' },
      { text: '$ adb shell getprop ro.control_privapp_permissions   →   enforce', note: 'Check the mode first — it explains why the same app works on one build (log) and bootloops another (enforce). The fix: add the permission to the product’s privapp-permissions XML (an `Android.bp` `prebuilt_etc` module), not to weaken the property.' },
    ],
    greps: [
      { pattern: 'privapp-permissions', where: 'logcat system at boot / bugreport SYSTEM LOG' },
      { pattern: 'not in privapp-permissions allowlist', where: 'logcat — names the exact package + permission to add' },
    ],
  },
  {
    id: 'selinux',
    label: 'SELinux denial',
    blurb: 'Below the Java layer entirely: the kernel’s policy said no. Nothing throws — syscalls just fail.',
    source: 'dmesg + logcat (grep avc)',
    lines: [
      { text: 'type=1400 audit(0.0:812): avc: denied { read } for comm="rild" name="serial" dev="proc" ino=4026532 scontext=u:r:rild:s0 tcontext=u:object_r:proc_serial:s0 tclass=file permissive=0', note: 'You learned to decode this line piece by piece in the security topic (who / did what / on what / enforced). In *debugging*, the giveaway symptom is: **a native daemon or HAL “can’t see” a file/socket that exists**, with no Java exception anywhere — because the failure is a syscall returning EACCES.' },
      { text: 'W rild    : Failed to open /proc/serial: Permission denied', note: 'The matching userspace symptom seconds earlier: “Permission denied” from a process running as **root is still a SELinux suspect** — MAC confines root too, remember.' },
      { text: '$ adb shell setenforce 0   # userdebug only — then retry the feature', note: 'The classic 60-second triage: flip to **permissive**, retry. Works now? It’s confirmed sepolicy. Then flip back (`setenforce 1`), collect the exact denials, and write proper rules — never ship permissive, and remember neverallow + CTS make “just allow everything” impossible.' },
    ],
    greps: [
      { pattern: 'avc: denied', where: 'dmesg AND logcat — kernel-logged denials' },
      { pattern: 'Permission denied', where: 'logcat — the userspace echo; correlate timestamps with the avc lines' },
    ],
  },
];

export function SecurityIssueLogs() {
  return (
    <LogAnatomy
      heading="Security & Permission Failures, Annotated"
      intro="Three layers can say no: the Java permission check, the priv-app allowlist, and SELinux under everything. Each refuses differently."
      tabs={tabs}
    />
  );
}
