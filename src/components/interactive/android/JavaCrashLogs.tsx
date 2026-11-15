import { LogAnatomy, type LogTab } from './LogAnatomy';

// Category 1: Java crashes — an exception nobody caught, in three flavours.

const tabs: LogTab[] = [
  {
    id: 'app',
    label: 'App crash',
    blurb: 'An uncaught exception on any thread kills the whole process — this is the everyday one.',
    source: 'logcat -b crash · dumpsys dropbox data_app_crash',
    lines: [
      { text: 'E AndroidRuntime: FATAL EXCEPTION: main', note: 'Written by the app’s default **UncaughtExceptionHandler** (installed by `RuntimeInit` in every process forked from Zygote). “main” = the UI thread died, so the whole app goes.' },
      { text: 'E AndroidRuntime: Process: com.example.notes, PID: 12873' },
      { text: 'E AndroidRuntime: java.lang.IllegalStateException: Fragment not attached to a context.', note: 'Exception type + message — the WHAT. Read the message word by word; it usually states the broken assumption outright.' },
      { text: 'E AndroidRuntime: \tat com.example.notes.ui.NoteFragment.reload(NoteFragment.java:87)', note: 'Topmost frame in YOUR package = where to open the editor. Everything above it (none here) would be library code that merely surfaced the problem.' },
      { text: 'E AndroidRuntime: \tat android.os.Handler.handleCallback(Handler.java:942)', note: 'Framework frames below tell you the **entry path**: this ran as a posted message on the main Looper — so some earlier `post()`/callback scheduled the doomed call.' },
      { text: 'W ActivityTaskManager:   Force finishing activity com.example.notes/.MainActivity', note: 'AMS reacting: the handler reported the crash over Binder (`handleApplicationCrash`), AMS stores a **dropbox** entry, shows the “has stopped” dialog and tears the activity down.' },
    ],
    greps: [
      { pattern: 'FATAL EXCEPTION', where: 'logcat -b crash (or the SYSTEM LOG section of a bugreport)' },
      { pattern: 'am_crash', where: 'logcat -b events — one structured line per crash, great for counting' },
      { pattern: 'data_app_crash', where: 'dumpsys dropbox — full copies survive log rollover' },
    ],
  },
  {
    id: 'system',
    label: 'system_server crash',
    blurb: 'The same thing inside the framework process — except now the whole Java world dies with it.',
    source: 'logcat -b crash · dumpsys dropbox system_server_crash',
    lines: [
      { text: 'E AndroidRuntime: *** FATAL EXCEPTION IN SYSTEM PROCESS: android.display', note: 'The giveaway phrase. The thread name after the colon tells you **which service’s thread** blew up — here a display-side handler thread inside system_server.' },
      { text: 'E AndroidRuntime: java.lang.NullPointerException: Attempt to read from field ...DisplayContent.mToken', note: 'Same anatomy as an app crash — but the stack frames will be `com.android.server.*`, i.e. framework code (or an OEM patch to it).' },
      { text: 'E AndroidRuntime: \tat com.android.server.wm.DisplayContent.applyRotation(DisplayContent.java:612)', note: '`com.android.server.wm` → WMS territory. The package of the top frame assigns the owning team in real triage.' },
      { text: 'I Zygote  : Process 1337 exited due to signal 9', note: 'And now the chain you know from the boot topic: system_server is gone → Zygote kills itself → init restarts the Java world → **soft reboot**, boot animation replays.' },
    ],
    greps: [
      { pattern: 'FATAL EXCEPTION IN SYSTEM PROCESS', where: 'logcat -b crash / bugreport' },
      { pattern: 'system_server_crash', where: 'dumpsys dropbox — the stack survives the reboot' },
      { pattern: 'boot_progress_start', where: 'logcat -b events — appearing again mid-session confirms the soft reboot' },
    ],
  },
  {
    id: 'binder',
    label: 'Binder exceptions',
    blurb: 'Two special Java exceptions born at the process boundary — both scream “Binder” in interviews.',
    source: 'logcat -b crash + main',
    lines: [
      { text: 'E JavaBinder: !!! FAILED BINDER TRANSACTION !!!  (parcel size = 1245164)', note: 'The native layer’s cry when a transaction won’t fit: the parcel (~1.2 MB here) blew the **~1 MB shared transaction buffer** from the Binder topic.' },
      { text: 'E AndroidRuntime: java.lang.RuntimeException: android.os.TransactionTooLargeException: data parcel size 1245164 bytes', note: 'The Java face of the same event. Classic causes: a bitmap in intent extras, or a giant `onSaveInstanceState` Bundle (it travels to system_server!).' },
      { text: '    at android.app.servertransaction.PendingTransactionActions$StopInfo.run', note: 'This frame is the tell: the crash happened while sending **saved state** during stop — the textbook oversized-Bundle scenario.' },
      { text: 'W System.err: android.os.DeadObjectException', note: 'The other one: the remote process **died while you held its Binder**. Not your bug — your *handling* of it is. Expected after any crash/lmkd kill of the server side.' },
      { text: '    at android.os.BinderProxy.transactNative(Native Method)', note: 'Always thrown at the proxy, mid-call. The fix is resilience: catch it, `unlinkToDeath`, re-bind to the service, retry — exactly what `DeathRecipient` exists for.' },
    ],
    greps: [
      { pattern: 'FAILED BINDER TRANSACTION', where: 'logcat — fires even when the app survives the failed call' },
      { pattern: 'TransactionTooLargeException', where: 'logcat -b crash' },
      { pattern: 'DeadObjectException', where: 'logcat — then find WHY the server process died (its own crash is the real story)' },
    ],
  },
];

export function JavaCrashLogs() {
  return (
    <LogAnatomy
      heading="Java Crashes, Annotated"
      intro="One mechanism — an uncaught exception — three very different blast radii."
      tabs={tabs}
    />
  );
}
