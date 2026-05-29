import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, WifiOff, Trophy, Sparkles, Hand } from 'lucide-react';
import { courses } from '@/content/courses';
import { useCourseProgress } from '@/features/progress/useCourseProgress';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';

const accentText: Record<string, string> = {
  brand: 'text-brand-500',
  accent: 'text-accent-500',
  emerald: 'text-emerald-500',
  violet: 'text-violet-500',
  rose: 'text-rose-500',
};

export function HomePage() {
  const { overallPct, totalDone } = useCourseProgress();

  return (
    <div className="space-y-10">
      {/* Platform hero */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-500/10 via-surface to-accent-500/10 p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <img src="./favicon.svg" alt="" className="h-12 w-12 rounded-2xl shadow-soft" />
          <span className="chip"><Sparkles size={13} className="text-accent-500" /> Cozy, interactive, 100% offline</span>
        </div>
        <h1 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Welcome to <span className="text-brand-600 dark:text-brand-300">Igloo</span> — your warm little place to learn hard things.
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Interactive courses with playable demos and unlimited-attempt quizzes, that work entirely offline. We’re starting with a complete map of <strong>AI</strong> — more courses (on any topic) will join over time.
        </p>
      </motion.section>

      {/* Course catalog */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">Courses</h2>
          <span className="text-xs text-muted">{courses.filter((c) => c.status === 'available').length} available</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((c) => {
            const isAvailable = c.status === 'available';
            const card = (
              <div className={cn('card group flex h-full flex-col p-6 transition-all', isAvailable ? 'hover:-translate-y-0.5 hover:shadow-glow' : 'border-dashed opacity-70')}>
                <div className="flex items-center justify-between">
                  <Icon name={c.icon} size={28} className={accentText[c.accent]} />
                  {isAvailable ? (
                    totalDone > 0 ? <span className="chip">{overallPct}% done</span> : <span className="chip">New</span>
                  ) : (
                    <span className="chip">Coming soon</span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted">{c.tagline}</p>
                {isAvailable ? (
                  <>
                    <div className="mt-3 text-xs text-muted">{c.moduleCount} modules · {c.lessonCount} lessons{c.extras?.length ? ` · ${c.extras.map((e) => e.label).join(' · ')}` : ''}</div>
                    <span className={cn('mt-3 inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2', accentText[c.accent])}>
                      {totalDone > 0 ? 'Continue' : 'Open course'} <ArrowRight size={16} />
                    </span>
                  </>
                ) : (
                  <div className="mt-3 text-xs text-muted">Want a specific topic? This slot is intentionally open.</div>
                )}
              </div>
            );
            return isAvailable && c.overviewPath ? (
              <Link key={c.id} to={c.overviewPath}>{card}</Link>
            ) : (
              <div key={c.id}>{card}</div>
            );
          })}
        </div>
      </section>

      {/* Why Igloo */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: WifiOff, label: '100% offline', sub: 'No internet needed' },
          { icon: Trophy, label: 'Unlimited quizzes', sub: 'No pressure' },
          { icon: Hand, label: 'Learn by playing', sub: 'Interactive demos' },
          { icon: Sparkles, label: 'Clean & cozy', sub: 'Happy to use' },
        ].map((f) => (
          <div key={f.label} className="rounded-2xl border border-border bg-surface p-4 text-center">
            <f.icon className="mx-auto text-brand-500" size={22} />
            <div className="mt-2 text-sm font-bold">{f.label}</div>
            <div className="text-xs text-muted">{f.sub}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
