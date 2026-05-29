import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const types = [
  {
    id: 'supervised',
    label: 'Supervised',
    emoji: '🏷️',
    tagline: 'Learn from labeled examples',
    body: 'You show the model inputs WITH the right answers (labels). It learns the mapping. Example: 10,000 emails labeled "spam / not spam" → it predicts spam on new emails.',
    examples: ['Spam detection', 'Image classification', 'Price prediction'],
  },
  {
    id: 'unsupervised',
    label: 'Unsupervised',
    emoji: '🧩',
    tagline: 'Find structure with no labels',
    body: 'You give data with NO answers and let the model find patterns or groups on its own. Example: cluster customers into segments nobody defined in advance.',
    examples: ['Customer segmentation', 'Anomaly detection', 'Topic discovery'],
  },
  {
    id: 'reinforcement',
    label: 'Reinforcement',
    emoji: '🎮',
    tagline: 'Learn by trial, reward & error',
    body: 'An agent acts in an environment and gets rewards or penalties. Over many tries it learns a strategy that maximizes reward. Example: AlphaGo, robots, game-playing AIs.',
    examples: ['AlphaGo', 'Robotics', 'RLHF (tuning chatbots)'],
  },
];

export function MLTypes() {
  const [active, setActive] = useState('supervised');
  const t = types.find((x) => x.id === active)!;
  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <div className="flex gap-2">
        {types.map((x) => (
          <button
            key={x.id}
            onClick={() => setActive(x.id)}
            className={cn(
              'flex-1 rounded-xl border p-3 text-center transition-all',
              active === x.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-border bg-surface hover:border-brand-300',
            )}
          >
            <div className="text-2xl">{x.emoji}</div>
            <div className="mt-1 text-sm font-bold">{x.label}</div>
          </button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
        <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">{t.tagline}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{t.body}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {t.examples.map((e) => (
            <span key={e} className="chip">{e}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
