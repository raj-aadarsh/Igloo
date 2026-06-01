import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface TState {
  id: string;
  label: string;
  desc: string;
  enters: string;
}

const STATES: TState[] = [
  { id: 'NEW', label: 'NEW', desc: 'The Thread object is created but start() hasn’t been called yet. It isn’t alive.', enters: 'new Thread(r)' },
  { id: 'RUNNABLE', label: 'RUNNABLE', desc: 'Eligible to run — either running on a CPU or waiting for the OS scheduler to give it a core. Java merges "ready" and "running" into this one state.', enters: 'start()' },
  { id: 'BLOCKED', label: 'BLOCKED', desc: 'Waiting to acquire a monitor lock (e.g. to enter a synchronized block already held by another thread).', enters: 'contended synchronized' },
  { id: 'WAITING', label: 'WAITING', desc: 'Waiting indefinitely for another thread to signal it — via Object.wait(), Thread.join(), or LockSupport.park() with no timeout.', enters: 'wait() / join()' },
  { id: 'TIMED_WAITING', label: 'TIMED_WAITING', desc: 'Waiting for up to a specified time — sleep(ms), wait(ms), join(ms). Returns to RUNNABLE when the time elapses or it’s notified.', enters: 'sleep(ms)' },
  { id: 'TERMINATED', label: 'TERMINATED', desc: 'run() has completed (or threw). The thread is dead and cannot be restarted.', enters: 'run() returns' },
];

export function ThreadLifecycle() {
  const [active, setActive] = useState('NEW');
  const s = STATES.find((x) => x.id === active)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">The 6 Java thread states (Thread.State) — tap one</div>
      <div className="flex flex-wrap gap-1.5">
        {STATES.map((st) => (
          <button
            key={st.id}
            onClick={() => setActive(st.id)}
            className={cn(
              'rounded-lg border px-2.5 py-1.5 font-mono text-xs font-bold transition-colors',
              st.id === active ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2',
            )}
          >
            {st.label}
          </button>
        ))}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-mono text-sm font-bold">{s.label}</span>
          <span className="rounded-full bg-accent-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-700 dark:text-accent-300">enter via: {s.enters}</span>
        </div>
        <p className="text-sm text-muted">{s.desc}</p>
      </motion.div>

      <p className="mt-2 text-xs text-muted">
        Typical flow: <span className="font-mono">NEW → RUNNABLE</span> (start) → may bounce to <span className="font-mono">BLOCKED/WAITING/TIMED_WAITING</span> and back to <span className="font-mono">RUNNABLE</span> → <span className="font-mono">TERMINATED</span> when run() finishes.
      </p>
    </div>
  );
}
