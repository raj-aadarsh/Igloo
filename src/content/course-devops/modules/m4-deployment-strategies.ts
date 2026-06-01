import type { Module } from '@/content/types';

export const m4: Module = {
  id: 'devops-m4',
  slug: 'deployment-strategies',
  order: 4,
  title: 'Deployment Strategies',
  subtitle: 'Release without downtime',
  icon: 'infinity',
  lessons: [
    {
      id: 'devops-m4-l1',
      title: 'Four ways to roll out v2',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'CD can ship constantly — but *how* you replace the running version decides whether users notice. Compare the four strategies (roll each out):' },
        { type: 'widget', widget: 'deployment-strategies' },
        { type: 'keyterms', terms: [
          { term: 'Recreate', def: 'Stop all v1, start all v2. Simple, but causes downtime. OK for dev or low-traffic internal tools.' },
          { term: 'Rolling update', def: 'Swap instances a few at a time; v1 & v2 coexist briefly. Zero downtime — Kubernetes’ default.' },
          { term: 'Blue-Green', def: 'Two full environments; test the idle one (Green/v2), then flip ALL traffic at once. Instant rollback, but 2× infra cost.' },
          { term: 'Canary', def: 'Route a small % to v2, watch metrics, then ramp up gradually. Smallest blast radius — safest for risky changes.' },
        ] },
      ],
    },
    {
      id: 'devops-m4-l2',
      title: 'Choosing & rolling back',
      minutes: 5,
      blocks: [
        { type: 'keyterms', title: 'Pick based on the trade-off', terms: [
          { term: 'Need zero downtime, cheap', def: 'Rolling update (the default).' },
          { term: 'Need instant rollback & full pre-prod testing', def: 'Blue-Green (if you can afford double infra).' },
          { term: 'Risky change / want to limit blast radius', def: 'Canary — catch problems while only a few users are exposed.' },
          { term: 'Downtime acceptable / simplest', def: 'Recreate.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Rollback is half the story: Blue-Green rolls back by flipping traffic back to Blue (instant). Canary rolls back by routing the small % back to v1. Rolling rolls back by rolling the old version forward again (slower). Always have a tested rollback plan.' },
        { type: 'callout', variant: 'tip', text: 'Related tricks worth naming: feature flags (ship code dark, switch features on for a subset at runtime) and A/B testing (route variants to measure impact) — both decouple "deploy" from "release".' },
      ],
    },
  ],
  quiz: [
    { id: 'devops-m4-q1', type: 'single', prompt: 'Which strategy causes downtime?', options: ['Rolling', 'Blue-Green', 'Recreate', 'Canary'], correct: [2], explanation: 'Recreate stops all v1 before starting v2 → a brief outage.' },
    { id: 'devops-m4-q2', type: 'single', prompt: 'Kubernetes’ default deployment strategy is…', options: ['Recreate', 'Rolling update', 'Blue-Green', 'Canary'], correct: [1], explanation: 'Rolling update replaces pods gradually with zero downtime by default.' },
    { id: 'devops-m4-q3', type: 'single', prompt: 'Blue-Green deployment’s biggest cost is…', options: ['Downtime', 'Running two full environments (≈2× infra)', 'Slow rollback', 'No testing'], correct: [1], explanation: 'You maintain two complete environments, doubling infrastructure during the switch.' },
    { id: 'devops-m4-q4', type: 'single', prompt: 'To limit the blast radius of a risky release, use…', options: ['Recreate', 'Canary', 'Big-bang', 'No deployment'], correct: [1], explanation: 'Canary exposes only a small % of users to v2 first, catching issues early.' },
    { id: 'devops-m4-q5', type: 'single', prompt: 'Blue-Green’s rollback is fast because you…', options: ['Rebuild v1', 'Flip traffic back to the still-running Blue (v1)', 'Restart everything', 'Wait for canary'], correct: [1], explanation: 'Blue (v1) is still running, so flipping traffic back is instant.' },
    { id: 'devops-m4-q6', type: 'single', prompt: 'Feature flags let you…', options: ['Replace CI/CD', 'Decouple deploy from release (toggle features on at runtime)', 'Avoid testing', 'Remove rollbacks'], correct: [1], explanation: 'Flags ship code "dark" and enable features at runtime for chosen users, separate from deployment.' },
  ],
  resources: [
    { label: 'Deployment strategies overview', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/', kind: 'docs', free: true },
  ],
};
