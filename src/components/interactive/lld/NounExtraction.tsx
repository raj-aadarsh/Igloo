import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type Kind = 'noun' | 'verb' | 'plain';
interface Tok { t: string; k: Kind }

// A sample requirement, pre-tagged. Nouns → candidate classes; verbs → methods.
const TOKENS: Tok[] = [
  { t: 'A ', k: 'plain' }, { t: 'customer', k: 'noun' }, { t: ' ', k: 'plain' }, { t: 'parks', k: 'verb' },
  { t: ' a ', k: 'plain' }, { t: 'vehicle', k: 'noun' }, { t: ' at the ', k: 'plain' }, { t: 'entry gate', k: 'noun' },
  { t: '. The ', k: 'plain' }, { t: 'system', k: 'noun' }, { t: ' ', k: 'plain' }, { t: 'assigns', k: 'verb' },
  { t: ' a ', k: 'plain' }, { t: 'parking spot', k: 'noun' }, { t: ' and ', k: 'plain' }, { t: 'issues', k: 'verb' },
  { t: ' a ', k: 'plain' }, { t: 'ticket', k: 'noun' }, { t: '. On exit, the ', k: 'plain' }, { t: 'customer', k: 'noun' },
  { t: ' ', k: 'plain' }, { t: 'pays', k: 'verb' }, { t: ' the ', k: 'plain' }, { t: 'fee', k: 'noun' },
  { t: ' and the ', k: 'plain' }, { t: 'spot', k: 'noun' }, { t: ' is ', k: 'plain' }, { t: 'freed', k: 'verb' }, { t: '.', k: 'plain' },
];

const CLASSES = ['Customer', 'Vehicle', 'EntryGate', 'ParkingSystem', 'ParkingSpot', 'Ticket', 'Fee/Payment'];
const METHODS = ['park()', 'assignSpot()', 'issueTicket()', 'pay()', 'freeSpot()'];

export function NounExtraction() {
  const [show, setShow] = useState<'noun' | 'verb' | null>('noun');

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted">Noun-verb extraction — turn a prompt into classes &amp; methods</span>
        <div className="ml-auto inline-flex rounded-lg border border-border p-0.5 text-xs font-semibold">
          <button onClick={() => setShow('noun')} className={cn('rounded-md px-2.5 py-1', show === 'noun' ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300' : 'text-muted')}>Nouns → classes</button>
          <button onClick={() => setShow('verb')} className={cn('rounded-md px-2.5 py-1', show === 'verb' ? 'bg-accent-500/15 text-accent-700 dark:text-accent-300' : 'text-muted')}>Verbs → methods</button>
        </div>
      </div>

      <p className="rounded-xl border border-border bg-surface-2/40 p-3 text-[15px] leading-relaxed">
        {TOKENS.map((tok, i) => (
          <span key={i} className={cn(
            tok.k === 'noun' && show === 'noun' && 'rounded bg-brand-500/20 px-0.5 font-semibold text-brand-700 dark:text-brand-300',
            tok.k === 'verb' && show === 'verb' && 'rounded bg-accent-500/20 px-0.5 font-semibold text-accent-700 dark:text-accent-300',
          )}>
            {tok.t}
          </span>
        ))}
      </p>

      <motion.div key={show ?? 'none'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
        {show === 'noun' ? (
          <div>
            <div className="mb-1.5 text-xs font-semibold text-muted">Candidate classes (nouns):</div>
            <div className="flex flex-wrap gap-1.5">
              {CLASSES.map((c) => <span key={c} className="rounded-lg border border-brand-400 bg-brand-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-brand-700 dark:text-brand-300">{c}</span>)}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-1.5 text-xs font-semibold text-muted">Candidate methods (verbs):</div>
            <div className="flex flex-wrap gap-1.5">
              {METHODS.map((m) => <span key={m} className="rounded-lg border border-accent-400 bg-accent-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-accent-700 dark:text-accent-300">{m}</span>)}
            </div>
          </div>
        )}
      </motion.div>

      <p className="mt-3 text-xs text-muted">It’s a starting heuristic, not a rule: nouns hint at classes/attributes, verbs at behaviour. You’ll then merge duplicates, drop irrelevant nouns, and decide which become classes vs simple fields.</p>
    </div>
  );
}
