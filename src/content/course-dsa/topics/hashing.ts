import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const hashing: SubCourse = {
  id: 'hashing',
  slug: 'hashing',
  order: 3,
  title: 'Hashing (Map & Set)',
  subtitle: 'O(1) lookups — the interview superpower',
  icon: 'database',
  badge: { name: 'Hash Hero', emoji: '🗝️' },
  learn: [
    {
      id: 'dsa-hashing-l1',
      title: 'Hashing — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **hash table** stores items so you can find them almost instantly. A **hash function** turns a key into a slot number, so looking something up doesn’t require scanning — it jumps straight to the slot.' },
        { type: 'ul', items: [
          '**HashMap<K,V>** — stores key → value pairs.',
          '**HashSet<E>** — stores just keys (a set of unique things).',
          'Both give **average O(1)** insert, lookup, and delete. (Worst case is O(n) if many keys collide, but that’s rare in practice.)',
        ] },
        { type: 'callout', variant: 'key', text: 'The single most common interview move: replace an **O(n²)** "search for a matching element" loop with a hash map for **O(1)** lookups → the whole thing becomes **O(n)**. You saw this in Two Sum.' },
        { type: 'h2', text: 'When to reach for a hash structure' },
        { type: 'ul', items: [
          '**Counting** how many times things appear (frequencies).',
          '**Dedup** / "have I seen this before?" (use a Set).',
          '**Fast lookups** by key instead of scanning a list.',
          '**Pairing** — "does the complement / partner exist?"',
        ] },
        { type: 'widget', widget: 'bigo-cheat' },
        { type: 'callout', variant: 'tip', title: 'Sorted variants', text: 'Need keys kept in **sorted order**? Use `TreeMap` / `TreeSet` (O(log n) ops). Need **insertion order**? Use `LinkedHashMap`. Plain `HashMap`/`HashSet` give no order guarantee.' },
      ],
    },
    {
      id: 'dsa-hashing-l2',
      title: 'HashMap & HashSet in Java',
      minutes: 7,
      blocks: [
        { type: 'h2', text: 'HashMap' },
        { type: 'code', code: `import java.util.*;

HashMap<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.get("a");              // 1
map.get("z");              // null  (missing key)
map.getOrDefault("z", 0);  // 0     (safe default — use this a lot)
map.containsKey("a");      // true
map.remove("a");
map.size();
for (Map.Entry<String,Integer> e : map.entrySet()) {
    System.out.println(e.getKey() + " -> " + e.getValue());
}` },
        { type: 'h2', text: 'The frequency-count pattern (memorise this)' },
        { type: 'code', code: `int[] nums = {1, 2, 2, 3, 2};
HashMap<Integer, Integer> freq = new HashMap<>();
for (int x : nums) {
    freq.put(x, freq.getOrDefault(x, 0) + 1);
    // or, more compactly:
    // freq.merge(x, 1, Integer::sum);
}
// freq = {1:1, 2:3, 3:1}` },
        { type: 'h2', text: 'HashSet' },
        { type: 'code', code: `HashSet<Integer> seen = new HashSet<>();
boolean added = seen.add(5);   // true the first time, false if already present
seen.contains(5);              // true
seen.remove(5);
seen.size();

// Neat trick: add() returning false instantly detects a duplicate.
if (!seen.add(x)) { /* x was already there */ }` },
        { type: 'callout', variant: 'warning', title: 'Gotchas', text: '• Map/Set hold **objects**, so ints are auto-boxed to `Integer` — fine, just be aware. • `map.get(missing)` returns **null** (can NPE if you unbox) — prefer `getOrDefault`. • Iteration order of `HashMap`/`HashSet` is **not** predictable; sort the keys (or use a TreeMap) if you need order.' },
        { type: 'callout', variant: 'tip', text: 'Most "hashing" problems are just: build a frequency map or a seen-set in one pass, then answer the question in a second pass. Try the problems!' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-hash-contains-dup',
      title: 'Contains Duplicate',
      difficulty: 'Easy',
      tags: ['hashing'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print `true` if any value appears at least twice in the array, else `false`.' }],
      examples: [{ input: '5\n1 2 3 1 5', output: 'true' }, { input: '3\n1 2 3', output: 'false' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: true or false.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n1 2 3 1 5', expected: 'true' },
        { stdin: '3\n1 2 3', expected: 'false' },
        { stdin: '1\n7', expected: 'false', hidden: true },
        { stdin: '4\n4 4 4 4', expected: 'true', hidden: true },
      ],
      hints: ['Add each number to a HashSet.', 'set.add(x) returns false if x is already there — that means a duplicate.'],
      solutions: [
        {
          label: 'HashSet',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashSet<Integer> seen = new HashSet<>();
        boolean dup = false;
        for (int i = 0; i < n; i++) {
            if (!seen.add(sc.nextInt())) dup = true;
        }
        System.out.println(dup);
    }
}`,
          explanation: [{ type: 'p', text: 'A `HashSet` rejects repeats: `add` returns `false` when the value is already present. One pass, **O(n)**. The brute force (compare every pair) would be O(n²).' }],
        },
      ],
    },
    {
      id: 'dsa-hash-distinct',
      title: 'Count Distinct Elements',
      difficulty: 'Easy',
      tags: ['hashing'],
      statement: [{ type: 'p', text: 'Print how many **distinct** values the array contains.' }],
      examples: [{ input: '5\n1 2 2 3 3', output: '3' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the count of distinct values.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n1 2 2 3 3', expected: '3' },
        { stdin: '4\n1 2 3 4', expected: '4' },
        { stdin: '1\n9', expected: '1', hidden: true },
        { stdin: '6\n5 5 5 5 5 5', expected: '1', hidden: true },
      ],
      hints: ['Add everything to a HashSet.', 'The answer is just the set’s size.'],
      solutions: [
        {
          label: 'HashSet size',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashSet<Integer> set = new HashSet<>();
        for (int i = 0; i < n; i++) set.add(sc.nextInt());
        System.out.println(set.size());
    }
}`,
          explanation: [{ type: 'p', text: 'A set automatically discards duplicates, so its size is the number of distinct values. **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-hash-majority',
      title: 'Majority Element',
      difficulty: 'Medium',
      tags: ['hashing', 'greedy'],
      isInterview: true,
      statement: [{ type: 'p', text: 'One value appears **more than n/2 times** (guaranteed). Print it.' }],
      examples: [{ input: '3\n3 2 3', output: '3' }, { input: '7\n2 2 1 1 1 2 2', output: '2' }],
      constraints: ['1 ≤ n ≤ 10^5', 'A majority element always exists.'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the majority element.',
      starterCode: STARTER,
      tests: [
        { stdin: '3\n3 2 3', expected: '3' },
        { stdin: '7\n2 2 1 1 1 2 2', expected: '2' },
        { stdin: '1\n5', expected: '5', hidden: true },
        { stdin: '5\n4 4 4 2 4', expected: '4', hidden: true },
      ],
      hints: ['Brute: count each value with a HashMap, return the one with count > n/2.', 'Optimal (Boyer–Moore): keep a candidate + a counter; the majority survives.'],
      solutions: [
        {
          label: 'HashMap count',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<Integer, Integer> freq = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            int c = freq.merge(x, 1, Integer::sum);
            if (c > n / 2) { System.out.println(x); return; }
        }
    }
}`,
          explanation: [{ type: 'p', text: 'Count occurrences; the first value to exceed `n/2` is the answer. **O(n)** time and **O(n)** space.' }],
        },
        {
          label: 'Optimal (Boyer–Moore)',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int candidate = 0, count = 0;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            if (count == 0) candidate = x;
            count += (x == candidate) ? 1 : -1;
        }
        System.out.println(candidate);
    }
}`,
          explanation: [
            { type: 'p', text: 'Boyer–Moore voting: keep a `candidate` and a `count`. Same value → +1, different → −1; when count hits 0, adopt the next value. The true majority can’t be fully cancelled out, so it survives. **O(n)** time, **O(1)** space — no map needed.' },
          ],
        },
      ],
    },
    {
      id: 'dsa-hash-intersection',
      title: 'Intersection of Two Arrays',
      difficulty: 'Medium',
      tags: ['hashing'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the **distinct values that appear in both** arrays, in **ascending order**, space-separated. If there are none, print an empty line.' }],
      examples: [
        { input: '4\n4 9 5 4\n5\n9 4 9 8 4', output: '4 9' },
        { input: '4\n1 2 2 1\n2\n2 2', output: '2' },
      ],
      constraints: ['1 ≤ n, m ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: m. Line 4: m integers. Output: sorted distinct common values.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n4 9 5 4\n5\n9 4 9 8 4', expected: '4 9' },
        { stdin: '4\n1 2 2 1\n2\n2 2', expected: '2' },
        { stdin: '3\n1 2 3\n3\n4 5 6', expected: '', hidden: true },
        { stdin: '3\n1 2 3\n3\n3 2 1', expected: '1 2 3', hidden: true },
      ],
      hints: ['Put the first array in a HashSet.', 'For each value in the second, if it’s in the set, add it to a TreeSet (which keeps it sorted & distinct).'],
      solutions: [
        {
          label: 'Set intersection',
          bigO: 'Time O(n + m log m) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashSet<Integer> first = new HashSet<>();
        for (int i = 0; i < n; i++) first.add(sc.nextInt());

        int m = sc.nextInt();
        TreeSet<Integer> common = new TreeSet<>();   // sorted + distinct
        for (int i = 0; i < m; i++) {
            int x = sc.nextInt();
            if (first.contains(x)) common.add(x);
        }

        StringBuilder sb = new StringBuilder();
        for (int x : common) { sb.append(x); sb.append(' '); }
        System.out.println(sb.toString().trim());
    }
}`,
          explanation: [{ type: 'p', text: 'A `HashSet` gives O(1) "is it in the first array?" checks; a `TreeSet` collects the matches already sorted and de-duplicated. Print them space-separated.' }],
        },
      ],
    },
    {
      id: 'dsa-hash-subarray-sum',
      title: 'Subarray Sum Equals K',
      difficulty: 'Hard',
      tags: ['hashing', 'prefix-sum'],
      isInterview: true,
      statement: [
        { type: 'p', text: 'Count how many **contiguous subarrays** sum to exactly **k**. A brilliant use of a hash map over **prefix sums**.' },
      ],
      examples: [
        { input: '3\n1 1 1\n2', output: '2' },
        { input: '3\n1 2 3\n3', output: '2', explanation: '[1,2] and [3].' },
      ],
      constraints: ['1 ≤ n ≤ 10^5', 'values and k can be negative'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: k. Output: the number of subarrays summing to k.',
      starterCode: STARTER,
      tests: [
        { stdin: '3\n1 1 1\n2', expected: '2' },
        { stdin: '3\n1 2 3\n3', expected: '2' },
        { stdin: '5\n1 -1 1 -1 1\n0', expected: '6', hidden: true },
        { stdin: '1\n5\n5', expected: '1', hidden: true },
      ],
      hints: ['Track a running prefix sum as you scan.', 'A subarray (i..j) sums to k when prefix[j] − prefix[i−1] = k. Count how often (prefix − k) has been seen using a HashMap.'],
      solutions: [
        {
          label: 'Prefix sum + HashMap',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        long k = sc.nextLong();

        HashMap<Long, Integer> seen = new HashMap<>();
        seen.put(0L, 1);            // empty prefix
        long sum = 0;
        int count = 0;
        for (int x : a) {
            sum += x;
            count += seen.getOrDefault(sum - k, 0);   // prefixes that complete a k-sum
            seen.merge(sum, 1, Integer::sum);
        }
        System.out.println(count);
    }
}`,
          explanation: [
            { type: 'p', text: 'Let `prefix[j]` be the sum of the first `j` elements. A subarray ending at `j` sums to `k` exactly when some earlier prefix equals `sum − k`. So keep a map of **how many times each prefix sum has occurred** and, at each step, add the count of `sum − k`. One pass, **O(n)** — far better than checking every subarray (O(n²)).' },
            { type: 'callout', variant: 'key', text: '**Prefix sums + a hash map of counts** is a power-combo for "how many subarrays satisfy …" problems. Worth memorising.' },
          ],
        },
      ],
    },
    {
      id: 'dsa-hash-longest-consec',
      title: 'Longest Consecutive Sequence',
      difficulty: 'Hard',
      tags: ['hashing'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the length of the longest run of **consecutive integers** present in the array (order in the array doesn’t matter). Aim for **O(n)**.' }],
      examples: [{ input: '6\n100 4 200 1 3 2', output: '4', explanation: '1,2,3,4.' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the length of the longest consecutive run.',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n100 4 200 1 3 2', expected: '4' },
        { stdin: '1\n5', expected: '1' },
        { stdin: '7\n0 3 7 2 5 8 4', expected: '4', hidden: true },
        { stdin: '5\n1 2 0 1 2', expected: '3', hidden: true },
      ],
      hints: ['Put everything in a HashSet for O(1) membership.', 'Only start counting a run at a value x whose x−1 is NOT in the set (a true sequence start). That keeps it O(n) overall.'],
      solutions: [
        {
          label: 'HashSet, count from run starts',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashSet<Integer> set = new HashSet<>();
        for (int i = 0; i < n; i++) set.add(sc.nextInt());

        int best = 0;
        for (int x : set) {
            if (!set.contains(x - 1)) {          // x starts a run
                int len = 1;
                while (set.contains(x + len)) len++;
                best = Math.max(best, len);
            }
        }
        System.out.println(best);
    }
}`,
          explanation: [
            { type: 'p', text: 'Put all values in a set. Only begin counting at a value whose predecessor is **absent** — that’s the start of a run — then walk upward. Each value is visited at most twice, so it’s **O(n)** overall, not O(n²).' },
          ],
        },
      ],
    },
  ],
};
