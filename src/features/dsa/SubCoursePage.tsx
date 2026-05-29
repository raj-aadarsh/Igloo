import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Code2, CheckCircle2, Circle, Clock, ChevronRight, Lock } from 'lucide-react';
import { getSubCourse } from '@/content/course-dsa';
import type { Difficulty } from '@/content/course-dsa/types';
import { LessonRenderer } from '@/features/course/LessonRenderer';
import { Icon } from '@/components/ui/Icon';
import { Pill } from '@/components/ui/primitives';
import { useProgress } from '@/features/progress/ProgressProvider';
import { useDsaProgress } from '@/features/progress/useDsaProgress';
import { cn } from '@/lib/cn';

const diffTone: Record<Difficulty, 'green' | 'accent' | 'rose'> = { Easy: 'green', Medium: 'accent', Hard: 'rose' };

export function SubCoursePage() {
  const { topic } = useParams();
  const sub = getSubCourse(topic ?? '');
  const [tab, setTab] = useState<'learn' | 'problems'>('learn');
  const { isLessonDone, markLesson, isProblemSolved } = useProgress();
  const { perSub } = useDsaProgress();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [topic]);

  if (!sub) {
    return <div className="text-center text-muted">Topic not found. <Link to="/dsa" className="link-underline">Back to DSA</Link></div>;
  }

  const prog = perSub.find((p) => p.sub.id === sub.id);

  return (
    <article>
      <Link to="/dsa" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> DSA Dojo
      </Link>

      <header className="mb-6 mt-3 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
          <Icon name={sub.icon} size={28} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black tracking-tight">{sub.title}</h1>
          <p className="text-muted">{sub.subtitle}</p>
        </div>
        {prog?.earned ? (
          <Pill tone="green" className="shrink-0">{sub.badge.emoji} {sub.badge.name}</Pill>
        ) : (
          <span className="chip shrink-0"><Lock size={12} /> {sub.badge.emoji} {sub.badge.name}</span>
        )}
      </header>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-border bg-surface-2/60 p-1">
        <TabBtn active={tab === 'learn'} onClick={() => setTab('learn')} icon={BookOpen}>Learn ({sub.learn.length})</TabBtn>
        <TabBtn active={tab === 'problems'} onClick={() => setTab('problems')} icon={Code2}>Problems ({sub.problems.length})</TabBtn>
      </div>

      {tab === 'learn' ? (
        <div>
          {sub.learn.map((lesson) => {
            const done = isLessonDone(lesson.id);
            return (
              <section key={lesson.id} className="mb-10">
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-border pb-2">
                  <h2 className="text-xl font-bold">{lesson.title}</h2>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted"><Clock size={13} /> {lesson.minutes} min</span>
                </div>
                <LessonRenderer blocks={lesson.blocks} />
                <button
                  onClick={() => markLesson(lesson.id, !done)}
                  className={cn(
                    'mt-4 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all',
                    done ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' : 'border-border bg-surface text-muted hover:border-brand-400 hover:text-text',
                  )}
                >
                  {done ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                  {done ? 'Completed' : 'Mark as done'}
                </button>
              </section>
            );
          })}
          <div className="rounded-2xl border border-border bg-surface-2/50 p-4 text-center">
            <p className="text-sm text-muted">Theory down. Time to <strong className="text-text">write some code</strong>.</p>
            <button onClick={() => { setTab('problems'); window.scrollTo({ top: 0 }); }} className="mt-2 inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-300">
              Go to problems <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sub.problems.map((p, i) => {
            const solved = isProblemSolved(p.id);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={`/dsa/${sub.slug}/problem/${p.id}`} className="card flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5">
                  {solved ? <CheckCircle2 size={20} className="shrink-0 text-emerald-500" /> : <Circle size={20} className="shrink-0 text-muted/40" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold">{p.title}</span>
                      {p.isInterview && <Pill tone="purple">interview</Pill>}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map((t) => <span key={t} className="text-xs text-muted">#{t}</span>)}
                    </div>
                  </div>
                  <Pill tone={diffTone[p.difficulty]}>{p.difficulty}</Pill>
                  <ChevronRight size={18} className="shrink-0 text-muted" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </article>
  );
}

function TabBtn({ active, onClick, icon: I, children }: { active: boolean; onClick: () => void; icon: typeof BookOpen; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn('flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors', active ? 'bg-brand-600 text-white shadow-soft' : 'text-muted hover:text-text')}
    >
      <I size={16} /> {children}
    </button>
  );
}
