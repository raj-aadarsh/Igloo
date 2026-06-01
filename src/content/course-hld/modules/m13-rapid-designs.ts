import type { Module } from '@/content/types';

export const m13: Module = {
  id: 'hld-m13',
  slug: 'case-studies-rapid',
  order: 13,
  title: 'Case Studies: Rapid Designs',
  subtitle: 'YouTube, Uber & Typeahead',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m13-l1',
      title: 'YouTube / Netflix — video at scale',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'Video streaming is a **storage- and bandwidth-dominated**, extremely read-heavy problem. The watch path must be cheap and global.' },
        { type: 'keyterms', terms: [
          { term: 'Upload & transcoding', def: 'On upload, store the raw file, then asynchronously (via a queue) transcode into multiple resolutions/bitrates (240p…4K) and formats. Transcoding is a classic background-job/queue workload.' },
          { term: 'Object storage + CDN', def: 'Store video chunks in object storage (S3) and serve them from a CDN — the single most important decision. Most bytes never touch your origin.' },
          { term: 'Adaptive bitrate streaming', def: 'Video is split into small segments; the client switches quality based on bandwidth (HLS/DASH). Smooth playback over variable networks.' },
          { term: 'Metadata vs media', def: 'Separate the small metadata (titles, views, comments — in a DB) from the large media (in object storage/CDN). Different stores for different shapes.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The headline answer: pre-transcode to multiple bitrates (async), store chunks in object storage, and serve everything via a CDN with adaptive bitrate. That handles the scale, the global latency, and variable client networks.' },
      ],
    },
    {
      id: 'hld-m13-l2',
      title: 'Uber — location & matching',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Ride-hailing is a **real-time geospatial** problem: match a rider to nearby drivers as locations stream in constantly.' },
        { type: 'keyterms', terms: [
          { term: 'Geospatial index', def: 'To find "drivers near me" fast, index locations with a spatial scheme — a geohash or QuadTree / H3 grid — so a proximity query touches only nearby cells, not every driver.' },
          { term: 'Location updates', def: 'Millions of drivers send frequent GPS pings → a write-heavy stream. Keep current locations in an in-memory store (Redis) updated continuously; persist selectively.' },
          { term: 'Matching service', def: 'On a ride request, query the geo-index for nearby available drivers, rank them (ETA), and dispatch. Often event-driven.' },
          { term: 'Real-time transport', def: 'WebSockets / persistent connections push driver locations and trip updates to riders live.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'The key insight: never scan all drivers. A geohash/QuadTree turns "nearest drivers" into a lookup of a few grid cells — the geospatial equivalent of an index. Sharding by geographic region keeps each city’s load local.' },
      ],
    },
    {
      id: 'hld-m13-l3',
      title: 'Typeahead / search autocomplete',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Search suggestions must return in a few milliseconds as the user types — a **latency-first, read-heavy** problem.' },
        { type: 'keyterms', terms: [
          { term: 'Trie (prefix tree)', def: 'Store popular queries in a trie so any prefix maps instantly to its completions. Precompute and cache the top-K suggestions at each node.' },
          { term: 'Precompute + cache', def: 'Don’t rank on the fly — periodically compute top suggestions from query logs (offline/async) and serve the cached results. Reads stay tiny and fast.' },
          { term: 'Debounce + edge cache/CDN', def: 'Client debounces keystrokes; serve suggestions from a cache/edge close to users to hit the millisecond budget.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Pattern across all three: identify the dominant constraint (bandwidth for video, geo-proximity for Uber, latency for typeahead) and pick the one data structure / component that nails it (CDN, geo-index, trie+cache). That focus is what a strong design shows.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m13-q1', type: 'single', prompt: 'The single most important decision for serving video at scale is…', options: ['Use SQL', 'Store chunks in object storage and serve via a CDN', 'Transcode synchronously', 'Avoid caching'], correct: [1], explanation: 'Object storage + CDN delivery handles the bandwidth and global latency; origin is shielded.' },
    { id: 'hld-m13-q2', type: 'single', prompt: 'Video transcoding to multiple bitrates should be done…', options: ['Synchronously during upload response', 'Asynchronously as background jobs (via a queue)', 'On the client', 'In the database'], correct: [1], explanation: 'Transcoding is slow and bursty — a classic async/queue workload.' },
    { id: 'hld-m13-q3', type: 'single', prompt: 'To find nearby drivers efficiently you use…', options: ['A full scan of all drivers', 'A geospatial index (geohash / QuadTree / H3)', 'A relational JOIN', 'A Bloom filter'], correct: [1], explanation: 'Spatial indexing limits proximity queries to nearby cells instead of all drivers.' },
    { id: 'hld-m13-q4', type: 'single', prompt: 'Frequent driver GPS pings are best kept in…', options: ['A cold archive', 'An in-memory store (e.g. Redis), updated continuously', 'Object storage', 'A CDN'], correct: [1], explanation: 'Current locations are hot, fast-changing data — keep them in memory.' },
    { id: 'hld-m13-q5', type: 'single', prompt: 'The data structure behind search autocomplete is typically a…', options: ['Hash table only', 'Trie (prefix tree) with cached top-K completions', 'B-tree of users', 'Linked list'], correct: [1], explanation: 'A trie maps prefixes to completions; top-K suggestions are precomputed & cached.' },
    { id: 'hld-m13-q6', type: 'single', prompt: 'Autocomplete suggestions should be ranked…', options: ['On the fly for every keystroke', 'Precomputed offline from query logs and cached', 'By the client', 'Randomly'], correct: [1], explanation: 'Precompute popularity offline and serve cached results to meet the millisecond budget.' },
  ],
  resources: [
    { label: 'System Design Primer — examples', url: 'https://github.com/donnemartin/system-design-primer', kind: 'project', free: true },
  ],
};
