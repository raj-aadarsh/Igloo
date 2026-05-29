import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { companies } from '@/content/atlas/companies';
import type { CompanyType } from '@/content/atlas/types';
import { AtlasHeader, SearchBar, FilterChips, CardGrid, EmptyState } from './AtlasShared';
import { Pill } from '@/components/ui/primitives';

const types: CompanyType[] = ['Frontier Lab', 'Big Tech', 'Open Source', 'Startup', 'Hardware', 'Infra / Cloud', 'Platform / Tools'];

export function AtlasCompanies() {
  const [q, setQ] = useState('');
  const [type, setType] = useState<CompanyType | 'All'>('All');

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return companies.filter((c) => {
      const matchType = type === 'All' || c.type === type;
      const matchQ = !term || `${c.name} ${c.what} ${c.flagship.join(' ')} ${c.focus} ${c.country}`.toLowerCase().includes(term);
      return matchType && matchQ;
    });
  }, [q, type]);

  return (
    <div>
      <AtlasHeader title="Companies & Labs" subtitle="Who builds AI — frontier labs, big tech, hardware, and tools." count={companies.length} />
      <SearchBar value={q} onChange={setQ} placeholder="Search companies (e.g. Anthropic, GPU, France)…" />
      <FilterChips options={types} value={type} onChange={setType} />
      {filtered.length === 0 ? <EmptyState /> : (
        <CardGrid>
          {filtered.map((c) => (
            <div key={c.id} className="card flex flex-col p-5">
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold">{c.name}</h3>
                <Pill tone="brand">{c.type}</Pill>
              </div>
              <p className="text-sm text-muted">{c.what}</p>
              <dl className="mt-3 space-y-1.5 text-xs">
                <Row label="Founded">{c.founded} · {c.country}</Row>
                <Row label="Founders">{c.founders}</Row>
                <Row label="Flagship">{c.flagship.join(', ')}</Row>
                <Row label="Now">{c.focus}</Row>
              </dl>
              <p className="mt-3 rounded-lg bg-surface-2 p-2.5 text-xs italic text-muted">💡 {c.notable}</p>
              <a href={c.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-1.5 dark:text-brand-300">
                Visit <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </CardGrid>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[64px_1fr] gap-2">
      <dt className="font-semibold text-muted">{label}</dt>
      <dd className="text-text/90">{children}</dd>
    </div>
  );
}
