import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Play, RotateCcw, StepForward } from 'lucide-react';
import { RichText } from '@/components/ui/RichText';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// NotesFlow — a vertical "handwritten notes" flow diagram, styled like a dark
// notebook page: gold boxes, short side-notes beside each box, labelled
// arrows, and tap-to-expand depth. Reused by the Android Framework course.
// ---------------------------------------------------------------------------

export interface NotesNode {
  id: string;
  title: string;
  /** small mono annotation inside the box (path, PID, class name) */
  mono?: string;
  /** short handwritten side-notes shown beside the box */
  notes?: string[];
  /** longer explanation revealed on tap (supports **bold** and `code`) */
  detail?: string;
}

export type NotesStep =
  | { kind: 'node'; node: NotesNode; edge?: string }
  | { kind: 'branch'; title?: string; nodes: NotesNode[]; edge?: string };

const GOLD = '#d7b155';
const GOLD_DIM = '#a8893f';

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-0.5">
      <svg width="14" height="26" viewBox="0 0 14 26" className="shrink-0">
        <line x1="7" y1="0" x2="7" y2="19" stroke={GOLD_DIM} strokeWidth="1.6" />
        <path d="M2.5 18 L7 25 L11.5 18" fill="none" stroke={GOLD_DIM} strokeWidth="1.6" />
      </svg>
      {label && <span className="-mt-1 pb-1 font-mono text-[11px] italic" style={{ color: GOLD_DIM }}>{label}</span>}
    </div>
  );
}

function NodeBox({
  node,
  active,
  open,
  onClick,
  compact = false,
}: {
  node: NotesNode;
  active: boolean;
  open: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-xl border-2 px-3 py-2 text-center transition-all',
        compact ? 'min-h-[52px]' : 'px-4 py-2.5',
        active
          ? 'border-[#e8c56a] bg-[#2a2310] shadow-[0_0_22px_rgba(215,177,85,0.35)]'
          : 'border-[#8a7030] bg-[#1c1810] hover:border-[#c8a345]',
      )}
    >
      <span className={cn('block font-bold leading-snug', compact ? 'text-[12.5px]' : 'text-[14px] sm:text-[15px]')} style={{ color: active ? '#f3dc9b' : GOLD }}>
        {node.title}
      </span>
      {node.mono && (
        <span className="mt-0.5 block font-mono text-[10.5px] leading-tight" style={{ color: '#9a874f' }}>
          {node.mono}
        </span>
      )}
      {node.detail && (
        <ChevronDown size={12} className={cn('mx-auto mt-1 transition-transform', open && 'rotate-180')} style={{ color: GOLD_DIM }} />
      )}
    </button>
  );
}

function SideNotes({ notes, align = 'left' }: { notes?: string[]; align?: 'left' | 'right' }) {
  if (!notes || notes.length === 0) return <div className="hidden md:block" />;
  return (
    <div className={cn('flex flex-col justify-center gap-1', align === 'right' ? 'md:text-left' : 'md:text-right')}>
      {notes.map((n, i) => (
        <div key={i} className="text-[12px] italic leading-snug" style={{ color: '#bda367' }}>
          {align === 'right' && <span className="mr-1 not-italic" style={{ color: GOLD_DIM }}>→</span>}
          <RichText>{n}</RichText>
          {align === 'left' && <span className="ml-1 not-italic" style={{ color: GOLD_DIM }}>←</span>}
        </div>
      ))}
    </div>
  );
}

function DetailPanel({ node }: { node: NotesNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="mx-auto my-2 max-w-xl rounded-xl border border-[#4a3d1c] bg-[#161208] p-3.5 text-left text-[13px] leading-relaxed" style={{ color: '#ded4ba' }}>
        <div className="mb-1 font-bold" style={{ color: GOLD }}>{node.title}</div>
        {node.detail && <RichText>{node.detail}</RichText>}
      </div>
    </motion.div>
  );
}

