import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Map, Library, GraduationCap, ArrowLeft, type LucideIcon } from 'lucide-react';
import type { Course } from '@/content/types';
import { course as aiCourse } from '@/content/course-ai';
import { companies } from '@/content/atlas/companies';
import { models } from '@/content/atlas/models';
import { useCourseProgress } from '@/features/progress/useCourseProgress';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';

export interface OverviewExtra {
  to: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

const accentMap: Record<string, { grad: string; tile: string; eyebrow: string }> = {
  brand: { grad: 'from-brand-500/10 via-surface to-accent-500/10', tile: 'bg-brand-500/10 text-brand-600 dark:text-brand-300', eyebrow: 'text-brand-600 dark:text-brand-300' },
  violet: { grad: 'from-violet-500/10 via-surface to-brand-500/10', tile: 'bg-violet-500/10 text-violet-600 dark:text-violet-300', eyebrow: 'text-violet-600 dark:text-violet-300' },
  emerald: { grad: 'from-emerald-500/10 via-surface to-brand-500/10', tile: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300', eyebrow: 'text-emerald-600 dark:text-emerald-300' },
};

const AI_EXTRAS: OverviewExtra[] = [
  { to: '/atlas', title: 'AI Atlas', desc: `${companies.length} companies · ${models.length}+ models`, icon: Map },
  { to: '/glossary', title: 'Glossary', desc: 'Every term, searchable', icon: Library },
  { to: '/exam', title: 'Final Exam', desc: 'Mixed questions · unlimited tries', icon: GraduationCap },
];

export function CourseOverviewPage({
  course = aiCourse,
  basePath = '/learn',
  courseNumber = 1,
  accent = 'brand',
  blurb = 'A fun, interactive path with playable demos and unlimited-attempt quizzes — plus a browsable atlas of the whole AI world.',
  extras = AI_EXTRAS,
  comingSoon = [],
}: {
  course?: Course;
  basePath?: string;
  courseNumber?: number;
  accent?: string;
  blurb?: string;
  extras?: OverviewExtra[];
  comingSoon?: string[];
}) {
  const { overallPct, totalDone, totalLessons, perModule } = useCourseProgress(course);
  const nextModule = perModule.find((m) => !m.complete)?.module ?? course.modules[0];
  const a = accentMap[accent] ?? accentMap.brand;

  return (
    <div className="space-y-9">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> All courses
      </Link>

      {/* Course hero */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn('relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br p-8 sm:p-10', a.grad)}>
        <span className={cn('text-[11px] font-bold uppercase tracking-widest', a.eyebrow)}>Course {String(courseNumber).padStart(2, '0')}</span>
        <h1 className="mt-2 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">{course.title}</h1>
        <p className="mt-3 max-w-xl text-muted">{course.tagline} {blurb}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`${basePath}/${nextModule.slug}`}>
            <Button size="lg">{totalDone > 0 ? 'Continue learning' : 'Start the course'} <ArrowRight size={18} /></Button>
          </Link>
        </div>
        {totalDone > 0 && (
          <div className="mt-6 max-w-sm">
            <div className="mb-1 flex justify-between text-xs text-muted"><span>{totalDone}/{totalLessons} lessons</span><span>{overallPct}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${overallPct}%` }} /></div>
          </div>
        )}
      </motion.section>

      {/* Course extras */}
      {extras.length > 0 && (
        <section className={cn('grid gap-3', extras.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
          {extras.map((e) => (
            <Link key={e.to} to={e.to} className="card group p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
              <e.icon className={a.eyebrow} size={24} />
              <h3 className="mt-2 font-bold">{e.title}</h3>
              <p className="text-xs text-muted">{e.desc}</p>
            </Link>
          ))}
        </section>
      )}

      {/* Modules */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Modules</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {perModule.map(({ module, done, total, complete }) => (
            <Link key={module.id} to={`${basePath}/${module.slug}`} className="card flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5">
              <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', a.tile)}>
                <Icon name={module.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{module.title}</div>
                <div className="truncate text-xs text-muted">{module.subtitle}</div>
              </div>
              <div className={`text-right text-xs ${complete ? 'font-bold text-emerald-500' : 'text-muted'}`}>{done}/{total}</div>
            </Link>
          ))}

          {comingSoon.map((title) => (
            <div key={title} className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-surface/40 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted">
                <Icon name="boxes" size={18} />
              </div>
              <div className="min-w-0 flex-1"><span className="truncate font-semibold text-muted">{title}</span></div>
              <span className="chip">soon</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
