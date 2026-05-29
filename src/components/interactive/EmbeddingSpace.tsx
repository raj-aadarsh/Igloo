import { useState } from 'react';
import { cn } from '@/lib/cn';

interface Pt { word: string; x: number; y: number; group: string; }

// Hand-placed 2D points: similar meanings sit close together — exactly what
// real (high-dimensional) embeddings do, just squashed to 2D for the eye.
const points: Pt[] = [
  { word: 'cat', x: 18, y: 25, group: 'animals' },
  { word: 'dog', x: 26, y: 18, group: 'animals' },
  { word: 'kitten', x: 12, y: 32, group: 'animals' },
  { word: 'puppy', x: 30, y: 28, group: 'animals' },
  { word: 'king', x: 70, y: 22, group: 'royalty' },
  { word: 'queen', x: 78, y: 30, group: 'royalty' },
  { word: 'prince', x: 64, y: 32, group: 'royalty' },
  { word: 'throne', x: 80, y: 18, group: 'royalty' },
  { word: 'apple', x: 22, y: 74, group: 'fruit' },
  { word: 'banana', x: 30, y: 80, group: 'fruit' },
  { word: 'mango', x: 16, y: 82, group: 'fruit' },
  { word: 'Python', x: 70, y: 72, group: 'tech' },
  { word: 'server', x: 80, y: 78, group: 'tech' },
  { word: 'GPU', x: 66, y: 82, group: 'tech' },
];

const groupColor: Record<string, string> = {
  animals: 'fill-brand-500',
  royalty: 'fill-accent-500',
  fruit: 'fill-emerald-500',
  tech: 'fill-violet-500',
};

export function EmbeddingSpace() {
  const [hover, setHover] = useState<Pt | null>(null);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Words as points — similar meanings cluster together</p>
      <svg viewBox="0 0 100 100" className="w-full rounded-xl bg-surface" style={{ aspectRatio: '1.7 / 1' }}>
        {points.map((p) => {
          const near = hover && hover.group === p.group;
          return (
            <g key={p.word} onMouseEnter={() => setHover(p)} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r={hover === p ? 2.6 : 1.8} className={cn(groupColor[p.group], 'transition-all')} opacity={hover && !near ? 0.25 : 1} />
              <text x={p.x + 2.5} y={p.y + 1} className={cn('text-[3px] font-semibold', 'fill-text')} opacity={hover && !near ? 0.25 : 1}>
                {p.word}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-3 text-sm text-muted">
        An <strong>embedding</strong> turns a word (or image, or sentence) into a list of numbers — a point in space. Things with similar meaning land near each other. This is how models grasp that <strong>"cat"</strong> and <strong>"kitten"</strong> are related, and it's the trick behind <strong>semantic search</strong> and <strong>RAG</strong>.
      </p>
    </div>
  );
}
