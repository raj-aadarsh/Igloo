import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type Pair = 'CP' | 'AP' | 'CA';

const INFO: Record<Pair, { title: string; realistic: boolean; desc: string; examples: string }> = {
  CP: {
    title: 'CP — Consistency + Partition tolerance', realistic: true,
    desc: 'During a network partition, refuse/again-later some requests to avoid returning stale data. Every read sees the latest write — or an error. Choose when correctness > uptime (banking, inventory, locks).',
    examples: 'HBase, MongoDB (default), Zookeeper, etcd, Redis (single-leader)',
  },
  AP: {
    title: 'AP — Availability + Partition tolerance', realistic: true,
    desc: 'During a partition, every node still answers — possibly with slightly stale data — and reconciles later (eventual consistency). Choose when uptime > perfect freshness (feeds, carts, DNS).',
    examples: 'Cassandra, DynamoDB, Riak, CouchDB',
  },
  CA: {
    title: 'CA — Consistency + Availability', realistic: false,
    desc: 'Only achievable when there are NO partitions — i.e. a single node or a single-machine database. Real distributed systems span a network, where partitions are inevitable, so you cannot truly "pick CA".',
    examples: 'A single-node RDBMS (not a distributed system)',
  },
};

const VERT = { C: { x: 150, y: 30 }, A: { x: 40, y: 175 }, P: { x: 260, y: 175 } };
const inPair = (p: Pair, v: 'C' | 'A' | 'P') => p.includes(v);

export function CapTheorem() {
  const [pair, setPair] = useState<Pair>('CP');
  const info = INFO[pair];

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">CAP theorem — pick the two guarantees you’ll keep</div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        <svg viewBox="0 0 300 210" className="w-full max-w-[300px]">
          {/* edges (a "pick" is an edge between two vertices) */}
          {(['CP', 'AP', 'CA'] as Pair[]).map((p) => {
            const [a, b] = p.split('') as ('C' | 'A' | 'P')[];
            const va = VERT[a], vb = VERT[b];
            return <line key={p} x1={va.x} y1={va.y} x2={vb.x} y2={vb.y} strokeWidth={pair === p ? 4 : 2}
              className={cn('transition-all', pair === p ? 'stroke-brand-500' : 'stroke-border')} />;
          })}
          {(['C', 'A', 'P'] as const).map((v) => {
            const on = inPair(pair, v);
            return (
              <g key={v}>
                <motion.circle cx={VERT[v].x} cy={VERT[v].y} r="26" animate={{ scale: on ? 1 : 0.9 }}
                  className={cn(on ? 'fill-brand-500/15 stroke-brand-500' : 'fill-surface-2 stroke-border')} strokeWidth="2" />
                <text x={VERT[v].x} y={VERT[v].y} textAnchor="middle" dominantBaseline="middle" className={cn('text-lg font-black', on ? 'fill-current text-brand-600 dark:text-brand-300' : 'fill-current text-muted')}>{v}</text>
              </g>
            );
          })}
          <text x={VERT.C.x} y={VERT.C.y - 32} textAnchor="middle" className="fill-current text-[10px] text-muted">Consistency</text>
          <text x={VERT.A.x - 4} y={VERT.A.y + 40} textAnchor="middle" className="fill-current text-[10px] text-muted">Availability</text>
          <text x={VERT.P.x + 4} y={VERT.P.y + 40} textAnchor="middle" className="fill-current text-[10px] text-muted">Partition tol.</text>
        </svg>

        <div className="flex-1">
          <div className="mb-2 flex gap-1.5">
            {(['CP', 'AP', 'CA'] as Pair[]).map((p) => (
              <button key={p} onClick={() => setPair(p)} className={cn('rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors', pair === p ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2')}>{p}</button>
            ))}
          </div>
          <motion.div key={pair} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-surface-2/50 p-3">
            <div className="mb-1 flex items-center gap-2 text-sm font-bold">{info.title}{!info.realistic && <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300">not realistic</span>}</div>
            <p className="text-sm text-muted">{info.desc}</p>
            <p className="mt-1.5 text-xs"><span className="font-semibold">Examples:</span> <span className="font-mono text-muted">{info.examples}</span></p>
          </motion.div>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted"><strong>The real choice:</strong> in any distributed system, network partitions WILL happen, so P is mandatory. CAP then reduces to: during a partition, do you favour <strong>Consistency (CP)</strong> or <strong>Availability (AP)</strong>?</p>
    </div>
  );
}
