import type { SubCourse } from '../types';

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
          { term: 'Access arr[i]', def: '**O(1)** — instant, the whole point of arrays.' },
          { term: 'Search (unsorted)', def: '**O(n)** — you may have to scan everything.' },
          { term: 'Append at end', def: '**O(1)** amortised (for a dynamic array / Python list).' },
          { term: 'Insert / delete in middle', def: '**O(n)** — everything after it must shift.' },
        ] },
        { type: 'callout', variant: 'key', text: 'One-liner to remember: **arrays are great at reading by index, bad at inserting/removing in the middle.** If a problem does lots of middle inserts, an array may be the wrong tool.' },
        { type: 'h2', text: 'Big-O: the language of interviews' },
        { type: 'p', text: 'Every array problem ends with *"what’s the time and space complexity?"* Get a feel for the ladder — slide the input size:' },
        { type: 'widget', widget: 'bigo-cheat' },
        { type: 'callout', variant: 'tip', title: 'Static vs dynamic', text: 'In C/Java a raw array has a **fixed size**. Python’s **list** is a *dynamic array* — it grows automatically. Same idea, same O(1) indexing; you just don’t manage the size yourself.' },
      ],
    },
    {
      id: 'dsa-arrays-l2',
      title: 'Arrays in Python — every move you need',
      minutes: 8,
      blocks: [
        { type: 'p', text: 'Here’s the practical toolkit. You’ll use these constantly — read once, then reach for them while solving.' },
        { type: 'h2', text: 'Create, index, slice' },
        { type: 'code', code: 'nums = [5, 2, 9, 1]      # a list literal\nempty = []               # empty list\nzeros = [0] * 5          # [0, 0, 0, 0, 0]\n\nnums[0]      # 5      (first)\nnums[-1]     # 1      (last — negative indexes from the end)\nnums[1:3]    # [2, 9] (slice: start inclusive, end exclusive)\nnums[:2]     # [5, 2]\nnums[::-1]   # [1, 9, 2, 5]  (reversed copy)', caption: 'Indexing is O(1). Slicing makes a new list (O(k)).' },
        { type: 'h2', text: 'Add, remove, length' },
        { type: 'code', code: 'nums.append(7)     # add to end       — O(1)\nnums.pop()         # remove & return last — O(1)\nnums.pop(0)        # remove from front  — O(n) (shifts!)\nnums.insert(1, 99) # insert at index 1  — O(n)\nnums.remove(9)     # remove first 9     — O(n)\nlen(nums)          # number of elements — O(1)' },
        { type: 'h2', text: 'Loop over it (3 ways)' },
        { type: 'code', code: 'for x in nums:            # value only\n    print(x)\n\nfor i in range(len(nums)): # index\n    print(i, nums[i])\n\nfor i, x in enumerate(nums): # index AND value (very common!)\n    print(i, x)' },
        { type: 'h2', text: 'Sort, reverse, build' },
        { type: 'code', code: 'nums.sort()              # sorts in place        — O(n log n)\nbig = sorted(nums, reverse=True)  # returns a new sorted list\nnums.reverse()           # reverse in place\nsquares = [x*x for x in nums]     # list comprehension\ntotal, mx = sum(nums), max(nums)  # handy built-ins' },
        { type: 'h2', text: 'Reading input & printing output (don’t skip this!)' },
        { type: 'p', text: 'In the playground — and in real interviews/online judges — your program must **read input and print output itself**. This is part of writing a complete solution, not an afterthought.' },
        { type: 'code', code: 'import sys\n\ndata = sys.stdin.read().split()   # read everything, split on whitespace\nn = int(data[0])                  # first token\nnums = list(map(int, data[1:1+n]))# next n tokens as ints\n\nprint(sum(nums))                  # print the answer', caption: 'A reliable pattern: read all of stdin, split into tokens, parse what you need.' },
        { type: 'code', code: '# Printing a list space-separated (a common output format):\nprint(*nums)            # 5 2 9 1\nprint(" ".join(map(str, nums)))   # same thing, explicit', caption: '`print(*nums)` unpacks the list as separate arguments.' },
        { type: 'callout', variant: 'warning', title: 'Classic gotchas', text: '• Indexes start at **0**; the last is `len-1` (off-by-one bugs live here). • `b = a` does **not** copy — both names point to the same list; use `a[:]` or `a.copy()`. • `pop(0)`/`insert(0, x)` are **O(n)** — for front operations use a **deque** (later topic).' },
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
        { type: 'p', text: 'Given an array of integers, print the **sum** of all its elements. This one’s a warm-up to get comfortable reading input and printing output.' },
      ],
      examples: [
        { input: '4\n1 2 3 4', output: '10' },
        { input: '1\n5', output: '5' },
      ],
      constraints: ['1 ≤ n ≤ 10^5', '-10^9 ≤ arr[i] ≤ 10^9'],
      ioNote: 'Line 1: the integer n. Line 2: n space-separated integers. Output: a single integer — their sum.',
      starterCode: 'import sys\n\n# Read input from stdin and print the sum.\n',
      tests: [
        { stdin: '4\n1 2 3 4', expected: '10' },
        { stdin: '1\n5', expected: '5' },
        { stdin: '5\n-1 -2 -3 -4 -5', expected: '-15', hidden: true },
        { stdin: '3\n100 200 300', expected: '600', hidden: true },
      ],
      hints: [
        'Read everything with sys.stdin.read().split(), the first token is n.',
        'Parse the next n tokens as ints, then use the built-in sum().',
      ],
      solutions: [
        {
          label: 'One pass',
          bigO: 'Time O(n) · Space O(1)',
          code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\nprint(sum(nums))\n',
          explanation: [
            { type: 'p', text: 'Read all tokens, take `n`, parse the next `n` as integers, and sum them. `sum()` walks the list once, so it’s **O(n)** time and **O(1)** extra space.' },
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
      starterCode: 'import sys\n\n# Print the largest element.\n',
      tests: [
        { stdin: '5\n3 9 2 9 4', expected: '9' },
        { stdin: '1\n-7', expected: '-7' },
        { stdin: '4\n-5 -2 -9 -1', expected: '-1', hidden: true },
        { stdin: '6\n10 10 10 2 3 4', expected: '10', hidden: true },
      ],
      hints: [
        'Track a running best, starting from the first element.',
        'Or just use the built-in max() once you’ve parsed the list.',
      ],
      solutions: [
        {
          label: 'Single scan',
          bigO: 'Time O(n) · Space O(1)',
          code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\n\nbest = nums[0]\nfor x in nums:\n    if x > best:\n        best = x\nprint(best)\n',
          explanation: [
            { type: 'p', text: 'Keep a running maximum and update it as you scan — one pass, **O(n)**. (`print(max(nums))` does the same; writing the loop shows you understand it.)' },
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
      starterCode: 'import sys\n\n# Print the elements in reverse order, space-separated.\n',
      tests: [
        { stdin: '4\n1 2 3 4', expected: '4 3 2 1' },
        { stdin: '1\n9', expected: '9' },
        { stdin: '5\n5 4 3 2 1', expected: '1 2 3 4 5', hidden: true },
      ],
      hints: [
        'You can slice with nums[::-1], or swap with two pointers from both ends.',
        'Print space-separated with print(*reversed_list).',
      ],
      solutions: [
        {
          label: 'Slice',
          bigO: 'Time O(n) · Space O(n)',
          code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\nprint(*nums[::-1])\n',
          explanation: [
            { type: 'p', text: '`nums[::-1]` builds a reversed copy; `print(*...)` prints the items space-separated.' },
          ],
        },
        {
          label: 'Two pointers (in place)',
          bigO: 'Time O(n) · Space O(1)',
          code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\n\ni, j = 0, n - 1\nwhile i < j:\n    nums[i], nums[j] = nums[j], nums[i]\n    i += 1\n    j -= 1\nprint(*nums)\n',
          explanation: [
            { type: 'p', text: 'The **two-pointer** pattern: one index from the front, one from the back, swap and move inward until they meet. Reverses in place with **O(1)** extra space — a technique you’ll reuse a lot.' },
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
        { type: 'p', text: 'This is one of the most-asked interview questions ever — and a perfect lesson in trading space for time.' },
      ],
      examples: [
        { input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9.' },
        { input: '3\n3 2 4\n6', output: '1 2' },
      ],
      constraints: ['2 ≤ n ≤ 10^4', 'Exactly one solution exists.'],
      ioNote: 'Line 1: n. Line 2: n integers. Line 3: the target. Output: the two indices, space-separated.',
      starterCode: 'import sys\n\n# Find indices of the two numbers that sum to target.\n',
      tests: [
        { stdin: '4\n2 7 11 15\n9', expected: '0 1' },
        { stdin: '3\n3 2 4\n6', expected: '1 2' },
        { stdin: '2\n3 3\n6', expected: '0 1', hidden: true },
        { stdin: '5\n1 5 3 7 2\n9', expected: '1 3', hidden: true },
      ],
      hints: [
        'Brute force: try every pair (i, j) with two nested loops — O(n²).',
        'Better: as you scan, remember each number’s index in a dict. For each x, check if (target - x) was already seen.',
      ],
      solutions: [
        {
          label: 'Brute force',
          bigO: 'Time O(n²) · Space O(1)',
          code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\ntarget = int(data[1 + n])\n\nfor i in range(n):\n    for j in range(i + 1, n):\n        if nums[i] + nums[j] == target:\n            print(i, j)\n            break\n    else:\n        continue\n    break\n',
          explanation: [
            { type: 'p', text: 'Check every pair. It works and is easy to reason about, but with `n` up to 10⁴ that’s ~50 million checks — and it’s **O(n²)**. Interviewers will ask you to do better.' },
          ],
        },
        {
          label: 'Optimal (hash map)',
          bigO: 'Time O(n) · Space O(n)',
          code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\ntarget = int(data[1 + n])\n\nseen = {}                 # value -> index\nfor i, x in enumerate(nums):\n    need = target - x\n    if need in seen:\n        print(seen[need], i)\n        break\n    seen[x] = i\n',
          explanation: [
            { type: 'p', text: 'The key insight: for each number `x`, its partner must be `target - x`. Keep a **dict of value → index** as you go. A dict lookup is **O(1)**, so one pass solves it in **O(n)** time, using **O(n)** space for the dict.' },
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
        { type: 'p', text: 'Find the contiguous subarray (at least one element) with the **largest sum**, and print that sum. This is the famous **Kadane’s algorithm** problem.' },
      ],
      examples: [
        { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'The subarray [4, -1, 2, 1] sums to 6.' },
        { input: '1\n-3', output: '-3' },
      ],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: the maximum subarray sum.',
      starterCode: 'import sys\n\n# Print the maximum contiguous subarray sum.\n',
      tests: [
        { stdin: '9\n-2 1 -3 4 -1 2 1 -5 4', expected: '6' },
        { stdin: '1\n-3', expected: '-3' },
        { stdin: '5\n1 2 3 4 5', expected: '15', hidden: true },
        { stdin: '4\n-1 -2 -3 -4', expected: '-1', hidden: true },
      ],
      hints: [
        'Brute force: try every (start, end) and sum it — O(n²).',
        'Kadane: walk once, keeping "best sum ending here". Either extend the previous run or start fresh at the current element.',
      ],
      solutions: [
        {
          label: 'Brute force',
          bigO: 'Time O(n²) · Space O(1)',
          code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\n\nbest = nums[0]\nfor i in range(n):\n    s = 0\n    for j in range(i, n):\n        s += nums[j]\n        if s > best:\n            best = s\nprint(best)\n',
          explanation: [
            { type: 'p', text: 'Try every starting point and extend to every end, tracking the best sum. Correct, but **O(n²)**.' },
          ],
        },
        {
          label: 'Optimal (Kadane)',
          bigO: 'Time O(n) · Space O(1)',
          code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\n\nbest = cur = nums[0]\nfor x in nums[1:]:\n    cur = max(x, cur + x)   # extend, or start fresh at x\n    best = max(best, cur)\nprint(best)\n',
          explanation: [
            { type: 'p', text: '`cur` is the best sum of a subarray **ending at the current element**. At each step you either extend the previous run (`cur + x`) or start a new one at `x` — whichever is bigger. Track the overall `best`. One pass, **O(n)**.' },
            { type: 'analogy', text: 'A momentum streak: if your running total ever goes negative, it’s only dragging you down — drop it and start the streak fresh.' },
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
      starterCode: 'import sys\n\n# Print the maximum profit from one buy and a later sell.\n',
      tests: [
        { stdin: '6\n7 1 5 3 6 4', expected: '5' },
        { stdin: '5\n7 6 4 3 1', expected: '0' },
        { stdin: '1\n5', expected: '0', hidden: true },
        { stdin: '4\n2 4 1 9', expected: '8', hidden: true },
      ],
      hints: [
        'Brute force: try every buy day i and later sell day j — O(n²).',
        'One pass: track the lowest price seen so far; at each day, the best sale today is price - minSoFar.',
      ],
      solutions: [
        {
          label: 'Brute force',
          bigO: 'Time O(n²) · Space O(1)',
          code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nprices = list(map(int, data[1:1 + n]))\n\nbest = 0\nfor i in range(n):\n    for j in range(i + 1, n):\n        best = max(best, prices[j] - prices[i])\nprint(best)\n',
          explanation: [
            { type: 'p', text: 'Compare every buy day with every later sell day. Simple, but **O(n²)**.' },
          ],
        },
        {
          label: 'Optimal (one pass)',
          bigO: 'Time O(n) · Space O(1)',
          code: 'import sys\n\ndata = sys.stdin.read().split()\nn = int(data[0])\nprices = list(map(int, data[1:1 + n]))\n\nmin_price = prices[0]\nbest = 0\nfor p in prices:\n    best = max(best, p - min_price)   # sell today at best-so-far profit\n    min_price = min(min_price, p)     # or buy cheaper today\nprint(best)\n',
          explanation: [
            { type: 'p', text: 'Scan left to right tracking the **cheapest price so far**. The best profit if you sell *today* is `today - cheapestSoFar`. Keep the running max. One pass, **O(n)**.' },
          ],
        },
      ],
    },
  ],
};
