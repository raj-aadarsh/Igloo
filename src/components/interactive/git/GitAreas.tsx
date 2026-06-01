import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileEdit, Plus, GitCommit, UploadCloud, RotateCcw, FolderGit2, Box, Database, Github } from 'lucide-react';
import { cn } from '@/lib/cn';

const AREAS = [
  { id: 0, label: 'Working Directory', sub: 'your edited files', icon: FolderGit2 },
  { id: 1, label: 'Staging Area', sub: 'index — what’s next to commit', icon: Box },
  { id: 2, label: 'Local Repository', sub: '.git — your commit history', icon: Database },
  { id: 3, label: 'Remote (GitHub)', sub: 'shared with the team', icon: Github },
];

const ACTIONS = [
  { from: 0, label: 'git add', cmd: 'git add file.txt', icon: Plus },
  { from: 1, label: 'git commit', cmd: 'git commit -m "edit"', icon: GitCommit },
  { from: 2, label: 'git push', cmd: 'git push origin main', icon: UploadCloud },
];

export function GitAreas() {
  const [stage, setStage] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const act = ACTIONS.find((a) => a.from === stage);
  const run = () => { if (!act) return; setLog((l) => [...l, `$ ${act.cmd}`]); setStage(stage + 1); };
  const reset = () => { setStage(0); setLog([]); };

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">The 3 areas of Git — move a change from your editor to GitHub</div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {AREAS.map((a) => (
          <div key={a.id} className={cn('rounded-xl border p-2 text-center transition-colors', stage === a.id ? 'border-brand-400 bg-brand-500/10' : 'border-border')}>
            <a.icon size={18} className={cn('mx-auto', stage === a.id ? 'text-brand-600 dark:text-brand-300' : 'text-muted')} />
            <div className="mt-1 text-[11px] font-bold leading-tight">{a.label}</div>
            <div className="text-[9px] text-muted">{a.sub}</div>
            <div className="mt-1 flex h-8 items-center justify-center">
              {stage === a.id && (
                <motion.div layoutId="change" className="flex items-center gap-1 rounded-md bg-brand-500 px-2 py-1 text-[10px] font-semibold text-white">
                  <FileEdit size={11} /> file.txt
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {act ? (
          <button onClick={run} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-600">
            <act.icon size={15} /> {act.label}
          </button>
        ) : (
          <span className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">✓ pushed — it’s on GitHub!</span>
        )}
        <button onClick={reset} className="inline-flex items-center gap-1 text-xs text-muted hover:text-text"><RotateCcw size={13} /> Reset</button>
      </div>

      {log.length > 0 && (
        <pre className="mt-3 overflow-x-auto rounded-xl bg-[#0d1117] p-3 font-mono text-xs text-slate-100">{log.join('\n')}</pre>
      )}

      <p className="mt-2 text-xs text-muted"><span className="font-mono">add</span> stages a snapshot of your change, <span className="font-mono">commit</span> records it permanently in your local history, and <span className="font-mono">push</span> shares it with the remote. The <strong>staging area</strong> in the middle is what lets you commit <em>some</em> changes but not others.</p>
    </div>
  );
}
