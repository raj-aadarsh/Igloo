import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/primitives';
import { ArrowDown, ArrowUp } from 'lucide-react';

// Push/pop on a stack — Last In, First Out. Only the top is reachable.
export function StackViz() {
  const [stack, setStack] = useState<number[]>([3, 7, 1]);
  const [next, setNext] = useState(8);

  const push = () => {
    setStack((s) => [...s, next]);
    setNext((n) => (n * 7 + 3) % 100);
  };
  const pop = () => setStack((s) => s.slice(0, -1));

  return (
    <div className="my-6 grid gap-5 rounded-2xl border border-border bg-surface-2/50 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="flex flex-col items-center">
        <span className="mb-1 text-xs font-semibold uppercase text-muted">top ↑</span>
        <div className="flex w-28 flex-col-reverse gap-1.5 rounded-xl border-2 border-dashed border-border p-2" style={{ minHeight: 180 }}>
          <AnimatePresence mode="popLayout">
            {stack.map((v, i) => (
              <motion.div
                key={`${v}-${i}`}
                layout
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex h-10 items-center justify-center rounded-lg font-mono font-bold ${i === stack.length - 1 ? 'bg-brand-500 text-white' : 'bg-surface text-text'}`}
              >
                {v}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div>
        <div className="flex gap-2">
          <Button size="sm" onClick={push}><ArrowDown size={15} /> push({next})</Button>
          <Button size="sm" variant="outline" onClick={pop} disabled={!stack.length}><ArrowUp size={15} /> pop()</Button>
        </div>
        <p className="mt-3 text-sm text-muted">
          A stack is <strong className="text-text">LIFO</strong> — Last In, First Out. You can only touch the <strong className="text-text">top</strong>. Both <code className="rounded bg-surface px-1">push</code> and <code className="rounded bg-surface px-1">pop</code> are <strong className="text-text">O(1)</strong>.
        </p>
        <p className="mt-2 text-xs text-muted">Think: a stack of plates — you add and remove from the top.</p>
      </div>
    </div>
  );
}
