import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'git-m1',
  slug: 'branching-and-merging',
  order: 1,
  title: 'Branching & Merging',
  subtitle: 'Work in parallel safely',
  icon: 'git-branch',
  lessons: [
    {
      id: 'git-m1-l1',
      title: 'Branches: cheap parallel universes',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'A **branch** is a movable pointer to a commit — a separate line of work. You branch off to build a feature or fix a bug *without touching* the stable `main` branch, then merge it back when it’s ready. Step through it:' },
        { type: 'widget', widget: 'git-branching' },
        { type: 'keyterms', terms: [
          { term: 'Branch', def: 'A lightweight, movable pointer to a commit. Creating one is instant (Git just writes a new pointer — no file copying).' },
          { term: 'HEAD', def: 'A pointer to "where you are now" — usually the tip of your current branch. Switching branches moves HEAD.' },
          { term: 'main / master', def: 'The default primary branch, conventionally the stable, deployable line of history.' },
        ] },
        { type: 'code', caption: 'Branch commands', code: `git branch feature        # create a branch
git switch feature        # switch to it (older: git checkout feature)
git switch -c feature      # create AND switch in one step
git branch                # list branches (* = current)` },
      ],
    },
    {
      id: 'git-m1-l2',
      title: 'Merging & conflicts',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Merging** brings one branch’s changes into another. If the branches changed *different* things, Git merges automatically. If they changed the *same lines*, you get a **merge conflict** to resolve by hand.' },
        { type: 'keyterms', terms: [
          { term: 'Fast-forward merge', def: 'If main hasn’t moved since you branched, Git just slides main’s pointer forward — no merge commit needed.' },
          { term: 'Three-way merge', def: 'If both branches advanced, Git creates a merge commit with two parents, combining the histories.' },
          { term: 'Merge conflict', def: 'When the same lines changed on both sides, Git can’t decide — it marks the spot and asks you to pick.' },
        ] },
        { type: 'code', caption: 'Merge & a conflict’s markers', code: `git switch main
git merge feature          # bring feature into main

# if it conflicts, the file shows:
<<<<<<< HEAD
text from main
=======
text from feature
>>>>>>> feature
# edit to the version you want, remove the markers, then:
git add file.txt && git commit` },
        { type: 'callout', variant: 'tip', text: 'Conflicts aren’t errors or bugs — they’re Git asking a human to choose. Pull/merge often (small, frequent integrations) to keep conflicts tiny.' },
      ],
    },
  ],
  quiz: [
    { id: 'git-m1-q1', type: 'single', prompt: 'A Git branch is…', options: ['A copy of all your files', 'A lightweight, movable pointer to a commit', 'A remote server', 'A backup'], correct: [1], explanation: 'A branch is just a pointer to a commit — creating one is instant and cheap.' },
    { id: 'git-m1-q2', type: 'single', prompt: 'HEAD refers to…', options: ['The first commit', 'Where you currently are (usually your current branch tip)', 'The remote', 'The newest file'], correct: [1], explanation: 'HEAD points to your current location/branch; switching branches moves it.' },
    { id: 'git-m1-q3', type: 'single', prompt: 'A merge conflict happens when…', options: ['Two branches changed the same lines', 'You create a branch', 'You push to GitHub', 'A branch is deleted'], correct: [0], explanation: 'Conflicts arise when the same lines were changed differently on both branches.' },
    { id: 'git-m1-q4', type: 'single', prompt: 'A fast-forward merge occurs when…', options: ['Both branches advanced', 'The target branch hasn’t moved since you branched (just slide the pointer)', 'There’s a conflict', 'You rebase'], correct: [1], explanation: 'If main didn’t advance, Git fast-forwards its pointer — no merge commit.' },
    { id: 'git-m1-q5', type: 'single', prompt: 'A three-way merge produces…', options: ['No commit', 'A merge commit with two parents', 'A deleted branch', 'A rebase'], correct: [1], explanation: 'When both branches moved, Git creates a merge commit joining the two histories.' },
    { id: 'git-m1-q6', type: 'single', prompt: 'Best way to keep merge conflicts small is to…', options: ['Never branch', 'Integrate (pull/merge) often in small increments', 'Avoid commits', 'Only work on main'], correct: [1], explanation: 'Frequent, small integrations keep divergence — and conflicts — tiny.' },
  ],
  resources: [
    { label: 'Atlassian — Git branching', url: 'https://www.atlassian.com/git/tutorials/using-branches', kind: 'article', free: true },
  ],
};
