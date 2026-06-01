import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'git-m0',
  slug: 'git-basics',
  order: 0,
  title: 'Git Basics',
  subtitle: 'Commits & the three areas',
  icon: 'git-branch',
  lessons: [
    {
      id: 'git-m0-l1',
      title: 'What Git is (and why)',
      minutes: 4,
      blocks: [
        { type: 'p', text: '**Git** is a *version control system* — it records snapshots of your project over time, so you can see history, undo mistakes, and collaborate without overwriting each other. It’s distributed: every developer has the full history locally.' },
        { type: 'analogy', text: 'Think of Git as an unlimited "save game" for code — checkpoint anytime, branch off to try something risky, and if it goes wrong, reload an earlier save. Nothing is ever truly lost.' },
        { type: 'keyterms', terms: [
          { term: 'Repository (repo)', def: 'A project folder Git is tracking — including its entire history, stored in a hidden .git directory.' },
          { term: 'Commit', def: 'A saved snapshot of your project at a point in time, with a message, author, and a pointer to its parent commit.' },
          { term: 'Git vs GitHub', def: 'Git is the tool (runs on your machine). GitHub is a website that hosts Git repos online for sharing & collaboration. (Also GitLab, Bitbucket.)' },
        ] },
        { type: 'callout', variant: 'key', text: 'Common interview catch: Git ≠ GitHub. Git is the version-control software; GitHub is a hosting platform built around it. You can use Git with no GitHub at all.' },
      ],
    },
    {
      id: 'git-m0-l2',
      title: 'The three areas & the core flow',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Almost all of daily Git is moving a change through three areas. Click through it:' },
        { type: 'widget', widget: 'git-areas' },
        { type: 'keyterms', terms: [
          { term: 'Working directory', def: 'Your actual files, where you make edits.' },
          { term: 'Staging area (index)', def: 'A holding area for the exact changes you want in your next commit — lets you commit some changes but not others.' },
          { term: 'Repository (.git)', def: 'Where committed snapshots live permanently as history.' },
        ] },
        { type: 'code', caption: 'The everyday loop', code: `git init               # start tracking a project (once)
git status             # what's changed / staged?
git add file.txt       # stage a change (or: git add .)
git commit -m "msg"    # record it in history
git log --oneline      # view the commit history` },
        { type: 'callout', variant: 'tip', text: 'Write good commit messages in the imperative ("Add login validation", not "added stuff"). Future-you and your teammates read them constantly.' },
      ],
    },
  ],
  quiz: [
    { id: 'git-m0-q1', type: 'single', prompt: 'Git and GitHub are…', options: ['The same thing', 'Git is the version-control tool; GitHub hosts repos online', 'GitHub is the tool; Git is the website', 'Both websites'], correct: [1], explanation: 'Git is the software; GitHub is a hosting platform built around Git.' },
    { id: 'git-m0-q2', type: 'single', prompt: 'A commit is…', options: ['A branch', 'A saved snapshot with a message and a parent pointer', 'A remote server', 'A merge'], correct: [1], explanation: 'A commit records a snapshot of the project plus metadata and a link to its parent.' },
    { id: 'git-m0-q3', type: 'single', prompt: 'What does `git add` do?', options: ['Creates a repo', 'Stages changes for the next commit', 'Pushes to GitHub', 'Deletes files'], correct: [1], explanation: 'git add moves changes into the staging area, ready to be committed.' },
    { id: 'git-m0-q4', type: 'single', prompt: 'The purpose of the staging area is to…', options: ['Back up files', 'Choose exactly which changes go into the next commit', 'Connect to GitHub', 'Run tests'], correct: [1], explanation: 'Staging lets you craft a commit from a precise subset of your changes.' },
    { id: 'git-m0-q5', type: 'single', prompt: 'Why is Git called "distributed"?', options: ['It needs the internet', 'Every clone has the full project history locally', 'It splits files across servers', 'Only the server has history'], correct: [1], explanation: 'Each developer holds the entire history, so most operations are local and offline.' },
  ],
  resources: [
    { label: 'Pro Git book (free)', url: 'https://git-scm.com/book/en/v2', kind: 'docs', free: true },
  ],
};
