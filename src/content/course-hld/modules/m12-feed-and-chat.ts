import type { Module } from '@/content/types';

export const m12: Module = {
  id: 'hld-m12',
  slug: 'case-study-feed-and-chat',
  order: 12,
  title: 'Case Studies: News Feed & Chat',
  subtitle: 'Twitter & WhatsApp',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m12-l1',
      title: 'News feed — fan-out on write vs read',
      minutes: 8,
      blocks: [
        { type: 'p', text: 'Designing a Twitter/Instagram **news feed** comes down to one famous decision: when user A posts, how does it reach their followers’ feeds? This is the **fan-out** problem.' },
        { type: 'keyterms', terms: [
          { term: 'Fan-out on write (push)', def: 'On posting, immediately write the post into every follower’s precomputed feed (in a cache). Reads are instant (feed is ready), but a post by someone with millions of followers is a huge write storm.' },
          { term: 'Fan-out on read (pull)', def: 'Store posts once; build a user’s feed on demand by pulling from everyone they follow. Cheap writes, but expensive, slow reads.' },
          { term: 'Hybrid (the real answer)', def: 'Push for normal users; for celebrities (millions of followers), pull their posts at read time and merge. Best of both — and the answer interviewers want.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The "celebrity problem" is why pure fan-out-on-write breaks: one post → tens of millions of feed writes. The hybrid model (push for most, pull for celebrities, merge at read) is the standard solution.' },
        { type: 'p', text: 'Architecturally it’s the familiar skeleton, with a precomputed feed cache:' },
        { type: 'widget', widget: 'architecture-canvas' },
      ],
    },
    {
      id: 'hld-m12-l2',
      title: 'News feed — the rest of the stack',
      minutes: 5,
      blocks: [
        { type: 'ul', items: [
          '**Write:** post → write to DB → enqueue a **fan-out job** (async via a queue) → insert post IDs into followers’ feed caches.',
          '**Read:** GET /feed → read the precomputed list of post IDs from cache → hydrate with post content (also cached) → merge in any followed celebrities’ recent posts.',
          '**Storage:** posts in a sharded store (by post ID / user ID); the social graph (who follows whom) in its own store; media in object storage + **CDN**.',
          '**Ranking:** chronological is simplest; real feeds score posts (ML) — mention it as an extension.',
        ] },
        { type: 'callout', variant: 'tip', text: 'Note how every earlier topic shows up: caching (feeds), queues (async fan-out), sharding (posts), CDN (media), eventual consistency (a new post appearing a second late is fine). Case studies are just the building blocks assembled.' },
      ],
    },
    {
      id: 'hld-m12-l3',
      title: 'Chat (WhatsApp/Messenger)',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'A chat system is a **real-time, write-heavy** problem centred on persistent connections and reliable delivery.' },
        { type: 'keyterms', terms: [
          { term: 'WebSockets', def: 'Each online client holds a persistent, two-way connection to a chat/gateway server, so messages push instantly in both directions.' },
          { term: 'Connection servers + registry', def: 'Many servers hold millions of sockets; a registry/presence service tracks which server a given user is connected to, so messages can be routed to them.' },
          { term: 'Message delivery & storage', def: 'Persist every message (durable store) for history & offline delivery. Use ACKs and statuses (sent → delivered → read). At-least-once + idempotency avoids duplicates.' },
          { term: 'Offline & push', def: 'If the recipient is offline, queue the message and deliver on reconnect, plus a mobile push notification.' },
        ] },
        { type: 'keyterms', terms: [
          { term: 'Group chat', def: 'Fan-out each message to all members’ connections (small groups → push; huge groups → more care). Same fan-out idea as feeds.' },
          { term: 'Ordering & consistency', def: 'Per-conversation ordering matters; sequence numbers / timestamps keep messages in order. Often eventually consistent across devices.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The signature chat answer: persistent WebSocket connections + a presence/registry to locate users + a durable message store for history/offline + ACKs for delivery status. Hit those four and you’ve nailed the core.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m12-q1', type: 'single', prompt: 'In "fan-out on write", a new post is…', options: ['Built on demand at read time', 'Pushed immediately into followers’ precomputed feeds', 'Never stored', 'Sent only to celebrities'], correct: [1], explanation: 'Fan-out on write pushes the post into each follower’s feed at post time (fast reads).' },
    { id: 'hld-m12-q2', type: 'single', prompt: 'The "celebrity problem" breaks pure fan-out-on-write because…', options: ['Reads are too slow', 'One post triggers tens of millions of feed writes', 'Celebrities post rarely', 'It needs SQL'], correct: [1], explanation: 'A single post by a high-follower account causes an enormous write storm.' },
    { id: 'hld-m12-q3', type: 'single', prompt: 'The standard real-world feed solution is…', options: ['Pure push', 'Pure pull', 'Hybrid: push for most, pull for celebrities, merge at read', 'No caching'], correct: [2], explanation: 'Hybrid fan-out balances write cost and read speed.' },
    { id: 'hld-m12-q4', type: 'single', prompt: 'Fan-out work on posting is best done…', options: ['Synchronously in the request', 'Asynchronously via a message queue', 'On the client', 'In the CDN'], correct: [1], explanation: 'Async fan-out via a queue keeps the post request fast and absorbs bursts.' },
    { id: 'hld-m12-q5', type: 'single', prompt: 'The core transport for real-time chat is…', options: ['Short polling', 'WebSockets (persistent, bidirectional)', 'A CDN', 'Batch jobs'], correct: [1], explanation: 'WebSockets give the persistent two-way link chat needs.' },
    { id: 'hld-m12-q6', type: 'single', prompt: 'To route a message to an online user across many connection servers, you need…', options: ['A bigger database', 'A presence/registry tracking which server holds each user’s socket', 'A CDN', 'Stronger consistency'], correct: [1], explanation: 'A presence/registry maps users → connection servers so messages can be delivered.' },
  ],
  resources: [
    { label: 'Designing a news feed (ByteByteGo)', url: 'https://bytebytego.com/', kind: 'course', free: false },
  ],
};
