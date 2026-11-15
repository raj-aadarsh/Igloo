import type { Module } from '@/content/types';

export const m19: Module = {
  id: 'android-m19',
  slug: 'issues-freezes-watchdogs',
  order: 19,
  title: 'Issues 2 · Freezes & Watchdogs',
  subtitle: 'ANRs, Watchdog kills, deadlocks & pool exhaustion',
  icon: 'hourglass',
  lessons: [
    {
      id: 'android-m19-l1',
      title: 'Under the hood — how Android detects a hang',
      minutes: 8,
      blocks: [
        {
          type: 'p',
          text: 'Freezes are **detected by timers, not by the frozen code** — something *else* notices the silence. Know the three detectors and their clocks:',
        },
        {
          type: 'keyterms',
          title: 'The detectors',
          terms: [
            { term: 'InputDispatcher', def: 'Starts a **5 s** timer when it sends an input event; stopped by the app’s `finishInputEvent`. Expiry → AMS declares an input ANR.' },
            { term: 'AMS timers', def: 'Broadcast: **10 s** foreground / **60 s** background for `onReceive`. Service: **20 s** foreground / **200 s** background for lifecycle methods. Each start schedules a timeout message; completion cancels it.' },
            { term: 'Watchdog (in system_server)', def: 'Every 30 s posts a ping to each core handler thread (ui/fg/display/anim…) and tries the big service locks. Unanswered **30 s → WAITED_HALF** warning; **~60 s → kill** system_server → soft reboot.' },
          ],
        },
        {
          type: 'ol',
          items: [
            'On expiry, AMS writes the **`am_anr`** (or `am_watchdog`) event record — your precise timestamp.',
            'It then dumps **all threads** of the guilty process (plus key system processes) into **`/data/anr/`** — the stack photo at the moment of judgement.',
            'Only then: dialog for an app, or the kill for system_server. The dialog is UX; **the trace file is the evidence**.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The two shapes of every freeze',
          text: 'Every hang reduces to one of two stack shapes: **Blocked on a lock** (the dump names the holder — follow it; a cycle of holders = deadlock) or **stuck inside a slow call** (I/O, or `transactNative` into a stuck remote — then dump THAT process). Binder-pool exhaustion is shape 2 industrialised: ~16 server threads all stuck → every client freezes at once.',
        },
      ],
    },
    {
      id: 'android-m19-l2',
      title: 'The logs, annotated',
      minutes: 10,
      blocks: [
        { type: 'widget', widget: 'log-anr-freezes' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The method',
          text: '1) `am_anr`/watchdog line → exact time + which deadline. 2) Open the /data/anr dump → read `"main"` (or the named stuck monitor): Blocked → follow “held by thread N”; Native/transactNative → identify the remote pid and read ITS dump. 3) Walk logcat backwards from the deadline — the stall began up to 5–60 s earlier. 4) For repeat offenders, compare several dumps: the common frame is the culprit.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“Hangs are caught by watchdog timers: InputDispatcher’s 5-second input clock, AMS’s 10/60-second broadcast and 20/200-second service clocks, and system_server’s own Watchdog pinging core threads and locks — WAITED_HALF at 30 seconds, kill and soft reboot at 60. On expiry AMS logs am_anr and dumps every thread to /data/anr. I read main’s state first: Blocked means follow the named lock holder — a cycle of holders is a deadlock, like the classic AMS–WMS inversion; stuck in transactNative means the stall is in the remote service, and if all its Binder threads are busy, that pool exhaustion freezes every client at once.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m19-q1',
      type: 'single',
      prompt: 'Who detects an input ANR, and how?',
      options: [
        'The app’s own timer',
        'InputDispatcher: a 5 s clock started at send, stopped only by the app’s finishInputEvent',
        'The kernel scheduler',
        'SurfaceFlinger',
      ],
      correct: [1],
      explanation: 'The frozen app can’t detect its own freeze — the dispatcher’s unanswered timer is the detector.',
    },
    {
      id: 'android-m19-q2',
      type: 'single',
      prompt: 'The background-broadcast and background-service ANR limits are…',
      options: ['5 s / 10 s', '60 s / 200 s', '10 s / 20 s', 'There are none'],
      correct: [1],
      explanation: 'Foreground: 10 s broadcast, 20 s service. Background gets the relaxed 60 s / 200 s limits.',
    },
    {
      id: 'android-m19-q3',
      type: 'single',
      prompt: '“WAITED_HALF” in the log means…',
      options: [
        'An ANR dialog appeared',
        'Watchdog’s 30 s half-check failed — a warning with stacks, before the ~60 s kill',
        'Half the memory is used',
        'A broadcast took 5 s',
      ],
      correct: [1],
      explanation: 'The half-timeout gives you stack dumps of near-misses — gold for finding stalls that usually recover.',
    },
    {
      id: 'android-m19-q4',
      type: 'single',
      prompt: 'In the dump: main is Blocked “held by thread 14”; thread 14 is Blocked “held by thread 1 (main)”. This is…',
      options: ['Pool exhaustion', 'A deadlock — a closed cycle of lock holders; neither thread will ever run', 'Normal', 'A native crash'],
      correct: [1],
      explanation: 'A waits for B while B waits for A: the circular wait is visible directly in the two stack entries.',
    },
    {
      id: 'android-m19-q5',
      type: 'single',
      prompt: 'Five unrelated apps ANR simultaneously, all stuck in BinderProxy.transactNative to the same service. The real bug is…',
      options: [
        'In each of the five apps',
        'In that service: its Binder thread pool is exhausted/blocked, so every caller hangs',
        'In logd',
        'In the launcher',
      ],
      correct: [1],
      explanation: 'Many victims, one target: triage the callee’s thread dump, not the callers’.',
    },
    {
      id: 'android-m19-q6',
      type: 'single',
      prompt: 'The ANR dialog appeared but you need the cause. The decisive artifact is…',
      options: ['A screenshot of the dialog', 'The /data/anr thread dump taken at the deadline', 'dumpsys battery', 'The APK'],
      correct: [1],
      explanation: 'The dump is the stack photo of every thread at judgement time — the dialog is just the messenger.',
    },
  ],
  resources: [
    { label: 'Android docs — ANRs', url: 'https://developer.android.com/topic/performance/vitals/anr', kind: 'docs', free: true },
  ],
};
