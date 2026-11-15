import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Hand, Loader2, MoonStar, RotateCcw, Send, Timer } from 'lucide-react';
import { cn } from '@/lib/cn';

// The main thread, playable: post messages into the MessageQueue, watch
// Looper.loop() drain them one at a time — then block the thread and
// watch a real ANR happen.

type Kind = 'input' | 'work' | 'delayed';

interface Msg {
  id: number;
  kind: Kind;
  label: string;
  enqueuedAt: number;
  dueAt: number;
}

const EXEC_MS = 900;
const ANR_MS = 5000;
const BLOCK_MS = 6000;

const KIND_STYLE: Record<Kind, { bg: string; border: string; text: string }> = {
  input: { bg: '#2a2310', border: '#d7b155', text: '#f3dc9b' },
  work: { bg: '#1d2a1d', border: '#6fae6a', text: '#b9e0b5' },
  delayed: { bg: '#1a1a22', border: '#7a7a9a', text: '#c3c3da' },
};

export function HandlerLooper() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [current, setCurrent] = useState<{ msg: Msg; startedAt: number } | null>(null);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [anr, setAnr] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const nextId = useRef(1);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, []);

  const blocked = blockedUntil !== null && now < blockedUntil;

  // Drive the "looper" off the ticking clock.
  useEffect(() => {
    if (anr) return;
    const t = Date.now();

    // ANR detector: an input event stuck in the queue past the deadline.
    const stuckInput = msgs.find((m) => m.kind === 'input' && t - m.enqueuedAt > ANR_MS);
    if (stuckInput) { setAnr(true); return; }

    if (blocked) return;
    if (blockedUntil !== null && t >= blockedUntil) setBlockedUntil(null);

    if (current) {
      if (t - current.startedAt >= EXEC_MS) setCurrent(null);
      return;
    }
    const next = msgs.find((m) => m.dueAt <= t);
    if (next) {
      setMsgs((q) => q.filter((m) => m.id !== next.id));
      setCurrent({ msg: next, startedAt: t });
    }
  }, [now, msgs, current, blocked, blockedUntil, anr]);

  const post = (kind: Kind) => {
    if (anr) return;
    const t = Date.now();
    const id = nextId.current++;
    const label = kind === 'input' ? `touch #${id}` : kind === 'work' ? `runnable #${id}` : `delayed #${id}`;
    setMsgs((q) => [...q, { id, kind, label, enqueuedAt: t, dueAt: kind === 'delayed' ? t + 2000 : t }]);
  };

  const block = () => { if (!anr) setBlockedUntil(Date.now() + BLOCK_MS); };
  const reset = () => { setMsgs([]); setCurrent(null); setBlockedUntil(null); setAnr(false); nextId.current = 1; };

  const idle = !current && msgs.length === 0 && !blocked && !anr;
  const execPct = current ? Math.min(100, ((now - current.startedAt) / EXEC_MS) * 100) : 0;
  const blockLeft = blocked && blockedUntil ? Math.ceil((blockedUntil - now) / 1000) : 0;

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        Handler · Looper · MessageQueue <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Everything the main thread ever does is a message in one queue. Post some — then block the thread and see why ANRs happen.
      </p>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => post('input')} disabled={anr} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#d7b155] bg-[#2a2310] px-2.5 py-1.5 text-xs font-bold text-[#f3dc9b] hover:brightness-125 disabled:opacity-40">
          <Hand size={13} /> Touch event
        </button>
        <button onClick={() => post('work')} disabled={anr} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#6fae6a] bg-[#1d2a1d] px-2.5 py-1.5 text-xs font-bold text-[#b9e0b5] hover:brightness-125 disabled:opacity-40">
          <Send size={13} /> handler.post( )
        </button>
        <button onClick={() => post('delayed')} disabled={anr} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#7a7a9a] bg-[#1a1a22] px-2.5 py-1.5 text-xs font-bold text-[#c3c3da] hover:brightness-125 disabled:opacity-40">
          <Timer size={13} /> postDelayed(…, 2 s)
        </button>
        <button onClick={block} disabled={anr || blocked} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#c0564a] bg-[#2a1410] px-2.5 py-1.5 text-xs font-bold text-[#eda89e] hover:brightness-125 disabled:opacity-40">
          <AlertTriangle size={13} /> Block main thread ({BLOCK_MS / 1000} s)
        </button>
        <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-[#6a5624] px-2.5 py-1.5 text-xs font-semibold text-[#a8893f] hover:bg-[#241e0e]">
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr]">
        {/* MessageQueue */}
        <div className="rounded-xl border-2 border-[#8a7030] bg-[#1c1810] p-3">
          <div className="mb-2 text-center text-[13px] font-bold" style={{ color: '#d7b155' }}>MessageQueue</div>
          <div className="flex min-h-[120px] flex-col gap-1.5">
            <AnimatePresence initial={false}>
              {msgs.map((m) => {
                const st = KIND_STYLE[m.kind];
                const waitedS = ((now - m.enqueuedAt) / 1000);
                const pending = m.dueAt > now;
                const danger = m.kind === 'input' && waitedS > 2.5;
                return (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: pending ? 0.45 : 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    className={cn('flex items-center justify-between rounded-md border px-2 py-1 font-mono text-[11px]', danger && 'animate-pulse')}
                    style={{ background: st.bg, borderColor: danger ? '#c0564a' : st.border, color: st.text }}
                  >
                    <span>{m.label}</span>
                    <span style={{ color: danger ? '#eda89e' : undefined }}>
                      {pending ? `due in ${Math.ceil((m.dueAt - now) / 1000)}s` : `waiting ${waitedS.toFixed(1)}s`}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {msgs.length === 0 && (
              <div className="flex flex-1 items-center justify-center text-[11.5px] italic" style={{ color: '#6f6549' }}>
                queue empty
              </div>
            )}
          </div>
        </div>

        {/* Looper */}
        <div className="flex flex-col items-center justify-center gap-1 px-1">
          <Loader2
            size={30}
            className={cn(!blocked && !anr && (current || msgs.some((m) => m.dueAt <= now)) ? 'animate-spin' : '')}
            style={{ color: anr ? '#c0564a' : blocked ? '#7a4a40' : '#d7b155' }}
          />
          <div className="font-mono text-[10.5px] font-bold" style={{ color: '#9a874f' }}>Looper.loop()</div>
          <div className="text-center font-mono text-[9.5px] leading-tight" style={{ color: '#6f6549' }}>
            for (;;) {'{'} msg = queue.next();<br />msg.target.dispatchMessage(msg); {'}'}
          </div>
        </div>

        {/* Main thread */}
        <div className={cn('rounded-xl border-2 p-3', anr ? 'border-[#c0564a] bg-[#2a1410]' : 'border-[#8a7030] bg-[#1c1810]')}>
          <div className="mb-2 text-center text-[13px] font-bold" style={{ color: anr ? '#eda89e' : '#d7b155' }}>
            Main (UI) thread
          </div>
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-2">
            {anr ? (
              <div className="text-center">
                <AlertTriangle size={26} className="mx-auto text-[#c0564a]" />
                <div className="mt-1.5 font-mono text-[12px] font-bold text-[#eda89e]">ANR</div>
                <div className="mt-1 px-2 text-[11px] leading-snug" style={{ color: '#d8b3ab' }}>
                  Input dispatching timed out — a touch event waited &gt; 5 s. The system shows “App isn’t responding”.
                </div>
              </div>
            ) : blocked ? (
              <div className="text-center">
                <div className="font-mono text-[12px] font-bold" style={{ color: '#eda89e' }}>Thread.sleep(…)</div>
                <div className="mt-1 text-[11px] italic" style={{ color: '#9a874f' }}>blocked for {blockLeft}s more — nothing dispatches</div>
              </div>
            ) : current ? (
              <div className="w-full px-2 text-center">
                <div className="font-mono text-[12px] font-bold" style={{ color: KIND_STYLE[current.msg.kind].text }}>
                  dispatching {current.msg.label}
                </div>
                <div className="mx-auto mt-2 h-1.5 w-4/5 overflow-hidden rounded-full bg-[#2e2817]">
                  <div className="h-full rounded-full bg-[#d7b155] transition-all" style={{ width: `${execPct}%` }} />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <MoonStar size={22} className="mx-auto" style={{ color: '#6f6549' }} />
                <div className="mt-1.5 font-mono text-[11px] font-bold" style={{ color: '#9a874f' }}>nativePollOnce( )</div>
                <div className="mt-0.5 px-2 text-[10.5px] italic leading-snug" style={{ color: '#6f6549' }}>
                  {idle ? 'asleep on epoll — an empty loop costs 0% CPU' : 'waiting…'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        Gold = input · green = posted work · grey = delayed. An input message that waits over 5 s = ANR.
      </div>
    </div>
  );
}
