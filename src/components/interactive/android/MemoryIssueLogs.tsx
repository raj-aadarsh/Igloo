import { LogAnatomy, type LogTab } from './LogAnatomy';

// Category 5: nothing "breaks" — the device drowns slowly. Memory and
// resource exhaustion, and the lines that give each away.

const tabs: LogTab[] = [
  {
    id: 'oom',
    label: 'Java OOM',
    blurb: 'The ART heap hit its ceiling. The message itself contains half the diagnosis.',
    source: 'logcat -b crash',
    lines: [
      { text: 'E AndroidRuntime: java.lang.OutOfMemoryError: Failed to allocate a 48771088 byte allocation with 6291456 free bytes and 42MB until OOM, target footprint 268435456, growth limit 268435456', note: 'Read the numbers: it tried to allocate **~46 MB in one go** (that size screams “bitmap”), and the heap’s **growth limit is 256 MB** (`dalvik.vm.heapgrowthlimit`; `android:largeHeap` lifts it to `dalvik.vm.heapsize`). Huge single allocation = decode-too-big bug; death by a thousand small ones = a leak filled the heap first.' },
      { text: 'E AndroidRuntime: \tat android.graphics.Bitmap.nativeCreate(Native Method)', note: 'Confirms the suspect: a Bitmap decode without downsampling (`inSampleSize`). The crash site is where the heap *ran out* — with leaks, the real culprit filled it long before this innocent allocation.' },
      { text: 'I art     : Clamp target GC heap from 271MB to 256MB', note: 'ART’s GC straining at the ceiling shortly before the OOM — these lines in the minutes before are the “it was a slow fill, not one big alloc” tell.' },
    ],
    greps: [
      { pattern: 'OutOfMemoryError', where: 'logcat -b crash' },
      { pattern: 'growth limit', where: 'the OOM message — compare against dalvik.vm.heapgrowthlimit' },
      { pattern: 'Clamp target GC', where: 'logcat — pressure building before the crash' },
    ],
  },
  {
    id: 'leak',
    label: 'Leak hunt',
    blurb: 'Leaks don’t log. You make them confess by measuring the same action repeatedly.',
    source: 'dumpsys meminfo · am dumpheap (.hprof)',
    lines: [
      { text: '$ adb shell dumpsys meminfo com.example.notes | grep TOTAL', note: 'The method: open/close the suspect screen 10×, running this each cycle. **Healthy**: PSS rises then plateaus (caches warm up). **Leak**: a staircase that never comes down.' },
      { text: '  TOTAL PSS:   91234   TOTAL RSS: 132480   ... (was 41234 ten cycles ago)', note: '+50 MB over 10 cycles ≈ 5 MB per cycle — about the size of that screen’s bitmaps. The per-cycle delta often *identifies* the leaked object by size alone.' },
      { text: '  Objects — Views: 8120  Activities: 11', note: '`dumpsys meminfo` counts live Activities/Views. **11 Activities** while one screen is visible = 10 destroyed instances still reachable — the Context-leak pattern from the Context topic (static/singleton holding an Activity, or the inner-Handler leak).' },
      { text: '$ adb shell am dumpheap 12873 /data/local/tmp/notes.hprof', note: 'The verdict tool: a heap dump. In Android Studio/MAT, find the retained Activity and follow its **GC-root path** — the chain of references ending at the static field or handler message that pins it. That chain names the exact line to fix.' },
    ],
    greps: [
      { pattern: 'Activities:', where: 'dumpsys meminfo <pkg> — more than ~1-2 live Activities per visible screen = leak' },
      { pattern: 'TOTAL PSS', where: 'repeated dumpsys meminfo — the staircase pattern' },
    ],
  },
  {
    id: 'lmkd',
    label: 'lmkd thrashing',
    blurb: '“Every app reloads from scratch” — the killer is doing its job too often. Find out who’s eating the RAM.',
    source: 'logcat (tag lowmemorykiller) · logcat -b events (am_kill)',
    lines: [
      { text: "I lowmemorykiller: Kill 'com.example.maps' (14012), uid 10088, oom_score_adj 915 to free 184320kB rss; reason: low watermark is breached", note: 'lmkd’s kill record: who, which adj band (915 = cached — fair game), how much RSS freed, and the pressure reason. Occasional kills are normal; **this line every few seconds is thrashing**.' },
      { text: 'I am_kill : [0,14012,com.example.maps,915,cached #3]', note: 'AMS’s matching events-buffer record. Count kills per minute over a bugreport: the kill *rate* turns “feels laggy” into a number you can compare across builds.' },
      { text: "I lowmemorykiller: Kill 'com.example.notes' (14233), uid 10057, oom_score_adj 200 to free 96200kB", note: 'Escalation: killing at **adj 200 (perceptible — music stops!)** means cached apps are already gone. Now ask the real question: *who is consuming it all?* → `dumpsys meminfo` ranked list; the usual suspects are one bloated persistent process or a native leak that PSS ranking exposes instantly.' },
    ],
    greps: [
      { pattern: 'lowmemorykiller', where: 'logcat — every kill with adj and freed kB' },
      { pattern: 'am_kill', where: 'logcat -b events — countable kill records' },
      { pattern: 'am_low_memory', where: 'logcat -b events — AMS noticing cached-process famine' },
    ],
  },
  {
    id: 'fd',
    label: 'FD leak',
    blurb: 'The sneakiest exhaustion: file descriptors. Crashes look random until you read the magic words.',
    source: '/proc/<pid>/fd · the crash that finally lands',
    lines: [
      { text: 'E Parcel  : fcntl(F_DUPFD_CLOEXEC) failed in Parcel::read, i is 0, fds[i] is -1, fd_count is 1, error: Too many open files', note: '**“Too many open files”** (EMFILE) is the string to burn into memory. The process hit its FD limit — every new socket, file, pipe or incoming Binder FD now fails. Crash sites look random (here: Binder parcel reading an fd); the *limit* is the bug.' },
      { text: "F DEBUG   : Abort message: 'could not create instance too many files open (24)'", note: 'Many subsystems abort outright when FDs run dry, so an FD leak frequently *masquerades as a native crash* — always check errno 24 in abort messages.' },
      { text: '$ adb shell ls /proc/12873/fd | wc -l   →   1021', note: 'The one-liner diagnosis: count the FDs (soft limit historically 1024; many modern configs 32768). Near the limit = leaking.' },
      { text: '$ adb shell ls -l /proc/12873/fd | sort -k11 | uniq -c -f10 | sort -rn | head', note: 'Then group them: hundreds of identical entries name the leak — `socket:[…]` (unclosed sockets), the same db/file path (cursors/streams not closed), `anon_inode:[eventfd]` (Handler/Looper objects created per-call), or pipes from leaked ParcelFileDescriptors.' },
    ],
    greps: [
      { pattern: 'Too many open files', where: 'logcat + tombstone abort messages (errno 24 = EMFILE)' },
      { pattern: 'socket:[', where: 'ls -l /proc/<pid>/fd — the duplicate-entry census' },
    ],
  },
];

export function MemoryIssueLogs() {
  return (
    <LogAnatomy
      heading="Memory & Resource Exhaustion, Annotated"
      intro="Four slow drownings: heap, references, RAM pressure and file descriptors — each with its own confession line."
      tabs={tabs}
    />
  );
}
