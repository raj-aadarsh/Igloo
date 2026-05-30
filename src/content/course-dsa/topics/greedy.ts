import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const greedy: SubCourse = {
  id: 'greedy',
  slug: 'greedy',
  order: 15,
  title: 'Greedy',
  subtitle: 'Take the best local choice — when it’s safe to',
  icon: 'sparkles',
  badge: { name: 'Greedy Genius', emoji: '⚡' },
  learn: [
    {
      id: 'dsa-greedy-l1',
      title: 'Greedy — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **greedy** algorithm builds a solution step by step, always taking the choice that looks **best right now** — and never reconsiders. When it’s valid, it’s wonderfully simple and fast.' },
        { type: 'h2', text: 'When does greedy actually work?' },
        { type: 'keyterms', terms: [
          { term: 'Greedy-choice property', def: 'A globally optimal solution can be reached by making locally optimal choices.' },
          { term: 'Optimal substructure', def: 'The optimal solution contains optimal solutions to subproblems.' },
        ] },
        { type: 'callout', variant: 'warning', title: 'The catch', text: 'Greedy is **not always correct**. "Fewest coins" is greedy for normal currency but fails for coins like {1, 3, 4} making 6 (greedy: 4+1+1=3 coins; optimal: 3+3=2). When greedy can be tricked, you usually need **DP**. Always sanity-check (or prove) the greedy choice.' },
        { type: 'h2', text: 'The usual recipe' },
        { type: 'ul', items: [
          'Find the right **ordering** (sort by end time, by ratio, by size…).',
          'Sweep through once, **committing** to the locally best option.',
          'Often pairs with **two pointers** or a **heap**.',
        ] },
        { type: 'callout', variant: 'key', text: 'Greedy vs DP, in one line: **greedy commits and never looks back; DP explores and remembers.** If a locally optimal choice can hurt you later, reach for DP instead.' },
      ],
    },
    {
      id: 'dsa-greedy-l2',
      title: 'The greedy shape in Java',
      minutes: 5,
      blocks: [
        { type: 'h2', text: 'Sort, then sweep' },
        { type: 'code', code: `// Example: pick the most non-overlapping intervals — sort by END time.
int[][] iv = ...;
Arrays.sort(iv, (a, b) -> Integer.compare(a[1], b[1]));

int count = 0, lastEnd = Integer.MIN_VALUE;
for (int[] it : iv) {
    if (it[0] >= lastEnd) {   // doesn't overlap what we already took
        count++;
        lastEnd = it[1];      // commit greedily
    }
}` },
        { type: 'h2', text: 'Two sorted pointers (match smallest that fits)' },
        { type: 'code', code: `Arrays.sort(need);
Arrays.sort(have);
int i = 0, j = 0, matched = 0;
while (i < need.length && j < have.length) {
    if (have[j] >= need[i]) { matched++; i++; j++; }  // this 'have' satisfies this 'need'
    else j++;                                          // try a bigger 'have'
}` },
        { type: 'callout', variant: 'tip', text: 'The hard part of greedy is rarely the code — it’s choosing the **right thing to sort by**. Try a few orderings on small examples; the correct one makes the proof "obvious".' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-greedy-cookies',
      title: 'Assign Cookies',
      difficulty: 'Easy',
      tags: ['greedy', 'two-pointers'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Each child has a greed factor; each cookie a size. A child is content if they get a cookie of size **≥** their greed. Each child gets at most one cookie. Print the **maximum number of content children**.' }],
      examples: [{ input: '3\n1 2 3\n2\n1 1', output: '1' }],
      constraints: ['1 ≤ children, cookies ≤ 10^5'],
      ioNote: 'Line 1: number of children. Line 2: greed factors. Line 3: number of cookies. Line 4: cookie sizes. Output: max content children.',
      starterCode: STARTER,
      tests: [
        { stdin: '3\n1 2 3\n2\n1 1', expected: '1' },
        { stdin: '2\n1 2\n3\n1 2 3', expected: '2' },
        { stdin: '1\n5\n1\n3', expected: '0', hidden: true },
        { stdin: '3\n1 1 1\n2\n1 1', expected: '2', hidden: true },
      ],
      hints: ['Sort both greed factors and cookie sizes.', 'Give the smallest sufficient cookie to the least greedy child (two pointers).'],
      solutions: [
        {
          label: 'Sort + two pointers',
          bigO: 'Time O(n log n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int g = sc.nextInt();
        int[] greed = new int[g];
        for (int i = 0; i < g; i++) greed[i] = sc.nextInt();
        int s = sc.nextInt();
        int[] size = new int[s];
        for (int i = 0; i < s; i++) size[i] = sc.nextInt();

        Arrays.sort(greed);
        Arrays.sort(size);
        int i = 0, j = 0, content = 0;
        while (i < g && j < s) {
            if (size[j] >= greed[i]) { content++; i++; j++; }   // satisfy this child
            else j++;                                            // cookie too small, try bigger
        }
        System.out.println(content);
    }
}`,
          explanation: [{ type: 'p', text: 'Greedy choice: hand the smallest cookie that still satisfies the least greedy remaining child — never "waste" a big cookie on a small need. Sorting both sides makes a single two-pointer sweep optimal. **O(n log n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-greedy-activities',
      title: 'Maximum Non-Overlapping Activities',
      difficulty: 'Medium',
      tags: ['greedy', 'intervals'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Given activities with start and end times, print the **maximum number** you can attend if you can only do one at a time (an activity ending exactly when another starts is fine).' }],
      examples: [{ input: '4\n1 3\n2 4\n3 5\n6 7', output: '3' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Next n lines: "start end". Output: max non-overlapping activities.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n1 3\n2 4\n3 5\n6 7', expected: '3' },
        { stdin: '3\n1 2\n2 3\n3 4', expected: '3' },
        { stdin: '2\n1 5\n2 3', expected: '1', hidden: true },
        { stdin: '1\n0 1', expected: '1', hidden: true },
      ],
      hints: ['Sort by EARLIEST end time — finishing sooner leaves the most room for others.', 'Pick an activity if its start ≥ the end of the last one you took.'],
      solutions: [
        {
          label: 'Sort by end time',
          bigO: 'Time O(n log n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] iv = new int[n][2];
        for (int i = 0; i < n; i++) { iv[i][0] = sc.nextInt(); iv[i][1] = sc.nextInt(); }
        Arrays.sort(iv, (a, b) -> Integer.compare(a[1], b[1]));   // by end time

        int count = 0, lastEnd = Integer.MIN_VALUE;
        for (int[] it : iv) {
            if (it[0] >= lastEnd) { count++; lastEnd = it[1]; }
        }
        System.out.println(count);
    }
}`,
          explanation: [{ type: 'p', text: 'Always taking the activity that **ends earliest** frees up the most time for what remains — this is provably optimal. Sort by end, then greedily accept any activity that starts at/after the last chosen end. **O(n log n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-greedy-jump',
      title: 'Jump Game (reachable?)',
      difficulty: 'Medium',
      tags: ['greedy'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Each value is the **maximum jump length** from that index. Starting at index 0, print `true` if you can reach the last index, else `false`.' }],
      examples: [{ input: '5\n2 3 1 1 4', output: 'true' }, { input: '5\n3 2 1 0 4', output: 'false' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n non-negative integers. Output: true or false.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n2 3 1 1 4', expected: 'true' },
        { stdin: '5\n3 2 1 0 4', expected: 'false' },
        { stdin: '1\n0', expected: 'true', hidden: true },
        { stdin: '2\n0 1', expected: 'false', hidden: true },
      ],
      hints: ['Track the farthest index reachable so far.', 'If you ever stand on an index beyond that reach, you’re stuck.'],
      solutions: [
        {
          label: 'Farthest-reach greedy',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        int farthest = 0;
        boolean ok = true;
        for (int i = 0; i < n; i++) {
            if (i > farthest) { ok = false; break; }     // can't even stand here
            farthest = Math.max(farthest, i + a[i]);
        }
        System.out.println(ok);
    }
}`,
          explanation: [{ type: 'p', text: 'Sweep left to right tracking the farthest index you could reach. If the loop ever reaches an index beyond that frontier, the last index is unreachable. Greedily extending the reach is enough — **O(n)**, no DP needed.' }],
        },
      ],
    },
    {
      id: 'dsa-greedy-jump2',
      title: 'Jump Game II (fewest jumps)',
      difficulty: 'Medium',
      tags: ['greedy'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Same setup, but now print the **minimum number of jumps** to reach the last index (the input always allows reaching it).' }],
      examples: [{ input: '5\n2 3 1 1 4', output: '2', explanation: 'index 0 → 1 → 4.' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the minimum number of jumps.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n2 3 1 1 4', expected: '2' },
        { stdin: '5\n2 3 0 1 4', expected: '2' },
        { stdin: '1\n0', expected: '0', hidden: true },
        { stdin: '3\n1 1 1', expected: '2', hidden: true },
      ],
      hints: ['Think of it as BFS by "level": from the current reachable window, what’s the farthest you can get?', 'When you reach the end of the current jump’s range, you must jump — increment and extend the range to the farthest seen.'],
      solutions: [
        {
          label: 'Greedy level sweep',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        int jumps = 0, curEnd = 0, farthest = 0;
        for (int i = 0; i < n - 1; i++) {           // no need to jump from the last index
            farthest = Math.max(farthest, i + a[i]);
            if (i == curEnd) {                       // exhausted current jump's range
                jumps++;
                curEnd = farthest;
            }
        }
        System.out.println(jumps);
    }
}`,
          explanation: [{ type: 'p', text: 'Treat each jump as a "level" of reachable indices. Within the current range, note the farthest you can reach; when you hit the range’s end you’re forced to jump, so increment and extend to that farthest. It’s BFS on a line, in **O(n)** with O(1) memory.' }],
        },
      ],
    },
    {
      id: 'dsa-greedy-gas',
      title: 'Gas Station',
      difficulty: 'Medium',
      tags: ['greedy'],
      isInterview: true,
      statement: [{ type: 'p', text: 'On a circular route, station `i` gives `gas[i]` fuel and it costs `cost[i]` to drive to the next. Print the index to **start** so you can complete the loop, or `-1` if impossible. (A unique answer exists when one is possible.)' }],
      examples: [{ input: '5\n1 2 3 4 5\n3 4 5 1 2', output: '3' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: gas at each station. Line 3: cost to next station. Output: the start index, or -1.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n1 2 3 4 5\n3 4 5 1 2', expected: '3' },
        { stdin: '3\n2 3 4\n3 4 3', expected: '-1' },
        { stdin: '1\n5\n4', expected: '0', hidden: true },
        { stdin: '2\n3 1\n1 2', expected: '0', hidden: true },
      ],
      hints: ['If total gas ≥ total cost, a solution exists.', 'Track a running tank; whenever it dips below 0, no station so far can be the start — restart from the next one.'],
      solutions: [
        {
          label: 'One-pass greedy',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] gas = new int[n], cost = new int[n];
        for (int i = 0; i < n; i++) gas[i] = sc.nextInt();
        for (int i = 0; i < n; i++) cost[i] = sc.nextInt();

        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < n; i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff;
            if (tank < 0) { start = i + 1; tank = 0; }   // can't start anywhere up to here
        }
        System.out.println(total >= 0 ? start : -1);
    }
}`,
          explanation: [{ type: 'p', text: 'If the whole loop’s gas ≥ cost, it’s solvable. The key insight: if you run dry between stations s..i, then no station in that stretch can be the start — so jump the candidate start to i+1. One pass finds it. **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-greedy-platforms',
      title: 'Minimum Number of Platforms',
      difficulty: 'Medium',
      tags: ['greedy', 'sorting'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Given train **arrival** and **departure** times, print the minimum number of platforms needed so no train waits. (A train arriving exactly when another departs still needs its own platform.)' }],
      examples: [{ input: '6\n900 940 950 1100 1500 1800\n910 1200 1120 1130 1900 2000', output: '3' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n arrival times. Line 3: n departure times. Output: minimum platforms.',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n900 940 950 1100 1500 1800\n910 1200 1120 1130 1900 2000', expected: '3' },
        { stdin: '1\n100\n200', expected: '1' },
        { stdin: '2\n100 200\n150 250', expected: '1', hidden: true },
        { stdin: '3\n100 100 100\n200 200 200', expected: '3', hidden: true },
      ],
      hints: ['Sort arrivals and departures separately.', 'Two pointers: if the next arrival is ≤ the earliest departure, a train is still here → need a platform; else one freed up.'],
      solutions: [
        {
          label: 'Sort + two pointers',
          bigO: 'Time O(n log n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n], dep = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        for (int i = 0; i < n; i++) dep[i] = sc.nextInt();
        Arrays.sort(arr);
        Arrays.sort(dep);

        int i = 0, j = 0, platforms = 0, maxPlatforms = 0;
        while (i < n) {
            if (arr[i] <= dep[j]) {       // a train arrives before the earliest one leaves
                platforms++;
                i++;
                maxPlatforms = Math.max(maxPlatforms, platforms);
            } else {                      // earliest train has left → platform freed
                platforms--;
                j++;
            }
        }
        System.out.println(maxPlatforms);
    }
}`,
          explanation: [{ type: 'p', text: 'Sort both lists, then merge them in time order: each arrival before the next departure needs a new platform; each departure frees one. The peak simultaneous occupancy is the answer. **O(n log n)**.' }],
        },
      ],
    },
  ],
};
