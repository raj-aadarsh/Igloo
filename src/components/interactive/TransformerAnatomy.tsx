import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const parts = [
  { id: 'tok', label: '1 · Tokenize', desc: 'Your text is split into tokens and each token becomes an embedding (a vector of numbers).' },
  { id: 'pos', label: '2 · Positional info', desc: 'Since the model sees all tokens at once, it adds position information so word order isn\'t lost.' },
  { id: 'attn', label: '3 · Self-Attention', desc: 'Every token looks at every other token and decides what\'s relevant. This is the breakthrough idea.' },
  { id: 'ffn', label: '4 · Feed-forward', desc: 'Each token\'s representation is processed further. Steps 3–4 repeat across many stacked layers.' },
  { id: 'out', label: '5 · Predict next token', desc: 'The model outputs probabilities for the next token, picks one, and repeats — generating text one token at a time.' },
];

export function TransformerAnatomy() {
  const [active, setActive] = useState('attn');
  const p = parts.find((x) => x.id === active)!;
  return (
    <div className="my-6 grid gap-5 rounded-2xl border border-border bg-surface-2/50 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="flex flex-col gap-1.5">
        {parts.map((x) => (
          <button
            key={x.id}
            onClick={() => setActive(x.id)}
            className={cn(
              'rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-all',
              x.id === 'attn' && 'relative',
              active === x.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-text hover:border-brand-300',
            )}
          >
            {x.label}
            {x.id === 'attn' && active !== 'attn' && <span className="ml-2 rounded bg-accent-500 px-1.5 py-0.5 text-[10px] text-white">★ the magic</span>}
          </button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl bg-surface p-4">
        <h4 className="text-base font-bold">{p.label}</h4>
        <p className="mt-1 text-sm leading-6 text-muted">{p.desc}</p>
      </motion.div>
    </div>
  );
}
