// Singleton manager around the Pyodide worker. Pyodide is expensive to boot, so
// we load it once and reuse it across problems. Each run is time-boxed; on a hang
// (e.g. an infinite loop) we terminate the worker and respawn it next time.
import PyodideWorker from './pyodide.worker.ts?worker';

export interface RunResult {
  stdout: string;
  error: string | null;
  timedOut: boolean;
}

export type RunnerStatus = 'idle' | 'loading' | 'ready';

class PyodideRunner {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private seq = 0;
  private pending = new Map<number, (r: RunResult) => void>();
  private resolveReady?: () => void;
  private rejectReady?: (e: unknown) => void;

  status: RunnerStatus = 'idle';
  private listeners = new Set<() => void>();

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  private emit() {
    this.listeners.forEach((l) => l());
  }
  private setStatus(s: RunnerStatus) {
    this.status = s;
    this.emit();
  }

  private indexURL() {
    // Resolves to the locally-served /pyodide/ folder (offline-safe).
    return new URL('pyodide/', document.baseURI).href;
  }

  private spawn() {
    this.worker = new PyodideWorker();
    this.worker.onmessage = (e: MessageEvent) => {
      const m = e.data;
      if (m.type === 'ready') {
        this.resolveReady?.();
      } else if (m.type === 'init-error') {
        this.rejectReady?.(new Error(m.error));
      } else if (m.type === 'result') {
        const cb = this.pending.get(m.id);
        if (cb) {
          this.pending.delete(m.id);
          cb({ stdout: m.stdout ?? '', error: m.error ?? null, timedOut: false });
        }
      }
    };
  }

  ensureReady(): Promise<void> {
    if (this.ready) return this.ready;
    this.setStatus('loading');
    this.spawn();
    this.ready = new Promise<void>((res, rej) => {
      this.resolveReady = () => {
        this.setStatus('ready');
        res();
      };
      this.rejectReady = (e) => {
        this.ready = null;
        this.setStatus('idle');
        rej(e);
      };
      this.worker!.postMessage({ type: 'init', indexURL: this.indexURL() });
    });
    return this.ready;
  }

  /** Kill a hung worker so the UI never freezes; it re-inits on the next run. */
  private hardReset() {
    this.worker?.terminate();
    this.worker = null;
    this.pending.clear();
    this.ready = null;
    this.setStatus('idle');
  }

  async run(code: string, stdin: string, timeoutMs = 6000): Promise<RunResult> {
    await this.ensureReady();
    const id = ++this.seq;
    return new Promise<RunResult>((resolve) => {
      let done = false;
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        this.pending.delete(id);
        this.hardReset();
        resolve({ stdout: '', error: null, timedOut: true });
      }, timeoutMs);
      this.pending.set(id, (r) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve(r);
      });
      this.worker!.postMessage({ type: 'run', id, code, stdin });
    });
  }
}

export const runner = new PyodideRunner();

export interface TestOutcome {
  passed: boolean;
  expected: string;
  got: string;
  error: string | null;
  timedOut: boolean;
  hidden?: boolean;
  stdin: string;
}

export interface TestLike {
  stdin: string;
  expected: string;
  hidden?: boolean;
}

/** Run user code against each test case sequentially; compare trimmed stdout. */
export async function runTests(code: string, tests: TestLike[]): Promise<TestOutcome[]> {
  const results: TestOutcome[] = [];
  for (const t of tests) {
    const r = await runner.run(code, t.stdin);
    const got = r.stdout.replace(/\s+$/, '');
    const expected = t.expected.replace(/\s+$/, '');
    results.push({
      stdin: t.stdin,
      hidden: t.hidden,
      expected,
      got,
      error: r.error,
      timedOut: r.timedOut,
      passed: !r.error && !r.timedOut && got === expected,
    });
  }
  return results;
}
