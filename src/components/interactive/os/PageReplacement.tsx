import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';

const REFS = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
const CAP = 3;
type Algo = 'FIFO' | 'LRU' | 'Optimal';

interface Step { slots: (number | null)[]; fault: boolean; }

function simulate(refs: number[], cap: number, algo: Algo): Step[] {
  const slots: (number | null)[] = Array(cap).fill(null);
  const fifoOrder: number[] = []; // slot indices in insertion order
  const lastUsed: Record<number, number> = {};
  const steps: Step[] = [];

  refs.forEach((page, i) => {
    let fault = false;
    const inSlot = slots.indexOf(page);
    if (inSlot === -1) {
      fault = true;
      let target = slots.indexOf(null);
      if (target === -1) {
        // need to evict
        if (algo === 'FIFO') {
          target = fifoOrder.shift()!;
        } else if (algo === 'LRU') {
          target = 0;
          for (let s = 1; s < cap; s++) if (lastUsed[slots[s]!] < lastUsed[slots[target]!]) target = s;
        } else {
          // Optimal: evict the page whose next use is farthest away
          let farthest = -1;
          target = 0;
          for (let s = 0; s < cap; s++) {
            let nextUse = Infinity;
            for (let j = i + 1; j < refs.length; j++) if (refs[j] === slots[s]) { nextUse = j; break; }
            if (nextUse > farthest) { farthest = nextUse; target = s; }
          }
        }
      }
      slots[target] = page;
      if (algo === 'FIFO') fifoOrder.push(target);
    }
    lastUsed[page] = i;
    steps.push({ slots: [...slots], fault });
  });
  return steps;
}

export function PageReplacement() {
  const [algo, setAlgo] = useState<Algo>('FIFO');
  const steps = useMemo(() => simulate(REFS, CAP, algo), [algo]);
  const faults = steps.filter((s) => s.fault).length;
  const hits = REFS.length - faults;

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(['FIFO', 'LRU', 'Optimal'] as Algo[]).map((a) => (
          <button key={a} onClick={() => setAlgo(a)} className={cn('rounded-lg border px-3 py-1.5 text-sm font-semibold', algo === a ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted')}>{a}</button>
        ))}
        <span className="ml-auto text-xs text-muted">{CAP} frames · reference string below</span>
      </div>
      <div className="overflow-x-auto">
        <table className="border-separate" style={{ borderSpacing: 4 }}>
          <thead>
            <tr>
              <th></th>
              {REFS.map((r, i) => <th key={i} className="w-8 text-center text-xs font-bold text-text">{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: CAP }).map((_, row) => (
              <tr key={row}>
                <td className="pr-1 text-[10px] text-muted">F{row + 1}</td>
                {steps.map((s, i) => {
                  const val = s.slots[row];
                  const justLoaded = s.fault && val !== null && (i === 0 || steps[i - 1].slots[row] !== val);
                  return (
                    <td key={i}>
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded font-mono text-xs', val === null ? 'bg-surface text-muted/30' : justLoaded ? 'bg-brand-500 text-white' : 'bg-surface-2 text-text')}>
                        {val === null ? '·' : val}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="pr-1 text-[10px] text-muted"></td>
              {steps.map((s, i) => (
                <td key={i} className="text-center">
                  <span className={cn('text-[10px] font-bold', s.fault ? 'text-rose-500' : 'text-emerald-500')}>{s.fault ? 'F' : 'H'}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <span className="text-muted">Page faults: <strong className="text-rose-500">{faults}</strong></span>
        <span className="text-muted">Hits: <strong className="text-emerald-500">{hits}</strong></span>
        <span className="text-muted">Hit ratio: <strong className="text-text">{((hits / REFS.length) * 100).toFixed(0)}%</strong></span>
      </div>
      <p className="mt-2 text-xs text-muted"><strong className="text-text">Optimal</strong> gives the fewest faults but needs to see the future (it’s a benchmark, not implementable). <strong className="text-text">LRU</strong> approximates it well. <strong className="text-text">FIFO</strong> is simplest but can suffer <strong className="text-text">Belady’s anomaly</strong> (more frames → more faults!).</p>
    </div>
  );
}
