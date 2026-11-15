import type { Module } from '@/content/types';

export const m2: Module = {
  id: 'android-m2',
  slug: 'app-process-main-thread',
  order: 2,
  title: 'App Process & the Main Thread',
  subtitle: 'Tap → fork → first frame, and the loop the app lives in',
  icon: 'repeat',
  lessons: [
    {
      id: 'android-m2-l1',
      title: 'From tap to first frame',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'The boot story ended with the launcher on screen. The natural next question — and the next interview favourite — is: **what exactly happens when you tap an icon?** The answer stitches together three processes you now know: the launcher, `system_server` and Zygote.',
        },
        { type: 'widget', widget: 'android-app-process' },
        {
          type: 'keyterms',
          title: 'Side-notes to remember',
          terms: [
            { term: '3 processes involved', def: 'Launcher (asks) → system_server/AMS (decides) → Zygote (forks the new app).' },
            { term: 'The app’s real main()', def: '`ActivityThread.main()` — it prepares the main Looper and never returns.' },
            { term: 'Warm vs cold start', def: 'If the process already exists, AMS skips Zygote entirely — that’s the whole difference.' },
            { term: 'Providers trap', def: 'ContentProviders initialise **before** `Application.onCreate()`.' },
          ],
        },
      ],
    },
    {
      id: 'android-m2-l2',
      title: 'The launch path in depth',
      minutes: 10,
      blocks: [
        { type: 'h3', text: 'a) Launcher → AMS: “please start this” ' },
        {
          type: 'p',
          text: 'The launcher is an ordinary app — it cannot create processes. It calls **`startActivity()`** with the target’s `MAIN/LAUNCHER` intent, and the call crosses into `system_server` over **Binder**. There, **AMS** (on Android 10+ the activity half lives in **ActivityTaskManagerService**) resolves the intent with PMS, checks permissions, and **pauses the launcher’s activity** (`onPause()` runs *before* your app appears — a classic ordering question).',
        },
        { type: 'h3', text: 'b) AMS → Zygote: “I need a process”' },
        {
          type: 'p',
          text: 'If the app has no process yet, AMS requests one via `Process.start(...)`, which writes arguments (UID, GID, SELinux context, nice name…) to Zygote’s UNIX socket **`/dev/socket/zygote`**. Zygote calls **`fork()`** — the child shares the preloaded classes, resources and the warmed-up ART VM through **Copy-on-Write**. No DEX loading, no VM boot: that’s why a cold start takes hundreds of milliseconds, not seconds.',
        },
        { type: 'h3', text: 'c) The child becomes an app: ActivityThread.main()' },
        {
          type: 'ol',
          items: [
            '`Looper.prepareMainLooper()` — creates the **main thread’s** Looper; the thread is literally named `main`.',
            '`ActivityThread.attach()` — hands AMS an **`IApplicationThread`** Binder, the system’s remote control *into* the app.',
            '`Looper.loop()` — enters the infinite message loop. **The app never leaves this loop**; everything it ever does is a message dispatched inside it.',
          ],
        },
        { type: 'h3', text: 'd) bindApplication → Application.onCreate()' },
        {
          type: 'p',
          text: 'AMS calls back with **`bindApplication`**: the process loads the APK info, creates the **`Application`** object, initialises **ContentProviders** (yes — *before* `Application.onCreate()`), then runs `onCreate()`. Heavy work here delays every single launch of your app, which is why lazy init libraries exist.',
        },
        { type: 'h3', text: 'e) ClientTransaction → the activity lifecycle' },
        {
          type: 'p',
          text: 'AMS schedules the launch as a **`ClientTransaction`** message onto the main thread. `ActivityThread` instantiates your activity and drives **`onCreate()` → `onStart()` → `onResume()`**. `setContentView()` inflates the view tree.',
        },
        { type: 'h3', text: 'f) The first frame' },
        {
          type: 'p',
          text: 'After `onResume()`, **ViewRootImpl** performs the first traversal — **measure → layout → draw** — scheduled by the **Choreographer** on the next **VSYNC** pulse. The rendered surface goes to **SurfaceFlinger**, which composites it to the display. Launch complete; `reportFullyDrawn()` is how apps tell the system (and Play metrics) they’re truly ready.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer (45 seconds)',
          text: '“The launcher calls startActivity, which Binder-calls into AMS in system_server. AMS resolves the intent, pauses the caller, and — if the app isn’t running — sends a fork command over Zygote’s socket. Zygote forks; copy-on-write gives the child the preloaded framework for free. The child runs ActivityThread.main(), prepares the main Looper, attaches back to AMS, gets bindApplication (Application.onCreate, with providers first), then a ClientTransaction drives onCreate/onStart/onResume, and ViewRootImpl + Choreographer render the first frame on VSYNC.”',
        },
      ],
    },
    {
      id: 'android-m2-l3',
      title: 'Handler, Looper & MessageQueue in depth',
      minutes: 12,
      blocks: [
        {
          type: 'p',
          text: 'Why is all of Android single-threaded at heart? Because the UI toolkit is **not thread-safe** — locking every view for multi-threaded access would be slow and deadlock-prone. Instead, Android gives each thread that wants one a **message loop**, and makes *one* loop special: the main thread’s. These three classes are the machinery:',
        },
        { type: 'widget', widget: 'handler-looper' },
        { type: 'h3', text: 'The three roles' },
        {
          type: 'keyterms',
          terms: [
            { term: 'MessageQueue', def: 'A time-ordered linked list of `Message` objects. “Delayed” just means a later timestamp (`SystemClock.uptimeMillis()`-based).' },
            { term: 'Looper', def: 'One per thread (stored in a `ThreadLocal`). `prepare()` creates it, `loop()` runs the infinite dispatch: `msg = queue.next(); msg.target.dispatchMessage(msg)`.' },
            { term: 'Handler', def: 'The *door* into a queue. It’s bound to the Looper of the thread that created it (or one you pass in) — whoever holds the Handler can post work onto that thread.' },
          ],
        },
        { type: 'h3', text: 'The part seniors get asked: why doesn’t the loop burn CPU?' },
        {
          type: 'p',
          text: '`queue.next()` doesn’t spin. When the queue is empty (or the head message isn’t due yet), it calls **`nativePollOnce()`**, which parks the thread in the kernel on **epoll** until a new message arrives (written through an eventfd) or the timeout for the next delayed message expires. An idle main thread costs **zero CPU** — it’s asleep in the kernel, exactly like any well-behaved event loop.',
        },
        { type: 'h3', text: 'Rules that prevent real bugs' },
        {
          type: 'ul',
          items: [
            '**Only the UI thread may touch views.** Violate it and you get `CalledFromWrongThreadException` — the check lives in `ViewRootImpl.checkThread()`.',
            'A `Handler` created on a plain background thread throws — **no Looper there**. Either call `Looper.prepare()`/`loop()` yourself or use **`HandlerThread`**, which does it for you.',
            '`view.post(...)` and `runOnUiThread(...)` are just conveniences that post to the main Handler.',
            '**The classic leak**: a non-static inner Handler holds its Activity; a delayed message keeps the Handler alive; the Handler keeps the destroyed Activity alive. Fix: static class + `WeakReference`, and `removeCallbacksAndMessages(null)` in `onDestroy()`.',
            '`postDelayed(r, 1000)` promises “**not before** 1 s” — never “exactly at 1 s”. If a long message is running, yours waits its turn.',
          ],
        },
        {
          type: 'analogy',
          text: 'a single teller at a bank counter. Customers (messages) queue up; the teller (Looper) serves exactly one at a time; Handlers are the doors through which new customers enter the queue. If one customer takes five minutes (a blocked main thread), everyone behind — including the “touch event” customer — just waits. That queue backing up is an ANR.',
        },
      ],
    },
    {
      id: 'android-m2-l4',
      title: 'Additional information — ANRs & the interview angle',
      minutes: 6,
      blocks: [
        {
          type: 'p',
          text: 'Everything above collapses into one practical consequence: **block the main thread and the queue backs up**. The system watches for that:',
        },
        {
          type: 'keyterms',
          title: 'ANR timeouts to quote',
          terms: [
            { term: 'Input event', def: 'No response within **5 s** → “Application Not Responding” dialog.' },
            { term: 'Broadcast receiver', def: '`onReceive()` must finish in **10 s** (foreground broadcasts).' },
            { term: 'Service', def: 'Lifecycle methods get **20 s** (foreground) before an ANR.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“Each thread can own one Looper with one MessageQueue; Handlers post messages into a chosen Looper’s queue. The main thread’s Looper is created in ActivityThread.main(), and all lifecycle callbacks, input events and drawing are just messages on that queue, dispatched one at a time. The queue blocks on epoll via nativePollOnce when idle, so it costs nothing. If I occupy the main thread longer than the system’s deadlines — 5 seconds for input — pending input can’t dispatch and I get an ANR. So: heavy work goes to background threads, results come back by posting to the main Handler.”',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Follow-ups they love',
          text: '“Can two Handlers share one Looper?” — yes, any number; each message knows its own `target`. · “Can a background thread have a Looper?” — yes, that’s HandlerThread. · “Is Looper.loop() an infinite loop — isn’t that bad?” — no: blocked-on-epoll, not spinning; that *is* the app.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m2-q1',
      type: 'single',
      prompt: 'Tapping an icon for an app that isn’t running involves, in order…',
      options: [
        'Launcher forks the app directly',
        'Launcher → AMS over Binder → fork command over Zygote’s socket → child runs ActivityThread.main()',
        'Zygote → AMS → Launcher → ActivityThread',
        'AMS forks the app itself',
      ],
      correct: [1],
      explanation: 'Only the system can request processes, and only Zygote creates Java ones — AMS relays the launch over the zygote socket.',
    },
    {
      id: 'android-m2-q2',
      type: 'single',
      prompt: 'The entry point of every Android app process is…',
      options: ['Application.onCreate()', 'MainActivity.onCreate()', 'ActivityThread.main()', 'Zygote.main()'],
      correct: [2],
      explanation: 'ActivityThread.main() prepares the main Looper, attaches to AMS and enters Looper.loop() — the app lives inside that loop.',
    },
    {
      id: 'android-m2-q3',
      type: 'single',
      prompt: 'Which runs FIRST in a new app process?',
      options: ['Application.onCreate()', 'ContentProvider initialisation', 'Activity.onCreate()', 'onResume()'],
      correct: [1],
      explanation: 'Providers are installed during bindApplication, before Application.onCreate() — the classic ordering trap.',
    },
    {
      id: 'android-m2-q4',
      type: 'single',
      prompt: 'Why doesn’t the main thread’s infinite Looper.loop() burn CPU when idle?',
      options: [
        'It calls Thread.sleep(16) each frame',
        'queue.next() parks the thread on epoll via nativePollOnce() until a message arrives or a delay expires',
        'ART throttles it',
        'It actually does burn CPU',
      ],
      correct: [1],
      explanation: 'The queue blocks in the kernel — a classic event loop. New messages wake it via an eventfd write.',
    },
    {
      id: 'android-m2-q5',
      type: 'single',
      prompt: 'Creating a new Handler() on a plain background thread throws because…',
      options: [
        'Handlers are main-thread-only',
        'That thread has no Looper — nothing to bind to',
        'Binder forbids it',
        'The thread lacks a Window',
      ],
      correct: [1],
      explanation: 'A Handler must bind to some thread’s Looper. Background threads don’t have one unless you prepare() it — or use HandlerThread.',
    },
    {
      id: 'android-m2-q6',
      type: 'single',
      prompt: 'postDelayed(r, 1000) guarantees…',
      options: [
        'r runs at exactly t+1000 ms',
        'r runs no earlier than 1000 ms — later if the queue is busy',
        'r runs on a background thread',
        'r preempts the current message',
      ],
      correct: [1],
      explanation: 'Delayed messages are just timestamps in the queue; dispatch is still one-at-a-time, so a busy thread delays them further.',
    },
    {
      id: 'android-m2-q7',
      type: 'single',
      prompt: 'An input event sits undispatched for over 5 seconds because onCreate() is doing disk I/O. The result:',
      options: ['A dropped frame', 'An ANR dialog', 'A CalledFromWrongThreadException', 'A kernel panic'],
      correct: [1],
      explanation: 'Input dispatch timeout — the definition of an ANR. Heavy work belongs off the main thread.',
    },
    {
      id: 'android-m2-q8',
      type: 'single',
      prompt: 'The classic Handler memory leak happens when…',
      options: [
        'A static Handler uses WeakReference',
        'A non-static inner Handler + a pending delayed message keep the destroyed Activity reachable',
        'removeCallbacksAndMessages(null) is called in onDestroy()',
        'A HandlerThread is quit',
      ],
      correct: [1],
      explanation: 'Inner classes hold their outer instance; a message in the queue holds the Handler; the chain pins the Activity in memory.',
    },
    {
      id: 'android-m2-q9',
      type: 'multi',
      prompt: 'True statements about Looper/Handler: (pick all)',
      options: [
        'A thread can have at most one Looper',
        'Multiple Handlers can post into the same Looper’s queue',
        'The launcher’s onPause() runs before the new app’s onResume()',
        'view.post() posts to a random worker thread',
      ],
      correct: [0, 1, 2],
      explanation: 'One Looper per thread (ThreadLocal); many Handlers may share it; the pause-before-launch ordering is real. view.post() targets the main thread.',
    },
  ],
  resources: [
    { label: 'Android docs — Looper', url: 'https://developer.android.com/reference/android/os/Looper', kind: 'docs', free: true },
    { label: 'Android docs — ANRs explained', url: 'https://developer.android.com/topic/performance/vitals/anr', kind: 'docs', free: true },
  ],
};
