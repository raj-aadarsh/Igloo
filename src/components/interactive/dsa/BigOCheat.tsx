import { useState } from 'react';
import { cn } from '@/lib/cn';

// A quick, tappable Big-O reference with a one-line gut-feel for each.
const rows = [
  { name: 'O(1)', label: 'Constant', blurb: 'Same time no matter the size. Array index, hash lookup, push/pop.', tone: 'text-emerald-500', n: () => 1 },
  { name: 'O(log n)', label: 'Logarithmic', blurb: 'Halves the work each step. Binary search, balanced-tree ops.', tone: 'text-emerald-500', n: (x: number) => Math.log2(x) },
  { name: 'O(n)', label: 'Linear', blurb: 'One pass over the data. A single loop.', tone: 'text-brand-500', n: (x: number) => x },
  { name: 'O(n log n)', label: 'Linearithmic', blurb: 'The best general sorting. Merge sort, heap sort.', tone: 'text-accent-500', n: (x: number) => x * Math.log2(x) },
  { name: 'O(n²)', label: 'Quadratic', blurb: 'Nested loops over the data. Fine for small n, slow for big.', tone: 'text-rose-500', n: (x: number) => x * x },
  { name: 'O(2ⁿ)', label: 'Exponential', blurb: 'Doubles every added element. Naive recursion — avoid for big n.', tone: 'text-rose-600', n: (x: number) => 2 ** x },
];

export function BigOCheat() {
  const [n, setN] = useState(16);
  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <label className="text-sm text-muted">
        For an input of size n = <span className="font-bold text-text">{n}</span>, roughly how many steps?
        <input type="range" min={1} max={32} value={n} onChange={(e) => setN(parseInt(e.target.value))} className="mt-1 w-full accent-brand-500" />
      </label>
      <div className="mt-4 space-y-2">
        {rows.map((r) => {
          const steps = Math.max(1, Math.round(r.n(n)));
          const cls = steps <= n ? 'bg-emerald-500' : steps <= n * Math.log2(Math.max(2, n)) ? 'bg-accent-500' : 'bg-rose-500';
          const pct = Math.min(100, (Math.log10(steps + 1) / Math.log10(2 ** 32)) * 100);
          return (
            <div key={r.name} className="flex items-center gap-3">
              <span className={cn('w-24 shrink-0 font-mono text-sm font-bold', r.tone)}>{r.name}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-border">
                <div className={cn('h-full rounded-full transition-all', cls)} style={{ width: `${pct}%` }} />
              </div>
              <span className="w-20 shrink-0 text-right font-mono text-xs text-muted">{steps.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted">
        Big-O describes how work grows as input grows — the single most-asked thing in interviews. Aim for the <strong className="text-emerald-600 dark:text-emerald-400">green</strong> ones; be suspicious of <strong className="text-rose-600 dark:text-rose-400">red</strong>.
      </p>
    </div>
  );
}
