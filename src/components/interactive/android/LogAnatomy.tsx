import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { RichText } from '@/components/ui/RichText';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// LogAnatomy — the Phase 4 engine. Each tab is one failure signature:
// a realistic log snippet with click-to-decode lines, which buffer/file it
// came from, and the exact grep strings to hunt it with.
// ---------------------------------------------------------------------------

export interface LogLine {
  text: string;
  note?: string;
}

export interface LogTab {
  id: string;
  label: string;
  blurb: string;
  /** where this evidence lives, e.g. "logcat -b crash" or "/data/tombstones/" */
  source: string;
  lines: LogLine[];
  /** exact search strings for logcat / bugreport / dmesg */
  greps: { pattern: string; where: string }[];
}

export function LogAnatomy({ heading, intro, tabs }: { heading: string; intro: string; tabs: LogTab[] }) {
  const [tabId, setTabId] = useState(tabs[0].id);
  const [openLine, setOpenLine] = useState<number | null>(null);
  const tab = tabs.find((t) => t.id === tabId) ?? tabs[0];

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        {heading} <span className="not-italic">:-</span>
      </h3>
      <p className="mb-3 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>{intro}</p>

      {/* Tabs */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTabId(t.id); setOpenLine(null); }}
            className={cn(
              'rounded-lg border-2 px-2.5 py-1.5 text-xs font-bold transition-colors',
              tabId === t.id ? 'border-[#d7b155] bg-[#2a2310] text-[#f3dc9b]' : 'border-[#4a3d1c] text-[#9a874f] hover:border-[#8a7030]',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[12px] italic" style={{ color: '#bda367' }}>{tab.blurb}</span>
        <span className="rounded-md border border-[#4a3d1c] px-2 py-0.5 font-mono text-[10px]" style={{ color: '#8fd48a' }}>
          evidence: {tab.source}
        </span>
      </div>

      {/* Annotated snippet */}
      <div className="rounded-xl border border-[#4a3d1c] bg-[#0e0b05] p-3 font-mono text-[11px] leading-relaxed">
        {tab.lines.map((l, i) => (
          <div key={i}>
            <button
              onClick={() => l.note && setOpenLine(openLine === i ? null : i)}
              className={cn('block w-full whitespace-pre-wrap text-left', l.note && 'rounded px-1 transition-colors hover:bg-[#241e0e]')}
              style={{
                color: l.note ? '#f3dc9b' : '#8d8268',
                textShadow: l.note && openLine !== i ? '0 0 10px rgba(215,177,85,0.4)' : undefined,
                cursor: l.note ? 'pointer' : 'default',
              }}
            >
              {l.text}
            </button>
            <AnimatePresence>
              {openLine === i && l.note && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="my-1.5 rounded-lg border border-[#4a3d1c] bg-[#161208] px-3 py-2 font-sans text-[12px] leading-relaxed" style={{ color: '#ded4ba' }}>
                    <RichText>{l.note}</RichText>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Grep hunt list */}
      <div className="mt-2.5 rounded-xl border border-[#2e4a2e] bg-[#12210f] px-3 py-2.5">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold" style={{ color: '#8fd48a' }}>
          <Search size={12} /> What to grep for
        </div>
        <div className="space-y-1">
          {tab.greps.map((g, i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-2 font-mono text-[10.5px]">
              <span className="rounded bg-[#0e0b05] px-1.5 py-0.5 font-bold" style={{ color: '#b9e0b5' }}>&quot;{g.pattern}&quot;</span>
              <span className="font-sans text-[10.5px] italic" style={{ color: '#9a874f' }}>in {g.where}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        Click the glowing lines — every one of them is a question an interviewer can ask.
      </div>
    </div>
  );
}
