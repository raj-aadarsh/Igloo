import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const recursion: SubCourse = {
  id: 'recursion',
  slug: 'recursion',
  order: 8,
  title: 'Recursion & Backtracking',
  subtitle: 'Solve a problem using smaller copies of itself',
  icon: 'workflow',
  badge: { name: 'Recursion Ranger', emoji: '🌀' },
  learn: [
    {
      id: 'dsa-rec-l1',
      title: 'Recursion — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Recursion** is when a function calls itself on a **smaller version** of the problem until it hits a case simple enough to answer directly.' },
        { type: 'keyterms', title: 'Every recursion needs two things', terms: [
          { term: 'Base case', def: 'The smallest input you can answer without recursing. Without it, you recurse forever (stack overflow).' },
          { term: 'Recursive case', def: 'Reduce the problem toward the base case and combine the smaller answer(s).' },
        ] },
        { type: 'analogy', text: 'Russian nesting dolls: to count them, open one and count the rest (recursive case); the tiniest solid doll counts as 1 (base case).' },
        { type: 'callout', variant: 'warning', title: 'Two dangers', text: '• **No/wrong base case** → infinite recursion → `StackOverflowError`. • **Recomputing** the same subproblem (like naive Fibonacci) → exponential time. The fix is **memoization** (cache results) — you’ll feel the difference in the Fibonacci problem.' },
        { type: 'h2', text: 'Backtracking' },
        { type: 'p', text: '**Backtracking** is recursion that **builds a candidate step by step, and undoes a choice when it leads nowhere** — explore all options without repeating work. The shape is always: **choose → explore (recurse) → un-choose**.' },
        { type: 'callout', variant: 'key', text: 'Backtracking generates combinations/permutations/placements (subsets, parentheses, N-Queens, sudoku). It’s exponential in the worst case — that’s expected; the art is pruning dead branches early.' },
      ],
    },
    {
      id: 'dsa-rec-l2',
      title: 'Recursion & backtracking in Java',
      minutes: 6,
      blocks: [
        { type: 'h2', text: 'The basic shape' },
        { type: 'code', code: `static long factorial(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // recursive case
}` },
        { type: 'h2', text: 'Memoization (cache repeated subproblems)' },
        { type: 'code', code: `static long[] memo;
static long fib(int n) {
    if (n < 2) return n;                 // base cases: fib(0)=0, fib(1)=1
    if (memo[n] != -1) return memo[n];   // already computed
    return memo[n] = fib(n - 1) + fib(n - 2);
}
// in main: memo = new long[n + 1]; Arrays.fill(memo, -1);` },
        { type: 'h2', text: 'The backtracking template' },
        { type: 'code', code: `static void backtrack(State s) {
    if (isComplete(s)) { record(s); return; }
    for (Choice c : choices(s)) {
        apply(c, s);        // choose
        backtrack(s);       // explore
        undo(c, s);         // un-choose  <-- the "backtrack" step
    }
}` },
        { type: 'callout', variant: 'tip', text: 'Use a `StringBuilder` or a shared array as your "current candidate", appending/removing as you choose/un-choose — it avoids creating tons of temporary objects.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-rec-factorial',
      title: 'Factorial',
      difficulty: 'Easy',
      tags: ['recursion', 'warm-up'],
      statement: [{ type: 'p', text: 'Print `n!` (n factorial) using recursion. (`0! = 1`.)' }],
      examples: [{ input: '5', output: '120' }],
      constraints: ['0 ≤ n ≤ 20'],
      ioNote: 'Input: n. Output: n! (fits in a long for n ≤ 20).',
      starterCode: STARTER,
      tests: [
        { stdin: '5', expected: '120' },
        { stdin: '0', expected: '1' },
        { stdin: '10', expected: '3628800', hidden: true },
        { stdin: '20', expected: '2432902008176640000', hidden: true },
      ],
      hints: ['Base case: 0! and 1! are 1.', 'Recursive case: n! = n × (n−1)!. Use long to hold the big result.'],
      solutions: [
        {
          label: 'Recursion',
          bigO: 'Time O(n) · Space O(n) (call stack)',
          code: `import java.util.*;

public class Main {
    static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(factorial(sc.nextInt()));
    }
}`,
          explanation: [{ type: 'p', text: 'The base case stops the recursion at 1; each call multiplies `n` by the factorial of `n−1`. `long` holds values up to 20! comfortably.' }],
        },
      ],
    },
    {
      id: 'dsa-rec-fib',
      title: 'Fibonacci (and why memoization matters)',
      difficulty: 'Medium',
      tags: ['recursion', 'dynamic-programming'],
      isInterview: true,
      statement: [
        { type: 'p', text: 'Print the n-th Fibonacci number, where `fib(0)=0, fib(1)=1`. The naive recursion is beautiful but exponential — then we fix it with memoization.' },
      ],
      examples: [{ input: '10', output: '55' }],
      constraints: ['0 ≤ n ≤ 30'],
      ioNote: 'Input: n. Output: fib(n).',
      starterCode: STARTER,
      tests: [
        { stdin: '10', expected: '55' },
        { stdin: '0', expected: '0' },
        { stdin: '1', expected: '1', hidden: true },
        { stdin: '30', expected: '832040', hidden: true },
      ],
      hints: ['Naive: fib(n) = fib(n−1) + fib(n−2) with base cases 0 and 1.', 'That recomputes the same values exponentially — cache them in an array (memoization) to make it O(n).'],
      solutions: [
        {
          label: 'Naive recursion',
          bigO: 'Time O(2ⁿ) · Space O(n)',
          code: `import java.util.*;

public class Main {
    static long fib(int n) {
        if (n < 2) return n;
        return fib(n - 1) + fib(n - 2);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(fib(sc.nextInt()));
    }
}`,
          explanation: [{ type: 'p', text: 'Correct and elegant, but it recomputes the same subproblems over and over — **exponential** time. Fine for small n; hopeless beyond ~40.' }],
        },
        {
          label: 'Optimal (memoization)',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    static long[] memo;
    static long fib(int n) {
        if (n < 2) return n;
        if (memo[n] != -1) return memo[n];
        return memo[n] = fib(n - 1) + fib(n - 2);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        memo = new long[n + 1];
        Arrays.fill(memo, -1);
        System.out.println(fib(n));
    }
}`,
          explanation: [
            { type: 'p', text: 'Cache each result the first time you compute it; reuse it after. Now every `fib(k)` is computed once → **O(n)**. This caching idea is the bridge to **dynamic programming** (a whole topic later).' },
          ],
        },
      ],
    },
    {
      id: 'dsa-rec-subset-sum',
      title: 'Count Subsets With Target Sum',
      difficulty: 'Medium',
      tags: ['recursion', 'backtracking'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Count how many **subsets** of the array add up exactly to the target. Classic include/exclude recursion.' }],
      examples: [{ input: '3\n1 2 3\n3', output: '2', explanation: '{3} and {1,2}.' }],
      constraints: ['1 ≤ n ≤ 20'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: target. Output: the count of subsets summing to target.',
      starterCode: STARTER,
      tests: [
        { stdin: '3\n1 2 3\n3', expected: '2' },
        { stdin: '3\n1 1 1\n2', expected: '3' },
        { stdin: '4\n2 3 5 6\n8', expected: '2', hidden: true },
        { stdin: '1\n5\n5', expected: '1', hidden: true },
      ],
      hints: ['At each element you have two choices: include it or skip it.', 'Recurse on both; when you’ve decided every element, count it if the remaining target is 0.'],
      solutions: [
        {
          label: 'Include / exclude recursion',
          bigO: 'Time O(2ⁿ) · Space O(n)',
          code: `import java.util.*;

public class Main {
    static int[] a;
    static int n, count = 0;

    static void rec(int i, int remaining) {
        if (i == n) { if (remaining == 0) count++; return; }
        rec(i + 1, remaining);            // exclude a[i]
        rec(i + 1, remaining - a[i]);     // include a[i]
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int target = sc.nextInt();
        rec(0, target);
        System.out.println(count);
    }
}`,
          explanation: [{ type: 'p', text: 'Each element is either in or out — two recursive branches. After deciding all `n` elements, a remaining target of 0 means this subset hit the goal. The full decision tree has 2ⁿ leaves, hence **O(2ⁿ)** (a DP can speed this up — see Dynamic Programming).' }],
        },
      ],
    },
    {
      id: 'dsa-rec-parens',
      title: 'Generate Balanced Parentheses',
      difficulty: 'Medium',
      tags: ['backtracking'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Given `n` pairs of parentheses, print **all** valid (balanced) combinations, space-separated, in lexicographic order.' }],
      examples: [{ input: '2', output: '(()) ()()' }, { input: '3', output: '((())) (()()) (())() ()(()) ()()()' }],
      constraints: ['1 ≤ n ≤ 10'],
      ioNote: 'Input: n (number of pairs). Output: all valid combinations, space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '2', expected: '(()) ()()' },
        { stdin: '1', expected: '()' },
        { stdin: '3', expected: '((())) (()()) (())() ()(()) ()()()', hidden: true },
      ],
      hints: ['Build the string char by char. You may add "(" while you still have opens left.', 'You may add ")" only while there are more opens than closes so far. Adding "(" before ")" yields lexicographic order.'],
      solutions: [
        {
          label: 'Backtracking',
          bigO: 'Time O(4ⁿ / √n) (Catalan) · Space O(n)',
          code: `import java.util.*;

public class Main {
    static List<String> res = new ArrayList<>();

    static void gen(StringBuilder sb, int open, int close, int n) {
        if (sb.length() == 2 * n) { res.add(sb.toString()); return; }
        if (open < n) {                       // can open another "("
            sb.append('(');
            gen(sb, open + 1, close, n);
            sb.deleteCharAt(sb.length() - 1); // undo
        }
        if (close < open) {                   // can close a ")"
            sb.append(')');
            gen(sb, open, close + 1, n);
            sb.deleteCharAt(sb.length() - 1); // undo
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        gen(new StringBuilder(), 0, 0, sc.nextInt());
        System.out.println(String.join(" ", res));
    }
}`,
          explanation: [{ type: 'p', text: 'Two pruning rules keep every partial string valid: only add `(` if opens remain, only add `)` if it won’t exceed the opens. Adding `(` before `)` produces results in lexicographic order. The classic **choose → recurse → undo** backtracking shape.' }],
        },
      ],
    },
    {
      id: 'dsa-rec-permutations',
      title: 'All Permutations of a String',
      difficulty: 'Medium',
      tags: ['backtracking'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print **all permutations** of the given string (distinct characters), space-separated, in lexicographic order.' }],
      examples: [{ input: 'abc', output: 'abc acb bac bca cab cba' }],
      constraints: ['1 ≤ length ≤ 8', 'distinct characters'],
      ioNote: 'Input: one line (the string). Output: all permutations, space-separated, sorted.',
      starterCode: STARTER,
      tests: [
        { stdin: 'abc', expected: 'abc acb bac bca cab cba' },
        { stdin: 'ab', expected: 'ab ba' },
        { stdin: 'a', expected: 'a', hidden: true },
        { stdin: 'ba', expected: 'ab ba', hidden: true },
      ],
      hints: ['Backtrack: pick an unused character for each position.', 'Mark a character used, recurse, then unmark it. Collect results in a TreeSet to get them sorted.'],
      solutions: [
        {
          label: 'Backtracking',
          bigO: 'Time O(n · n!) · Space O(n)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    static TreeSet<String> res = new TreeSet<>();   // sorted + unique

    static void permute(char[] arr, boolean[] used, StringBuilder cur) {
        if (cur.length() == arr.length) { res.add(cur.toString()); return; }
        for (int i = 0; i < arr.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            cur.append(arr[i]);
            permute(arr, used, cur);
            cur.deleteCharAt(cur.length() - 1);   // undo
            used[i] = false;
        }
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        permute(s.toCharArray(), new boolean[s.length()], new StringBuilder());
        System.out.println(String.join(" ", res));
    }
}`,
          explanation: [{ type: 'p', text: 'For each position, try every character not yet used; mark it, recurse, then unmark (backtrack). A `TreeSet` keeps the output sorted and de-duplicated. There are n! permutations, so this is inherently **O(n · n!)**.' }],
        },
      ],
    },
    {
      id: 'dsa-rec-nqueens',
      title: 'N-Queens (count solutions)',
      difficulty: 'Hard',
      tags: ['backtracking'],
      isInterview: true,
      statement: [{ type: 'p', text: 'On an `n × n` board, count the number of ways to place `n` queens so that none attack each other (no two share a row, column, or diagonal). The quintessential backtracking problem.' }],
      examples: [{ input: '4', output: '2' }, { input: '8', output: '92' }],
      constraints: ['1 ≤ n ≤ 9'],
      ioNote: 'Input: n. Output: the number of distinct valid placements.',
      starterCode: STARTER,
      tests: [
        { stdin: '4', expected: '2' },
        { stdin: '1', expected: '1' },
        { stdin: '2', expected: '0', hidden: true },
        { stdin: '8', expected: '92', hidden: true },
      ],
      hints: ['Place one queen per row. Track used columns and both diagonals with boolean arrays.', 'Diagonals: cells share (row + col) on one diagonal and (row − col) on the other.'],
      solutions: [
        {
          label: 'Backtracking with diagonal sets',
          bigO: 'Time O(n!) · Space O(n)',
          code: `import java.util.*;

public class Main {
    static int n, count = 0;
    static boolean[] col, diag1, diag2;

    static void place(int row) {
        if (row == n) { count++; return; }
        for (int c = 0; c < n; c++) {
            int d1 = row + c, d2 = row - c + n - 1;
            if (col[c] || diag1[d1] || diag2[d2]) continue;   // attacked → skip
            col[c] = diag1[d1] = diag2[d2] = true;            // choose
            place(row + 1);                                   // explore
            col[c] = diag1[d1] = diag2[d2] = false;           // un-choose
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        col = new boolean[n];
        diag1 = new boolean[2 * n];
        diag2 = new boolean[2 * n];
        place(0);
        System.out.println(count);
    }
}`,
          explanation: [{ type: 'p', text: 'Place one queen per row, trying each column. A column is safe if its column and both diagonals (`row+col` and `row−col`) are free. Mark, recurse to the next row, then unmark. The boolean arrays make each safety check **O(1)**.' }],
        },
      ],
    },
  ],
};
