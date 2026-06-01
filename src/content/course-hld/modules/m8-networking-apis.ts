import type { Module } from '@/content/types';

export const m8: Module = {
  id: 'hld-m8',
  slug: 'networking-and-apis',
  order: 8,
  title: 'Networking, APIs & Gateways',
  subtitle: 'How clients talk to your system',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m8-l1',
      title: 'API styles: REST, gRPC, GraphQL',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The **API** is the contract between clients and your system. Three styles dominate — know when each shines.' },
        { type: 'keyterms', terms: [
          { term: 'REST', def: 'Resources over HTTP with verbs (GET/POST/PUT/DELETE) and JSON. Simple, cacheable, universal — the default for public APIs.' },
          { term: 'gRPC', def: 'Binary (Protocol Buffers) over HTTP/2. Fast, strongly-typed, supports streaming — great for internal service-to-service calls.' },
          { term: 'GraphQL', def: 'Clients request exactly the fields they need in one query — avoids over/under-fetching. Great for varied mobile/UI needs; harder to cache.' },
          { term: 'Idempotency (HTTP)', def: 'GET/PUT/DELETE are idempotent (repeat-safe); POST is not. Use an idempotency key for safe retries of writes.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Rule of thumb: REST for public/external APIs, gRPC between internal microservices (speed + typing), GraphQL when diverse clients need flexible, precise queries.' },
      ],
    },
    {
      id: 'hld-m8-l2',
      title: 'The API gateway & rate limiting',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'In a microservices system, clients shouldn’t call dozens of services directly. An **API gateway** is the single front door.' },
        { type: 'keyterms', terms: [
          { term: 'API gateway', def: 'A reverse proxy that routes requests to services and centralises cross-cutting concerns: auth, rate limiting, TLS, request aggregation, logging.' },
          { term: 'Rate limiting', def: 'Cap requests per client to prevent abuse & overload (token bucket / sliding window — recall the LLD rate limiter). Usually enforced at the gateway.' },
          { term: 'Authentication / authorization', def: 'Verify identity (often JWT/OAuth) once at the gateway, then pass trusted context downstream.' },
          { term: 'Service discovery', def: 'Services register themselves; the gateway/clients look up healthy instances dynamically (since IPs change as nodes scale).' },
        ] },
        { type: 'callout', variant: 'key', text: 'The gateway keeps individual services simple — they don’t each re-implement auth, throttling, and TLS. But run it redundantly: like the load balancer, the gateway must not be a single point of failure.' },
      ],
    },
    {
      id: 'hld-m8-l3',
      title: 'Real-time: polling, SSE & WebSockets',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'HTTP is request/response — the client must ask. For *push* (chat, live scores, notifications) you need a real-time technique.' },
        { type: 'keyterms', terms: [
          { term: 'Short polling', def: 'Client asks "anything new?" on a timer. Simple but wasteful and laggy.' },
          { term: 'Long polling', def: 'Server holds the request open until it has data, then responds. Less waste; near-real-time over plain HTTP.' },
          { term: 'Server-Sent Events (SSE)', def: 'A one-way server→client stream over HTTP. Great for feeds/notifications.' },
          { term: 'WebSockets', def: 'A persistent, full-duplex (two-way) connection. The go-to for chat, multiplayer, collaborative editing.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Pick by need: notifications/live feed → SSE or long polling; true two-way chat/games → WebSockets. Mention that persistent connections complicate load balancing (sticky/stateful) and capacity (each open socket is memory).' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m8-q1', type: 'single', prompt: 'For fast, strongly-typed internal service-to-service calls, the best fit is…', options: ['REST', 'gRPC', 'GraphQL', 'SOAP'], correct: [1], explanation: 'gRPC (Protobuf over HTTP/2) is fast, typed, and supports streaming — ideal internally.' },
    { id: 'hld-m8-q2', type: 'single', prompt: 'GraphQL’s main advantage is…', options: ['Easiest caching', 'Clients fetch exactly the fields they need (no over/under-fetching)', 'Binary speed', 'No schema'], correct: [1], explanation: 'GraphQL lets clients request precise field sets in one query.' },
    { id: 'hld-m8-q3', type: 'single', prompt: 'An API gateway typically centralises…', options: ['Database storage', 'Auth, rate limiting, routing, TLS', 'Disk scheduling', 'Caching only'], correct: [1], explanation: 'The gateway handles cross-cutting concerns so services stay simple.' },
    { id: 'hld-m8-q4', type: 'single', prompt: 'Which provides a full-duplex, two-way connection?', options: ['Short polling', 'Long polling', 'Server-Sent Events', 'WebSockets'], correct: [3], explanation: 'WebSockets are persistent and bidirectional — ideal for chat/games.' },
    { id: 'hld-m8-q5', type: 'single', prompt: 'Service discovery exists because…', options: ['IPs are static', 'Service instances come and go as the system scales, so addresses change', 'DNS is unreliable', 'Gateways are slow'], correct: [1], explanation: 'Dynamic scaling means instances/IPs change; discovery finds healthy ones at runtime.' },
    { id: 'hld-m8-q6', type: 'single', prompt: 'Server-Sent Events (SSE) are best described as…', options: ['Two-way streaming', 'A one-way server→client stream over HTTP', 'A database protocol', 'A caching layer'], correct: [1], explanation: 'SSE pushes a one-way stream from server to client — good for feeds/notifications.' },
  ],
  resources: [
    { label: 'REST vs gRPC vs GraphQL', url: 'https://www.baeldung.com/rest-vs-grpc', kind: 'article', free: true },
  ],
};
