import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

// Three processes, two shared libraries, one question: "how much memory does
// each process use?" Four metrics give four different answers.

type Metric = 'VSS' | 'RSS' | 'PSS' | 'USS';

interface Seg { key: string; label: string; mb: number; sharers: number; kind: 'private' | 'sharedA' | 'sharedB' | 'virtual' }

const COLORS: Record<Seg['kind'], { bg: string; border: string; text: string }> = {
  private: { bg: '#2a2310', border: '#d7b155', text: '#f3dc9b' },
  sharedA: { bg: '#1d2a1d', border: '#6fae6a', text: '#b9e0b5' },
  sharedB: { bg: '#101d2a', border: '#5a9bd4', text: '#b5d4ee' },
  virtual: { bg: '#161208', border: '#4a3d1c', text: '#6f6549' },
};

const PROCS: { name: string; segs: Seg[] }[] = [
  {
    name: 'App A',
    segs: [
      { key: 'p', label: 'private heap', mb: 20, sharers: 1, kind: 'private' },
      { key: 'a', label: 'framework libs', mb: 30, sharers: 3, kind: 'sharedA' },
      { key: 'b', label: 'WebView', mb: 12, sharers: 2, kind: 'sharedB' },
      { key: 'v', label: 'reserved, never touched', mb: 180, sharers: 1, kind: 'virtual' },
    ],
  },
  {
    name: 'App B',
    segs: [
      { key: 'p', label: 'private heap', mb: 15, sharers: 1, kind: 'private' },
      { key: 'a', label: 'framework libs', mb: 30, sharers: 3, kind: 'sharedA' },
      { key: 'b', label: 'WebView', mb: 12, sharers: 2, kind: 'sharedB' },
      { key: 'v', label: 'reserved, never touched', mb: 150, sharers: 1, kind: 'virtual' },
    ],
  },
  {
    name: 'App C',
    segs: [
      { key: 'p', label: 'private heap', mb: 10, sharers: 1, kind: 'private' },
      { key: 'a', label: 'framework libs', mb: 30, sharers: 3, kind: 'sharedA' },
      { key: 'v', label: 'reserved, never touched', mb: 120, sharers: 1, kind: 'virtual' },
    ],
  },
];

const REAL_RAM = 20 + 15 + 10 + 30 + 12; // what's physically in RAM: 87 MB

const INFO: Record<Metric, { full: string; rule: string; verdict: (sum: number) => string }> = {
  VSS: {
    full: 'Virtual Set Size',
    rule: 'Counts every address range the process has *reserved*, even pages never loaded into RAM.',
    verdict: (s) => `Sum = ${s} MB, far more than the ${REAL_RAM} MB actually in RAM. Useless for memory decisions.`,
  },
  RSS: {
    full: 'Resident Set Size',
    rule: 'Counts pages really in RAM, but gives every process the *full* size of each shared library.',
    verdict: (s) => `Sum = ${s} MB. Shared libraries are counted once per process, so it overcounts the ${REAL_RAM} MB really used.`,
  },
  PSS: {
    full: 'Proportional Set Size',
    rule: 'Private pages in full, plus each shared page *divided by the number of processes sharing it*.',
    verdict: (s) => `Sum = ${s} MB, exactly the ${REAL_RAM} MB in RAM. That’s why PSS is Android’s standard metric (dumpsys meminfo “TOTAL PSS”).`,
  },
  USS: {
    full: 'Unique Set Size',
    rule: 'Only pages belonging to this process alone. Nothing shared.',
    verdict: (s) => `Sum = ${s} MB. Each app’s USS is what you’d get back if you killed just that app; shared libraries stay for the others.`,
  },
};

function count(seg: Seg, m: Metric) {
  if (seg.kind === 'virtual') return m === 'VSS' ? seg.mb : 0;
  if (m === 'VSS' || m === 'RSS') return seg.mb;
  if (m === 'PSS') return seg.mb / seg.sharers;
  return seg.sharers === 1 ? seg.mb : 0; // USS
}

