import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';

// Toggle between a safe allocation and a circular wait. The Resource Allocation
// Graph makes the deadlock cycle visible.
export function DeadlockRAG() {
  const [deadlocked, setDeadlocked] = useState(true);

  // Positions: P1, P2 (processes = circles); R1, R2 (resources = squares)
  const P1 = { x: 20, y: 25 }, R1 = { x: 60, y: 25 }, P2 = { x: 60, y: 70 }, R2 = { x: 20, y: 70 };

  return (
    <div className="my-6 grid gap-5 rounded-2xl border border-border bg-surface-2/50 p-5 sm:grid-cols-[1fr_1fr] sm:items-center">
      <div>
        <svg viewBox="0 0 80 90" className="w-full">
          {/* edges */}
          {/* R1 -> P1 (assignment), P1 -> R2 (request) */}
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" className="fill-muted" />
            </marker>
            <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" className="fill-rose-500" />
            </marker>
          </defs>
          {/* assignment R1->P1 */}
          <line x1={R1.x} y1={R1.y} x2={P1.x + 6} y2={P1.y} className={deadlocked ? 'stroke-rose-500' : 'stroke-muted'} strokeWidth="0.8" markerEnd={deadlocked ? 'url(#arrowRed)' : 'url(#arrow)'} />
          {/* request P1->R2 */}
          <line x1={P1.x} y1={P1.y + 4} x2={R2.x} y2={R2.y - 4} className={deadlocked ? 'stroke-rose-500' : 'stroke-muted'} strokeWidth="0.8" markerEnd={deadlocked ? 'url(#arrowRed)' : 'url(#arrow)'} />
          {/* assignment R2->P2 */}
          <line x1={R2.x} y1={R2.y} x2={P2.x - 6} y2={P2.y} className={deadlocked ? 'stroke-rose-500' : 'stroke-muted'} strokeWidth="0.8" markerEnd={deadlocked ? 'url(#arrowRed)' : 'url(#arrow)'} />
          {/* P2 -> R1 : request if deadlocked, else absent */}
          {deadlocked && (
            <line x1={P2.x} y1={P2.y - 4} x2={R1.x} y2={R1.y + 4} className="stroke-rose-500" strokeWidth="0.8" markerEnd="url(#arrowRed)" />
          )}

          {/* nodes */}
          <circle cx={P1.x} cy={P1.y} r="7" className="fill-brand-500/20 stroke-brand-500" strokeWidth="0.8" />
          <text x={P1.x} y={P1.y + 1.5} textAnchor="middle" className="fill-text text-[4px] font-bold">P1</text>
          <circle cx={P2.x} cy={P2.y} r="7" className="fill-brand-500/20 stroke-brand-500" strokeWidth="0.8" />
          <text x={P2.x} y={P2.y + 1.5} textAnchor="middle" className="fill-text text-[4px] font-bold">P2</text>
          <rect x={R1.x - 6} y={R1.y - 6} width="12" height="12" className="fill-accent-500/20 stroke-accent-500" strokeWidth="0.8" />
          <text x={R1.x} y={R1.y + 1.5} textAnchor="middle" className="fill-text text-[4px] font-bold">R1</text>
          <rect x={R2.x - 6} y={R2.y - 6} width="12" height="12" className="fill-accent-500/20 stroke-accent-500" strokeWidth="0.8" />
          <text x={R2.x} y={R2.y + 1.5} textAnchor="middle" className="fill-text text-[4px] font-bold">R2</text>
        </svg>
        <div className="mt-1 flex justify-center gap-3 text-[11px] text-muted">
          <span>○ process</span><span>□ resource</span>
        </div>
      </div>

      <div>
        <button
          onClick={() => setDeadlocked((d) => !d)}
          className={cn('mb-3 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors', deadlocked ? 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300' : 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300')}
        >
          {deadlocked ? '🔴 Deadlocked — tap to break the cycle' : '🟢 Safe — tap to create a deadlock'}
        </button>
        <motion.p key={String(deadlocked)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted">
          {deadlocked
            ? 'P1 holds R1 and wants R2; P2 holds R2 and wants R1. Each waits on the other → a cycle → deadlock.'
            : 'P2 no longer needs R1, so there is no cycle. Both can finish and release their resources.'}
        </motion.p>
        <p className="mt-3 text-xs font-semibold uppercase text-muted">Coffman conditions (all 4 needed)</p>
        <ul className="mt-1 space-y-0.5 text-xs">
          {['Mutual exclusion', 'Hold and wait', 'No preemption', 'Circular wait'].map((c, i) => (
            <li key={c} className="flex items-center gap-1.5">
              {deadlocked || i < 3 ? <Check size={13} className="text-rose-500" /> : <X size={13} className="text-emerald-500" />}
              <span className={cn(i === 3 && !deadlocked && 'line-through text-muted')}>{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-muted">Break any one condition and deadlock becomes impossible — that’s how prevention works.</p>
      </div>
    </div>
  );
}
