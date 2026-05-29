import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const sorting: SubCourse = {
  id: 'sorting',
  slug: 'sorting',
  order: 10,
  title: 'Sorting',
  subtitle: 'The algorithms, and the problems sorting unlocks',
  icon: 'layers',
  badge: { name: 'Sort Sorcerer', emoji: '🃏' },
  learn: [
    {
      id: 'dsa-sort-l1',
      title: 'Sorting — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Sorting puts elements in order — and, just as importantly, it’s the **setup move** for dozens of problems (binary search, two pointers, grouping, intervals).' },
        { type: 'h2', text: 'The algorithms to know by name' },
        { type: 'keyterms', terms: [
          { term: 'Bubble / Insertion / Selection', def: '**O(n²)** simple sorts. Insertion is great for tiny or nearly-sorted arrays.' },
          { term: 'Merge sort', def: '**O(n log n)**, stable, needs O(n) extra space. Divide in half, sort each, merge.' },
          { term: 'Quick sort', def: '**O(n log n)** average (O(n²) worst), in-place. Partition around a pivot.' },
          { term: 'Counting / Radix', def: 'Non-comparison sorts: **O(n + k)** when values are small integers.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Comparison sorts can’t beat **O(n log n)**. In practice you’ll call the library sort; the value is knowing the trade-offs and how to sort by a **custom rule** (comparator).' },
        { type: 'keyterms', title: 'Two more terms interviewers use', terms: [
          { term: 'Stable', def: 'Equal elements keep their original relative order (merge sort is; plain quick sort isn’t).' },
          { term: 'In-place', def: 'Uses O(1) extra space (quick sort is; merge sort isn’t).' },
        ] },
        { type: 'widget', widget: 'bigo-cheat' },
      ],
    },
    {
      id: 'dsa-sort-l2',
      title: 'Sorting in Java',
      minutes: 6,
      blocks: [
        { type: 'h2', text: 'Just sort it' },
        { type: 'code', code: `import java.util.*;

int[] a = {5, 2, 8, 1};
Arrays.sort(a);                 // ascending, in place — O(n log n)

Integer[] b = {5, 2, 8, 1};
Arrays.sort(b, Collections.reverseOrder());   // descending (needs Integer[], not int[])

List<Integer> list = new ArrayList<>(List.of(5, 2, 8));
Collections.sort(list);` },
        { type: 'h2', text: 'Sort by a custom rule (comparator)' },
        { type: 'code', code: `int[][] intervals = {{1,3},{8,10},{2,6}};
Arrays.sort(intervals, (x, y) -> Integer.compare(x[0], y[0]));  // by start

String[] words = {"banana", "kiwi", "fig"};
Arrays.sort(words, (x, y) -> x.length() - y.length());         // by length

// Sort numbers as strings so concatenation is largest:
String[] nums = {"3", "30", "34"};
Arrays.sort(nums, (x, y) -> (y + x).compareTo(x + y));` },
        { type: 'callout', variant: 'warning', title: 'Gotchas', text: '• `Collections.reverseOrder()` / comparators need **`Integer[]`**, not primitive `int[]`. • In a comparator, prefer `Integer.compare(a, b)` over `a - b` (subtraction can overflow). • `Arrays.sort` on objects is stable (merge sort); on primitives it’s a quicksort variant (not stable).' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-sort-basic',
      title: 'Sort an Array',
      difficulty: 'Easy',
      tags: ['sorting'],
      statement: [{ type: 'p', text: 'Print the array sorted in **ascending** order. (Then read the merge-sort solution to see how the library does it under the hood.)' }],
      examples: [{ input: '5\n5 2 8 1 9', output: '1 2 5 8 9' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the sorted array, space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n5 2 8 1 9', expected: '1 2 5 8 9' },
        { stdin: '1\n3', expected: '3' },
        { stdin: '4\n4 3 2 1', expected: '1 2 3 4', hidden: true },
        { stdin: '3\n-1 -5 0', expected: '-5 -1 0', hidden: true },
      ],
      hints: ['The easy way: Arrays.sort(a), then print.', 'The educational way: implement merge sort (divide in half, sort each, merge).'],
      solutions: [
        {
          label: 'Library sort',
          bigO: 'Time O(n log n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        Arrays.sort(a);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { sb.append(a[i]); if (i < n - 1) sb.append(' '); }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: '`Arrays.sort` uses a tuned dual-pivot quicksort for primitives — **O(n log n)** on average. In a real interview, use the library unless asked to implement a sort.' }],
        },
        {
          label: 'Merge sort (from scratch)',
          bigO: 'Time O(n log n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    static void mergeSort(int[] a, int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSort(a, l, m);
        mergeSort(a, m + 1, r);
        int[] tmp = new int[r - l + 1];
        int i = l, j = m + 1, k = 0;
        while (i <= m && j <= r) tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
        while (i <= m) tmp[k++] = a[i++];
        while (j <= r) tmp[k++] = a[j++];
        for (int t = 0; t < tmp.length; t++) a[l + t] = tmp[t];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        mergeSort(a, 0, n - 1);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { sb.append(a[i]); if (i < n - 1) sb.append(' '); }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Split the array in half, sort each half recursively, then **merge** the two sorted halves in linear time. log(n) levels × O(n) merging = **O(n log n)**. Merge sort is **stable** and the basis for the inversion-count problem below.' }],
        },
      ],
    },
    {
      id: 'dsa-sort-colors',
      title: 'Sort Colors (Dutch National Flag)',
      difficulty: 'Medium',
      tags: ['sorting', 'two-pointers'],
      isInterview: true,
      statement: [{ type: 'p', text: 'The array contains only `0`, `1`, and `2`. Sort it in a **single pass** with O(1) extra space (the Dutch National Flag algorithm). Print the result.' }],
      examples: [{ input: '6\n2 0 2 1 1 0', output: '0 0 1 1 2 2' }],
      constraints: ['1 ≤ n ≤ 10^5', 'values are 0, 1, or 2'],
      ioNote: 'Line 1: n. Line 2: n values (each 0/1/2). Output: the sorted array.',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n2 0 2 1 1 0', expected: '0 0 1 1 2 2' },
        { stdin: '3\n2 0 1', expected: '0 1 2' },
        { stdin: '1\n0', expected: '0', hidden: true },
        { stdin: '4\n1 1 1 1', expected: '1 1 1 1', hidden: true },
      ],
      hints: ['Three pointers: low, mid, high. Everything before low is 0; after high is 2.', 'Walk mid: 0 → swap to low; 2 → swap to high (don’t advance mid); 1 → just advance mid.'],
      solutions: [
        {
          label: 'Dutch National Flag',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        int low = 0, mid = 0, high = n - 1;
        while (mid <= high) {
            if (a[mid] == 0) { int t = a[low]; a[low] = a[mid]; a[mid] = t; low++; mid++; }
            else if (a[mid] == 1) { mid++; }
            else { int t = a[mid]; a[mid] = a[high]; a[high] = t; high--; }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { sb.append(a[i]); if (i < n - 1) sb.append(' '); }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Maintain three regions with `low`, `mid`, `high`. A 0 belongs at the front (swap to `low`), a 2 at the back (swap to `high`), a 1 stays. One pass, in place — **O(n)**, beating a general O(n log n) sort because we know there are only three values.' }],
        },
      ],
    },
    {
      id: 'dsa-sort-kth-largest',
      title: 'Kth Largest Element',
      difficulty: 'Medium',
      tags: ['sorting', 'heap'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the **k-th largest** element (k = 1 is the maximum). Duplicates count by position.' }],
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
      hints: ['Simplest: sort ascending and take index n − k.', 'For huge arrays, a size-k min-heap or quickselect avoids fully sorting.'],
      solutions: [
        {
          label: 'Sort and index',
          bigO: 'Time O(n log n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int k = sc.nextInt();
        Arrays.sort(a);
        System.out.println(a[n - k]);   // k-th largest = (n-k)-th in ascending order
    }
}`,
          explanation: [{ type: 'p', text: 'After sorting ascending, the largest is at `n-1`, the 2nd largest at `n-2`, so the k-th largest is at `n-k`. **O(n log n)**. (A min-heap of size k or quickselect can do it in O(n log k) / average O(n) — see the Heaps topic.)' }],
        },
      ],
    },
    {
      id: 'dsa-sort-merge-intervals',
      title: 'Merge Intervals',
      difficulty: 'Medium',
      tags: ['sorting'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Given a set of intervals, **merge all overlapping ones** and print the result, one interval per line, sorted by start.' }],
      examples: [{ input: '4\n1 3\n2 6\n8 10\n15 18', output: '1 6\n8 10\n15 18' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Next: n intervals, each "start end". Output: merged intervals, one "start end" per line.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n1 3\n2 6\n8 10\n15 18', expected: '1 6\n8 10\n15 18' },
        { stdin: '2\n1 4\n4 5', expected: '1 5' },
        { stdin: '1\n5 7', expected: '5 7', hidden: true },
        { stdin: '3\n1 4\n0 4\n3 5', expected: '0 5', hidden: true },
      ],
      hints: ['Sort the intervals by start.', 'Walk them: if the next start ≤ current end, extend the end; otherwise close this interval and start a new one.'],
      solutions: [
        {
          label: 'Sort then sweep',
          bigO: 'Time O(n log n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] iv = new int[n][2];
        for (int i = 0; i < n; i++) { iv[i][0] = sc.nextInt(); iv[i][1] = sc.nextInt(); }
        Arrays.sort(iv, (x, y) -> Integer.compare(x[0], y[0]));

        StringBuilder sb = new StringBuilder();
        int curStart = iv[0][0], curEnd = iv[0][1];
        for (int i = 1; i < n; i++) {
            if (iv[i][0] <= curEnd) {
                curEnd = Math.max(curEnd, iv[i][1]);     // overlap → extend
            } else {
                sb.append(curStart).append(' ').append(curEnd).append('\\n');
                curStart = iv[i][0]; curEnd = iv[i][1];
            }
        }
        sb.append(curStart).append(' ').append(curEnd);
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Once sorted by start, overlaps are always adjacent. Keep a "current" interval; if the next one starts within it, stretch the end; otherwise emit the current and begin a new one. Sorting dominates → **O(n log n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-sort-largest-number',
      title: 'Largest Number',
      difficulty: 'Medium',
      tags: ['sorting'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Arrange the non-negative integers to form the **largest possible number**, and print it (as a string). E.g. `3, 30, 34, 5, 9` → `9534330`.' }],
      examples: [{ input: '5\n3 30 34 5 9', output: '9534330' }],
      constraints: ['1 ≤ n ≤ 10^4', 'values ≥ 0'],
      ioNote: 'Line 1: n. Line 2: n non-negative integers. Output: the largest number they can form.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n3 30 34 5 9', expected: '9534330' },
        { stdin: '2\n10 2', expected: '210' },
        { stdin: '3\n0 0 0', expected: '0', hidden: true },
        { stdin: '1\n10', expected: '10', hidden: true },
      ],
      hints: ['Compare two numbers a, b by which concatenation is bigger: (a+b) vs (b+a) as strings.', 'Sort with that rule (descending), join. If the result starts with "0", the answer is just "0".'],
      solutions: [
        {
          label: 'Custom comparator',
          bigO: 'Time O(n log n · L) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] s = new String[n];
        for (int i = 0; i < n; i++) s[i] = sc.next();

        // a should come before b if (a+b) > (b+a)
        Arrays.sort(s, (a, b) -> (b + a).compareTo(a + b));

        if (s[0].equals("0")) { System.out.println("0"); return; }  // all zeros
        StringBuilder sb = new StringBuilder();
        for (String x : s) sb.append(x);
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'The key insight: to decide order, compare the two **concatenations** `a+b` and `b+a` — whichever is larger as a string wins. Sort by that rule and glue the pieces. The `"0"` check handles the all-zeros case (which would otherwise print "000").' }],
        },
      ],
    },
    {
      id: 'dsa-sort-inversions',
      title: 'Count Inversions',
      difficulty: 'Hard',
      tags: ['sorting', 'divide-and-conquer'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Count the **inversions**: pairs (i, j) with i < j but a[i] > a[j] (a measure of how unsorted the array is). Do it in O(n log n) by piggy-backing on merge sort.' }],
      examples: [{ input: '5\n2 4 1 3 5', output: '3' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the number of inversions.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n2 4 1 3 5', expected: '3' },
        { stdin: '4\n5 4 3 2', expected: '6' },
        { stdin: '3\n1 2 3', expected: '0', hidden: true },
        { stdin: '5\n2 3 8 6 1', expected: '5', hidden: true },
      ],
      hints: ['Brute force is O(n²); merge sort gets O(n log n).', 'During the merge, when you take an element from the right half, every remaining element in the left half forms an inversion with it.'],
      solutions: [
        {
          label: 'Merge sort counting',
          bigO: 'Time O(n log n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    static long count = 0;

    static void mergeSort(int[] a, int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSort(a, l, m);
        mergeSort(a, m + 1, r);
        int[] tmp = new int[r - l + 1];
        int i = l, j = m + 1, k = 0;
        while (i <= m && j <= r) {
            if (a[i] <= a[j]) tmp[k++] = a[i++];
            else { count += (m - i + 1); tmp[k++] = a[j++]; }  // a[i..m] all > a[j]
        }
        while (i <= m) tmp[k++] = a[i++];
        while (j <= r) tmp[k++] = a[j++];
        for (int t = 0; t < tmp.length; t++) a[l + t] = tmp[t];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        mergeSort(a, 0, n - 1);
        System.out.println(count);
    }
}`,
          explanation: [{ type: 'p', text: 'While merging two sorted halves, if a right-half element is smaller than a left-half element, it’s smaller than **all** remaining left-half elements — so add `(m − i + 1)` inversions at once. Sorting and counting together → **O(n log n)** (use `long`; inversions can reach ~n²/2).' }],
        },
      ],
    },
  ],
};
