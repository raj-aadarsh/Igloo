import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw, Trophy, CheckCircle2 } from 'lucide-react';
import type { Question } from '@/content/types';
import { Button } from '@/components/ui/primitives';
import { RichText } from '@/components/ui/RichText';
import { useProgress } from '@/features/progress/ProgressProvider';
import { cn } from '@/lib/cn';

function arraysEqual(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

export function Quiz({ quizId, questions, title = 'Quick check' }: { quizId: string; questions: Question[]; title?: string }) {
  const { setQuizScore, getQuizScore } = useProgress();
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const best = getQuizScore(quizId);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce((acc, q) => (arraysEqual(answers[q.id] ?? [], q.correct) ? acc + 1 : acc), 0);
  }, [submitted, answers, questions]);

  const toggle = (q: Question, idx: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      if (q.type === 'single') return { ...prev, [q.id]: [idx] };
      return { ...prev, [q.id]: cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur, idx] };
    });
  };

  const allAnswered = questions.every((q) => (answers[q.id]?.length ?? 0) > 0);

  const submit = () => {
    setSubmitted(true);
    const s = questions.reduce((acc, q) => (arraysEqual(answers[q.id] ?? [], q.correct) ? acc + 1 : acc), 0);
    setQuizScore(quizId, s, questions.length);
  };

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const pct = Math.round((score / questions.length) * 100);

  return (
    <section className="card mt-10 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <Trophy size={20} className="text-accent-500" /> {title}
        </h3>
        {best && (
          <span className="chip">
            <CheckCircle2 size={13} className="text-emerald-500" /> Best: {best.correct}/{best.total}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qi) => {
          const sel = answers[q.id] ?? [];
          const isCorrect = submitted && arraysEqual(sel, q.correct);
          return (
            <div key={q.id}>
              <p className="mb-1 font-semibold">
                <span className="mr-2 text-muted">{qi + 1}.</span>
                <RichText>{q.prompt}</RichText>
                {q.type === 'multi' && <span className="ml-2 text-xs font-normal text-muted">(select all that apply)</span>}
              </p>
              <div className="mt-2 space-y-2">
                {q.options.map((opt, oi) => {
                  const picked = sel.includes(oi);
                  const correct = q.correct.includes(oi);
                  return (
                    <button
                      key={oi}
                      onClick={() => toggle(q, oi)}
                      disabled={submitted}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all',
                        !submitted && picked && 'border-brand-500 bg-brand-50 dark:bg-brand-900/30',
                        !submitted && !picked && 'border-border bg-surface hover:border-brand-300',
                        submitted && correct && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/25',
                        submitted && picked && !correct && 'border-rose-500 bg-rose-50 dark:bg-rose-900/25',
                        submitted && !picked && !correct && 'border-border opacity-60',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center border',
                          q.type === 'single' ? 'rounded-full' : 'rounded',
                          picked ? 'border-brand-500 bg-brand-500 text-white' : 'border-muted/50',
                          submitted && correct && 'border-emerald-500 bg-emerald-500 text-white',
                          submitted && picked && !correct && 'border-rose-500 bg-rose-500 text-white',
                        )}
                      >
                        {submitted && correct && <Check size={13} />}
                        {submitted && picked && !correct && <X size={13} />}
                      </span>
                      <RichText>{opt}</RichText>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={cn('mt-2 rounded-lg p-3 text-sm', isCorrect ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200' : 'bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-200')}
                  >
                    <strong>{isCorrect ? 'Correct! ' : 'Not quite. '}</strong>
                    <RichText>{q.explanation}</RichText>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {!submitted ? (
          <Button onClick={submit} disabled={!allAnswered}>
            Submit answers
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={retry}>
              <RotateCcw size={16} /> Try again
            </Button>
            <span className="text-sm text-muted">Unlimited attempts — no pressure.</span>
          </div>
        )}
        {submitted && (
          <div className="text-right">
            <div className={cn('text-2xl font-black', pct >= 70 ? 'text-emerald-500' : pct >= 40 ? 'text-accent-500' : 'text-rose-500')}>
              {score}/{questions.length}
            </div>
            <div className="text-xs text-muted">{pct >= 70 ? 'Great work! 🎉' : pct >= 40 ? 'Almost there — review & retry' : 'Revisit the lesson and retry'}</div>
          </div>
        )}
      </div>
    </section>
  );
}
