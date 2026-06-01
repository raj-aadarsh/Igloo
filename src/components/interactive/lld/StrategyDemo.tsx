import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Bitcoin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Strat {
  id: string;
  label: string;
  icon: typeof CreditCard;
  result: (amt: number) => string;
}

const STRATS: Strat[] = [
  { id: 'card', label: 'CreditCardStrategy', icon: CreditCard, result: (a) => `Charged ₹${a} to card ****4242 (Visa).` },
  { id: 'upi', label: 'UpiStrategy', icon: Smartphone, result: (a) => `₹${a} debited via UPI to merchant@okbank.` },
  { id: 'crypto', label: 'CryptoStrategy', icon: Bitcoin, result: (a) => `Sent crypto worth ₹${a} to wallet 0x9f…3a.` },
];

const AMOUNT = 500;

export function StrategyDemo() {
  const [active, setActive] = useState('card');
  const [output, setOutput] = useState<string | null>(null);
  const strat = STRATS.find((s) => s.id === active)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Strategy — same call, swappable algorithm at runtime</div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Context */}
        <div className="rounded-xl border border-brand-400 bg-brand-500/10 px-3 py-2 text-center">
          <div className="font-mono text-xs font-bold">PaymentContext</div>
          <div className="text-[11px] text-muted">cart total ₹{AMOUNT}</div>
        </div>
        <ArrowRight size={16} className="text-muted/50" />
        {/* Strategy slot */}
        <div className="flex flex-wrap gap-1.5">
          {STRATS.map((s) => (
            <button key={s.id} onClick={() => { setActive(s.id); setOutput(null); }}
              className={cn('inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors', s.id === active ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2')}>
              <s.icon size={14} /> {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-surface-2/60 px-3 py-2 font-mono text-[11px] text-muted">
        context.setStrategy(new <span className="text-brand-600 dark:text-brand-300">{strat.label}</span>());<br />context.pay({AMOUNT});
      </div>

      <button onClick={() => setOutput(strat.result(AMOUNT))} className="mt-3 rounded-lg bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-600">
        Pay ₹{AMOUNT}
      </button>

      <AnimatePresence mode="wait">
        {output && (
          <motion.div key={output} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="mt-3 rounded-xl border border-emerald-400 bg-emerald-50 p-3 text-sm font-medium text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            ✓ {output}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-2 text-xs text-muted">The context never changes — only the injected strategy does. Add a new payment method by writing a new class, not editing the context (Open/Closed in action).</p>
    </div>
  );
}
