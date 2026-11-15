import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RichText } from '@/components/ui/RichText';
import { cn } from '@/lib/cn';

// The 5 logcat ring buffers + the kernel log, as tappable cards.
// Each shows what lands there, a real-looking line, and the command.

interface Buf {
  id: string;
  name: string;
  tag: string;
  border: string;
  text: string;
  holds: string;
  sample: string;
  cmd: string;
}

const BUFS: Buf[] = [
  {
    id: 'main',
    name: 'main',
    tag: 'app logs',
    border: '#8a7030',
    text: '#f3dc9b',
    holds: 'Everything apps write with `Log.d/i/w/e`. The noisiest buffer, so it rolls over fastest.',
    sample: 'D NoteRepo: loaded 42 notes in 18 ms',
    cmd: 'adb logcat -b main',
  },
  {
    id: 'system',
    name: 'system',
    tag: 'framework',
    border: '#d7b155',
    text: '#f3dc9b',
    holds: 'Framework logs written with `Slog`: AMS, WMS, PMS, Watchdog. Your home buffer for platform work.',
    sample: 'W ActivityManager: Slow operation: 1240ms so far, now at startProcess',
    cmd: 'adb logcat -b system',
  },
  {
    id: 'events',
    name: 'events',
    tag: 'milestones',
    border: '#6fae6a',
    text: '#b9e0b5',
    holds: 'Compact, structured records: `am_anr`, `am_crash`, `am_kill`, `am_proc_start`, `boot_progress_*`. Small, so it survives the longest — often the only evidence left.',
    sample: 'I am_anr  : [0,12873,com.example.notes,952745541,Input dispatching timed out]',
    cmd: 'adb logcat -b events',
  },
  {
    id: 'crash',
    name: 'crash',
    tag: 'deaths only',
    border: '#c0564a',
    text: '#eda89e',
    holds: 'Only `FATAL EXCEPTION` (Java) and `Fatal signal` (native) reports. Quiet, so crashes are never drowned out.',
    sample: 'E AndroidRuntime: FATAL EXCEPTION: main',
    cmd: 'adb logcat -b crash',
  },
  {
    id: 'radio',
    name: 'radio',
    tag: 'telephony',
    border: '#5a9bd4',
    text: '#b5d4ee',
    holds: 'RIL, modem and SIM logs. Ignore it unless the bug involves calls, SMS or mobile data — then it is everything.',
    sample: 'D RILJ    : [3812]> SETUP_DATA_CALL',
    cmd: 'adb logcat -b radio',
  },
  {
    id: 'kernel',
    name: 'kernel',
    tag: 'outside logcat',
    border: '#b06ab0',
    text: '#e0b5e0',
    holds: 'The kernel’s own log: drivers, lmkd kills, `avc: denied`. Live via `dmesg`; the copy from **before** a reboot lives in pstore (`/sys/fs/pstore/console-ramoops`).',
    sample: '[  812.4411] type=1400 audit: avc: denied { read } for comm="rild" ...',
    cmd: 'adb shell dmesg',
  },
];

export function LogBuffers() {
  const [sel, setSel] = useState('events');
  const b = BUFS.find((x) => x.id === sel)!;

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        Where Logs Live <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Five separate ring buffers in logcat, plus the kernel log outside it. Tap one.
      </p>

      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        {BUFS.map((x) => (
          <button
            key={x.id}
            onClick={() => setSel(x.id)}
            className={cn('rounded-lg border-2 px-1.5 py-2 text-center transition-all', sel === x.id ? 'bg-[#221d10]' : 'bg-[#161208] hover:bg-[#1c1810]')}
            style={{ borderColor: sel === x.id ? x.border : '#2e2817', boxShadow: sel === x.id ? `0 0 14px ${x.border}55` : undefined }}
          >
            <div className="font-mono text-[13px] font-bold" style={{ color: x.text }}>{x.name}</div>
            <div className="text-[9.5px]" style={{ color: '#8d8268' }}>{x.tag}</div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={b.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-3 rounded-xl border-2 p-3"
          style={{ borderColor: b.border, background: '#161208' }}
        >
          <div className="text-[12.5px] leading-relaxed" style={{ color: '#ded4ba' }}><RichText>{b.holds}</RichText></div>
          <div className="mt-2 rounded-md bg-[#0e0b05] px-2 py-1.5 font-mono text-[10.5px]" style={{ color: b.text }}>{b.sample}</div>
          <div className="mt-1.5 font-mono text-[10.5px]" style={{ color: '#8fd48a' }}>$ {b.cmd}</div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        Grab everything at once: adb logcat -b all -v threadtime -d
      </div>
    </div>
  );
}
