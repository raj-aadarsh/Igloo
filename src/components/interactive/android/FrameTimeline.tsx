import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';

// A Perfetto-style timeline in miniature: set how long each frame's work
// takes, add a one-off spike, and watch frames miss VSYNC (jank).

const PERIOD = 16.7; // ms at 60 Hz
const SLOTS = 12;

interface Frame { n: number; start: number; end: number; shownSlot: number }

export function FrameTimeline() {
  const [work, setWork] = useState(9);
  const [spike, setSpike] = useState(false);

  const { frames, display, janks, skipped } = useMemo(() => {
    const fr: Frame[] = [];
    let busyUntil = 0;
    let n = 1;
    let skippedVsyncs = 0;
    for (let k = 0; k < SLOTS; k++) {
      const v = k * PERIOD;
      if (v < busyUntil - 0.001) { skippedVsyncs++; continue; } // main thread still busy → this VSYNC is missed
      const dur = work + (spike && k === 4 ? 34 : 0);
      const end = v + dur;
      busyUntil = end;
      fr.push({ n: n++, start: v, end, shownSlot: Math.ceil((end + 0.001) / PERIOD) });
    }
    // what the display shows at each refresh slot (1..SLOTS)
    const disp: { slot: number; frame: number | null; repeat: boolean }[] = [];
    let current: number | null = null;
    let j = 0;
    for (let s = 1; s <= SLOTS; s++) {
      const fresh = fr.filter((f) => f.shownSlot === s);
      if (fresh.length > 0) { current = fresh[fresh.length - 1].n; disp.push({ slot: s, frame: current, repeat: false }); }
      else { disp.push({ slot: s, frame: current, repeat: current !== null }); if (current !== null) j++; }
    }
    return { frames: fr, display: disp, janks: j, skipped: skippedVsyncs };
  }, [work, spike]);

  const totalMs = SLOTS * PERIOD;
  const pct = (ms: number) => `${Math.min(100, (ms / totalMs) * 100)}%`;

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        Make a Frame Drop <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Every 16.7 ms a VSYNC arrives. If the frame’s work isn’t done by the next one, the display repeats the old frame. That repeat is jank.
      </p>

      {/* Controls */}
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="rounded-xl border border-[#4a3d1c] bg-[#161208] p-3">
          <div className="mb-1 flex justify-between text-[11.5px] font-bold">
            <span style={{ color: '#d7b155' }}>Work per frame (main + render thread)</span>
            <span style={{ color: work > PERIOD ? '#eda89e' : '#b9e0b5' }}>{work} ms {work > PERIOD ? '> budget' : '≤ 16.7 ms budget'}</span>
          </div>
          <input type="range" min={4} max={40} value={work} onChange={(e) => setWork(Number(e.target.value))} className="w-full accent-[#d7b155]" />
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#4a3d1c] bg-[#161208] px-3 py-2 text-[12px]" style={{ color: '#ded4ba' }}>
          <input type="checkbox" checked={spike} onChange={(e) => setSpike(e.target.checked)} className="accent-[#d7b155]" />
          One slow frame
          <span className="font-mono text-[10px]" style={{ color: '#9a874f' }}>(+34 ms, e.g. a big inflate)</span>
        </label>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          {/* VSYNC ticks */}
          <div className="mb-1 flex items-center gap-2">
            <span className="w-20 shrink-0 text-right font-mono text-[10px]" style={{ color: '#9a874f' }}>VSYNC</span>
            <div className="relative h-4 flex-1">
              {Array.from({ length: SLOTS + 1 }).map((_, i) => (
                <div key={i} className="absolute top-0 h-4 w-px" style={{ left: pct(i * PERIOD), background: '#6a5624' }} />
              ))}
            </div>
          </div>

          {/* Work blocks */}
          <div className="mb-1 flex items-center gap-2">
            <span className="w-20 shrink-0 text-right font-mono text-[10px]" style={{ color: '#9a874f' }}>app work</span>
            <div className="relative h-7 flex-1 rounded bg-[#0e0b05]">
              {frames.map((f) => {
                const late = f.end - f.start > PERIOD;
                return (
                  <div
                    key={f.n}
                    className="absolute top-1 flex h-5 items-center justify-center overflow-hidden rounded font-mono text-[9.5px] font-bold"
                    style={{
                      left: pct(f.start),
                      width: pct(Math.min(f.end, totalMs) - f.start),
                      background: late ? '#5a2e26' : '#2a3c2a',
                      border: `1px solid ${late ? '#c0564a' : '#6fae6a'}`,
                      color: late ? '#eda89e' : '#b9e0b5',
                    }}
                  >
                    F{f.n}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Display */}
          <div className="flex items-center gap-2">
            <span className="w-20 shrink-0 text-right font-mono text-[10px]" style={{ color: '#9a874f' }}>display</span>
            <div className="flex flex-1">
              {display.map((d) => (
                <div
                  key={d.slot}
                  className={cn('mx-px flex h-7 flex-1 items-center justify-center rounded font-mono text-[9.5px] font-bold')}
                  style={{
                    background: d.frame === null ? '#161208' : d.repeat ? '#2a1410' : '#221d10',
                    border: `1px solid ${d.frame === null ? '#2e2817' : d.repeat ? '#c0564a' : '#8a7030'}`,
                    color: d.frame === null ? '#6f6549' : d.repeat ? '#eda89e' : '#f3dc9b',
                  }}
                >
                  {d.frame === null ? '–' : d.repeat ? `F${d.frame}↺` : `F${d.frame}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div
        className="mt-3 rounded-xl border px-3 py-2 text-[12.5px] leading-relaxed"
        style={{
          borderColor: janks === 0 ? '#2e4a2e' : '#5a2e26',
          background: janks === 0 ? '#12210f' : '#2a1410',
          color: janks === 0 ? '#b9e0b5' : '#eda89e',
        }}
      >
        {janks === 0 ? (
          <>Smooth: every refresh shows a new frame. The work fits inside the budget with time to spare.</>
        ) : (
          <>
            <strong>{janks} repeated frame{janks > 1 ? 's' : ''}</strong> (↺ = the display showed the old frame again).
            {skipped > 0 && <> The main thread was still busy at {skipped} VSYNC tick{skipped > 1 ? 's' : ''}, so those frames never even started. Logcat would say <span className="font-mono">Choreographer: Skipped {skipped} frames!</span></>}
          </>
        )}
      </div>

      <div className="mt-3 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        This is what a Perfetto trace shows you, simplified: work blocks against VSYNC lines.
      </div>
    </div>
  );
}
