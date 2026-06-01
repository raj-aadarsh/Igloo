import type { Module } from '@/content/types';

export const m9: Module = {
  id: 'devops-m9',
  slug: 'capstone',
  order: 9,
  title: 'Capstone & Interview Recap',
  subtitle: 'The whole pipeline, end to end',
  icon: 'trophy',
  lessons: [
    {
      id: 'devops-m9-l1',
      title: 'A change’s journey to production',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Let’s connect everything into the path a single code change takes — the story that ties the whole course together:' },
        { type: 'ol', items: [
          'A developer **commits** code to Git → triggers the **CI/CD pipeline**.',
          '**CI** builds a **Docker image**, runs tests & scans; the image is pushed to a **registry** (tagged with the commit).',
          '**CD** updates the **Kubernetes** Deployment to the new image tag.',
          'Kubernetes does a **rolling update** (or canary) — zero downtime, with self-healing if a pod fails.',
          'The cluster runs on **cloud** infra (multi-AZ, auto-scaling) provisioned by **Terraform (IaC)**.',
          '**Observability** (metrics/logs/traces) watches the release; problems trigger alerts or an automatic **rollback**.',
          'Insights feed back into **Plan** — the loop continues.',
        ] },
        { type: 'widget', widget: 'devops-lifecycle' },
        { type: 'callout', variant: 'key', text: 'Every tool you learned has one job in this loop: Docker packages, CI/CD automates, Kubernetes runs & heals, Terraform provisions, Prometheus/Grafana observe. Being able to narrate this journey is a complete DevOps interview answer.' },
      ],
    },
    {
      id: 'devops-m9-l2',
      title: 'The toolchain cheat-sheet',
      minutes: 5,
      blocks: [
        { type: 'keyterms', title: 'Job → tool', terms: [
          { term: 'Version control', def: 'Git + GitHub/GitLab' },
          { term: 'CI/CD', def: 'GitHub Actions, GitLab CI, Jenkins, Argo CD' },
          { term: 'Containers', def: 'Docker (build/run), a registry (Docker Hub, ECR)' },
          { term: 'Orchestration', def: 'Kubernetes (+ Helm for packaging)' },
          { term: 'Infrastructure as Code', def: 'Terraform (provision), Ansible (configure)' },
          { term: 'Cloud', def: 'AWS / GCP / Azure (compute, storage, DB, networking)' },
          { term: 'Observability', def: 'Prometheus + Grafana (metrics), ELK/Loki (logs), Jaeger (traces)' },
        ] },
        { type: 'callout', variant: 'tip', text: 'You don’t need to master every tool — know what category each belongs to and why it exists. "Helm? That’s a package manager for Kubernetes." Categorising tools correctly is most of what interviews check.' },
      ],
    },
    {
      id: 'devops-m9-l3',
      title: 'Interview recap & practice',
      minutes: 5,
      blocks: [
        { type: 'keyterms', title: 'Answer these in one breath', terms: [
          { term: 'What is DevOps?', def: 'Culture + automation uniting Dev & Ops for fast, reliable, continuous delivery.' },
          { term: 'Container vs VM?', def: 'Container shares the host kernel (light, fast); VM runs a full guest OS (heavy, strong isolation).' },
          { term: 'Image vs container?', def: 'Image = immutable blueprint; container = running instance of it.' },
          { term: 'CI vs CD vs CD?', def: 'Integrate & test every change / always release-ready (manual go) / auto-deploy to prod.' },
          { term: 'Why Kubernetes?', def: 'Declarative desired state with self-healing, scaling, and rolling updates across a cluster.' },
          { term: 'Blue-green vs canary?', def: 'Flip all traffic between two envs (instant rollback) vs gradually shift a small % (limit blast radius).' },
          { term: 'What is IaC / idempotent?', def: 'Infra defined as version-controlled code; re-running converges to the same state.' },
          { term: 'Three pillars of observability?', def: 'Metrics, logs, traces.' },
        ] },
        { type: 'p', text: '**Practice — design the delivery pipeline for:**' },
        { type: 'ul', items: [
          'A web app: from git push → tests → image → deploy to Kubernetes with zero downtime.',
          'A risky feature rollout: which deployment strategy, and how to roll back?',
          'A spiky-traffic service: how do auto-scaling + multi-AZ keep it up?',
          'A production incident: what metrics/logs/traces and alerts would you set up?',
        ] },
        { type: 'callout', variant: 'key', text: 'That completes DevOps — and the SDE interview gauntlet. You can now take a change from commit to production, safely, automatically, and observably. Next up on the roadmap: a short Git course, then behavioral prep. 🧊' },
      ],
    },
  ],
  quiz: [
    { id: 'devops-m9-q1', type: 'single', prompt: 'In the delivery pipeline, what does CI produce that CD then deploys?', options: ['A log file', 'A built, tested artifact (e.g. a container image)', 'A dashboard', 'A VM'], correct: [1], explanation: 'CI builds & tests an artifact (often an image); CD deploys that same artifact.' },
    { id: 'devops-m9-q2', type: 'single', prompt: 'Helm is best categorised as…', options: ['A monitoring tool', 'A package manager for Kubernetes', 'A CI server', 'A cloud provider'], correct: [1], explanation: 'Helm packages/templates Kubernetes manifests — a K8s package manager.' },
    { id: 'devops-m9-q3', type: 'single', prompt: 'Which tool provisions cloud infrastructure as code?', options: ['Prometheus', 'Terraform', 'Docker', 'Grafana'], correct: [1], explanation: 'Terraform declaratively provisions infrastructure (IaC).' },
    { id: 'devops-m9-q4', type: 'single', prompt: 'Zero-downtime release of a new version on Kubernetes uses, by default, a…', options: ['Recreate', 'Rolling update', 'Manual restart', 'Full outage'], correct: [1], explanation: 'Kubernetes Deployments roll out gradually (rolling update) with no downtime.' },
    { id: 'devops-m9-q5', type: 'single', prompt: 'The DevOps loop is "continuous" because…', options: ['It never builds', 'Monitoring/insights feed back into planning the next change', 'It runs once', 'It avoids deployment'], correct: [1], explanation: 'Observability closes the loop — Monitor feeds Plan, repeatedly.' },
    { id: 'devops-m9-q6', type: 'single', prompt: 'The essence of DevOps is…', options: ['One specific tool', 'Culture + automation for fast, reliable, continuous delivery', 'Only Kubernetes', 'Avoiding operations'], correct: [1], explanation: 'DevOps is fundamentally a culture of collaboration + automation, enabled (not defined) by tools.' },
  ],
  resources: [
    { label: 'roadmap.sh — DevOps roadmap', url: 'https://roadmap.sh/devops', kind: 'article', free: true },
    { label: 'The Phoenix Project (the DevOps novel)', url: 'https://itrevolution.com/product/the-phoenix-project/', kind: 'docs', free: false },
  ],
};
