import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

// The 4 launch modes, made touchable: pick B's launchMode, launch activities,
// and watch what happens to the task's back stack.

type Mode = 'standard' | 'singleTop' | 'singleTask' | 'singleInstance';

const MODES: { id: Mode; hint: string }[] = [
  { id: 'standard', hint: 'new instance every single time' },
  { id: 'singleTop', hint: 'reuse only if already on top → onNewIntent()' },
  { id: 'singleTask', hint: 'one instance in its task — clears everything above it' },
  { id: 'singleInstance', hint: 'one instance, all alone in its own task' },
];

export function LaunchModes() {
  const [mode, setMode] = useState<Mode>('standard');
  const [t1, setT1] = useState<string[]>(['A']);
  const [t2, setT2] = useState<string[]>([]);
  const [focused, setFocused] = useState<'t1' | 't2'>('t1');
  const [msg, setMsg] = useState('Task 1 starts with A on the stack. Launch away.');

  const pickMode = (m: Mode) => {
    setMode(m);
    setT1(['A']); setT2([]); setFocused('t1');
    setMsg(`B is now ${m}. Stack reset — try the same launches again and compare.`);
  };

  const launch = (name: 'A' | 'B' | 'C') => {
    if (name !== 'B') {
      // A and C are plain standard activities — they always join Task 1.
      if (focused === 't2') {
        setT1((s) => [...s, name]); setFocused('t1');
        setMsg(`${name} is standard — it can’t live in B’s singleInstance task, so it lands on Task 1 (brought forward).`);
      } else {
        setT1((s) => [...s, name]);
        setMsg(`New ${name} pushed onto Task 1. (standard = a fresh instance, every time)`);
      }
      return;
    }
    if (mode === 'standard') {
      setT1((s) => [...s, 'B']); setFocused('t1');
      setMsg('New B pushed — standard never reuses, even if B is already on top. Launch B twice and you get two Bs.');
    } else if (mode === 'singleTop') {
      if (focused === 't1' && t1[t1.length - 1] === 'B') {
        setMsg('B is already on top → NO new instance. The existing B gets onNewIntent() instead.');
      } else {
        setT1((s) => [...s, 'B']); setFocused('t1');
        setMsg('B wasn’t on top, so singleTop still creates a new instance. (It only dedupes the very top.)');
      }
    } else if (mode === 'singleTask') {
      const idx = t1.indexOf('B');
      if (idx >= 0) {
        const cleared = t1.slice(idx + 1);
        setT1(t1.slice(0, idx + 1)); setFocused('t1');
        setMsg(cleared.length > 0
          ? `B already lives in the task → everything above it (${cleared.join(', ')}) is destroyed, and B gets onNewIntent().`
          : 'B is already on top of its task → just onNewIntent().');
      } else {
        setT1((s) => [...s, 'B']); setFocused('t1');
        setMsg('No B anywhere yet → created in the task like normal. The “clearing” magic only shows on re-launch.');
      }
    } else {
      // singleInstance
      if (t2.length > 0) {
        setFocused('t2');
        setMsg('B exists in its own private task → that task comes forward and B gets onNewIntent(). Nothing new created.');
      } else {
        setT2(['B']); setFocused('t2');
        setMsg('B is singleInstance → it gets a brand-new task all to itself. No other activity may ever join it.');
      }
    }
  };

  const reset = () => { setT1(['A']); setT2([]); setFocused('t1'); setMsg('Stack reset.'); };

  const Task = ({ id, stack }: { id: 't1' | 't2'; stack: string[] }) => (
    <div className={cn('flex-1 rounded-xl border-2 p-2.5 transition-colors', focused === id ? 'border-[#d7b155] bg-[#1c1810]' : 'border-[#4a3d1c] bg-[#161208]')}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12px] font-bold" style={{ color: focused === id ? '#f3dc9b' : '#9a874f' }}>
          {id === 't1' ? 'Task 1' : 'Task 2 (B’s own)'}
        </span>
        {focused === id && <span className="rounded px-1.5 py-0.5 text-[9px] font-bold" style={{ background: '#2a2310', color: '#d7b155' }}>in front</span>}
      </div>
      <div className="flex min-h-[132px] flex-col-reverse justify-start gap-1.5">
        <AnimatePresence initial={false}>
          {stack.map((name, i) => {
            const isTop = i === stack.length - 1;
            return (
              <motion.div
                key={`${id}-${i}-${name}`}
                layout
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 28 }}
                className="rounded-lg border-2 px-3 py-2 text-center font-mono text-[13px] font-bold"
                style={{
                  borderColor: name === 'B' ? '#6fae6a' : '#8a7030',
                  background: name === 'B' ? '#1d2a1d' : '#221d10',
                  color: name === 'B' ? '#b9e0b5' : '#f3dc9b',
                  boxShadow: isTop && focused === id ? '0 0 14px rgba(215,177,85,0.3)' : undefined,
                }}
              >
                Activity {name}{isTop && focused === id ? '  ← user sees this' : ''}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {stack.length === 0 && <div className="py-10 text-center text-[11px] italic" style={{ color: '#6f6549' }}>empty</div>}
      </div>
    </div>
  );

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        The 4 Launch Modes <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        A task = one stack of activity “cards” the Back button pops through. Pick B’s mode, launch things, watch the stacks.
      </p>

      {/* Mode picker */}
      <div className="mb-3 grid gap-1.5 sm:grid-cols-4">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => pickMode(m.id)}
            className={cn('rounded-lg border-2 px-2 py-1.5 text-left transition-colors', mode === m.id ? 'border-[#6fae6a] bg-[#1d2a1d]' : 'border-[#4a3d1c] bg-[#161208] hover:border-[#8a7030]')}
          >
            <div className="font-mono text-[11.5px] font-bold" style={{ color: mode === m.id ? '#b9e0b5' : '#d7b155' }}>{m.id}</div>
            <div className="text-[9.5px] leading-tight" style={{ color: '#8d8268' }}>{m.hint}</div>
          </button>
        ))}
      </div>

      {/* Launch buttons */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {(['A', 'B', 'C'] as const).map((n) => (
          <button key={n} onClick={() => launch(n)} className="rounded-lg border border-[#6a5624] px-3 py-1.5 font-mono text-xs font-bold text-[#d7b155] hover:bg-[#241e0e]">
            Launch {n}
          </button>
        ))}
        <span className="text-[10.5px] italic" style={{ color: '#6f6549' }}>(A & C are standard — only B follows the chosen mode)</span>
        <button onClick={reset} className="ml-auto inline-flex items-center gap-1 rounded-lg border border-[#6a5624] px-2 py-1.5 text-xs font-semibold text-[#a8893f] hover:bg-[#241e0e]">
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      <div className="flex gap-3">
        <Task id="t1" stack={t1} />
        {t2.length > 0 && <Task id="t2" stack={t2} />}
      </div>

      <div className="mt-3 rounded-xl border border-[#4a3d1c] bg-[#161208] px-3 py-2 text-[12.5px] leading-relaxed" style={{ color: '#ded4ba' }}>
        {msg}
      </div>

      <div className="mt-3 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        Try this classic: set singleTask → launch B, C, then B again — and watch C disappear.
      </div>
    </div>
  );
}
