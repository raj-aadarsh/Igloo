import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'hld-m3',
  slug: 'caching-and-cdn',
  order: 3,
  title: 'Caching & CDNs',
  subtitle: 'Make reads fast & cheap',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m3-l1',
      title: 'Why & where we cache',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **cache** stores a copy of data in faster storage so future reads avoid the slow source. Since memory is ~100,000× faster than a cross-continent trip, caching is the highest-leverage performance tool you have. Play with an LRU cache:' },
        { type: 'widget', widget: 'caching-demo' },
        { type: 'keyterms', title: 'Caches live at every layer', terms: [
          { term: 'Client / browser', def: 'Local cache + HTTP cache headers avoid the request entirely.' },
          { term: 'CDN (edge)', def: 'Geographically distributed servers cache static assets near users — cutting latency and origin load.' },
          { term: 'Application cache', def: 'An in-memory store (Redis, Memcached) between app servers and the DB — the classic "cache layer".' },
          { term: 'Database cache', def: 'Query/result and buffer-pool caches inside the DB itself.' },
        ] },
        { type: 'keyterms', terms: [
          { term: 'Hit / miss', def: 'A hit serves from cache; a miss falls through to the source, then back-fills the cache.' },
          { term: 'Eviction policy', def: 'When full, decide what to drop: LRU (least-recently-used, most common), LFU (least-frequently-used), or FIFO.' },
          { term: 'TTL (time-to-live)', def: 'Auto-expire entries after a while so stale data self-heals.' },
        ] },
      ],
    },
    {
      id: 'hld-m3-l2',
      title: 'Write strategies & invalidation',
      minutes: 6,
      blocks: [
        { type: 'keyterms', title: 'How writes interact with the cache', terms: [
          { term: 'Cache-aside (lazy)', def: 'App reads cache; on miss, loads from DB and populates the cache. The most common pattern. Writes go to the DB and invalidate the cache key.' },
          { term: 'Write-through', def: 'Writes go to cache AND DB synchronously. Cache always fresh; writes are a bit slower.' },
          { term: 'Write-back (write-behind)', def: 'Write to cache, flush to DB asynchronously later. Fast writes, but risk data loss if the cache dies before flush.' },
          { term: 'Write-around', def: 'Writes skip the cache and go straight to the DB; only reads populate it. Good when written data isn’t re-read soon.' },
        ] },
        { type: 'callout', variant: 'key', text: '"There are only two hard things in CS: cache invalidation and naming things." Stale data is the price of caching. Tools to manage it: short TTLs, explicit invalidation on write, and versioned keys.' },
        { type: 'callout', variant: 'warning', text: 'Watch for the thundering herd / cache stampede: when a hot key expires, thousands of requests miss at once and slam the DB. Mitigate with request coalescing (single-flight), staggered TTLs, or refresh-ahead.' },
      ],
    },
    {
      id: 'hld-m3-l3',
      title: 'CDNs & content delivery',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'A **CDN (Content Delivery Network)** is a global mesh of edge servers that cache content close to users — essential for images, video, JS/CSS, and increasingly for API responses.' },
        { type: 'keyterms', terms: [
          { term: 'Edge server / PoP', def: 'A cache location near users; the request is served from the nearest Point of Presence instead of the distant origin.' },
          { term: 'Push vs pull CDN', def: 'Push: you upload content to the CDN ahead of time. Pull: the CDN fetches from your origin on the first request and caches it.' },
          { term: 'Origin', def: 'Your source servers. The CDN shields them from most traffic (origin offload).' },
          { term: 'Static vs dynamic', def: 'CDNs shine for static/cacheable content; dynamic, per-user data usually still hits your servers (though edge compute is blurring this).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'In a design, reach for a CDN whenever you serve media or have a global audience: it slashes latency (data is physically closer) and dramatically reduces load and bandwidth cost on your origin.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m3-q1', type: 'single', prompt: 'The most common cache eviction policy is…', options: ['FIFO', 'LRU (least-recently-used)', 'Random', 'Largest-first'], correct: [1], explanation: 'LRU evicts the least-recently-used entry and fits most access patterns.' },
    { id: 'hld-m3-q2', type: 'single', prompt: 'In cache-aside, on a cache miss the application…', options: ['Returns an error', 'Loads from the DB and populates the cache', 'Writes to the cache only', 'Skips the DB'], correct: [1], explanation: 'Cache-aside lazily loads from the DB on a miss and back-fills the cache.' },
    { id: 'hld-m3-q3', type: 'single', prompt: 'Write-back caching risks…', options: ['Slow reads', 'Data loss if the cache fails before flushing to the DB', 'Too much DB load', 'Nothing'], correct: [1], explanation: 'Write-back defers DB writes, so a cache failure can lose not-yet-flushed data.' },
    { id: 'hld-m3-q4', type: 'single', prompt: 'A CDN primarily reduces latency by…', options: ['Compressing the database', 'Serving content from edge servers near users', 'Adding more app servers', 'Using SQL'], correct: [1], explanation: 'CDNs cache content at edge PoPs physically close to users.' },
    { id: 'hld-m3-q5', type: 'single', prompt: 'A cache stampede / thundering herd happens when…', options: ['The cache is empty at boot', 'A hot key expires and many requests miss at once, hammering the DB', 'TTLs are too long', 'LRU evicts too slowly'], correct: [1], explanation: 'Simultaneous misses on a hot expired key overwhelm the origin; mitigate with coalescing/staggered TTLs.' },
    { id: 'hld-m3-q6', type: 'single', prompt: 'Write-through keeps the cache fresh by…', options: ['Never writing to the DB', 'Writing to cache and DB synchronously', 'Only caching reads', 'Expiring everything immediately'], correct: [1], explanation: 'Write-through updates cache and DB together, so the cache is always current.' },
  ],
  resources: [
    { label: 'AWS — Caching overview', url: 'https://aws.amazon.com/caching/', kind: 'article', free: true },
  ],
};
