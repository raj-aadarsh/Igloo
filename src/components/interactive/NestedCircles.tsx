import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const layers = [
  {
    id: 'ai',
    label: 'Artificial Intelligence',
    blurb: 'The whole idea: machines doing things that normally need human intelligence — reasoning, perceiving, deciding. The biggest umbrella.',
    size: 100,
    color: 'from-brand-200 to-brand-100 dark:from-brand-900/60 dark:to-brand-900/30',
  },
  {
    id: 'ml',
    label: 'Machine Learning',
    blurb: 'A way to do AI: instead of hand-coding rules, the machine learns patterns from data. Most modern AI is ML.',
    size: 78,
    color: 'from-brand-300 to-brand-200 dark:from-brand-800/70 dark:to-brand-800/40',
  },
  {
    id: 'dl',
    label: 'Deep Learning',
    blurb: 'ML using big neural networks with many layers. Powers vision, speech, and language since ~2012.',
    size: 56,
    color: 'from-brand-400 to-brand-300 dark:from-brand-700/80 dark:to-brand-700/50',
  },
  {
    id: 'gen',
    label: 'Generative AI',
    blurb: 'Deep learning that creates new content — text, images, audio, video. ChatGPT, Claude, Midjourney live here.',
    size: 34,
    color: 'from-accent-400 to-accent-300 dark:from-accent-700/80 dark:to-accent-600/50',
  },
];

export function NestedCircles() {
  const [active, setActive] = useState('gen');
  const current = layers.find((l) => l.id === active)!;

  return (
    <div className="my-6 grid items-center gap-6 rounded-2xl border border-border bg-surface-2/50 p-5 sm:grid-cols-2">
      <div className="relative mx-auto aspect-square w-full max-w-[280px]">
        {layers.map((l) => (
          <button
            key={l.id}
            onClick={() => setActive(l.id)}
            style={{ width: `${l.size}%`, height: `${l.size}%` }}
            className={cn(
              'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-start justify-center rounded-full bg-gradient-to-br pt-2 text-[11px] font-bold transition-all',
              l.color,
              active === l.id ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-bg' : 'hover:brightness-105',
            )}
          >
            <span className="px-2 text-center text-text/80">{l.id === 'gen' ? 'GenAI' : l.id.toUpperCase()}</span>
          </button>
        ))}
      </div>
      <div>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {layers.map((l) => (
            <button
              key={l.id}
              onClick={() => setActive(l.id)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                active === l.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted hover:text-text',
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
        <motion.div key={current.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <h4 className="text-lg font-bold">{current.label}</h4>
          <p className="mt-1 text-sm leading-6 text-muted">{current.blurb}</p>
        </motion.div>
        <p className="mt-3 text-xs text-muted">Tap a circle — each one lives <em>inside</em> the bigger idea.</p>
      </div>
    </div>
  );
}
