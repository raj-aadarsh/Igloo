import type { Module } from '@/content/types';

export const m10: Module = {
  id: 'lld-m10',
  slug: 'case-studies-rapid',
  order: 10,
  title: 'Case Studies: Rapid Designs',
  subtitle: 'Tic-Tac-Toe, Rate Limiter, Logger',
  icon: 'drafting-compass',
  lessons: [
    {
      id: 'lld-m10-l1',
      title: 'Tic-Tac-Toe (→ Chess)',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Game-design prompts test clean entity modelling and extensibility. Start small and design so the same shape scales to an N×N board — or even Chess.' },
        { type: 'keyterms', title: 'Entities', terms: [
          { term: 'Board', def: 'An N×N grid of Cells; knows how to place a mark and detect a win/draw.' },
          { term: 'Player', def: 'Has a name and a Symbol (X/O). For Chess: owns Pieces.' },
          { term: 'Game', def: 'Orchestrates turns, validates moves, asks the Board for a result. A simple state machine: IN_PROGRESS → WIN/DRAW.' },
          { term: 'Move', def: 'A (player, row, col) request — easy to validate and to log/undo (Command).' },
        ] },
        { type: 'code', caption: 'Keep win-checking pluggable', code: `interface WinningStrategy { boolean hasWon(Board b, Symbol s); }
class RowColDiagonalStrategy implements WinningStrategy { /* check rows/cols/diagonals */ }

class Game {
    private GameState state = GameState.IN_PROGRESS;
    private final WinningStrategy winCheck;
    void move(Player p, int r, int c) {
        board.place(r, c, p.symbol());
        if (winCheck.hasWon(board, p.symbol())) state = GameState.WIN;
        else if (board.isFull()) state = GameState.DRAW;
    }
}` },
        { type: 'callout', variant: 'tip', text: '"How would you extend to Chess?" → keep Board/Player/Move/Game, but replace Symbol with a Piece hierarchy (Pawn, Knight…) where each Piece owns its move-validation (polymorphism). Same skeleton, richer pieces.' },
      ],
    },
    {
      id: 'lld-m10-l2',
      title: 'Rate Limiter',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A rate limiter caps how many requests a client may make per time window. The classic ask: design it so the *algorithm* is swappable — yes, **Strategy** again.' },
        { type: 'keyterms', title: 'The algorithms (know these)', terms: [
          { term: 'Token Bucket', def: 'A bucket refills tokens at a fixed rate; each request spends one. Allows bursts up to bucket size. The most popular choice.' },
          { term: 'Leaky Bucket', def: 'Requests queue and drain at a constant rate — smooths bursts into a steady flow.' },
          { term: 'Fixed Window', def: 'Count requests per fixed interval (e.g. 100/min). Simple, but allows 2× burst at the window edge.' },
          { term: 'Sliding Window', def: 'A rolling count over the last N seconds — smoother and fairer than fixed window.' },
        ] },
        { type: 'code', caption: 'Strategy + thread-safety', code: `interface RateLimiter { boolean allowRequest(String clientId); }

class TokenBucketLimiter implements RateLimiter {
    private final int capacity; private final double refillPerSec;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    public boolean allowRequest(String clientId) {
        Bucket b = buckets.computeIfAbsent(clientId, k -> new Bucket(capacity, refillPerSec));
        synchronized (b) { b.refill(); return b.tryConsume(); }   // atomic per client
    }
}` },
        { type: 'callout', variant: 'warning', text: 'Two must-mention points: it’s shared mutable state → make per-client buckets thread-safe (ConcurrentHashMap + per-bucket lock or atomics); and in a distributed setting you’d centralise counters (e.g. Redis) — that’s the HLD bridge.' },
      ],
    },
    {
      id: 'lld-m10-l3',
      title: 'Logger framework',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Designing a logging framework is a pattern showcase. Levels: DEBUG < INFO < WARN < ERROR.' },
        { type: 'keyterms', title: 'Patterns at play', terms: [
          { term: 'Chain of Responsibility', def: 'Level handlers form a chain; each handles messages at its level and passes the rest along.' },
          { term: 'Strategy / multiple Appenders', def: 'Where logs go (console, file, network) is swappable — a LogAppender interface.' },
          { term: 'Singleton', def: 'One shared LoggerManager/config — the textbook (and debated) Singleton use.' },
          { term: 'Observer (optional)', def: 'Appenders can subscribe to log events and react independently.' },
        ] },
        { type: 'code', caption: 'Chain of Responsibility for levels', code: `abstract class LogHandler {
    protected LogHandler next;
    LogHandler setNext(LogHandler n) { this.next = n; return n; }
    void log(Level level, String msg) {
        if (canHandle(level)) write(msg);
        else if (next != null) next.log(level, msg);   // pass along
    }
    abstract boolean canHandle(Level l);
    abstract void write(String msg);
}
// InfoHandler -> WarnHandler -> ErrorHandler, wired into a chain.` },
        { type: 'callout', variant: 'key', text: 'Being able to say "levels = Chain of Responsibility, destinations = Strategy/Appenders, config = Singleton" instantly shows pattern fluency. That naming is exactly what separates a strong LLD answer.' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m10-q1', type: 'single', prompt: 'To make Tic-Tac-Toe extend cleanly to Chess, you’d replace Symbol with…', options: ['A bigger enum', 'A Piece hierarchy where each piece validates its own moves', 'More if/else', 'A Singleton board'], correct: [1], explanation: 'Polymorphic Piece subtypes own their move rules — same Game/Board skeleton.' },
    { id: 'lld-m10-q2', type: 'single', prompt: 'The most popular rate-limiting algorithm allowing controlled bursts is…', options: ['Fixed Window', 'Token Bucket', 'Leaky Bucket', 'Random drop'], correct: [1], explanation: 'Token Bucket refills tokens at a rate and permits bursts up to the bucket size.' },
    { id: 'lld-m10-q3', type: 'single', prompt: 'Making the rate-limiting algorithm swappable uses which pattern?', options: ['Strategy', 'Observer', 'Memento', 'Facade'], correct: [0], explanation: 'A RateLimiter interface with interchangeable algorithms = Strategy.' },
    { id: 'lld-m10-q4', type: 'single', prompt: 'A per-client bucket map shared across threads should be…', options: ['A plain HashMap', 'Thread-safe (ConcurrentHashMap + per-bucket sync/atomics)', 'A static int', 'Ignored', ], correct: [1], explanation: 'Shared mutable counters need thread-safety to avoid races.' },
    { id: 'lld-m10-q5', type: 'single', prompt: 'Routing a log message through INFO→WARN→ERROR handlers uses…', options: ['Chain of Responsibility', 'Builder', 'Composite', 'Bridge'], correct: [0], explanation: 'Handlers in a chain each decide to handle or pass along — Chain of Responsibility.' },
    { id: 'lld-m10-q6', type: 'single', prompt: 'Choosing where logs are written (console/file/network) is best modelled as…', options: ['Swappable Appenders (Strategy)', 'A Singleton only', 'Inheritance from Logger', 'A global variable'], correct: [0], explanation: 'Pluggable LogAppender implementations = Strategy.' },
  ],
  resources: [
    { label: 'System Design Primer — rate limiting', url: 'https://github.com/donnemartin/system-design-primer', kind: 'project', free: true },
  ],
};
