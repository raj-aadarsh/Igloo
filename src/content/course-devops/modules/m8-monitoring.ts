import type { Module } from '@/content/types';

export const m8: Module = {
  id: 'devops-m8',
  slug: 'monitoring-observability',
  order: 8,
  title: 'Monitoring & Observability',
  subtitle: 'Close the feedback loop',
  icon: 'infinity',
  lessons: [
    {
      id: 'devops-m8-l1',
      title: 'The three pillars',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Once your app is live, you need to *see* what it’s doing — that’s **observability**, the "Monitor" stage that feeds insights back into "Plan". Monitoring tells you *that* something is wrong; observability helps you understand *why*.' },
        { type: 'keyterms', title: 'Metrics · Logs · Traces', terms: [
          { term: 'Metrics', def: 'Numeric time-series — request rate, error rate, latency (p50/p95/p99), CPU/memory. Cheap to store; power dashboards & alerts.' },
          { term: 'Logs', def: 'Timestamped event records for debugging. Centralise them (you can’t SSH into 100 ephemeral containers) — e.g. the ELK/Loki stack.' },
          { term: 'Traces', def: 'Follow one request across many services (distributed tracing) to pinpoint which hop is slow or failing.' },
        ] },
        { type: 'keyterms', terms: [
          { term: 'The RED method', def: 'For each service watch Rate, Errors, Duration — a simple, powerful starting dashboard.' },
          { term: 'The USE method', def: 'For each resource watch Utilization, Saturation, Errors.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Monitoring vs observability: monitoring = predefined dashboards/alerts for known problems ("is CPU high?"); observability = enough signal (metrics+logs+traces) to ask new questions about problems you didn’t anticipate.' },
      ],
    },
    {
      id: 'devops-m8-l2',
      title: 'Tools, alerting & SLOs',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Prometheus + Grafana', def: 'Prometheus scrapes & stores metrics; Grafana visualises them on dashboards. The de-facto open-source pair.' },
          { term: 'Alerting', def: 'Rules that page a human when a metric crosses a threshold (e.g. error rate > 2% for 5 min). Alert on symptoms users feel, not every blip — avoid alert fatigue.' },
          { term: 'SLI / SLO / error budget', def: 'SLI = a measured signal (e.g. % of requests < 300 ms); SLO = the target (99.9%); the error budget is the allowed shortfall — spend it on shipping features, stop and stabilise when it’s exhausted.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'This is the SRE (Site Reliability Engineering) mindset — DevOps’ close cousin: treat reliability as a measurable feature with a budget, and automate operations ("toil") away.' },
      ],
    },
    {
      id: 'devops-m8-l3',
      title: 'Closing the loop',
      minutes: 4,
      blocks: [
        { type: 'p', text: 'Observability is what makes DevOps a *loop* rather than a line — what you learn in production flows straight back into planning the next change.' },
        { type: 'widget', widget: 'devops-lifecycle' },
        { type: 'callout', variant: 'key', text: 'Concrete examples of the feedback loop: a latency spike on a dashboard becomes next sprint’s performance ticket; a postmortem after an incident becomes an automated test or an alert; rising error budgets pause feature work to fix reliability. Monitor → Plan, continuously.' },
      ],
    },
  ],
  quiz: [
    { id: 'devops-m8-q1', type: 'single', prompt: 'The three pillars of observability are…', options: ['CPU, RAM, disk', 'Metrics, logs, traces', 'Build, test, deploy', 'SLI, SLO, SLA'], correct: [1], explanation: 'Metrics, logs, and distributed traces together explain a live system.' },
    { id: 'devops-m8-q2', type: 'single', prompt: 'Why centralise logs?', options: ['To save money', 'You can’t SSH into many ephemeral containers — aggregate them in one place', 'Logs are illegal locally', 'To avoid metrics'], correct: [1], explanation: 'Containers are ephemeral and numerous; centralised logging makes debugging possible.' },
    { id: 'devops-m8-q3', type: 'single', prompt: 'Prometheus and Grafana respectively…', options: ['Deploy and build', 'Collect/store metrics and visualise them', 'Trace and log', 'Scan and test'], correct: [1], explanation: 'Prometheus stores metrics; Grafana dashboards them.' },
    { id: 'devops-m8-q4', type: 'single', prompt: 'An error budget is…', options: ['Money for bugs', 'The allowed amount of unreliability (1 − SLO) you can "spend"', 'A type of alert', 'A log level'], correct: [1], explanation: 'The error budget is the permitted shortfall from your SLO; exhausting it pauses feature work.' },
    { id: 'devops-m8-q5', type: 'single', prompt: 'The key difference: monitoring vs observability is…', options: ['They’re identical', 'Monitoring watches known problems; observability lets you investigate unknown ones', 'Observability is just logs', 'Monitoring needs no data'], correct: [1], explanation: 'Monitoring = predefined dashboards/alerts; observability = ask new questions from rich signals.' },
    { id: 'devops-m8-q6', type: 'single', prompt: 'In the DevOps loop, monitoring feeds back into…', options: ['Build', 'Plan (the next changes)', 'Nothing', 'Test only'], correct: [1], explanation: 'Insights from Monitor flow back into Plan — making DevOps a continuous loop.' },
  ],
  resources: [
    { label: 'Google SRE Book (free)', url: 'https://sre.google/books/', kind: 'docs', free: true },
    { label: 'Prometheus — overview', url: 'https://prometheus.io/docs/introduction/overview/', kind: 'docs', free: true },
  ],
};
