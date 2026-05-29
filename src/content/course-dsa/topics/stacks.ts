import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const stacks: SubCourse = {
  id: 'stacks',
  slug: 'stacks',
  order: 5,
  title: 'Stacks',
  subtitle: 'Last-in-first-out — and the monotonic-stack trick',
  icon: 'layers',
  badge: { name: 'Stack Star', emoji: '🥞' },
  learn: [
    {
      id: 'dsa-stacks-l1',
      title: 'Stacks — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **stack** is a Last-In-First-Out (**LIFO**) pile: you only ever add to or remove from the **top**. Think of a stack of plates.' },
        { type: 'widget', widget: 'stack-viz' },
        { type: 'keyterms', title: 'The three operations (all O(1))', terms: [
          { term: 'push(x)', def: 'Put x on top.' },
          { term: 'pop()', def: 'Remove & return the top.' },
          { term: 'peek()', def: 'Look at the top without removing it.' },
        ] },
        { type: 'h2', text: 'Where stacks show up' },
        { type: 'ul', items: [
          '**Matching pairs** — brackets, tags, undo/redo.',
          '**Reversing** things (push all, pop all).',
          '**Expression evaluation** (e.g. Reverse Polish Notation).',
          '**Monotonic stack** — the secret weapon for "next greater / smaller element" problems.',
          'Under the hood: function calls (the "call stack") and iterative DFS.',
        ] },
        { type: 'callout', variant: 'key', text: 'Whenever a problem is about **"the most recent unmatched thing"** or **"the next greater/smaller element"**, a stack is almost certainly the tool.' },
      ],
    },
    {
      id: 'dsa-stacks-l2',
      title: 'Stacks in Java',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Java has a legacy `Stack` class, but the modern, faster choice is **`ArrayDeque`** used as a stack.' },
        { type: 'code', code: `import java.util.*;

Deque<Integer> stack = new ArrayDeque<>();
stack.push(10);      // add to top
stack.push(20);
stack.peek();        // 20  (look, don't remove)
stack.pop();         // 20  (remove & return)
stack.isEmpty();     // false
stack.size();        // 1` },
        { type: 'callout', variant: 'tip', title: 'Why ArrayDeque over Stack?', text: 'The old `java.util.Stack` is synchronised (slower) and extends `Vector`. `ArrayDeque` is the recommended, faster stack — interviewers like seeing it.' },
        { type: 'h2', text: 'A character stack (for bracket / string problems)' },
        { type: 'code', code: `Deque<Character> st = new ArrayDeque<>();
st.push('(');
if (!st.isEmpty() && st.peek() == '(') st.pop();

// Tip: a StringBuilder also works as a fast char stack —
// append() to push, deleteCharAt(length-1) to pop.` },
        { type: 'callout', variant: 'warning', text: 'Always check `isEmpty()` before `pop()`/`peek()` — popping an empty `ArrayDeque` throws an exception. Many bracket-matching bugs are a missing empty-check.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-stk-valid-parens',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      tags: ['stacks'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Given a string of brackets `()[]{}`, print `true` if they are correctly opened and closed (and properly nested), else `false`.' }],
      examples: [{ input: '()[]{}', output: 'true' }, { input: '([)]', output: 'false' }],
      constraints: ['0 ≤ length ≤ 10^4', 'Only the characters ()[]{}'],
      ioNote: 'Input: one line of brackets (may be empty). Output: true or false.',
      starterCode: STARTER,
      tests: [
        { stdin: '()[]{}', expected: 'true' },
        { stdin: '(]', expected: 'false' },
        { stdin: '([)]', expected: 'false' },
        { stdin: '{[]}', expected: 'true', hidden: true },
        { stdin: '(((', expected: 'false', hidden: true },
      ],
      hints: ['Push every opening bracket.', 'On a closing bracket, pop and check it matches. At the end the stack must be empty.'],
      solutions: [
        {
          label: 'Stack of openers',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        Deque<Character> st = new ArrayDeque<>();
        boolean ok = true;
        for (int i = 0; i < s.length() && ok; i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.isEmpty()) { ok = false; break; }
                char open = st.pop();
                if ((c == ')' && open != '(') ||
                    (c == ']' && open != '[') ||
                    (c == '}' && open != '{')) ok = false;
            }
        }
        if (!st.isEmpty()) ok = false;
        System.out.println(ok);
    }
}`,
          explanation: [{ type: 'p', text: 'Push openers; each closer must match the **most recent** opener (the top). Leftover openers at the end (non-empty stack) means unbalanced. **O(n)** — the textbook stack problem.' }],
        },
      ],
    },
    {
      id: 'dsa-stk-reverse',
      title: 'Reverse Using a Stack',
      difficulty: 'Easy',
      tags: ['stacks', 'warm-up'],
      statement: [{ type: 'p', text: 'Reverse a string by **pushing each character onto a stack and popping them off**. (You know stacks reverse things — prove it.)' }],
      examples: [{ input: 'hello', output: 'olleh' }],
      constraints: ['0 ≤ length ≤ 10^5'],
      ioNote: 'Input: one line. Output: the reversed string.',
      starterCode: STARTER,
      tests: [
        { stdin: 'hello', expected: 'olleh' },
        { stdin: 'abc', expected: 'cba' },
        { stdin: 'a', expected: 'a', hidden: true },
        { stdin: 'stack', expected: 'kcats', hidden: true },
      ],
      hints: ['Push every character.', 'Then pop until empty, appending each popped char.'],
      solutions: [
        {
          label: 'Push all, pop all',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        Deque<Character> st = new ArrayDeque<>();
        for (int i = 0; i < s.length(); i++) st.push(s.charAt(i));
        StringBuilder sb = new StringBuilder();
        while (!st.isEmpty()) sb.append(st.pop());
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Because the last character pushed is the first popped (LIFO), popping the whole stack yields the reverse. **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-stk-remove-adjacent',
      title: 'Remove All Adjacent Duplicates',
      difficulty: 'Medium',
      tags: ['stacks', 'strings'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Repeatedly remove **two adjacent equal characters** until none remain, then print what’s left (which may be empty).' }],
      examples: [
        { input: 'abbaca', output: 'ca', explanation: 'remove "bb" → "aaca", remove "aa" → "ca".' },
        { input: 'azxxzy', output: 'ay' },
      ],
      constraints: ['0 ≤ length ≤ 10^5', 'lowercase letters'],
      ioNote: 'Input: one line. Output: the reduced string (possibly empty).',
      starterCode: STARTER,
      tests: [
        { stdin: 'abbaca', expected: 'ca' },
        { stdin: 'azxxzy', expected: 'ay' },
        { stdin: 'aaaaaa', expected: '', hidden: true },
        { stdin: 'abc', expected: 'abc', hidden: true },
      ],
      hints: ['Walk the string keeping a stack of surviving characters.', 'If the next char equals the top of the stack, pop instead of pushing.'],
      solutions: [
        {
          label: 'Stack (StringBuilder)',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        StringBuilder st = new StringBuilder();   // used as a stack
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (st.length() > 0 && st.charAt(st.length() - 1) == c) {
                st.deleteCharAt(st.length() - 1);   // pop the matching pair
            } else {
                st.append(c);                       // push
            }
        }
        System.out.println(st.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Keep a stack of survivors. If the current char matches the top, they cancel (pop); otherwise push. One pass, **O(n)** — far simpler than repeatedly rescanning the string.' }],
        },
      ],
    },
    {
      id: 'dsa-stk-next-greater',
      title: 'Next Greater Element',
      difficulty: 'Medium',
      tags: ['stacks', 'monotonic-stack'],
      isInterview: true,
      statement: [{ type: 'p', text: 'For each element, find the **next element to its right that is greater** than it (or `-1` if none). Print the n answers, space-separated.' }],
      examples: [
        { input: '4\n4 5 2 25', output: '5 25 25 -1' },
        { input: '3\n13 7 6', output: '-1 -1 -1' },
      ],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n integers. Output: n values (next greater, or -1), space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n4 5 2 25', expected: '5 25 25 -1' },
        { stdin: '3\n13 7 6', expected: '-1 -1 -1' },
        { stdin: '4\n1 3 2 4', expected: '3 4 4 -1', hidden: true },
        { stdin: '1\n5', expected: '-1', hidden: true },
      ],
      hints: ['Brute force: for each i, scan right for the first bigger value — O(n²).', 'Optimal: a stack of indices that are still "waiting" for their next greater element (a monotonic stack).'],
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
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            int ans = -1;
            for (int j = i + 1; j < n; j++) if (a[j] > a[i]) { ans = a[j]; break; }
            sb.append(ans);
            if (i < n - 1) sb.append(' ');
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'For each element, scan to the right for the first bigger value. Correct but **O(n²)**.' }],
        },
        {
          label: 'Optimal (monotonic stack)',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        int[] res = new int[n];
        Deque<Integer> st = new ArrayDeque<>();   // indices waiting for a bigger value
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && a[st.peek()] < a[i]) res[st.pop()] = a[i];
            st.push(i);
        }
        while (!st.isEmpty()) res[st.pop()] = -1;   // nothing bigger to the right

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { sb.append(res[i]); if (i < n - 1) sb.append(' '); }
        System.out.println(sb.toString());
    }
}`,
          explanation: [
            { type: 'p', text: 'Keep a stack of indices whose "next greater" hasn’t been found yet. When a bigger value arrives, it resolves everything smaller on top of the stack. Each index is pushed and popped once → **O(n)**. This is the **monotonic stack** pattern — learn it well; it powers a whole family of problems.' },
          ],
        },
      ],
    },
    {
      id: 'dsa-stk-rpn',
      title: 'Evaluate Reverse Polish Notation',
      difficulty: 'Medium',
      tags: ['stacks'],
      isInterview: true,
      statement: [
        { type: 'p', text: 'Evaluate an expression in **Reverse Polish Notation** (operators come after their operands). Print the integer result. Division truncates toward zero.' },
        { type: 'p', text: 'Example: `2 1 + 3 *` means `(2 + 1) * 3 = 9`.' },
      ],
      examples: [
        { input: '2 1 + 3 *', output: '9' },
        { input: '4 13 5 / +', output: '6', explanation: '4 + (13 / 5 = 2) = 6.' },
      ],
      constraints: ['Tokens are integers and the operators + - * /', 'The expression is valid'],
      ioNote: 'Input: one line of space-separated tokens. Output: the integer result.',
      starterCode: STARTER,
      tests: [
        { stdin: '2 1 + 3 *', expected: '9' },
        { stdin: '4 13 5 / +', expected: '6' },
        { stdin: '5', expected: '5', hidden: true },
        { stdin: '3 4 + 2 *', expected: '14', hidden: true },
      ],
      hints: ['Scan tokens left to right with a stack of numbers.', 'On an operator, pop two numbers, apply it, push the result. The final stack value is the answer.'],
      solutions: [
        {
          label: 'Number stack',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) line = "";
        Deque<Integer> st = new ArrayDeque<>();
        for (String tok : line.trim().split("\\\\s+")) {
            if (tok.isEmpty()) continue;
            switch (tok) {
                case "+": { int b = st.pop(), a = st.pop(); st.push(a + b); break; }
                case "-": { int b = st.pop(), a = st.pop(); st.push(a - b); break; }
                case "*": { int b = st.pop(), a = st.pop(); st.push(a * b); break; }
                case "/": { int b = st.pop(), a = st.pop(); st.push(a / b); break; }
                default: st.push(Integer.parseInt(tok));
            }
        }
        System.out.println(st.pop());
    }
}`,
          explanation: [{ type: 'p', text: 'Numbers get pushed; an operator pops its two operands (mind the order: the **second** pop is the left operand), computes, and pushes the result. After processing all tokens, the single remaining value is the answer. **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-stk-daily-temps',
      title: 'Daily Temperatures',
      difficulty: 'Medium',
      tags: ['stacks', 'monotonic-stack'],
      isInterview: true,
      statement: [{ type: 'p', text: 'For each day, print **how many days you wait for a warmer temperature** (0 if it never gets warmer). A monotonic-stack classic.' }],
      examples: [
        { input: '8\n73 74 75 71 69 72 76 73', output: '1 1 4 2 1 1 0 0' },
      ],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n temperatures. Output: n values (days to wait), space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '8\n73 74 75 71 69 72 76 73', expected: '1 1 4 2 1 1 0 0' },
        { stdin: '3\n30 40 50', expected: '1 1 0' },
        { stdin: '3\n50 40 30', expected: '0 0 0', hidden: true },
        { stdin: '1\n5', expected: '0', hidden: true },
      ],
      hints: ['Keep a stack of day indices whose warmer day hasn’t been found yet.', 'When today is warmer than the day on top, pop it and record the gap (today − that day).'],
      solutions: [
        {
          label: 'Monotonic stack of indices',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] t = new int[n];
        for (int i = 0; i < n; i++) t[i] = sc.nextInt();

        int[] res = new int[n];                 // 0 by default
        Deque<Integer> st = new ArrayDeque<>();  // indices of days awaiting a warmer one
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && t[i] > t[st.peek()]) {
                int day = st.pop();
                res[day] = i - day;
            }
            st.push(i);
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { sb.append(res[i]); if (i < n - 1) sb.append(' '); }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Same monotonic-stack idea as Next Greater Element, but we store **indices** and record the **distance** when a warmer day resolves an earlier one. Each day is pushed/popped once → **O(n)**.' }],
        },
      ],
    },
  ],
};
