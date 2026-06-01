import type { Module } from '@/content/types';

export const m4: Module = {
  id: 'git-m4',
  slug: 'undoing-and-cheatsheet',
  order: 4,
  title: 'Undoing Mistakes & Cheat-Sheet',
  subtitle: 'The lifesavers + interview recap',
  icon: 'git-branch',
  lessons: [
    {
      id: 'git-m4-l1',
      title: 'Undo: restore, reset, revert',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Git’s superpower is that mistakes are recoverable. The trick is picking the right "undo" for the situation.' },
        { type: 'keyterms', terms: [
          { term: 'git restore <file>', def: 'Discard uncommitted changes to a file (back to the last commit). Use git restore --staged <file> to unstage.' },
          { term: 'git reset', def: 'Move the branch pointer back. --soft keeps changes staged; --mixed (default) keeps them unstaged; --hard discards them entirely (dangerous).' },
          { term: 'git revert <commit>', def: 'Create a NEW commit that undoes a previous one — safe for shared history (doesn’t rewrite it).' },
          { term: 'git commit --amend', def: 'Fix the most recent commit (message or contents). Rewrites it — only before pushing.' },
        ] },
        { type: 'callout', variant: 'key', text: 'reset vs revert — the key interview distinction: reset rewrites history (moves the pointer back) — use on LOCAL commits; revert adds a new inverse commit (preserves history) — use on PUSHED/shared commits.' },
        { type: 'callout', variant: 'warning', text: '`git reset --hard` throws away uncommitted work permanently. Double-check before running it. (Even then, committed work can often be recovered via `git reflog`.)' },
      ],
    },
    {
      id: 'git-m4-l2',
      title: 'Stash, and the cheat-sheet',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'git stash', def: 'Shelve your uncommitted changes to get a clean working directory (e.g. to switch branches quickly); git stash pop brings them back.' },
          { term: 'git reflog', def: 'A log of everywhere HEAD has been — your safety net to recover "lost" commits after a bad reset.' },
        ] },
        { type: 'code', caption: 'The everyday Git cheat-sheet', code: `# inspect
git status / git log --oneline --graph / git diff

# save work
git add . && git commit -m "msg"
git push / git pull

# branch
git switch -c feature   /   git switch main   /   git merge feature

# undo
git restore <file>          # discard file changes
git restore --staged <file> # unstage
git reset --soft HEAD~1     # undo last commit, keep changes staged
git revert <commit>         # safe undo of a pushed commit
git stash / git stash pop   # shelve & restore work` },
        { type: 'callout', variant: 'tip', text: 'When stuck or scared, run `git status` — it tells you the current state and usually suggests the exact command to fix it. And almost nothing is truly lost while it’s been committed (see reflog).' },
      ],
    },
    {
      id: 'git-m4-l3',
      title: 'Interview rapid-fire',
      minutes: 4,
      blocks: [
        { type: 'keyterms', title: 'Answer each in one breath', terms: [
          { term: 'Git vs GitHub?', def: 'Git = the version-control tool; GitHub = a hosting platform for Git repos.' },
          { term: 'merge vs rebase?', def: 'Merge keeps history with a merge commit (non-linear); rebase replays commits for linear history — never rebase shared commits.' },
          { term: 'reset vs revert?', def: 'reset rewrites history (local); revert adds an inverse commit (safe for shared).' },
          { term: 'fetch vs pull?', def: 'fetch downloads only; pull = fetch + merge.' },
          { term: 'What’s the staging area?', def: 'The index — where you assemble exactly what goes into the next commit.' },
          { term: 'What is a PR?', def: 'A request to merge a branch, carrying review + automated checks.' },
          { term: 'How to undo a pushed commit?', def: 'git revert (don’t reset shared history).' },
          { term: 'Resolve a conflict?', def: 'Edit the marked file, choose the right lines, remove markers, git add, commit.' },
        ] },
        { type: 'callout', variant: 'key', text: 'That’s the Git you’ll use daily — and the answers interviewers expect. Combined with the rest of Igloo, you’re covered from your first commit through every technical round. Up next: the Behavioral/HR finale. 🧊' },
      ],
    },
  ],
  quiz: [
    { id: 'git-m4-q1', type: 'single', prompt: 'To undo a commit that’s already been pushed/shared, use…', options: ['git reset --hard', 'git revert', 'git commit --amend', 'git stash'], correct: [1], explanation: 'revert adds a new inverse commit without rewriting shared history.' },
    { id: 'git-m4-q2', type: 'single', prompt: 'The key difference: reset vs revert is…', options: ['Identical', 'reset rewrites history (local); revert adds an inverse commit (safe for shared)', 'revert deletes the repo', 'reset is for remotes'], correct: [1], explanation: 'reset moves the pointer back (rewrites history); revert preserves history with a new commit.' },
    { id: 'git-m4-q3', type: 'single', prompt: 'git stash is used to…', options: ['Delete commits', 'Shelve uncommitted changes for a clean working directory', 'Push to origin', 'Create a branch'], correct: [1], explanation: 'stash temporarily saves uncommitted work; stash pop restores it.' },
    { id: 'git-m4-q4', type: 'single', prompt: '`git reset --hard` is dangerous because it…', options: ['Renames branches', 'Permanently discards uncommitted changes', 'Pushes automatically', 'Creates conflicts'], correct: [1], explanation: 'It throws away uncommitted work — use with care (committed work may be recoverable via reflog).' },
    { id: 'git-m4-q5', type: 'single', prompt: 'git commit --amend lets you…', options: ['Undo a merge', 'Fix the most recent commit (before pushing)', 'Create a remote', 'Stash changes'], correct: [1], explanation: 'amend rewrites the latest commit (message/contents) — only safe before it’s pushed.' },
    { id: 'git-m4-q6', type: 'single', prompt: 'When confused about Git’s current state, first run…', options: ['git reset --hard', 'git status', 'git push --force', 'rm -rf .git'], correct: [1], explanation: 'git status shows the state and usually suggests the command to fix it.' },
  ],
  resources: [
    { label: 'Oh Sh*t, Git!?! (undo guide)', url: 'https://ohshitgit.com/', kind: 'article', free: true },
    { label: 'Git cheat sheet (GitHub)', url: 'https://education.github.com/git-cheat-sheet-education.pdf', kind: 'docs', free: true },
  ],
};
