import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Event {
  year: string;
  title: string;
  who: string;
  detail: string;
  era: 'birth' | 'winter' | 'rise' | 'boom';
}

const events: Event[] = [
  { year: '1950', title: 'The Turing Test', who: 'Alan Turing', detail: 'Turing asks "Can machines think?" and proposes the Imitation Game — if you can\'t tell a machine from a human in conversation, that\'s a kind of intelligence.', era: 'birth' },
  { year: '1956', title: 'AI is named', who: 'John McCarthy & the Dartmouth Workshop', detail: 'The term "Artificial Intelligence" is coined at a summer workshop. This is widely seen as the official birth of the field.', era: 'birth' },
  { year: '1958', title: 'The Perceptron', who: 'Frank Rosenblatt', detail: 'The first trainable artificial neuron — the great-grandparent of today\'s neural networks.', era: 'birth' },
  { year: '1974–1980', title: 'The first AI Winter', who: '—', detail: 'Hype outran reality. Funding dried up when early promises (like fluent translation) failed. A second winter followed in the late 1980s.', era: 'winter' },
  { year: '1997', title: 'Deep Blue beats Kasparov', who: 'IBM', detail: 'A chess computer beats the reigning world champion — a landmark for "search + brute force" AI.', era: 'rise' },
  { year: '2012', title: 'AlexNet & the Deep Learning boom', who: 'Krizhevsky, Sutskever, Hinton', detail: 'A deep neural network crushes the ImageNet image-recognition contest using GPUs. This kicks off the modern deep learning era.', era: 'rise' },
  { year: '2016', title: 'AlphaGo beats Lee Sedol', who: 'Google DeepMind', detail: 'AI masters Go — a game thought too intuitive for computers — using deep learning + reinforcement learning.', era: 'rise' },
  { year: '2017', title: '"Attention Is All You Need"', who: 'Google researchers', detail: 'The Transformer architecture is introduced. Almost every modern LLM (GPT, Claude, Gemini) is built on it.', era: 'boom' },
  { year: '2018–2020', title: 'BERT → GPT-3', who: 'Google / OpenAI', detail: 'Pretrained language models scale up. GPT-3 (175B parameters) shows surprising general abilities from just predicting the next word.', era: 'boom' },
  { year: '2022', title: 'ChatGPT launches', who: 'OpenAI', detail: 'A friendly chat interface puts LLMs in everyone\'s hands. It reaches 100M users in ~2 months — the fastest-growing app ever at the time.', era: 'boom' },
  { year: '2023', title: 'GPT-4, Claude, Llama, multimodal', who: 'OpenAI / Anthropic / Meta', detail: 'Models get far more capable and can see images. Open-weight models (Llama) spark a local-AI movement.', era: 'boom' },
  { year: '2024–2025', title: 'Agents, reasoning models & MCP', who: 'Anthropic / OpenAI / Google', detail: 'Models that "think" step-by-step (reasoning) and act with tools (agents). Anthropic introduces MCP to standardize how models connect to tools and data.', era: 'boom' },
];

const eraColor: Record<Event['era'], string> = {
  birth: 'bg-violet-500',
  winter: 'bg-slate-400',
  rise: 'bg-brand-500',
  boom: 'bg-accent-500',
};

export function Timeline() {
  const [active, setActive] = useState(events.length - 1);
  const ev = events[active];

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <div className="mb-4 flex gap-3 overflow-x-auto pb-2">
        {events.map((e, i) => (
          <button
            key={e.year}
            onClick={() => setActive(i)}
            className="group relative flex shrink-0 flex-col items-center"
          >
            <span className={cn('mb-1 text-xs font-bold transition-colors', active === i ? 'text-text' : 'text-muted')}>
              {e.year}
            </span>
            <span
              className={cn(
                'h-4 w-4 rounded-full border-2 border-bg transition-transform',
                eraColor[e.era],
                active === i ? 'scale-150 ring-2 ring-brand-400' : 'group-hover:scale-125',
              )}
            />
          </button>
        ))}
      </div>
      <div className="mb-4 h-px w-full bg-border" />
      <AnimatePresence mode="wait">
        <motion.div
          key={ev.year}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-brand-600 dark:text-brand-300">{ev.year}</span>
            <h4 className="text-lg font-bold">{ev.title}</h4>
          </div>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">{ev.who}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{ev.detail}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
        {(['birth', 'winter', 'rise', 'boom'] as const).map((era) => (
          <span key={era} className="inline-flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-full', eraColor[era])} />
            {era === 'birth' ? 'Birth' : era === 'winter' ? 'AI Winter' : era === 'rise' ? 'Deep learning rises' : 'LLM boom'}
          </span>
        ))}
      </div>
    </div>
  );
}
