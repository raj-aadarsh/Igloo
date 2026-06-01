import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'hld-m1',
  slug: 'scaling-and-load-balancing',
  order: 1,
  title: 'Scaling & Load Balancing',
  subtitle: 'Handle more without falling over',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m1-l1',
      title: 'Vertical vs horizontal scaling',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'When load grows, you have two moves. **Scale up** (vertical) — buy a bigger machine. **Scale out** (horizontal) — add more machines. Flip between them:' },
        { type: 'widget', widget: 'scaling-visualizer' },
        { type: 'keyterms', terms: [
          { term: 'Vertical scaling', def: 'More CPU/RAM on one box. Simple, but has a hard ceiling and a single point of failure (SPOF).' },
          { term: 'Horizontal scaling', def: 'More boxes behind a load balancer. Near-limitless and fault-tolerant — the foundation of web scale.' },
          { term: 'Stateless service', def: 'A server that keeps no per-client state between requests (sessions live in a shared cache/DB). Statelessness is what lets *any* node handle *any* request — a prerequisite for horizontal scaling.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The golden rule of scale-out: keep app servers stateless. Push session/state into a shared store (Redis, DB). Then you can add/remove nodes freely and any load-balancing algorithm just works.' },
      ],
    },
    {
      id: 'hld-m1-l2',
      title: 'Load balancers',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'A **load balancer (LB)** sits in front of your servers and spreads incoming requests across them — improving throughput, and rerouting away from failed nodes (high availability). Send some traffic and compare algorithms:' },
        { type: 'widget', widget: 'load-balancer-sim' },
        { type: 'keyterms', title: 'Common algorithms', terms: [
          { term: 'Round Robin', def: 'Cycle through servers in order. Simple and even for uniform requests.' },
          { term: 'Least Connections', def: 'Send to the least-busy server. Better when request costs vary widely.' },
          { term: 'IP Hash / sticky sessions', def: 'Hash the client so it always hits the same server — useful for local session affinity (but weakens with stateless design).' },
          { term: 'Weighted', def: 'Bias traffic toward more powerful servers.' },
        ] },
        { type: 'keyterms', terms: [
          { term: 'L4 vs L7 LB', def: 'Layer 4 balances by IP/port (fast, protocol-agnostic). Layer 7 understands HTTP — can route by URL/header/cookie (smarter, e.g. /images → image service).' },
          { term: 'Health checks', def: 'The LB pings servers and stops routing to unhealthy ones — this is how it delivers availability.' },
        ] },
      ],
    },
    {
      id: 'hld-m1-l3',
      title: 'Proxies & avoiding SPOFs',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Reverse proxy', def: 'Sits in front of servers (the LB is one). Handles TLS termination, compression, caching, and routing. Clients talk to it, not the servers directly.' },
          { term: 'Forward proxy', def: 'Sits in front of clients, making requests on their behalf (e.g. a corporate egress proxy). Opposite direction to a reverse proxy.' },
          { term: 'Single Point of Failure (SPOF)', def: 'Any component whose failure takes down the system. The LB itself can be a SPOF — so you run it redundantly (active-passive with failover).' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Classic interview catch: "But the load balancer is a single point of failure!" The answer: run multiple LBs in active-passive (or active-active) mode with automatic failover, fronted by DNS or a floating IP.' },
        { type: 'callout', variant: 'tip', text: 'Mental model for any tier: never one of anything on the critical path. Redundancy (≥2) + a way to fail over = high availability.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m1-q1', type: 'single', prompt: 'Adding more machines behind a load balancer is…', options: ['Vertical scaling', 'Horizontal scaling', 'Caching', 'Sharding'], correct: [1], explanation: 'More machines = scaling out = horizontal scaling.' },
    { id: 'hld-m1-q2', type: 'single', prompt: 'The prerequisite that makes horizontal scaling of app servers work is…', options: ['Bigger CPUs', 'Stateless servers (shared session store)', 'SQL databases', 'IP hashing'], correct: [1], explanation: 'Stateless servers let any node serve any request, so you can add/remove nodes freely.' },
    { id: 'hld-m1-q3', type: 'single', prompt: 'Which LB algorithm best handles requests with very uneven costs?', options: ['Round Robin', 'Least Connections', 'Random', 'IP Hash'], correct: [1], explanation: 'Least Connections routes to the least-busy server, balancing uneven workloads.' },
    { id: 'hld-m1-q4', type: 'single', prompt: 'A Layer 7 load balancer can route based on…', options: ['Only IP and port', 'HTTP details like URL path, headers, cookies', 'MAC address', 'Disk usage'], correct: [1], explanation: 'L7 understands HTTP, so it can route by path/header/cookie; L4 works at IP/port.' },
    { id: 'hld-m1-q5', type: 'single', prompt: 'How do you stop the load balancer itself being a SPOF?', options: ['Use a faster LB', 'Run redundant LBs with automatic failover', 'Remove the LB', 'Cache everything'], correct: [1], explanation: 'Redundant LBs (active-passive/active-active) with failover remove the single point of failure.' },
    { id: 'hld-m1-q6', type: 'single', prompt: 'A reverse proxy typically does NOT…', options: ['Terminate TLS', 'Route and cache', 'Make outbound requests on behalf of clients', 'Sit in front of servers'], correct: [2], explanation: 'Making requests on behalf of clients is a forward proxy; a reverse proxy fronts the servers.' },
  ],
  resources: [
    { label: 'Cloudflare — What is a load balancer?', url: 'https://www.cloudflare.com/learning/performance/what-is-load-balancing/', kind: 'article', free: true },
  ],
};
