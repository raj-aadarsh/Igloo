import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

// An array is a contiguous block of cells with integer indices. This lets you
// click a cell to see that indices start at 0 and access is instant (O(1)).
const data = [42, 7, 13, 99, 5, 28];

export function ArrayViz() {
  const [sel, setSel] = useState(2);
  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Click a cell — note the index starts at 0</p>
      <div className="flex flex-wrap gap-1.5">
        {data.map((v, i) => (
          <button key={i} onClick={() => setSel(i)} className="flex flex-col items-center">
            <motion.div
              animate={{ scale: sel === i ? 1.08 : 1 }}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono font-bold transition-colors',
                sel === i ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-text',
              )}
            >
              {v}
            </motion.div>
            <span className={cn('mt-1 font-mono text-xs', sel === i ? 'font-bold text-brand-600 dark:text-brand-300' : 'text-muted')}>{i}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 font-mono text-sm text-muted">
        <span className="text-text">arr[{sel}]</span> = <span className="font-bold text-brand-600 dark:text-brand-300">{data[sel]}</span>
        <span className="ml-3 text-xs">→ jumping straight to any index is <strong className="text-text">O(1)</strong> (instant).</span>
      </p>
    </div>
  );
}
