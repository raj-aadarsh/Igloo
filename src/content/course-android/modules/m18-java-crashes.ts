import type { Module } from '@/content/types';

export const m18: Module = {
  id: 'android-m18',
  slug: 'issues-java-crashes',
  order: 18,
  title: 'Issues 1 · Java Crashes',
  subtitle: 'App, system_server & Binder exceptions',
  icon: 'flame',
  lessons: [
    {
      id: 'android-m18-l1',
      title: 'Under the hood — how a crash becomes a log',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'A “crash” is never magic: it’s a precise chain from an uncaught exception to a log entry. Knowing the chain tells you **where each artifact comes from** — and why some survive a reboot while logcat doesn’t.',
        },
        {
          type: 'ol',
          items: [
            'An exception climbs the stack with no `catch` → the thread’s **UncaughtExceptionHandler** runs. Every Zygote-forked process got a default one installed by `RuntimeInit` — this is the code that prints **`FATAL EXCEPTION`** into the **crash buffer**.',
            'The handler then calls into AMS over Binder (`handleApplicationCrash`). AMS writes the **`am_crash`** event record, files a copy into **dropbox** (`data_app_crash` / `system_app_crash`), decides on the “app has stopped” dialog, and force-finishes the activity.',
            'Finally the handler kills its own process (`Process.killProcess`). An uncaught exception on **any** thread — not just main — takes the whole process down.',
            'If the dying process is **system_server**, the tag reads `FATAL EXCEPTION IN SYSTEM PROCESS`, the dropbox tag is `system_server_crash` — and the boot-topic chain fires: Zygote exits, init rebuilds the Java world, **soft reboot**.',
          ],
        },
        {
          type: 'keyterms',
          title: 'Side-notes',
          terms: [
            { term: 'Why dropbox matters', def: 'Ring buffers roll over in minutes on a busy device; dropbox files (`/data/system/dropbox`) persist for days and across reboots — on a field device, dropbox is often ALL you get.' },
            { term: 'Binder specials', def: '`TransactionTooLargeException` = your parcel blew the ~1 MB buffer (thrown on the *sender*). `DeadObjectException` = the remote process died mid-call — handle it, re-bind, retry.' },
            { term: 'Crash loop', def: 'The same crash every launch = deterministic (bad persisted state, config). Occasional = input/timing dependent. Say this split out loud in interviews.' },
          ],
        },
      ],
    },
    {
      id: 'android-m18-l2',
      title: 'The logs, annotated',
      minutes: 9,
      blocks: [
        { type: 'widget', widget: 'log-java-crashes' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The 4-step method',
          text: '1) Exception type + message — the WHAT, in words. 2) Topmost frame in the owning package (yours, `com.android.server.*`, or a vendor’s) — the WHERE. 3) The framework frames below — the ENTRY PATH (posted message? Binder call? lifecycle?). 4) The minute of logcat *before* the crash — the trigger. Only then open the code.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“An uncaught exception hits the default UncaughtExceptionHandler that RuntimeInit installs in every process: it logs FATAL EXCEPTION to the crash buffer, reports to AMS — which records am_crash in events and files the stack into dropbox — then kills the process. The same mechanism in system_server logs FATAL EXCEPTION IN SYSTEM PROCESS and causes a soft reboot via the Zygote chain. For Binder, TransactionTooLargeException means my parcel exceeded the shared 1 MB buffer, and DeadObjectException means the remote died mid-call — I catch it, unlink, re-bind and retry. When logcat has rolled over, dumpsys dropbox still has the stacks.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m18-q1',
      type: 'single',
      prompt: 'Who actually writes the “FATAL EXCEPTION” lines?',
      options: ['The kernel', 'The process’s own default UncaughtExceptionHandler (installed by RuntimeInit)', 'AMS', 'logd'],
      correct: [1],
      explanation: 'The dying process logs its own death, then reports to AMS, then kills itself.',
    },
    {
      id: 'android-m18-q2',
      type: 'single',
      prompt: 'An uncaught exception on a background worker thread…',
      options: ['Kills only that thread', 'Kills the entire process, same as on main', 'Is silently ignored', 'Causes an ANR'],
      correct: [1],
      explanation: 'The default handler terminates the whole process regardless of which thread threw.',
    },
    {
      id: 'android-m18-q3',
      type: 'single',
      prompt: '“FATAL EXCEPTION IN SYSTEM PROCESS” is immediately followed by…',
      options: ['Only one app restarting', 'A soft reboot — Zygote exits and init rebuilds the Java world', 'A kernel panic', 'Nothing'],
      correct: [1],
      explanation: 'system_server’s death always cascades through the Zygote/init restart chain.',
    },
    {
      id: 'android-m18-q4',
      type: 'single',
      prompt: 'The crash happened an hour ago and logcat has rolled over. Best next stop:',
      options: ['Reboot and hope', 'dumpsys dropbox — data_app_crash / system_server_crash entries persist on disk', 'dumpsys meminfo', 'getevent'],
      correct: [1],
      explanation: 'DropBoxManager keeps crash stacks in /data/system/dropbox far longer than any ring buffer.',
    },
    {
      id: 'android-m18-q5',
      type: 'single',
      prompt: 'TransactionTooLargeException during onStop most likely means…',
      options: ['The network failed', 'An oversized onSaveInstanceState Bundle — it crosses Binder to system_server', 'A SELinux denial', 'Heap exhaustion'],
      correct: [1],
      explanation: 'Saved state rides a Binder transaction; big bitmaps/lists in the Bundle blow the ~1 MB budget.',
    },
    {
      id: 'android-m18-q6',
      type: 'single',
      prompt: 'DeadObjectException is best treated as…',
      options: [
        'A bug in your call arguments',
        'A fact of life: the remote process died — catch it, re-bind via your DeathRecipient path, retry',
        'A reason to crash your own app',
        'A kernel fault',
      ],
      correct: [1],
      explanation: 'Server processes die legitimately (crash, lmkd). Robust clients expect it; the real bug is WHY the server died.',
    },
  ],
  resources: [
    { label: 'AOSP — Diagnosing crashes', url: 'https://source.android.com/docs/core/tests/debug', kind: 'docs', free: true },
  ],
};
