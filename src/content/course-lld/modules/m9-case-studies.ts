import type { Module } from '@/content/types';

export const m9: Module = {
  id: 'lld-m9',
  slug: 'case-studies-state-and-concurrency',
  order: 9,
  title: 'Case Studies: State & Concurrency',
  subtitle: 'Vending Machine, BookMyShow, Splitwise',
  icon: 'drafting-compass',
  lessons: [
    {
      id: 'lld-m9-l1',
      title: 'Vending Machine — the State pattern',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'A vending machine is the textbook **State pattern** problem, because the same action behaves differently depending on what state the machine is in. Play with the idea (a media player here — identical mechanics):' },
        { type: 'widget', widget: 'state-demo' },
        { type: 'p', text: 'Model each state as a class implementing a common interface. The machine delegates every action to its current state, which also decides the *next* state:' },
        { type: 'code', caption: 'State pattern skeleton', code: `interface VendingState {
    void insertCoin(VendingMachine m, int amt);
    void selectItem(VendingMachine m, String code);
    void dispense(VendingMachine m);
}
class IdleState implements VendingState {
    public void insertCoin(VendingMachine m, int amt) {
        m.addBalance(amt);
        m.setState(new HasMoneyState());   // transition
    }
    public void selectItem(VendingMachine m, String c) { System.out.println("Insert coin first"); }
    public void dispense(VendingMachine m) { System.out.println("Nothing selected"); }
}
// HasMoneyState, DispensingState … each handles the same 3 actions differently
class VendingMachine {
    private VendingState state = new IdleState();
    void setState(VendingState s) { this.state = s; }
    void insertCoin(int amt) { state.insertCoin(this, amt); }  // delegate
}` },
        { type: 'callout', variant: 'key', text: 'Why State beats a big switch: adding a "MaintenanceState" or "SoldOutState" is a new class, and each state’s rules live in one place. No sprawling if(status==…) scattered across methods.' },
      ],
    },
    {
      id: 'lld-m9-l2',
      title: 'BookMyShow — concurrency & seat locking',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'Designing a movie-ticket system (BookMyShow) is really a **concurrency** problem: two users must never book the same seat. Entities: Movie, Show, Screen, Seat, Booking, Payment.' },
        { type: 'keyterms', terms: [
          { term: 'The core race', def: 'Two users select seat A5 for the same show at the same instant. Both see it "available" → double booking.' },
          { term: 'Seat lock', def: 'Temporarily lock selected seats (with a short TTL, e.g. 5 min) while the user pays. If payment fails/expires, release them.' },
          { term: 'Atomic confirm', def: 'Confirm the booking only if the lock is still held — done atomically (DB row lock / optimistic versioning / synchronized critical section in-memory).' },
        ] },
        { type: 'code', caption: 'Locking the critical section', code: `class ShowSeatService {
    // seat -> lock holder; guarded so check-and-set is atomic
    synchronized boolean lockSeats(Show show, List<Seat> seats, String userId) {
        for (Seat s : seats)
            if (show.status(s) != SeatStatus.AVAILABLE) return false;  // someone took it
        for (Seat s : seats) show.hold(s, userId, ttl(5));             // reserve
        return true;
    }
}` },
        { type: 'callout', variant: 'warning', text: 'The interviewer is listening for: "I’d lock the seats during checkout with a timeout, and confirm atomically." That single sentence shows you understand the real difficulty. Patterns nearby: Strategy (pricing/payment), State (booking lifecycle), Observer (notify on confirmation).' },
      ],
    },
    {
      id: 'lld-m9-l3',
      title: 'Splitwise — modelling the domain',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Splitwise (expense sharing) tests clean **domain modelling** and a touch of algorithm. Entities: User, Group, Expense, Split, Balance.' },
        { type: 'keyterms', terms: [
          { term: 'Split (Strategy)', def: 'How an expense divides: EqualSplit, ExactSplit, PercentSplit. A Strategy interface — add new split types without touching Expense.' },
          { term: 'Balance sheet', def: 'For each pair (A owes B), keep a running net amount. An expense updates the relevant balances.' },
          { term: 'Simplify debts', def: 'Optional extra: minimise the number of transactions to settle up (a greedy min-cash-flow algorithm) — a nice "how would you extend it?" answer.' },
        ] },
        { type: 'code', caption: 'Split as a Strategy', code: `interface SplitStrategy {
    Map<User, Double> split(double amount, List<User> participants, Object meta);
}
class EqualSplit implements SplitStrategy {
    public Map<User, Double> split(double amt, List<User> people, Object meta) {
        double each = amt / people.size();
        Map<User, Double> m = new HashMap<>();
        for (User u : people) m.put(u, each);
        return m;
    }
}
// ExactSplit, PercentSplit implement the same interface.` },
        { type: 'callout', variant: 'tip', text: 'Recurring theme across all three: find the *variation point* and make it a Strategy (pricing, payment, split). That instinct alone solves half of all LLD prompts.' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m9-q1', type: 'single', prompt: 'A vending machine where the same button behaves differently per mode is best modelled with…', options: ['Observer', 'State pattern', 'Builder', 'Adapter'], correct: [1], explanation: 'State encapsulates per-state behaviour and transitions, replacing status if/else.' },
    { id: 'lld-m9-q2', type: 'single', prompt: 'In the State pattern, who decides the next state?', options: ['The client', 'The current state object', 'A factory', 'The compiler'], correct: [1], explanation: 'Each state handles actions and transitions the context to the next state.' },
    { id: 'lld-m9-q3', type: 'single', prompt: 'The central challenge in designing BookMyShow is…', options: ['Sorting movies', 'Preventing double-booking of a seat (concurrency)', 'Rendering posters', 'Storing reviews'], correct: [1], explanation: 'Concurrent seat selection must be serialised via locking + atomic confirmation.' },
    { id: 'lld-m9-q4', type: 'single', prompt: 'A good seat-locking design includes…', options: ['Locking forever', 'A short TTL hold during checkout, released on failure/expiry', 'No locks', 'Locking the whole show'], correct: [1], explanation: 'Hold seats briefly during payment; release if it fails or times out.' },
    { id: 'lld-m9-q5', type: 'single', prompt: 'EqualSplit / ExactSplit / PercentSplit in Splitwise are an application of…', options: ['Strategy', 'Singleton', 'Proxy', 'Composite'], correct: [0], explanation: 'Interchangeable split algorithms behind one interface = Strategy.' },
    { id: 'lld-m9-q6', type: 'single', prompt: 'The recurring instinct across these case studies is…', options: ['Use inheritance everywhere', 'Find the variation point and make it a Strategy', 'Avoid interfaces', 'Make everything a Singleton'], correct: [1], explanation: 'Identify what varies (pricing, payment, split) and encapsulate it behind a strategy interface.' },
  ],
  resources: [
    { label: 'Awesome Low Level Design (case studies)', url: 'https://github.com/ashishps1/awesome-low-level-design', kind: 'project', free: true },
  ],
};
