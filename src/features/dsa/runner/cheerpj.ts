// ---------------------------------------------------------------------------
// Java execution engine for the DSA playground, powered by CheerpJ (a real JVM
// compiled to WebAssembly that runs in the browser). It compiles the learner's
// Java with the real `javac` and runs it, feeding stdin and capturing stdout.
//
// CheerpJ's free Community runtime loads from its CDN, so the FIRST run of any
// Java problem needs an internet connection (everything else in Igloo is still
// offline). Tunables live in the CONFIG block — bump the version here if needed.
// ---------------------------------------------------------------------------

const CONFIG = {
  loaderUrl: 'https://cjrtnc.leaningtech.com/3.0/cj3loader.js',
  // Where compiled .class files are written (CheerpJ's persistent, writable mount).
  outDir: '/files/',
  // Classpath used both to run javac and to run the compiled program.
  classpath: '/files/',
  // Per-test wall-clock budget. CheerpJ runs cooperatively; a true infinite loop
  // can still hang the tab, but most slow/looping solutions resolve via this.
  timeoutMs: 10000,
};

// The user always writes a `public class Main { public static void main(String[]) }`.
// This tiny harness redirects stdin from a file we write, then calls their main —
// so learners write a complete program from scratch, judge-style.
const RUNNER_SRC = `import java.io.*;
public class __Runner {
  public static void main(String[] __args) throws Throwable {
    System.setIn(new FileInputStream("/str/__stdin.txt"));
    try {
      Main.main(new String[0]);
    } catch (Throwable t) {
      System.out.flush();
      throw t;
    }
    System.out.flush();
  }
}`;

declare global {
  interface Window {
    cheerpjInit?: (opts?: Record<string, unknown>) => Promise<unknown>;
    cheerpjRunMain?: (cls: string, classPath: string, ...args: string[]) => Promise<number>;
    cheerpOSAddStringFile?: (path: string, data: string) => void;
  }
}

export type JavaRunnerStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface JavaTestOutcome {
  passed: boolean;
  expected: string;
  got: string;
  error: string | null;
  timedOut: boolean;
  hidden?: boolean;
  stdin: string;
}

export interface RunReport {
  compileError: string | null;
  loadError: string | null;
  results: JavaTestOutcome[];
}

export interface TestLike {
  stdin: string;
  expected: string;
  hidden?: boolean;
}

function trimEnd(s: string) {
  return s.replace(/\s+$/g, '');
}

class JavaRunner {
  status: JavaRunnerStatus = 'idle';
  private ready: Promise<void> | null = null;
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
  private set(s: JavaRunnerStatus) {
    this.status = s;
    this.emit();
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.cheerpjInit) return resolve();
      const existing = document.querySelector('script[data-cheerpj]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('load')));
        return;
      }
      const s = document.createElement('script');
      s.src = CONFIG.loaderUrl;
      s.dataset.cheerpj = '1';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Could not load the Java engine — check your internet connection.'));
      document.head.appendChild(s);
    });
  }

  ensureReady(): Promise<void> {
    if (this.ready) return this.ready;
    this.set('loading');
    this.ready = (async () => {
      await this.loadScript();
      if (!window.cheerpjInit) throw new Error('CheerpJ failed to initialise.');
      await window.cheerpjInit({ status: 'none' });
      this.set('ready');
    })().catch((e) => {
      this.ready = null;
      this.set('error');
      throw e;
    });
    return this.ready;
  }

  private writeFile(path: string, data: string) {
    window.cheerpOSAddStringFile?.(path, data);
  }

  /** Run a Java main, capturing console output (CheerpJ routes System.out→console.log). */
  private async runMain(cls: string, args: string[]): Promise<{ exit: number | null; out: string; err: string; timedOut: boolean }> {
    const out: string[] = [];
    const err: string[] = [];
    const toStr = (a: unknown[]) => a.map((x) => (typeof x === 'string' ? x : String(x))).join(' ');
    const orig = { log: console.log, info: console.info, debug: console.debug, error: console.error, warn: console.warn };
    console.log = (...a: unknown[]) => out.push(toStr(a));
    console.info = (...a: unknown[]) => out.push(toStr(a));
    console.debug = (...a: unknown[]) => out.push(toStr(a));
    console.error = (...a: unknown[]) => err.push(toStr(a));
    console.warn = (...a: unknown[]) => err.push(toStr(a));
    let timedOut = false;
    try {
      const exit = await Promise.race([
        window.cheerpjRunMain!(cls, CONFIG.classpath, ...args),
        new Promise<number | null>((res) => setTimeout(() => { timedOut = true; res(null); }, CONFIG.timeoutMs)),
      ]);
      return { exit, out: out.join('\n'), err: err.join('\n'), timedOut };
    } finally {
      Object.assign(console, orig);
    }
  }

  /** Compile Main + the harness. Returns a compile-error string, or null on success. */
  private async compile(userCode: string): Promise<string | null> {
    this.writeFile('/str/Main.java', userCode);
    this.writeFile('/str/__Runner.java', RUNNER_SRC);
    const { exit, err, out } = await this.runMain('com.sun.tools.javac.Main', [
      '-d', CONFIG.outDir,
      '-classpath', CONFIG.classpath,
      '/str/Main.java',
      '/str/__Runner.java',
    ]);
    if (exit === 0) return null;
    const msg = (err || out).trim();
    return msg || 'Your code did not compile. Check the class is named `Main` with a `public static void main(String[] args)`.';
  }

  async runTests(userCode: string, tests: TestLike[]): Promise<RunReport> {
    try {
      await this.ensureReady();
    } catch (e) {
      return { compileError: null, loadError: e instanceof Error ? e.message : String(e), results: [] };
    }

    const compileError = await this.compile(userCode);
    if (compileError) return { compileError, loadError: null, results: [] };

    const results: JavaTestOutcome[] = [];
    for (const t of tests) {
      this.writeFile('/str/__stdin.txt', t.stdin);
      const { out, err, timedOut } = await this.runMain('__Runner', []);
      const got = trimEnd(out);
      const expected = trimEnd(t.expected);
      const runtimeErr = err.trim();
      results.push({
        stdin: t.stdin,
        hidden: t.hidden,
        expected,
        got,
        error: runtimeErr || null,
        timedOut,
        passed: !timedOut && !runtimeErr && got === expected,
      });
    }
    return { compileError: null, loadError: null, results };
  }
}

export const javaRunner = new JavaRunner();
