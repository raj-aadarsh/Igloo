import type { Module } from '@/content/types';

export const m10: Module = {
  id: 'android-m10',
  slug: 'stability-debugging',
  order: 10,
  title: 'Stability & Log Debugging',
  subtitle: 'ANRs, Watchdog, tombstones — and how to read the evidence',
  icon: 'bug',
  lessons: [
    {
      id: 'android-m10-l1',
      title: 'The toolbox first',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'Framework debugging is **reading evidence**, and Android writes a lot of it. Before the failure types, know your three tools — these commands are daily bread in any platform team:',
        },
        { type: 'h3', text: 'a) logcat — the running diary' },
        {
          type: 'code',
          caption: 'The flags that matter',
          code: `adb logcat -v threadtime          # timestamps + pid/tid — always use this
adb logcat -b crash               # only crash reports
adb logcat -b events              # structured system events (am_proc_start, boot_progress…)
adb logcat --pid=$(adb shell pidof com.example.app)   # one process only
adb logcat -d > log.txt           # dump & exit (snapshot for a bug report)`,
        },
        {
          type: 'p',
          text: 'Key idea: logcat is **several ring buffers** (`main`, `system`, `crash`, `events`, `radio`), collected by the `logd` daemon — old lines fall off the end, so *capture early*. Each line: priority (V/D/I/W/E/F), tag, pid/tid, message. The `events` buffer is underrated: `am_proc_start`, `am_anr`, `boot_progress_*` tell the system’s story in structured form.',
        },
        { type: 'h3', text: 'b) dumpsys — interrogate a live service' },
        {
          type: 'code',
          caption: 'Ask a running service to describe its state',
          code: `adb shell dumpsys activity activities   # AMS: tasks & back stacks — launch modes, live
adb shell dumpsys window windows        # WMS: every window + current focus
adb shell dumpsys meminfo com.example   # memory of one app (heap, views, …)
adb shell dumpsys package com.example   # PMS: components, permissions, signatures`,
        },
        {
          type: 'p',
          text: '`dumpsys` is just a Binder call to a service’s `dump()` method — every service you’ve met in this course can be asked to print its internals. If logcat is the diary, dumpsys is the interview.',
        },
        { type: 'h3', text: 'c) bugreport — everything, zipped' },
        {
          type: 'p',
          text: '`adb bugreport bug.zip` captures *all of it* at once: every logcat buffer, every dumpsys, kernel log (`dmesg`), ANR traces, tombstones, properties. When someone hands you a field issue, a bugreport is usually all the evidence you’ll ever get — knowing **where inside it** each artifact lives is the skill.',
        },
      ],
    },
    {
      id: 'android-m10-l2',
      title: 'The four deaths & their signatures',
      minutes: 12,
      blocks: [
        {
          type: 'p',
          text: 'Every kind of failure leaves a **distinct fingerprint** in the logs. Learn to recognise all four at a glance — then click through the annotated examples:',
        },
        { type: 'widget', widget: 'crash-signatures' },
        { type: 'h3', text: 'a) ANR — the deep read' },
        {
          type: 'ul',
          items: [
            'The deadlines, one more time: **input 5 s · broadcast 10 s · service 20 s** (foreground values). When one fires, AMS dumps **every thread’s stack** of the guilty process into `/data/anr/`.',
            'Reading method: find the `"main"` thread → check its **state**. `Blocked` = waiting for a lock (the dump names *which* lock and **who holds it** — follow that thread id!). `Native`/`Waiting` on something slow = synchronous I/O or a Binder call to a stuck service.',
            'An ANR is a **symptom at a deadline**, not the moment the problem started — the main thread may have been stuck for 4.9 of those 5 seconds already. Check the seconds *before* in logcat for what kicked it off.',
          ],
        },
        { type: 'h3', text: 'b) Watchdog — the framework ANR’ing itself' },
        {
          type: 'p',
          text: '`system_server` can’t show itself an ANR dialog — instead a dedicated **Watchdog thread** pings the core handler threads and periodically grabs the big service locks (AMS’s, WMS’s, PMS’s). If any stays stuck ~**60 s**, Watchdog logs `WATCHDOG KILLING SYSTEM PROCESS`, dumps stacks, and kills system_server — triggering the **soft reboot** chain you memorised in the boot topic. A device that “randomly restarts without the vendor logo” almost always has a watchdog kill in its logs.',
        },
        { type: 'h3', text: 'c) Native crashes — tombstones' },
        {
          type: 'ul',
          items: [
            'A native fault (bad pointer, abort) kills the process; `crash_dump` writes a **tombstone** to `/data/tombstones/` with: the **signal** (`SIGSEGV` = invalid memory, `SIGABRT` = the code gave up deliberately — check the *abort message*), the **fault address** (`0x0` → null-pointer in C++), registers, and the **backtrace of every thread**.',
            'Frame `#00` is where it died; the **library path assigns blame** — `/vendor/lib64/...` points at HAL/vendor code, `/system/lib64/...` at platform code.',
            'Backtraces show raw addresses when symbols are stripped; the platform tooling (`development/scripts/stack`) resolves them against matching debug symbols.',
          ],
        },
      ],
    },
    {
      id: 'android-m10-l3',
      title: 'Deadlocks, races & slow frames',
      minutes: 10,
      blocks: [
        { type: 'h3', text: 'a) Deadlock — the circular wait' },
        {
          type: 'p',
          text: 'Thread A holds lock 1 and wants lock 2; thread B holds lock 2 and wants lock 1. Nobody ever proceeds. In an ANR/watchdog dump this is *visible*: two threads, each `Blocked`, each `waiting to lock` the monitor `held by` the other. The classic framework version: a Binder call made **while holding a lock**, into a service that needs that same lock to answer. Rule that prevents most of them: **never call out (especially over Binder) while holding your own lock**, and always take multiple locks in one global order.',
        },
        { type: 'h3', text: 'b) Race condition — the timing lottery' },
        {
          type: 'p',
          text: 'Two threads touch shared state without coordination, and the result depends on **who ran first** — works 999 times, corrupts the 1000th. Races rarely announce themselves; they surface as “impossible” states and once-a-week crashes. Your weapons: the **pid/tid + timestamps** in `threadtime` logs to reconstruct interleavings, and in a reproducible setup, deliberately shifting timing (sleeps, load) to shake the bug out. Remember from the Binder topic *why* framework code is so exposed: service methods run **concurrently on Binder pool threads** — unsynchronised service state is a race waiting to happen.',
        },
        { type: 'h3', text: 'c) Jank — when nothing dies but everything stutters' },
        {
          type: 'p',
          text: 'A frame must be produced every **~16.7 ms** (60 Hz). Miss the VSYNC deadline and the old frame shows again — that’s a **jank**. For this class of bug, logs aren’t enough; you record a **trace**: **Perfetto** (successor of systrace) captures a timeline of every thread, CPU, Binder call and frame. In the UI you *see* the main thread blocked inside your 40 ms `onDraw`, or a Binder call stalling on a busy service. `adb shell perfetto …` or the record page in Android Studio / ui.perfetto.dev.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The method (works for every bug class)',
          text: '1) **Which death is it?** — crash, ANR, watchdog, native, or jank decides which artifact to open. 2) **Find the guilty thread** — main for ANRs, frame #00 for tombstones, the stuck monitor for watchdog. 3) **Walk the evidence backwards in time** — the deadline is the end of the story, logcat holds the beginning. 4) Only then open the code.',
        },
      ],
    },
    {
      id: 'android-m10-l4',
      title: 'Additional information — the interview angle',
      minutes: 6,
      blocks: [
        {
          type: 'keyterms',
          title: '✱ Rapid fire',
          terms: [
            { term: 'App crash vs ANR', def: 'Crash = an exception killed it (logcat -b crash). ANR = alive but unresponsive past a deadline (/data/anr dump). Different artifacts, different fixes.' },
            { term: 'Where are ANR traces?', def: '`/data/anr/` — all threads of the guilty process (plus key system processes) at verdict time.' },
            { term: 'StrictMode', def: 'A debug tool that screams (log/flash/crash) the moment you do disk or network on the main thread — catching ANR causes before users do.' },
            { term: 'logcat vs dmesg', def: 'logcat = userspace diary (logd buffers). dmesg = the kernel’s own log — driver errors, lmkd kills, SELinux denials land there too.' },
            { term: 'Who writes tombstones?', def: 'The crash handler (`crash_dump`, via tombstoned) — it attaches to the dying process and snapshots everything.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer (“how would you debug an ANR?”)',
          text: '“First confirm the type from the am_anr line and the reason — say input dispatch timed out. Then open the /data/anr dump and read the main thread: if it’s Blocked, the dump names the lock and the holder thread, so I read that thread next — classic case is it doing I/O or a Binder call while holding the lock. If main is in Native or Waiting, I look for synchronous I/O or a call into a stuck service. The dump is the end of the story, so I walk logcat backwards from the deadline to find what started the stall — and if it’s performance rather than a hang, I record a Perfetto trace and look at the main thread’s timeline against VSYNC.”',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Phase 2 so far',
          text: 'You can now name who owns what inside system_server, trace a touch to your code, explain users and managed devices — and read all four death certificates. One topic left: the security and build layer that every platform change must pass through.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m10-q1',
      type: 'single',
      prompt: 'An app is frozen but hasn’t crashed. The primary artifact to open is…',
      options: ['A tombstone', 'The /data/anr/ thread dump', 'packages.xml', 'dmesg'],
      correct: [1],
      explanation: 'Frozen-not-dead = ANR territory: read the per-thread stacks captured at the deadline.',
    },
    {
      id: 'android-m10-q2',
      type: 'single',
      prompt: 'In an ANR dump, "main" shows: waiting to lock <0x0d47> held by thread 14. Your next move:',
      options: [
        'Restart the device',
        'Read thread 14’s stack — whatever it’s doing while holding that lock is the real story',
        'Increase the ANR timeout',
        'Check SELinux',
      ],
      correct: [1],
      explanation: 'The dump hands you the chain: follow the lock to its holder.',
    },
    {
      id: 'android-m10-q3',
      type: 'single',
      prompt: '“WATCHDOG KILLING SYSTEM PROCESS” in the logs is followed by…',
      options: [
        'Only SystemUI restarting',
        'A full bootloader restart',
        'system_server dying → Zygote exiting → init rebuilding the Java world (a soft reboot)',
        'Nothing visible',
      ],
      correct: [2],
      explanation: 'Watchdog kills system_server; the boot topic’s death chain takes it from there — boot animation, no vendor logo.',
    },
    {
      id: 'android-m10-q4',
      type: 'single',
      prompt: 'A tombstone shows signal 11 (SIGSEGV), fault addr 0x0, #00 in /vendor/lib64/libcam-impl.so. Diagnosis:',
      options: [
        'A Java NullPointerException',
        'A null-pointer dereference in vendor HAL native code',
        'An ANR in the camera app',
        'A kernel panic',
      ],
      correct: [1],
      explanation: 'SIGSEGV at address 0 = C/C++ null deref; the /vendor/ path in frame #00 places the bug in the HAL.',
    },
    {
      id: 'android-m10-q5',
      type: 'single',
      prompt: 'SIGABRT with an abort message differs from SIGSEGV because SIGABRT means…',
      options: [
        'The hardware failed',
        'The code deliberately gave up — an assertion/check failed, and the message says why',
        'The memory was exhausted',
        'Binder disconnected',
      ],
      correct: [1],
      explanation: 'abort() is intentional death; the abort message is the developer’s own explanation — read it first.',
    },
    {
      id: 'android-m10-q6',
      type: 'single',
      prompt: 'Two threads, each Blocked, each waiting for the monitor the other holds. This is…',
      options: ['A race condition', 'A deadlock — visible directly in the thread dump', 'Jank', 'A watchdog bug'],
      correct: [1],
      explanation: 'The circular wait is right there in the stacks — the dump names both locks and both holders.',
    },
    {
      id: 'android-m10-q7',
      type: 'single',
      prompt: 'For “the app stutters while scrolling” (no crash, no ANR), the right tool is…',
      options: ['logcat -b crash', 'A Perfetto/systrace recording of threads vs VSYNC', 'packages.xml', 'pm list users'],
      correct: [1],
      explanation: 'Jank is a timeline problem — you need the trace showing what the main thread did across each 16.7 ms frame window.',
    },
    {
      id: 'android-m10-q8',
      type: 'multi',
      prompt: 'Which habits prevent framework deadlocks? (pick all)',
      options: [
        'Never make a Binder call while holding your own lock',
        'Take multiple locks in one global, agreed order',
        'Hold one big lock around everything, forever',
        'Keep service state synchronised because Binder calls run concurrently',
      ],
      correct: [0, 1, 3],
      explanation: 'Calling out under a lock and inconsistent lock ordering are the two classic causes; one giant forever-lock just converts deadlocks into watchdog kills.',
    },
  ],
  resources: [
    { label: 'Android docs — ANRs', url: 'https://developer.android.com/topic/performance/vitals/anr', kind: 'docs', free: true },
    { label: 'AOSP — Diagnosing native crashes', url: 'https://source.android.com/docs/core/tests/debug/native-crash', kind: 'docs', free: true },
    { label: 'Perfetto — tracing docs', url: 'https://perfetto.dev/docs/', kind: 'docs', free: true },
  ],
};
