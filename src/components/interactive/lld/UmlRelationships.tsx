import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type EndA = 'none' | 'diamondHollow' | 'diamondFilled';
type EndB = 'none' | 'triangleHollow' | 'arrowOpen';

interface Rel {
  id: string;
  name: string;
  phrase: string;
  classA: string;
  classB: string;
  dashed: boolean;
  endA: EndA;
  endB: EndB;
  detail: string;
  lifetime: string;
}

const RELS: Rel[] = [
  {
    id: 'inheritance', name: 'Inheritance', phrase: 'is-a', classA: 'Car', classB: 'Vehicle',
    dashed: false, endA: 'none', endB: 'triangleHollow',
    detail: 'A subclass extends a superclass and inherits its members. Drawn as a solid line with a hollow triangle pointing to the PARENT.',
    lifetime: 'Car IS-A Vehicle. Use only for genuine specialisation — prefer composition when in doubt.',
  },
  {
    id: 'realization', name: 'Realization', phrase: 'implements', classA: 'UpiPayment', classB: 'Payment',
    dashed: true, endA: 'none', endB: 'triangleHollow',
    detail: 'A class implements an interface (the contract). Drawn as a DASHED line with a hollow triangle pointing to the interface.',
    lifetime: 'UpiPayment realizes the Payment interface — it promises to fulfil that contract.',
  },
  {
    id: 'association', name: 'Association', phrase: 'knows-a', classA: 'Teacher', classB: 'Student',
    dashed: false, endA: 'none', endB: 'arrowOpen',
    detail: 'A general "uses/knows" link between two objects that have their own lifecycles. A solid line, optionally with an open arrow showing direction.',
    lifetime: 'A Teacher is associated with Students, but neither owns the other.',
  },
  {
    id: 'aggregation', name: 'Aggregation', phrase: 'has-a (weak)', classA: 'Team', classB: 'Player',
    dashed: false, endA: 'diamondHollow', endB: 'none',
    detail: 'A "whole-part" link where the part can exist INDEPENDENTLY of the whole. A HOLLOW diamond sits at the whole (container) end.',
    lifetime: 'A Team has Players, but a Player still exists if the Team is disbanded — shared, independent lifetimes.',
  },
  {
    id: 'composition', name: 'Composition', phrase: 'owns-a (strong)', classA: 'House', classB: 'Room',
    dashed: false, endA: 'diamondFilled', endB: 'none',
    detail: 'A strong "whole-part" link where the part CANNOT exist without the whole. A FILLED diamond sits at the owner end.',
    lifetime: 'A House owns its Rooms — destroy the House and its Rooms go with it. Tied lifetimes.',
  },
  {
    id: 'dependency', name: 'Dependency', phrase: 'uses', classA: 'OrderService', classB: 'EmailSender',
    dashed: true, endA: 'none', endB: 'arrowOpen',
    detail: 'A transient "uses" relationship — e.g. one class takes another as a method parameter or local variable. A DASHED line with an open arrow.',
    lifetime: 'OrderService depends on EmailSender only while sending — the weakest coupling of all.',
  },
];

function Connector({ rel }: { rel: Rel }) {
  // Two class boxes joined by a connector carrying UML decorations.
  const y = 45;
  const x1 = 132; // right edge of box A
  const x2 = 268; // left edge of box B
  return (
    <svg viewBox="0 0 400 90" className="w-full">
      {/* Class A */}
      <rect x="12" y="22" width="120" height="46" rx="6" className="fill-brand-500/10 stroke-brand-400" strokeWidth="1.5" />
      <text x="72" y="49" textAnchor="middle" className="fill-current text-[12px] font-bold font-mono">{rel.classA}</text>
      {/* Class B */}
      <rect x="268" y="22" width="120" height="46" rx="6" className="fill-surface-2 stroke-border" strokeWidth="1.5" />
      <text x="328" y="49" textAnchor="middle" className="fill-current text-[12px] font-bold font-mono">{rel.classB}</text>

      {/* Connector line (leave room for end decorations) */}
      <line
        x1={rel.endA === 'none' ? x1 : x1 + 18}
        y1={y}
        x2={rel.endB === 'none' ? x2 : x2 - 18}
        y2={y}
        className="stroke-current text-muted"
        strokeWidth="1.75"
        strokeDasharray={rel.dashed ? '5 4' : undefined}
      />

      {/* End A decoration (at box A, the "whole" for aggregation/composition) */}
      {rel.endA === 'diamondHollow' && (
        <polygon points={`${x1},${y} ${x1 + 9},${y - 6} ${x1 + 18},${y} ${x1 + 9},${y + 6}`} className="fill-surface stroke-current text-muted" strokeWidth="1.5" />
      )}
      {rel.endA === 'diamondFilled' && (
        <polygon points={`${x1},${y} ${x1 + 9},${y - 6} ${x1 + 18},${y} ${x1 + 9},${y + 6}`} className="fill-current text-brand-500" />
      )}

      {/* End B decoration (at box B, the parent/interface/target) */}
      {rel.endB === 'triangleHollow' && (
        <polygon points={`${x2},${y - 8} ${x2},${y + 8} ${x2 - 14},${y}`} className="fill-surface stroke-current text-muted" strokeWidth="1.5" />
      )}
      {rel.endB === 'arrowOpen' && (
        <>
          <line x1={x2 - 14} y1={y - 7} x2={x2} y2={y} className="stroke-current text-muted" strokeWidth="1.75" />
          <line x1={x2 - 14} y1={y + 7} x2={x2} y2={y} className="stroke-current text-muted" strokeWidth="1.75" />
        </>
      )}

      {/* phrase label above the line */}
      <text x="200" y={y - 9} textAnchor="middle" className="fill-current text-[11px] italic text-muted">«{rel.phrase}»</text>
    </svg>
  );
}

export function UmlRelationships() {
  const [active, setActive] = useState('inheritance');
  const rel = RELS.find((r) => r.id === active)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">The 6 UML class relationships — tap to see the notation</div>
      <div className="flex flex-wrap gap-1.5">
        {RELS.map((r) => (
          <button
            key={r.id}
            onClick={() => setActive(r.id)}
            className={cn(
              'rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors',
              r.id === active ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2',
            )}
          >
            {r.name}
          </button>
        ))}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mt-3 rounded-xl border border-border bg-surface-2/30 p-2">
          <Connector rel={rel} />
        </div>
        <div className="mt-2 rounded-xl border border-border bg-surface-2/50 p-3">
          <div className="mb-1 flex items-center gap-2 font-semibold">{rel.name} <span className="rounded-full bg-brand-500/10 px-2 py-0.5 font-mono text-[10px] text-brand-700 dark:text-brand-300">«{rel.phrase}»</span></div>
          <p className="text-sm text-muted">{rel.detail}</p>
          <p className="mt-1.5 text-sm"><span className="font-semibold">Lifetime:</span> <span className="text-muted">{rel.lifetime}</span></p>
        </div>
      </motion.div>

      <p className="mt-2 text-xs text-muted">
        Strength of "ownership", weakest → strongest: <span className="font-semibold">Dependency → Association → Aggregation → Composition</span>. Getting the diamond (hollow vs filled) right is a classic interview detail.
      </p>
    </div>
  );
}
