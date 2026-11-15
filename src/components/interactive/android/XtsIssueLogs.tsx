import { LogAnatomy, type LogTab } from './LogAnatomy';

// Category 8: nothing is "broken" for a user — a test suite is red, or a
// feature regressed after the OS upgrade. Reading the harness is the skill.

const tabs: LogTab[] = [
  {
    id: 'tradefed',
    label: 'Reading a CTS failure',
    blurb: 'Tradefed ran thousands of tests; your job starts at the one line that failed.',
    source: 'test_result.xml + device_logcat_test in the results folder',
    lines: [
      { text: 'FAILED: android.permission.cts.PermissionPolicyTest#testPlatformPermissionPolicyUnaltered', note: 'Module + class + test. The *name* is the first clue: this one literally checks that the platform’s permission table wasn’t altered — a favourite OEM tripwire (someone added a permission to the framework).' },
      { text: 'junit.framework.AssertionFailedError: Permission allowlisted and defined: android.permission.OEM_DIAG_ACCESS', note: 'The assertion message states the CONTRACT that broke, in English. Here: an OEM-added permission in the platform package. The fix direction is usually in this sentence, not in the stack below it.' },
      { text: '=== device_logcat_test.txt @ 20:14:07 ===   (the same timestamp as the failure)', note: 'Each result bundle includes the device logcat captured **during the run**. Jump to the failure’s timestamp: the real cause (a crash, an avc denial, a timeout) is usually logged right there — the assertion is only the surface.' },
      { text: '$ run cts --retry 3 -t android.permission.cts.PermissionPolicyTest#testPlatformPermissionPolicyUnaltered', note: 'The loop: re-run **just the failing test** for a fast repro (and to separate real failures from flakes — a retried-green test with no fix is a flake, which is its own answer).' },
    ],
    greps: [
      { pattern: '<Test result="fail"', where: 'test_result.xml — machine-countable failures per module' },
      { pattern: 'AssertionFailedError', where: 'the result + host log — the broken contract in words' },
      { pattern: 'avc: denied', where: 'device_logcat_test — the hidden cause behind many CTS reds' },
    ],
  },
  {
    id: 'neverallow',
    label: 'neverallow violation',
    blurb: 'Your sepolicy change built fine on YOUR tree — CTS still catches it on the device.',
    source: 'CtsSecurityHostTestCases / SELinuxNeverallowRulesTest',
    lines: [
      { text: 'FAILED: android.cts.security.SELinuxNeverallowRulesTest#testNeverallowRules423', note: 'CTS compiles the AOSP neverallow rules and checks the **device’s shipped policy** against them — so a vendor-side allow rule that snuck past your local build still fails certification here.' },
      { text: 'junit.framework.AssertionFailedError: The following errors were encountered when validating the SELinux neverallow rule:\nneverallow { appdomain } proc_serial:file { read };', note: 'It prints the exact violated rule — read it as “policy on this device allows something AOSP forbids”. Map it back to whichever `.te` file added the offending allow (grep your sepolicy tree for the source/target types).' },
      { text: 'libsepol.report_failure: neverallow violated by allow untrusted_app proc_serial:file { read };', note: 'And the specific allow rule that did it. The fix is the security topic’s lesson: not a bigger hole, but a different design — a proper API, a new type label, or removing the access.' },
    ],
    greps: [
      { pattern: 'SELinuxNeverallowRulesTest', where: 'the CTS result — the neverallow gate' },
      { pattern: 'neverallow violated by', where: 'the failure text — names the exact offending allow rule' },
    ],
  },
  {
    id: 'upgrade',
    label: 'Upgrade / enterprise regression',
    blurb: 'It worked on 14, fails on 15: behaviour changes + stricter defaults meeting OEM customisations.',
    source: 'logcat + dumpsys, compared ACROSS the two builds',
    lines: [
      { text: 'W IntentForwarderActivity: Cannot forward intent Intent { act=android.intent.action.SEND ... } to user UserHandle{10}', note: 'A COPE/work-profile classic: sharing from personal to work stopped working after the upgrade. Cross-profile intents pass through **IntentForwarderActivity**, gated by the profile’s forwarding rules — a new release tightening defaults (or the DPC not re-provisioning them) breaks the path.' },
      { text: 'E DevicePolicyManager: Provisioning failed: org.xmlpull.v1.XmlPullParserException ... in /product/etc/default-permissions.xml', note: 'Work-profile provisioning dying on a malformed/stale OEM config file carried over from the old release — upgrade regressions are often **old config meeting new parser**. The ManagedProvisioning logs name the file.' },
      { text: 'W PackageParser: Targeting S+ (version 31 and above) requires that an explicit value for android:exported be defined when intent filters are present', note: 'The other big family: **behaviour changes**. Each release adds requirements (exported flags, FGS types, PendingIntent mutability…). The release notes’ “behaviour changes” page is genuinely a debugging tool — grep the log for the feature, then check that page.' },
      { text: '$ adb shell dumpsys device_policy   →   Profile Owner (User 10): admin=com.mdm.agent/.DeviceAdmin', note: 'For enterprise bugs, this dump is the ground truth: which DPC is PO/DO, which cross-profile policies are set. Diff it between the 14 and 15 devices — the missing policy line IS the bug report.' },
    ],
    greps: [
      { pattern: 'Cannot forward intent', where: 'logcat — cross-profile blockages' },
      { pattern: 'ManagedProvisioning', where: 'logcat — the work-profile setup transcript' },
      { pattern: 'dumpsys device_policy', where: 'both builds — diff the policy state' },
    ],
  },
];

export function XtsIssueLogs() {
  return (
    <LogAnatomy
      heading="XTS & Upgrade Regressions, Annotated"
      intro="The suite is the specification: read the assertion as a broken contract, and let the device logcat tell you why it broke."
      tabs={tabs}
    />
  );
}
