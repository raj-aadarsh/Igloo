import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

// The U-shape of touch dispatch: down the tree (with interception),
// up the tree (bubbling) — the interview whiteboard question, playable.

interface LogEntry { id: number; text: string; kind: 'call' | 'note' | 'verdict'; where: 'activity' | 'list' | 'button' | null }

export function TouchDispatch() {
  const [intercept, setIntercept] = useState(false);
  const [consume, setConsume] = useState(true);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [pending, setPending] = useState<LogEntry[]>([]);
  const [hot, setHot] = useState<'activity' | 'list' | 'button' | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (pending.length === 0) return;
    const t = setTimeout(() => {
      const e = pending[0];
      setLog((l) => [...l, e]);
      if (e.where) setHot(e.where);
      setPending((p) => p.slice(1));
    }, 420);
    return () => clearTimeout(t);
  }, [pending]);

  const add = (entries: Omit<LogEntry, 'id'>[]) => setPending((p) => [...p, ...entries.map((e) => ({ ...e, id: nextId.current++ }))]);

  const tap = () => {
    setLog([]); setPending([]); setHot(null);
    const seq: Omit<LogEntry, 'id'>[] = [
      { text: 'ACTION_DOWN arrives from ViewRootImpl', kind: 'note', where: null },
      { text: 'Activity.dispatchTouchEvent()', kind: 'call', where: 'activity' },
      { text: 'ScrollList.dispatchTouchEvent()', kind: 'call', where: 'list' },
      { text: `ScrollList.onInterceptTouchEvent() → ${intercept}`, kind: 'call', where: 'list' },
    ];
    if (intercept) {
      seq.push(
        { text: '…the child never sees this event (and a mid-gesture child would get ACTION_CANCEL)', kind: 'note', where: 'list' },
        { text: 'ScrollList.onTouchEvent() → true', kind: 'call', where: 'list' },
        { text: '✓ consumed by ScrollList — the rest of the gesture goes straight to it', kind: 'verdict', where: 'list' },
      );
    } else {
      seq.push({ text: 'Button.dispatchTouchEvent()', kind: 'call', where: 'button' });
      if (consume) {
        seq.push(
          { text: 'Button.onTouchEvent() → true', kind: 'call', where: 'button' },
          { text: '✓ consumed by Button — MOVE and UP will be delivered directly to it', kind: 'verdict', where: 'button' },
        );
      } else {
        seq.push(
          { text: 'Button.onTouchEvent() → false', kind: 'call', where: 'button' },
          { text: '…nobody below wanted it — now it BUBBLES back up', kind: 'note', where: null },
          { text: 'ScrollList.onTouchEvent() → false', kind: 'call', where: 'list' },
          { text: 'Activity.onTouchEvent() → false', kind: 'call', where: 'activity' },
          { text: '✗ dropped — and since DOWN wasn’t consumed, the rest of this gesture won’t be delivered at all', kind: 'verdict', where: null },
        );
      }
    }
    add(seq);
  };

  const reset = () => { setLog([]); setPending([]); setHot(null); };

  const Box = ({ id, label, mono, children }: { id: 'activity' | 'list' | 'button'; label: string; mono: string; children?: React.ReactNode }) => (
    <div
      className="rounded-xl border-2 p-2 transition-all sm:p-2.5"
      style={{
        borderColor: hot === id ? '#e8c56a' : '#8a7030',
        background: hot === id ? '#241e0e' : 'transparent',
        boxShadow: hot === id ? '0 0 16px rgba(215,177,85,0.25)' : undefined,
      }}
    >
      <div className="mb-0.5 flex items-baseline gap-2">
        <span className="text-[12.5px] font-bold" style={{ color: hot === id ? '#f3dc9b' : '#d7b155' }}>{label}</span>
        <span className="font-mono text-[9px]" style={{ color: '#9a874f' }}>{mono}</span>
      </div>
      {children}
    </div>
  );

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        Touch Dispatch — the U-shape <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Down the tree asking “anyone want this?”, back up if nobody did. Flip the switches and send a tap.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* The view tree */}
        <div>
          <Box id="activity" label="Activity" mono="the outermost receiver">
            <Box id="list" label="ScrollList" mono="ViewGroup — can intercept">
              <Box id="button" label="Button" mono="the child under your finger" />
            </Box>
          </Box>

          <div className="mt-3 space-y-1.5">
            <label className="flex cursor-pointer items-center gap-2 text-[12px]" style={{ color: '#ded4ba' }}>
              <input type="checkbox" checked={intercept} onChange={(e) => setIntercept(e.target.checked)} className="accent-[#d7b155]" />
              ScrollList intercepts <span className="font-mono text-[10px]" style={{ color: '#9a874f' }}>onInterceptTouchEvent() → true</span>
            </label>
            <label className={cn('flex cursor-pointer items-center gap-2 text-[12px]', intercept && 'opacity-40')} style={{ color: '#ded4ba' }}>
              <input type="checkbox" checked={consume} disabled={intercept} onChange={(e) => setConsume(e.target.checked)} className="accent-[#d7b155]" />
              Button consumes <span className="font-mono text-[10px]" style={{ color: '#9a874f' }}>onTouchEvent() → true</span>
            </label>
            <div className="flex gap-2 pt-1">
              <button onClick={tap} disabled={pending.length > 0} className="inline-flex items-center gap-1.5 rounded-lg bg-[#d7b155] px-3 py-1.5 text-xs font-bold text-[#1c1810] hover:bg-[#e8c56a] disabled:opacity-40">
                <MousePointerClick size={13} /> Send a tap
              </button>
              <button onClick={reset} className="inline-flex items-center gap-1 rounded-lg border border-[#6a5624] px-2 py-1.5 text-xs font-semibold text-[#a8893f] hover:bg-[#241e0e]">
                <RotateCcw size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Call log */}
        <div className="min-h-[200px] rounded-xl border border-[#4a3d1c] bg-[#161208] p-2.5 font-mono text-[11.5px] leading-relaxed">
          {log.length === 0 && <div className="italic" style={{ color: '#6f6549' }}>— call sequence appears here —</div>}
          {log.map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(e.kind === 'verdict' && 'mt-1 font-bold')}
              style={{ color: e.kind === 'verdict' ? (e.text.startsWith('✓') ? '#b9e0b5' : '#eda89e') : e.kind === 'note' ? '#bda367' : '#f3dc9b' }}
            >
              {e.text}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-3.5 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        This is how a scrolling list “steals” your press mid-swipe — interception, then ACTION_CANCEL to the child.
      </div>
    </div>
  );
}
