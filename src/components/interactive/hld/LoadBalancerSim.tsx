import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Server, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

type Algo = 'round-robin' | 'least-conn' | 'random' | 'ip-hash';
const N = 4;
const CLIENTS = ['11.0.0.7', '11.0.0.8', '11.0.0.9', '11.0.0.3'];

const ALGOS: { id: Algo; label: string; desc: string }[] = [
  { id: 'round-robin', label: 'Round Robin', desc: 'Cycle through servers in order — simple & even when requests are uniform.' },
  { id: 'least-conn', label: 'Least Connections', desc: 'Send to the server with the fewest active requests — best when request costs vary.' },
  { id: 'random', label: 'Random', desc: 'Pick a server at random — surprisingly even at scale, zero coordination.' },
  { id: 'ip-hash', label: 'IP Hash', desc: 'Hash the client IP to a fixed server — gives "sticky" sessions (same client → same server).' },
];

function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

export function LoadBalancerSim() {
  const [algo, setAlgo] = useState<Algo>('round-robin');
  const [load, setLoad] = useState<number[]>(Array(N).fill(0));
  const [last, setLast] = useState<number | null>(null);
  const rr = useRef(0);
  const clientI = useRef(0);

  const pick = (loads: number[]): number => {
    switch (algo) {
      case 'round-robin': { const i = rr.current % N; rr.current++; return i; }
      case 'least-conn': return loads.indexOf(Math.min(...loads));
      case 'random': return Math.floor(Math.random() * N);
      case 'ip-hash': { const ip = CLIENTS[clientI.current % CLIENTS.length]; clientI.current++; return hash(ip) % N; }
    }
  };

  const send = (count: number) => {
    setLoad((prev) => {
      const next = [...prev];
      let target = 0;
      for (let k = 0; k < count; k++) { target = pick(next); next[target]++; }
      setLast(target);
      return next;
    });
  };

  const reset = () => { setLoad(Array(N).fill(0)); rr.current = 0; clientI.current = 0; setLast(null); };
  const max = Math.max(1, ...load);
  const a = ALGOS.find((x) => x.id === algo)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Load balancer — pick an algorithm, then send traffic</div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {ALGOS.map((x) => (
          <button key={x.id} onClick={() => setAlgo(x.id)}
            className={cn('rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors', x.id === algo ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2')}>
            {x.label}
          </button>
        ))}
      </div>
      <p className="mb-3 text-xs text-muted">{a.desc}</p>

      <div className="flex items-end justify-around gap-2 rounded-xl border border-border bg-surface-2/30 p-3" style={{ minHeight: 140 }}>
        {load.map((l, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[11px] font-mono font-bold">{l}</span>
            <motion.div animate={{ height: `${(l / max) * 90 + 8}px` }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={cn('w-full max-w-[48px] rounded-t-md', last === i ? 'bg-brand-500' : 'bg-brand-400/50')} />
            <div className={cn('flex items-center gap-1 rounded-md border px-1.5 py-0.5', last === i ? 'border-brand-400 text-brand-600 dark:text-brand-300' : 'border-border text-muted')}>
              <Server size={12} /><span className="text-[10px] font-bold">S{i + 1}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button onClick={() => send(1)} className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-600">Send 1 request</button>
        <button onClick={() => send(20)} className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold hover:bg-surface-2">Send 20</button>
        <button onClick={reset} className="ml-auto inline-flex items-center gap-1 text-xs text-muted hover:text-text"><RotateCcw size={13} /> Reset</button>
      </div>
    </div>
  );
}
