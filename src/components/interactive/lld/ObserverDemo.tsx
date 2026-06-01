import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Bell, BellOff, Send } from 'lucide-react';
import { cn } from '@/lib/cn';

const SUBS = ['Aarav', 'Diya', 'Kabir', 'Saanvi'];

export function ObserverDemo() {
  const [subscribed, setSubscribed] = useState<Record<string, boolean>>({ Aarav: true, Diya: true, Kabir: false, Saanvi: true });
  const [pinged, setPinged] = useState<Record<string, number>>({});
  const [count, setCount] = useState(0);

  const toggle = (name: string) => setSubscribed((s) => ({ ...s, [name]: !s[name] }));

  const upload = () => {
    const n = count + 1;
    setCount(n);
    const next: Record<string, number> = {};
    SUBS.forEach((s) => { if (subscribed[s]) next[s] = n; });
    setPinged(next);
  };

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Observer — the subject notifies all subscribers automatically</div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-brand-400 bg-brand-500/10 px-3 py-2">
          <Youtube size={18} className="text-rose-500" />
          <div>
            <div className="text-xs font-bold">Channel (Subject)</div>
            <div className="text-[11px] text-muted">{count} video(s) posted</div>
          </div>
        </div>
        <button onClick={upload} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600">
          <Send size={14} /> Upload video → notify()
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SUBS.map((name) => {
          const on = subscribed[name];
          return (
            <div key={name} className={cn('rounded-xl border p-2.5 text-center transition-colors', on ? 'border-border bg-surface-2/40' : 'border-dashed border-border opacity-60')}>
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold">
                <button onClick={() => toggle(name)} title={on ? 'Unsubscribe' : 'Subscribe'}>
                  {on ? <Bell size={14} className="text-brand-500" /> : <BellOff size={14} className="text-muted" />}
                </button>
                {name}
              </div>
              <div className="mt-1 h-5">
                <AnimatePresence>
                  {on && pinged[name] === count && count > 0 && (
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                      className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                      🔔 new video!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-muted">Toggle the bells to (un)subscribe, then upload. Only current subscribers get <span className="font-mono">update()</span> — the channel doesn’t know or care who they are. That decoupling is the whole point.</p>
    </div>
  );
}
