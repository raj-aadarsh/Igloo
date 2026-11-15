import { NotesFlow, type NotesStep } from './NotesFlow';

// The monthly security-patch routine of a platform team, as one flow:
// bulletin → find the fix → port it to your branch → verify → review → ship.

const steps: NotesStep[] = [
  {
    kind: 'node',
    node: {
      id: 'asb',
      title: 'Android Security Bulletin published',
      mono: 'source.android.com/security/bulletin · monthly',
      notes: ['Lists CVEs (numbered vulnerabilities) + severity', 'Each links to the AOSP fix commit', 'Two patch levels: YYYY-MM-**01** and YYYY-MM-**05**'],
      detail:
        'Every month Google publishes the **Android Security Bulletin (ASB)**: a table of **CVEs** (public IDs for known vulnerabilities), each with its severity, affected Android versions and a link to the fixing commit in AOSP. Partners get it about a month early so patches can ship on time. There are two **patch levels**: `-01` covers the platform/framework fixes, and `-05` additionally covers kernel and vendor component fixes.',
    },
  },
  {
    kind: 'node',
    edge: '(repo sync your release branch)',
    node: {
      id: 'sync',
      title: 'Get your tree up to date',
      mono: 'repo sync -c -j8 · repo start asb-2026-11 --all',
      notes: ['**repo** = one tool managing hundreds of git projects', 'The manifest says which project, which branch', '`repo start` creates a work branch'],
      detail:
        'AOSP isn’t one git repository, it’s **hundreds** (frameworks/base, system/core, …). **repo** is the tool on top of git that manages them together, driven by a **manifest** XML listing every project with its path and branch (`.repo/manifests/default.xml`). `repo sync` updates them all; `repo start <topic>` creates a matching local work branch in the projects you’ll touch.',
    },
  },
  {
    kind: 'node',
    edge: '(per CVE)',
    node: {
      id: 'pick',
      title: 'Cherry-pick the fix',
      mono: 'git cherry-pick -x <aosp-commit>',
      notes: ['Copies ONE commit onto your branch', '`-x` records the original commit id', 'Your branch is often older → conflicts'],
      detail:
        '`git cherry-pick` takes the change from one specific commit and applies it on top of your branch. You aren’t merging all of AOSP, just that fix. `-x` appends “cherry picked from commit …” to the message so anyone can trace it back. On an **older Android version** the surrounding code may have changed since, so the pick often **conflicts**. Resolving it means understanding what the fix does, not just making it compile. That is the actual skill of **backporting**.',
    },
  },
  {
    kind: 'branch',
    edge: '(build, flash, verify)',
    nodes: [
      {
        id: 'build',
        title: 'Build & flash',
        mono: 'm · fastboot flashall',
        notes: ['userdebug build', 'boots cleanly?'],
        detail:
          'Build the patched tree (`m`), flash it, and confirm the device boots and the touched feature still works. A fix that compiles but crashes system_server shows up here as a boot loop.',
      },
      {
        id: 'sts',
        title: 'STS',
        mono: 'run sts-dynamic-full',
        notes: ['proves the CVE is fixed'],
        detail:
          'The **Security Test Suite** contains a test for each bulletin CVE. Running it proves the vulnerability is really closed on *your* build, which matters because a backported fix can be applied “successfully” yet not take effect.',
      },
      {
        id: 'cts',
        title: 'CTS / regression',
        mono: 'run cts -m <module>',
        notes: ['proves nothing else broke'],
        detail:
          'Run the **CTS modules** that cover the patched area, plus your own regression tests. Security fixes tighten behaviour, and an OEM customisation that relied on the old (insecure) behaviour can break. Better to catch it here than in the field.',
      },
    ],
  },
  {
    kind: 'node',
    edge: '(repo upload)',
    node: {
      id: 'gerrit',
      title: 'Gerrit code review',
      mono: 'Code-Review +2 · Verified +1 · Submit',
      notes: ['Each commit becomes a reviewable “change”', '`Change-Id` links new patch sets to it', 'CI votes Verified, a reviewer votes +2'],
      detail:
        '`repo upload` sends your commits to **Gerrit**, the code-review server AOSP-based teams use. Each commit becomes a **change**, identified by the `Change-Id:` line in its message. Amend and re-upload, and it becomes **patch set 2** of the same change. To merge you need **Verified +1** (CI built and tested it) and **Code-Review +2** (an approver). Then the change is **submitted** into the branch.',
    },
  },
  {
    kind: 'node',
    edge: '(release)',
    node: {
      id: 'ship',
      title: 'Bump the patch level & ship',
      mono: 'PLATFORM_SECURITY_PATCH := 2026-11-05',
      notes: ['Shows as `ro.build.version.security_patch`', 'The date in Settings → About phone', 'Only claim it when **every** CVE up to it is fixed'],
      detail:
        'Finally the build’s security patch level is updated, and it surfaces as the read-only property `ro.build.version.security_patch` (from the properties topic) and in Settings. Claiming a date is a **promise** that *all* bulletin fixes up to that level are in, and STS checks it. Then the OTA goes out.',
    },
  },
];

export function PatchPortFlow() {
  return (
    <NotesFlow
      title="The Monthly Patch Flow"
      intro="How a fix published by Google ends up on your company’s older Android build, verified and reviewed."
      steps={steps}
    />
  );
}
