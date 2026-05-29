import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, ExternalLink } from 'lucide-react';
import { course, getModuleBySlug } from '@/content/course-ai';
import type { Resource } from '@/content/types';
import { LessonRenderer } from './LessonRenderer';
import { Quiz } from '@/components/quiz/Quiz';
import { Icon } from '@/components/ui/Icon';
import { Button, Pill } from '@/components/ui/primitives';
import { useProgress } from '@/features/progress/ProgressProvider';
import { cn } from '@/lib/cn';

const kindLabel: Record<Resource['kind'], string> = {
  docs: 'Docs', video: 'Video', article: 'Article', project: 'Try it', tool: 'Tool', course: 'Course',
};

export function ModulePage() {
  const { slug } = useParams();
  const module = slug ? getModuleBySlug(slug) : undefined;
  const { isLessonDone, markLesson } = useProgress();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!module) {
    return (
      <div className="text-center">
        <p className="text-muted">Module not found.</p>
        <Link to="/" className="link-underline">Go home</Link>
      </div>
    );
  }

  const idx = course.modules.findIndex((m) => m.id === module.id);
  const prev = course.modules[idx - 1];
  const next = course.modules[idx + 1];

  return (
    <motion.article key={module.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted">
          <Icon name={module.icon} size={16} />
          <span>Module {module.order} of {course.modules.length - 1}</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">{module.title}</h1>
        <p className="mt-1 text-lg text-muted">{module.subtitle}</p>
      </header>

      {/* Lessons */}
      {module.lessons.map((lesson) => {
        const done = isLessonDone(lesson.id);
        return (
          <section key={lesson.id} className="mb-10 scroll-mt-20" id={lesson.id}>
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

      {/* Quiz */}
      {module.quiz.length > 0 && <Quiz quizId={module.id} questions={module.quiz} title={`${module.title} — quiz`} />}

      {/* Resources */}
      {module.resources.length > 0 && (
        <section className="mt-10">
          <h3 className="mb-3 text-lg font-bold">Go deeper (free resources)</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {module.resources.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="card flex items-center gap-3 p-3.5 transition-all hover:-translate-y-0.5">
                <ExternalLink size={16} className="shrink-0 text-brand-500" />
                <span className="flex-1 text-sm font-medium">{r.label}</span>
                <Pill tone="brand">{kindLabel[r.kind]}</Pill>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Prev / Next */}
      <nav className="mt-12 flex items-center justify-between gap-3 border-t border-border pt-6">
        {prev ? (
          <Link to={`/learn/${prev.slug}`}><Button variant="ghost"><ArrowLeft size={16} /> {prev.title}</Button></Link>
        ) : <span />}
        {next ? (
          <Link to={`/learn/${next.slug}`}><Button>{next.title} <ArrowRight size={16} /></Button></Link>
        ) : (
          <Link to="/exam"><Button variant="accent">Take the Final Exam <ArrowRight size={16} /></Button></Link>
        )}
      </nav>
    </motion.article>
  );
}
