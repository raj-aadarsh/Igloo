import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Swords, Lock, CheckCircle2 } from 'lucide-react';
import { dsaCourse, plannedTopics, arenaProblems, totalProblems } from '@/content/course-dsa';
import { useDsaProgress } from '@/features/progress/useDsaProgress';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

function Ring({ done, total }: { done: number; total: number }) {
  const pct = total ? done / total : 0;
  const r = 16;
  const c = 2 * Math.PI * r;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
      <circle cx="20" cy="20" r={r} fill="none" stroke="rgb(var(--border))" strokeWidth="4" />
      <circle cx="20" cy="20" r={r} fill="none" stroke="rgb(var(--brand-glow))" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 20 20)" />
      <text x="20" y="24" textAnchor="middle" className="fill-text text-[10px] font-bold">{Math.round(pct * 100)}</text>
    </svg>
  );
}

export function DsaOverviewPage() {
  const { perSub, badgesEarned } = useDsaProgress();
  const arenaCount = arenaProblems().length;

  return (
    <div className="space-y-10">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> All courses
      </Link>

      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-emerald-500/10 via-surface to-brand-500/10 p-8 sm:p-10">
        <span className="chip mb-4"><Icon name="cap" size={13} /> Course #2</span>
        <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">{dsaCourse.title}</h1>
        <p className="mt-3 max-w-xl text-muted">{dsaCourse.tagline}</p>
        <p className="mt-2 text-sm text-muted">Learn the idea → learn the Java → then <strong className="text-text">write &amp; run real code</strong> right here. {badgesEarned > 0 && <>You’ve earned <strong className="text-text">{badgesEarned}</strong> badge{badgesEarned > 1 ? 's' : ''} so far.</>}</p>
      </motion.section>

      {/* Interview Arena CTA */}
      <Link to="/dsa/arena" className="group block">
        <div className="relative overflow-hidden rounded-3xl border border-accent-400/40 bg-gradient-to-br from-accent-500/15 via-surface to-rose-500/10 p-6 shadow-soft ring-1 ring-accent-500/15 transition-shadow group-hover:shadow-glow">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-600 ring-1 ring-accent-500/20 dark:text-accent-300">
              <Swords size={28} />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-accent-600 dark:text-accent-300">The endgame</div>
              <h3 className="text-xl font-black tracking-tight">Interview Arena</h3>
              <p className="text-sm text-muted">{arenaCount} real, hard interview problems to battle once you’re ready.</p>
            </div>
            <ArrowRight className="shrink-0 text-muted transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>

      {/* Sub-courses */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Topics</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {perSub.map(({ sub, lessonsDone, lessonsTotal, problemsSolved, problemsTotal, earned }) => (
            <Link key={sub.id} to={`/dsa/${sub.slug}`} className="card flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow">
              <Ring done={lessonsDone + problemsSolved} total={lessonsTotal + problemsTotal} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Icon name={sub.icon} size={16} className="text-brand-500" />
                  <span className="truncate font-bold">{sub.title}</span>
                  {earned && <span title={sub.badge.name}>{sub.badge.emoji}</span>}
                </div>
                <div className="mt-0.5 text-xs text-muted">{sub.problems.length} problems · {sub.learn.length} lessons</div>
              </div>
              <ArrowRight size={18} className="shrink-0 text-muted" />
            </Link>
          ))}

          {/* Planned */}
          {plannedTopics.map((t) => (
            <div key={t.title} className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-surface/40 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted"><Icon name={t.icon} size={18} /></div>
              <div className="min-w-0 flex-1"><span className="truncate font-semibold text-muted">{t.title}</span></div>
              <Lock size={15} className="shrink-0 text-muted/50" />
            </div>
          ))}
        </div>
      </section>

      {/* Badge shelf */}
      <section className="rounded-2xl border border-border bg-surface-2/40 p-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Badge shelf</h2>
        <div className="flex flex-wrap gap-3">
          {perSub.map(({ sub, earned }) => (
            <div key={sub.id} className={cn('flex items-center gap-2 rounded-xl border px-3 py-2 text-sm', earned ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20' : 'border-border bg-surface opacity-60')}>
              <span className={cn('text-lg', !earned && 'grayscale')}>{sub.badge.emoji}</span>
              <span className="font-semibold">{sub.badge.name}</span>
              {earned ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Lock size={13} className="text-muted/50" />}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">Earn a badge by finishing all lessons and solving every problem in a topic. ({totalProblems} problems in total across the course so far.)</p>
      </section>
    </div>
  );
}
