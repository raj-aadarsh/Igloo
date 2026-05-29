import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Map, Sparkles, WifiOff, Trophy, Library } from 'lucide-react';
import { course } from '@/content/course-ai';
import { companies } from '@/content/atlas/companies';
import { models } from '@/content/atlas/models';
import { useCourseProgress } from '@/features/progress/useCourseProgress';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/primitives';

export function HomePage() {
  const { overallPct, totalDone, totalLessons, perModule } = useCourseProgress();
  const nextModule = perModule.find((m) => !m.complete)?.module ?? course.modules[0];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-500/10 via-surface to-accent-500/10 p-8 sm:p-10">
        <span className="chip mb-4"><Sparkles size={13} className="text-accent-500" /> Your complete map of AI</span>
        <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Go from <span className="text-muted line-through decoration-2">“what’s an LLM?”</span> to explaining all of AI with confidence.
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          A fun, interactive course plus a browsable atlas of every major company, model, and tool — built for a software engineer who wants the whole picture. Fully offline.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/learn/${nextModule.slug}`}>
            <Button size="lg">{totalDone > 0 ? 'Continue learning' : 'Start the course'} <ArrowRight size={18} /></Button>
          </Link>
          <Link to="/atlas/companies">
            <Button size="lg" variant="outline"><Map size={18} /> Explore the Atlas</Button>
          </Link>
        </div>
        {totalDone > 0 && (
          <div className="mt-6 max-w-sm">
            <div className="mb-1 flex justify-between text-xs text-muted"><span>{totalDone}/{totalLessons} lessons</span><span>{overallPct}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${overallPct}%` }} /></div>
          </div>
        )}
      </motion.section>

      {/* Two pillars */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Link to={`/learn/${course.modules[0].slug}`} className="card group p-6 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <BookOpen className="text-brand-500" size={28} />
          <h3 className="mt-3 text-lg font-bold">The Course</h3>
          <p className="mt-1 text-sm text-muted">{course.modules.length} guided modules with interactive demos and quizzes — concepts, history, and the agentic stack (MCP, LangChain & more).</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 dark:text-brand-300">Start learning <ArrowRight size={16} /></span>
        </Link>
        <Link to="/atlas/companies" className="card group p-6 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <Map className="text-accent-500" size={28} />
          <h3 className="mt-3 text-lg font-bold">The AI Atlas</h3>
          <p className="mt-1 text-sm text-muted">{companies.length}+ companies and {models.length}+ models, plus products, categories, hardware, and on-device LLMs. Searchable & filterable.</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 group-hover:gap-2 dark:text-accent-400">Browse the atlas <ArrowRight size={16} /></span>
        </Link>
      </section>

      {/* Feature chips */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: WifiOff, label: '100% offline', sub: 'No internet needed' },
          { icon: Trophy, label: 'Unlimited quizzes', sub: 'No pressure' },
          { icon: Library, label: 'Full glossary', sub: 'Every term' },
          { icon: Sparkles, label: 'Interactive', sub: 'Learn by playing' },
        ].map((f) => (
          <div key={f.label} className="rounded-2xl border border-border bg-surface p-4 text-center">
            <f.icon className="mx-auto text-brand-500" size={22} />
            <div className="mt-2 text-sm font-bold">{f.label}</div>
            <div className="text-xs text-muted">{f.sub}</div>
          </div>
        ))}
      </section>

      {/* Module grid */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Course modules</h2>
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
              <div className="text-right text-xs">
                <div className={complete ? 'font-bold text-emerald-500' : 'text-muted'}>{done}/{total}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
