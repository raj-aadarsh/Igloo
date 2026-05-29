import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Swords, CheckCircle2, Circle } from 'lucide-react';
import { arenaProblems } from '@/content/course-dsa';
import type { Difficulty } from '@/content/course-dsa/types';
import { Pill } from '@/components/ui/primitives';
import { FilterChips } from '@/features/atlas/AtlasShared';
import { useProgress } from '@/features/progress/ProgressProvider';

const diffTone: Record<Difficulty, 'green' | 'accent' | 'rose'> = { Easy: 'green', Medium: 'accent', Hard: 'rose' };
const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export function ArenaPage() {
  const problems = useMemo(() => arenaProblems(), []);
  const { isProblemSolved } = useProgress();
  const [diff, setDiff] = useState<Difficulty | 'All'>('All');

  const filtered = problems.filter((p) => diff === 'All' || p.difficulty === diff);
  const solvedCount = problems.filter((p) => isProblemSolved(p.id)).length;

  return (
    <div>
      <Link to="/dsa" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> DSA Dojo
      </Link>

      <header className="mb-6 mt-3 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-600 dark:text-accent-300">
          <Swords size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Interview Arena</h1>
          <p className="text-muted">The hard, real-interview problems — your boss battle. Solved {solvedCount}/{problems.length}.</p>
        </div>
      </header>

      <FilterChips options={difficulties} value={diff} onChange={setDiff} />

      <div className="space-y-2.5">
        {filtered.map((p) => {
          const solved = isProblemSolved(p.id);
          return (
            <Link key={p.id} to={`/dsa/arena/problem/${p.id}`} className="card flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5">
              {solved ? <CheckCircle2 size={20} className="shrink-0 text-emerald-500" /> : <Circle size={20} className="shrink-0 text-muted/40" />}
              <div className="min-w-0 flex-1">
                <span className="truncate font-semibold">{p.title}</span>
                <div className="mt-0.5 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 3).map((t) => <span key={t} className="text-xs text-muted">#{t}</span>)}
                </div>
              </div>
              <Pill tone={diffTone[p.difficulty]}>{p.difficulty}</Pill>
              <ChevronRight size={18} className="shrink-0 text-muted" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
