import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Globe, Scale, DoorOpen, Server, Zap, Database, Boxes, HardDrive, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Comp { id: string; name: string; icon: typeof Server; role: string; }

// Tiers flow left → right, the way a request travels.
const TIERS: { label: string; comps: Comp[] }[] = [
  { label: 'Edge', comps: [
    { id: 'client', name: 'Client', icon: Smartphone, role: 'Browser/mobile app. Talks HTTPS; caches what it can locally.' },
    { id: 'cdn', name: 'CDN', icon: Globe, role: 'Edge cache for static assets & media, served from a PoP near the user. Slashes latency and origin load.' },
  ] },
  { label: 'Entry', comps: [
    { id: 'dns', name: 'DNS', icon: Globe, role: 'Resolves the domain to an IP, often routing to the nearest region (GeoDNS).' },
    { id: 'lb', name: 'Load Balancer', icon: Scale, role: 'Spreads traffic across servers, health-checks them, and provides failover. Run redundantly — never a SPOF.' },
    { id: 'gw', name: 'API Gateway', icon: DoorOpen, role: 'Single front door: auth, rate limiting, routing, TLS. Keeps individual services simple.' },
  ] },
  { label: 'Compute', comps: [
    { id: 'svc', name: 'Services', icon: Server, role: 'Stateless app servers / microservices holding business logic. Scale horizontally behind the LB.' },
  ] },
  { label: 'Data', comps: [
    { id: 'cache', name: 'Cache', icon: Zap, role: 'In-memory store (Redis) checked before the DB. Absorbs read-heavy load; high hit rate = low latency.' },
    { id: 'db', name: 'Database', icon: Database, role: 'Source of truth — replicated (leader + read-replicas) and sharded when it outgrows one machine.' },
    { id: 'queue', name: 'Queue', icon: Boxes, role: 'Message queue for async/spiky work (emails, transcoding, indexing). Decouples and buffers.' },
    { id: 'blob', name: 'Object Store', icon: HardDrive, role: 'Cheap durable storage for large blobs (images, video) — e.g. S3. The CDN serves from here.' },
  ] },
];

const ALL = TIERS.flatMap((t) => t.comps);

export function ArchitectureCanvas() {
  const [active, setActive] = useState('client');
  const c = ALL.find((x) => x.id === active)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Anatomy of a scalable web system — tap any component</div>

      <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
        {TIERS.map((tier, ti) => (
          <div key={tier.label} className="flex items-stretch gap-1">
            <div className="flex flex-col gap-1.5">
              <div className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted">{tier.label}</div>
              <div className="flex flex-1 flex-col justify-center gap-1.5">
                {tier.comps.map((comp) => (
                  <button key={comp.id} onClick={() => setActive(comp.id)}
                    className={cn('flex w-[92px] items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left transition-colors',
                      comp.id === active ? 'border-brand-400 bg-brand-500/10' : 'border-border hover:bg-surface-2')}>
                    <comp.icon size={14} className={comp.id === active ? 'text-brand-600 dark:text-brand-300' : 'text-muted'} />
                    <span className="text-[10px] font-bold leading-tight">{comp.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {ti < TIERS.length - 1 && <ChevronRight size={16} className="self-center text-muted/40" />}
          </div>
        ))}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3">
        <div className="mb-1 flex items-center gap-2 font-semibold"><c.icon size={16} className="text-brand-500" /> {c.name}</div>
        <p className="text-sm text-muted">{c.role}</p>
      </motion.div>

      <p className="mt-2 text-xs text-muted">Nearly every system design is a variation of this skeleton. In an interview, sketch the tiers a request flows through, then deep-dive only the boxes the problem makes hard.</p>
    </div>
  );
}
