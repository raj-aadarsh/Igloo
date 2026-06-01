import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Globe, Scale, Server, Zap, Database, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Hop {
  id: string;
  label: string;
  icon: typeof Server;
  detail: string;
}

const HOPS: Hop[] = [
  { id: 'client', label: 'Client', icon: Smartphone, detail: 'The browser/app sends an HTTP(S) request. It first needs an IP address for the domain — so it asks DNS.' },
  { id: 'dns', label: 'DNS', icon: Globe, detail: 'DNS resolves the domain (api.app.com) to an IP address. Often the request is also routed to the nearest data center (GeoDNS) or a CDN edge.' },
  { id: 'lb', label: 'Load Balancer', icon: Scale, detail: 'A reverse proxy / load balancer receives the request and forwards it to one of many app servers, spreading load and hiding the fleet behind one address.' },
  { id: 'app', label: 'App Server', icon: Server, detail: 'A stateless application server runs the business logic. Because it holds no session state, any server can handle any request — that’s what makes horizontal scaling possible.' },
  { id: 'cache', label: 'Cache', icon: Zap, detail: 'Before hitting the database, the server checks a fast in-memory cache (e.g. Redis). A cache HIT returns instantly; a MISS falls through to the database.' },
  { id: 'db', label: 'Database', icon: Database, detail: 'On a cache miss, the database (SQL or NoSQL) is the source of truth. The result is written back to the cache, then returned all the way up to the client.' },
];

export function RequestJourney() {
  const [active, setActive] = useState('client');
  const [playing, setPlaying] = useState(false);
  const hop = HOPS.find((h) => h.id === active)!;

  const play = () => {
    setPlaying(true);
    HOPS.forEach((h, i) => setTimeout(() => {
      setActive(h.id);
      if (i === HOPS.length - 1) setPlaying(false);
    }, i * 750));
  };

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted">The journey of a web request — tap a hop, or animate it</span>
        <button onClick={play} disabled={playing} className="ml-auto rounded-lg bg-brand-500 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-50">
          {playing ? 'Routing…' : '▶ Send request'}
        </button>
      </div>

      <div className="flex flex-wrap items-stretch gap-1.5">
        {HOPS.map((h, i) => (
          <div key={h.id} className="flex items-stretch gap-1.5">
            <button onClick={() => setActive(h.id)}
              className={cn('flex w-[88px] flex-col items-center gap-1 rounded-xl border p-2 text-center transition-colors',
                h.id === active ? 'border-brand-400 bg-brand-500/10' : 'border-border hover:bg-surface-2')}>
              <motion.span animate={h.id === active ? { scale: [1, 1.25, 1] } : {}}>
                <h.icon size={20} className={h.id === active ? 'text-brand-600 dark:text-brand-300' : 'text-muted'} />
              </motion.span>
              <span className="text-[11px] font-bold leading-tight">{h.label}</span>
            </button>
            {i < HOPS.length - 1 && <ArrowRight size={15} className="self-center text-muted/50" />}
          </div>
        ))}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3">
        <div className="mb-1 flex items-center gap-2 font-semibold"><hop.icon size={16} className="text-brand-500" /> {hop.label}</div>
        <p className="text-sm text-muted">{hop.detail}</p>
      </motion.div>

      <p className="mt-2 text-xs text-muted">Almost every system design starts from this skeleton. Each box becomes a whole topic: load balancing, caching, database scaling, and so on.</p>
    </div>
  );
}
