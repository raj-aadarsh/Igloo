import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { products } from '@/content/atlas/products';
import { AtlasHeader, SearchBar, CardGrid, EmptyState } from './AtlasShared';
import { Pill } from '@/components/ui/primitives';

export function AtlasProducts() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return products.filter((p) => !term || `${p.name} ${p.maker} ${p.category} ${p.what}`.toLowerCase().includes(term));
  }, [q]);

  return (
    <div>
      <AtlasHeader title="Products & Apps" subtitle="The tools people actually use — assistants, coding, search, and local-model apps." count={products.length} />
      <SearchBar value={q} onChange={setQ} placeholder="Search products (e.g. Cursor, Perplexity, offline)…" />
      {filtered.length === 0 ? <EmptyState /> : (
        <CardGrid>
          {filtered.map((p) => (
            <div key={p.id} className="card flex flex-col p-5">
              <div className="mb-1 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold leading-tight">{p.name}</h3>
                  <p className="text-xs text-muted">by {p.maker}</p>
                </div>
                <Pill tone="accent">{p.category}</Pill>
              </div>
              <p className="mt-2 text-sm text-muted">{p.what}</p>
              <p className="mt-2 text-xs"><span className="font-semibold text-muted">Free tier:</span> {p.freeTier}</p>
              <a href={p.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-1.5 dark:text-brand-300">
                Open <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </CardGrid>
      )}
    </div>
  );
}
