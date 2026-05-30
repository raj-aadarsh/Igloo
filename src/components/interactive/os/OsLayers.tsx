import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

// The classic "onion" view of a computer system: user apps on top, hardware at
// the bottom, the OS kernel in between — reachable only through system calls.
const layers = [
  { id: 'apps', label: 'User Applications', mode: 'user', blurb: 'Browsers, editors, games — programs you run. They can’t touch hardware directly; they must ask the OS.', color: 'from-brand-300 to-brand-200 dark:from-brand-800/70 dark:to-brand-800/40' },
  { id: 'syscall', label: 'System Call Interface', mode: 'boundary', blurb: 'The guarded doorway between user programs and the kernel. A system call (e.g. read, write, fork) switches the CPU from user mode to kernel mode.', color: 'from-accent-300 to-accent-200 dark:from-accent-800/60 dark:to-accent-800/40' },
  { id: 'kernel', label: 'Kernel', mode: 'kernel', blurb: 'The core of the OS: the process scheduler, memory manager, file system, and device/I-O management. Runs in privileged kernel mode.', color: 'from-violet-300 to-violet-200 dark:from-violet-800/70 dark:to-violet-800/40' },
  { id: 'hw', label: 'Hardware', mode: 'hardware', blurb: 'CPU, RAM, disk, devices. Only the kernel talks to it directly — that protection is what keeps one buggy app from crashing the whole machine.', color: 'from-slate-300 to-slate-200 dark:from-slate-700/70 dark:to-slate-700/40' },
];

export function OsLayers() {
  const [active, setActive] = useState('kernel');
  const cur = layers.find((l) => l.id === active)!;

  return (
    <div className="my-6 grid items-center gap-6 rounded-2xl border border-border bg-surface-2/50 p-5 sm:grid-cols-2">
      <div className="space-y-2">
        {layers.map((l) => (
          <button
            key={l.id}
            onClick={() => setActive(l.id)}
            className={cn(
              'flex w-full items-center justify-between rounded-xl bg-gradient-to-r px-4 py-3 text-left text-sm font-bold transition-all',
              l.color,
              active === l.id ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-bg' : 'hover:brightness-105',
            )}
          >
            <span className="text-text/80">{l.label}</span>
            {l.mode === 'user' && <span className="chip">user mode</span>}
            {l.mode === 'kernel' && <span className="chip">kernel mode</span>}
            {l.mode === 'boundary' && <span className="text-xs text-text/60">⇅ mode switch</span>}
          </button>
        ))}
      </div>
      <motion.div key={cur.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <h4 className="text-lg font-bold">{cur.label}</h4>
        <p className="mt-1 text-sm leading-6 text-muted">{cur.blurb}</p>
        <p className="mt-3 text-xs text-muted">Tap a layer. Notice apps never reach hardware directly — every request flows through a <strong className="text-text">system call</strong> into the kernel.</p>
      </motion.div>
    </div>
  );
}
