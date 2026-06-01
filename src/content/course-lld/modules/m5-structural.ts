import type { Module } from '@/content/types';

export const m5: Module = {
  id: 'lld-m5',
  slug: 'structural-patterns',
  order: 5,
  title: 'Structural Patterns',
  subtitle: 'Adapter, Decorator, Facade & more',
  icon: 'boxes',
  lessons: [
    {
      id: 'lld-m5-l1',
      title: 'Adapter, Facade & Proxy',
      minutes: 7,
      blocks: [
        { type: 'p', text: '**Structural patterns** are about composing classes and objects into larger structures while keeping them flexible. The three you’ll cite most:' },
        { type: 'keyterms', terms: [
          { term: 'Adapter', def: 'Wraps an incompatible interface so it fits the one your code expects. The "travel plug adapter." Great for legacy/3rd-party integration.' },
          { term: 'Facade', def: 'A single, simplified entry point over a complex subsystem. Hides messy internals (e.g. one convert() over codecs, muxers, filters).' },
          { term: 'Proxy', def: 'A stand-in with the SAME interface that controls access — for lazy loading (virtual), permissions (protection), caching, or remote calls.' },
        ] },
        { type: 'code', caption: 'Adapter vs Facade vs Proxy — same surface, different intent', code: `// Adapter: change an interface to match what we need
class JsonLogger implements Logger { JsonLogger(LegacyXmlLogger x){...} }

// Facade: simplify many calls into one
class VideoConverter { File convert(File f, String fmt){ /* hides codecs */ } }

// Proxy: same interface as the real thing, adds control
class ImageProxy implements Image {     // loads the heavy image only on first draw()
    public void draw(){ if (real==null) real=new RealImage(path); real.draw(); }
}` },
        { type: 'callout', variant: 'tip', text: 'Adapter vs Facade is a classic question: Adapter changes ONE interface to a different expected one; Facade invents a NEW simple interface over MANY classes. Proxy keeps the SAME interface but controls access.' },
      ],
    },
    {
      id: 'lld-m5-l2',
      title: 'Decorator — composition superpower',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Decorator** adds behaviour by *wrapping* an object in another object that shares its interface. It’s composition-over-inheritance made into a pattern — stack features at runtime instead of exploding subclasses.' },
        { type: 'code', caption: 'Wrap, don’t subclass', code: `Coffee order = new Sugar(new Milk(new Plain()));
order.cost();   // 100 + 20 + 10 = 130 — each layer adds to the inner` },
        { type: 'callout', variant: 'key', text: 'You’ve seen this idea twice now (composition-over-inheritance, and the coffee example). Java’s own java.io is Decorators: new BufferedReader(new InputStreamReader(System.in)). Recognising that in an interview is a great signal.' },
        { type: 'p', text: 'Run the Decorator (and Adapter/Facade-style) code — pick "Decorator" in the playground:' },
        { type: 'widget', widget: 'lld-playground' },
      ],
    },
    {
      id: 'lld-m5-l3',
      title: 'Composite, Bridge & Flyweight',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Composite', def: 'Treat a single object and a group of objects uniformly through a common interface — perfect for tree structures (files/folders, UI components, org charts).' },
          { term: 'Bridge', def: 'Separate an abstraction from its implementation so the two can vary independently — avoids a class explosion when you have two dimensions of change (e.g. Shape × Renderer).' },
          { term: 'Flyweight', def: 'Share immutable, fine-grained objects to save memory when you have huge numbers of similar ones (text glyphs, game-map tiles, particles).' },
        ] },
        { type: 'code', caption: 'Composite: leaves and groups share one interface', code: `interface FileNode { int size(); }
class TextFile implements FileNode { public int size(){ return bytes; } }
class Folder implements FileNode {                 // a group...
    List<FileNode> children = new ArrayList<>();
    public int size(){                             // ...treated like a leaf
        int t = 0; for (FileNode c : children) t += c.size(); return t;
    }
}` },
        { type: 'callout', variant: 'tip', text: 'Composite shows up in case studies constantly (file systems, menus, the "design a JSON structure" prompt). If you see a part-whole tree, reach for Composite.' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m5-q1', type: 'single', prompt: 'Which pattern makes an incompatible interface usable?', options: ['Facade', 'Adapter', 'Proxy', 'Composite'], correct: [1], explanation: 'Adapter wraps a class to convert its interface into the one clients expect.' },
    { id: 'lld-m5-q2', type: 'single', prompt: 'A single simplified entry point over a complex subsystem is a…', options: ['Facade', 'Adapter', 'Bridge', 'Flyweight'], correct: [0], explanation: 'Facade provides one friendly interface hiding many subsystem classes.' },
    { id: 'lld-m5-q3', type: 'single', prompt: 'Decorator adds behaviour by…', options: ['Subclassing deeply', 'Wrapping an object that shares its interface', 'Cloning it', 'A global instance'], correct: [1], explanation: 'It wraps the object, delegating and adding behaviour — composition over inheritance.' },
    { id: 'lld-m5-q4', type: 'single', prompt: 'java.io’s new BufferedReader(new InputStreamReader(...)) is an example of…', options: ['Singleton', 'Decorator', 'Observer', 'Factory'], correct: [1], explanation: 'Streams wrap each other — the Decorator pattern.' },
    { id: 'lld-m5-q5', type: 'single', prompt: 'A part-whole tree where leaves and groups share one interface is…', options: ['Composite', 'Bridge', 'Proxy', 'Adapter'], correct: [0], explanation: 'Composite lets clients treat individual objects and compositions uniformly.' },
    { id: 'lld-m5-q6', type: 'single', prompt: 'A Proxy and the real object share…', options: ['Nothing', 'The same interface (the proxy controls access)', 'The same data only', 'A parent class only'], correct: [1], explanation: 'A proxy implements the same interface and controls access (lazy load, auth, cache, remote).' },
  ],
  resources: [
    { label: 'Refactoring.Guru — Structural patterns', url: 'https://refactoring.guru/design-patterns/structural-patterns', kind: 'article', free: true },
  ],
};
