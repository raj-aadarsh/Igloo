import type { Module } from '@/content/types';

export const m20: Module = {
  id: 'android-m20',
  slug: 'issues-native-crashes',
  order: 20,
  title: 'Issues 3 · Native Crashes',
  subtitle: 'Signals, tombstones & JNI deaths',
  icon: 'skull',
  lessons: [
    {
      id: 'android-m20-l1',
      title: 'Under the hood — from signal to tombstone',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'Native code has no exceptions to catch — when C/C++ misbehaves, the **kernel raises a signal** at the faulting instruction. Android intercepts that moment to write the richest crash report it has: the tombstone.',
        },
        {
          type: 'ol',
          items: [
            'The CPU faults (bad address, illegal instruction…) → the kernel delivers a **signal** (SIGSEGV, SIGBUS…) to the thread. `abort()` raises SIGABRT deliberately.',
            'Every Android process has a tiny in-process **signal handler** (from debuggerd) pre-installed. It catches the fatal signal and requests help from **`tombstoned`**.',
            'A fresh **`crash_dump`** process attaches to the dying one (like a debugger), reads registers, memory maps, the **abort message**, and the **backtrace of every thread**.',
            'It writes `/data/tombstones/tombstone_NN`, logs the `Fatal signal …` summary to the **crash buffer** (tag `DEBUG`), and files a `SYSTEM_TOMBSTONE` dropbox entry. Then the process is allowed to die — and if it was a daemon/HAL, **init restarts it** per its `.rc`.',
          ],
        },
        {
          type: 'keyterms',
          title: 'The signal cheat-sheet (say the numbers)',
          terms: [
            { term: 'SIGSEGV (11)', def: 'Invalid memory access — null/dangling pointer, overflow. Decode the fault addr: ~0x0 = null + offset.' },
            { term: 'SIGABRT (6)', def: 'Deliberate abort() — failed CHECK, detected heap corruption, JNI rule violation. **Read the Abort message first.**' },
            { term: 'SIGBUS (7)', def: 'Valid-but-unusable address — classically a truncated mmap-ed file.' },
            { term: 'SIGILL (4) / SIGFPE (8)', def: 'Illegal instruction (you jumped into garbage) / integer division by zero.' },
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Symbols — making #00 readable',
          text: 'Shipped libraries are stripped, so frames show `pc 0004a3c0 libfoo.so (+offset)`. With the **matching build’s symbols** (`out/target/product/<device>/symbols/`), the platform `stack` script / `llvm-symbolizer` turns every frame into file:line. No matching symbols = guesswork; this is why recording the Build fingerprint is step zero.',
        },
      ],
    },
    {
      id: 'android-m20-l2',
      title: 'The logs, annotated',
      minutes: 9,
      blocks: [
        { type: 'widget', widget: 'log-native-crashes' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The method',
          text: '1) Signal + code + fault addr → the species of bug, before any frames. 2) `>>> process <<<` + frame #00’s library path → whose code died (app / platform / vendor HAL). 3) Abort message, if any → often the full answer. 4) Symbolize with the matching build → file:line. 5) For corruption-class bugs (victim ≠ culprit), reproduce under HWASan/ASan — the tool names the true offender.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“A native fault delivers a signal; the in-process debuggerd handler hands the dying process to crash_dump, which writes a tombstone — registers, maps, abort message and every thread’s backtrace — plus the Fatal signal line in the crash buffer and a dropbox copy. I read signal and fault address first: SIGSEGV near zero is a null dereference, SIGABRT means read the abort message, SIGBUS suggests a truncated mapped file, SIGILL corrupted control flow. Frame #00’s library path assigns ownership — vendor versus platform — and I symbolize against the same build fingerprint. A crashed HAL just restarts via init, which is why the user saw a camera hiccup instead of a reboot.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m20-q1',
      type: 'single',
      prompt: 'Fatal signal 11, fault addr 0x0000000000000010. Most likely…',
      options: ['Heap exhaustion', 'A null object pointer dereferenced at field offset 0x10', 'Division by zero', 'A truncated file'],
      correct: [1],
      explanation: 'Tiny fault addresses are null-pointer-plus-offset — the C++ twin of an NPE.',
    },
    {
      id: 'android-m20-q2',
      type: 'single',
      prompt: 'For a SIGABRT tombstone, the first thing to read is…',
      options: ['The register dump', 'The Abort message — the code’s own stated reason for giving up', 'Frame #05', 'The memory map'],
      correct: [1],
      explanation: 'abort() is deliberate; the message (CHECK failed / JNI ERROR / allocator complaint) usually IS the diagnosis.',
    },
    {
      id: 'android-m20-q3',
      type: 'single',
      prompt: 'Frame #00 sits in /vendor/lib64/hw/camera…impl.so. The bug belongs to…',
      options: ['The app', 'The Android framework', 'The vendor’s camera HAL', 'The kernel'],
      correct: [2],
      explanation: 'The library path of the dying frame assigns ownership across the Treble wall.',
    },
    {
      id: 'android-m20-q4',
      type: 'single',
      prompt: '“JNI ERROR (app bug): global reference table overflow” means…',
      options: [
        'Too many threads',
        'NewGlobalRef was called repeatedly without DeleteGlobalRef — a JNI reference leak, aborted by ART',
        'The heap is full',
        'A SELinux denial',
      ],
      correct: [1],
      explanation: 'ART caps the global-ref table and dumps its most common entries — the repeated class names your leak.',
    },
    {
      id: 'android-m20-q5',
      type: 'single',
      prompt: 'Heap-corruption aborts are tricky because…',
      options: [
        'They leave no tombstone',
        'The crash site is the victim — the corrupting write happened earlier, elsewhere; use HWASan/ASan to catch the culprit',
        'They only happen in Java',
        'The signal number is random',
      ],
      correct: [1],
      explanation: 'The allocator detects damage after the fact; sanitizers trap the bad write at the moment it happens.',
    },
    {
      id: 'android-m20-q6',
      type: 'single',
      prompt: 'surfaceflinger died with a tombstone. The user most likely experienced…',
      options: [
        'A kernel panic',
        'A visible glitch/flicker while init restarted it — or a soft reboot if the restart chain escalated',
        'Nothing can restart surfaceflinger',
        'A factory reset',
      ],
      correct: [1],
      explanation: 'Native services are restarted by init per their .rc; critical ones can drag zygote with them via onrestart.',
    },
  ],
  resources: [
    { label: 'AOSP — Diagnosing native crashes', url: 'https://source.android.com/docs/core/tests/debug/native-crash', kind: 'docs', free: true },
  ],
};
