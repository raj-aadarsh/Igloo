import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Activity } from 'lucide-react';
import { cn } from '@/lib/cn';

type CState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
const THRESHOLD = 3;

const INFO: Record<CState, { color: string; desc: string }> = {
  CLOSED: { color: 'text-emerald-600 dark:text-emerald-400', desc: 'Normal operation — requests flow to the service. Consecutive failures are counted.' },
  OPEN: { color: 'text-rose-600 dark:text-rose-400', desc: 'Too many failures — the breaker "trips". Requests fail fast immediately (no waiting on the dead service), protecting the system. After a cooldown it moves to HALF-OPEN.' },
  HALF_OPEN: { color: 'text-amber-600 dark:text-amber-400', desc: 'A trial request is allowed through. Success → back to CLOSED. Failure → back to OPEN.' },
};

export function CircuitBreaker() {
  const [state, setState] = useState<CState>('CLOSED');
  const [fails, setFails] = useState(0);
  const [log, setLog] = useState('Breaker is CLOSED — calls pass through.');

  const succeed = () => {
    if (state === 'OPEN') { setLog('Breaker is OPEN — request fails fast (service not called).'); return; }
    setFails(0); setState('CLOSED'); setLog(state === 'HALF_OPEN' ? 'Trial succeeded → back to CLOSED.' : 'Success — call passed through.');
  };
  const fail = () => {
    if (state === 'OPEN') { setLog('Breaker is OPEN — request fails fast (service not called).'); return; }
    if (state === 'HALF_OPEN') { setState('OPEN'); setLog('Trial failed → back to OPEN.'); return; }
    const f = fails + 1; setFails(f);
    if (f >= THRESHOLD) { setState('OPEN'); setLog(`${f} consecutive failures → breaker TRIPS to OPEN.`); }
    else setLog(`Failure ${f}/${THRESHOLD} — still CLOSED.`);
  };
  const cooldown = () => { if (state === 'OPEN') { setState('HALF_OPEN'); setFails(0); setLog('Cooldown elapsed → HALF-OPEN, allowing one trial request.'); } };

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Circuit breaker — trip on failures, fail fast, then recover</div>

      <div className="flex items-center justify-center gap-2">
        {(['CLOSED', 'OPEN', 'HALF_OPEN'] as CState[]).map((s) => (
          <div key={s} className={cn('rounded-xl border px-3 py-2 font-mono text-xs font-bold transition-colors', s === state ? 'border-brand-400 bg-brand-500/10' : 'border-border opacity-50')}>
            <span className={s === state ? INFO[s].color : 'text-muted'}>{s.replace('_', '-')}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button onClick={succeed} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold hover:bg-surface-2"><Check size={14} className="text-emerald-500" /> Request succeeds</button>
        <button onClick={fail} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold hover:bg-surface-2"><X size={14} className="text-rose-500" /> Request fails</button>
        <button onClick={cooldown} disabled={state !== 'OPEN'} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold hover:bg-surface-2 disabled:opacity-40"><Activity size={14} /> Cooldown elapses</button>
      </div>

      <motion.div key={log} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3 text-center text-sm">{log}</motion.div>
      <p className="mt-2 text-xs text-muted">{INFO[state].desc}</p>
    </div>
  );
}
