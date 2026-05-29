import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/primitives';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

// Visualizes a fixed-size sliding window summing k=3 consecutive elements —
// the core idea that turns an O(n*k) scan into a single O(n) pass.
const data = [1, 4, 2, 10, 2, 3, 1, 0, 20];
const K = 3;

export function SlidingWindowViz() {
  const [start, setStart] = useState(0);
  const maxStart = data.length - K;
  const windowSum = data.slice(start, start + K).reduce((a, b) => a + b, 0);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">A window of size k = 3 slides right by one each step</p>
      <div className="flex flex-wrap gap-1.5">
        {data.map((v, i) => {
          const inWindow = i >= start && i < start + K;
          return (
            <motion.div
              key={i}
              animate={{ y: inWindow ? -4 : 0 }}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono font-bold',
                inWindow ? 'border-accent-500 bg-accent-500/20 text-text' : 'border-border bg-surface text-muted',
              )}
            >
              {v}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button size="sm" onClick={() => setStart((s) => Math.min(maxStart, s + 1))} disabled={start >= maxStart}>
          Slide <ChevronRight size={16} />
        </Button>
        <Button size="sm" variant="outline" onClick={() => setStart(0)}><RotateCcw size={15} /> Reset</Button>
        <span className="font-mono text-sm text-muted">window sum = <span className="font-bold text-accent-600 dark:text-accent-400">{windowSum}</span></span>
      </div>
      <p className="mt-3 text-xs text-muted">
        When you slide, you <strong className="text-text">add the new element and subtract the one that left</strong> — no need to re-add the whole window. That's the trick: <strong className="text-text">O(n)</strong> instead of O(n·k).
      </p>
    </div>
  );
}
