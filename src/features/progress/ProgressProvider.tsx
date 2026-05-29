import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { readJSON, removeKey, writeJSON } from '@/lib/storage';

export interface QuizScore {
  correct: number;
  total: number;
}

interface ProgressState {
  completedLessons: Record<string, true>;
  quizScores: Record<string, QuizScore>;
}

interface ProgressCtx extends ProgressState {
  markLesson: (id: string, done: boolean) => void;
  isLessonDone: (id: string) => boolean;
  setQuizScore: (id: string, correct: number, total: number) => void;
  getQuizScore: (id: string) => QuizScore | undefined;
  resetAll: () => void;
}

const KEY = 'progress';
const Ctx = createContext<ProgressCtx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() =>
    readJSON<ProgressState>(KEY, { completedLessons: {}, quizScores: {} }),
  );

  const persist = useCallback((next: ProgressState) => {
    setState(next);
    writeJSON(KEY, next);
  }, []);

  const markLesson = useCallback(
    (id: string, done: boolean) => {
      setState((prev) => {
        const completedLessons = { ...prev.completedLessons };
        if (done) completedLessons[id] = true;
        else delete completedLessons[id];
        const next = { ...prev, completedLessons };
        writeJSON(KEY, next);
        return next;
      });
    },
    [],
  );

  const setQuizScore = useCallback((id: string, correct: number, total: number) => {
    setState((prev) => {
      const existing = prev.quizScores[id];
      // Keep the best attempt.
      if (existing && existing.correct / existing.total >= correct / total) return prev;
      const next = { ...prev, quizScores: { ...prev.quizScores, [id]: { correct, total } } };
      writeJSON(KEY, next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    removeKey(KEY);
    persist({ completedLessons: {}, quizScores: {} });
  }, [persist]);

  const value = useMemo<ProgressCtx>(
    () => ({
      ...state,
      markLesson,
      isLessonDone: (id: string) => Boolean(state.completedLessons[id]),
      setQuizScore,
      getQuizScore: (id: string) => state.quizScores[id],
      resetAll,
    }),
    [state, markLesson, setQuizScore, resetAll],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
