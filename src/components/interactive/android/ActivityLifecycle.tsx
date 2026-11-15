import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Home, MessageSquare, Play, RotateCcw, RotateCw, Skull, Square } from 'lucide-react';
import { cn } from '@/lib/cn';

// A tiny phone you can drive: launch, press Home, rotate, show a dialog,
// press Back — and watch exactly which lifecycle callbacks fire, in order.

type LifeState = 'destroyed' | 'resumed' | 'paused' | 'stopped';

interface LogEntry {
  id: number;
  text: string;
  kind: 'cb' | 'note' | 'action';
}

const STATE_CHIP: Record<LifeState, { label: string; color: string; bg: string }> = {
  destroyed: { label: 'Destroyed — not running', color: '#eda89e', bg: '#2a1410' },
  resumed: { label: 'Resumed — visible & focused', color: '#b9e0b5', bg: '#1d2a1d' },
  paused: { label: 'Paused — visible, not focused', color: '#f3dc9b', bg: '#2a2310' },
  stopped: { label: 'Stopped — fully hidden', color: '#c3c3da', bg: '#1a1a22' },
};

export function ActivityLifecycle() {
  const [state, setState] = useState<LifeState>('destroyed');
  const [overlay, setOverlay] = useState<'none' | 'dialog' | 'translucent'>('none');
  const [log, setLog] = useState<LogEntry[]>([]);
  const [pending, setPending] = useState<LogEntry[]>([]);
  const nextId = useRef(1);
  const logBox = useRef<HTMLDivElement>(null);

  // Reveal queued entries one at a time, like handwriting appearing.
  useEffect(() => {
    if (pending.length === 0) return;
    const t = setTimeout(() => {
      setLog((l) => [...l, pending[0]]);
      setPending((p) => p.slice(1));
    }, 330);
    return () => clearTimeout(t);
  }, [pending]);

  useEffect(() => {
    logBox.current?.scrollTo({ top: logBox.current.scrollHeight, behavior: 'smooth' });
  }, [log]);

  const push = (entries: { text: string; kind?: LogEntry['kind'] }[]) => {
    setPending((p) => [...p, ...entries.map((e) => ({ id: nextId.current++, text: e.text, kind: e.kind ?? 'cb' }))]);
  };

  const busy = pending.length > 0;

  const launch = () => {
    push([
      { text: '▶ tap the app icon', kind: 'action' },
      { text: 'onCreate()  — activity object built, setContentView' },
      { text: 'onStart()  — becoming visible' },
      { text: 'onResume()  — in the foreground, has focus' },
    ]);
    setState('resumed');
  };

  const home = () => {
    push([
      { text: '▶ press Home', kind: 'action' },
      { text: 'onPause()  — losing focus' },
      { text: 'onStop()  — fully hidden' },
      { text: 'onSaveInstanceState()  — UI state parceled (after onStop since API 28)', kind: 'note' },
    ]);
    setState('stopped');
  };

  const returnToApp = () => {
    push([
      { text: '▶ reopen from recents', kind: 'action' },
      { text: 'onRestart()  — coming back from stopped' },
      { text: 'onStart()' },
      { text: 'onResume()' },
    ]);
    setState('resumed');
  };

  const rotate = () => {
    push([
      { text: '▶ rotate the screen', kind: 'action' },
      { text: 'onPause()' },
      { text: 'onStop()' },
      { text: 'onSaveInstanceState()  — your data rides in this Bundle', kind: 'note' },
      { text: 'onDestroy()  — this instance is gone!' },
      { text: 'onCreate(savedInstanceState)  — a brand-NEW instance', kind: 'note' },
      { text: 'onStart()' },
      { text: 'onRestoreInstanceState()  — Bundle comes back' },
      { text: 'onResume()' },
    ]);
    setState('resumed');
  };

  const dialog = () => {
    push([
      { text: '▶ show a Dialog', kind: 'action' },
      { text: '…no lifecycle callbacks at all — a Dialog is just a view in YOUR window', kind: 'note' },
    ]);
    setOverlay('dialog');
  };

  const translucent = () => {
    push([
      { text: '▶ a translucent activity opens on top', kind: 'action' },
      { text: 'onPause()  — still visible behind it, so NO onStop', kind: 'cb' },
    ]);
    setOverlay('translucent');
    setState('paused');
  };

  const closeOverlay = () => {
    if (overlay === 'dialog') {
      push([{ text: '▶ dismiss the dialog (still no callbacks)', kind: 'action' }]);
      setOverlay('none');
      return;
    }
    push([
      { text: '▶ the translucent activity closes', kind: 'action' },
      { text: 'onResume()  — focus is back' },
    ]);
    setOverlay('none');
    setState('resumed');
  };

  const back = () => {
    push([
      { text: '▶ press Back', kind: 'action' },
      { text: 'onPause()' },
      { text: 'onStop()' },
      { text: 'onDestroy()  — finishing for real; NO onSaveInstanceState (the user chose to leave)', kind: 'note' },
    ]);
    setState('destroyed');
  };

  const lowMemory = () => {
    push([
      { text: '▶ system needs memory while you’re stopped', kind: 'action' },
      { text: '✖ process killed — onDestroy() is NOT called. The saved Bundle is all that survives.', kind: 'note' },
    ]);
    setState('destroyed');
  };

  const reset = () => { setLog([]); setPending([]); setState('destroyed'); setOverlay('none'); };

  const chip = STATE_CHIP[state];
  const canAct = !busy && overlay === 'none';

  const Btn = ({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#6a5624] px-2.5 py-1.5 text-xs font-semibold text-[#d7b155] transition-colors hover:bg-[#241e0e] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        Activity Lifecycle — drive it yourself <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Press the buttons a user would press. Watch exactly which callbacks fire — and in what order.
      </p>

      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        {/* Phone mockup */}
        <div className="mx-auto">
          <div className="relative h-[230px] w-[120px] overflow-hidden rounded-[18px] border-2 border-[#8a7030] bg-[#0c0a05]">
            {/* screen content */}
            <div className="absolute inset-1.5 overflow-hidden rounded-[12px]">
              {state === 'destroyed' ? (
                <div className="flex h-full flex-col items-center justify-center gap-1 bg-[#15120a]">
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-4 w-4 rounded-md" style={{ background: i === 1 ? '#d7b155' : '#3a3320' }} />
                    ))}
                  </div>
                  <div className="mt-1 text-[8px]" style={{ color: '#6f6549' }}>home screen</div>
                </div>
              ) : (
                <div className={cn('flex h-full flex-col bg-[#1d2a1d] transition-opacity', state === 'stopped' && 'opacity-0')}>
                  <div className="bg-[#2a3c2a] px-2 py-1 text-[8px] font-bold text-[#b9e0b5]">Our Activity</div>
                  <div className="flex-1 p-1.5">
                    <div className="mb-1 h-2 rounded bg-[#2a3c2a]" />
                    <div className="mb-1 h-2 w-3/4 rounded bg-[#2a3c2a]" />
                    <div className="h-8 rounded-md bg-[#2a3c2a]" />
                  </div>
                </div>
              )}
              {state === 'stopped' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#15120a]">
                  <div className="text-[8px]" style={{ color: '#6f6549' }}>somewhere else —</div>
                  <div className="text-[8px]" style={{ color: '#6f6549' }}>activity fully hidden</div>
                </div>
              )}
              <AnimatePresence>
                {overlay === 'dialog' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-black/55">
                    <div className="w-4/5 rounded-lg border border-[#8a7030] bg-[#221d10] p-2 text-center">
                      <div className="text-[8px] font-bold text-[#f3dc9b]">Dialog</div>
                      <div className="mt-1 text-[7px] text-[#bda367]">same window, same activity</div>
                    </div>
                  </motion.div>
                )}
                {overlay === 'translucent' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-end bg-[#2a2310]/80">
                    <div className="h-2/3 w-full rounded-t-xl border-t border-[#8a7030] bg-[#221d10] p-2 text-center">
                      <div className="text-[8px] font-bold text-[#f3dc9b]">Another activity</div>
                      <div className="mt-0.5 text-[7px] text-[#bda367]">translucent — yours peeks through</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-2 rounded-lg px-2 py-1 text-center text-[10.5px] font-bold" style={{ color: chip.color, background: chip.bg }}>
            {chip.label}
          </div>
        </div>

        {/* Controls + log */}
        <div className="min-w-0">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            <Btn onClick={launch} disabled={!canAct || state !== 'destroyed'}><Play size={12} /> Launch app</Btn>
            <Btn onClick={home} disabled={!canAct || state !== 'resumed'}><Home size={12} /> Press Home</Btn>
            <Btn onClick={returnToApp} disabled={!canAct || state !== 'stopped'}><Square size={12} /> Reopen</Btn>
            <Btn onClick={rotate} disabled={!canAct || state !== 'resumed'}><RotateCw size={12} /> Rotate</Btn>
            <Btn onClick={dialog} disabled={!canAct || state !== 'resumed'}><MessageSquare size={12} /> Show a Dialog</Btn>
            <Btn onClick={translucent} disabled={!canAct || state !== 'resumed'}>Translucent on top</Btn>
            <Btn onClick={closeOverlay} disabled={busy || overlay === 'none'}>Close it</Btn>
            <Btn onClick={back} disabled={!canAct || state !== 'resumed'}><ArrowLeft size={12} /> Press Back</Btn>
            <Btn onClick={lowMemory} disabled={!canAct || state !== 'stopped'}><Skull size={12} /> Low memory kill</Btn>
            <Btn onClick={reset}><RotateCcw size={12} /> Clear</Btn>
          </div>

          <div ref={logBox} className="h-[190px] overflow-y-auto rounded-xl border border-[#4a3d1c] bg-[#161208] p-2.5 font-mono text-[11.5px] leading-relaxed">
            {log.length === 0 && <div className="italic" style={{ color: '#6f6549' }}>— callback log — press “Launch app” to begin</div>}
            {log.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn('whitespace-pre-wrap', e.kind === 'action' && 'mt-1.5 font-bold')}
                style={{ color: e.kind === 'action' ? '#8fd48a' : e.kind === 'note' ? '#bda367' : '#f3dc9b' }}
              >
                {e.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3.5 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        The two famous traps are here: a Dialog fires nothing, and rotation destroys & recreates the whole activity.
      </div>
    </div>
  );
}
