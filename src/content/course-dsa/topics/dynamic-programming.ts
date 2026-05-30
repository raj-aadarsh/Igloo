import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const dynamicProgramming: SubCourse = {
  id: 'dynamic-programming',
  slug: 'dynamic-programming',
  order: 14,
  title: 'Dynamic Programming',
  subtitle: 'Solve once, reuse forever — the interview boss level',
  icon: 'boxes',
  badge: { name: 'DP Dynamo', emoji: '🧩' },
  learn: [
    {
      id: 'dsa-dp-l1',
      title: 'DP — the essentials',
      minutes: 7,
      blocks: [
        { type: 'p', text: '**Dynamic Programming (DP)** solves a big problem by combining answers to **smaller overlapping subproblems**, computing each one **only once** and storing it. It’s the cure for the exponential blowup you saw in naive Fibonacci.' },
        { type: 'keyterms', title: 'DP applies when you have…', terms: [
          { term: 'Overlapping subproblems', def: 'The same smaller problem is solved many times (so caching helps).' },
          { term: 'Optimal substructure', def: 'The best answer is built from best answers to subproblems.' },
        ] },
        { type: 'h2', text: 'Two styles' },
        { type: 'ul', items: [
          '**Top-down (memoization)** — ordinary recursion + a cache. Write the natural recursion, then store results.',
          '**Bottom-up (tabulation)** — fill a `dp[]` table from the base cases upward, no recursion.',
        ] },
        { type: 'h2', text: 'The 4-step recipe' },
        { type: 'ol', items: [
          '**Define the state** — what does `dp[i]` (or `dp[i][j]`) mean? This is 80% of the battle.',
          '**Transition** — how does a state build on smaller ones?',
          '**Base case(s)** — the smallest states you know directly.',
          '**Order** — fill states so each depends only on already-computed ones.',
        ] },
        { type: 'callout', variant: 'key', text: 'DP is just **recursion + memory**. If you can write the brute-force recursion and spot that it repeats work, you can almost always turn it into DP. Nail the **state definition** and the rest follows.' },
        { type: 'widget', widget: 'bigo-cheat' },
      ],
    },
    {
      id: 'dsa-dp-l2',
      title: 'DP in Java',
      minutes: 6,
      blocks: [
        { type: 'h2', text: '1D tabulation (e.g. Fibonacci / climbing stairs)' },
        { type: 'code', code: `long[] dp = new long[n + 1];
dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];   // transition from smaller states
}
// dp[n] is the answer` },
        { type: 'h2', text: '"For each item, for each capacity" (knapsack-style)' },
        { type: 'code', code: `int[] dp = new int[W + 1];                 // dp[w] = best value within capacity w
for (int i = 0; i < n; i++) {
    for (int w = W; w >= weight[i]; w--) {  // iterate capacity DOWNWARD for 0/1 items
        dp[w] = Math.max(dp[w], dp[w - weight[i]] + value[i]);
    }
}` },
        { type: 'h2', text: '2D table (e.g. comparing two strings)' },
        { type: 'code', code: `int[][] dp = new int[n + 1][m + 1];   // all zeros = base case
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
        if (A.charAt(i - 1) == B.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
}` },
        { type: 'callout', variant: 'tip', text: 'Start by writing the recursion and a memo (`Integer[] / long[]` filled with a sentinel like −1). Once it works, you can often rewrite it as a clean bottom-up table. Use `long` whenever counts can grow large.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-dp-climb',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      tags: ['dp'],
      isInterview: true,
      statement: [{ type: 'p', text: 'You can climb **1 or 2** steps at a time. In how many distinct ways can you reach the top of `n` stairs?' }],
      examples: [{ input: '5', output: '8' }],
      constraints: ['0 ≤ n ≤ 45'],
      ioNote: 'Input: n. Output: the number of distinct ways (it’s the Fibonacci sequence).',
      starterCode: STARTER,
      tests: [
        { stdin: '5', expected: '8' },
        { stdin: '2', expected: '2' },
        { stdin: '1', expected: '1', hidden: true },
        { stdin: '10', expected: '89', hidden: true },
      ],
      hints: ['To reach step i you came from step i−1 (one step) or i−2 (two steps).', 'So ways(i) = ways(i−1) + ways(i−2) — Fibonacci. Tabulate it.'],
      solutions: [
        {
          label: 'Bottom-up DP',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] dp = new long[Math.max(2, n + 1)];
        dp[0] = 1; dp[1] = 1;
        for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
        System.out.println(dp[n]);
    }
}`,
          explanation: [{ type: 'p', text: 'The number of ways to reach a step is the sum of the ways to reach the two steps below it — exactly Fibonacci. Building the table bottom-up computes each state once → **O(n)** (and beats exponential naive recursion).' }],
        },
      ],
    },
    {
      id: 'dsa-dp-coin-change',
      title: 'Coin Change (fewest coins)',
      difficulty: 'Medium',
      tags: ['dp'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Given coin denominations and a target amount, print the **minimum number of coins** that sum to it, or `-1` if it’s impossible. You have unlimited coins of each type.' }],
      examples: [{ input: '3\n1 2 5\n11', output: '3', explanation: '5 + 5 + 1.' }],
      constraints: ['1 ≤ coins ≤ 50', '0 ≤ amount ≤ 10^4'],
      ioNote: 'Line 1: number of coin types. Line 2: the denominations. Line 3: the target amount. Output: fewest coins, or -1.',
      starterCode: STARTER,
      tests: [
        { stdin: '3\n1 2 5\n11', expected: '3' },
        { stdin: '1\n2\n3', expected: '-1' },
        { stdin: '1\n1\n0', expected: '0', hidden: true },
        { stdin: '4\n2 5 10 1\n27', expected: '4', hidden: true },
      ],
      hints: ['dp[a] = fewest coins to make amount a. Base: dp[0] = 0.', 'dp[a] = min over coins c of dp[a − c] + 1. Use a big sentinel for "impossible".'],
      solutions: [
        {
          label: 'Bottom-up DP',
          bigO: 'Time O(amount · coins) · Space O(amount)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int c = sc.nextInt();
        int[] coins = new int[c];
        for (int i = 0; i < c; i++) coins[i] = sc.nextInt();
        int amount = sc.nextInt();

        int INF = 1_000_000_000;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            for (int coin : coins)
                if (coin <= a && dp[a - coin] + 1 < dp[a])
                    dp[a] = dp[a - coin] + 1;

        System.out.println(dp[amount] >= INF ? -1 : dp[amount]);
    }
}`,
          explanation: [{ type: 'p', text: 'Build up the best answer for every amount from 0 to the target. For each amount, try ending with each coin and take the minimum. If the target stays at the sentinel, it’s unreachable → −1. **O(amount × coins)**.' }],
        },
      ],
    },
    {
      id: 'dsa-dp-house-robber',
      title: 'House Robber',
      difficulty: 'Medium',
      tags: ['dp'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Houses in a row each hold some money, but you **can’t rob two adjacent houses**. Print the maximum you can steal.' }],
      examples: [{ input: '5\n2 7 9 3 1', output: '12', explanation: '2 + 9 + 1.' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: money in each house. Output: the maximum non-adjacent sum.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n2 7 9 3 1', expected: '12' },
        { stdin: '4\n1 2 3 1', expected: '4' },
        { stdin: '1\n5', expected: '5', hidden: true },
        { stdin: '3\n2 1 1', expected: '3', hidden: true },
      ],
      hints: ['At each house decide: skip it (keep previous best) or rob it (best from two houses back + this).', 'dp[i] = max(dp[i−1], dp[i−2] + money[i]). You only need the last two values.'],
      solutions: [
        {
          label: 'Rolling DP',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long prev2 = 0, prev1 = 0;       // best up to i-2 and i-1
        for (int i = 0; i < n; i++) {
            long money = sc.nextLong();
            long cur = Math.max(prev1, prev2 + money);   // skip vs rob
            prev2 = prev1;
            prev1 = cur;
        }
        System.out.println(prev1);
    }
}`,
          explanation: [{ type: 'p', text: 'For each house, either skip it (carry `prev1`) or rob it (`prev2 + money`, since you can’t touch the adjacent house). The recurrence only needs the last two results, so it runs in **O(n)** time and **O(1)** space.' }],
        },
      ],
    },
    {
      id: 'dsa-dp-lis',
      title: 'Longest Increasing Subsequence',
      difficulty: 'Medium',
      tags: ['dp'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the length of the longest **strictly increasing subsequence** (not necessarily contiguous).' }],
      examples: [{ input: '6\n10 9 2 5 3 7', output: '3', explanation: '2, 3, 7 (or 2, 5, 7).' }],
      constraints: ['1 ≤ n ≤ 2500'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the LIS length.',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n10 9 2 5 3 7', expected: '3' },
        { stdin: '5\n1 2 3 4 5', expected: '5' },
        { stdin: '1\n5', expected: '1', hidden: true },
        { stdin: '4\n5 4 3 2', expected: '1', hidden: true },
      ],
      hints: ['dp[i] = length of the LIS ending exactly at index i.', 'dp[i] = 1 + max(dp[j]) over all j < i with a[j] < a[i]. Answer = max dp[i].'],
      solutions: [
        {
          label: 'O(n²) DP',
          bigO: 'Time O(n²) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        int best = (n > 0) ? 1 : 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            }
            best = Math.max(best, dp[i]);
        }
        System.out.println(best);
    }
}`,
          explanation: [{ type: 'p', text: '`dp[i]` is the best increasing run that ends at `i`. To extend, look back at every smaller-valued earlier element and take the longest. **O(n²)**. (A clever patience-sorting + binary search version reaches O(n log n) — a great follow-up.)' }],
        },
      ],
    },
    {
      id: 'dsa-dp-knapsack',
      title: '0/1 Knapsack',
      difficulty: 'Medium',
      tags: ['dp'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Each item has a weight and a value; you may take each item **at most once**. Print the **maximum value** that fits within capacity `W`. The canonical DP.' }],
      examples: [{ input: '3 50\n10 20 30\n60 100 120', output: '220', explanation: 'Take items of weight 20 and 30 → value 220.' }],
      constraints: ['1 ≤ n ≤ 1000', '1 ≤ W ≤ 10^4'],
      ioNote: 'Line 1: "n W". Line 2: n weights. Line 3: n values. Output: the maximum value within capacity W.',
      starterCode: STARTER,
      tests: [
        { stdin: '3 50\n10 20 30\n60 100 120', expected: '220' },
        { stdin: '2 4\n1 3\n15 20', expected: '35' },
        { stdin: '1 5\n10\n100', expected: '0', hidden: true },
        { stdin: '3 4\n4 5 1\n1 2 3', expected: '3', hidden: true },
      ],
      hints: ['dp[w] = best value achievable with capacity w.', 'For each item, update capacities from W DOWN to its weight (so each item is used at most once).'],
      solutions: [
        {
          label: '1D DP (space-optimised)',
          bigO: 'Time O(n · W) · Space O(W)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), W = sc.nextInt();
        int[] wt = new int[n], val = new int[n];
        for (int i = 0; i < n; i++) wt[i] = sc.nextInt();
        for (int i = 0; i < n; i++) val[i] = sc.nextInt();

        int[] dp = new int[W + 1];
        for (int i = 0; i < n; i++)
            for (int w = W; w >= wt[i]; w--)
                dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);

        System.out.println(dp[W]);
    }
}`,
          explanation: [{ type: 'p', text: 'For each item, decide for every capacity whether including it beats leaving it out. Iterating capacity **downward** ensures each item is counted at most once (0/1). **O(n·W)** — the textbook knapsack, compressed to a 1D array.' }],
        },
      ],
    },
    {
      id: 'dsa-dp-lcs',
      title: 'Longest Common Subsequence',
      difficulty: 'Medium',
      tags: ['dp'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Given two strings, print the length of their **longest common subsequence** (characters in order, not necessarily contiguous). The classic 2D DP.' }],
      examples: [{ input: 'abcde\nace', output: '3', explanation: '"ace".' }],
      constraints: ['0 ≤ length ≤ 1000'],
      ioNote: 'Line 1: string A. Line 2: string B. Output: the LCS length.',
      starterCode: STARTER,
      tests: [
        { stdin: 'abcde\nace', expected: '3' },
        { stdin: 'abc\nabc', expected: '3' },
        { stdin: 'abc\ndef', expected: '0', hidden: true },
        { stdin: 'AGGTAB\nGXTXAYB', expected: '4', hidden: true },
      ],
      hints: ['dp[i][j] = LCS length of A’s first i chars and B’s first j chars.', 'If A[i−1]==B[j−1]: dp[i][j]=dp[i−1][j−1]+1; else max(dp[i−1][j], dp[i][j−1]).'],
      solutions: [
        {
          label: '2D DP table',
          bigO: 'Time O(n · m) · Space O(n · m)',
          code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String A = br.readLine(); if (A == null) A = "";
        String B = br.readLine(); if (B == null) B = "";
        int n = A.length(), m = B.length();

        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (A.charAt(i - 1) == B.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
                else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        System.out.println(dp[n][m]);
    }
}`,
          explanation: [{ type: 'p', text: 'Each cell asks: "best match using these prefixes?" If the current characters match, extend the diagonal; otherwise drop one character from A or B and take the better. Fill the grid and read the bottom-right corner. **O(n·m)** — the backbone of diff tools.' }],
        },
      ],
    },
  ],
};
