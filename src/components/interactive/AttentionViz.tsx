import { useState } from 'react';
import { cn } from '@/lib/cn';

// Illustrative attention: when you focus a word, we show how strongly it
// "attends to" the others. (Hand-authored weights to make the idea tangible —
// in a real model these are computed from the data.)
const words = ['The', 'tired', 'cat', 'sat', 'because', 'it', 'was', 'sleepy'];

// attention[i][j] = how much word i looks at word j (0..1)
const attention: number[][] = [
  [1, 0.1, 0.6, 0.2, 0, 0, 0, 0],
  [0.1, 1, 0.7, 0.1, 0, 0, 0, 0.3],
  [0.4, 0.5, 1, 0.4, 0, 0.3, 0, 0.2],
  [0.2, 0.1, 0.7, 1, 0.2, 0.1, 0, 0],
  [0, 0, 0.2, 0.3, 1, 0.2, 0.2, 0.3],
  [0.1, 0.2, 0.9, 0.1, 0.1, 1, 0.1, 0.4], // "it" attends strongly to "cat"
  [0, 0, 0.1, 0.2, 0.2, 0.4, 1, 0.5],
  [0, 0.3, 0.4, 0, 0.1, 0.6, 0.3, 1],
];

export function AttentionViz() {
  const [focus, setFocus] = useState(5); // "it"

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Hover a word — see what it pays attention to</p>
      <div className="flex flex-wrap items-center gap-2 text-lg">
        {words.map((w, j) => {
          const weight = attention[focus][j];
          return (
            <span
              key={j}
              onMouseEnter={() => setFocus(j)}
              className={cn(
                'cursor-pointer rounded-lg px-2 py-1 font-semibold transition-all',
                j === focus ? 'bg-accent-500 text-white ring-2 ring-accent-300' : 'text-text',
              )}
              style={j === focus ? {} : { backgroundColor: `rgb(31 136 168 / ${weight * 0.85})`, color: weight > 0.5 ? 'white' : undefined }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-muted">
        Focusing <strong className="text-text">"{words[focus]}"</strong> — darker words are the ones it attends to most. Notice how <strong>"it"</strong> looks back at <strong>"cat"</strong>: that's <strong>self-attention</strong> resolving what a word refers to. This single mechanism is the heart of the <strong>Transformer</strong>.
      </p>
    </div>
  );
}
