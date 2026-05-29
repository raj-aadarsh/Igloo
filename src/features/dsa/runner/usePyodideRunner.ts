import { useEffect, useReducer } from 'react';
import { runner, runTests, type TestLike } from './runner';

// Thin React binding to the singleton runner: re-renders on status changes and
// exposes warmup + runTests.
export function usePyodideRunner() {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => runner.subscribe(force), []);
  return {
    status: runner.status,
    warmup: () => runner.ensureReady(),
    run: (code: string, tests: TestLike[]) => runTests(code, tests),
  };
}
