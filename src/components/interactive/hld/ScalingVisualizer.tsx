import { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Scale } from 'lucide-react';
import { cn } from '@/lib/cn';

export function ScalingVisualizer() {
  const [mode, setMode] = useState<'vertical' | 'horizontal'>('horizontal');

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted">Two ways to scale — flip between them</span>
        <div className="ml-auto inline-flex rounded-lg border border-border p-0.5 text-xs font-semibold">
          <button onClick={() => setMode('vertical')} className={cn('rounded-md px-2.5 py-1', mode === 'vertical' ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300' : 'text-muted')}>Vertical (scale up)</button>
          <button onClick={() => setMode('horizontal')} className={cn('rounded-md px-2.5 py-1', mode === 'horizontal' ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300' : 'text-muted')}>Horizontal (scale out)</button>
        </div>
      </div>

      <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-surface-2/30 p-4">
        {mode === 'vertical' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-2">
            <motion.div initial={{ height: 60 }} animate={{ height: 120 }} className="flex w-28 flex-col items-center justify-center gap-1 rounded-xl border-2 border-brand-400 bg-brand-500/10">
              <Server size={26} className="text-brand-600 dark:text-brand-300" />
              <span className="text-[11px] font-bold">1 big server</span>
              <span className="text-[10px] text-muted">+CPU +RAM</span>
            </motion.div>
            <span className="text-xs text-muted">Make the single machine more powerful</span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg border border-accent-400 bg-accent-500/10 px-3 py-1.5">
              <Scale size={16} className="text-accent-600 dark:text-accent-300" /><span className="text-[11px] font-bold">Load Balancer</span>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex w-16 flex-col items-center gap-1 rounded-xl border-2 border-brand-400 bg-brand-500/10 py-2">
                  <Server size={18} className="text-brand-600 dark:text-brand-300" />
                  <span className="text-[9px] font-bold">node {i + 1}</span>
                </motion.div>
              ))}
            </div>
            <span className="text-xs text-muted">Add more commodity machines behind a load balancer</span>
          </div>
        )}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className={cn('rounded-xl border p-3 text-sm', mode === 'vertical' ? 'border-brand-400 bg-brand-500/5' : 'border-border opacity-60')}>
          <div className="font-bold">Vertical (scale up)</div>
          <p className="mt-1 text-muted"><span className="text-emerald-600 dark:text-emerald-400">+</span> Simple, no code changes. <br /><span className="text-rose-600 dark:text-rose-400">−</span> Hard ceiling (one machine), single point of failure, costly at the top end.</p>
        </div>
        <div className={cn('rounded-xl border p-3 text-sm', mode === 'horizontal' ? 'border-brand-400 bg-brand-500/5' : 'border-border opacity-60')}>
          <div className="font-bold">Horizontal (scale out)</div>
          <p className="mt-1 text-muted"><span className="text-emerald-600 dark:text-emerald-400">+</span> Near-limitless, fault-tolerant, cheap commodity nodes. <br /><span className="text-rose-600 dark:text-rose-400">−</span> Needs a load balancer + <strong>stateless</strong> servers and distributed data.</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">Real systems do both, but <strong>horizontal scaling</strong> is the backbone of web-scale design — which is why statelessness, load balancing, and distributed data dominate this course.</p>
    </div>
  );
}
