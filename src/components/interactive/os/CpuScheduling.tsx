import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Proc { id: string; arrival: number; burst: number; }
interface Seg { pid: string; start: number; end: number; }

const PROCS: Proc[] = [
  { id: 'P1', arrival: 0, burst: 5 },
  { id: 'P2', arrival: 1, burst: 3 },
  { id: 'P3', arrival: 2, burst: 8 },
  { id: 'P4', arrival: 3, burst: 6 },
];

const COLORS: Record<string, string> = {
  P1: 'bg-brand-500', P2: 'bg-accent-500', P3: 'bg-violet-500', P4: 'bg-emerald-500',
};

type Algo = 'FCFS' | 'SJF' | 'RR';

function fcfs(ps: Proc[]): Seg[] {
  const order = [...ps].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let t = 0; const segs: Seg[] = [];
  for (const p of order) {
    const start = Math.max(t, p.arrival);
    segs.push({ pid: p.id, start, end: start + p.burst });
    t = start + p.burst;
  }
  return segs;
}

function sjf(ps: Proc[]): Seg[] {
  const left = ps.map((p) => ({ ...p }));
  const done = new Set<string>();
  let t = 0; const segs: Seg[] = [];
  while (done.size < left.length) {
    const avail = left.filter((p) => p.arrival <= t && !done.has(p.id));
    if (avail.length === 0) { t = Math.min(...left.filter((p) => !done.has(p.id)).map((p) => p.arrival)); continue; }
    avail.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival || a.id.localeCompare(b.id));
    const p = avail[0];
    segs.push({ pid: p.id, start: t, end: t + p.burst });
    t += p.burst; done.add(p.id);
  }
  return segs;
}

function rr(ps: Proc[], q = 2): Seg[] {
  const order = [...ps].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const rem: Record<string, number> = {};
  ps.forEach((p) => (rem[p.id] = p.burst));
  const segs: Seg[] = [];
  const queue: string[] = [];
  let t = 0; let i = 0; // i = next not-yet-enqueued by arrival
  const enqueueArrived = (upto: number) => {
    while (i < order.length && order[i].arrival <= upto) { queue.push(order[i].id); i++; }
  };
  enqueueArrived(t);
  while (queue.length > 0 || i < order.length) {
    if (queue.length === 0) { t = order[i].arrival; enqueueArrived(t); continue; }
    const pid = queue.shift()!;
    const run = Math.min(q, rem[pid]);
    segs.push({ pid, start: t, end: t + run });
    t += run; rem[pid] -= run;
    enqueueArrived(t);             // add processes that arrived during this slice
    if (rem[pid] > 0) queue.push(pid);
  }
  // merge adjacent same-pid segments for a cleaner chart
  const merged: Seg[] = [];
  for (const s of segs) {
    const last = merged[merged.length - 1];
    if (last && last.pid === s.pid && last.end === s.start) last.end = s.end;
    else merged.push({ ...s });
  }
  return merged;
}

export function CpuScheduling() {
  const [algo, setAlgo] = useState<Algo>('FCFS');

  const segs = useMemo(() => (algo === 'FCFS' ? fcfs(PROCS) : algo === 'SJF' ? sjf(PROCS) : rr(PROCS, 2)), [algo]);
  const total = segs.length ? segs[segs.length - 1].end : 0;

  const metrics = useMemo(() => {
    return PROCS.map((p) => {
      const mine = segs.filter((s) => s.pid === p.id);
      const completion = Math.max(...mine.map((s) => s.end));
      const tat = completion - p.arrival;
      const wt = tat - p.burst;
      return { ...p, completion, tat, wt };
    });
  }, [segs]);

  const avgWt = (metrics.reduce((a, m) => a + m.wt, 0) / metrics.length).toFixed(2);
  const avgTat = (metrics.reduce((a, m) => a + m.tat, 0) / metrics.length).toFixed(2);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Pick an algorithm — watch the schedule & averages change</span>
      </div>
      <div className="mb-4 flex gap-1.5">
        {(['FCFS', 'SJF', 'RR'] as Algo[]).map((a) => (
          <button key={a} onClick={() => setAlgo(a)} className={cn('rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors', algo === a ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted hover:text-text')}>
            {a === 'RR' ? 'Round Robin (q=2)' : a === 'SJF' ? 'SJF (non-preemptive)' : 'FCFS'}
          </button>
        ))}
      </div>

      {/* Process table input (read-only here) */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {PROCS.map((p) => (
          <span key={p.id} className="chip"><span className={cn('mr-1 inline-block h-2.5 w-2.5 rounded-full', COLORS[p.id])} />{p.id}: arrival {p.arrival}, burst {p.burst}</span>
        ))}
      </div>

      {/* Gantt chart */}
      <div className="overflow-x-auto">
        <div className="flex min-w-[320px]">
          {segs.map((s, i) => (
            <motion.div key={i} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative" style={{ flex: `${s.end - s.start} 0 0` }}>
              <div className={cn('flex h-12 items-center justify-center border-r border-bg text-sm font-bold text-white', COLORS[s.pid])}>{s.pid}</div>
              <div className="absolute -bottom-5 left-0 font-mono text-[10px] text-muted">{s.start}</div>
              {i === segs.length - 1 && <div className="absolute -bottom-5 right-0 font-mono text-[10px] text-muted">{s.end}</div>}
            </motion.div>
          ))}
        </div>
        <div className="h-5" />
      </div>

      {/* Metrics */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[360px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted">
              <th className="py-1 pr-3">Process</th><th className="pr-3">Completion</th><th className="pr-3">Turnaround</th><th>Waiting</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.id} className="border-t border-border font-mono">
                <td className="py-1 pr-3 font-bold">{m.id}</td>
                <td className="pr-3">{m.completion}</td>
                <td className="pr-3">{m.tat}</td>
                <td>{m.wt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <span className="text-muted">Avg waiting time: <strong className="text-text">{avgWt}</strong></span>
        <span className="text-muted">Avg turnaround: <strong className="text-text">{avgTat}</strong></span>
      </div>
      <p className="mt-2 text-xs text-muted">Notice how <strong className="text-text">SJF</strong> usually gives the lowest average waiting time, while <strong className="text-text">Round Robin</strong> shares the CPU fairly (better response, more context switches). <strong className="text-text">FCFS</strong> can suffer the “convoy effect” when a long job arrives first.</p>
    </div>
  );
}
