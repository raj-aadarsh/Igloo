import type { Module } from '@/content/types';

export const m9: Module = {
  id: 'android-m9',
  slug: 'multiuser-enterprise',
  order: 9,
  title: 'Multi-User & Enterprise',
  subtitle: 'Users, work profiles & managed devices',
  icon: 'building',
  lessons: [
    {
      id: 'android-m9-l1',
      title: 'Multi-user internals',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'Android has been multi-user since 4.2 — one device, several humans, each with their own apps, data and settings. The magic is that there’s almost **no magic**: it’s built from two things you already know — **Linux UIDs** and **separate data directories**. `UserManagerService` (started in `startBootstrapServices()`, remember) is the registrar of users.',
        },
        { type: 'widget', widget: 'multi-user' },
        { type: 'h3', text: 'The mechanics, piece by piece' },
        {
          type: 'ul',
          items: [
            '**User 0** is the owner — created at first boot, cannot be removed. Every additional human gets the next **userId** (10, 11…).',
            '**The UID formula**: `uid = userId × 100000 + appId`. The same app (appId 10057) runs as uid **10057** for the owner but **1010057** for user 10 — so the kernel treats them as *completely different identities*. The whole sandbox story from Phase 1 works per-user for free.',
            '**Data**: each user gets `/data/user/<id>/<package>/` (with the CE/DE encryption split per user — each user’s CE keys unlock with *their* credential). **APK code is stored once** and shared; only data and identity multiply.',
            '**Running vs existing**: switching users doesn’t delete anything — the old user’s processes are stopped, the new user’s started. `am switch-user 10`, `pm list users` to poke at it.',
            '**Profiles** are users with a twist: a **profile** (like the work profile, typically userId 10) is *attached to a parent user* — it runs alongside the owner (both active at once), shares the screen, but keeps its own apps, data and badge.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why the badge on work apps?',
          text: 'The launcher shows one icon per profile that has the app. The briefcase badge just means “this launch opens the copy running as the profile’s uid, over the profile’s encrypted data.” Same APK, different world.',
        },
      ],
    },
    {
      id: 'android-m9-l2',
      title: 'Enterprise management in depth',
      minutes: 10,
      blocks: [
        {
          type: 'p',
          text: 'Companies need control over devices that touch company data. Android’s answer is a special app role: a **DPC (Device Policy Controller)** — an admin app (like Intune or Workspace ONE) that the system grants management powers through **DevicePolicyManager**. *Where* that admin sits defines the three deployment modes:',
        },
        {
          type: 'keyterms',
          title: 'The three modes — side-notes',
          terms: [
            { term: 'Work profile (BYOD)', def: 'Personal device, company gets a *profile*. The DPC is **Profile Owner (PO)** — it rules inside the profile (its apps, its data, its VPN) and is blind to the personal side. Employee quits → profile wiped, personal life untouched.' },
            { term: 'Fully managed (COBO)', def: 'Company-owned, work-only. The DPC is **Device Owner (DO)** — set during first-boot provisioning (QR code / zero-touch), with device-wide power: lock, wipe, force policies, control updates.' },
            { term: 'COPE', def: '**Company-Owned, Personally Enabled** — company device, but the human may live on it too. Modern form (Android 11+): a work profile on a company-owned device — the org manages the *profile* fully but gets only limited device-wide controls, so personal usage stays private.' },
          ],
        },
        { type: 'h3', text: 'What a DPC can actually do' },
        {
          type: 'ul',
          items: [
            'Enforce **passcode rules**, require encryption state, lock or **wipe** (device if DO, profile if PO).',
            '**Install/pin apps** silently inside its scope, block installs from unknown sources, push managed app configs.',
            'Set **network & VPN** policy (always-on VPN for work apps), disable screenshots/clipboard *across the work↔personal boundary*.',
            'Everything flows through `DevicePolicyManager` → `DevicePolicyManagerService` in system_server — ordinary Binder calls, gated on the caller actually holding the PO/DO role. No parallel secret system.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The modern add-on: on-device AI',
          text: 'Recent Android (14+) ships **AICore** — a system service running a small on-device model (Gemini Nano) for things like summarisation and smart replies. The enterprise angle you can mention in interviews: *on-device* inference means the text being summarised never leaves the phone — a privacy property admins care about.',
        },
      ],
    },
    {
      id: 'android-m9-l3',
      title: 'Additional information — the interview angle',
      minutes: 5,
      blocks: [
        {
          type: 'keyterms',
          title: '✱ Rapid fire',
          terms: [
            { term: 'Can work & personal apps see each other?', def: 'No — different uids, different data dirs, and intent resolution is filtered at the profile boundary (the chooser’s “work” tab is the controlled gate).' },
            { term: 'One APK, two users — RAM?', def: 'Code pages are shared (same APK, and both forked from Zygote); only per-user data and heap differ.' },
            { term: 'Who’s user 999?', def: 'Some OEMs implement “dual apps / app clone” as a special profile around id 999 — same mechanism, consumer packaging.' },
            { term: 'Headless system user', def: 'On some devices (cars, shared tablets) user 0 only runs system stuff and every human is a secondary user — called headless-system-user mode.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“Multi-user is Linux identity arithmetic: uid = userId × 100000 + appId, so the same app under another user is a different kernel identity with its own /data/user/<id> directory and its own CE encryption keys — UserManagerService just does the bookkeeping. A work profile is a profile user attached to the owner, running simultaneously. Enterprise control is a role, not a subsystem: a DPC app acts as Profile Owner inside a work profile on BYOD, as Device Owner on fully managed devices, and COPE puts a managed work profile on a company-owned device so the organisation rules the profile while personal use stays private — all enforced through DevicePolicyManagerService over Binder.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m9-q1',
      type: 'single',
      prompt: 'App with appId 10057 runs under user 10. Its uid is…',
      options: ['10057', '1010057', '100057', '10'],
      correct: [1],
      explanation: 'uid = userId × 100000 + appId = 10 × 100000 + 10057 = 1010057 — a different kernel identity than the owner’s copy.',
    },
    {
      id: 'android-m9-q2',
      type: 'single',
      prompt: 'Installing an app for a second user stores the APK…',
      options: [
        'A second time in that user’s folder',
        'Nowhere new — code is shared; only the per-user data directory is created',
        'In the cloud',
        'In /vendor',
      ],
      correct: [1],
      explanation: 'One copy of the code serves all users; data (and encryption keys) are per-user.',
    },
    {
      id: 'android-m9-q3',
      type: 'single',
      prompt: 'A work profile differs from a full secondary user because it…',
      options: [
        'Has no data directory',
        'Runs attached to (and simultaneously with) its parent user — sharing the screen, with badged apps',
        'Cannot run apps',
        'Uses a different kernel',
      ],
      correct: [1],
      explanation: 'Profiles are users linked to a parent — both active at once; switching isn’t needed.',
    },
    {
      id: 'android-m9-q4',
      type: 'single',
      prompt: 'On a BYOD work profile, the company’s DPC acts as…',
      options: [
        'Device Owner with full device power',
        'Profile Owner — authority inside the profile, blind to the personal side',
        'A launcher',
        'root',
      ],
      correct: [1],
      explanation: 'PO scope ends at the profile boundary: wipe the profile, never the person’s phone.',
    },
    {
      id: 'android-m9-q5',
      type: 'single',
      prompt: 'COPE means…',
      options: [
        'Company-owned, work-only lockdown',
        'Company-owned device with a managed work profile — personal use allowed and kept private',
        'A kernel security mode',
        'Copy-paste blocking',
      ],
      correct: [1],
      explanation: 'Company-Owned, Personally Enabled: full control inside the work profile, limited device-wide reach, personal privacy preserved.',
    },
    {
      id: 'android-m9-q6',
      type: 'single',
      prompt: 'A Device Owner is normally established…',
      options: [
        'Anytime from the Play Store',
        'During first-boot provisioning (QR / zero-touch) on an unprovisioned device',
        'By rooting',
        'By the carrier',
      ],
      correct: [1],
      explanation: 'DO must be set before a device has accounts/users on it — that’s what enrollment provisioning is.',
    },
    {
      id: 'android-m9-q7',
      type: 'single',
      prompt: 'Each user’s private data stays unreadable before THEY unlock because…',
      options: [
        'Apps check a flag',
        'Per-user CE encryption keys are released only by that user’s credential',
        'The launcher hides it',
        'SELinux blocks everything',
      ],
      correct: [1],
      explanation: 'File-based encryption is per-user: your PIN unseals your CE storage, not your roommate’s.',
    },
  ],
  resources: [
    { label: 'AOSP — Multi-user overview', url: 'https://source.android.com/docs/devices/admin/multi-user', kind: 'docs', free: true },
    { label: 'Android Enterprise — deployment modes', url: 'https://developers.google.com/android/work/overview', kind: 'docs', free: true },
  ],
};
