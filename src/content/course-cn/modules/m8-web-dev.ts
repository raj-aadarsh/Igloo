import type { Module } from '@/content/types';

// Developer-focused web networking. Ordered 6 (after Application, before Security)
// so it reads as a natural extension of the application layer.
export const m8: Module = {
  id: 'cn-m8',
  slug: 'web-for-developers',
  order: 6,
  title: 'Web Networking for Developers',
  subtitle: 'The practical web bits interviewers actually ask devs',
  icon: 'message',
  lessons: [
    {
      id: 'cn-m8-l1',
      title: 'HTTP versions & REST',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'As a developer you’ll be asked less about cables and more about **how the web protocol behaves**. Start with how HTTP evolved:' },
        { type: 'keyterms', title: 'HTTP/1.1 → 2 → 3', terms: [
          { term: 'HTTP/1.1', def: 'Text-based, persistent connections, but suffers **head-of-line blocking** — one slow request stalls the others on that connection (so browsers open several connections).' },
          { term: 'HTTP/2', def: 'Binary; **multiplexes** many requests over a single connection, with header compression. Removes app-level head-of-line blocking (still over TCP).' },
          { term: 'HTTP/3 (QUIC)', def: 'Runs over **UDP** (QUIC), removing TCP’s head-of-line blocking and giving faster connection setup (handshake + TLS combined).' },
        ] },
        { type: 'h2', text: 'REST APIs' },
        { type: 'p', text: '**REST** models your API as **resources** addressed by URLs, manipulated with HTTP verbs, and is **stateless** (each request carries everything it needs).' },
        { type: 'keyterms', title: 'Safe & idempotent methods (a favourite question)', terms: [
          { term: 'Safe', def: 'No side effects — GET, HEAD. Just reads.' },
          { term: 'Idempotent', def: 'Repeating the request gives the same result — GET, PUT, DELETE. (Deleting twice = still deleted.)' },
          { term: 'Not idempotent', def: '**POST** — calling it twice usually creates two resources.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Remember: **GET = safe + idempotent**, **PUT/DELETE = idempotent (not safe)**, **POST = neither**. This is why retrying a failed POST is risky but retrying a PUT is fine.' },
      ],
    },
    {
      id: 'cn-m8-l2',
      title: 'Real-time: polling, SSE & WebSockets',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Plain HTTP is request/response — the client always asks first. For live updates (chat, notifications, dashboards) you need something better:' },
        { type: 'keyterms', terms: [
          { term: 'Short polling', def: 'Client repeatedly asks "anything new?" on a timer. Simple but wasteful and laggy.' },
          { term: 'Long polling', def: 'The server holds the request open until it has data, then responds. Fewer empty requests.' },
          { term: 'SSE (Server-Sent Events)', def: 'A one-way stream from server → client over a single HTTP connection. Great for feeds/notifications.' },
          { term: 'WebSockets', def: 'A persistent, **full-duplex** (both directions) connection upgraded from HTTP (`ws://` / `wss://`). Ideal for chat, multiplayer, live collaboration.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Rule of thumb: occasional updates → **(long) polling**; one-way live stream → **SSE**; true two-way real-time → **WebSockets**.' },
      ],
    },
    {
      id: 'cn-m8-l3',
      title: 'CORS, caching & what sits in front',
      minutes: 6,
      blocks: [
        { type: 'h2', text: 'CORS (every frontend dev hits this)' },
        { type: 'p', text: 'Browsers enforce the **same-origin policy**: a page can’t freely call a different origin (scheme+host+port). **CORS** is how a server *opts in* to cross-origin requests via response headers (e.g. `Access-Control-Allow-Origin`). For some requests the browser first sends a **preflight** `OPTIONS` to ask permission.' },
        { type: 'callout', variant: 'warning', text: 'CORS is enforced by the **browser**, not the server — and it’s about *who is allowed to read the response*. That "CORS error" means the server didn’t send the headers permitting your origin.' },
        { type: 'h2', text: 'HTTP caching' },
        { type: 'keyterms', terms: [
          { term: 'Cache-Control', def: 'Header telling caches how long a response is fresh (`max-age`), or not to cache (`no-store`).' },
          { term: 'ETag / If-None-Match', def: 'A content fingerprint; the client revalidates and the server can reply **304 Not Modified** (no body re-sent).' },
        ] },
        { type: 'h2', text: 'Infrastructure in front of your app' },
        { type: 'keyterms', terms: [
          { term: 'Load balancer', def: 'Spreads incoming requests across many servers (round-robin, least-connections) for scale & reliability.' },
          { term: 'Reverse proxy', def: 'Sits in front of servers (e.g. nginx) handling TLS, routing, caching, compression. (A forward proxy sits in front of clients instead.)' },
          { term: 'CDN', def: 'A geographically distributed cache that serves static content from a server near the user — cutting latency.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'These three (LB, reverse proxy, CDN) are where networking meets **system design** — knowing what each does is enough for most developer interviews.' },
      ],
    },
  ],
  quiz: [
    { id: 'cn-m8-q1', type: 'single', prompt: 'Which HTTP method is NOT idempotent?', options: ['GET', 'PUT', 'DELETE', 'POST'], correct: [3], explanation: 'POST typically creates a new resource each call, so repeating it isn’t idempotent (GET/PUT/DELETE are).' },
    { id: 'cn-m8-q2', type: 'single', prompt: 'The main advantage of HTTP/2 over HTTP/1.1 is…', options: ['It uses UDP', 'Multiplexing many requests over one connection', 'It removes TLS', 'It’s text-based'], correct: [1], explanation: 'HTTP/2 multiplexes streams over a single binary connection (HTTP/3 then moves to QUIC/UDP).' },
    { id: 'cn-m8-q3', type: 'single', prompt: 'For true two-way real-time communication (e.g. chat), you’d use…', options: ['Short polling', 'SSE', 'WebSockets', 'A plain GET'], correct: [2], explanation: 'WebSockets give a persistent full-duplex channel; SSE is one-way, polling is request/response.' },
    { id: 'cn-m8-q4', type: 'single', prompt: 'A "CORS error" in the browser means…', options: ['The server is down', 'The server didn’t send headers allowing your origin to read the response', 'TLS failed', 'DNS failed'], correct: [1], explanation: 'CORS is the server opting in to cross-origin reads; missing/!matching headers → the browser blocks it.' },
    { id: 'cn-m8-q5', type: 'single', prompt: 'A response with a matching ETag lets the server reply…', options: ['200 with full body', '304 Not Modified (no body)', '404', '500'], correct: [1], explanation: 'Revalidation with If-None-Match can return 304, saving re-transferring an unchanged body.' },
  ],
  resources: [
    { label: 'MDN — HTTP overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', kind: 'docs', free: true },
    { label: 'MDN — CORS', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS', kind: 'docs', free: true },
    { label: 'Cloudflare — What is HTTP/3?', url: 'https://www.cloudflare.com/learning/performance/what-is-http3/', kind: 'article', free: true },
  ],
};
