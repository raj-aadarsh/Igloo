import type { Module } from '@/content/types';

export const m16: Module = {
  id: 'android-m16',
  slug: 'patch-porting-workflow',
  order: 16,
  title: 'Upgrades & Patch Porting',
  subtitle: 'repo, cherry-pick, Gerrit & the security bulletin',
  icon: 'git-pull-request',
  lessons: [
    {
      id: 'android-m16-l1',
      title: 'The monthly patch flow',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'Teams that maintain devices on older Android versions repeat one routine every month: take Google’s security fixes and land them safely on their own branches. Here it is end to end:',
        },
        { type: 'widget', widget: 'patch-port' },
        {
          type: 'code',
          caption: 'The commands behind the flow',
          code: `repo init -u <manifest-url> -b <release-branch>   # which projects, which branches
repo sync -c -j8                 # -c: only the current branch, faster
repo start asb-2026-11 frameworks/base system/core   # local topic branch in those projects

cd frameworks/base
git cherry-pick -x <aosp-commit-sha>    # apply one fix; -x records where it came from
#   conflict? → read both sides, fix by understanding, then:
git add <files> && git cherry-pick --continue

repo upload .                    # send to Gerrit for review
# amend after review comments: keep the same Change-Id → new patch set
git commit --amend && repo upload .`,
        },
      ],
    },
    {
      id: 'android-m16-l2',
      title: 'Backporting safely',
      minutes: 8,
      blocks: [
        {
          type: 'keyterms',
          title: 'The vocabulary',
          terms: [
            { term: 'Manifest', def: 'XML listing every git project (path, remote, branch/revision). Pinning revisions in a manifest is how a release is reproducible.' },
            { term: 'Upstream / downstream', def: 'AOSP is **upstream**; your company tree is **downstream**. Fixes flow down; your own changes add up and make every merge harder.' },
            { term: 'Backport', def: 'Applying a fix written for a newer version to an older branch. The code around it may differ, so it often needs adapting.' },
            { term: 'Change-Id', def: 'The Gerrit footer that ties every re-upload (patch set) to the same review.' },
            { term: 'Patch level', def: '`ro.build.version.security_patch`. -01 = platform fixes; -05 = also kernel and vendor fixes. A promise checked by STS.' },
          ],
        },
        { type: 'h3', text: 'Rules that keep a backport honest' },
        {
          type: 'ul',
          items: [
            '**Understand the fix before resolving conflicts.** A conflict means your branch differs from where the fix was written. Making it compile is easy; keeping the security check effective is the job.',
            '**Port the whole fix.** Some CVEs are fixed by several commits across projects (framework + native, say). Missing one gives a half-closed hole that STS should catch.',
            '**Keep traceability**: `-x`, the CVE id and the bug id in the commit message, so the next engineer (and the auditor) can map every change back to the bulletin.',
            '**Verify on the device, not just the build**: STS for the CVE, CTS modules for the touched area, your own regression tests for OEM customisations that might have relied on the old behaviour.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Version upgrades are the same job, bigger',
          text: 'Moving a device from Android 14 to 15 means taking the new AOSP release and re-applying (rebasing) all of your downstream changes on top: every OEM customisation becomes a potential conflict, every HAL must still meet the new interface versions, and the full XTS must pass again. Fewer and cleaner downstream changes make every upgrade cheaper, which is why teams push fixes upstream when they can.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“Each month the Android Security Bulletin lists CVEs with links to the AOSP fixes. I repo sync our release branch, repo start a topic branch, and git cherry-pick -x each fix. On an older branch the pick often conflicts, so I read the original fix to understand what it protects and adapt it rather than just making it compile, and make sure I have every commit the CVE needs. Then I build a userdebug image, run STS to prove the CVE is closed and the relevant CTS modules plus our regression tests to prove nothing broke, and upload to Gerrit for Verified +1 and Code-Review +2. Only when every fix up to a date is in do we bump ro.build.version.security_patch.”',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Theory complete 🎉',
          text: 'With these five glue topics, the theory is covered end to end: architecture, boot, components, IPC, services, input, graphics, memory, configuration, security, builds and the patch workflow. Next is the hands-on issue-resolution phase.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m16-q1',
      type: 'single',
      prompt: 'Why does AOSP use repo on top of git?',
      options: ['git is too slow', 'AOSP is hundreds of git repositories; repo manages them together from a manifest', 'repo replaces git commits', 'For code review'],
      correct: [1],
      explanation: 'repo syncs, branches and uploads across all the projects listed in the manifest.',
    },
    {
      id: 'android-m16-q2',
      type: 'single',
      prompt: 'git cherry-pick -x <sha> does what?',
      options: ['Merges the whole upstream branch', 'Applies just that commit’s change to your branch and records the original commit id in the message', 'Deletes a commit', 'Uploads to Gerrit'],
      correct: [1],
      explanation: 'One commit, applied on top; -x keeps the trail back to the source.',
    },
    {
      id: 'android-m16-q3',
      type: 'single',
      prompt: 'After review comments you amend and re-upload. Gerrit treats it as…',
      options: ['A brand-new change', 'A new patch set of the same change, linked by the Change-Id footer', 'A merge conflict', 'A revert'],
      correct: [1],
      explanation: 'The Change-Id ties every upload to the same review.',
    },
    {
      id: 'android-m16-q4',
      type: 'single',
      prompt: 'What does a change need before it can be submitted in a typical Gerrit setup?',
      options: ['Just one comment', 'Verified +1 (CI) and Code-Review +2 (an approver)', 'A tag', 'A rebase'],
      correct: [1],
      explanation: 'CI proves it builds and passes tests; an approver signs off.',
    },
    {
      id: 'android-m16-q5',
      type: 'single',
      prompt: 'Security patch level 2026-11-05 vs 2026-11-01:',
      options: ['Same thing', '-05 also includes the kernel and vendor component fixes; -01 covers the platform fixes', '-05 is a beta', '-01 is newer'],
      correct: [1],
      explanation: 'The two levels let devices declare platform-only completeness or full completeness.',
    },
    {
      id: 'android-m16-q6',
      type: 'single',
      prompt: 'Which suite proves that a backported CVE fix actually works on your build?',
      options: ['CTS', 'STS (Security Test Suite)', 'VTS', 'GTS'],
      correct: [1],
      explanation: 'STS has tests for bulletin CVEs; CTS checks the rest didn’t regress.',
    },
    {
      id: 'android-m16-q7',
      type: 'multi',
      prompt: 'Good backporting practice: (pick all)',
      options: [
        'Understand the original fix before resolving conflicts',
        'Include every commit the CVE fix needs, across projects',
        'Drop the CVE id from the message to keep it short',
        'Run STS plus the relevant CTS modules on a real device',
      ],
      correct: [0, 1, 3],
      explanation: 'Traceability (CVE and bug ids) is part of the job, not noise.',
    },
  ],
  resources: [
    { label: 'Android Security Bulletins', url: 'https://source.android.com/docs/security/bulletin', kind: 'docs', free: true },
    { label: 'AOSP — Repo command reference', url: 'https://source.android.com/docs/setup/reference/repo', kind: 'docs', free: true },
    { label: 'Gerrit — Code review docs', url: 'https://gerrit-review.googlesource.com/Documentation/', kind: 'docs', free: true },
  ],
};
