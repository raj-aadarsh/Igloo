import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';

const REQUESTS = [98, 183, 37, 122, 14, 124, 65, 67];
const HEAD = 53;
const MAX = 199;
type Algo = 'FCFS' | 'SSTF' | 'SCAN' | 'LOOK';

function order(algo: Algo): number[] {
  const reqs = [...REQUESTS];
  const lower = reqs.filter((r) => r < HEAD).sort((a, b) => a - b);
  const higher = reqs.filter((r) => r >= HEAD).sort((a, b) => a - b);
  if (algo === 'FCFS') return reqs.slice();
  if (algo === 'SSTF') {
    let cur = HEAD; const left = [...reqs]; const out: number[] = [];
    while (left.length) {
      let bi = 0;
      for (let i = 1; i < left.length; i++) if (Math.abs(left[i] - cur) < Math.abs(left[bi] - cur)) bi = i;
      out.push(left[bi]); cur = left[bi]; left.splice(bi, 1);
    }
    return out;
  }
  if (algo === 'SCAN') return [...higher, MAX, ...lower.slice().reverse()]; // go up to the end, then sweep down
  return [...higher, ...lower.slice().reverse()]; // LOOK: only as far as the last request
}

export function DiskScheduling() {
  const [algo, setAlgo] = useState<Algo>('FCFS');
  const seq = useMemo(() => order(algo), [algo]);
  const path = [HEAD, ...seq];
  const totalSeek = useMemo(() => path.reduce((sum, p, i) => (i === 0 ? 0 : sum + Math.abs(p - path[i - 1])), 0), [path]);

  const x = (cyl: number) => 6 + (cyl / MAX) * 88; // % across
  const rowH = 100 / (path.length - 1 || 1);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(['FCFS', 'SSTF', 'SCAN', 'LOOK'] as Algo[]).map((a) => (
          <button key={a} onClick={() => setAlgo(a)} className={cn('rounded-lg border px-3 py-1.5 text-sm font-semibold', algo === a ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted')}>{a}</button>
        ))}
        <span className="ml-auto text-xs text-muted">head starts at {HEAD} · cylinders 0–{MAX}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <svg viewBox="0 0 100 108" className="w-full" style={{ maxHeight: 320 }}>
          {/* cylinder axis */}
          <line x1={x(0)} y1="4" x2={x(MAX)} y2="4" className="stroke-border" strokeWidth="0.4" />
          {[0, 50, 100, 150, MAX].map((t) => (
            <g key={t}>
              <line x1={x(t)} y1="3" x2={x(t)} y2="5" className="stroke-muted" strokeWidth="0.4" />
              <text x={x(t)} y="2" textAnchor="middle" className="fill-muted text-[2.6px]">{t}</text>
            </g>
          ))}
          {/* head path */}
          <polyline
            points={path.map((p, i) => `${x(p)},${8 + i * rowH}`).join(' ')}
            fill="none" className="stroke-brand-500" strokeWidth="0.7"
          />
          {path.map((p, i) => (
            <g key={i}>
              <circle cx={x(p)} cy={8 + i * rowH} r="1.4" className={i === 0 ? 'fill-accent-500' : 'fill-brand-500'} />
              <text x={x(p) + 2.2} y={8 + i * rowH + 1} className="fill-text text-[2.8px] font-bold">{p}{i === 0 ? ' (start)' : ''}</text>
            </g>
          ))}
        </svg>

        <div className="text-sm">
          <div className="mb-1 text-xs font-semibold uppercase text-muted">Service order</div>
          <div className="font-mono text-xs text-text">{seq.join(' → ')}</div>
          <div className="mt-3 rounded-xl bg-surface p-3">
            <div className="text-xs text-muted">Total head movement</div>
            <div className="text-2xl font-black text-brand-600 dark:text-brand-300">{totalSeek}</div>
            <div className="text-xs text-muted">cylinders</div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted"><strong className="text-text">FCFS</strong> is fair but jumps around. <strong className="text-text">SSTF</strong> always serves the nearest request (can starve far ones). <strong className="text-text">SCAN</strong> sweeps like an elevator to the end and back; <strong className="text-text">LOOK</strong> is SCAN but turns around at the last request instead of the disk edge — usually the least movement.</p>
    </div>
  );
}
