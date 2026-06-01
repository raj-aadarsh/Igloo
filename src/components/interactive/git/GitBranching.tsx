import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const X = (i: number) => 42 + i * 62;
const Y_MAIN = 48, Y_FEAT = 104;

interface C { id: string; x: number; y: number; appears: number; label: string; }
const COMMITS: C[] = [
  { id: 'c1', x: X(0), y: Y_MAIN, appears: 0, label: 'C1' },
  { id: 'c2', x: X(1), y: Y_MAIN, appears: 0, label: 'C2' },
  { id: 'c3', x: X(2), y: Y_FEAT, appears: 2, label: 'C3' },
  { id: 'c4', x: X(2), y: Y_MAIN, appears: 3, label: 'C4' },
  { id: 'c5', x: X(3), y: Y_MAIN, appears: 4, label: 'C5' },
];
const EDGES: [string, string, number][] = [['c1', 'c2', 0], ['c2', 'c3', 2], ['c2', 'c4', 3], ['c4', 'c5', 4], ['c3', 'c5', 4]];
const pos = (id: string) => COMMITS.find((c) => c.id === id)!;

const STEPS = [
  'Two commits on the main branch. A commit is a snapshot of your project + a pointer to its parent.',
  'Created branch "feature" — it’s just a lightweight, movable pointer to the current commit (C2). Branching is instant & cheap in Git.',
  'Switched to feature and committed C3. The feature branch advances; main stays put.',
  'Meanwhile main got commit C4. The two branches have now diverged — independent lines of work.',
  'Merged feature into main: a merge commit C5 has TWO parents (C4 + C3), tying the histories together. main now includes the feature.',
];

export function GitBranching() {
  const [step, setStep] = useState(0);
  // main label sits on latest main commit visible; feature label on latest feature commit.
  const mainAt = step >= 4 ? 'c5' : step >= 3 ? 'c4' : 'c2';
  const featAt = step >= 2 ? 'c3' : 'c2';
  const featureExists = step >= 1;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Branching & merging — step through a feature workflow</div>

      <div className="rounded-xl border border-border bg-surface-2/30 p-2">
        <svg viewBox="0 0 290 150" className="w-full">
          {/* edges */}
          {EDGES.filter(([, , at]) => at <= step).map(([a, b]) => {
            const pa = pos(a), pb = pos(b);
            return <line key={a + b} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className="stroke-border" strokeWidth="2.5" />;
          })}
          {/* commits */}
          {COMMITS.filter((c) => c.appears <= step).map((c) => (
            <motion.g key={c.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <circle cx={c.x} cy={c.y} r="13" className={cn(c.y === Y_FEAT ? 'fill-accent-500/20 stroke-accent-500' : 'fill-brand-500/20 stroke-brand-500')} strokeWidth="2" />
              <text x={c.x} y={c.y + 4} textAnchor="middle" className="fill-current text-[10px] font-bold">{c.label}</text>
            </motion.g>
          ))}
          {/* branch labels */}
          <motion.g layout animate={{ x: pos(mainAt).x - 18, y: 12 }}>
            <rect width="36" height="15" rx="7" className="fill-brand-500" />
            <text x="18" y="11" textAnchor="middle" className="fill-white text-[9px] font-bold">main</text>
          </motion.g>
          {featureExists && (
            <motion.g layout animate={{ x: pos(featAt).x - 22, y: Y_FEAT + 20 }}>
              <rect width="44" height="15" rx="7" className="fill-accent-500" />
              <text x="22" y="11" textAnchor="middle" className="fill-white text-[9px] font-bold">feature</text>
            </motion.g>
          )}
        </svg>
      </div>

      <motion.div key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3 text-sm text-muted">{STEPS[step]}</motion.div>

      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={step === 4} className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50">Next step →</button>
        <button onClick={() => setStep(0)} className="text-xs text-muted hover:text-text">Reset</button>
        <span className="ml-auto text-xs text-muted">{step + 1} / 5</span>
      </div>
    </div>
  );
}
