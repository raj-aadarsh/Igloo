import { useState } from 'react';
import { motion } from 'framer-motion';
import { Skull } from 'lucide-react';
import { cn } from '@/lib/cn';

// AMS ranks every process by importance (oom_score_adj); lmkd kills from the
// bottom of the ladder when memory runs low. Drag the pressure up and watch.

interface Proc {
  id: string;
  name: string;
  role: string;
  adj: number;
}

const PROCS: Proc[] = [
  { id: 'system', name: 'system_server', role: 'SYSTEM_ADJ · the framework itself', adj: -900 },
  { id: 'sysui', name: 'com.android.systemui', role: 'PERSISTENT_PROC_ADJ · status bar', adj: -800 },
  { id: 'fg', name: 'Foreground app', role: 'FOREGROUND_APP_ADJ · what the user is touching', adj: 0 },
  { id: 'vis', name: 'Visible app', role: 'VISIBLE_APP_ADJ · seen behind a translucent screen', adj: 100 },
  { id: 'fgs', name: 'Music app', role: 'PERCEPTIBLE_APP_ADJ · foreground service playing', adj: 200 },
  { id: 'cached1', name: 'Cached app (recent)', role: 'CACHED_APP_MIN_ADJ · backgrounded 1 min ago', adj: 900 },
  { id: 'cached2', name: 'Cached app', role: 'cached · backgrounded earlier', adj: 950 },
  { id: 'cached3', name: 'Cached app (oldest)', role: 'CACHED_APP_MAX_ADJ · backgrounded long ago', adj: 999 },
];

const LEVELS = [
  { label: 'plenty of RAM', kill: Infinity, note: 'Nobody dies. Cached apps are kept around on purpose — free RAM is wasted RAM, and a warm app resumes instantly.' },
  { label: 'getting full', kill: 950, note: 'lmkd starts with the oldest cached apps — the user probably won’t notice they’re gone.' },
  { label: 'low memory', kill: 900, note: 'All cached apps are gone now. Reopening one means a fresh cold start (Zygote fork again).' },
  { label: 'very low', kill: 250, note: 'Even apps with foreground services can fall — your music may stop. START_STICKY decides who gets resurrected.' },
  { label: 'critical', kill: 100, note: 'Visible apps die too. Only the focused app and persistent system processes survive. If it gets worse than this, the kernel’s own killer steps in.' },
];

export function OomLadder() {
  const [level, setLevel] = useState(0);
  const lv = LEVELS[level];

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        The Process Importance Ladder <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        AMS gives every process a score (`oom_score_adj`, −1000…1000 — lower = more important). When RAM runs out, `lmkd` kills from the highest score down.
      </p>

      {/* Pressure slider */}
      <div className="mb-4 rounded-xl border border-[#4a3d1c] bg-[#161208] p-3">
        <div className="mb-1.5 flex items-center justify-between text-[11.5px] font-bold">
          <span style={{ color: '#d7b155' }}>Memory pressure</span>
          <span style={{ color: level >= 3 ? '#eda89e' : '#bda367' }}>{lv.label}</span>
        </div>
        <input
          type="range"
          min={0}
          max={LEVELS.length - 1}
          step={1}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="w-full accent-[#d7b155]"
        />
        <div className="mt-2 text-[12px] leading-relaxed" style={{ color: '#ded4ba' }}>{lv.note}</div>
      </div>

      {/* Ladder */}
      <div className="space-y-1.5">
        {PROCS.map((p) => {
          const dead = p.adj >= lv.kill;
          return (
            <motion.div
              key={p.id}
              animate={{ opacity: dead ? 0.35 : 1 }}
              className="flex items-center gap-3 rounded-lg border-2 px-3 py-1.5"
              style={{
                borderColor: dead ? '#5a2e26' : p.adj < 0 ? '#8a7030' : p.adj <= 200 ? '#6fae6a' : '#4a3d1c',
                background: dead ? '#1a100c' : p.adj < 0 ? '#221d10' : '#161208',
              }}
            >
              <span className="w-12 shrink-0 text-right font-mono text-[11px] font-bold" style={{ color: dead ? '#9a6b61' : p.adj < 0 ? '#f3dc9b' : p.adj <= 200 ? '#b9e0b5' : '#9a874f' }}>
                {p.adj}
              </span>
              <div className="min-w-0 flex-1">
                <span className={cn('font-mono text-[12px] font-bold', dead && 'line-through')} style={{ color: dead ? '#9a6b61' : '#ded4ba' }}>{p.name}</span>
                <span className="ml-2 text-[10.5px] italic" style={{ color: '#8d8268' }}>{p.role}</span>
              </div>
              {dead && (
                <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold" style={{ color: '#eda89e' }}>
                  <Skull size={11} /> killed by lmkd
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3.5 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        AMS recomputes scores constantly (`updateOomAdj`) as apps move between states — the ladder is alive.
      </div>
    </div>
  );
}
