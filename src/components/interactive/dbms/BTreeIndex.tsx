import { useState } from 'react';
import { cn } from '@/lib/cn';

const leaves = [
  { keys: [10, 20], cx: 20 },
  { keys: [30, 40, 50], cx: 50 },
  { keys: [60, 70, 80], cx: 80 },
];
const rootKeys = [30, 60];

function leafFor(k: number) {
  if (k < 30) return 0;
  if (k < 60) return 1;
  return 2;
}

export function BTreeIndex() {
  const [sel, setSel] = useState<number | null>(70);
  const target = sel === null ? -1 : leafFor(sel);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">A B+ tree index — click a key to search for it</p>
      <svg viewBox="0 0 100 56" className="w-full" style={{ maxHeight: 220 }}>
        {/* root → leaf edges */}
        {leaves.map((l, i) => (
          <line key={i} x1="50" y1="16" x2={l.cx} y2="34" stroke={target === i ? 'rgb(var(--brand-glow))' : 'rgb(var(--border))'} strokeWidth={target === i ? 1 : 0.5} />
        ))}
        {/* leaf-to-leaf linked list (B+ tree feature) */}
        <line x1="30" y1="42" x2="40" y2="42" className="stroke-accent-400" strokeWidth="0.5" strokeDasharray="1 1" />
        <line x1="60" y1="42" x2="70" y2="42" className="stroke-accent-400" strokeWidth="0.5" strokeDasharray="1 1" />

        {/* root */}
        <g>
          <rect x="38" y="8" width="24" height="9" rx="1.5" className="fill-surface stroke-brand-500" strokeWidth="0.5" />
          {rootKeys.map((k, i) => <text key={k} x={44 + i * 11} y={14} textAnchor="middle" className="fill-text text-[3.5px] font-bold">{k}</text>)}
        </g>

        {/* leaves */}
        {leaves.map((l, i) => {
          const w = l.keys.length * 9;
          const x0 = l.cx - w / 2;
          return (
            <g key={i}>
              <rect x={x0} y="36" width={w} height="10" rx="1.5" className={cn(target === i ? 'fill-brand-500/15 stroke-brand-500' : 'fill-surface stroke-border')} strokeWidth="0.5" />
              {l.keys.map((k, j) => (
                <text
                  key={k}
                  x={x0 + 4.5 + j * 9}
                  y="42.5"
                  textAnchor="middle"
                  onClick={() => setSel(k)}
                  className={cn('cursor-pointer text-[3.5px] font-bold', sel === k ? 'fill-brand-600 dark:fill-brand-300' : 'fill-text')}
                >
                  {k}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      {sel !== null && (
        <p className="mt-2 text-sm text-muted">
          Searching for <strong className="text-text">{sel}</strong>: compare at the root (keys {rootKeys.join(', ')}) → follow to the {['left', 'middle', 'right'][target]} leaf → found in <strong className="text-text">2 levels</strong>. With millions of rows that’s only ~3–4 disk reads — that’s <strong className="text-text">O(log n)</strong>.
        </p>
      )}
      <p className="mt-2 text-xs text-muted"><strong className="text-text">B+ tree</strong>: all actual records live in the <em>leaves</em> (internal nodes hold only keys → shorter, faster tree), and the leaves are <strong className="text-text">linked</strong> (dashed) so range scans like <code>BETWEEN</code> are easy. That’s why almost every database index is a B+ tree.</p>
    </div>
  );
}
