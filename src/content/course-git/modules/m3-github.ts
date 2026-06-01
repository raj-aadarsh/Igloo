import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'git-m3',
  slug: 'github-collaboration',
  order: 3,
  title: 'GitHub & Collaboration',
  subtitle: 'Remotes, pull requests & forks',
  icon: 'git-branch',
  lessons: [
    {
      id: 'git-m3-l1',
      title: 'Remotes: clone, push, pull, fetch',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **remote** is a shared copy of your repo hosted somewhere (e.g. GitHub). It’s how a team syncs work. The default remote is named **origin**.' },
        { type: 'code', caption: 'The remote commands', code: `git clone <url>        # copy a remote repo to your machine (once)
git push               # upload your commits to the remote
git pull               # download + merge others' commits (fetch + merge)
git fetch              # download others' commits WITHOUT merging yet
git remote -v          # show configured remotes (origin = default)` },
        { type: 'keyterms', terms: [
          { term: 'origin', def: 'The conventional name for your main remote — set automatically when you clone.' },
          { term: 'fetch vs pull', def: 'fetch downloads new commits but leaves your branch untouched (you inspect/merge later). pull = fetch + merge in one step. A common interview question.' },
          { term: 'tracking branch', def: 'Your local branch knows which remote branch it follows (e.g. main → origin/main), so plain push/pull just work.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Always `git pull` before you start work and before you push — it keeps you in sync and surfaces conflicts early, while they’re small.' },
      ],
    },
    {
      id: 'git-m3-l2',
      title: 'The GitHub flow: branches → PR → merge',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Teams rarely commit straight to `main`. The standard **GitHub flow** routes every change through a branch and a **pull request (PR)** for review.' },
        { type: 'ol', items: [
          'Create a feature **branch** off main.',
          'Commit your work and **push** the branch to GitHub.',
          'Open a **Pull Request** — propose merging your branch into main.',
          'Teammates **review** & comment; CI runs the tests automatically.',
          'Once approved & green, **merge** the PR (often "squash & merge") — then delete the branch.',
        ] },
        { type: 'keyterms', terms: [
          { term: 'Pull Request (PR)', def: 'A request to merge your branch, with a diff, discussion, and automated checks. The unit of code review on GitHub. (GitLab calls it a Merge Request.)' },
          { term: 'Code review', def: 'Teammates read the diff and request changes before it merges — the main way teams catch bugs and share knowledge.' },
          { term: 'Squash & merge', def: 'Combine all the PR’s commits into one clean commit on main — keeps history tidy.' },
        ] },
        { type: 'callout', variant: 'key', text: 'A PR is where Git meets teamwork: branch in isolation, propose via PR, get reviewed, let CI verify, then merge. This is the everyday workflow at virtually every company.' },
      ],
    },
    {
      id: 'git-m3-l3',
      title: 'Forks & .gitignore',
      minutes: 4,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Fork', def: 'Your own server-side copy of someone else’s repo (on GitHub). Used for open-source: fork → change on your copy → open a PR back to the original. Branch = within a repo; fork = a whole separate copy.' },
          { term: '.gitignore', def: 'A file listing paths Git should NOT track — build outputs, node_modules, secrets, .env. Keeps junk and sensitive data out of the repo.' },
          { term: 'Never commit secrets', def: 'API keys/passwords in Git history are very hard to remove and may already be cloned. Use .gitignore + environment variables / secret managers.' },
        ] },
        { type: 'code', caption: 'A typical .gitignore', code: `node_modules/
dist/
.env
*.log
.DS_Store` },
        { type: 'callout', variant: 'warning', text: 'Branch vs fork — interview clarity: a branch is a line of work *inside* a repo you can push to; a fork is a *separate copy* of a repo you don’t have write access to (the open-source contribution model).' },
      ],
    },
  ],
  quiz: [
    { id: 'git-m3-q1', type: 'single', prompt: 'The default name for your main remote is…', options: ['main', 'origin', 'remote', 'github'], correct: [1], explanation: '"origin" is the conventional remote name set when you clone.' },
    { id: 'git-m3-q2', type: 'single', prompt: 'The difference between fetch and pull is…', options: ['They’re identical', 'fetch downloads without merging; pull = fetch + merge', 'pull only downloads', 'fetch uploads'], correct: [1], explanation: 'fetch retrieves commits without changing your branch; pull fetches and merges.' },
    { id: 'git-m3-q3', type: 'single', prompt: 'A Pull Request is…', options: ['A way to download code', 'A request to merge a branch, with review & automated checks', 'A type of commit', 'A remote'], correct: [1], explanation: 'A PR proposes merging your branch and is where review + CI happen.' },
    { id: 'git-m3-q4', type: 'single', prompt: 'Branch vs fork: a fork is…', options: ['A line of work inside one repo', 'A separate server-side copy of a repo (open-source model)', 'A merge commit', 'A deleted branch'], correct: [1], explanation: 'A fork is your own copy of a repo you can’t push to; a branch lives within a repo.' },
    { id: 'git-m3-q5', type: 'single', prompt: '.gitignore is used to…', options: ['Delete files', 'Tell Git which paths NOT to track (build output, secrets)', 'Ignore commits', 'Skip branches'], correct: [1], explanation: 'It lists files/paths Git should not track, like node_modules, .env, build artifacts.' },
    { id: 'git-m3-q6', type: 'single', prompt: 'You should run `git pull`…', options: ['Never', 'Before starting work and before pushing, to stay in sync', 'Only once a month', 'After deleting the repo'], correct: [1], explanation: 'Pulling regularly keeps you current and surfaces conflicts while they’re small.' },
  ],
  resources: [
    { label: 'GitHub flow', url: 'https://docs.github.com/get-started/using-github/github-flow', kind: 'docs', free: true },
  ],
};
