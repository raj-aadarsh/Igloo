import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'android-m3',
  slug: 'components-lifecycles',
  order: 3,
  title: 'The 4 Core Components',
  subtitle: 'Activity, Service, Receiver, Provider — and their lifecycles',
  icon: 'boxes',
  lessons: [
    {
      id: 'android-m3-l1',
      title: 'The four building blocks on one page',
      minutes: 6,
      blocks: [
        {
          type: 'p',
          text: 'Every Android app is assembled from just **four kinds of components**. The twist that makes them special: **you never create them yourself** — no `new MainActivity()` anywhere. You *declare* them in `AndroidManifest.xml`, PMS reads that manifest at install time, and later **the system instantiates them and calls their lifecycle methods** when they’re needed. The framework owns their lives; you just fill in the callbacks.',
        },
        {
          type: 'keyterms',
          title: 'The 4 components — side-notes',
          terms: [
            { term: 'Activity', def: '**One screen** with UI. Entry point for user interaction. Lives on a back stack; the system destroys & recreates it freely.' },
            { term: 'Service', def: '**Work without a screen** — music playback, a download. No UI, but (surprise) it still runs on the **main thread** by default.' },
            { term: 'BroadcastReceiver', def: '**A doorbell** — reacts to announcements (battery low, boot completed, network changed). Short-lived: ring, answer, done.' },
            { term: 'ContentProvider', def: '**A data counter** — the only standard way one app safely shares structured data with another (contacts, media, photos).' },
          ],
        },
        {
          type: 'analogy',
          text: 'a restaurant: Activities are the dining tables (where customers sit — UI), Services are the kitchen (work happening out of sight), BroadcastReceivers are the doorbell/phone (reacting to events), and the ContentProvider is the takeaway counter (where outsiders are served data — but only through the counter, never into the kitchen).',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Why components exist at all',
          text: 'Because of process death. Android kills app processes constantly to reclaim memory — so an app can’t be “one long-running program”. Instead it’s a bag of components the system can start **individually**, at any moment, in a fresh process. That’s also why each component must be reachable from the manifest: the system may need to start it when nothing else of your app is alive.',
        },
      ],
    },
    {
      id: 'android-m3-l2',
      title: 'Activity lifecycle in depth',
      minutes: 12,
      blocks: [
        {
          type: 'p',
          text: 'The lifecycle is just the system telling your activity its current situation. There are only **three stable states** — everything else is a transition: **Resumed** (visible + focused), **Paused** (visible but not focused — something partially covers you), **Stopped** (fully hidden). Drive it yourself:',
        },
        { type: 'widget', widget: 'activity-lifecycle' },
        { type: 'h3', text: 'a) The paired structure — the easiest way to memorise it' },
        {
          type: 'p',
          text: 'The callbacks come in **three nested pairs**: `onCreate`/`onDestroy` (whole life), `onStart`/`onStop` (visible period), `onResume`/`onPause` (focused period). Going *down* a pair means losing something; coming *up* means getting it back. `onRestart()` is the odd one out — it only runs when returning from Stopped.',
        },
        { type: 'h3', text: 'b) Rotation — the famous one' },
        {
          type: 'p',
          text: 'Rotating the screen is a **configuration change** — the layout may be completely different in landscape, so Android takes the simple route: it **destroys the activity and creates a brand-new instance**. Your in-memory variables die with the old instance. The survival kit is **`onSaveInstanceState(Bundle)`**: the system hands you a Bundle (a parcel of key-value data) before destruction, and the same Bundle comes back in `onCreate(savedInstanceState)` and `onRestoreInstanceState()`. Views with an `android:id` save their own state automatically — that’s why the text in an `EditText` survives rotation but your plain `int counter` doesn’t.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Bundle vs ViewModel (modern follow-up)',
          text: 'The Bundle survives even **process death**, but it must stay small (it travels through Binder — remember the ~1 MB transaction limit). A `ViewModel` survives *configuration changes* only, but can hold big objects. Real apps use both: ViewModel for the heavy state, Bundle for the tiny “where was I” state.',
        },
        { type: 'h3', text: 'c) Dialog vs translucent activity — the trap pair' },
        {
          type: 'ul',
          items: [
            'A **`Dialog`** triggers **no lifecycle callbacks at all**. It’s just a floating view inside *your own window* — the activity never stops being the focused one. Interviewers bait this constantly.',
            'A **translucent or dialog-themed *activity*** on top of yours → only **`onPause()`**. You lost focus but you’re still visible through it, so no `onStop()`.',
            'A normal full-screen activity on top → **`onPause()` then `onStop()`** — you’re fully hidden.',
          ],
        },
        { type: 'h3', text: 'd) The kill scenario' },
        {
          type: 'p',
          text: 'While your activity sits **Stopped** in the background, the system may kill the whole process for memory — **without calling `onDestroy()`**. No farewell. The saved Bundle (kept safely in `system_server`!) is all that survives, and it’s restored when the user navigates back. This is why “save in `onPause`/`onStop`, never in `onDestroy`” is the rule — `onDestroy` is a promise the system doesn’t always keep.',
        },
      ],
    },
    {
      id: 'android-m3-l3',
      title: 'Launch modes & the back stack',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'Activities live in a **task** — a stack of screens the Back button pops through (the “deck of cards” the user thinks of as one app). A **launch mode** answers one question: *when this activity is started, do we create a new card or reuse an old one?* Play with it:',
        },
        { type: 'widget', widget: 'launch-modes' },
        {
          type: 'keyterms',
          title: 'The 4 modes — side-notes',
          terms: [
            { term: 'standard', def: 'New instance, always. Ten launches = ten copies on the stack. The default.' },
            { term: 'singleTop', def: 'Reuse **only if already on top** → existing instance gets `onNewIntent()`. Classic use: a notification opening a screen you’re already on.' },
            { term: 'singleTask', def: 'At most **one instance in its task**. Re-launching clears everything above it and delivers `onNewIntent()`. Classic use: an app’s home/main screen.' },
            { term: 'singleInstance', def: 'Like singleTask, but the activity lives **completely alone in its own task** — no other activity may join. Rare: incoming-call screen, lock screen.' },
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'onNewIntent() — the companion callback',
          text: 'When an existing instance is reused, there is no onCreate — the system calls `onNewIntent(intent)` instead, and `getIntent()` still returns the OLD intent unless you call `setIntent()`. Forgetting this is a real-world bug factory (screens that ignore the notification that opened them).',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Also worth one line each',
          text: 'The same effects can be requested at call time with intent flags (`FLAG_ACTIVITY_NEW_TASK`, `FLAG_ACTIVITY_CLEAR_TOP`, `FLAG_ACTIVITY_SINGLE_TOP`) — flags win over the manifest. And `taskAffinity` is simply which task an activity *prefers* to live in (by default, all of an app’s activities share one affinity).',
        },
      ],
    },
    {
      id: 'android-m3-l4',
      title: 'Services in depth',
      minutes: 10,
      blocks: [
        {
          type: 'p',
          text: 'A Service is a component that says “I’m doing something that should outlive any single screen.” It has **two independent lifecycles**, depending on how it was reached — and a service can be in both at once.',
        },
        { type: 'h3', text: 'a) Started service — fire and forget' },
        {
          type: 'p',
          text: '`startService(intent)` → **`onCreate()`** (first time only) → **`onStartCommand(intent)`** (every call) → runs until someone calls `stopService()` or it calls **`stopSelf()`** → `onDestroy()`. The caller gets no object back — it’s a one-way “go do this”. Music playback, an upload.',
        },
        {
          type: 'p',
          text: '`onStartCommand()` returns a flag telling the system what to do **if it kills the service** for memory: **`START_STICKY`** — recreate it later with a `null` intent (music player: “come back and figure out what to do”); **`START_NOT_STICKY`** — don’t bother (a sync that will be rescheduled anyway); **`START_REDELIVER_INTENT`** — recreate and hand back the last intent (a download that must finish *this* file).',
        },
        { type: 'h3', text: 'b) Bound service — a client-server phone line' },
        {
          type: 'p',
          text: '`bindService(intent, connection, flags)` → `onCreate()` → **`onBind()`** returns an **IBinder** — a real object the client can call methods on (this is literally Binder IPC if the service is in another process — next topic!). The service lives **as long as at least one client is bound**; when the last one unbinds → `onUnbind()` → `onDestroy()`. If it was *also* started, it must be both stopped **and** unbound before it dies.',
        },
        { type: 'h3', text: 'c) Foreground service — the honest one' },
        {
          type: 'p',
          text: 'Background work got heavily restricted (battery!), so work the user *actively knows about* must be a **foreground service**: call `startForegroundService()`, and the service must call **`startForeground(id, notification)`** within a few seconds — showing a **non-dismissable notification** — or the system raises an ANR/crash. Since Android 14 you must also declare a `foregroundServiceType` (location, media, camera…). This is the “music is playing / navigation is running” notification you see every day.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The misconception that fails interviews',
          text: 'A Service does NOT run on a background thread. It runs on the **main thread** of its process — the same one driving the UI. A service doing heavy work without spawning its own thread will jank the UI and can ANR. “Service = background *purpose*, not background *thread*.”',
        },
      ],
    },
    {
      id: 'android-m3-l5',
      title: 'Receivers, Providers & the interview angle',
      minutes: 10,
      blocks: [
        { type: 'h3', text: 'a) BroadcastReceiver — the doorbell' },
        {
          type: 'ul',
          items: [
            '**Static (manifest-declared)**: the system can wake your app *even if it isn’t running* — this is how apps react to `BOOT_COMPLETED`. Since Android 8, most implicit broadcasts **can’t** be received this way anymore (apps abused it to auto-start; battery died) — only an allow-listed few like boot completed remain.',
            '**Dynamic (code-registered)**: `registerReceiver(...)` — lives only while your component does; unregister in the matching teardown callback or you leak it.',
            '**Normal broadcast**: delivered to everyone at once, unordered. **Ordered broadcast**: delivered one receiver at a time by `android:priority`; each receiver can pass along a modified result or **abort** the chain for those behind it.',
            '`onReceive()` runs on the **main thread** with a hard deadline (~10 s) — do almost nothing in it; hand real work to a service/WorkManager. (`goAsync()` buys a few extra seconds, not a licence for real work.)',
          ],
        },
        { type: 'h3', text: 'b) ContentProvider — the data counter' },
        {
          type: 'p',
          text: 'The standard way to share **structured data across app boundaries**. Everything is addressed by a **URI**: `content://com.android.contacts/contacts/42` — scheme, then **authority** (which provider), then path and id. A client never talks to the provider class directly; it goes through **`ContentResolver`**, which reads the authority, finds the owning app via PMS, and routes the CRUD call (`query / insert / update / delete`) over Binder. Permissions guard the counter — including **per-URI grants** (`FLAG_GRANT_READ_URI_PERMISSION`), which is exactly how a `FileProvider` lets the camera app write one photo into your app without seeing anything else.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The provider trivia interviewers adore',
          text: 'ContentProviders are initialised **before `Application.onCreate()`** during process start — which is why libraries (WorkManager, Firebase) hide their auto-init inside a provider. You learned *why* in the App Process topic: providers are installed during `bindApplication`.',
        },
        { type: 'h3', text: '✱ Additional information — rapid fire' },
        {
          type: 'keyterms',
          terms: [
            { term: 'Who starts components?', def: 'Always the system (AMS), even when the request came from your own app — that’s why everything is declared in the manifest.' },
            { term: 'All 4 on main thread', def: 'Every lifecycle callback of every component runs on the main thread by default. The component type says *what* it’s for, not *where* it runs.' },
            { term: 'Entry points', def: 'An app can be entered through ANY component — a broadcast can start a process with no activity ever shown.' },
            { term: 'exported=', def: 'Whether other apps may reach the component. Since Android 12 you must declare it explicitly for anything with an intent filter.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“Four components, all declared in the manifest and instantiated by the system: Activities are single screens living on a back stack with a create/start/resume lifecycle — the system may destroy and recreate them on rotation or kill the process while stopped, so state rides in onSaveInstanceState. Services do UI-less work — started, bound, or foreground with a mandatory notification — but still on the main thread. BroadcastReceivers react to events, static or dynamic, normal or ordered. ContentProviders expose structured data across apps through content:// URIs via ContentResolver. And every callback of all four runs on the main thread unless I move the work myself.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m3-q1',
      type: 'single',
      prompt: 'The user rotates the screen. What happens to the activity?',
      options: [
        'onPause() only — it keeps running',
        'It is destroyed and a brand-new instance is created, with state passed via onSaveInstanceState’s Bundle',
        'onConfigurationChanged() always handles it silently',
        'Nothing — rotation is handled by WMS alone',
      ],
      correct: [1],
      explanation: 'A configuration change destroys and recreates the activity; the Bundle is the hand-off for small UI state.',
    },
    {
      id: 'android-m3-q2',
      type: 'single',
      prompt: 'A Dialog is shown over your activity. Which callbacks fire?',
      options: ['onPause()', 'onPause() then onStop()', 'None at all', 'onSaveInstanceState()'],
      correct: [2],
      explanation: 'A Dialog lives inside your own window — the activity never loses its resumed state. (A translucent *activity* would cause onPause.)',
    },
    {
      id: 'android-m3-q3',
      type: 'single',
      prompt: 'A translucent activity opens on top of yours. You get…',
      options: ['Nothing', 'onPause() only — still visible, so no onStop()', 'onPause() + onStop()', 'onDestroy()'],
      correct: [1],
      explanation: 'Visible-but-unfocused = Paused. onStop() is reserved for being fully hidden.',
    },
    {
      id: 'android-m3-q4',
      type: 'single',
      prompt: 'Your singleTask activity B is re-launched while C and D sit above it in the task. Result:',
      options: [
        'A second B is pushed on top',
        'C and D are destroyed; the existing B receives onNewIntent()',
        'B moves above C and D',
        'A new task is created for B',
      ],
      correct: [1],
      explanation: 'singleTask clears everything above the existing instance and reuses it via onNewIntent().',
    },
    {
      id: 'android-m3-q5',
      type: 'single',
      prompt: 'Why is singleTop NOT enough to deduplicate a screen reachable from anywhere?',
      options: [
        'It crashes on reuse',
        'It only reuses the instance when it is exactly on top of the stack — anywhere deeper still creates a duplicate',
        'It requires a separate task',
        'It disables the back button',
      ],
      correct: [1],
      explanation: 'singleTop checks only the top card. An instance buried mid-stack gets duplicated — that’s what singleTask prevents.',
    },
    {
      id: 'android-m3-q6',
      type: 'single',
      prompt: 'A Service’s onStartCommand returns START_STICKY. After the system kills the service for memory, it will be…',
      options: [
        'Never restarted',
        'Restarted later with a null intent',
        'Restarted with the original intent redelivered',
        'Converted to a foreground service',
      ],
      correct: [1],
      explanation: 'STICKY = “recreate me, I’ll work out what to do” (null intent). REDELIVER_INTENT is the one that re-sends the last intent.',
    },
    {
      id: 'android-m3-q7',
      type: 'single',
      prompt: 'By default, a Service’s code executes on…',
      options: ['Its own worker thread', 'The Binder thread pool', 'The main thread of the app’s process', 'A kernel thread'],
      correct: [2],
      explanation: 'The classic misconception: Service means “no UI”, not “background thread”. Heavy work still needs your own thread.',
    },
    {
      id: 'android-m3-q8',
      type: 'single',
      prompt: 'A foreground service must, shortly after starting…',
      options: [
        'Acquire a wakelock',
        'Call startForeground() with a visible notification — or the system kills/ANRs it',
        'Register a BroadcastReceiver',
        'Request the FOREGROUND permission at runtime',
      ],
      correct: [1],
      explanation: 'The user must always be able to see that work is running — the non-dismissable notification is mandatory.',
    },
    {
      id: 'android-m3-q9',
      type: 'multi',
      prompt: 'True about BroadcastReceivers: (pick all)',
      options: [
        'A manifest-declared receiver can wake an app that isn’t running',
        'Since Android 8, most implicit broadcasts can’t be received via the manifest',
        'An ordered broadcast can be aborted by a high-priority receiver',
        'onReceive() may freely download files for a minute',
      ],
      correct: [0, 1, 2],
      explanation: 'Static receivers wake apps (now only for allow-listed broadcasts); ordered broadcasts flow by priority and can be aborted; onReceive has a ~10 s deadline on the main thread.',
    },
    {
      id: 'android-m3-q10',
      type: 'single',
      prompt: 'In content://com.android.contacts/contacts/42, the part “com.android.contacts” is the…',
      options: ['Path', 'Authority — it tells ContentResolver which provider owns this data', 'MIME type', 'Permission'],
      correct: [1],
      explanation: 'scheme://authority/path/id — the authority is the provider’s address; the resolver routes by it.',
    },
  ],
  resources: [
    { label: 'Android docs — Activity lifecycle', url: 'https://developer.android.com/guide/components/activities/activity-lifecycle', kind: 'docs', free: true },
    { label: 'Android docs — Tasks & back stack', url: 'https://developer.android.com/guide/components/activities/tasks-and-back-stack', kind: 'docs', free: true },
    { label: 'Android docs — Services', url: 'https://developer.android.com/develop/background-work/services', kind: 'docs', free: true },
  ],
};
