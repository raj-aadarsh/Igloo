/// <reference lib="webworker" />
// Runs user Python off the main thread. Loads Pyodide's ESM loader at runtime
// from the locally-vendored /public/pyodide/ folder (fully offline). The main
// thread enforces per-run timeouts by terminating this worker on a hang.

let pyodide: any = null;

// A tiny harness: run the user's full program with a given stdin, capture stdout,
// and return JSON [stdout, errorTextOrNull]. Mirrors how a real judge works.
const HARNESS = `
import sys, io, json, traceback
def __run_user(src, inp):
    old_in, old_out = sys.stdin, sys.stdout
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    err = None
    try:
        ns = {'__name__': '__main__'}
        exec(compile(src, '<solution>', 'exec'), ns)
    except SystemExit:
        pass
    except BaseException:
        err = traceback.format_exc()
    finally:
        sys.stdin, sys.stdout = old_in, old_out
    return json.dumps([out.getvalue(), err])
`;

const post = (m: unknown) => (self as unknown as Worker).postMessage(m);

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data;

  if (msg.type === 'init') {
    try {
      const mod = await import(/* @vite-ignore */ msg.indexURL + 'pyodide.mjs');
      pyodide = await mod.loadPyodide({ indexURL: msg.indexURL });
      await pyodide.runPythonAsync(HARNESS);
      post({ type: 'ready' });
    } catch (err) {
      post({ type: 'init-error', error: String(err) });
    }
    return;
  }

  if (msg.type === 'run') {
    if (!pyodide) {
      post({ type: 'result', id: msg.id, stdout: '', error: 'Engine not ready' });
      return;
    }
    try {
      pyodide.globals.set('__src__', msg.code);
      pyodide.globals.set('__inp__', msg.stdin ?? '');
      const json = await pyodide.runPythonAsync('__run_user(__src__, __inp__)');
      const [stdout, error] = JSON.parse(json);
      post({ type: 'result', id: msg.id, stdout, error });
    } catch (err) {
      post({ type: 'result', id: msg.id, stdout: '', error: String(err) });
    }
  }
};
