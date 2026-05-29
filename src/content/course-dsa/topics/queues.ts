import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const queues: SubCourse = {
  id: 'queues',
  slug: 'queues',
  order: 6,
  title: 'Queues & Deques',
  subtitle: 'First-in-first-out, and the powerful monotonic deque',
  icon: 'workflow',
  badge: { name: 'Queue Captain', emoji: '🎟️' },
  learn: [
    {
      id: 'dsa-queues-l1',
      title: 'Queues & deques — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **queue** is First-In-First-Out (**FIFO**) — like a line at a counter. You add at the back and remove from the front. A **deque** ("deck", double-ended queue) lets you add/remove at **both** ends.' },
        { type: 'keyterms', title: 'Operations (all O(1))', terms: [
          { term: 'offer(x) / add', def: 'Enqueue at the back.' },
          { term: 'poll()', def: 'Dequeue (remove & return the front).' },
          { term: 'peek()', def: 'Look at the front without removing.' },
        ] },
        { type: 'h2', text: 'Where queues show up' },
        { type: 'ul', items: [
          '**BFS** (breadth-first search) on trees and graphs — the queue *is* the algorithm.',
          '**Scheduling / streaming** — process things in arrival order.',
          '**Sliding-window** problems — a **monotonic deque** gives O(1) window min/max.',
        ] },
        { type: 'callout', variant: 'key', text: 'Two reflexes: **"process in order / level by level"** → queue (think BFS). **"min or max of every window"** → a monotonic deque.' },
      ],
    },
    {
      id: 'dsa-queues-l2',
      title: 'Queues & deques in Java',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Use **`ArrayDeque`** for both queues and deques — it’s the fast, recommended choice (`LinkedList` also works but is slower).' },
        { type: 'h2', text: 'As a queue (FIFO)' },
        { type: 'code', code: `import java.util.*;

Queue<Integer> q = new ArrayDeque<>();
q.offer(1);     // enqueue at back
q.offer(2);
q.peek();       // 1   (front, no removal)
q.poll();       // 1   (dequeue front)
q.isEmpty();` },
        { type: 'h2', text: 'As a deque (both ends)' },
        { type: 'code', code: `Deque<Integer> dq = new ArrayDeque<>();
dq.addFirst(1);   dq.addLast(2);
dq.peekFirst();   // 1
dq.peekLast();    // 2
dq.pollFirst();   // remove from front
dq.pollLast();    // remove from back` },
        { type: 'callout', variant: 'tip', title: 'Same class, two roles', text: '`ArrayDeque` is a stack (push/pop), a queue (offer/poll), AND a deque. One container covers all three — handy to remember in interviews.' },
        { type: 'callout', variant: 'warning', text: '`poll()`/`peek()` return **null** on an empty queue (they don’t throw), while `remove()`/`element()` throw. Pick one style and always check `isEmpty()` when it matters.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-q-binary',
      title: 'Generate Binary Numbers 1…N',
      difficulty: 'Easy',
      tags: ['queues'],
      statement: [{ type: 'p', text: 'Print the binary representations of `1` to `N`, space-separated — generated elegantly with a **queue**.' }],
      examples: [{ input: '5', output: '1 10 11 100 101' }],
      constraints: ['1 ≤ N ≤ 10^4'],
      ioNote: 'Input: the integer N. Output: binaries of 1..N, space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '5', expected: '1 10 11 100 101' },
        { stdin: '1', expected: '1' },
        { stdin: '3', expected: '1 10 11', hidden: true },
        { stdin: '2', expected: '1 10', hidden: true },
      ],
      hints: ['Start a queue with "1".', 'Each step: dequeue s (that’s the next binary), then enqueue s+"0" and s+"1".'],
      solutions: [
        {
          label: 'Queue generation',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Queue<String> q = new ArrayDeque<>();
        q.offer("1");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            String s = q.poll();
            sb.append(s);
            if (i < n - 1) sb.append(' ');
            q.offer(s + "0");
            q.offer(s + "1");
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'The queue yields binaries in numeric order: dequeuing `s` and enqueuing `s+"0"`, `s+"1"` produces 1, 10, 11, 100, 101, … exactly. A neat demonstration of FIFO order.' }],
        },
      ],
    },
    {
      id: 'dsa-q-first-negative',
      title: 'First Negative in Every Window of Size K',
      difficulty: 'Medium',
      tags: ['queues', 'sliding-window'],
      isInterview: true,
      statement: [{ type: 'p', text: 'For each window of `k` consecutive elements, print the **first negative number** in it, or `0` if the window has none. Print all window answers space-separated.' }],
      examples: [{ input: '5\n12 -1 -7 8 -15\n3', output: '-1 -1 -7' }],
      constraints: ['1 ≤ k ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: k. Output: each window’s first negative (0 if none).',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n12 -1 -7 8 -15\n3', expected: '-1 -1 -7' },
        { stdin: '8\n-1 2 -3 4 -5 6 -7 8\n3', expected: '-1 -3 -3 -5 -5 -7' },
        { stdin: '4\n1 2 3 4\n2', expected: '0 0 0', hidden: true },
        { stdin: '3\n-1 -2 -3\n3', expected: '-1', hidden: true },
      ],
      hints: ['Keep a deque of the INDICES of negative numbers currently in the window.', 'Drop indices that fall out of the window; the front is the first negative.'],
      solutions: [
        {
          label: 'Deque of negative indices',
          bigO: 'Time O(n) · Space O(k)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int k = sc.nextInt();

        Deque<Integer> neg = new ArrayDeque<>();   // indices of negatives, in order
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            while (!neg.isEmpty() && neg.peekFirst() < i - k + 1) neg.pollFirst(); // out of window
            if (a[i] < 0) neg.addLast(i);
            if (i >= k - 1) {
                sb.append(neg.isEmpty() ? 0 : a[neg.peekFirst()]);
                if (i < n - 1) sb.append(' ');
            }
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Keep negatives’ indices in arrival order. Each step, discard any that slid out of the window; the front is the first negative still inside. Each index is added/removed once → **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-q-window-max',
      title: 'Sliding Window Maximum',
      difficulty: 'Hard',
      tags: ['queues', 'monotonic-deque', 'sliding-window'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the **maximum** of every window of `k` consecutive elements, space-separated. The famous **monotonic deque** problem.' }],
      examples: [{ input: '8\n1 3 -1 -3 5 3 6 7\n3', output: '3 3 5 5 6 7' }],
      constraints: ['1 ≤ k ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: k. Output: the max of each window, space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '8\n1 3 -1 -3 5 3 6 7\n3', expected: '3 3 5 5 6 7' },
        { stdin: '1\n5\n1', expected: '5' },
        { stdin: '4\n4 3 2 1\n2', expected: '4 3 2', hidden: true },
        { stdin: '5\n1 2 3 4 5\n2', expected: '2 3 4 5', hidden: true },
      ],
      hints: ['Keep a deque of indices whose values are in DECREASING order.', 'Pop smaller values from the back before adding; the front is always the window’s max.'],
      solutions: [
        {
          label: 'Monotonic deque',
          bigO: 'Time O(n) · Space O(k)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int k = sc.nextInt();

        Deque<Integer> dq = new ArrayDeque<>();   // indices, values decreasing front→back
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();      // out of window
            while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();    // smaller → useless
            dq.addLast(i);
            if (i >= k - 1) {
                sb.append(a[dq.peekFirst()]);
                if (i < n - 1) sb.append(' ');
            }
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [
            { type: 'p', text: 'The deque holds candidate indices with **decreasing** values, so the front is always the current window’s maximum. Any element smaller than the incoming one can never be a future max, so we drop it. Each index is pushed/popped once → **O(n)** (vs O(n·k) brute force).' },
          ],
        },
      ],
    },
    {
      id: 'dsa-q-stream-first-unique',
      title: 'First Non-Repeating Character in a Stream',
      difficulty: 'Medium',
      tags: ['queues', 'hashing'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Characters arrive one by one. After each character, output the **first non-repeating character so far**, or `#` if every character seen has repeated. Concatenate the answers into one string.' }],
      examples: [{ input: 'aabc', output: 'a#bb', explanation: "After 'a'→a; 'aa'→# ; 'aab'→b; 'aabc'→b." }],
      constraints: ['0 ≤ length ≤ 10^5', 'lowercase letters'],
      ioNote: 'Input: one line (the stream). Output: one character per input character (the running first-unique, or #).',
      starterCode: STARTER,
      tests: [
        { stdin: 'aabc', expected: 'a#bb' },
        { stdin: 'aabb', expected: 'a#b#' },
        { stdin: 'abc', expected: 'aaa', hidden: true },
        { stdin: 'zz', expected: 'z#', hidden: true },
      ],
      hints: ['Keep a count of each character AND a queue of characters in arrival order.', 'After each char, drop repeated characters from the front of the queue; the front (if any) is the answer.'],
      solutions: [
        {
          label: 'Queue + counts',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        int[] count = new int[256];
        Queue<Character> q = new ArrayDeque<>();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            count[c]++;
            q.offer(c);
            while (!q.isEmpty() && count[q.peek()] > 1) q.poll();  // drop repeats
            sb.append(q.isEmpty() ? '#' : q.peek());
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'The queue holds characters in arrival order; counts tell us which have repeated. After each new character, pop any repeated characters off the front — whatever remains at the front is the first non-repeating one. Amortised **O(n)**.' }],
        },
      ],
    },
  ],
};
