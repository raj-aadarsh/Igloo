import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

// Node positions for the two layouts.
const POOR = [
  { x: 40, y: 35 }, { x: 150, y: 30 }, { x: 250, y: 55 },
  { x: 70, y: 110 }, { x: 180, y: 120 }, { x: 270, y: 110 },
];
// Edges in the poor layout: tangled, many cross-module links (high coupling).
const POOR_EDGES = [[0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [3, 5], [0, 5], [2, 4]];

const GOOD = [
  { x: 55, y: 40 }, { x: 110, y: 95 }, { x: 60, y: 120 },   // cluster 1
  { x: 230, y: 40 }, { x: 285, y: 95 }, { x: 235, y: 120 }, // cluster 2
];
// High cohesion within clusters; ONE link across (low coupling).
const GOOD_EDGES = [[0, 1], [1, 2], [0, 2], [3, 4], [4, 5], [3, 5], [1, 4]];

function Graph({ good }: { good: boolean }) {
  const nodes = good ? GOOD : POOR;
  const edges = good ? GOOD_EDGES : POOR_EDGES;
  return (
    <svg viewBox="0 0 330 160" className="w-full">
      {good && (
        <>
          <rect x="20" y="15" width="120" height="130" rx="12" className="fill-emerald-500/5 stroke-emerald-400/40" strokeDasharray="4 4" />
          <rect x="195" y="15" width="120" height="130" rx="12" className="fill-emerald-500/5 stroke-emerald-400/40" strokeDasharray="4 4" />
        </>
      )}
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          className={cn('stroke-current', good ? 'text-emerald-500/60' : 'text-rose-500/60')} strokeWidth="1.5" />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="13" className={cn('stroke-current', good ? 'fill-emerald-500/15 text-emerald-500' : 'fill-rose-500/15 text-rose-500')} strokeWidth="1.5" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" className="fill-current text-[10px] font-bold font-mono">C{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

export function CouplingCohesion() {
  const [good, setGood] = useState(false);
  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted">Coupling &amp; cohesion — flip the design</span>
        <div className="ml-auto inline-flex rounded-lg border border-border p-0.5">
          <button onClick={() => setGood(false)} className={cn('rounded-md px-2.5 py-1 text-xs font-semibold', !good ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300' : 'text-muted')}>Tangled</button>
          <button onClick={() => setGood(true)} className={cn('rounded-md px-2.5 py-1 text-xs font-semibold', good ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'text-muted')}>Clean</button>
        </div>
      </div>

      <motion.div key={good ? 'g' : 'b'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-surface-2/30 p-2">
        <Graph good={good} />
      </motion.div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className={cn('rounded-xl border p-3 text-sm', !good ? 'border-rose-400 bg-rose-500/5' : 'border-border opacity-60')}>
          <div className="font-bold text-rose-700 dark:text-rose-300">High coupling, low cohesion</div>
          <p className="mt-1 text-muted">Classes reach into each other everywhere; unrelated responsibilities are jumbled together. Change one thing → break many. Hard to test or reuse.</p>
        </div>
        <div className={cn('rounded-xl border p-3 text-sm', good ? 'border-emerald-400 bg-emerald-500/5' : 'border-border opacity-60')}>
          <div className="font-bold text-emerald-700 dark:text-emerald-300">Low coupling, high cohesion</div>
          <p className="mt-1 text-muted">Related classes group into focused modules (cohesion); modules talk through a few clear interfaces (low coupling). Easy to change, test, and reuse.</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted"><span className="font-semibold">The goal of good design:</span> low coupling + high cohesion. Almost every SOLID principle and pattern pushes you toward it.</p>
    </div>
  );
}
