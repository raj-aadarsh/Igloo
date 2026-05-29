import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { hardware } from '@/content/atlas/hardware';
import { AtlasHeader, SearchBar, CardGrid, EmptyState } from './AtlasShared';
import { Callout } from '@/components/ui/Callout';
import { Pill } from '@/components/ui/primitives';

export function AtlasHardware() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return hardware.filter((h) => !term || `${h.name} ${h.maker} ${h.kind} ${h.what}`.toLowerCase().includes(term));
  }, [q]);

  return (
    <div>
      <AtlasHeader title="Hardware & Chips" subtitle="The silicon AI runs on — and why NVIDIA became a household name." count={hardware.length} />
      <Callout variant="info" title="Why hardware matters" text="Training and running big models needs enormous parallel math. **GPUs** (and custom **TPUs/ASICs**) provide it. Whoever controls the best chips holds huge power in AI — which is why **NVIDIA** and its **CUDA** software are so dominant." />
      <SearchBar value={q} onChange={setQ} placeholder="Search hardware (e.g. NVIDIA, TPU, inference)…" />
      {filtered.length === 0 ? <EmptyState /> : (
        <CardGrid>
          {filtered.map((h) => (
            <div key={h.id} className="card flex flex-col p-5">
              <div className="mb-1 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold leading-tight">{h.name}</h3>
                  <p className="text-xs text-muted">{h.maker}</p>
                </div>
                <Pill tone="purple">{h.kind}</Pill>
              </div>
              <p className="mt-2 text-sm text-muted">{h.what}</p>
              <a href={h.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-1.5 dark:text-brand-300">
                Learn more <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </CardGrid>
      )}
    </div>
  );
}
