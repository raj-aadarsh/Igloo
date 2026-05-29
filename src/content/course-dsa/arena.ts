import type { Problem } from './types';

// Standalone "boss" problems for the Interview Arena. The Arena also pulls in
// every problem flagged `isInterview` from the sub-courses; these are extra
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
    starterCode: 'import sys\n\ns = sys.stdin.readline().rstrip("\\n")\n# Print the length of the longest substring without repeating characters.\n',
    tests: [
      { stdin: 'abcabcbb', expected: '3' },
      { stdin: 'bbbbb', expected: '1' },
      { stdin: 'pwwkew', expected: '3' },
      { stdin: '', expected: '0', hidden: true },
      { stdin: 'abba', expected: '2', hidden: true },
    ],
    hints: [
      'Use a window [left, right]. Expand right; when you hit a repeat, shrink from the left.',
      'Store each character’s last index in a dict so you can jump `left` forward instantly.',
    ],
    solutions: [
      {
        label: 'Sliding window',
        bigO: 'Time O(n) · Space O(min(n, alphabet))',
        code: 'import sys\n\ns = sys.stdin.readline().rstrip("\\n")\n\nlast = {}          # char -> last index seen\nleft = 0\nbest = 0\nfor right, c in enumerate(s):\n    if c in last and last[c] >= left:\n        left = last[c] + 1      # jump past the duplicate\n    last[c] = right\n    best = max(best, right - left + 1)\nprint(best)\n',
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
    starterCode: 'import sys\n\n# Print the total trapped rain water.\n',
    tests: [
      { stdin: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expected: '6' },
      { stdin: '6\n4 2 0 3 2 5', expected: '9' },
      { stdin: '3\n5 5 5', expected: '0', hidden: true },
      { stdin: '1\n4', expected: '0', hidden: true },
    ],
    hints: [
      'Water above a bar = min(tallest to its left, tallest to its right) - its own height.',
      'Two pointers from both ends, always moving the shorter side, lets you do it in O(1) space.',
    ],
    solutions: [
      {
        label: 'Two pointers',
        bigO: 'Time O(n) · Space O(1)',
        code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nh = list(map(int, data[1:1 + n]))\n\nleft, right = 0, n - 1\nleft_max = right_max = 0\nwater = 0\nwhile left < right:\n    if h[left] < h[right]:\n        left_max = max(left_max, h[left])\n        water += left_max - h[left]\n        left += 1\n    else:\n        right_max = max(right_max, h[right])\n        water += right_max - h[right]\n        right -= 1\nprint(water)\n',
        explanation: [
          { type: 'p', text: 'Move two pointers inward, always advancing the **shorter** side. Because that side is the bottleneck, the water over the current bar is decided by the running max on that side. Accumulate as you go — **O(n)** time, **O(1)** space.' },
        ],
      },
    ],
  },
];