export function MemoryMetrics() {
  const [m, setM] = useState<Metric>('PSS');
  const totals = PROCS.map((p) => p.segs.reduce((a, s) => a + count(s, m), 0));
  const sum = Math.round(totals.reduce((a, b) => a + b, 0));
  const maxBar = m === 'VSS' ? 245 : 65;

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        VSS · RSS · PSS · USS <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Three apps share the framework libraries (all three) and WebView (two of them). Switch the metric and watch who gets “charged” for the shared memory.
      </p>

      <div className="mb-3 grid grid-cols-4 gap-1.5">
        {(Object.keys(INFO) as Metric[]).map((k) => (
          <button
            key={k}
            onClick={() => setM(k)}
            className={cn('rounded-lg border-2 px-2 py-1.5 text-center transition-colors', m === k ? 'border-[#d7b155] bg-[#2a2310]' : 'border-[#4a3d1c] bg-[#161208] hover:border-[#8a7030]')}
          >
            <div className="font-mono text-[13px] font-bold" style={{ color: m === k ? '#f3dc9b' : '#d7b155' }}>{k}</div>
            <div className="hidden text-[9.5px] sm:block" style={{ color: '#8d8268' }}>{INFO[k].full}</div>
          </button>
        ))}
      </div>

      <div className="mb-3 rounded-lg border border-[#4a3d1c] bg-[#161208] px-3 py-2 text-[12px]" style={{ color: '#ded4ba' }}>
        <strong style={{ color: '#d7b155' }}>{INFO[m].full}:</strong> {INFO[m].rule}
      </div>

      {/* Bars */}
      <div className="space-y-2">
        {PROCS.map((p, i) => (
          <div key={p.name} className="flex items-center gap-2">
            <span className="w-14 shrink-0 font-mono text-[11px] font-bold" style={{ color: '#ded4ba' }}>{p.name}</span>
            <div className="flex h-7 flex-1 overflow-hidden rounded-md bg-[#0e0b05]">
              {p.segs.map((s) => {
                const v = count(s, m);
                if (v === 0) return null;
                const c = COLORS[s.kind];
                return (
                  <motion.div
                    key={s.key}
                    layout
                    initial={false}
                    animate={{ width: `${(v / maxBar) * 100}%` }}
                    transition={{ duration: 0.4 }}
                    className="flex h-full items-center justify-center overflow-hidden whitespace-nowrap border-r font-mono text-[9.5px] font-bold"
                    style={{
                      background: s.kind === 'virtual' ? 'repeating-linear-gradient(45deg,#161208,#161208 4px,#221d10 4px,#221d10 8px)' : c.bg,
                      borderColor: c.border,
                      color: c.text,
                    }}
                    title={`${s.label}: ${Math.round(v * 10) / 10} MB`}
                  >
                    {Math.round(v * 10) / 10}
                  </motion.div>
                );
              })}
            </div>
            <span className="w-16 shrink-0 text-right font-mono text-[12px] font-bold" style={{ color: '#f3dc9b' }}>{Math.round(totals[i])} MB</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px]" style={{ color: '#9a874f' }}>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border" style={{ background: COLORS.private.bg, borderColor: COLORS.private.border }} />private</span>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border" style={{ background: COLORS.sharedA.bg, borderColor: COLORS.sharedA.border }} />framework libs, 30 MB, shared by 3</span>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border" style={{ background: COLORS.sharedB.bg, borderColor: COLORS.sharedB.border }} />WebView, 12 MB, shared by 2</span>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border" style={{ background: COLORS.virtual.bg, borderColor: COLORS.virtual.border }} />reserved only (VSS)</span>
      </div>

      <div
        className="mt-3 rounded-xl border px-3 py-2 text-[12.5px] leading-relaxed"
        style={{
          borderColor: m === 'PSS' ? '#2e4a2e' : '#4a3d1c',
          background: m === 'PSS' ? '#12210f' : '#161208',
          color: m === 'PSS' ? '#b9e0b5' : '#ded4ba',
        }}
      >
        {INFO[m].verdict(sum)}
      </div>
    </div>
  );
}
