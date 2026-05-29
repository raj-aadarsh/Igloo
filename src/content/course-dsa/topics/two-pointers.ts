import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const twoPointers: SubCourse = {
  id: 'two-pointers',
  slug: 'two-pointers',
  order: 4,
  title: 'Two Pointers & Sliding Window',
  subtitle: 'Two techniques that crush array/string problems',
  icon: 'workflow',
  badge: { name: 'Pointer Pro', emoji: '👉' },
  learn: [
    {
      id: 'dsa-tp-l1',
      title: 'The two patterns',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'These aren’t data structures — they’re **techniques** that turn many O(n²) brute forces into clean O(n) passes. Two of the most reused ideas in interviews.' },
        { type: 'h2', text: '1 · Two pointers' },
        { type: 'ul', items: [
          '**Opposite ends** — one pointer at the start, one at the end, moving toward each other. Great on **sorted** arrays (pair sums) and for palindromes/containers.',
          '**Same direction** — a slow and a fast pointer moving forward (e.g. move zeroes, remove duplicates in place).',
        ] },
        { type: 'h2', text: '2 · Sliding window' },
        { type: 'p', text: 'A window `[left, right]` over the array/string. Slide `right` to grow it and `left` to shrink it, maintaining some running total — so you never re-scan the window.' },
        { type: 'widget', widget: 'sliding-window' },
        { type: 'ul', items: [
          '**Fixed window** — size `k` is constant (e.g. max sum of k consecutive).',
          '**Variable window** — grow/shrink to satisfy a condition (e.g. smallest subarray with sum ≥ target).',
        ] },
        { type: 'callout', variant: 'key', text: 'Pattern radar: **sorted array + find a pair/triplet** → two pointers from the ends. **"subarray/substring with some constraint"** → sliding window. Both are usually **O(n)**.' },
      ],
    },
    {
      id: 'dsa-tp-l2',
      title: 'The shapes in Java',
      minutes: 6,
      blocks: [
        { type: 'h2', text: 'Two pointers from both ends' },
        { type: 'code', code: `int i = 0, j = n - 1;
while (i < j) {
    int sum = a[i] + a[j];
    if (sum == target) { /* found */ break; }
    else if (sum < target) i++;   // need more → move left pointer up
    else j--;                     // too much → move right pointer down
}` },
        { type: 'h2', text: 'Slow / fast (same direction)' },
        { type: 'code', code: `int slow = 0;                 // next position to place a "kept" value
for (int fast = 0; fast < n; fast++) {
    if (a[fast] != 0) {       // keep non-zeros
        a[slow] = a[fast];
        slow++;
    }
}
// fill the rest with zeros, etc.` },
        { type: 'h2', text: 'Variable sliding window' },
        { type: 'code', code: `int left = 0;
long windowSum = 0;
for (int right = 0; right < n; right++) {
    windowSum += a[right];                 // expand
    while (windowSum >= target) {          // shrink while condition holds
        best = Math.min(best, right - left + 1);
        windowSum -= a[left];
        left++;
    }
}` },
        { type: 'callout', variant: 'tip', text: 'The window template is always: **expand `right`, then shrink `left` while the window is "too big/invalid"**, updating your answer as you go.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-tp-pair-sum',
      title: 'Pair With Target Sum (sorted)',
      difficulty: 'Easy',
      tags: ['two-pointers'],
      isInterview: true,
      statement: [{ type: 'p', text: 'The array is **sorted ascending**. Find two values that add up to the target and print their 0-based indices (smaller first), or `-1` if no pair exists. Use two pointers — no extra space.' }],
      examples: [{ input: '4\n1 2 7 11\n9', output: '1 2' }, { input: '3\n1 2 4\n100', output: '-1' }],
      constraints: ['1 ≤ n ≤ 10^5', 'array is sorted ascending'],
      ioNote: 'Line 1: n. Line 2: n sorted integers. Line 3: target. Output: the two indices, or -1.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n1 2 7 11\n9', expected: '1 2' },
        { stdin: '5\n1 2 3 4 6\n10', expected: '3 4' },
        { stdin: '3\n1 2 4\n100', expected: '-1', hidden: true },
        { stdin: '2\n2 7\n9', expected: '0 1', hidden: true },
      ],
      hints: ['Start one pointer at the left, one at the right.', 'If the sum is too small move left up; too big, move right down; equal → done.'],
      solutions: [
        {
          label: 'Two pointers',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int target = sc.nextInt();

        int i = 0, j = n - 1;
        while (i < j) {
            int sum = a[i] + a[j];
            if (sum == target) { System.out.println(i + " " + j); return; }
            else if (sum < target) i++;
            else j--;
        }
        System.out.println(-1);
    }
}`,
          explanation: [{ type: 'p', text: 'Because the array is sorted, the sum of the ends tells you exactly which pointer to move: too small → raise the left; too big → lower the right. **O(n)** time, **O(1)** space — no hash map needed (that’s the payoff of sorted input).' }],
        },
      ],
    },
    {
      id: 'dsa-tp-move-zeroes',
      title: 'Move Zeroes',
      difficulty: 'Easy',
      tags: ['two-pointers'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Move all `0`s to the **end** while keeping the order of the non-zero values. Print the resulting array, space-separated.' }],
      examples: [{ input: '5\n0 1 0 3 12', output: '1 3 12 0 0' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the rearranged array, space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n0 1 0 3 12', expected: '1 3 12 0 0' },
        { stdin: '3\n1 2 3', expected: '1 2 3' },
        { stdin: '1\n0', expected: '0', hidden: true },
        { stdin: '4\n0 0 1 0', expected: '1 0 0 0', hidden: true },
      ],
      hints: ['Slow/fast pointers: `slow` marks where the next non-zero goes.', 'Copy each non-zero to `slow` and advance it; then fill the tail with zeros.'],
      solutions: [
        {
          label: 'Slow / fast pointers',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        int slow = 0;
        for (int fast = 0; fast < n; fast++) {
            if (a[fast] != 0) { a[slow] = a[fast]; slow++; }
        }
        while (slow < n) { a[slow] = 0; slow++; }   // fill the rest with zeros

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { sb.append(a[i]); if (i < n - 1) sb.append(' '); }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: '`slow` always points to where the next kept value belongs. Copy non-zeros forward, then pad the remainder with zeros. One pass, in place — **O(n)** time, **O(1)** space.' }],
        },
      ],
    },
    {
      id: 'dsa-tp-max-sum-k',
      title: 'Max Sum Subarray of Size K',
      difficulty: 'Easy',
      tags: ['sliding-window'],
      statement: [{ type: 'p', text: 'Find the largest sum of any **k consecutive** elements. The textbook **fixed-window** problem.' }],
      examples: [{ input: '6\n2 1 5 1 3 2\n3', output: '9', explanation: '[5,1,3] = 9.' }],
      constraints: ['1 ≤ k ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: k. Output: the maximum window sum.',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n2 1 5 1 3 2\n3', expected: '9' },
        { stdin: '4\n1 2 3 4\n2', expected: '7' },
        { stdin: '1\n5\n1', expected: '5', hidden: true },
        { stdin: '5\n-1 -2 -3 -4 -5\n2', expected: '-3', hidden: true },
      ],
      hints: ['Sum the first k elements as the initial window.', 'Slide: add the new element, subtract the one leaving — don’t re-sum the whole window.'],
      solutions: [
        {
          label: 'Fixed sliding window',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int k = sc.nextInt();

        long sum = 0;
        for (int i = 0; i < k; i++) sum += a[i];
        long best = sum;
        for (int i = k; i < n; i++) {
            sum += a[i] - a[i - k];      // slide the window by one
            best = Math.max(best, sum);
        }
        System.out.println(best);
    }
}`,
          explanation: [{ type: 'p', text: 'Compute the first window’s sum once, then each slide is a single add + subtract instead of re-summing `k` elements. **O(n)** instead of O(n·k).' }],
        },
      ],
    },
    {
      id: 'dsa-tp-container',
      title: 'Container With Most Water',
      difficulty: 'Medium',
      tags: ['two-pointers'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Each number is a vertical line’s height. Pick two lines that, with the x-axis, hold the **most water**. Print that maximum area (`min(height) × distance`).' }],
      examples: [{ input: '9\n1 8 6 2 5 4 8 3 7', output: '49' }],
      constraints: ['2 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n heights. Output: the maximum area.',
      starterCode: STARTER,
      tests: [
        { stdin: '9\n1 8 6 2 5 4 8 3 7', expected: '49' },
        { stdin: '2\n1 1', expected: '1' },
        { stdin: '3\n4 3 2', expected: '4', hidden: true },
        { stdin: '2\n2 4', expected: '2', hidden: true },
      ],
      hints: ['Two pointers at both ends; area = min(height[i], height[j]) × (j − i).', 'Always move the pointer at the SHORTER line — it’s the limiting side.'],
      solutions: [
        {
          label: 'Two pointers',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] h = new int[n];
        for (int i = 0; i < n; i++) h[i] = sc.nextInt();

        int i = 0, j = n - 1;
        long best = 0;
        while (i < j) {
            long area = (long) Math.min(h[i], h[j]) * (j - i);
            best = Math.max(best, area);
            if (h[i] < h[j]) i++; else j--;     // move the shorter side
        }
        System.out.println(best);
    }
}`,
          explanation: [{ type: 'p', text: 'The area is capped by the **shorter** line, so moving that pointer inward is the only move that could help (moving the taller one can never increase the min). Start wide and converge — **O(n)** instead of checking all O(n²) pairs.' }],
        },
      ],
    },
    {
      id: 'dsa-tp-min-subarray',
      title: 'Minimum Size Subarray Sum',
      difficulty: 'Medium',
      tags: ['sliding-window'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Given positive integers and a target, print the length of the **smallest contiguous subarray** whose sum is **≥ target**, or `0` if none exists.' }],
      examples: [{ input: '6\n2 3 1 2 4 3\n7', output: '2', explanation: '[4,3] has sum 7.' }],
      constraints: ['1 ≤ n ≤ 10^5', 'values are positive'],
      ioNote: 'Line 1: n. Line 2: n positive integers. Line 3: target. Output: the minimum length, or 0.',
      starterCode: STARTER,
      tests: [
        { stdin: '6\n2 3 1 2 4 3\n7', expected: '2' },
        { stdin: '3\n1 1 1\n5', expected: '0' },
        { stdin: '1\n1\n1', expected: '1', hidden: true },
        { stdin: '5\n1 4 4 0 0\n4', expected: '1', hidden: true },
      ],
      hints: ['Grow a window by adding on the right.', 'While the sum is ≥ target, record the length and shrink from the left to find the smallest.'],
      solutions: [
        {
          label: 'Variable sliding window',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        long target = sc.nextLong();

        int left = 0, best = Integer.MAX_VALUE;
        long sum = 0;
        for (int right = 0; right < n; right++) {
            sum += a[right];
            while (sum >= target) {
                best = Math.min(best, right - left + 1);
                sum -= a[left];
                left++;
            }
        }
        System.out.println(best == Integer.MAX_VALUE ? 0 : best);
    }
}`,
          explanation: [{ type: 'p', text: 'Expand `right` to add elements; once the window reaches the target, shrink from `left` as far as possible while still ≥ target, recording the smallest length. Each index enters and leaves the window once → **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-tp-k-distinct',
      title: 'Longest Substring with At Most K Distinct',
      difficulty: 'Medium',
      tags: ['sliding-window', 'hashing'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the length of the longest substring containing **at most k distinct characters**.' }],
      examples: [
        { input: 'eceba\n2', output: '3', explanation: '"ece" has 2 distinct chars.' },
        { input: 'aabbcc\n2', output: '4' },
      ],
      constraints: ['0 ≤ length ≤ 10^5', '0 ≤ k'],
      ioNote: 'Line 1: the string. Line 2: k. Output: the longest valid substring length.',
      starterCode: STARTER,
      tests: [
        { stdin: 'eceba\n2', expected: '3' },
        { stdin: 'aabbcc\n2', expected: '4' },
        { stdin: 'aa\n1', expected: '2', hidden: true },
        { stdin: 'abc\n0', expected: '0', hidden: true },
      ],
      hints: ['Window + a HashMap of character → count inside the window.', 'When the map has more than k keys, shrink from the left until it’s ≤ k again.'],
      solutions: [
        {
          label: 'Window + frequency map',
          bigO: 'Time O(n) · Space O(k)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        int k = Integer.parseInt(br.readLine().trim());

        HashMap<Character, Integer> count = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            count.merge(c, 1, Integer::sum);
            while (count.size() > k) {                 // too many distinct → shrink
                char l = s.charAt(left);
                if (count.merge(l, -1, Integer::sum) == 0) count.remove(l);
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        System.out.println(best);
    }
}`,
          explanation: [{ type: 'p', text: 'The map’s size is the number of distinct characters in the window. Expand right; whenever distinct exceeds `k`, shrink from the left (removing a key when its count hits 0). **O(n)** time. Note `k = 0` correctly yields 0.' }],
        },
      ],
    },
  ],
};
