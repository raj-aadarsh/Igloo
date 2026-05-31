import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/primitives';
import { ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Step { dir: 'cs' | 'sc'; label: string; nums: string; cState: string; sState: string; }

const STEPS: Step[] = [
  { dir: 'cs', label: 'SYN', nums: 'seq = 100', cState: 'SYN-SENT', sState: 'LISTEN' },
  { dir: 'sc', label: 'SYN, ACK', nums: 'seq = 300, ack = 101', cState: 'SYN-SENT', sState: 'SYN-RCVD' },
  { dir: 'cs', label: 'ACK', nums: 'ack = 301', cState: 'ESTABLISHED', sState: 'ESTABLISHED' },
];

export function TcpHandshake() {
  const [done, setDone] = useState(0); // number of completed steps (0..3)
  const cState = done === 0 ? 'CLOSED' : STEPS[done - 1].cState;
  const sState = done === 0 ? 'LISTEN' : STEPS[done - 1].sState;

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">The TCP 3-way handshake — step through it</p>

      <div className="mb-3 grid grid-cols-2 gap-3 text-center text-sm">
        <div className="rounded-xl border border-border bg-surface p-2">
          <div className="font-bold">Client</div>
          <div className="font-mono text-xs text-brand-600 dark:text-brand-300">{cState}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-2">
          <div className="font-bold">Server</div>
          <div className="font-mono text-xs text-accent-600 dark:text-accent-400">{sState}</div>
        </div>
      </div>

      <div className="space-y-2">
        {STEPS.slice(0, done).map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: s.dir === 'cs' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            {s.dir === 'cs' ? (
              <>
                <span className="w-16 text-xs font-bold text-brand-600 dark:text-brand-300">Client</span>
                <div className="flex flex-1 items-center gap-1 text-brand-500"><div className="h-px flex-1 bg-brand-400" /><ArrowRight size={16} /></div>
                <span className="rounded-lg bg-brand-500/15 px-2 py-1 text-center font-mono text-xs"><strong>{s.label}</strong><br />{s.nums}</span>
                <div className="h-px w-4 bg-brand-400" />
                <span className="w-16 text-right text-xs font-bold text-accent-600 dark:text-accent-400">Server</span>
              </>
            ) : (
              <>
                <span className="w-16 text-xs font-bold text-brand-600 dark:text-brand-300">Client</span>
                <div className="h-px w-4 bg-accent-400" />
                <span className="rounded-lg bg-accent-500/15 px-2 py-1 text-center font-mono text-xs"><strong>{s.label}</strong><br />{s.nums}</span>
                <div className="flex flex-1 items-center gap-1 text-accent-500"><ArrowLeft size={16} /><div className="h-px flex-1 bg-accent-400" /></div>
                <span className="w-16 text-right text-xs font-bold text-accent-600 dark:text-accent-400">Server</span>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {done === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 rounded-xl border border-emerald-400 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            ✅ Connection ESTABLISHED — data can now flow both ways.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => setDone((d) => Math.min(3, d + 1))} disabled={done >= 3}>Next step <ArrowRight size={15} /></Button>
        <Button size="sm" variant="outline" onClick={() => setDone(0)}><RotateCcw size={14} /> Reset</Button>
      </div>
      <p className="mt-3 text-xs text-muted">SYN = "let’s sync, here’s my starting sequence number." The server SYN-ACKs (agrees + sends its own), and the client ACKs. Three messages → a reliable, ordered connection. (Closing uses a <strong className="text-text">4-way</strong> handshake: FIN, ACK, FIN, ACK.)</p>
    </div>
  );
}
