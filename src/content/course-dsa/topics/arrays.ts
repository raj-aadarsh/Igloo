import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be a class named Main with a main method:
//
//   public class Main {
//       public static void main(String[] args) {
//           // read input, compute, print the answer
//       }
//   }
//
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const arrays: SubCourse = {
  id: 'arrays',
  slug: 'arrays',
  order: 1,
  title: 'Arrays',
  subtitle: 'The most fundamental data structure',
  icon: 'boxes',
  badge: { name: 'Array Ace', emoji: '🎯' },
  learn: [
    {
      id: 'dsa-arrays-l1',
      title: 'Arrays — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'An **array** is an ordered collection of items stored in one **contiguous block of memory**, each reachable by an **index** that starts at **0**. It is the data structure almost every other one is built on top of — master it first.' },
        { type: 'widget', widget: 'array-viz' },
        { type: 'h2', text: 'Why it matters' },
        { type: 'ul', items: [
          'Because items sit next to each other in memory, jumping to any index is **instant — O(1)**.',
          'That speed is the array’s superpower, and the source of its main weakness (below).',
        ] },
        { type: 'h2', text: 'The trade-offs an interviewer expects you to know' },
        { type: 'keyterms', title: 'Array operations & cost', terms: [
          { term: 'Access a[i]', def: '**O(1)** — instant, the whole point of arrays.' },
          { term: 'Search (unsorted)', def: '**O(n)** — you may have to scan everything.' },
          { term: 'Append (ArrayList)', def: '**O(1)** amortised for a dynamic array.' },
          { term: 'Insert / delete in middle', def: '**O(n)** — everything after it must shift.' },
        ] },
        { type: 'callout', variant: 'key', text: 'One-liner to remember: **arrays are great at reading by index, bad at inserting/removing in the middle.** If a problem does lots of middle inserts, an array may be the wrong tool.' },
        { type: 'h2', text: 'Big-O: the language of interviews' },
        { type: 'p', text: 'Every array problem ends with *"what’s the time and space complexity?"* Get a feel for the ladder — slide the input size:' },
        { type: 'widget', widget: 'bigo-cheat' },
        { type: 'callout', variant: 'tip', title: 'Fixed vs dynamic in Java', text: 'A raw Java array (`int[]`) has a **fixed size** you set once. An **`ArrayList`** is a *dynamic array* that grows automatically. Same O(1) indexing; the ArrayList just manages resizing for you.' },
      ],
    },
    {
      id: 'dsa-arrays-l2',
      title: 'Arrays in Java — every move you need',
      minutes: 9,
      blocks: [
        { type: 'p', text: 'Here’s the practical Java toolkit. You’ll use these constantly — read once, then reach for them while solving. (Most collection helpers live in `java.util`, so start with `import java.util.*;`.)' },
        { type: 'h2', text: 'Fixed-size arrays' },
        { type: 'code', code: `int[] a = new int[5];        // five zeros
int[] b = {5, 2, 9, 1};      // literal
a[0] = 10;                   // set      — O(1)
int x = b[2];                // get (9)  — O(1)
int last = b[b.length - 1];  // note: .length is a FIELD, no ()
int[][] grid = new int[3][4];// a 3x4 grid` },
        { type: 'h2', text: 'Dynamic arrays — ArrayList' },
        { type: 'code', code: `import java.util.*;

ArrayList<Integer> list = new ArrayList<>();
list.add(7);          // append          — O(1) amortised
list.get(0);          // read by index   — O(1)
list.set(0, 99);      // overwrite
list.size();          // count (a METHOD, with ())
list.remove(0);       // remove at index — O(n) (shifts)
list.contains(99);    // O(n) search` },
        { type: 'h2', text: 'Loop over it (the two you’ll use most)' },
        { type: 'code', code: `for (int i = 0; i < a.length; i++) {   // index loop
    System.out.println(i + ": " + a[i]);
}

for (int x : a) {                      // for-each (value only)
    System.out.println(x);
}` },
        { type: 'h2', text: 'Sort & handy helpers' },
        { type: 'code', code: `Arrays.sort(a);                 // sort an array in place — O(n log n)
Collections.sort(list);         // sort an ArrayList
Arrays.fill(a, 0);              // set every element
System.out.println(Arrays.toString(a));  // print it nicely for debugging` },
        { type: 'h2', text: 'Reading input & printing output (don’t skip this!)' },
        { type: 'p', text: 'In the playground — and in real interviews/online judges — your program must **read input and print output itself**. This is part of writing a complete solution, not an afterthought.' },
        { type: 'code', code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();          // read an int
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        long sum = 0;                  // use long to avoid overflow!
        for (int x : arr) sum += x;
        System.out.println(sum);       // print the answer
    }
}`, caption: 'Scanner is the simplest way to read tokens. This is the full "from scratch" shape you’ll write every time.' },
        { type: 'code', code: `import java.io.*;
import java.util.*;

// For large inputs, BufferedReader is much faster than Scanner:
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int n = Integer.parseInt(br.readLine().trim());
StringTokenizer st = new StringTokenizer(br.readLine());
int[] arr = new int[n];
for (int i = 0; i < n; i++) arr[i] = Integer.parseInt(st.nextToken());`, caption: 'BufferedReader + StringTokenizer — the fast-I/O pattern competitive programmers use.' },
        { type: 'code', code: `// Printing many values? Build a StringBuilder, print once:
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append(arr[i]);
    if (i < n - 1) sb.append(' ');
}
System.out.println(sb.toString());`, caption: 'Calling System.out.println in a tight loop is slow; build a StringBuilder instead.' },
        { type: 'callout', variant: 'warning', title: 'Classic Java gotchas', text: '• `array.length` is a **field** (no `()`); `list.size()` and `string.length()` are **methods** (with `()`). • Indexes start at **0**; the last is `length - 1`. • **Integer overflow** is silent — sums/products can exceed `int` (±2.1 billion), so use **`long`**. • Compare objects with `.equals()`, not `==`.' },
        { type: 'callout', variant: 'tip', text: 'You now know enough to solve real problems. Head to the **Problems** tab — write each one from scratch, run it, and only then peek at the optimal solution.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-arr-sum',
      title: 'Sum of an Array',
      difficulty: 'Easy',
      tags: ['arrays', 'warm-up'],
      statement: [
        { type: 'p', text: 'Given an array of integers, print the **sum** of all its elements. A warm-up to get comfortable reading input and printing output in Java.' },
      ],
      examples: [
        { input: '4\n1 2 3 4', output: '10' },
        { input: '1\n5', output: '5' },
      ],
      constraints: ['1 ≤ n ≤ 10^5', '-10^9 ≤ arr[i] ≤ 10^9'],
      ioNote: 'Line 1: the integer n. Line 2: n space-separated integers. Output: a single integer — their sum.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n1 2 3 4', expected: '10' },
        { stdin: '1\n5', expected: '5' },
        { stdin: '5\n-1 -2 -3 -4 -5', expected: '-15', hidden: true },
        { stdin: '3\n1000000000 1000000000 1000000000', expected: '3000000000', hidden: true },
      ],
      hints: [
        'Use a Scanner: read n, then loop n times reading sc.nextInt().',
        'The sum can exceed int range — accumulate into a long.',
      ],
      solutions: [
        {
          label: 'One pass',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;            // long: the total can exceed int!
        for (int i = 0; i < n; i++) sum += sc.nextInt();
        System.out.println(sum);
    }
}`,
          explanation: [
            { type: 'p', text: 'Read `n`, add the next `n` numbers, print the total. One pass — **O(n)** time, **O(1)** space. Note the `long`: the last hidden test (three billion) overflows `int`, which is a favourite interview trap.' },
          ],
        },
      ],
    },
    {
      id: 'dsa-arr-max',
      title: 'Find the Maximum',
      difficulty: 'Easy',
      tags: ['arrays', 'warm-up'],
      statement: [
        { type: 'p', text: 'Print the **largest** element in the array.' },
      ],
      examples: [
        { input: '5\n3 9 2 9 4', output: '9' },
        { input: '1\n-7', output: '-7' },
      ],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the maximum value.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n3 9 2 9 4', expected: '9' },
        { stdin: '1\n-7', expected: '-7' },
        { stdin: '4\n-5 -2 -9 -1', expected: '-1', hidden: true },
        { stdin: '6\n10 10 10 2 3 4', expected: '10', hidden: true },
      ],
      hints: [
        'Start your "best" at Integer.MIN_VALUE (or the first element).',
        'Scan once, updating best whenever you see a larger value.',
      ],
      solutions: [
        {
          label: 'Single scan',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int best = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            if (x > best) best = x;
        }
        System.out.println(best);
    }
}`,
          explanation: [
            { type: 'p', text: 'Keep a running maximum and update it as you scan — one pass, **O(n)**. Starting at `Integer.MIN_VALUE` handles all-negative arrays correctly.' },
          ],
        },
      ],
    },
    {
      id: 'dsa-arr-reverse',
      title: 'Reverse the Array',
      difficulty: 'Easy',
      tags: ['arrays', 'two-pointers'],
      statement: [
        { type: 'p', text: 'Print the array’s elements in **reverse order**, space-separated on one line.' },
      ],
      examples: [
        { input: '4\n1 2 3 4', output: '4 3 2 1' },
      ],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the elements reversed, space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n1 2 3 4', expected: '4 3 2 1' },
        { stdin: '1\n9', expected: '9' },
        { stdin: '5\n5 4 3 2 1', expected: '1 2 3 4 5', hidden: true },
      ],
      hints: [
        'Store the numbers in an int[] first, then print from the back.',
        'Or swap with two pointers (i from front, j from back) to reverse in place.',
      ],
      solutions: [
        {
          label: 'Print backwards',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        StringBuilder sb = new StringBuilder();
        for (int i = n - 1; i >= 0; i--) {
            sb.append(a[i]);
            if (i > 0) sb.append(' ');
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [
            { type: 'p', text: 'Read into an array, then walk it backwards into a `StringBuilder` so we print once. Using `StringBuilder` (not many `print` calls) keeps it fast on large inputs.' },
          ],
        },
        {
          label: 'Two pointers (in place)',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        int i = 0, j = n - 1;
        while (i < j) {
            int tmp = a[i]; a[i] = a[j]; a[j] = tmp;  // swap
            i++; j--;
        }
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < n; k++) { sb.append(a[k]); if (k < n - 1) sb.append(' '); }
        System.out.println(sb.toString());
    }
}`,
          explanation: [
            { type: 'p', text: 'The **two-pointer** pattern: one index from the front, one from the back, swap and move inward until they meet. Reverses in place with **O(1)** extra space — a technique you’ll reuse constantly.' },
          ],
        },
      ],
    },
    {
      id: 'dsa-arr-two-sum',
      title: 'Two Sum',
      difficulty: 'Medium',
      tags: ['arrays', 'hashing'],
      isInterview: true,
      statement: [
        { type: 'p', text: 'Given an array and a **target**, find the **indices** of the two numbers that add up to the target. Exactly one valid pair exists. Print the two 0-based indices (smaller first), space-separated.' },
        { type: 'p', text: 'One of the most-asked interview questions ever — and a perfect lesson in trading space for time.' },
      ],
      examples: [
        { input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9.' },
        { input: '3\n3 2 4\n6', output: '1 2' },
      ],
      constraints: ['2 ≤ n ≤ 10^4', 'Exactly one solution exists.'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: the target. Output: the two indices, space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n2 7 11 15\n9', expected: '0 1' },
        { stdin: '3\n3 2 4\n6', expected: '1 2' },
        { stdin: '2\n3 3\n6', expected: '0 1', hidden: true },
        { stdin: '5\n1 5 3 7 2\n9', expected: '1 3', hidden: true },
      ],
      hints: [
        'Brute force: two nested loops over every pair (i, j) — O(n²).',
        'Better: a HashMap of value → index. For each x, check if (target - x) is already in the map.',
      ],
      solutions: [
        {
          label: 'Brute force',
          bigO: 'Time O(n²) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (nums[i] + nums[j] == target) {
                    System.out.println(i + " " + j);
                    return;
                }
    }
}`,
          explanation: [
            { type: 'p', text: 'Check every pair. Easy to reason about, but **O(n²)** — interviewers will ask you to do better.' },
          ],
        },
        {
          label: 'Optimal (HashMap)',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        HashMap<Integer, Integer> seen = new HashMap<>();   // value -> index
        for (int i = 0; i < n; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) {
                System.out.println(seen.get(need) + " " + i);
                return;
            }
            seen.put(nums[i], i);
        }
    }
}`,
          explanation: [
            { type: 'p', text: 'For each number `x`, its partner must be `target - x`. Keep a **HashMap of value → index** as you go. A map lookup is **O(1)**, so one pass solves it in **O(n)** time and **O(n)** space.' },
            { type: 'callout', variant: 'key', text: 'Trading **space for time** with a hash map is the single most common way to turn an O(n²) brute force into O(n). You’ll see it again and again.' },
          ],
        },
      ],
    },
    {
      id: 'dsa-arr-kadane',
      title: 'Maximum Subarray Sum',
      difficulty: 'Medium',
      tags: ['arrays', 'dynamic-programming'],
      isInterview: true,
      statement: [
        { type: 'p', text: 'Find the contiguous subarray (at least one element) with the **largest sum**, and print that sum. The famous **Kadane’s algorithm** problem.' },
      ],
      examples: [
        { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'The subarray [4, -1, 2, 1] sums to 6.' },
        { input: '1\n-3', output: '-3' },
      ],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the maximum subarray sum.',
      starterCode: STARTER,
      tests: [
        { stdin: '9\n-2 1 -3 4 -1 2 1 -5 4', expected: '6' },
        { stdin: '1\n-3', expected: '-3' },
        { stdin: '5\n1 2 3 4 5', expected: '15', hidden: true },
        { stdin: '4\n-1 -2 -3 -4', expected: '-1', hidden: true },
      ],
      hints: [
        'Brute force: try every (start, end) and sum it — O(n²).',
        'Kadane: keep "best sum ending here". Either extend the previous run or start fresh at the current element.',
      ],
      solutions: [
        {
          label: 'Brute force',
          bigO: 'Time O(n²) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        long best = a[0];
        for (int i = 0; i < n; i++) {
            long s = 0;
            for (int j = i; j < n; j++) {
                s += a[j];
                if (s > best) best = s;
            }
        }
        System.out.println(best);
    }
}`,
          explanation: [
            { type: 'p', text: 'Try every starting point and extend to every end, tracking the best sum. Correct, but **O(n²)**.' },
          ],
        },
        {
          label: 'Optimal (Kadane)',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        long best = a[0], cur = a[0];
        for (int i = 1; i < n; i++) {
            cur = Math.max(a[i], cur + a[i]);   // extend, or start fresh at a[i]
            best = Math.max(best, cur);
        }
        System.out.println(best);
    }
}`,
          explanation: [
            { type: 'p', text: '`cur` is the best sum of a subarray **ending at the current element**. At each step you either extend the previous run (`cur + a[i]`) or start a new one at `a[i]` — whichever is bigger. Track the overall `best`. One pass, **O(n)**.' },
            { type: 'analogy', text: 'A momentum streak: if your running total ever goes negative, it’s only dragging you down — drop it and start fresh.' },
          ],
        },
      ],
    },
    {
      id: 'dsa-arr-stock',
      title: 'Best Time to Buy & Sell Stock',
      difficulty: 'Easy',
      tags: ['arrays', 'greedy'],
      isInterview: true,
      statement: [
        { type: 'p', text: 'You’re given daily **prices**. Buy on one day and sell on a **later** day to maximise profit. Print the **maximum profit**, or `0` if no profitable trade exists.' },
      ],
      examples: [
        { input: '6\n7 1 5 3 6 4', output: '5', explanation: 'Buy at 1, sell at 6 → profit 5.' },
        { input: '5\n7 6 4 3 1', output: '0', explanation: 'Prices only fall — best is to not trade.' },
      ],
      constraints: ['1 ≤ n ≤ 10^5', '0 ≤ price ≤ 10^4'],
      ioNote: 'Line 1: n. Line 2: n prices. Output: the maximum profit (0 if none).',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n7 1 5 3 6 4', expected: '5' },
        { stdin: '5\n7 6 4 3 1', expected: '0' },
        { stdin: '1\n5', expected: '0', hidden: true },
        { stdin: '4\n2 4 1 9', expected: '8', hidden: true },
      ],
      hints: [
        'Brute force: try every buy day i and later sell day j — O(n²).',
        'One pass: track the lowest price so far; the best sale today is price - minSoFar.',
      ],
      solutions: [
        {
          label: 'Brute force',
          bigO: 'Time O(n²) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = sc.nextInt();

        int best = 0;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                best = Math.max(best, p[j] - p[i]);
        System.out.println(best);
    }
}`,
          explanation: [
            { type: 'p', text: 'Compare every buy day with every later sell day. Simple, but **O(n²)**.' },
          ],
        },
        {
          label: 'Optimal (one pass)',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = sc.nextInt();

        int minPrice = p[0], best = 0;
        for (int i = 0; i < n; i++) {
            best = Math.max(best, p[i] - minPrice);   // sell today
            minPrice = Math.min(minPrice, p[i]);      // or buy cheaper today
        }
        System.out.println(best);
    }
}`,
          explanation: [
            { type: 'p', text: 'Scan left to right tracking the **cheapest price so far**. The best profit if you sell *today* is `today - cheapestSoFar`. Keep the running max. One pass, **O(n)**.' },
          ],
        },
      ],
    },
  ],
};
