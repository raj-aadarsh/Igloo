import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, GraduationCap } from 'lucide-react';
import { androidCourse, androidPhases, androidPlannedPhases } from '@/content/course-android';
import { useCourseProgress } from '@/features/progress/useCourseProgress';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';

// Overview for the Android Framework course — modules are grouped into
// phases, with later phases listed as planned topics until they're authored.

export function AndroidOverviewPage() {
  const { overallPct, totalDone, totalLessons, perModule } = useCourseProgress(androidCourse);
  const nextModule = perModule.find((m) => !m.complete)?.module ?? androidCourse.modules[0];
  const byId = new Map(perModule.map((pm) => [pm.module.id, pm]));

  return (
    <div className="space-y-9">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> All courses
      </Link>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-500/10 via-surface to-accent-500/10 p-8 sm:p-10"
      >
        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">Course 12</span>
        <h1 className="mt-2 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">{androidCourse.title}</h1>
        <p className="mt-3 max-w-xl text-muted">
          {androidCourse.tagline} Note-style deep dives into the framework: every topic opens with one flow diagram, unpacks each
          stage with the real class names, and closes with the interview angles that actually get asked.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/android/${nextModule.slug}`}>
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

      {/* Extras */}
      <section className="grid gap-3 sm:grid-cols-2">
        <Link to="/android/exam" className="card group p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <GraduationCap className="text-brand-600 dark:text-brand-300" size={24} />
          <h3 className="mt-2 font-bold">Final Exam</h3>
          <p className="text-xs text-muted">Mixed questions · unlimited tries</p>
        </Link>
      </section>

      {/* Phases */}
      {androidPhases.map((phase) => {
        const planned = androidPlannedPhases.find((p) => p.title === phase.title);
        return (
          <section key={phase.id}>
            <h2 className="text-xl font-bold">{phase.title}</h2>
            <p className="mb-4 mt-1 text-sm text-muted">{phase.desc}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {phase.moduleIds.map((id) => {
                const pm = byId.get(id);
                if (!pm) return null;
                const { module, done, total, complete } = pm;
                return (
                  <Link key={module.id} to={`/android/${module.slug}`} className="card flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                      <Icon name={module.icon} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{module.title}</div>
                      <div className="truncate text-xs text-muted">{module.subtitle}</div>
                    </div>
                    <div className={cn('text-right text-xs', complete ? 'font-bold text-emerald-500' : 'text-muted')}>{done}/{total}</div>
                  </Link>
                );
              })}
              {planned?.topics.map((title) => (
                <div key={title} className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-surface/40 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted">
                    <Icon name="boxes" size={18} />
                  </div>
                  <div className="min-w-0 flex-1"><div className="truncate font-semibold text-muted">{title}</div></div>
                  <span className="chip shrink-0">soon</span>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Phases not started yet */}
      {androidPlannedPhases
        .filter((p) => !androidPhases.some((ph) => ph.title === p.title))
        .map((p) => (
          <section key={p.title}>
            <h2 className="text-xl font-bold text-muted">{p.title}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {p.topics.map((title) => (
                <div key={title} className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-surface/40 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted">
                    <Icon name="boxes" size={18} />
                  </div>
                  <div className="min-w-0 flex-1"><div className="truncate font-semibold text-muted">{title}</div></div>
                  <span className="chip shrink-0">soon</span>
                </div>
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
