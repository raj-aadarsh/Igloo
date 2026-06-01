import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type Strat = 'recreate' | 'rolling' | 'bluegreen' | 'canary';
type Inst = 'v1' | 'v2' | 'down';

const INFO: Record<Strat, { label: string; downtime: string; desc: string }> = {
  recreate: { label: 'Recreate', downtime: 'Yes — brief outage', desc: 'Shut down all v1, then start v2. Simplest, but there’s downtime while nothing is running. Fine for dev or when brief downtime is acceptable.' },
  rolling: { label: 'Rolling', downtime: 'No', desc: 'Replace instances a few at a time — v1 and v2 run side by side until all are upgraded. Zero downtime; the default for Kubernetes Deployments. Rollback is slower (roll back instance by instance).' },
  bluegreen: { label: 'Blue-Green', downtime: 'No', desc: 'Run two full environments: Blue (v1, live) and Green (v2, idle). Test Green, then flip ALL traffic instantly. Instant rollback (flip back), but you pay for double the infrastructure.' },
  canary: { label: 'Canary', downtime: 'No', desc: 'Send a small % of traffic to v2 first; if metrics look healthy, gradually ramp to 100%. Limits the blast radius of a bad release — the safest for risky changes.' },
};

const STRATS: Strat[] = ['recreate', 'rolling', 'bluegreen', 'canary'];

export function DeploymentStrategies() {
  const [strat, setStrat] = useState<Strat>('rolling');
  const [insts, setInsts] = useState<Inst[]>(['v1', 'v1', 'v1', 'v1']);
  const [trafficV2, setTrafficV2] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const reset = (keep = false) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setInsts(['v1', 'v1', 'v1', 'v1']); setTrafficV2(0); if (!keep) setPlaying(false);
  };
  useEffect(() => { reset(); }, [strat]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  const play = () => {
    reset(true); setPlaying(true);
    if (strat === 'recreate') {
      at(300, () => setInsts(['down', 'down', 'down', 'down']));
      at(1300, () => { setInsts(['v2', 'v2', 'v2', 'v2']); setTrafficV2(100); setPlaying(false); });
    } else if (strat === 'rolling') {
      [0, 1, 2, 3].forEach((i) => at(500 + i * 700, () => {
        setInsts((p) => p.map((v, j) => (j <= i ? 'v2' : v)));
        setTrafficV2(((i + 1) / 4) * 100);
        if (i === 3) setPlaying(false);
      }));
    } else if (strat === 'bluegreen') {
      at(400, () => setInsts(['v1', 'v1', 'v2', 'v2'])); // green spun up alongside (right half = green idle)
      at(1500, () => { setInsts(['v2', 'v2', 'v2', 'v2']); setTrafficV2(100); setPlaying(false); }); // flip all traffic
    } else { // canary
      const steps = [10, 30, 60, 100];
      steps.forEach((pct, i) => at(500 + i * 800, () => {
        setTrafficV2(pct);
        setInsts((p) => p.map((v, j) => (j < Math.round((pct / 100) * 4) ? 'v2' : v)));
        if (i === steps.length - 1) setPlaying(false);
      }));
    }
  };

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Deployment strategies — roll out v2 without breaking things</div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {STRATS.map((s) => (
          <button key={s} onClick={() => setStrat(s)} className={cn('rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors', s === strat ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2')}>{INFO[s].label}</button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface-2/30 p-3">
        <div className="mb-2 flex items-center justify-center gap-2">
          {insts.map((v, i) => (
            <motion.div key={i} layout animate={{ scale: 1 }} className={cn('flex h-12 w-12 flex-col items-center justify-center rounded-lg border-2 text-[10px] font-bold',
              v === 'v1' ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300'
              : v === 'v2' ? 'border-accent-400 bg-accent-500/10 text-accent-700 dark:text-accent-300'
              : 'border-dashed border-rose-300 bg-rose-500/5 text-rose-500')}>
              {v === 'down' ? '⏻' : v.toUpperCase()}
            </motion.div>
          ))}
        </div>
        {/* traffic bar */}
        <div className="mx-auto max-w-xs">
          <div className="mb-0.5 flex justify-between text-[10px] text-muted"><span>traffic → v1</span><span>v2</span></div>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-brand-500/30">
            <motion.div className="h-full bg-accent-500" animate={{ width: `${trafficV2}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} style={{ marginLeft: 'auto' }} />
          </div>
          <div className="mt-0.5 text-center text-[10px] font-semibold text-muted">{Math.round(trafficV2)}% on v2</div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button onClick={play} disabled={playing} className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50">▶ Roll out v2</button>
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', INFO[strat].downtime.startsWith('No') ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-700 dark:text-rose-300')}>downtime: {INFO[strat].downtime}</span>
      </div>

      <motion.p key={strat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs text-muted">{INFO[strat].desc}</motion.p>
    </div>
  );
}
