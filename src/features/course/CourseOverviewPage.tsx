import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Map, Library, GraduationCap, ArrowLeft } from 'lucide-react';
import { course } from '@/content/course-ai';
import { companies } from '@/content/atlas/companies';
import { models } from '@/content/atlas/models';
import { useCourseProgress } from '@/features/progress/useCourseProgress';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/primitives';

export function CourseOverviewPage() {
  const { overallPct, totalDone, totalLessons, perModule } = useCourseProgress();
  const nextModule = perModule.find((m) => !m.complete)?.module ?? course.modules[0];

  return (
    <div className="space-y-9">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> All courses
      </Link>

      {/* Course hero */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-500/10 via-surface to-accent-500/10 p-8 sm:p-10">
        <span className="chip mb-4"><Icon name="sparkles" size={13} /> Course #1</span>
        <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">{course.title}</h1>
        <p className="mt-3 max-w-xl text-muted">{course.tagline} A fun, interactive path with playable demos and unlimited-attempt quizzes — plus a browsable atlas of the whole AI world.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/learn/${nextModule.slug}`}>
            <Button size="lg">{totalDone > 0 ? 'Continue learning' : 'Start the course'} <ArrowRight size={18} /></Button>
          </Link>
          <Link to="/atlas"><Button size="lg" variant="outline"><Map size={18} /> Explore the AI Atlas</Button></Link>
        </div>
        {totalDone > 0 && (
          <div className="mt-6 max-w-sm">
            <div className="mb-1 flex justify-between text-xs text-muted"><span>{totalDone}/{totalLessons} lessons</span><span>{overallPct}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${overallPct}%` }} /></div>
          </div>
        )}
      </motion.section>

      {/* Course extras */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Link to="/atlas" className="card group p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <Map className="text-accent-500" size={24} />
          <h3 className="mt-2 font-bold">AI Atlas</h3>
          <p className="text-xs text-muted">{companies.length} companies · {models.length}+ models · products & more</p>
        </Link>
        <Link to="/glossary" className="card group p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <Library className="text-brand-500" size={24} />
          <h3 className="mt-2 font-bold">Glossary</h3>
          <p className="text-xs text-muted">Every term, searchable</p>
        </Link>
        <Link to="/exam" className="card group p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <GraduationCap className="text-emerald-500" size={24} />
          <h3 className="mt-2 font-bold">Final Exam</h3>
          <p className="text-xs text-muted">Mixed questions · unlimited tries</p>
        </Link>
      </section>

      {/* Modules */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Modules</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {perModule.map(({ module, done, total, complete }) => (
            <Link key={module.id} to={`/learn/${module.slug}`} className="card flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                <Icon name={module.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{module.title}</div>
                <div className="truncate text-xs text-muted">{module.subtitle}</div>
              </div>
              <div className={`text-right text-xs ${complete ? 'font-bold text-emerald-500' : 'text-muted'}`}>{done}/{total}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
