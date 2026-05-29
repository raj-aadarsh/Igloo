import { useMemo, useState } from 'react';
import { glossary } from '@/content/course-ai/glossary';
import { AtlasHeader, SearchBar, FilterChips } from '@/features/atlas/AtlasShared';
import { Pill } from '@/components/ui/primitives';

export function GlossaryPage() {
  const [q, setQ] = useState('');
  const categories = useMemo(() => Array.from(new Set(glossary.map((g) => g.category))), []);
  const [cat, setCat] = useState<string | 'All'>('All');

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return glossary.filter((g) => {
      const matchCat = cat === 'All' || g.category === cat;
      const matchQ = !term || `${g.term} ${g.short}`.toLowerCase().includes(term);
      return matchCat && matchQ;
    });
  }, [q, cat]);

  return (
    <div>
      <AtlasHeader title="Glossary" subtitle="Every term from the course in one searchable place." count={glossary.length} />
      <SearchBar value={q} onChange={setQ} placeholder="Search terms (e.g. token, RAG, attention)…" />
      <FilterChips options={categories} value={cat} onChange={setCat} />
      <div className="space-y-2.5">
        {filtered.map((g) => (
          <div key={g.term} className="card flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-4">
            <div className="sm:w-56 sm:shrink-0">
              <div className="font-bold">{g.term}</div>
              <Pill tone="brand" className="mt-1">{g.category}</Pill>
            </div>
            <p className="text-sm text-muted">{g.short}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-muted">No terms match.</p>}
      </div>
    </div>
  );
}
