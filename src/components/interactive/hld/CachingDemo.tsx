import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Database, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

const CAP = 4;
const KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function CachingDemo() {
  const [cache, setCache] = useState<string[]>([]); // most-recent first
  const [last, setLast] = useState<{ key: string; hit: boolean } | null>(null);
  const [hits, setHits] = useState(0);
  const [total, setTotal] = useState(0);
  const [evicted, setEvicted] = useState<string | null>(null);

  const request = (key: string) => {
    setTotal((t) => t + 1);
    setEvicted(null);
    setCache((prev) => {
      const hit = prev.includes(key);
      setLast({ key, hit });
      if (hit) { setHits((h) => h + 1); return [key, ...prev.filter((k) => k !== key)]; }
      const next = [key, ...prev];
      if (next.length > CAP) { setEvicted(next[next.length - 1]); return next.slice(0, CAP); }
      return next;
    });
  };

  const reset = () => { setCache([]); setLast(null); setHits(0); setTotal(0); setEvicted(null); };
  const rate = total ? Math.round((hits / total) * 100) : 0;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">LRU cache (capacity {CAP}) — request keys and watch hits, misses & eviction</div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {KEYS.map((k) => (
          <button key={k} onClick={() => request(k)} className="h-9 w-9 rounded-lg border border-border font-mono text-sm font-bold hover:bg-surface-2">{k}</button>
        ))}
        <button onClick={reset} className="ml-auto inline-flex items-center gap-1 text-xs text-muted hover:text-text"><RotateCcw size={13} /> Reset</button>
      </div>

      {/* cache slots */}
      <div className="rounded-xl border border-border bg-surface-2/30 p-3">
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted"><Zap size={13} className="text-accent-500" /> Cache · most-recently-used → least</div>
        <div className="flex gap-2">
          {Array.from({ length: CAP }).map((_, i) => {
            const k = cache[i];
            return (
              <div key={i} className={cn('flex h-12 flex-1 items-center justify-center rounded-lg border-2 font-mono text-lg font-bold', k ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-dashed border-border text-muted/40')}>
                <AnimatePresence mode="popLayout">
                  {k && <motion.span key={k} layout initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>{k}</motion.span>}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted"><span>↑ kept on access</span><span>evicted first ↑</span></div>
      </div>

      {/* status */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <AnimatePresence mode="wait">
          {last && (
            <motion.div key={last.key + total} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-semibold', last.hit ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700 dark:text-rose-300')}>
              {last.hit ? <><Zap size={14} /> HIT — "{last.key}" served from cache</> : <><Database size={14} /> MISS — fetched "{last.key}" from DB</>}
            </motion.div>
          )}
        </AnimatePresence>
        {evicted && <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">evicted "{evicted}" (LRU)</span>}
        <span className="ml-auto text-xs font-semibold text-muted">hit rate {rate}% · {hits}/{total}</span>
      </div>

      <p className="mt-3 text-xs text-muted">A <strong>hit</strong> returns from fast memory; a <strong>miss</strong> falls through to the database, then back-fills the cache. When full, the <strong>least-recently-used</strong> entry is evicted. Higher hit rate = less DB load and lower latency.</p>
    </div>
  );
}
