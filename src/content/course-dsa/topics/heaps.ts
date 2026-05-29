import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const heaps: SubCourse = {
  id: 'heaps',
  slug: 'heaps',
  order: 12,
  title: 'Heaps / Priority Queue',
  subtitle: 'Always grab the smallest (or largest) in O(log n)',
  icon: 'layers',
  badge: { name: 'Heap Hotshot', emoji: '⛰️' },
  learn: [
    {
      id: 'dsa-heap-l1',
      title: 'Heaps — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **heap** is a tree (stored compactly in an array) that always keeps the **smallest** element (min-heap) or **largest** (max-heap) at the top. A **priority queue** is the abstract idea; a heap is how it’s implemented.' },
        { type: 'keyterms', title: 'Costs', terms: [
          { term: 'peek (top)', def: '**O(1)** — see the min/max instantly.' },
          { term: 'insert (offer)', def: '**O(log n)** — bubble the new value up.' },
          { term: 'extract (poll)', def: '**O(log n)** — remove top, sift down.' },
          { term: 'build from n items', def: '**O(n)** — heapify all at once.' },
        ] },
        { type: 'h2', text: 'Where heaps win' },
        { type: 'ul', items: [
          '**Top-K / Kth largest** — keep a heap of size k instead of sorting everything.',
          '**"Always process the best next"** — scheduling, Dijkstra’s & Prim’s algorithms.',
          '**Streaming** — running median, merging k sorted sources.',
        ] },
        { type: 'callout', variant: 'key', text: 'The signature trick: for the **k largest**, keep a **min-heap of size k** — the smallest of your "best k" sits on top, ready to be evicted when something bigger arrives. (For k smallest, use a max-heap of size k.) That’s O(n log k), better than sorting’s O(n log n).' },
      ],
    },
    {
      id: 'dsa-heap-l2',
      title: 'PriorityQueue in Java',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Java’s `PriorityQueue` is a **min-heap by default**.' },
        { type: 'code', code: `import java.util.*;

PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(5); minHeap.offer(1); minHeap.offer(3);
minHeap.peek();   // 1  (smallest, no removal)
minHeap.poll();   // 1  (remove smallest)` },
        { type: 'h2', text: 'Max-heap & custom order' },
        { type: 'code', code: `// Max-heap: reverse the natural order
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

// Heap of arrays/objects, ordered by a field (e.g. {value, freq} by freq):
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));` },
        { type: 'h2', text: 'The size-k heap pattern (top-K)' },
        { type: 'code', code: `// Keep only the k largest using a MIN-heap of size k:
PriorityQueue<Integer> heap = new PriorityQueue<>();
for (int x : nums) {
    heap.offer(x);
    if (heap.size() > k) heap.poll();   // drop the smallest → keep k largest
}
// heap.peek() is now the k-th largest` },
        { type: 'callout', variant: 'warning', text: 'A `PriorityQueue` is **not** sorted when you iterate it — only `poll()` returns elements in priority order. Don’t loop over it expecting sorted output; poll repeatedly instead.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-heap-k-largest',
      title: 'K Largest Elements',
      difficulty: 'Easy',
      tags: ['heap'],
      statement: [{ type: 'p', text: 'Print the **k largest** elements in **descending** order, space-separated.' }],
      examples: [{ input: '6\n3 2 1 5 6 4\n2', output: '6 5' }],
      constraints: ['1 ≤ k ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: k. Output: the k largest, descending.',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n3 2 1 5 6 4\n2', expected: '6 5' },
        { stdin: '5\n1 2 3 4 5\n3', expected: '5 4 3' },
        { stdin: '1\n7\n1', expected: '7', hidden: true },
        { stdin: '4\n4 4 4 4\n2', expected: '4 4', hidden: true },
      ],
      hints: ['Keep a min-heap of size k (the running k largest).', 'Poll them out (ascending) and reverse to get descending order.'],
      solutions: [
        {
          label: 'Min-heap of size k',
          bigO: 'Time O(n log k) · Space O(k)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int k = sc.nextInt();

        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int x : a) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();
        }
        int[] res = new int[heap.size()];
        for (int i = res.length - 1; i >= 0; i--) res[i] = heap.poll();   // ascending → reverse

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) { sb.append(res[i]); if (i < res.length - 1) sb.append(' '); }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'A size-k min-heap always holds the current k largest (its top is the weakest of them, evicted when beaten). Polling yields them ascending, so we fill the answer array back-to-front for descending order. **O(n log k)**.' }],
        },
      ],
    },
    {
      id: 'dsa-heap-kth-largest',
      title: 'Kth Largest Element (heap)',
      difficulty: 'Medium',
      tags: ['heap'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the **k-th largest** value using a heap — without sorting the whole array.' }],
      examples: [{ input: '6\n3 2 1 5 6 4\n2', output: '5' }],
      constraints: ['1 ≤ k ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: k. Output: the k-th largest value.',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n3 2 1 5 6 4\n2', expected: '5' },
        { stdin: '5\n3 2 3 1 2\n4', expected: '2' },
        { stdin: '1\n5\n1', expected: '5', hidden: true },
        { stdin: '5\n7 6 5 4 3\n5', expected: '3', hidden: true },
      ],
      hints: ['Maintain a min-heap of size k.', 'After processing all numbers, the heap’s top is the k-th largest.'],
      solutions: [
        {
          label: 'Min-heap of size k',
          bigO: 'Time O(n log k) · Space O(k)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int k = sc.nextInt();

        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int x : a) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();
        }
        System.out.println(heap.peek());
    }
}`,
          explanation: [{ type: 'p', text: 'Keep only the k largest seen so far in a min-heap; its smallest member (the top) is exactly the k-th largest overall. **O(n log k)** — cheaper than sorting when k ≪ n.' }],
        },
      ],
    },
    {
      id: 'dsa-heap-last-stone',
      title: 'Last Stone Weight',
      difficulty: 'Medium',
      tags: ['heap'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Repeatedly smash the **two heaviest** stones: if equal, both shatter; otherwise the lighter is destroyed and the heavier loses the lighter’s weight. Print the weight of the last remaining stone, or `0` if none remain.' }],
      examples: [{ input: '6\n2 7 4 1 8 1', output: '1' }],
      constraints: ['1 ≤ n ≤ 10^4'],
      ioNote: 'Line 1: n. Line 2: n stone weights. Output: the final stone weight (0 if none).',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n2 7 4 1 8 1', expected: '1' },
        { stdin: '1\n5', expected: '5' },
        { stdin: '2\n3 3', expected: '0', hidden: true },
        { stdin: '3\n1 1 1', expected: '1', hidden: true },
      ],
      hints: ['A max-heap gives you the two heaviest instantly.', 'Pop two; if they differ, push the difference back. Repeat until ≤ 1 stone remains.'],
      solutions: [
        {
          label: 'Max-heap simulation',
          bigO: 'Time O(n log n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        PriorityQueue<Integer> max = new PriorityQueue<>(Collections.reverseOrder());
        for (int i = 0; i < n; i++) max.offer(sc.nextInt());

        while (max.size() > 1) {
            int a = max.poll(), b = max.poll();   // two heaviest
            if (a != b) max.offer(a - b);
        }
        System.out.println(max.isEmpty() ? 0 : max.peek());
    }
}`,
          explanation: [{ type: 'p', text: 'A max-heap makes "grab the two heaviest" an O(log n) operation. Simulate the smashes; each removes at least one stone, so it ends quickly. **O(n log n)** overall.' }],
        },
      ],
    },
    {
      id: 'dsa-heap-connect-ropes',
      title: 'Minimum Cost to Connect Ropes',
      difficulty: 'Medium',
      tags: ['heap', 'greedy'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Connecting two ropes of lengths a and b costs `a + b`. Connect all ropes into one and print the **minimum total cost**.' }],
      examples: [{ input: '4\n4 3 2 6', output: '29' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n rope lengths. Output: the minimum total connection cost.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n4 3 2 6', expected: '29' },
        { stdin: '3\n1 2 3', expected: '9' },
        { stdin: '1\n5', expected: '0', hidden: true },
        { stdin: '2\n1 8', expected: '9', hidden: true },
      ],
      hints: ['Greedy: always join the two SHORTEST ropes first — a min-heap gives them in O(log n).', 'Add their sum to the cost and push it back as a new rope. Use long for the total.'],
      solutions: [
        {
          label: 'Greedy with a min-heap',
          bigO: 'Time O(n log n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        PriorityQueue<Long> pq = new PriorityQueue<>();
        for (int i = 0; i < n; i++) pq.offer(sc.nextLong());

        long cost = 0;
        while (pq.size() > 1) {
            long a = pq.poll(), b = pq.poll();   // two shortest
            cost += a + b;
            pq.offer(a + b);
        }
        System.out.println(cost);
    }
}`,
          explanation: [{ type: 'p', text: 'Joining the two **shortest** ropes first keeps the big sums from being re-added many times (this is exactly Huffman coding’s idea). A min-heap supplies the two smallest each step. **O(n log n)**; one rope means cost 0.' }],
        },
      ],
    },
    {
      id: 'dsa-heap-merge-k',
      title: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      tags: ['heap'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Merge `k` sorted lists into one sorted sequence and print it, space-separated. A min-heap keeps it efficient.' }],
      examples: [{ input: '3\n3 1 4 7\n3 2 5 8\n2 3 6', output: '1 2 3 4 5 6 7 8' }],
      constraints: ['1 ≤ k', 'total elements ≤ 10^5'],
      ioNote: 'Line 1: k. Then k lists, each: a count followed by that many sorted values. Output: the fully merged sorted sequence.',
      starterCode: STARTER,
      tests: [
        { stdin: '3\n3 1 4 7\n3 2 5 8\n2 3 6', expected: '1 2 3 4 5 6 7 8' },
        { stdin: '2\n2 1 3\n2 2 4', expected: '1 2 3 4' },
        { stdin: '1\n3 5 6 7', expected: '5 6 7', hidden: true },
        { stdin: '2\n0\n3 1 2 3', expected: '1 2 3', hidden: true },
      ],
      hints: ['Put the first element of each list into a min-heap (track which list + index it came from).', 'Poll the smallest, output it, then push the next element from that same list.'],
      solutions: [
        {
          label: 'Min-heap of list heads',
          bigO: 'Time O(N log k) · Space O(k)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt();
        int[][] lists = new int[k][];
        for (int i = 0; i < k; i++) {
            int len = sc.nextInt();
            lists[i] = new int[len];
            for (int j = 0; j < len; j++) lists[i][j] = sc.nextInt();
        }

        // heap entries: {value, listIndex, elementIndex}, ordered by value
        PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> Integer.compare(x[0], y[0]));
        for (int i = 0; i < k; i++) if (lists[i].length > 0) pq.offer(new int[]{lists[i][0], i, 0});

        StringBuilder sb = new StringBuilder();
        boolean first = true;
        while (!pq.isEmpty()) {
            int[] t = pq.poll();
            if (!first) sb.append(' ');
            sb.append(t[0]);
            first = false;
            int li = t[1], ei = t[2];
            if (ei + 1 < lists[li].length) pq.offer(new int[]{lists[li][ei + 1], li, ei + 1});
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'The heap only ever holds k items (one "frontier" element per list), so each of the N total elements is pushed/popped once at O(log k). That’s **O(N log k)** — much better than concatenating and sorting everything, and the basis for external merge sort.' }],
        },
      ],
    },
    {
      id: 'dsa-heap-top-k-frequent',
      title: 'Top K Frequent Elements',
      difficulty: 'Medium',
      tags: ['heap', 'hashing'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the `k` most frequent values, in **ascending order** (of value), space-separated.' }],
      examples: [{ input: '6\n1 1 1 2 2 3\n2', output: '1 2' }],
      constraints: ['1 ≤ k ≤ number of distinct values ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: k. Output: the k most frequent values, sorted ascending.',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n1 1 1 2 2 3\n2', expected: '1 2' },
        { stdin: '4\n1 2 3 4\n4', expected: '1 2 3 4' },
        { stdin: '5\n4 4 4 5 5\n1', expected: '4', hidden: true },
        { stdin: '6\n7 7 8 8 8 9\n2', expected: '7 8', hidden: true },
      ],
      hints: ['Count frequencies in a HashMap.', 'Keep a min-heap (by frequency) of size k; then sort the k surviving values ascending for output.'],
      solutions: [
        {
          label: 'Frequency map + size-k heap',
          bigO: 'Time O(n log k) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int k = sc.nextInt();

        HashMap<Integer, Integer> freq = new HashMap<>();
        for (int x : a) freq.merge(x, 1, Integer::sum);

        // min-heap by frequency: {value, frequency}
        PriorityQueue<int[]> heap = new PriorityQueue<>((x, y) -> Integer.compare(x[1], y[1]));
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            heap.offer(new int[]{e.getKey(), e.getValue()});
            if (heap.size() > k) heap.poll();
        }

        List<Integer> res = new ArrayList<>();
        while (!heap.isEmpty()) res.add(heap.poll()[0]);
        Collections.sort(res);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.size(); i++) { sb.append(res.get(i)); if (i < res.size() - 1) sb.append(' '); }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Count frequencies, then keep only the k highest-frequency values in a size-k min-heap (evicting the least frequent). Finally sort those k values for a stable, ascending output. **O(n log k)**.' }],
        },
      ],
    },
  ],
};
