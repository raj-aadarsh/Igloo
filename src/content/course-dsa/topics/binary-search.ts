import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const binarySearch: SubCourse = {
  id: 'binary-search',
  slug: 'binary-search',
  order: 9,
  title: 'Binary Search',
  subtitle: 'Halve the search space — O(log n) magic',
  icon: 'search',
  badge: { name: 'Search Specialist', emoji: '🔭' },
  learn: [
    {
      id: 'dsa-bs-l1',
      title: 'Binary search — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Binary search** finds a target in a **sorted** collection by repeatedly halving the search range: check the middle, then throw away the half that can’t contain the answer. n → n/2 → n/4 … so it’s **O(log n)** — a million items in ~20 steps.' },
        { type: 'callout', variant: 'key', text: 'Prerequisite: the data must be **sorted** (or monotonic in some property). "It’s sorted and I need to find / count / locate something" → think binary search.' },
        { type: 'h2', text: 'The classic pitfalls' },
        { type: 'ul', items: [
          'Compute mid as **`lo + (hi - lo) / 2`** (avoids integer overflow that `(lo + hi) / 2` can cause).',
          'Be consistent with bounds: is `hi` the last index (`n-1`) or one-past (`n`)? Mixing them causes infinite loops / off-by-one bugs.',
          'Decide your loop condition (`lo <= hi` vs `lo < hi`) and stick to the matching update rules.',
        ] },
        { type: 'widget', widget: 'bigo-cheat' },
        { type: 'callout', variant: 'tip', title: 'Binary search on the answer', text: 'A powerful twist: when the answer is a number and "is X feasible?" gets *easier as X grows*, binary-search over the **answer range** itself (e.g. "minimum speed", "smallest capacity"). You’ll do this in the Koko problem.' },
      ],
    },
    {
      id: 'dsa-bs-l2',
      title: 'The templates in Java',
      minutes: 6,
      blocks: [
        { type: 'h2', text: 'Find an exact target' },
        { type: 'code', code: `int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;   // overflow-safe
    if (a[mid] == target) return mid;
    else if (a[mid] < target) lo = mid + 1;   // answer is to the right
    else hi = mid - 1;                         // answer is to the left
}
return -1;   // not found` },
        { type: 'h2', text: 'Lower bound (first index where a[i] >= target)' },
        { type: 'code', code: `int lo = 0, hi = n;        // note: hi = n (one past the end)
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid;
}
return lo;   // insertion point / first element >= target` },
        { type: 'callout', variant: 'tip', title: 'Library shortcut', text: 'Java has `Arrays.binarySearch(a, key)`, but it returns a negative encoding when the key is absent and is unspecified for duplicates — interviews usually want the hand-written version above so you control the behaviour.' },
        { type: 'callout', variant: 'warning', text: 'Binary search on **answer**: set `lo`/`hi` to the smallest/largest possible answer, write a `feasible(x)` check, and shrink toward the boundary. The array doesn’t have to be the thing you search — the answer range is.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-bs-basic',
      title: 'Binary Search',
      difficulty: 'Easy',
      tags: ['binary-search'],
      isInterview: true,
      statement: [{ type: 'p', text: 'The array is sorted ascending. Print the **index** of the target, or `-1` if it isn’t present.' }],
      examples: [{ input: '6\n-1 0 3 5 9 12\n9', output: '4' }, { input: '6\n-1 0 3 5 9 12\n2', output: '-1' }],
      constraints: ['1 ≤ n ≤ 10^5', 'array sorted ascending, distinct'],
      ioNote: 'Line 1: n. Line 2: n sorted integers. Line 3: target. Output: the index, or -1.',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n-1 0 3 5 9 12\n9', expected: '4' },
        { stdin: '6\n-1 0 3 5 9 12\n2', expected: '-1' },
        { stdin: '1\n5\n5', expected: '0', hidden: true },
        { stdin: '3\n1 2 3\n3', expected: '2', hidden: true },
      ],
      hints: ['Track lo and hi; compare a[mid] to the target.', 'Move lo or hi past mid depending on which half the target must be in.'],
      solutions: [
        {
          label: 'Iterative binary search',
          bigO: 'Time O(log n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int target = sc.nextInt();

        int lo = 0, hi = n - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) { ans = mid; break; }
            else if (a[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        System.out.println(ans);
    }
}`,
          explanation: [{ type: 'p', text: 'Each step compares the middle and discards half the range. ~log₂(n) iterations → **O(log n)**. The `lo + (hi - lo)/2` form avoids overflow on large indices.' }],
        },
      ],
    },
    {
      id: 'dsa-bs-insert',
      title: 'Search Insert Position',
      difficulty: 'Easy',
      tags: ['binary-search'],
      statement: [{ type: 'p', text: 'Return the index of the target; if it’s absent, return the index where it **would be inserted** to keep the array sorted (i.e. the lower bound).' }],
      examples: [{ input: '4\n1 3 5 6\n5', output: '2' }, { input: '4\n1 3 5 6\n2', output: '1' }],
      constraints: ['1 ≤ n ≤ 10^5', 'sorted ascending, distinct'],
      ioNote: 'Line 1: n. Line 2: n sorted integers. Line 3: target. Output: the index where it is or would go.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n1 3 5 6\n5', expected: '2' },
        { stdin: '4\n1 3 5 6\n2', expected: '1' },
        { stdin: '4\n1 3 5 6\n7', expected: '4', hidden: true },
        { stdin: '4\n1 3 5 6\n0', expected: '0', hidden: true },
      ],
      hints: ['This is the "lower bound": first index with a[i] >= target.', 'Use hi = n and the lo < hi template; return lo.'],
      solutions: [
        {
          label: 'Lower bound',
          bigO: 'Time O(log n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int target = sc.nextInt();

        int lo = 0, hi = n;          // one past the end
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        System.out.println(lo);
    }
}`,
          explanation: [{ type: 'p', text: 'The lower-bound template finds the first position where `a[i] >= target`. That index is exactly where the target is (if present) or where it should be inserted. **O(log n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-bs-first-last',
      title: 'First and Last Position',
      difficulty: 'Medium',
      tags: ['binary-search'],
      isInterview: true,
      statement: [{ type: 'p', text: 'The sorted array may contain duplicates. Print the **first and last index** of the target (space-separated), or `-1 -1` if it’s absent.' }],
      examples: [{ input: '6\n5 7 7 8 8 10\n8', output: '3 4' }, { input: '6\n5 7 7 8 8 10\n6', output: '-1 -1' }],
      constraints: ['1 ≤ n ≤ 10^5', 'sorted ascending'],
      ioNote: 'Line 1: n. Line 2: n sorted integers. Line 3: target. Output: "first last", or "-1 -1".',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n5 7 7 8 8 10\n8', expected: '3 4' },
        { stdin: '6\n5 7 7 8 8 10\n6', expected: '-1 -1' },
        { stdin: '1\n1\n1', expected: '0 0', hidden: true },
        { stdin: '5\n2 2 2 2 2\n2', expected: '0 4', hidden: true },
      ],
      hints: ['Run two binary searches: lower bound of target, and lower bound of (target + 1).', 'If lower bound is out of range or not the target, it’s absent.'],
      solutions: [
        {
          label: 'Two boundary searches',
          bigO: 'Time O(log n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    // first index with a[i] >= key
    static int lowerBound(int[] a, int key) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] < key) lo = mid + 1; else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int target = sc.nextInt();

        int first = lowerBound(a, target);
        if (first == n || a[first] != target) {
            System.out.println("-1 -1");
        } else {
            int last = lowerBound(a, target + 1) - 1;
            System.out.println(first + " " + last);
        }
    }
}`,
          explanation: [{ type: 'p', text: 'The first occurrence is `lowerBound(target)`. The last is `lowerBound(target + 1) - 1` (one before where the next-bigger value would start). Two O(log n) searches.' }],
        },
      ],
    },
    {
      id: 'dsa-bs-rotated',
      title: 'Search in Rotated Sorted Array',
      difficulty: 'Medium',
      tags: ['binary-search'],
      isInterview: true,
      statement: [{ type: 'p', text: 'A sorted, distinct array was rotated at some pivot (e.g. `[4,5,6,7,0,1,2]`). Find the target’s index in **O(log n)**, or print `-1`.' }],
      examples: [{ input: '7\n4 5 6 7 0 1 2\n0', output: '4' }, { input: '7\n4 5 6 7 0 1 2\n3', output: '-1' }],
      constraints: ['1 ≤ n ≤ 10^5', 'distinct values'],
      ioNote: 'Line 1: n. Line 2: the rotated sorted array. Line 3: target. Output: the index, or -1.',
      starterCode: STARTER,
      tests: [
        { stdin: '7\n4 5 6 7 0 1 2\n0', expected: '4' },
        { stdin: '7\n4 5 6 7 0 1 2\n3', expected: '-1' },
        { stdin: '1\n1\n0', expected: '-1', hidden: true },
        { stdin: '2\n1 3\n3', expected: '1', hidden: true },
      ],
      hints: ['At each step, one half (left of mid or right of mid) is still properly sorted.', 'Check if the target lies within that sorted half; if so search it, else search the other half.'],
      solutions: [
        {
          label: 'Modified binary search',
          bigO: 'Time O(log n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int target = sc.nextInt();

        int lo = 0, hi = n - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) { ans = mid; break; }
            if (a[lo] <= a[mid]) {                       // left half is sorted
                if (a[lo] <= target && target < a[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {                                     // right half is sorted
                if (a[mid] < target && target <= a[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        System.out.println(ans);
    }
}`,
          explanation: [{ type: 'p', text: 'Even after rotation, at least one side of `mid` is fully sorted. Figure out which, test whether the target falls inside that sorted side, and recurse into the right half. Still halving each step → **O(log n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-bs-min-rotated',
      title: 'Minimum in Rotated Sorted Array',
      difficulty: 'Medium',
      tags: ['binary-search'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Find the **minimum** value in a rotated sorted array of distinct numbers, in O(log n).' }],
      examples: [{ input: '5\n3 4 5 1 2', output: '1' }, { input: '7\n4 5 6 7 0 1 2', output: '0' }],
      constraints: ['1 ≤ n ≤ 10^5', 'distinct values'],
      ioNote: 'Line 1: n. Line 2: the rotated sorted array. Output: the minimum value.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n3 4 5 1 2', expected: '1' },
        { stdin: '7\n4 5 6 7 0 1 2', expected: '0' },
        { stdin: '1\n1', expected: '1', hidden: true },
        { stdin: '2\n2 1', expected: '1', hidden: true },
      ],
      hints: ['Compare a[mid] with a[hi].', 'If a[mid] > a[hi], the minimum is to the right; otherwise it’s mid or to the left.'],
      solutions: [
        {
          label: 'Binary search for the pivot',
          bigO: 'Time O(log n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        int lo = 0, hi = n - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] > a[hi]) lo = mid + 1;   // min is to the right
            else hi = mid;                       // min is mid or to the left
        }
        System.out.println(a[lo]);
    }
}`,
          explanation: [{ type: 'p', text: 'Comparing `a[mid]` with the right end tells you which side holds the rotation point (the minimum). Narrow toward it until `lo == hi`. **O(log n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-bs-koko',
      title: 'Koko Eating Bananas',
      difficulty: 'Medium',
      tags: ['binary-search', 'binary-search-on-answer'],
      isInterview: true,
      statement: [
        { type: 'p', text: 'There are piles of bananas and `h` hours. At speed `k` bananas/hour, eating a pile takes `ceil(pile / k)` hours (you can’t carry leftovers between hours). Find the **minimum integer speed k** that finishes all piles within `h` hours.' },
        { type: 'p', text: 'The classic **binary-search-on-the-answer** problem: search over `k`, not the array.' },
      ],
      examples: [{ input: '4\n3 6 7 11\n8', output: '4' }],
      constraints: ['1 ≤ piles ≤ 10^5', 'piles count ≤ h'],
      ioNote: 'Line 1: number of piles. Line 2: the pile sizes. Line 3: h (hours). Output: the minimum eating speed k.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n3 6 7 11\n8', expected: '4' },
        { stdin: '5\n30 11 23 4 20\n5', expected: '30' },
        { stdin: '5\n30 11 23 4 20\n6', expected: '23', hidden: true },
        { stdin: '1\n312884470\n312884469', expected: '2', hidden: true },
      ],
      hints: ['Speed k ranges from 1 to max(pile). Higher speed → fewer hours (monotonic).', 'Binary search k; for each, check if total hours = sum(ceil(pile/k)) ≤ h.'],
      solutions: [
        {
          label: 'Binary search on the answer',
          bigO: 'Time O(n log maxPile) · Space O(1)',
          code: `import java.util.*;

public class Main {
    static boolean canFinish(int[] piles, int k, long h) {
        long hours = 0;
        for (int p : piles) hours += (p + k - 1) / k;   // ceil(p / k)
        return hours <= h;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] piles = new int[n];
        int max = 1;
        for (int i = 0; i < n; i++) { piles[i] = sc.nextInt(); max = Math.max(max, piles[i]); }
        long h = sc.nextLong();

        int lo = 1, hi = max;          // possible speeds
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (canFinish(piles, mid, h)) hi = mid;   // mid works → try slower
            else lo = mid + 1;                        // too slow → speed up
        }
        System.out.println(lo);
    }
}`,
          explanation: [
            { type: 'p', text: 'Eating faster never *increases* the hours needed, so "can she finish at speed k?" flips from false to true exactly once as `k` rises — that monotonic boundary is binary-search-able. Search `k` in `[1, maxPile]`, checking feasibility in O(n) each step. **O(n log maxPile)**.' },
            { type: 'callout', variant: 'key', text: '**Binary search on the answer** is a top-tier interview pattern: when "is X enough?" is monotonic, binary-search X. Watch for it in capacity/speed/threshold problems.' },
          ],
        },
      ],
    },
  ],
};
