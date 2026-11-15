import type { Module } from '@/content/types';

export const m22: Module = {
  id: 'android-m22',
  slug: 'issues-memory-exhaustion',
  order: 22,
  title: 'Issues 5 · Memory & Resources',
  subtitle: 'OOMs, leaks, lmkd thrashing & FD exhaustion',
  icon: 'gauge',
  lessons: [
    {
      id: 'android-m22-l1',
      title: 'Under the hood — how exhaustion shows itself',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'Memory bugs rarely announce themselves where they happen. The theory is all in the Memory Management topic (the ladder, PSS, ashmem/dmabuf) — this module is about the **symptoms and their confessions**. Four distinct resources run out in four distinct ways:',
        },
        {
          type: 'keyterms',
          title: 'The four exhaustions',
          terms: [
            { term: 'Java heap', def: 'ART refuses an allocation once the heap would pass its **growth limit** → `OutOfMemoryError`. The crash site is whoever asked last — with leaks, never the culprit.' },
            { term: 'References (leaks)', def: 'Nothing fails loudly — PSS just climbs. Destroyed Activities stay reachable (static/singleton/Handler chains), dragging their view trees along.' },
            { term: 'Device RAM', def: 'lmkd kills by the adj ladder. Healthy = occasional cached kills. **Thrashing** = kills every few seconds, apps reload constantly, the device feels broken without one crash log.' },
            { term: 'File descriptors', def: 'Every file, socket, pipe, Binder-received fd counts against a per-process cap. At the cap, *unrelated* operations start failing with **“Too many open files”** — often surfacing as a weird native crash.' },
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why the crash site lies',
          text: 'Exhaustion bugs break the usual “stack trace = cause” rule: the OOM names whoever made the *last* allocation, the FD error hits whoever opened the *next* socket, lmkd kills the *least important* process rather than the greedy one. Triage therefore starts from **measurements over time** (meminfo, fd counts, kill rates), not from the stack.',
        },
      ],
    },
    {
      id: 'android-m22-l2',
      title: 'The logs, annotated',
      minutes: 10,
      blocks: [
        { type: 'widget', widget: 'log-memory-issues' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The method',
          text: '1) Classify by confession line: OutOfMemoryError / staircase PSS / lowmemorykiller spam / “Too many open files”. 2) Measure over repetition: `dumpsys meminfo` per cycle, `ls /proc/<pid>/fd | wc -l` per cycle — growth that never plateaus is the proof. 3) Identify the object: OOM message size, meminfo’s Activities/Views counts, the duplicated fd type. 4) Convict with the right tool: `.hprof` GC-root path for Java leaks, HWASan/malloc debug for native, the meminfo PSS ranking for “who ate the RAM”.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“I separate the four exhaustions. A Java OOM I read from its own message — allocation size versus growth limit tells me one giant bitmap versus a slow fill. Leaks I prove by repetition: dumpsys meminfo across ten open-close cycles, watching TOTAL PSS and the live Activities count, then a heap dump’s GC-root path to name the pinning reference. lmkd thrashing I diagnose from the kill rate in the lowmemorykiller and am_kill lines and settle by asking who actually holds the RAM in the PSS ranking. And file-descriptor leaks announce themselves as Too-many-open-files in random places — I count /proc/pid/fd and group the entries; hundreds of identical sockets or pipes name the leak.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m22-q1',
      type: 'single',
      prompt: '“Failed to allocate a 48MB allocation with … growth limit 256MB” most strongly suggests…',
      options: ['An FD leak', 'A single oversized allocation — almost certainly an un-downsampled bitmap decode', 'lmkd thrashing', 'A kernel bug'],
      correct: [1],
      explanation: 'The requested size is in the message: ~48 MB in one ask is image-sized, not leak-sized.',
    },
    {
      id: 'android-m22-q2',
      type: 'single',
      prompt: 'dumpsys meminfo shows “Activities: 11” with one screen visible. This indicates…',
      options: ['Normal caching', '10 destroyed Activity instances still reachable — a Context/Handler-style leak', 'A native leak', 'The launcher is slow'],
      correct: [1],
      explanation: 'Live object counts in meminfo expose retained Activities without even taking a heap dump.',
    },
    {
      id: 'android-m22-q3',
      type: 'single',
      prompt: 'The proof that convicts a Java leak at a specific line of code is…',
      options: ['The OOM stack trace', 'The GC-root reference path to the retained object in a heap dump (.hprof)', 'The lmkd log', 'logcat -b radio'],
      correct: [1],
      explanation: 'The chain from GC root to the dead Activity names the static field/message that pins it.',
    },
    {
      id: 'android-m22-q4',
      type: 'single',
      prompt: '“lowmemorykiller: Kill …” lines appearing every few seconds mean…',
      options: [
        'Normal behaviour',
        'Thrashing — RAM pressure is constant; find the consumer via the dumpsys meminfo PSS ranking',
        'The battery is failing',
        'An ANR is imminent',
      ],
      correct: [1],
      explanation: 'Occasional cached kills are by design; a constant kill-rate means someone is hogging RAM.',
    },
    {
      id: 'android-m22-q5',
      type: 'single',
      prompt: 'lmkd starts killing at adj 200 (perceptible). That tells you…',
      options: ['Nothing', 'Pressure is severe — all cached apps are already gone, and user-noticeable processes are dying', 'The ladder is broken', 'The device has too many users'],
      correct: [1],
      explanation: 'Kills climb the ladder bottom-up: reaching perceptible means the cheap victims ran out.',
    },
    {
      id: 'android-m22-q6',
      type: 'single',
      prompt: 'Random-looking native crashes whose abort messages mention errno 24 / “Too many open files” point to…',
      options: ['Heap corruption', 'An FD leak — count and group /proc/<pid>/fd entries to name it', 'SELinux', 'A GPU bug'],
      correct: [1],
      explanation: 'At the fd cap every subsystem starts failing; the duplicated fd type in /proc identifies the leaker.',
    },
  ],
  resources: [
    { label: 'Android docs — Investigating RAM usage', url: 'https://developer.android.com/tools/dumpsys#meminfo', kind: 'docs', free: true },
  ],
};
