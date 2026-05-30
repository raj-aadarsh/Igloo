import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/primitives';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

const CAP = 5;

// A bounded buffer you drive by hand. The producer blocks when full, the
// consumer blocks when empty — exactly what semaphores coordinate.
export function ProducerConsumer() {
  const [buf, setBuf] = useState<number[]>([2, 7]);
  const [next, setNext] = useState(8);
  const [msg, setMsg] = useState('Ready. Try producing and consuming.');

  const produce = () => {
    if (buf.length >= CAP) { setMsg('Buffer FULL → producer blocks (waits on the "empty" semaphore).'); return; }
    setBuf((b) => [...b, next]);
    setNext((n) => (n * 7 + 3) % 100);
    setMsg('Produced an item (signalled "full").');
  };
  const consume = () => {
    if (buf.length === 0) { setMsg('Buffer EMPTY → consumer blocks (waits on the "full" semaphore).'); return; }
    setBuf((b) => b.slice(1));
    setMsg('Consumed an item (signalled "empty").');
  };
  const reset = () => { setBuf([2, 7]); setMsg('Reset.'); };

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Bounded buffer — capacity {CAP}</p>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: CAP }).map((_, i) => {
          const item = buf[i];
          const filled = item !== undefined;
          return (
            <div key={i} className={cn('flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono font-bold', filled ? 'border-brand-500 bg-brand-500/15' : 'border-dashed border-border text-muted')}>
              <AnimatePresence mode="popLayout">
                {filled && <motion.span key={item} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}>{item}</motion.span>}
              </AnimatePresence>
              {!filled && '·'}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={produce} disabled={buf.length >= CAP}><Plus size={15} /> Produce</Button>
        <Button size="sm" variant="outline" onClick={consume} disabled={buf.length === 0}><Minus size={15} /> Consume</Button>
        <Button size="sm" variant="ghost" onClick={reset}><RotateCcw size={14} /> Reset</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 font-mono text-xs text-muted">
        <span>empty = <strong className="text-text">{CAP - buf.length}</strong></span>
        <span>full = <strong className="text-text">{buf.length}</strong></span>
        <span>mutex = <strong className="text-text">1</strong></span>
      </div>
      <p className="mt-2 text-sm text-muted">{msg}</p>
      <p className="mt-2 text-xs text-muted">Two counting semaphores (<strong className="text-text">empty</strong>, <strong className="text-text">full</strong>) coordinate when to block; a <strong className="text-text">mutex</strong> protects the buffer so producer and consumer never corrupt it at the same time.</p>
    </div>
  );
}