export function NotesFlow({ title, steps, intro }: { title: string; steps: NotesStep[]; intro?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [walkIdx, setWalkIdx] = useState<number | null>(null);

  const stepNodeIds = steps.map((s) => (s.kind === 'node' ? [s.node.id] : s.nodes.map((n) => n.id)));
  const activeIds = walkIdx !== null ? stepNodeIds[walkIdx] : [];

  const startWalk = () => { setWalkIdx(0); openFirstOf(0); };
  const openFirstOf = (idx: number) => {
    const s = steps[idx];
    const first = s.kind === 'node' ? s.node : s.nodes[0];
    setOpenId(first.detail ? first.id : null);
  };
  const next = () => {
    if (walkIdx === null) return;
    if (walkIdx >= steps.length - 1) { setWalkIdx(null); setOpenId(null); return; }
    const n = walkIdx + 1;
    setWalkIdx(n);
    openFirstOf(n);
  };
  const reset = () => { setWalkIdx(null); setOpenId(null); };

  const toggle = (id: string, hasDetail: boolean) => {
    if (!hasDetail) return;
    setOpenId((o) => (o === id ? null : id));
  };

  const findOpen = (nodes: NotesNode[]) => nodes.find((n) => n.id === openId);

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      {/* Notebook heading — green ink, like the iPad notes */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
          {title} <span className="not-italic">:-</span>
        </h3>
        <div className="flex items-center gap-2">
          {walkIdx === null ? (
            <button onClick={startWalk} className="inline-flex items-center gap-1.5 rounded-lg border border-[#6a5624] px-2.5 py-1 text-xs font-semibold hover:bg-[#241e0e]" style={{ color: GOLD }}>
              <Play size={12} /> Walk through
            </button>
          ) : (
            <>
              <button onClick={next} className="inline-flex items-center gap-1.5 rounded-lg bg-[#d7b155] px-2.5 py-1 text-xs font-bold text-[#1c1810] hover:bg-[#e8c56a]">
                <StepForward size={12} /> {walkIdx >= steps.length - 1 ? 'Finish' : 'Next step'}
              </button>
              <button onClick={reset} className="inline-flex items-center gap-1 rounded-lg border border-[#6a5624] px-2 py-1 text-xs font-semibold hover:bg-[#241e0e]" style={{ color: GOLD_DIM }}>
                <RotateCcw size={11} />
              </button>
            </>
          )}
        </div>
      </div>
      {intro && <p className="mb-4 text-[12.5px] italic" style={{ color: '#8d8268' }}>{intro}</p>}

      <div className="mx-auto max-w-3xl">
        {steps.map((s, i) => {
          const edge = i > 0 ? steps[i].edge : undefined;
          if (s.kind === 'node') {
            const n = s.node;
            const open = openId === n.id;
            return (
              <div key={n.id}>
                {i > 0 && <Arrow label={edge} />}
                <div className="grid items-center gap-x-4 gap-y-1 md:grid-cols-[1fr_minmax(220px,340px)_1fr]">
                  <div className="hidden md:block" />
                  <NodeBox node={n} active={activeIds.includes(n.id)} open={open} onClick={() => toggle(n.id, !!n.detail)} />
                  <SideNotes notes={n.notes} align="right" />
                </div>
                <AnimatePresence>{open && <DetailPanel node={n} />}</AnimatePresence>
              </div>
            );
          }
          // Branch row — one parent splitting into parallel boxes
          const openNode = findOpen(s.nodes);
          return (
            <div key={`branch-${i}`}>
              {i > 0 && (
                <div className="relative mx-auto h-8 max-w-xl">
                  <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                    <path d="M50 0 V4 M14 4 H86 M14 4 V11 M50 4 V11 M86 4 V11" fill="none" stroke={GOLD_DIM} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                  </svg>
                  {edge && <span className="absolute left-1/2 top-0 ml-3 font-mono text-[10.5px] italic" style={{ color: GOLD_DIM }}>{edge}</span>}
                </div>
              )}
              <div className="mx-auto grid max-w-xl gap-2" style={{ gridTemplateColumns: `repeat(${s.nodes.length}, minmax(0,1fr))` }}>
                {s.nodes.map((n) => (
                  <div key={n.id} className="flex flex-col gap-1">
                    <NodeBox node={n} compact active={activeIds.includes(n.id)} open={openId === n.id} onClick={() => toggle(n.id, !!n.detail)} />
                    {n.notes && n.notes.length > 0 && (
                      <div className="px-0.5 text-center text-[10.5px] italic leading-snug" style={{ color: '#bda367' }}>
                        {n.notes.map((t, j) => (
                          <div key={j}><RichText>{t}</RichText></div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <AnimatePresence>{openNode && <DetailPanel node={openNode} />}</AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        Tap any box to unfold it — or walk the flow step by step.
      </div>
    </div>
  );
}
