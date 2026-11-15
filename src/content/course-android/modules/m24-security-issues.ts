import type { Module } from '@/content/types';

export const m24: Module = {
  id: 'android-m24',
  slug: 'issues-security-permissions',
  order: 24,
  title: 'Issues 7 · Security & Permissions',
  subtitle: 'SecurityExceptions, priv-app allowlists & SELinux denials',
  icon: 'shield-alert',
  lessons: [
    {
      id: 'android-m24-l1',
      title: 'Under the hood — three layers can say no',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'The signature symptom of this family: **a feature silently does nothing**. No crash, no freeze — a call returned empty, a daemon couldn’t open its socket, a boot stalled. Three independent gates can be the refuser, and each logs differently:',
        },
        {
          type: 'keyterms',
          title: 'The three gates',
          terms: [
            { term: '1 · Java permission check', def: 'The Binder-side `checkCallingUid` flow from Phase 1. Refusal = **SecurityException**, marshalled back to the caller — loud and self-explaining (unless a catch block swallows it).' },
            { term: '2 · Priv-app allowlist', def: 'Privileged permissions need the priv-app location **plus** an entry in `/etc/permissions/privapp-permissions-*.xml`. Missing entry → PMS logs the violation at boot — and with `ro.control_privapp_permissions=enforce`, denies it or **refuses to boot**.' },
            { term: '3 · SELinux', def: 'Below Java entirely: the kernel denies the syscall with EACCES and logs **`avc: denied`** to dmesg. No exception anywhere — the process just finds files “missing” or sockets unreachable. Even root is confined.' },
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Which gate? Decide by the symptom',
          text: 'A **stack trace naming a permission** → gate 1. A **boot-time PackageManager complaint** (or a bootloop after adding an OEM app) → gate 2. A **native daemon/HAL failing with “Permission denied”** and no Java anywhere → gate 3, go grep dmesg. And remember the quiet fourth: a *granted* permission gated off by **AppOps** returns empty data instead of throwing.',
        },
      ],
    },
    {
      id: 'android-m24-l2',
      title: 'The logs, annotated',
      minutes: 9,
      blocks: [
        { type: 'widget', widget: 'log-security-issues' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The method',
          text: '1) Find the refusal line: `SecurityException` / `not in privapp-permissions allowlist` / `avc: denied`. 2) Confirm state, not assumptions: `dumpsys package` for grants, `dumpsys appops` for op modes, `getenforce` for SELinux mode. 3) For SELinux: permissive-retry on a userdebug build to confirm, then write the *correct* fix — proper rule, proper label, or proper API — never ship permissive, and respect the neverallow walls (CTS checks them). 4) For priv-app: add the XML allowlist entry; don’t weaken the enforce property.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“When a feature silently fails I check the three gates in order. A SecurityException names the missing permission and was thrown on the service side of Binder, so I verify the grant in dumpsys package and the AppOps mode behind it. A privileged OEM app failing — or a build bootlooping after adding one — points at the priv-app allowlist: PMS logs exactly which permission isn’t in the privapp-permissions XML, and with enforcement on, that’s fatal at boot. If a native daemon gets Permission denied with no Java involved, it’s SELinux: I grep dmesg for avc denied, decode source context, target context, class and permission, confirm with a permissive retry on a debug build, and then fix it properly in sepolicy — knowing a lazy allow can collide with a neverallow and fail CTS.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m24-q1',
      type: 'single',
      prompt: 'A SecurityException’s stack shows Parcel.createExceptionOrNull. That detail proves…',
      options: [
        'The parcel was too large',
        'The denial happened in the remote service and was marshalled back over Binder',
        'SELinux blocked it',
        'The app is unsigned',
      ],
      correct: [1],
      explanation: 'The check ran on the trusted side; the exception you caught is its Binder-delivered reply.',
    },
    {
      id: 'android-m24-q2',
      type: 'single',
      prompt: 'An API returns empty data with no exception, though the permission shows granted. Check next:',
      options: ['The kernel log', 'dumpsys appops — the operation may be MODE_IGNORED behind a Settings toggle', 'The APK signature', 'pstore'],
      correct: [1],
      explanation: 'AppOps is the second gate: ignored ops commonly degrade to empty results instead of throwing.',
    },
    {
      id: 'android-m24-q3',
      type: 'single',
      prompt: 'A new OEM app in /system_ext/priv-app bootloops the build. The classic cause:',
      options: [
        'Its icon is too large',
        'It requests privileged permissions that aren’t in any privapp-permissions XML, with enforcement on',
        'It has no launcher activity',
        'SELinux is permissive',
      ],
      correct: [1],
      explanation: 'PMS’s boot-scan violation list + ro.control_privapp_permissions=enforce = a boot-time failure naming the exact permission.',
    },
    {
      id: 'android-m24-q4',
      type: 'single',
      prompt: 'A root-owned daemon gets “Permission denied” opening a file that exists. Root can’t be blocked by DAC, so…',
      options: ['The file is corrupt', 'It’s SELinux — grep dmesg for the avc: denied line; MAC confines root too', 'The disk is full', 'It’s a Java bug'],
      correct: [1],
      explanation: 'Mandatory access control doesn’t care about uid 0 — the denial will be in the kernel log.',
    },
    {
      id: 'android-m24-q5',
      type: 'single',
      prompt: 'setenforce 0 makes the feature work. The correct conclusion and next step:',
      options: [
        'Ship with SELinux permissive',
        'Cause confirmed as sepolicy — re-enable enforcing, collect the exact denials, and add proper rules/labels (respecting neverallows)',
        'Delete the policy',
        'The bug is in the app',
      ],
      correct: [1],
      explanation: 'Permissive is a diagnostic state only; CTS-checked neverallows make “allow everything” impossible anyway.',
    },
    {
      id: 'android-m24-q6',
      type: 'single',
      prompt: 'avc denials appear in which log(s)?',
      options: ['Only logcat -b crash', 'The kernel log (dmesg/pstore) — and mirrored into logcat', 'Only dropbox', 'test_result.xml'],
      correct: [1],
      explanation: 'SELinux logs through the kernel’s audit path; grep both dmesg and logcat for avc.',
    },
  ],
  resources: [
    { label: 'AOSP — SELinux validation', url: 'https://source.android.com/docs/security/features/selinux/validate', kind: 'docs', free: true },
    { label: 'AOSP — Privileged permission allowlisting', url: 'https://source.android.com/docs/core/permissions/perms-allowlist', kind: 'docs', free: true },
  ],
};
