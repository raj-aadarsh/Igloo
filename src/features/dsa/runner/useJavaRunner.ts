import { useEffect, useReducer } from 'react';
import { javaRunner, type TestLike } from './cheerpj';

// React binding to the singleton Java (CheerpJ) runner.
export function useJavaRunner() {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => javaRunner.subscribe(force), []);
  return {
    status: javaRunner.status,
    warmup: () => javaRunner.ensureReady(),
    run: (code: string, tests: TestLike[]) => javaRunner.runTests(code, tests),
  };
}
