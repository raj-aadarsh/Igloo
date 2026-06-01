import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Boxes, Plus, Minus, Cpu } from 'lucide-react';
import { cn } from '@/lib/cn';

let pid = 0;
interface Pod { id: number; node: number; }

const NODES = 2;

export function K8sArchitecture() {
  const [desired, setDesired] = useState(4);
  const [pods, setPods] = useState<Pod[]>(() => Array.from({ length: 4 }, (_, i) => ({ id: ++pid, node: i % NODES })));
  const [healing, setHealing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reconcile loop: nudge running pods toward desired (what the controller does).
  const reconcile = (target: number) => {
    setPods((prev) => {
      let next = [...prev];
      while (next.length > target) next.pop();
      while (next.length < target) next.push({ id: ++pid, node: next.length % NODES });
      return next;
    });
  };

  const scale = (delta: number) => {
    const t = Math.max(0, Math.min(8, desired + delta));
    setDesired(t); reconcile(t);
  };

  const killPod = () => {
    setPods((prev) => prev.slice(0, -1)); // a pod crashes
    setHealing(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { reconcile(desired); setHealing(false); }, 1400); // controller recreates it
  };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const running = pods.length;
  const podsOn = (n: number) => pods.filter((p) => p.node === n);

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">A Kubernetes cluster — scale it, or kill a pod and watch it self-heal</div>

      {/* Control plane */}
      <div className="mb-2 rounded-xl border border-accent-400 bg-accent-500/5 p-2">
        <div className="mb-1 text-center text-[10px] font-bold uppercase tracking-wide text-accent-700 dark:text-accent-300">Control plane (the brain)</div>
        <div className="flex flex-wrap justify-center gap-1 text-[10px] font-mono">
          {['API server', 'Scheduler', 'etcd', 'Controller mgr'].map((c) => (
            <span key={c} className="rounded-md border border-border bg-surface px-2 py-0.5 text-muted">{c}</span>
          ))}
        </div>
      </div>

      {/* Worker nodes */}
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: NODES }).map((_, n) => (
          <div key={n} className="rounded-xl border border-border bg-surface-2/30 p-2">
            <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-muted"><Cpu size={12} /> Worker node {n + 1} · kubelet</div>
            <div className="flex min-h-[52px] flex-wrap content-start gap-1">
              <AnimatePresence>
                {podsOn(n).map((p) => (
                  <motion.div key={p.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    className="flex h-9 w-9 flex-col items-center justify-center rounded-md border border-brand-400 bg-brand-500/10 text-brand-600 dark:text-brand-300" title={`pod-${p.id}`}>
                    <Boxes size={15} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted">Deployment replicas:</span>
        <button onClick={() => scale(-1)} className="rounded-lg border border-border p-1 hover:bg-surface-2"><Minus size={14} /></button>
        <span className="font-mono text-sm font-bold">{desired}</span>
        <button onClick={() => scale(1)} className="rounded-lg border border-border p-1 hover:bg-surface-2"><Plus size={14} /></button>
        <button onClick={killPod} disabled={running === 0} className="ml-2 rounded-lg border border-rose-300 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-500/20 disabled:opacity-40 dark:text-rose-300">💥 kill a pod</button>
        <span className={cn('ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold', running === desired ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300')}>
          desired {desired} · running {running}{healing && ' · healing…'}
        </span>
      </div>

      <p className="mt-3 text-xs text-muted">
        You declare a <strong>desired state</strong> ("I want {desired} replicas"); the control plane’s controllers continuously <strong>reconcile</strong> reality to match it. Kill a pod and the controller notices running &lt; desired and <strong>recreates it automatically</strong> — that’s self-healing. Scaling is just changing the desired number. This declarative, self-healing model is the whole point of Kubernetes.
      </p>
    </div>
  );
}
