import type { Module } from '@/content/types';

export const m2: Module = {
  id: 'git-m2',
  slug: 'merge-vs-rebase',
  order: 2,
  title: 'Merge vs Rebase',
  subtitle: 'The classic interview question',
  icon: 'git-branch',
  lessons: [
    {
      id: 'git-m2-l1',
      title: 'Two ways to integrate changes',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'When your branch has fallen behind `main`, you have two ways to catch up: **merge** or **rebase**. They reach the same code, but shape history differently. Toggle between them:' },
        { type: 'widget', widget: 'merge-vs-rebase' },
        { type: 'keyterms', terms: [
          { term: 'Merge', def: 'Creates a merge commit that ties the branches together. Preserves true history; graph becomes non-linear.' },
          { term: 'Rebase', def: 'Replays your commits on top of the latest main, rewriting them into a clean linear history (no merge commit).' },
          { term: 'It rewrites hashes', def: 'Rebase creates new commits (new SHAs) for the replayed work — the old ones are abandoned. That’s why it’s "rewriting history".' },
        ] },
        { type: 'code', caption: 'Same goal, two commands', code: `# Merge: bring main's changes into feature (keeps a merge commit)
git switch feature
git merge main

# Rebase: replay feature on top of the latest main (linear)
git switch feature
git rebase main` },
      ],
    },
    {
      id: 'git-m2-l2',
      title: 'Which to use — and the golden rule',
      minutes: 4,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Use merge when', def: 'Integrating shared/public branches, or when you want history to show exactly what happened (true record). Safe default.' },
          { term: 'Use rebase when', def: 'Tidying up your own local commits before sharing — to get a clean, linear, easy-to-read history.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'THE golden rule of rebase: never rebase commits that you’ve already pushed/shared. Rewriting public history changes commit hashes and breaks everyone else’s clone. Rebase local work only; merge what’s already public.' },
        { type: 'callout', variant: 'key', text: 'Interview-ready answer: "Merge preserves history with a merge commit (non-linear); rebase rewrites my commits onto the target for a linear history. I rebase my local feature branch to stay current, but never rebase shared branches."' },
      ],
    },
  ],
  quiz: [
    { id: 'git-m2-q1', type: 'single', prompt: 'Merge differs from rebase in that merge…', options: ['Rewrites commit hashes', 'Creates a merge commit and keeps non-linear history', 'Always deletes branches', 'Is faster'], correct: [1], explanation: 'Merge adds a merge commit and preserves the true, branching history.' },
    { id: 'git-m2-q2', type: 'single', prompt: 'Rebase produces…', options: ['A merge commit', 'A clean linear history by replaying commits', 'A conflict every time', 'A new remote'], correct: [1], explanation: 'Rebase replays commits onto the target, yielding linear history (new commit hashes).' },
    { id: 'git-m2-q3', type: 'single', prompt: 'The golden rule of rebasing is…', options: ['Always rebase everything', 'Never rebase commits you’ve already pushed/shared', 'Rebase only main', 'Rebase before every commit'], correct: [1], explanation: 'Rewriting shared history breaks others’ clones — only rebase local, unshared work.' },
    { id: 'git-m2-q4', type: 'single', prompt: 'Rebase "rewrites history" because it…', options: ['Deletes the repo', 'Creates new commits (new SHAs) for the replayed work', 'Renames branches', 'Changes the remote URL'], correct: [1], explanation: 'Replayed commits are brand-new objects with new hashes; the originals are discarded.' },
    { id: 'git-m2-q5', type: 'single', prompt: 'A safe default for integrating a shared branch is…', options: ['Rebase', 'Merge', 'Force push', 'Delete and re-clone'], correct: [1], explanation: 'Merge is non-destructive to shared history, making it the safe default for public branches.' },
  ],
  resources: [
    { label: 'Atlassian — Merging vs Rebasing', url: 'https://www.atlassian.com/git/tutorials/merging-vs-rebasing', kind: 'article', free: true },
  ],
};
