import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';
import { cn } from '@/lib/cn';

type S = 'Stopped' | 'Playing' | 'Paused';
type Ev = 'play' | 'pause' | 'stop';

// Each state defines how it reacts to each event — that's the State pattern.
const TABLE: Record<S, Record<Ev, { next: S; msg: string }>> = {
  Stopped: {
    play: { next: 'Playing', msg: '▶ Starting playback from the top.' },
    pause: { next: 'Stopped', msg: 'Nothing to pause — already stopped.' },
    stop: { next: 'Stopped', msg: 'Already stopped.' },
  },
  Playing: {
    play: { next: 'Playing', msg: 'Already playing.' },
    pause: { next: 'Paused', msg: '⏸ Paused at current position.' },
    stop: { next: 'Stopped', msg: '⏹ Stopped and reset to start.' },
  },
  Paused: {
    play: { next: 'Playing', msg: '▶ Resuming from where you paused.' },
    pause: { next: 'Paused', msg: 'Already paused.' },
    stop: { next: 'Stopped', msg: '⏹ Stopped and reset to start.' },
  },
};

const EVENTS: { ev: Ev; label: string; icon: typeof Play }[] = [
  { ev: 'play', label: 'play()', icon: Play },
  { ev: 'pause', label: 'pause()', icon: Pause },
  { ev: 'stop', label: 'stop()', icon: Square },
];

const COLOR: Record<S, string> = {
  Stopped: 'text-muted',
  Playing: 'text-emerald-600 dark:text-emerald-400',
  Paused: 'text-amber-600 dark:text-amber-400',
};

export function StateDemo() {
  const [state, setState] = useState<S>('Stopped');
  const [msg, setMsg] = useState('Press play() to begin.');

  const fire = (ev: Ev) => {
    const t = TABLE[state][ev];
    setMsg(t.msg);
    setState(t.next);
  };

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">State — a media player where the same button does different things</div>

      {/* state badges */}
      <div className="flex items-center justify-center gap-2">
        {(['Stopped', 'Playing', 'Paused'] as S[]).map((s) => (
          <div key={s} className={cn('rounded-xl border px-4 py-2 font-mono text-sm font-bold transition-colors', s === state ? 'border-brand-400 bg-brand-500/10' : 'border-border opacity-50')}>
            <span className={s === state ? COLOR[s] : 'text-muted'}>{s}</span>
          </div>
        ))}
      </div>

      {/* event buttons */}
      <div className="mt-4 flex justify-center gap-2">
        {EVENTS.map(({ ev, label, icon: I }) => (
          <button key={ev} onClick={() => fire(ev)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-surface-2">
            <I size={14} /> {label}
          </button>
        ))}
      </div>

      <motion.div key={msg} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3 text-center text-sm">
        {msg}
      </motion.div>

      <p className="mt-2 text-xs text-muted">Notice <span className="font-mono">play()</span> means "start", "do nothing", or "resume" depending on the current state. Instead of <span className="font-mono">if/else</span> on a status flag, each state is its own class that knows how to handle each event.</p>
    </div>
  );
}
