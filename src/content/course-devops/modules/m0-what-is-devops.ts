import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'devops-m0',
  slug: 'what-is-devops',
  order: 0,
  title: 'What is DevOps?',
  subtitle: 'Culture, automation & the loop',
  icon: 'infinity',
  lessons: [
    {
      id: 'devops-m0-l1',
      title: 'Dev + Ops = one team',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**DevOps** is a culture and set of practices that unite software **dev**elopment and IT **op**erations — so teams can ship better software *faster and more reliably*. It tears down the old wall where developers "threw code over the fence" to a separate ops team.' },
        { type: 'analogy', text: 'Old way: a chef (Dev) cooks and shoves the dish through a hatch to waiters (Ops) who’ve never seen the kitchen — when something’s wrong, they blame each other. DevOps puts them in one open kitchen, working the same loop, owning the meal end-to-end.' },
        { type: 'keyterms', terms: [
          { term: 'The core idea', def: 'Automate everything repeatable, ship in small frequent increments, and treat the people who build and run the system as one team with shared ownership.' },
          { term: 'CALMS', def: 'A popular DevOps framework: Culture, Automation, Lean, Measurement, Sharing.' },
          { term: '"You build it, you run it"', def: 'Amazon’s famous principle — the team that writes the code also operates it in production, closing the feedback loop.' },
        ] },
        { type: 'callout', variant: 'key', text: 'DevOps is more culture than tooling. The tools (Docker, Kubernetes, CI/CD) enable it, but the heart is collaboration, automation, and fast feedback.' },
      ],
    },
    {
      id: 'devops-m0-l2',
      title: 'The DevOps lifecycle',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'DevOps is drawn as an **infinity loop** — work flows continuously through eight stages, and monitoring feeds straight back into planning. Tap each stage:' },
        { type: 'widget', widget: 'devops-lifecycle' },
        { type: 'callout', variant: 'tip', text: 'The loop never stops: instead of one giant release a year, you ship tiny changes constantly, each one automatically built, tested, deployed, and watched. Smaller changes = lower risk = faster recovery when something breaks.' },
      ],
    },
    {
      id: 'devops-m0-l3',
      title: 'Why it matters: the key metrics',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'DevOps performance is measured by the **DORA metrics** — the four numbers that separate elite teams from low performers (and a favourite interview talking point).' },
        { type: 'keyterms', terms: [
          { term: 'Deployment frequency', def: 'How often you ship to production. Elite teams deploy on demand, many times a day.' },
          { term: 'Lead time for changes', def: 'How long from a commit to it running in production. Shorter = faster value delivery.' },
          { term: 'Change failure rate', def: 'What % of deployments cause a failure. Lower is better; small changes help.' },
          { term: 'MTTR (mean time to recovery)', def: 'How fast you recover from an incident. Fast rollback/automation keeps this low.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The big realization: shipping *more often* actually makes you *more* stable, not less. Small, frequent, automated changes are easy to test, easy to reason about, and easy to roll back — the opposite of rare, scary "big bang" releases.' },
      ],
    },
  ],
  quiz: [
    { id: 'devops-m0-q1', type: 'single', prompt: 'DevOps is fundamentally about…', options: ['A single tool you install', 'Uniting Dev and Ops with culture + automation for faster, reliable delivery', 'Replacing developers', 'Writing more documentation'], correct: [1], explanation: 'DevOps is a culture/practice uniting development and operations, enabled by automation.' },
    { id: 'devops-m0-q2', type: 'single', prompt: 'The DevOps lifecycle is typically drawn as…', options: ['A straight line', 'An infinity loop (continuous, with feedback)', 'A pyramid', 'A single circle of 3 steps'], correct: [1], explanation: 'The infinity loop shows continuous flow where Monitor feeds back into Plan.' },
    { id: 'devops-m0-q3', type: 'single', prompt: 'Which is NOT one of the DORA metrics?', options: ['Deployment frequency', 'Lead time for changes', 'Lines of code written', 'Mean time to recovery (MTTR)'], correct: [2], explanation: 'DORA = deployment frequency, lead time, change failure rate, MTTR. Lines of code is not a DORA metric.' },
    { id: 'devops-m0-q4', type: 'single', prompt: '"You build it, you run it" means…', options: ['Ops writes all code', 'The team that builds the software also operates it in production', 'Only run it once', 'Developers never see production'], correct: [1], explanation: 'Shared ownership: the building team also runs/operates the system, closing the feedback loop.' },
    { id: 'devops-m0-q5', type: 'single', prompt: 'Why do small, frequent deployments improve stability?', options: ['They don’t', 'Smaller changes are easier to test, reason about, and roll back', 'They skip testing', 'They avoid monitoring'], correct: [1], explanation: 'Small changes lower risk and make recovery (rollback) fast — improving both speed and stability.' },
  ],
  resources: [
    { label: 'Atlassian — What is DevOps?', url: 'https://www.atlassian.com/devops', kind: 'article', free: true },
    { label: 'DORA — DevOps metrics', url: 'https://dora.dev/', kind: 'docs', free: true },
  ],
};
