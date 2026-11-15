import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

// Four kinds of death, four log signatures. Click the highlighted lines —
// learning to READ these is 80% of stability debugging.

interface LogLine { text: string; note?: string }
interface Signature { id: string; label: string; intro: string; lines: LogLine[] }

const SIGS: Signature[] = [
  {
    id: 'java',
    label: 'Java crash',
    intro: 'The friendliest death: an uncaught exception. Found in `logcat -b crash`.',
    lines: [
      { text: 'FATAL EXCEPTION: main', note: 'Which thread died — here the main thread, so the whole UI went down with it.' },
      { text: 'Process: com.example.notes, PID: 12873' },
      { text: 'java.lang.NullPointerException: Attempt to invoke virtual method', note: 'The exception type + message — WHAT went wrong. An NPE: something was null that shouldn’t be.' },
      { text: "  'void android.widget.TextView.setText(...)' on a null object reference" },
      { text: '    at com.example.notes.NoteActivity.onCreate(NoteActivity.java:42)', note: 'The first frame in YOUR package = where to open your editor. File and line, served on a plate.' },
      { text: '    at android.app.ActivityThread.performLaunchActivity(...)', note: 'Frames below yours show HOW you got there — the framework was driving onCreate during launch. (Recognise ActivityThread from the app-process topic?)' },
    ],
  },
  {
    id: 'anr',
    label: 'ANR',
    intro: 'Nothing crashed — the main thread just stopped answering. The gold is in the thread-stack dump under `/data/anr/`.',
    lines: [
      { text: 'ANR in com.example.notes (com.example.notes/.NoteActivity)' },
      { text: 'Reason: Input dispatching timed out', note: 'Which deadline fired — here the 5-second input timer from InputDispatcher (the input-pipeline topic!).' },
      { text: '----- dump of /data/anr/anr_2026_11_15… -----' },
      { text: '"main" prio=5 tid=1 Blocked', note: 'The smoking gun: the main thread’s state is Blocked — it’s stuck waiting for a lock, not just slow.' },
      { text: '    at com.example.notes.Db.query(Db.java:88)' },
      { text: '    - waiting to lock <0x0d47> held by thread 14', note: 'The dump even tells you WHO has the lock. Next move: scroll to tid=14 and see what it’s doing.' },
      { text: '"pool-2-thread-1" tid=14 Native' },
      { text: '    at libcore.io.Linux.read(...)', note: 'Root cause: thread 14 is doing blocking disk/network I/O while holding the lock the main thread needs. Classic.' },
    ],
  },
  {
    id: 'native',
    label: 'Native crash',
    intro: 'C/C++ died — no exception, the process is just gone. The post-mortem is a tombstone in `/data/tombstones/`.',
    lines: [
      { text: "Build fingerprint: 'vendor/device/userdebug/…'", note: 'Exact build — the first thing anyone triaging a device bug checks.' },
      { text: 'signal 11 (SIGSEGV), code 1 (SEGV_MAPERR), fault addr 0x0', note: 'Signal 11 = invalid memory access. fault addr 0x0 = a NULL pointer dereference — the C++ cousin of an NPE.' },
      { text: 'backtrace:' },
      { text: '  #00 pc 0004a3c0  /vendor/lib64/libvibrator-impl.so (VibratorImpl::on+64)', note: 'Frame #00 = where it died. A /vendor/ library → the bug is in the HAL, not the framework. The library path assigns the blame.' },
      { text: '  #01 pc 000123f8  /system/lib64/libbinder.so (…)', note: 'The caller frames: the crash happened while serving a Binder transaction — someone called this HAL and it fell over.' },
    ],
  },
  {
    id: 'watchdog',
    label: 'Watchdog',
    intro: 'The framework watching itself: if a core system_server thread or lock stays stuck ~60 s, Watchdog pulls the plug.',
    lines: [
      { text: 'WATCHDOG KILLING SYSTEM PROCESS: Blocked in monitor', note: 'Watchdog periodically posts a ping to each core handler thread and tries key locks. No answer for ~60 s → it kills system_server itself.' },
      { text: '  Blocked in monitor com.android.server.am.ActivityManagerService', note: 'Which service’s lock was stuck — here someone is holding the AMS lock far too long.' },
      { text: '  … system_server exiting …', note: 'And you know this chain from the boot topic: system_server dies → Zygote kills itself → init restarts the Java world → SOFT REBOOT. A device “randomly rebooting” with this log is not random at all.' },
    ],
  },
];

export function CrashSignatures() {
  const [tab, setTab] = useState('java');
  const [openLine, setOpenLine] = useState<number | null>(null);
  const sig = SIGS.find((s) => s.id === tab)!;

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        Reading the Four Deaths <span className="not-italic">:-</span>
      </h3>
      <p className="mb-3 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Every failure type leaves a different signature. Click the glowing lines to decode them.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {SIGS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setTab(s.id); setOpenLine(null); }}
            className={cn(
              'rounded-lg border-2 px-3 py-1.5 text-xs font-bold transition-colors',
              tab === s.id ? 'border-[#d7b155] bg-[#2a2310] text-[#f3dc9b]' : 'border-[#4a3d1c] text-[#9a874f] hover:border-[#8a7030]',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mb-2 text-[12px] italic" style={{ color: '#bda367' }}>{sig.intro}</div>

      <div className="rounded-xl border border-[#4a3d1c] bg-[#0e0b05] p-3 font-mono text-[11px] leading-relaxed">
        {sig.lines.map((l, i) => (
          <div key={i}>
            <button
              onClick={() => l.note && setOpenLine(openLine === i ? null : i)}
              className={cn('block w-full whitespace-pre-wrap text-left', l.note && 'rounded px-1 transition-colors hover:bg-[#241e0e]')}
              style={{
                color: l.note ? '#f3dc9b' : '#8d8268',
                textShadow: l.note && openLine !== i ? '0 0 10px rgba(215,177,85,0.4)' : undefined,
                cursor: l.note ? 'pointer' : 'default',
              }}
            >
              {l.text}
            </button>
            <AnimatePresence>
              {openLine === i && l.note && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="my-1.5 rounded-lg border border-[#4a3d1c] bg-[#161208] px-3 py-2 font-sans text-[12px] leading-relaxed" style={{ color: '#ded4ba' }}>
                    {l.note}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        Java crash → logcat -b crash · ANR → /data/anr/ · native → /data/tombstones/ · watchdog → the event log before a soft reboot.
      </div>
    </div>
  );
}
