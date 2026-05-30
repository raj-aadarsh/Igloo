import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';

const HOLES = [100, 500, 200, 300, 600]; // free block sizes (KB)
type Algo = 'First' | 'Best' | 'Worst';

function choose(holes: number[], req: number, algo: Algo): number {
  let pick = -1;
  for (let i = 0; i < holes.length; i++) {
    if (holes[i] < req) continue;
    if (pick === -1) { pick = i; continue; }
    if (algo === 'First') break;
    if (algo === 'Best' && holes[i] < holes[pick]) pick = i;
    if (algo === 'Worst' && holes[i] > holes[pick]) pick = i;
  }
  return pick;
}

export function MemoryFit() {
  const [req, setReq] = useState(212);
  const [algo, setAlgo] = useState<Algo>('First');
  const pick = useMemo(() => choose(HOLES, req, algo), [req, algo]);
  const maxHole = Math.max(...HOLES);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(['First', 'Best', 'Worst'] as Algo[]).map((a) => (
          <button key={a} onClick={() => setAlgo(a)} className={cn('rounded-lg border px-3 py-1.5 text-sm font-semibold', algo === a ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted')}>{a} Fit</button>
        ))}
      </div>
      <label className="block text-sm text-muted">
        Process needs <strong className="text-text">{req} KB</strong>
        <input type="range" min={10} max={600} step={1} value={req} onChange={(e) => setReq(parseInt(e.target.value))} className="mt-1 w-full accent-brand-500" />
      </label>

      <div className="mt-3 space-y-2">
        {HOLES.map((size, i) => {
          const chosen = i === pick;
          const fits = size >= req;
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="w-16 shrink-0 font-mono text-xs text-muted">Hole {i + 1}</span>
              <div className="relative h-8 flex-1 overflow-hidden rounded-lg border border-border bg-surface" style={{ width: `${(size / maxHole) * 100}%`, minWidth: 60 }}>
                {chosen && (
                  <div className="absolute inset-y-0 left-0 bg-brand-500/70" style={{ width: `${(req / size) * 100}%` }} />
                )}
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text">
                  {size} KB {chosen && `(used ${req}, left ${size - req})`}
                </span>
              </div>
              {!fits && <span className="text-[11px] text-muted">too small</span>}
              {chosen && <span className="text-xs font-bold text-brand-600 dark:text-brand-300">← placed</span>}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-muted">
        {pick === -1 ? 'No hole is big enough — the request fails.' : (
          <>
            <strong className="text-text">{algo} Fit</strong> chose <strong className="text-text">Hole {pick + 1}</strong> ({HOLES[pick]} KB), leaving <strong className="text-text">{HOLES[pick] - req} KB</strong> of internal leftover.
          </>
        )}
      </p>
      <p className="mt-1 text-xs text-muted"><strong className="text-text">First</strong> = fastest. <strong className="text-text">Best</strong> = least leftover now (but makes tiny unusable slivers → external fragmentation). <strong className="text-text">Worst</strong> = leaves the biggest remaining hole.</p>
    </div>
  );
}
