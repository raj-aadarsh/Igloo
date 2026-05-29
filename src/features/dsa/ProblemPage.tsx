import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { findProblem, getSubCourse } from '@/content/course-dsa';
import type { Difficulty } from '@/content/course-dsa/types';
import { LessonRenderer } from '@/features/course/LessonRenderer';
import { Playground } from './Playground';
import { Pill } from '@/components/ui/primitives';

const diffTone: Record<Difficulty, 'green' | 'accent' | 'rose'> = {
  Easy: 'green',
  Medium: 'accent',
  Hard: 'rose',
};

export function ProblemPage() {
  const { topic, problemId } = useParams();
  const found = problemId ? findProblem(problemId) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [problemId]);

  if (!found) {
    return (
      <div className="text-center text-muted">
        Problem not found. <Link to="/dsa" className="link-underline">Back to DSA</Link>
      </div>
    );
  }

  const { problem } = found;
  const backTo = topic === 'arena' ? '/dsa/arena' : `/dsa/${topic}`;
  const backLabel = topic === 'arena' ? 'Interview Arena' : getSubCourse(topic ?? '')?.title ?? 'Topic';

  return (
    <article>
      <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> {backLabel}
      </Link>

      <header className="mb-6 mt-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Pill tone={diffTone[problem.difficulty]}>{problem.difficulty}</Pill>
          {problem.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
        <h1 className="text-3xl font-black tracking-tight">{problem.title}</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: statement */}
        <div>
          <LessonRenderer blocks={problem.statement} />

          <h3 className="mt-6 mb-2 text-sm font-bold uppercase tracking-wide text-muted">Examples</h3>
          <div className="space-y-3">
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface-2/50 p-3 font-mono text-sm">
                <div><span className="text-muted">Input:</span> <span className="whitespace-pre-wrap">{ex.input}</span></div>
                <div><span className="text-muted">Output:</span> <span className="font-bold">{ex.output}</span></div>
                {ex.explanation && <div className="mt-1 font-sans text-xs text-muted">{ex.explanation}</div>}
              </div>
            ))}
          </div>

          {problem.constraints.length > 0 && (
            <>
              <h3 className="mt-6 mb-2 text-sm font-bold uppercase tracking-wide text-muted">Constraints</h3>
              <ul className="ml-5 list-disc space-y-1 font-mono text-sm text-muted">
                {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </>
          )}

          <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm dark:border-brand-800 dark:bg-brand-900/20">
            <span className="font-bold text-brand-700 dark:text-brand-300">Input / Output:</span>{' '}
            <span className="text-text/90">{problem.ioNote}</span>
          </div>
        </div>

        {/* Right: playground */}
        <div>
          <Playground problem={problem} />
        </div>
      </div>
    </article>
  );
}
