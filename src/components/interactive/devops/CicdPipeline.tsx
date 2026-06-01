import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Package, FlaskConical, ShieldCheck, Rocket, Check, X, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

const STAGES = [
  { id: 'commit', label: 'Commit', icon: GitCommit, ci: true },
  { id: 'build', label: 'Build', icon: Package, ci: true },
  { id: 'test', label: 'Test', icon: FlaskConical, ci: true },
  { id: 'scan', label: 'Security scan', icon: ShieldCheck, ci: true },
  { id: 'deploy', label: 'Deploy', icon: Rocket, ci: false },
];

type Status = 'idle' | 'run' | 'pass' | 'fail' | 'skip';

export function CicdPipeline() {
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [running, setRunning] = useState(false);
  const [failTest, setFailTest] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    setRunning(true);
    setStatus({});
    let stopped = false;
    STAGES.forEach((s, i) => {
      timers.current.push(setTimeout(() => {
        if (stopped) return;
        setStatus((prev) => ({ ...prev, [s.id]: 'run' }));
      }, i * 900));
      timers.current.push(setTimeout(() => {
        if (stopped) return;
        const fails = failTest && s.id === 'test';
        setStatus((prev) => ({ ...prev, [s.id]: fails ? 'fail' : 'pass' }));
        if (fails) {
          stopped = true;
          // mark the remaining stages skipped, pipeline halts (fail fast)
          setStatus((prev) => {
            const next = { ...prev };
            STAGES.slice(i + 1).forEach((r) => { next[r.id] = 'skip'; });
            return next;
          });
          setRunning(false);
        } else if (i === STAGES.length - 1) {
          setRunning(false);
        }
      }, i * 900 + 600));
    });
  };

  const colorFor = (st?: Status) =>
    st === 'pass' ? 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    : st === 'fail' ? 'border-rose-400 bg-rose-500/10 text-rose-700 dark:text-rose-300'
    : st === 'run' ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300'
    : st === 'skip' ? 'border-border bg-surface-2/30 text-muted/40'
    : 'border-border text-muted';

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted">A CI/CD pipeline — push a commit & watch it flow</span>
        <label className="ml-auto flex items-center gap-1.5 text-xs font-medium text-muted">
          <input type="checkbox" checked={failTest} onChange={(e) => setFailTest(e.target.checked)} className="accent-rose-500" /> make tests fail
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {STAGES.map((s, i) => {
          const st = status[s.id];
          return (
            <div key={s.id} className="flex items-center gap-1">
              <div className={cn('flex w-[78px] flex-col items-center gap-1 rounded-xl border p-2 transition-colors', colorFor(st))}>
                <div className="relative">
                  <s.icon size={17} />
                  {st === 'run' && <Loader2 size={12} className="absolute -right-2 -top-2 animate-spin" />}
                  {st === 'pass' && <Check size={12} className="absolute -right-2 -top-2 text-emerald-500" />}
                  {st === 'fail' && <X size={12} className="absolute -right-2 -top-2 text-rose-500" />}
                </div>
                <span className="text-[10px] font-bold leading-tight">{s.label}</span>
              </div>
              {i < STAGES.length - 1 && (
                <ArrowRight size={13} className={cn('shrink-0', i === 2 ? 'text-accent-500' : 'text-muted/40')} />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-1 text-[10px] font-semibold text-muted">
        <span className="ml-1">◀ CI (integrate & verify)</span>
        <span className="ml-auto mr-3">CD (deliver/deploy) ▶</span>
      </div>

      <button onClick={run} disabled={running} className="mt-3 rounded-lg bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50">
        {running ? 'Running pipeline…' : '▶ git push'}
      </button>

      <motion.p key={failTest ? 'f' : 'p'} className="mt-3 text-xs text-muted">
        Every push triggers the pipeline automatically. <strong>CI</strong> builds & verifies the change; <strong>CD</strong> ships it. Tick "make tests fail" and run again: the pipeline <strong>fails fast</strong> — deploy is skipped, so a broken build never reaches production.
      </motion.p>
    </div>
  );
}
