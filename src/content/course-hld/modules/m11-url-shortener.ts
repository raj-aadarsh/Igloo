import type { Module } from '@/content/types';

export const m11: Module = {
  id: 'hld-m11',
  slug: 'case-study-url-shortener',
  order: 11,
  title: 'Case Study: URL Shortener',
  subtitle: 'The classic warm-up design',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m11-l1',
      title: 'Requirements & estimation',
      minutes: 6,
      blocks: [
        { type: 'p', text: '"Design TinyURL/bit.ly" is the canonical first system-design question. Run the framework. **Functional**: create a short URL for a long one; redirect a short URL to the original. **Non-functional**: highly available, very low-latency redirects, short codes, read-heavy.' },
        { type: 'keyterms', title: 'Estimation (the math drives the design)', terms: [
          { term: 'Read-heavy', def: 'Reads (redirects) ≫ writes (creates) — often 100:1. → cache aggressively, optimise the read path.' },
          { term: 'Scale', def: 'Say 100M new URLs/month ≈ ~40 writes/sec; with 100:1 reads ≈ ~4,000 redirects/sec. Modest QPS, but must be fast & always up.' },
          { term: 'Storage', def: '100M/month × 5 yrs ≈ 6B records × ~500 B ≈ a few TB → fits with sharding/standard DBs.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The very first insight to state: this is overwhelmingly read-heavy, so the redirect path must be cache-first and the short code generation must be collision-free and compact.' },
      ],
    },
    {
      id: 'hld-m11-l2',
      title: 'The key design decision: generating short codes',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'The heart of the problem is mapping a long URL to a unique short code. Two main approaches:' },
        { type: 'keyterms', terms: [
          { term: 'Base62 of a counter/ID', def: 'Take a unique numeric ID and encode it in Base62 (a–z, A–Z, 0–9). 62^7 ≈ 3.5 trillion codes in 7 chars. Guaranteed unique, compact, no collisions.' },
          { term: 'Hashing (e.g. MD5) + take N chars', def: 'Hash the URL and take the first few characters. Simple, but you must handle collisions (re-hash/retry).' },
          { term: 'Distributed ID generation', def: 'To get unique IDs across many servers without a bottleneck: a key-generation service that hands out ID ranges, or Snowflake-style IDs (timestamp + machine + sequence).' },
        ] },
        { type: 'code', caption: 'The two tiny APIs', code: `POST /shorten   { "longUrl": "https://..." }  ->  { "shortUrl": "sho.rt/aZ3kPq" }
GET  /{code}    ->  301/302 redirect to the long URL` },
        { type: 'callout', variant: 'tip', text: 'Interview gold: prefer Base62-of-a-unique-ID over hashing — it’s collision-free by construction. Then the only hard part is generating unique IDs at scale without a single bottleneck (a key-gen service or Snowflake IDs).' },
      ],
    },
    {
      id: 'hld-m11-l3',
      title: 'Architecture & deep dive',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Assemble the components — and notice it’s the standard skeleton, tuned for fast reads:' },
        { type: 'widget', widget: 'architecture-canvas' },
        { type: 'ul', items: [
          '**Write path:** API gateway → service generates a unique ID → Base62 encode → store {code → longUrl} in the DB.',
          '**Read path:** GET /code → check **cache** (Redis) → hit: redirect instantly; miss: look up DB, back-fill cache, redirect.',
          '**Database:** a key-value or relational store keyed by code. A KV store (DynamoDB) fits the simple lookup and scales easily.',
          '**Cache:** the redirect path is read-heavy, so most redirects never touch the DB.',
          '**CDN / multi-region:** put redirects close to users for low latency; analytics (click counts) go through a **queue** so they don’t slow redirects.',
        ] },
        { type: 'callout', variant: 'key', text: 'Trade-offs to voice: 301 (permanent) redirects cache in browsers → fewer hits but no per-click analytics; 302 (temporary) lets you count every click. Pick based on whether analytics matter.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m11-q1', type: 'single', prompt: 'The dominant characteristic of a URL shortener is that it is…', options: ['Write-heavy', 'Read-heavy (redirects ≫ creates)', 'Compute-heavy', 'Storage-bound'], correct: [1], explanation: 'Redirects vastly outnumber creations → optimise & cache the read path.' },
    { id: 'hld-m11-q2', type: 'single', prompt: 'The collision-free way to generate short codes is…', options: ['Random letters', 'Base62-encode a unique ID', 'Take the first 3 chars of the URL', 'Use the timestamp only'], correct: [1], explanation: 'Encoding a unique ID in Base62 guarantees uniqueness with compact codes.' },
    { id: 'hld-m11-q3', type: 'single', prompt: 'Roughly how many 7-char Base62 codes are possible?', options: ['~16 million', '~3.5 trillion (62^7)', '~1000', '~62'], correct: [1], explanation: '62^7 ≈ 3.5 trillion — plenty of headroom in 7 characters.' },
    { id: 'hld-m11-q4', type: 'single', prompt: 'On the redirect path, you should first check the…', options: ['Database', 'Cache (then fall back to the DB on a miss)', 'Queue', 'CDN origin'], correct: [1], explanation: 'Cache-first keeps redirects fast and shields the DB from the read flood.' },
    { id: 'hld-m11-q5', type: 'single', prompt: 'Why might you choose a 302 over a 301 redirect?', options: ['It’s faster', 'It isn’t cached by browsers, so you can count every click (analytics)', 'It uses less storage', 'It’s more secure'], correct: [1], explanation: '302 (temporary) hits your server each time, enabling per-click analytics; 301 is cached.' },
    { id: 'hld-m11-q6', type: 'single', prompt: 'Generating unique IDs across many servers is best done with…', options: ['A single global counter (bottleneck)', 'A key-gen service handing out ranges, or Snowflake-style IDs', 'Random guessing', 'The client'], correct: [1], explanation: 'Range-allocation or Snowflake IDs avoid a single-counter bottleneck while staying unique.' },
  ],
  resources: [
    { label: 'System Design Primer — designing systems', url: 'https://github.com/donnemartin/system-design-primer#designing-a-system', kind: 'project', free: true },
  ],
};
