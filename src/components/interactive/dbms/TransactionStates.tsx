import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const states = [
  { id: 'active', label: 'Active', x: 12, y: 42, blurb: 'The transaction is executing its read/write operations. Changes live in a buffer in memory.' },
  { id: 'partial', label: 'Partially Committed', x: 42, y: 16, blurb: 'The last operation has executed, but the changes are still only in the buffer — not yet on disk.' },
  { id: 'committed', label: 'Committed', x: 74, y: 16, blurb: 'All changes are safely written to disk. The transaction is now durable and permanent.' },
  { id: 'failed', label: 'Failed', x: 42, y: 70, blurb: 'A failure occurred (in Active or Partially Committed) so execution can’t continue.' },
  { id: 'aborted', label: 'Aborted', x: 74, y: 70, blurb: 'The transaction has been rolled back — all its changes undone, database restored.' },
  { id: 'terminated', label: 'Terminated', x: 93, y: 42, blurb: 'End of life. Reached after Committed or Aborted.' },
];

const edges = [
  { from: 'active', to: 'partial', label: 'last op done' },
  { from: 'active', to: 'failed', label: 'failure' },
  { from: 'partial', to: 'committed', label: 'changes on disk' },
  { from: 'partial', to: 'failed', label: 'failure' },
  { from: 'failed', to: 'aborted', label: 'rollback' },
  { from: 'committed', to: 'terminated', label: '' },
  { from: 'aborted', to: 'terminated', label: '' },
];

const pos = (id: string) => states.find((s) => s.id === id)!;

export function TransactionStates() {
  const [active, setActive] = useState('active');
  const cur = states.find((s) => s.id === active)!;
  const rel = edges.filter((e) => e.from === active || e.to === active);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Transaction lifecycle — tap a state</p>
      <svg viewBox="0 0 100 84" className="w-full">
        {edges.map((e, i) => {
          const a = pos(e.from), b = pos(e.to);
          const on = e.from === active || e.to === active;
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? 'rgb(var(--brand-glow))' : 'rgb(var(--border))'} strokeWidth={on ? 0.8 : 0.5} opacity={on ? 1 : 0.5} />;
        })}
        {states.map((s) => (
          <g key={s.id} onClick={() => setActive(s.id)} className="cursor-pointer">
            <rect x={s.x - 11} y={s.y - 6} width="22" height="12" rx="2.5" className={cn('transition-all', active === s.id ? 'fill-brand-500' : 'fill-surface')} stroke="rgb(var(--brand-glow))" strokeWidth="0.5" />
            <text x={s.x} y={s.y + 1.3} textAnchor="middle" className={cn('text-[2.7px] font-bold', active === s.id ? 'fill-white' : 'fill-text')}>{s.label}</text>
          </g>
        ))}
      </svg>
      <motion.div key={cur.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
        <h4 className="font-bold">{cur.label}</h4>
        <p className="mt-1 text-sm text-muted">{cur.blurb}</p>
        <ul className="mt-2 space-y-0.5 text-xs text-muted">
          {rel.map((e, i) => <li key={i}><span className="font-mono text-text">{pos(e.from).label} → {pos(e.to).label}</span>{e.label && ` — ${e.label}`}</li>)}
        </ul>
      </motion.div>
    </div>
  );
}
