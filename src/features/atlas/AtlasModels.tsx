import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { models } from '@/content/atlas/models';
import type { ModelCategory } from '@/content/atlas/types';
import { AtlasHeader, SearchBar, FilterChips, CardGrid, EmptyState } from './AtlasShared';
import { Pill } from '@/components/ui/primitives';

const cats: ModelCategory[] = ['LLM', 'Multimodal', 'Reasoning', 'Image', 'Video', 'Audio / Voice', 'Embedding', 'Code', 'On-device'];

export function AtlasModels() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<ModelCategory | 'All'>('All');
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return models.filter((m) => {
      const matchCat = cat === 'All' || m.category === cat;
      const matchOpen = !openOnly || m.openness === 'Open weights';
      const matchQ = !term || `${m.name} ${m.maker} ${m.family} ${m.notableFor} ${m.modality}`.toLowerCase().includes(term);
      return matchCat && matchOpen && matchQ;
    });
  }, [q, cat, openOnly]);

  return (
    <div>
      <AtlasHeader title="Models" subtitle="The model families you’ll hear about — Claude, GPT, Gemini, Llama, and more." count={models.length} />
      <SearchBar value={q} onChange={setQ} placeholder="Search models (e.g. Opus, reasoning, video, open)…" />
      <FilterChips options={cats} value={cat} onChange={setCat} />
      <label className="mb-5 flex cursor-pointer items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} className="accent-brand-500" />
        Open-weight only (downloadable / can run offline)
      </label>
      {filtered.length === 0 ? <EmptyState /> : (
        <CardGrid>
          {filtered.map((m) => (
            <div key={m.id} className="card flex flex-col p-5">
              <div className="mb-1 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold leading-tight">{m.name}</h3>
                  <p className="text-xs text-muted">{m.maker} · {m.family}</p>
                </div>
                <Pill tone={m.openness === 'Open weights' ? 'green' : 'default'}>{m.openness}</Pill>
              </div>
              <p className="mt-2 text-sm text-muted">{m.notableFor}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Pill tone="brand">{m.category}</Pill>
                <Pill tone="purple">{m.modality}</Pill>
                <Pill>{m.year}</Pill>
                {m.size && <Pill tone="accent">{m.size}</Pill>}
              </div>
              <a href={m.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-1.5 dark:text-brand-300">
                Details <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </CardGrid>
      )}
    </div>
  );
}
