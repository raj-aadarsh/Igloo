import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Boxes, Cpu, Zap } from 'lucide-react';

let seq = 0;

export function MessageQueue() {
  const [queue, setQueue] = useState<number[]>([]);
  const [processed, setProcessed] = useState(0);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // A consumer pulls one message roughly every 900ms (steady processing rate).
  useEffect(() => {
    timer.current = setInterval(() => {
      setQueue((q) => {
        if (q.length === 0) { setBusy(false); return q; }
        setBusy(true);
        setProcessed((p) => p + 1);
        return q.slice(1);
      });
    }, 900);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const produce = (n: number) => setQueue((q) => [...q, ...Array.from({ length: n }, () => ++seq)]);

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Message queue — producer & consumer, decoupled</div>

      <div className="flex items-stretch gap-2">
        {/* Producer */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-brand-400 bg-brand-500/10 p-3">
          <Send size={20} className="text-brand-600 dark:text-brand-300" />
          <span className="text-[11px] font-bold">Producer</span>
          <button onClick={() => produce(1)} className="rounded-md bg-brand-500 px-2 py-1 text-[11px] font-semibold text-white hover:bg-brand-600">+1</button>
          <button onClick={() => produce(6)} className="rounded-md border border-brand-400 px-2 py-1 text-[11px] font-semibold text-brand-700 dark:text-brand-300">burst +6</button>
        </div>

        {/* Queue */}
        <div className="flex flex-1 flex-col rounded-xl border border-border bg-surface-2/30 p-2">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted"><Boxes size={13} className="text-accent-500" /> Queue (FIFO) · depth {queue.length}</div>
          <div className="flex flex-1 items-center gap-1 overflow-hidden">
            <span className="text-[9px] text-muted">out →</span>
            <div className="flex flex-1 flex-row-reverse items-center justify-end gap-1">
              <AnimatePresence mode="popLayout">
                {queue.slice(0, 10).map((id) => (
                  <motion.div key={id} layout initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-400/70 font-mono text-[10px] font-bold text-white">
                    {id}
                  </motion.div>
                ))}
              </AnimatePresence>
              {queue.length > 10 && <span className="text-[10px] text-muted">+{queue.length - 10}</span>}
            </div>
            <span className="text-[9px] text-muted">← in</span>
          </div>
        </div>

        {/* Consumer */}
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border p-3">
          <motion.div animate={busy ? { rotate: [0, 15, -15, 0] } : {}} transition={{ repeat: busy ? Infinity : 0, duration: 0.6 }}>
            <Cpu size={20} className={busy ? 'text-emerald-500' : 'text-muted'} />
          </motion.div>
          <span className="text-[11px] font-bold">Consumer</span>
          <span className="text-[10px] text-muted">{busy ? 'processing…' : 'idle'}</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{processed} done</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        Hit <strong>burst +6</strong>: the producer doesn’t wait — messages <strong>buffer</strong> in the queue and the consumer drains them at its own steady rate. That decoupling smooths spikes, lets each side scale independently, and survives consumer downtime. This is the heart of <span className="font-mono">async</span> processing with <Zap size={11} className="inline text-accent-500" /> Kafka / RabbitMQ / SQS.
      </p>
    </div>
  );
}
