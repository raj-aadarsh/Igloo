import type { Module } from '@/content/types';

export const m7: Module = {
  id: 'devops-m7',
  slug: 'cloud-fundamentals',
  order: 7,
  title: 'Cloud Fundamentals',
  subtitle: 'IaaS, PaaS, SaaS & core services',
  icon: 'infinity',
  lessons: [
    {
      id: 'devops-m7-l1',
      title: 'The service models',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The **cloud** is renting computing resources on demand instead of owning hardware. The first thing to understand is *how much* of the stack you hand to the provider — the IaaS / PaaS / SaaS spectrum. Tap each:' },
        { type: 'widget', widget: 'cloud-models' },
        { type: 'keyterms', terms: [
          { term: 'IaaS', def: 'Infrastructure as a Service — raw VMs/storage/network (AWS EC2). You manage the OS up. Most control.' },
          { term: 'PaaS', def: 'Platform as a Service — bring code, the platform runs it (Heroku, App Engine). Less ops.' },
          { term: 'SaaS', def: 'Software as a Service — just use the app (Gmail). Zero infra.' },
          { term: 'Serverless / FaaS', def: 'Run functions on demand (AWS Lambda); no servers to manage, pay per execution, auto-scales to zero.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Cloud economics flip capex → opex: instead of buying servers up front (capital expense), you pay for what you use (operating expense), and scale elastically with demand.' },
      ],
    },
    {
      id: 'devops-m7-l2',
      title: 'Core building blocks (AWS-flavoured)',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Every cloud offers the same primitives under different names. The AWS terms double as interview vocabulary:' },
        { type: 'keyterms', terms: [
          { term: 'Compute — EC2 / Lambda', def: 'Virtual machines (EC2) or serverless functions (Lambda) to run your code.' },
          { term: 'Storage — S3 / EBS', def: 'S3 = object storage for blobs (images, backups, static sites); EBS = block storage (disks) for VMs.' },
          { term: 'Database — RDS / DynamoDB', def: 'Managed SQL (RDS) and managed NoSQL key-value (DynamoDB) — the provider handles backups, patching, replication.' },
          { term: 'Networking — VPC', def: 'A Virtual Private Cloud: your isolated network, with subnets, route tables, and security groups (firewalls).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Managed services are a big reason to use the cloud: instead of running your own database/queue/cache, you use RDS/SQS/ElastiCache and let the provider handle the hard operational parts (HA, backups, scaling).' },
      ],
    },
    {
      id: 'devops-m7-l3',
      title: 'Regions, availability & scaling',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Region', def: 'A geographic location (e.g. us-east-1). Deploy near your users for lower latency, and to meet data-residency rules.' },
          { term: 'Availability Zone (AZ)', def: 'Isolated data centers within a region. Spread across ≥2 AZs so one DC failure doesn’t take you down (high availability).' },
          { term: 'Auto-scaling', def: 'Automatically add/remove instances based on load (CPU, traffic) — pay for what you need, handle spikes gracefully.' },
          { term: 'Elastic Load Balancer', def: 'The cloud’s managed load balancer, distributing traffic across instances and AZs.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The high-availability recipe on the cloud: run across multiple Availability Zones, behind a load balancer, with auto-scaling. That’s how you survive a data-center failure and absorb traffic spikes without manual work — the cloud realisation of "no single point of failure".' },
      ],
    },
  ],
  quiz: [
    { id: 'devops-m7-q1', type: 'single', prompt: 'Renting raw VMs where you manage the OS upward is…', options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'], correct: [2], explanation: 'IaaS gives infrastructure (VMs/storage/network); you manage from the OS up.' },
    { id: 'devops-m7-q2', type: 'single', prompt: 'AWS Lambda is an example of…', options: ['IaaS', 'Serverless / FaaS', 'SaaS', 'On-prem'], correct: [1], explanation: 'Lambda runs functions on demand with no servers to manage — serverless/FaaS.' },
    { id: 'devops-m7-q3', type: 'single', prompt: 'S3 is best described as…', options: ['A SQL database', 'Object storage for blobs (images, backups, static files)', 'A load balancer', 'A VM'], correct: [1], explanation: 'S3 is object storage — ideal for large blobs and static content.' },
    { id: 'devops-m7-q4', type: 'single', prompt: 'Why deploy across multiple Availability Zones?', options: ['Lower cost', 'So one data-center failure doesn’t take you down (high availability)', 'To use less storage', 'To avoid load balancers'], correct: [1], explanation: 'AZs are isolated DCs; spanning ≥2 survives a single-DC failure.' },
    { id: 'devops-m7-q5', type: 'single', prompt: 'Cloud economics primarily shift…', options: ['Opex → capex', 'Capex → opex (pay for what you use)', 'Code → infra', 'SQL → NoSQL'], correct: [1], explanation: 'No upfront hardware purchase (capex); you pay as you go (opex) and scale elastically.' },
    { id: 'devops-m7-q6', type: 'single', prompt: 'Auto-scaling does what?', options: ['Writes your code', 'Adds/removes instances automatically based on load', 'Encrypts data', 'Replaces the database'], correct: [1], explanation: 'Auto-scaling adjusts instance count to match demand, handling spikes and saving cost.' },
  ],
  resources: [
    { label: 'AWS — overview of cloud computing', url: 'https://aws.amazon.com/what-is-cloud-computing/', kind: 'article', free: true },
  ],
};
