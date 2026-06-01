import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const X = (i: number) => 42 + i * 60;
const TOP = 45, BOT = 100;

function Node({ x, y, label, tone }: { x: number; y: number; label: string; tone: 'main' | 'feat' | 'merge' }) {
  const cls = tone === 'feat' ? 'fill-accent-500/20 stroke-accent-500' : tone === 'merge' ? 'fill-emerald-500/25 stroke-emerald-500' : 'fill-brand-500/20 stroke-brand-500';
  return (
    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      <circle cx={x} cy={y} r="13" className={cls} strokeWidth="2" />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-current text-[9px] font-bold">{label}</text>
    </motion.g>
  );
}
const L = (x1: number, y1: number, x2: number, y2: number, k: string) => <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-border" strokeWidth="2.5" />;

export function MergeVsRebase() {
  const [mode, setMode] = useState<'merge' | 'rebase'>('merge');

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted">Merge vs Rebase — same diverged history, two outcomes</span>
        <div className="ml-auto inline-flex rounded-lg border border-border p-0.5 text-xs font-semibold">
          <button onClick={() => setMode('merge')} className={cn('rounded-md px-2.5 py-1', mode === 'merge' ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300' : 'text-muted')}>Merge</button>
          <button onClick={() => setMode('rebase')} className={cn('rounded-md px-2.5 py-1', mode === 'rebase' ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300' : 'text-muted')}>Rebase</button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface-2/30 p-2">
        <svg viewBox="0 0 300 140" className="w-full">
          {mode === 'merge' ? (
            <>
              {L(X(0), TOP, X(1), TOP, 'a')}{L(X(1), TOP, X(2), TOP, 'b')}{L(X(2), TOP, X(3), TOP, 'c')}
              {L(X(1), TOP, X(2), BOT, 'd')}{L(X(2), BOT, X(3), TOP, 'e')}
              <Node x={X(0)} y={TOP} label="C1" tone="main" /><Node x={X(1)} y={TOP} label="C2" tone="main" />
              <Node x={X(2)} y={TOP} label="C4" tone="main" /><Node x={X(2)} y={BOT} label="C3" tone="feat" />
              <Node x={X(3)} y={TOP} label="M" tone="merge" />
              <text x={X(3)} y={TOP - 18} textAnchor="middle" className="fill-current text-[8px] text-muted">merge commit</text>
            </>
          ) : (
            <>
              {L(X(0), TOP, X(1), TOP, 'a')}{L(X(1), TOP, X(2), TOP, 'b')}{L(X(2), TOP, X(3), TOP, 'c')}
              <Node x={X(0)} y={TOP} label="C1" tone="main" /><Node x={X(1)} y={TOP} label="C2" tone="main" />
              <Node x={X(2)} y={TOP} label="C4" tone="main" /><Node x={X(3)} y={TOP} label="C3'" tone="feat" />
              <text x={X(3)} y={TOP - 18} textAnchor="middle" className="fill-current text-[8px] text-muted">replayed, linear</text>
            </>
          )}
        </svg>
      </div>

      <motion.div key={mode} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3 text-sm text-muted">
        {mode === 'merge' ? (
          <><strong className="text-text">Merge</strong> creates a new <strong>merge commit (M)</strong> that joins the two branches. History is preserved exactly as it happened — but the graph is non-linear (lots of merge commits over time).</>
        ) : (
          <><strong className="text-text">Rebase</strong> replays your feature commits <em>on top of</em> the latest main (C3 → C3′), producing a clean <strong>linear history</strong> with no merge commit. But it <strong>rewrites commit hashes</strong>.</>
        )}
      </motion.div>

      <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-700/60 dark:bg-amber-900/20 dark:text-amber-200">
        <strong>The golden rule of rebasing:</strong> never rebase commits you’ve already pushed/shared — rewriting public history breaks everyone else’s clone. Rebase your <em>local</em> work; merge when it’s shared.
      </div>
    </div>
  );
}
