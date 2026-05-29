import type { Problem } from './types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

// Standalone "boss" problems for the Interview Arena. The Arena also pulls in
// every problem flagged \`isInterview\` from the sub-courses; these are extra
// classics that don't belong to a single beginner topic.
export const arenaExtraProblems: Problem[] = [
  {
    id: 'dsa-arena-lsws',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['strings', 'sliding-window', 'hashing'],
    isInterview: true,
    statement: [
      { type: 'p', text: 'Given a string, find the length of the **longest substring with no repeating characters**. A staple of the **sliding-window** pattern.' },
    ],
    examples: [
      { input: 'abcabcbb', output: '3', explanation: '"abc" has length 3.' },
      { input: 'bbbbb', output: '1' },
      { input: 'pwwkew', output: '3', explanation: '"wke" has length 3.' },
    ],
    constraints: ['0 ≤ length ≤ 10^5', 'String may be empty.'],
    ioNote: 'Input: one line — the string (may be empty). Output: the length of the longest substring without repeats.',
    starterCode: STARTER,
    tests: [
      { stdin: 'abcabcbb', expected: '3' },
      { stdin: 'bbbbb', expected: '1' },
      { stdin: 'pwwkew', expected: '3' },
      { stdin: '', expected: '0', hidden: true },
      { stdin: 'abba', expected: '2', hidden: true },
    ],
    hints: [
      'Read the line with a BufferedReader (handle an empty/null line as "").',
      'Use a window [left, right]; store each char’s last index in a HashMap and jump left forward on a repeat.',
    ],
    solutions: [
      {
        label: 'Sliding window',
        bigO: 'Time O(n) · Space O(min(n, alphabet))',
        code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";

        HashMap<Character, Integer> last = new HashMap<>();  // char -> last index
        int left = 0, best = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (last.containsKey(c) && last.get(c) >= left) {
                left = last.get(c) + 1;        // jump past the duplicate
            }
            last.put(c, i);
            best = Math.max(best, i - left + 1);
        }
        System.out.println(best);
    }
}`,
        explanation: [
          { type: 'p', text: 'Grow a window to the right. The moment a character repeats *inside* the window, move `left` to just past its previous position. The window always holds a unique-character substring, so its widest size is the answer. One pass, **O(n)**.' },
        ],
      },
    ],
  },
  {
    id: 'dsa-arena-rainwater',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    tags: ['arrays', 'two-pointers'],
    isInterview: true,
    statement: [
      { type: 'p', text: 'Given heights of bars (each width 1), compute how much **rain water** is trapped between them after it rains. A famous hard interview question with a beautiful two-pointer solution.' },
    ],
    examples: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6' },
      { input: '6\n4 2 0 3 2 5', output: '9' },
    ],
    constraints: ['1 ≤ n ≤ 10^5', '0 ≤ height ≤ 10^4'],
    ioNote: 'Line 1: n. Line 2: n bar heights. Output: total trapped water.',
    starterCode: STARTER,
    tests: [
      { stdin: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expected: '6' },
      { stdin: '6\n4 2 0 3 2 5', expected: '9' },
      { stdin: '3\n5 5 5', expected: '0', hidden: true },
      { stdin: '1\n4', expected: '0', hidden: true },
    ],
    hints: [
      'Water above a bar = min(tallest to its left, tallest to its right) - its own height.',
      'Two pointers from both ends, always moving the shorter side, does it in O(1) space.',
    ],
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

        int left = 0, right = n - 1, leftMax = 0, rightMax = 0;
        long water = 0;
        while (left < right) {
            if (h[left] < h[right]) {
                leftMax = Math.max(leftMax, h[left]);
                water += leftMax - h[left];
                left++;
            } else {
                rightMax = Math.max(rightMax, h[right]);
                water += rightMax - h[right];
                right--;
            }
        }
        System.out.println(water);
    }
}`,
        explanation: [
          { type: 'p', text: 'Move two pointers inward, always advancing the **shorter** side. Because that side is the bottleneck, the water over the current bar is decided by the running max on that side. Accumulate as you go — **O(n)** time, **O(1)** space.' },
        ],
      },
    ],
  },
];
