import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

// The process lifecycle as a clickable state machine.
const states = [
  { id: 'new', label: 'New', x: 8, y: 50, blurb: 'The process is being created — its PCB is set up but it isn’t ready to run yet.' },
  { id: 'ready', label: 'Ready', x: 34, y: 20, blurb: 'Loaded in memory and waiting for the CPU. The scheduler picks from here.' },
  { id: 'running', label: 'Running', x: 66, y: 20, blurb: 'Currently executing on the CPU. Only one process per CPU core is here at a time.' },
  { id: 'waiting', label: 'Waiting', x: 66, y: 78, blurb: 'Blocked on I/O or an event. It can’t use the CPU until the event completes.' },
  { id: 'terminated', label: 'Terminated', x: 92, y: 50, blurb: 'Finished (or killed). Its resources are reclaimed by the OS.' },
];

const edges = [
  { from: 'new', to: 'ready', label: 'admitted' },
  { from: 'ready', to: 'running', label: 'dispatch (scheduler)' },
  { from: 'running', to: 'ready', label: 'interrupt / time slice up' },
  { from: 'running', to: 'waiting', label: 'I/O or wait' },
  { from: 'waiting', to: 'ready', label: 'I/O done' },
  { from: 'running', to: 'terminated', label: 'exit' },
];

const pos = (id: string) => states.find((s) => s.id === id)!;

export function ProcessStates() {
  const [active, setActive] = useState('running');
  const cur = states.find((s) => s.id === active)!;
  const related = edges.filter((e) => e.from === active || e.to === active);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Tap a state — see how a process moves through its life</p>
      <svg viewBox="0 0 100 95" className="w-full">
        {edges.map((e, i) => {
          const a = pos(e.from), b = pos(e.to);
          const on = e.from === active || e.to === active;
          return (
            <line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={on ? 'rgb(var(--brand-glow))' : 'rgb(var(--border))'}
              strokeWidth={on ? 0.8 : 0.5}
              opacity={on ? 1 : 0.5}
            />
          );
        })}
        {states.map((s) => (
          <g key={s.id} onClick={() => setActive(s.id)} className="cursor-pointer">
            <circle
              cx={s.x} cy={s.y} r="9"
              className={cn('transition-all', active === s.id ? 'fill-brand-500' : 'fill-surface')}
              stroke="rgb(var(--brand-glow))" strokeWidth="0.6"
            />
            <text x={s.x} y={s.y + 1.2} textAnchor="middle" className={cn('text-[3.2px] font-bold', active === s.id ? 'fill-white' : 'fill-text')}>{s.label}</text>
          </g>
        ))}
      </svg>
      <motion.div key={cur.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
        <h4 className="font-bold">{cur.label}</h4>
        <p className="mt-1 text-sm text-muted">{cur.blurb}</p>
        <ul className="mt-2 space-y-0.5 text-xs text-muted">
          {related.map((e, i) => (
            <li key={i}>
              <span className="font-mono text-text">{pos(e.from).label} → {pos(e.to).label}</span> — {e.label}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
