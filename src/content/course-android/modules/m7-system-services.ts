import type { Module } from '@/content/types';

export const m7: Module = {
  id: 'android-m7',
  slug: 'core-system-services',
  order: 7,
  title: 'Core System Services',
  subtitle: 'Inside AMS, WMS, PMS & Vold — the big four',
  icon: 'server',
  lessons: [
    {
      id: 'android-m7-l1',
      title: 'system_server, revisited',
      minutes: 6,
      blocks: [
        {
          type: 'p',
          text: 'Phase 1 treated `system_server` as one box. Phase 2 opens it. Inside live ~90 services, but **four of them run the show** — and framework interviews revolve around what each one *owns*:',
        },
        {
          type: 'keyterms',
          title: 'The big four — side-notes',
          terms: [
            { term: 'AMS', def: '**ActivityManagerService** — owns *processes and components*: who is running, how important they are, who gets killed, where broadcasts and services go. (Activity/task details split into ATMS on Android 10+.)' },
            { term: 'WMS', def: '**WindowManagerService** — owns *windows*: what’s on screen, in what order, who has focus, how transitions animate.' },
            { term: 'PMS', def: '**PackageManagerService** — owns *the apps themselves*: what’s installed, their components, signatures, permissions. The manifest database of the device.' },
            { term: 'Vold + StorageManagerService', def: '**Volume daemon** — owns *storage*: mounting volumes, SD cards, and file-based encryption. Vold is native (started by init); StorageManagerService is its Java-side partner.' },
          ],
        },
        {
          type: 'analogy',
          text: 'a city hall: AMS is the mayor’s office (decides who operates and who gets evicted), WMS is town planning (who builds where, who’s visible from the street), PMS is the registrar (the records of every business), and Vold is public works (water, storage, the vaults).',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'How they cooperate — one tap, all four',
          text: 'Tap an icon: **PMS** resolves which activity handles the intent → **AMS** decides the process (fork via Zygote?) and drives the lifecycle → **WMS** gives the activity a window and runs the opening animation → and the app’s data sits on storage **Vold** mounted and decrypted at boot. Every topic so far was secretly about these four.',
        },
      ],
    },
    {
      id: 'android-m7-l2',
      title: 'AMS in depth — the process referee',
      minutes: 11,
      blocks: [
        {
          type: 'p',
          text: 'AMS’s hardest job isn’t starting things — it’s deciding **who dies** when memory runs out. Android *never* wants free RAM (a cached app resumes instantly), so instead of avoiding kills, it makes killing **orderly**: every process gets an importance score, recomputed constantly as apps move between foreground, visible, service and cached states.',
        },
        { type: 'widget', widget: 'oom-ladder' },
        { type: 'h3', text: 'a) How the ladder works' },
        {
          type: 'ul',
          items: [
            'AMS tracks every process in a `ProcessRecord` and recomputes its **`oom_score_adj`** (−1000 … 1000) on every state change — the routine is literally called `updateOomAdj`.',
            'The killing itself is done by **`lmkd`** (the low-memory killer daemon from the boot topic): it watches kernel **memory-pressure signals (PSI)** and, when things get tight, kills the highest-score processes first.',
            'Persistent system processes sit near −800/−900; the focused app at 0; cached apps at 900+. That’s why your backgrounded game is gone after an hour but the status bar never is.',
            'This also explains a classic user complaint: “Android killed my app!” — it didn’t crash; it was **cached and evicted**, exactly as designed. The activity topic’s saved-state Bundle is the recovery plan.',
          ],
        },
        { type: 'h3', text: 'b) What else AMS owns' },
        {
          type: 'ul',
          items: [
            '**Component plumbing**: every `startActivity`, `startService`, `sendBroadcast` and provider connection passes through AMS — it’s the hub all four component types hang off.',
            '**Tasks & recents** (via its Android-10+ split-off **ActivityTaskManagerService**): the back stacks from the launch-modes topic are AMS/ATMS data structures (`Task`, `ActivityRecord`).',
            '**ANR verdicts**: the input-dispatch, broadcast and service timeouts you learned are enforced *here* — AMS collects the thread dumps and shows the dialog.',
            '**Death bookkeeping**: AMS holds a Binder `DeathRecipient` on every app process — the instant one dies, the kernel tells AMS and its records are cleaned (Binder topic, full circle).',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'See the ladder live',
          text: '`adb shell dumpsys activity processes | grep -E "oom|adj"` shows real processes with their current adj values — watch a foreground app’s score jump the moment you press Home.',
        },
      ],
    },
    {
      id: 'android-m7-l3',
      title: 'WMS in depth — windows & pixels',
      minutes: 10,
      blocks: [
        { type: 'h3', text: 'a) What a “window” actually is' },
        {
          type: 'p',
          text: 'Every activity, dialog, toast and the status bar itself is a **window** — and behind every window is a **Surface**: a buffer of pixels the app draws into (via the GPU). WMS is the registrar of windows: it decides each one’s **position, size, layer (z-order)** and visibility, hands out the Surfaces, and runs the animations when windows appear, move or vanish.',
        },
        { type: 'h3', text: 'b) The division of labour nobody states clearly' },
        {
          type: 'keyterms',
          terms: [
            { term: 'Your app', def: '**Draws the pixels** — ViewRootImpl runs measure → layout → draw into its Surface. WMS never draws your content.' },
            { term: 'WMS', def: '**Decides arrangement** — which windows exist, their order and bounds, who has focus. Bookkeeping + policy, in Java.' },
            { term: 'SurfaceFlinger', def: '**Combines the layers** — takes every window’s latest buffer each VSYNC and composites the final screen image (offloading what it can to dedicated display hardware). Native, started by init — remember?' },
          ],
        },
        {
          type: 'analogy',
          text: 'a theatre: each actor (app) performs inside their own spotlight area (Surface), the stage manager (WMS) decides who stands where and in front of whom, and the lighting desk (SurfaceFlinger) blends all the spotlights into the single picture the audience sees — 60+ times a second.',
        },
        { type: 'h3', text: 'c) Focus — WMS’s quiet superpower' },
        {
          type: 'p',
          text: 'Exactly **one window has input focus** at any moment, and WMS decides which. The input-pipeline topic showed InputDispatcher asking “who gets this key press?” — WMS is where that answer comes from. The translucent-activity `onPause()` behaviour from the lifecycle topic? That’s WMS reporting “you’re visible but no longer the focused window.” Three topics, one mechanism.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'See it live',
          text: '`adb shell dumpsys window windows | grep -E "Window #|mCurrentFocus"` lists every window bottom-to-top with the current focus — run it with a dialog open and watch the extra window appear above your activity.',
        },
      ],
    },
    {
      id: 'android-m7-l4',
      title: 'PMS, Vold & the interview angle',
      minutes: 10,
      blocks: [
        { type: 'h3', text: 'a) PMS — the device’s app registrar' },
        {
          type: 'p',
          text: 'At boot, PMS walks the app directories and parses every APK’s `AndroidManifest.xml` (a big slice of boot time — remember it starting in `startBootstrapServices()`). The result is **one record per app**, and that record answers nearly every question the system ever asks about an app. Explore a real one:',
        },
        { type: 'widget', widget: 'package-record' },
        { type: 'h3', text: 'b) Vold — storage & encryption' },
        {
          type: 'ul',
          items: [
            '**Vold** (volume daemon) is a *native* service started by init — it mounts/unmounts volumes (internal storage, SD cards, USB drives) and reacts to media being inserted or ejected. The Java world talks to it through **StorageManagerService**.',
            '**FBE — File-Based Encryption**: modern Android encrypts per-file with two key classes: **DE (Device Encrypted)** storage, available from boot — and **CE (Credential Encrypted)** storage, unlockable only after the user’s PIN/password. Recognise it? This is *exactly* why **FallbackHome** exists in the boot story: CE data (including the launcher’s) is still sealed until unlock.',
            '**Scoped/emulated storage**: the “shared storage” apps see is a managed view (FUSE) so the system can enforce per-app visibility — the days of every app reading the whole SD card are gone.',
          ],
        },
        {
          type: 'keyterms',
          title: '✱ Rapid fire',
          terms: [
            { term: 'Who shows the ANR dialog?', def: 'AMS — it owns the timeouts and the thread-dump collection.' },
            { term: 'Who animates app-open?', def: 'WMS runs window transitions; SurfaceFlinger composites the frames.' },
            { term: 'Who answers resolveActivity?', def: 'PMS, from its manifest database.' },
            { term: 'Why is my alarm app’s data gone before unlock?', def: 'It lives in CE storage; use DE (`createDeviceProtectedStorageContext`) + `directBootAware` to run before unlock.' },
            { term: 'Watchdog watches whom?', def: 'system_server’s own core threads & locks — including AMS’s and WMS’s. Stuck ~60 s → kill → soft reboot (next topic reads that log).' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“The four pillars inside system_server: AMS owns processes and components — it scores every process with oom_score_adj and lmkd kills from the bottom under memory pressure; its ATMS half owns tasks and back stacks, and it enforces ANR timeouts. WMS owns windows: z-order, bounds, transitions and input focus, with apps drawing their own Surfaces and SurfaceFlinger compositing them each VSYNC. PMS is the package database — it scans every manifest at boot, persists to packages.xml, assigns UIDs, verifies signatures and answers all intent resolution. And Vold, a native daemon under StorageManagerService, mounts volumes and manages file-based encryption — whose CE/DE split is the reason FallbackHome exists at boot.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m7-q1',
      type: 'single',
      prompt: 'Which pair actually performs a low-memory kill?',
      options: [
        'WMS computes scores, AMS kills',
        'AMS computes oom_score_adj, lmkd kills based on memory pressure',
        'The kernel computes scores, PMS kills',
        'SurfaceFlinger kills idle apps',
      ],
      correct: [1],
      explanation: 'AMS ranks (updateOomAdj); lmkd watches kernel pressure signals and kills from the highest score down.',
    },
    {
      id: 'android-m7-q2',
      type: 'single',
      prompt: 'Your backgrounded app vanished after an hour without crashing. Most likely…',
      options: [
        'A bug in the app',
        'It was a cached process (adj 900+) evicted by lmkd — by design',
        'Watchdog killed it',
        'PMS uninstalled it',
      ],
      correct: [1],
      explanation: 'Cached apps are the first to go under memory pressure. The saved-state Bundle is how it comes back looking untouched.',
    },
    {
      id: 'android-m7-q3',
      type: 'single',
      prompt: 'Who draws an activity’s pixels, and who combines all windows into the final screen?',
      options: [
        'WMS draws; AMS combines',
        'The app draws into its Surface; SurfaceFlinger composites every VSYNC',
        'SurfaceFlinger draws; WMS composites',
        'The kernel does both',
      ],
      correct: [1],
      explanation: 'Apps render their own Surfaces; WMS arranges; SurfaceFlinger blends the layers into the frame you see.',
    },
    {
      id: 'android-m7-q4',
      type: 'single',
      prompt: 'InputDispatcher knows which window should receive a key press because…',
      options: [
        'It guesses from coordinates',
        'WMS tells it which window currently holds input focus',
        'PMS resolves it from the manifest',
        'The app registers for keys',
      ],
      correct: [1],
      explanation: 'Focus is WMS’s decision; the dispatcher consumes it. (Touches go to the window under the finger instead.)',
    },
    {
      id: 'android-m7-q5',
      type: 'single',
      prompt: 'PMS knows every component and intent filter of every app before any app runs because…',
      options: [
        'Apps register at first launch',
        'It parsed every APK’s AndroidManifest.xml during its boot scan and persists the result',
        'Zygote preloads them',
        'The Play Store uploads them',
      ],
      correct: [1],
      explanation: 'The boot-time manifest scan builds the device-wide component database (persisted in packages.xml) that powers all resolution.',
    },
    {
      id: 'android-m7-q6',
      type: 'single',
      prompt: 'CE vs DE storage: the difference is…',
      options: [
        'CE is cloud-backed',
        'CE unlocks only with the user’s credential; DE is available from boot — which is why FallbackHome exists',
        'DE is deprecated',
        'CE is for system apps only',
      ],
      correct: [1],
      explanation: 'File-based encryption splits data into credential-encrypted and device-encrypted classes; pre-unlock code must be directBootAware and use DE.',
    },
    {
      id: 'android-m7-q7',
      type: 'single',
      prompt: 'Vold is best described as…',
      options: [
        'A Java system service in system_server',
        'A native daemon (started by init) managing volumes & encryption, fronted by StorageManagerService',
        'A kernel module',
        'Part of SurfaceFlinger',
      ],
      correct: [1],
      explanation: 'Vold lives in the native layer; the framework reaches it through its Java-side partner service.',
    },
    {
      id: 'android-m7-q8',
      type: 'multi',
      prompt: 'Which belong to AMS/ATMS territory? (pick all)',
      options: [
        'The back stacks behind launch modes',
        'ANR timeout enforcement',
        'Compositing window layers each VSYNC',
        'DeathRecipient-based cleanup of dead app processes',
      ],
      correct: [0, 1, 3],
      explanation: 'Tasks, ANRs and process-death bookkeeping are AMS/ATMS. Compositing is SurfaceFlinger’s job.',
    },
  ],
  resources: [
    { label: 'AOSP — Low-memory killer daemon', url: 'https://source.android.com/docs/core/perf/lmkd', kind: 'docs', free: true },
    { label: 'AOSP — SurfaceFlinger & WindowManager', url: 'https://source.android.com/docs/core/graphics/surfaceflinger-windowmanager', kind: 'docs', free: true },
    { label: 'AOSP — File-based encryption', url: 'https://source.android.com/docs/security/features/encryption/file-based', kind: 'docs', free: true },
  ],
};
