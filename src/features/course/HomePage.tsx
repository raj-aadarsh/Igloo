import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Sparkles, Hand, Wand2 } from 'lucide-react';
import { courses } from '@/content/courses';
import { useCourseProgress } from '@/features/progress/useCourseProgress';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';

export function HomePage() {
  const { overallPct, totalDone } = useCourseProgress();
  const available = courses.filter((c) => c.status === 'available');
  const upcoming = courses.filter((c) => c.status !== 'available');

  return (
    <div className="space-y-12">
      {/* Platform hero */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-500/10 via-surface to-accent-500/10 p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <Logo className="h-12 w-12 rounded-2xl shadow-soft" />
          <span className="chip"><Sparkles size={13} className="text-accent-500" /> Cozy, interactive learning</span>
        </div>
        <h1 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Welcome to <span className="text-brand-600 dark:text-brand-300">Igloo</span> — your warm little place to learn hard things.
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Hands-on courses with playable demos and pressure-free quizzes, designed so a tricky topic actually feels fun to learn.
        </p>
      </motion.section>

      {/* Course catalog */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">Courses</h2>
          <span className="text-xs text-muted">{available.length} available</span>
        </div>

        {/* Featured / available course — made to stand out */}
        <div className="space-y-4">
          {available.map((c) => (
            <Link key={c.id} to={c.overviewPath ?? '/'} className="group block">
              <motion.div
                whileHover={{ y: -3 }}
                className="relative overflow-hidden rounded-3xl border border-brand-400/40 bg-gradient-to-br from-brand-500/15 via-surface to-accent-500/10 p-6 shadow-soft ring-1 ring-brand-500/15 transition-shadow group-hover:shadow-glow sm:p-7"
              >
                {/* subtle glow blob */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-400/20 blur-3xl" />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 ring-1 ring-brand-500/20 dark:text-brand-300">
                    <Icon name={c.icon} size={30} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">Course 01</span>
                      <span className="chip">{totalDone > 0 ? `${overallPct}% complete` : 'New'}</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted">{c.tagline}</p>
                  </div>
                  <div className="shrink-0 self-end sm:self-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition-all group-hover:translate-x-1 group-hover:bg-brand-500">
                      <ArrowRight size={20} />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}

          {/* Upcoming — quiet, minimal */}
          {upcoming.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-3xl border border-dashed border-border bg-surface/40 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-muted">
                <Icon name={c.icon} size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-muted">{c.title}</h3>
              </div>
              <span className="chip">Coming soon</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why Igloo */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { icon: Trophy, label: 'Unlimited quizzes', sub: 'No pressure' },
          { icon: Hand, label: 'Learn by playing', sub: 'Interactive demos' },
          { icon: Wand2, label: 'Clean & cozy', sub: 'A joy to use' },
        ].map((f) => (
          <div key={f.label} className="rounded-2xl border border-border bg-surface p-4 text-center">
            <f.icon className="mx-auto text-brand-500" size={22} />
            <div className="mt-2 text-sm font-bold">{f.label}</div>
            <div className="text-xs text-muted">{f.sub}</div>
          </div>
        ))}
      </section>

      {/* Copyright */}
      <footer className="border-t border-border pt-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} Igloo. All rights reserved.
      </footer>
    </div>
  );
}
