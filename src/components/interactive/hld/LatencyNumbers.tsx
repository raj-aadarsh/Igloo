import { motion } from 'framer-motion';

interface Row { label: string; ns: number; human: string; }

// Classic "latency numbers every programmer should know" (rounded).
const ROWS: Row[] = [
  { label: 'L1 cache reference', ns: 1, human: '1 second' },
  { label: 'Main memory (RAM) reference', ns: 100, human: '~2 minutes' },
  { label: 'SSD random read', ns: 16_000, human: '~4.5 hours' },
  { label: 'Round trip in same data center', ns: 500_000, human: '~6 days' },
  { label: 'Disk (HDD) seek', ns: 10_000_000, human: '~4 months' },
  { label: 'Network round trip across the world', ns: 150_000_000, human: '~5 years' },
];

function fmt(ns: number): string {
  if (ns < 1000) return `${ns} ns`;
  if (ns < 1_000_000) return `${(ns / 1000).toFixed(0)} µs`;
  return `${(ns / 1_000_000).toFixed(0)} ms`;
}

const maxLog = Math.log10(ROWS[ROWS.length - 1].ns); // largest

export function LatencyNumbers() {
  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-1 text-sm font-semibold text-muted">Latency numbers every engineer should know</div>
      <p className="mb-3 text-xs text-muted">Bars are log-scaled (each step ≈ 10× slower). The "if 1 ns = 1 second" column makes the gulf intuitive.</p>

      <div className="space-y-2">
        {ROWS.map((r, i) => (
          <div key={r.label}>
            <div className="mb-0.5 flex items-baseline justify-between gap-2 text-xs">
              <span className="font-medium">{r.label}</span>
              <span className="font-mono font-bold text-brand-600 dark:text-brand-300">{fmt(r.ns)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${(Math.log10(r.ns) / maxLog) * 100}%` }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 120, damping: 20 }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
              </div>
              <span className="w-20 shrink-0 text-right text-[10px] italic text-muted">{r.human}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted">
        The takeaways that drive every design: <strong>memory ≫ SSD ≫ disk ≫ network</strong>; a cross-continent round trip (~150 ms) dwarfs everything — so <strong>cache aggressively</strong>, keep data <strong>close</strong> to users (CDNs/replicas), and <strong>minimise round trips</strong>.
      </p>
    </div>
  );
}
