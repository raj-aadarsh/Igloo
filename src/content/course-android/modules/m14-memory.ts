import type { Module } from '@/content/types';

export const m14: Module = {
  id: 'android-m14',
  slug: 'memory-management',
  order: 14,
  title: 'Memory Management',
  subtitle: 'oom_adj & lmkd, PSS/RSS/USS, ashmem & dmabuf',
  icon: 'memory-stick',
  lessons: [
    {
      id: 'android-m14-l1',
      title: 'Who gets killed, and why',
      minutes: 8,
      blocks: [
        {
          type: 'p',
          text: 'You saw the importance ladder in the system-services topic. Here it is again, now with the **real constant names** from `ProcessList.java`, because interviewers quote them:',
        },
        { type: 'widget', widget: 'oom-ladder' },
        {
          type: 'keyterms',
          title: 'The constants to quote',
          terms: [
            { term: 'NATIVE_ADJ = −1000', def: 'Native daemons: never killed by lmkd.' },
            { term: 'SYSTEM_ADJ = −900', def: 'system_server.' },
            { term: 'PERSISTENT_PROC_ADJ = −800', def: 'Persistent apps like SystemUI and the phone process.' },
            { term: 'FOREGROUND_APP_ADJ = 0', def: 'The app the user is using.' },
            { term: 'VISIBLE_APP_ADJ = 100', def: 'Visible but not in front.' },
            { term: 'PERCEPTIBLE_APP_ADJ = 200', def: 'The user would notice: music playing, a foreground service.' },
            { term: 'CACHED_APP_MIN/MAX_ADJ = 900 / 999', def: 'Background apps kept only for fast resume, killed first.' },
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'lmkd vs the kernel OOM killer',
          text: '**lmkd** (userspace) watches **PSI**, Pressure Stall Information: the kernel’s measure of how much time tasks spend *waiting* for memory. It kills early and in order of oom_score_adj, while the phone is still responsive. The **kernel OOM killer** is the last resort: it fires only when an allocation truly can’t be satisfied, by which time the device has usually been stuttering badly. lmkd exists so the kernel killer almost never has to.',
        },
      ],
    },
    {
      id: 'android-m14-l2',
      title: 'Measuring memory: PSS and friends',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: '“How much memory does this app use?” sounds simple, but most pages are **shared**, because every app links the same framework libraries (and Zygote’s copy-on-write shares even more). The four metrics are four answers to *who pays for shared pages*:',
        },
        { type: 'widget', widget: 'memory-metrics' },
        {
          type: 'code',
          caption: 'Where you see it',
          code: `adb shell dumpsys meminfo com.example.app
#                 Pss  Private  Private  ...
#                Total   Dirty    Clean
#  Native Heap    9876     9820       0      ← C/C++ allocations
#  Dalvik Heap    6543     6400       0      ← the Java heap
#  .so mmap       4321      120     2100     ← shared libraries (PSS share)
#  Graphics       8000     8000       0      ← GPU buffers (dmabuf)
#  TOTAL PSS:    41234                       ← the number everyone quotes`,
        },
        {
          type: 'keyterms',
          terms: [
            { term: 'Leak hunting', def: 'Watch **TOTAL PSS** and **Private Dirty** across repeats of the same action (open/close a screen 10×). A real leak only grows.' },
            { term: 'Private Dirty', def: 'Memory only this process uses *and* has written to. It can’t be dropped or shared, so it’s the most honest “this is mine” number (close to USS).' },
            { term: 'dumpsys meminfo (no args)', def: 'Ranks *every* process by PSS and shows which oom_adj group it’s in: the whole ladder in one screen.' },
          ],
        },
      ],
    },
    {
      id: 'android-m14-l3',
      title: 'Sharing big buffers: ashmem & dmabuf',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'Binder’s buffer is ~1 MB, yet camera frames, bitmaps and screen buffers are many megabytes. The trick: **don’t send the data, send a handle to shared memory**.',
        },
        {
          type: 'ol',
          items: [
            'The sender allocates a **shared memory region** and gets back a **file descriptor (fd)**, a small number that refers to the region.',
            'It sends just that fd over Binder (inside a `ParcelFileDescriptor` or `SharedMemory`). The **kernel duplicates the fd** into the receiving process.',
            'Both processes **map the same physical pages**. Megabytes are shared, with zero copies and a tiny Binder transaction.',
          ],
        },
        {
          type: 'keyterms',
          title: 'The two mechanisms',
          terms: [
            { term: 'ashmem / memfd', def: '**ashmem** (anonymous shared memory) was Android’s original kernel feature for this; modern Android moves to the standard Linux **memfd**. Used for large Bitmaps sent across processes, CursorWindows from ContentProviders, and the system-property area.' },
            { term: 'dmabuf', def: 'The kernel framework for buffers shared between **hardware devices** and processes: GPU, camera, display, video codec. Graphic buffers in BufferQueue are dmabufs (allocated from **DMA-BUF heaps**, which replaced the older ION allocator).' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“AMS assigns every process an oom_score_adj — FOREGROUND 0, VISIBLE 100, PERCEPTIBLE 200, cached 900 to 999, system and persistent processes negative — and lmkd watches PSI memory pressure and kills from the highest score down before the kernel OOM killer ever has to fire. To measure memory I use PSS from dumpsys meminfo: private pages plus shared pages divided among the processes sharing them, so PSS sums to real RAM, unlike RSS, which overcounts shared libraries, or VSS, which counts untouched reservations. USS is what I’d get back by killing just that process. For leaks I watch total PSS and private dirty across repeated actions. And big buffers never go through Binder directly: the sender passes an fd to ashmem/memfd or a dmabuf, and both processes map the same pages.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m14-q1',
      type: 'single',
      prompt: 'A music app with a foreground service is in which adj band?',
      options: ['FOREGROUND_APP_ADJ (0)', 'PERCEPTIBLE_APP_ADJ (200)', 'CACHED_APP_MIN_ADJ (900)', 'SYSTEM_ADJ (−900)'],
      correct: [1],
      explanation: 'The user would notice if it died (the music stops), so it’s “perceptible”: important, but below visible.',
    },
    {
      id: 'android-m14-q2',
      type: 'single',
      prompt: 'lmkd decides when to start killing based on…',
      options: ['A timer', 'PSI: the kernel’s memory-pressure stall information', 'Battery level', 'The number of apps installed'],
      correct: [1],
      explanation: 'PSI measures how much time tasks are stalled waiting for memory, so lmkd can act before the device becomes unusable.',
    },
    {
      id: 'android-m14-q3',
      type: 'single',
      prompt: 'Why is PSS Android’s standard memory metric?',
      options: [
        'It’s the largest number',
        'It splits shared pages among the processes sharing them, so the PSS of all processes adds up to actual RAM',
        'It ignores the Java heap',
        'It counts reserved virtual memory',
      ],
      correct: [1],
      explanation: 'RSS double-counts shared libraries; PSS divides them fairly, so totals are meaningful.',
    },
    {
      id: 'android-m14-q4',
      type: 'single',
      prompt: 'Which metric tells you how much memory you’d get back if you killed just this one process?',
      options: ['VSS', 'RSS', 'PSS', 'USS'],
      correct: [3],
      explanation: 'USS counts only pages unique to the process; shared pages stay alive for the other users.',
    },
    {
      id: 'android-m14-q5',
      type: 'single',
      prompt: 'Three apps each map a 30 MB shared library. RSS vs PSS for one app’s share of it:',
      options: ['RSS 30, PSS 30', 'RSS 30, PSS 10', 'RSS 10, PSS 30', 'RSS 0, PSS 10'],
      correct: [1],
      explanation: 'RSS charges the full 30 MB to each; PSS charges 30 ÷ 3 = 10 MB each.',
    },
    {
      id: 'android-m14-q6',
      type: 'single',
      prompt: 'How does a 20 MB camera frame get to another process without hitting the 1 MB Binder limit?',
      options: [
        'It’s compressed to fit',
        'Only a file descriptor to shared memory (dmabuf) crosses Binder; both processes map the same pages',
        'It’s split into 20 transactions',
        'It’s written to /sdcard',
      ],
      correct: [1],
      explanation: 'Send the handle, not the data. The kernel duplicates the fd, and the pages are mapped by both sides.',
    },
    {
      id: 'android-m14-q7',
      type: 'multi',
      prompt: 'Which are good signs of a real memory leak? (pick all)',
      options: [
        'TOTAL PSS keeps growing over repeated identical actions',
        'Private Dirty grows and never comes back down',
        'A one-time jump right after first launch',
        'Destroyed Activity instances still present in a heap dump',
      ],
      correct: [0, 1, 3],
      explanation: 'Leaks grow monotonically with repetition and leave dead objects reachable. A single warm-up jump is normal caching.',
    },
  ],
  resources: [
    { label: 'Android docs — Memory overview', url: 'https://developer.android.com/topic/performance/memory-overview', kind: 'docs', free: true },
    { label: 'AOSP — lmkd', url: 'https://source.android.com/docs/core/perf/lmkd', kind: 'docs', free: true },
  ],
};
