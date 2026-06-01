import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

const CAPACITY = 8; // power of two, like a small HashMap
const KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'cat', 'dog', 'bird'];

// Faithful to java.util.HashMap: hashCode, then spread, then index = hash & (n-1).
function javaStringHashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}
function spread(h: number): number {
  return (h ^ (h >>> 16)) | 0;
}
function bucketIndex(key: string): number {
  return spread(javaStringHashCode(key)) & (CAPACITY - 1);
}

export function HashMapInternals() {
  const [inserted, setInserted] = useState<string[]>([]);
  const next = KEYS[inserted.length];

  const buckets = useMemo(() => {
    const b: string[][] = Array.from({ length: CAPACITY }, () => []);
    inserted.forEach((k) => b[bucketIndex(k)].push(k));
    return b;
  }, [inserted]);

  const collisions = buckets.filter((b) => b.length > 1).length;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted">HashMap with {CAPACITY} buckets — add keys & watch them land</span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => next && setInserted((xs) => [...xs, next])}
            disabled={!next}
            className="inline-flex items-center gap-1 rounded-lg border border-brand-400 bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-700 disabled:opacity-40 dark:text-brand-300"
          >
            <Plus size={13} /> {next ? `put("${next}", …)` : 'all added'}
          </button>
          <button onClick={() => setInserted([])} className="inline-flex items-center gap-1 text-xs text-muted hover:text-text">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {next && (
        <div className="mb-3 rounded-lg bg-surface-2/60 px-3 py-1.5 font-mono text-[11px] text-muted">
          index = spread(<span className="text-brand-600 dark:text-brand-300">"{next}".hashCode()</span>) &amp; ({CAPACITY}-1) = <strong className="text-text">{bucketIndex(next)}</strong>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {buckets.map((bucket, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={cn('w-full rounded-md border py-0.5 text-center text-[10px] font-bold', bucket.length > 1 ? 'border-rose-400 text-rose-600 dark:text-rose-300' : 'border-border text-muted')}>{i}</div>
            <div className="flex min-h-[1.5rem] w-full flex-col items-center gap-1">
              {bucket.map((k, j) => (
                <motion.div
                  key={k}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    'w-full rounded-md px-1 py-1 text-center font-mono text-[11px] font-semibold text-white',
                    j === 0 ? 'bg-brand-500' : 'bg-rose-500',
                  )}
                >
                  {k}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full bg-brand-500/10 px-2 py-0.5 font-semibold text-brand-700 dark:text-brand-300">{inserted.length} entries</span>
        <span className="rounded-full bg-rose-500/10 px-2 py-0.5 font-semibold text-rose-700 dark:text-rose-300">{collisions} bucket(s) with collisions (chained)</span>
        <span className="rounded-full bg-accent-500/10 px-2 py-0.5 font-semibold text-accent-700 dark:text-accent-300">load factor = {(inserted.length / CAPACITY).toFixed(2)}</span>
      </div>
      <p className="mt-2 text-xs text-muted">
        Two keys hashing to the same bucket <strong>collide</strong> and are stored in a chain (shown in red). When entries / capacity exceeds the <strong>load factor</strong> (default 0.75), the map <strong>resizes</strong> (doubles) and rehashes. In Java 8+, a bucket with 8+ entries becomes a balanced tree (O(log n) instead of O(n)).
      </p>
    </div>
  );
}
