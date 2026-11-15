import { LogAnatomy, type LogTab } from './LogAnatomy';

// Category 3: C/C++/JNI deaths. No exception, no dialog — a signal, a dead
// process, and a tombstone. Learn to read the signals like error codes.

const tabs: LogTab[] = [
  {
    id: 'sigsegv',
    label: 'SIGSEGV (11)',
    blurb: 'Invalid memory access — the C++ world’s NullPointerException, but fatal to the whole process.',
    source: '/data/tombstones/ · logcat -b crash (tag DEBUG)',
    lines: [
      { text: 'F DEBUG   : *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***', note: 'The tombstone banner, written by **crash_dump** (the helper that `tombstoned` attaches to a dying process). Seeing the `DEBUG` tag in logcat = a native crash happened; the full report is in /data/tombstones/.' },
      { text: "F DEBUG   : Build fingerprint: 'oem/device/device:15/AP3A.260105.001/eng.user.20261101:userdebug/dev-keys'", note: 'Exact build — first thing to record. A fix verified on the wrong fingerprint proves nothing.' },
      { text: 'F DEBUG   : signal 11 (SIGSEGV), code 1 (SEGV_MAPERR), fault addr 0x0000000000000008', note: 'Signal 11 = bad memory access. **Decode the fault addr**: `0x0` or tiny (like 0x8) = null pointer + field offset — classic `obj->field` with obj null. A garbage huge address = dangling/corrupted pointer. `SEGV_MAPERR` = address not mapped at all; `SEGV_ACCERR` = mapped but forbidden (e.g. writing read-only memory).' },
      { text: 'F DEBUG   : Abort message: (none)' },
      { text: 'F DEBUG   : backtrace:' },
      { text: 'F DEBUG   :   #00 pc 000000000004a3c0  /vendor/lib64/hw/camera.device@3.5-impl.so (CameraDevice::processCaptureResult(CaptureResult*)+64)', note: 'Frame **#00** is where it died, and the **library path assigns blame**: /vendor/ → HAL code, /system/ → platform, /data/app/ → the app’s own native libs. `+64` = 64 bytes into the function — with symbols, `stack`/`llvm-symbolizer` turns this into file:line.' },
      { text: 'F DEBUG   :   #01 pc 00000000000123f8  /system/lib64/libbinder.so (android::IPCThreadState::executeCommand(int)+1208)', note: 'The caller frames: this crash happened **while serving a Binder transaction** — some client called this HAL method. Pair it with the client-side logs around the same timestamp.' },
    ],
    greps: [
      { pattern: 'Fatal signal', where: 'logcat -b crash — the one-line summary for every native death' },
      { pattern: '*** ***', where: 'logcat / bugreport — jumps you to tombstone banners' },
      { pattern: 'SYSTEM_TOMBSTONE', where: 'dumpsys dropbox — tombstone copies that survive cleanup' },
    ],
  },
  {
    id: 'sigabrt',
    label: 'SIGABRT (6)',
    blurb: 'The code gave up on purpose: a failed CHECK, heap corruption detected, or a JNI rule broken.',
    source: '/data/tombstones/ — and ALWAYS read the Abort message first',
    lines: [
      { text: 'F DEBUG   : signal 6 (SIGABRT), code -1 (SI_QUEUE), fault addr --------', note: 'Signal 6 = `abort()` was **called deliberately**. There is no bad address — the interesting part is WHY it chose to die, and that is written in the next line.' },
      { text: "F DEBUG   : Abort message: 'CHECK failed: surface != nullptr: attempt to queue to a dead surface'", note: 'The developer’s own explanation, passed via `LOG(FATAL)`/`CHECK()`/`abort_message`. **Read this before any backtrace** — it often solves the bug by itself.' },
      { text: "F libc    : FORTIFY: malloc: invalid chunk header (heap corruption?)", note: 'Another classic aborter: libc/Scudo detecting **heap corruption** (double free, use-after-free, overflow). Important: the corruptor ran *earlier* — this crash site is the victim, not the culprit. Tools: HWASan/ASan builds, `libc.debug.malloc` options.' },
      { text: 'F art     : JNI ERROR (app bug): global reference table overflow (max=51200)', note: 'The JNI classic from the JNI topic: `NewGlobalRef` without `DeleteGlobalRef` in a loop. ART dumps the table’s **most common entries** right below — the repeated class name is your leak.' },
      { text: 'F art     :   at com.example.engine.NativeBridge.push(Native method)', note: 'ART then aborts the runtime → SIGABRT tombstone whose Java frames point at the leaking call site.' },
    ],
    greps: [
      { pattern: 'Abort message', where: 'the tombstone — the self-written cause of death' },
      { pattern: 'JNI ERROR', where: 'logcat — reference-table overflows and other JNI rule violations' },
      { pattern: 'heap corruption', where: 'logcat (with FORTIFY / scudo lines) — then reproduce under HWASan' },
    ],
  },
  {
    id: 'others',
    label: 'SIGBUS · SIGILL · SIGFPE',
    blurb: 'The rarer three — each signal is a precise statement about WHAT kind of instruction failed.',
    source: '/data/tombstones/',
    lines: [
      { text: 'F DEBUG   : signal 7 (SIGBUS), code 2 (BUS_ADRERR), fault addr 0x7a3e441000', note: '**SIGBUS** = the address is *valid but unusable*. Top Android cause: an `mmap`-ed file got **truncated** while mapped (an APK/obb/db shrank under you) — touching the vanished page raises BUS_ADRERR. Also misaligned atomics on some hardware.' },
      { text: 'F DEBUG   : signal 4 (SIGILL), code 1 (ILL_ILLOPC), fault addr 0x7b1c22d044', note: '**SIGILL** = the CPU fetched an instruction it can’t decode. Real meanings: you *jumped into garbage* (corrupted function pointer / smashed stack / bad JIT page) or ran code built for a different CPU feature set. The “instruction” was probably never code at all.' },
      { text: 'F DEBUG   : signal 8 (SIGFPE), code 1 (FPE_INTDIV), fault addr 0x5f3a81c0', note: '**SIGFPE** = fatal arithmetic — in practice almost always **integer division by zero** (FPE_INTDIV). Floating-point ÷0 does NOT crash (it yields Inf/NaN); it’s the integer one that kills.' },
      { text: 'F DEBUG   : pid: 912, tid: 934, name: CameraHandler  >>> /vendor/bin/hw/android.hardware.camera.provider@2.7-service <<<', note: 'One more habit: the `>>> process <<<` line. A dying **HAL or native daemon** (like this camera provider) gets restarted by init — so the user sees a feature hiccup, not a reboot. If the dying process is critical (zygote, servicemanager), init’s `onrestart` chain can escalate it into a soft reboot.' },
    ],
    greps: [
      { pattern: 'SIGBUS', where: 'tombstones — then check whether a mapped file changed size' },
      { pattern: 'SIGILL', where: 'tombstones — suspect pointer corruption, not the instruction itself' },
      { pattern: '>>>', where: 'the tombstone — instantly identifies WHICH process died' },
    ],
  },
];

export function NativeCrashLogs() {
  return (
    <LogAnatomy
      heading="Native Crashes, Annotated"
      intro="Signals are not noise — each number tells you the exact species of bug before you read a single frame."
      tabs={tabs}
    />
  );
}
