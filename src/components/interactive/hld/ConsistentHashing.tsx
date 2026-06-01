import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
const angleOf = (s: string) => hash(s) % 360;

const KEYS = ['user:42', 'cart:7', 'img:9', 'post:3', 'msg:1', 'k:88', 'doc:5', 'sess:2', 'v:12', 'job:6'];
const PALETTE = ['#1f9d72', '#c58a1c', '#3b82f6', '#e0518a', '#8b5cf6', '#0ea5e9'];

const CX = 150, CY = 130, R = 92;
const pt = (deg: number, r = R) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
};

// First node clockwise from the key's angle owns the key.
function ownerOf(keyAngle: number, nodes: { id: string; angle: number }[]): string {
  const sorted = [...nodes].sort((a, b) => a.angle - b.angle);
  for (const n of sorted) if (n.angle >= keyAngle) return n.id;
  return sorted[0]?.id; // wrap around
}

export function ConsistentHashing() {
  const [nodeIds, setNodeIds] = useState(['NodeA', 'NodeB', 'NodeC']);
  const prevOwners = useRef<Record<string, string>>({});
  const [moved, setMoved] = useState<Set<string>>(new Set());

  const nodes = useMemo(() => nodeIds.map((id) => ({ id, angle: angleOf(id) })), [nodeIds]);
  const colorOf = (id: string) => PALETTE[nodeIds.indexOf(id) % PALETTE.length];

  const keyData = useMemo(() => KEYS.map((k) => ({ k, angle: angleOf(k), owner: ownerOf(angleOf(k), nodes) })), [nodes]);

  const apply = (next: string[]) => {
    // record current owners, change topology, then flag which keys moved
    prevOwners.current = Object.fromEntries(keyData.map((d) => [d.k, d.owner]));
    const nn = next.map((id) => ({ id, angle: angleOf(id) }));
    const movedSet = new Set<string>();
    KEYS.forEach((k) => { if (ownerOf(angleOf(k), nn) !== prevOwners.current[k]) movedSet.add(k); });
    setMoved(movedSet);
    setNodeIds(next);
  };

  const addNode = () => apply([...nodeIds, `Node${String.fromCharCode(65 + nodeIds.length)}`]);
  const removeNode = () => nodeIds.length > 1 && apply(nodeIds.slice(0, -1));

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted">Consistent hashing ring — add/remove a node, watch how few keys move</span>
        <div className="ml-auto flex gap-1.5">
          <button onClick={addNode} className="inline-flex items-center gap-1 rounded-lg border border-brand-400 bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300"><Plus size={13} /> node</button>
          <button onClick={removeNode} disabled={nodeIds.length <= 1} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-muted hover:bg-surface-2 disabled:opacity-40"><Minus size={13} /> node</button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        <svg viewBox="0 0 300 260" className="w-full max-w-[320px]">
          <circle cx={CX} cy={CY} r={R} fill="none" className="stroke-border" strokeWidth="2" />
          {/* keys */}
          {keyData.map((d) => {
            const p = pt(d.angle);
            const c = colorOf(d.owner);
            const isMoved = moved.has(d.k);
            return (
              <g key={d.k}>
                {isMoved && <motion.circle cx={p.x} cy={p.y} r="9" fill="none" stroke={c} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.4] }} />}
                <circle cx={p.x} cy={p.y} r="4.5" fill={c} />
              </g>
            );
          })}
          {/* nodes */}
          {nodes.map((n) => {
            const p = pt(n.angle);
            const lp = pt(n.angle, R + 16);
            return (
              <g key={n.id}>
                <rect x={p.x - 6} y={p.y - 6} width="12" height="12" rx="2" fill={colorOf(n.id)} className="stroke-surface" strokeWidth="2" />
                <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" className="fill-current text-[9px] font-bold">{n.id}</text>
              </g>
            );
          })}
        </svg>

        <div className="flex-1 text-sm">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {nodes.map((n) => (
              <span key={n.id} className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-semibold">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: colorOf(n.id) }} /> {n.id}
              </span>
            ))}
          </div>
          <p className="text-muted">Each key (dot) is owned by the <strong>first node clockwise</strong>. When you add or remove a node, only the keys in <em>that node’s arc</em> get a new owner — <strong>{moved.size}</strong> key(s) moved this time, not all {KEYS.length}.</p>
          <p className="mt-2 text-xs text-muted">A plain <span className="font-mono">hash(key) % N</span> would remap <strong>almost every key</strong> when N changes. Consistent hashing remaps only ~1/N of them — which is why it underpins distributed caches, sharded databases, and CDNs.</p>
        </div>
      </div>
    </div>
  );
}
