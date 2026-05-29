import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Shuffle, ArrowRight } from 'lucide-react';
import { allQuestions } from '@/content/course-ai';
import type { Question } from '@/content/types';
import { Quiz } from '@/components/quiz/Quiz';
import { Button } from '@/components/ui/primitives';

const EXAM_SIZE = 15;

function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export function ExamPage() {
  const pool = useMemo(() => allQuestions(), []);
  const [seed, setSeed] = useState(0);
  const [started, setStarted] = useState(false);

  const questions: Question[] = useMemo(
    () => sample(pool, Math.min(EXAM_SIZE, pool.length)),
    // re-sample whenever seed changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  );

  if (!started) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-500">
          <GraduationCap size={34} />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Final Exam</h1>
        <p className="mt-2 text-muted">
          {Math.min(EXAM_SIZE, pool.length)} questions sampled from across all {pool.length > 0 ? 'modules' : ''}. Mixed topics, instant explanations, and — like every quiz here — <strong>unlimited attempts</strong> with no timer. Pass mark is just “learn something.”
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button size="lg" onClick={() => setStarted(true)}>Start exam <ArrowRight size={18} /></Button>
        </div>
        <p className="mt-4 text-xs text-muted">Tip: finish the course modules first for the best shot.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Final Exam</h1>
          <p className="text-muted">Mixed questions from the whole course.</p>
        </div>
        <Button variant="outline" onClick={() => setSeed((s) => s + 1)}><Shuffle size={16} /> New set</Button>
      </div>

      <Quiz key={seed} quizId="final-exam" questions={questions} title="Your exam" />

      <div className="mt-8 text-center text-sm text-muted">
        Want to review? Head back to <Link to="/" className="link-underline">the modules</Link> or skim the <Link to="/glossary" className="link-underline">glossary</Link>.
      </div>
    </div>
  );
}
