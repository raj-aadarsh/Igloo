import type { Module } from '@/content/types';

export const m25: Module = {
  id: 'android-m25',
  slug: 'issues-xts-regressions',
  order: 25,
  title: 'Issues 8 · XTS & Upgrade Regressions',
  subtitle: 'Red test suites & features that broke with the new release',
  icon: 'badge-check',
  lessons: [
    {
      id: 'android-m25-l1',
      title: 'Under the hood — when the “bug” is a broken contract',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'The last family has no crashing process at all: a **test suite is red**, or a feature that worked on the old release fails on the new one. The mental shift: the XTS suites are **executable contracts** (CTS = API behaviour, VTS = HAL contracts, GTS = Google requirements, STS = security fixes) — a failure means *the device broke a promise*, and the test names which one.',
        },
        {
          type: 'ol',
          items: [
            '**Tradefed** (the harness) runs modules of tests against the device and writes `test_result.xml` + a **device logcat captured during the run** into the results folder.',
            'A failure gives you three threads to pull: the **test name** (what contract), the **assertion message** (how it broke, in English), and the **device log at that timestamp** (why — often a crash or avc denial hiding under the assertion).',
            'The loop is always: *re-run just the failing test* → tight repro → fix on the right side of the Treble wall → re-run the module. Retried-green with no change = a flake, which is also an answer.',
          ],
        },
        {
          type: 'keyterms',
          title: 'Upgrade-regression side-notes',
          terms: [
            { term: 'Behaviour changes', def: 'Every release tightens rules (exported flags, FGS types, intent mutability…). “Worked on 14, fails on 15” → grep the log for the feature, then read that release’s behaviour-changes page. It is a debugging tool.' },
            { term: 'Old config, new parser', def: 'OEM XMLs and overlays carried across an upgrade meeting stricter parsing/validation — a top cause of provisioning and boot-time failures.' },
            { term: 'Enterprise regressions', def: 'COPE/work-profile breakage shows in ManagedProvisioning logs and cross-profile intent forwarding — and `dumpsys device_policy`, diffed between old and new builds, is the ground truth.' },
          ],
        },
      ],
    },
    {
      id: 'android-m25-l2',
      title: 'The logs, annotated',
      minutes: 9,
      blocks: [
        { type: 'widget', widget: 'log-xts-issues' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The method',
          text: '1) Read the failing test’s *name* as a sentence — it states the contract. 2) Read the assertion message — it states the violation. 3) Jump to the same timestamp in device_logcat_test — the mechanism (crash, denial, timeout) is usually logged there. 4) Re-run just that test for the repro loop. 5) Fix the device, never the test — and for upgrade regressions, diff state dumps (device_policy, package grants, properties) between the old and new builds; the missing line is the bug report.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“I treat a red suite as a broken contract. Tradefed’s result names the test, the assertion says in English what promise failed, and the captured device logcat at that timestamp shows the mechanism — half the time it’s an avc denial or a crash underneath the assertion. I re-run just the failing test for a fast loop and fix on the correct side of the Treble wall: framework patch, vendor HAL, sepolicy label or config — never the test, since neverallow and policy checks are re-verified on the device anyway. For post-upgrade regressions I think behaviour changes plus stale config: grep the feature in the log, check the release’s behaviour-changes list, and diff dumps like device_policy between the two builds until the missing policy or config line shows itself.”',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Phase 4 complete 🎉',
          text: 'You now hold the full taxonomy: eight families, their detection machinery, their artifacts, and the exact lines to grep. Next step (when you bring them): real-world cases — walking genuine logs end to end, from first symptom line to root cause and the story you’d tell about it.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m25-q1',
      type: 'single',
      prompt: 'The three artifacts a CTS failure hands you are…',
      options: [
        'A tombstone, an ANR trace, a heap dump',
        'The test name (contract), the assertion message (violation), and the device logcat at that timestamp (mechanism)',
        'Only a pass/fail bit',
        'A Gerrit change',
      ],
      correct: [1],
      explanation: 'Pull all three threads — the assertion is the surface, the device log usually holds the cause.',
    },
    {
      id: 'android-m25-q2',
      type: 'single',
      prompt: 'A test fails once, then passes on retry with no change. Correct reading:',
      options: ['It’s fixed', 'A flake — track it, but it’s not evidence of a fixed bug', 'CTS is broken', 'The device is certified'],
      correct: [1],
      explanation: 'Retried-green without a fix means nondeterminism, not resolution.',
    },
    {
      id: 'android-m25-q3',
      type: 'single',
      prompt: 'Why can a vendor sepolicy change that builds fine still fail CTS on the device?',
      options: [
        'CTS ignores policy',
        'CTS validates the device’s shipped policy against the AOSP neverallow rules — catching allows your local build didn’t check',
        'The build was cached',
        'SELinux was permissive',
      ],
      correct: [1],
      explanation: 'The neverallow contract is re-verified where it matters: on the shipping device.',
    },
    {
      id: 'android-m25-q4',
      type: 'single',
      prompt: '“Worked on Android 14, fails on 15” — the first two suspects are…',
      options: [
        'Hardware and battery',
        'That release’s documented behaviour changes, and OEM config/overlays meeting stricter parsing',
        'The kernel and the bootloader',
        'The Play Store',
      ],
      correct: [1],
      explanation: 'Upgrades tighten defaults and validators; old customisations are what they tighten against.',
    },
    {
      id: 'android-m25-q5',
      type: 'single',
      prompt: 'Sharing from personal to work profile stopped working post-upgrade. The ground truth to diff is…',
      options: ['dumpsys battery', 'dumpsys device_policy on both builds — the cross-profile policy state', 'getevent', 'the APK sizes'],
      correct: [1],
      explanation: 'The forwarding rules live in device policy; the missing line between the two dumps is the regression.',
    },
    {
      id: 'android-m25-q6',
      type: 'single',
      prompt: 'The golden rule when a conformance test is red:',
      options: ['Patch the test', 'Waive everything', 'Fix the device — the suite is the specification', 'Disable the module'],
      correct: [2],
      explanation: 'XTS defines what “is Android” means; the device must move to the contract, not the reverse.',
    },
  ],
  resources: [
    { label: 'AOSP — CTS debugging', url: 'https://source.android.com/docs/compatibility/cts/debug', kind: 'docs', free: true },
    { label: 'Android 15 — Behaviour changes', url: 'https://developer.android.com/about/versions/15/behavior-changes-all', kind: 'docs', free: true },
  ],
};
