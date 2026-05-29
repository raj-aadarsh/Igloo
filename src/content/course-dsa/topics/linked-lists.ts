import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// You'll define your own Node class. Read input, build the list, then operate.
`;

export const linkedLists: SubCourse = {
  id: 'linked-lists',
  slug: 'linked-lists',
  order: 7,
  title: 'Linked Lists',
  subtitle: 'Nodes & pointers — and the tricks that tame them',
  icon: 'network',
  badge: { name: 'List Legend', emoji: '🔗' },
  learn: [
    {
      id: 'dsa-ll-l1',
      title: 'Linked lists — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **linked list** is a chain of **nodes**, each holding a value and a **pointer to the next node**. Unlike an array, the nodes are scattered in memory and joined by these pointers.' },
        { type: 'keyterms', title: 'Array vs linked list', terms: [
          { term: 'Access by index', def: 'Array **O(1)** · Linked list **O(n)** (you must walk from the head).' },
          { term: 'Insert/delete at a known node', def: 'Array **O(n)** (shift) · Linked list **O(1)** (just relink pointers).' },
          { term: 'Memory', def: 'Array: one contiguous block · List: scattered nodes + a pointer each.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Use a linked list when you do lots of **inserts/deletes at the ends or at a known position** and rarely need random access. Otherwise an array (or ArrayList) is usually simpler and faster.' },
        { type: 'h2', text: 'Two techniques that solve most list problems' },
        { type: 'ul', items: [
          '**Dummy head** — a throwaway node before the real head, so you don’t special-case the first element.',
          '**Fast & slow pointers** — one moves 2×, one 1×. Finds the middle, detects cycles, locates the k-th from the end.',
        ] },
      ],
    },
    {
      id: 'dsa-ll-l2',
      title: 'Linked lists in Java',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'There’s a built-in `java.util.LinkedList`, but interviews want you to work with **your own node class** — it shows you understand pointers.' },
        { type: 'h2', text: 'Define a node & build a list' },
        { type: 'code', code: `// A node holds a value and a link to the next node.
static class Node {
    int val;
    Node next;
    Node(int v) { val = v; }
}

// Build a list from values (keep a tail pointer so appends are O(1)):
Node head = null, tail = null;
for (int x : values) {
    Node node = new Node(x);
    if (head == null) head = tail = node;
    else { tail.next = node; tail = node; }
}` },
        { type: 'h2', text: 'Traverse & the reversal pattern' },
        { type: 'code', code: `for (Node p = head; p != null; p = p.next) {
    System.out.print(p.val + " ");
}

// Reverse, the canonical 3-pointer dance:
Node prev = null, cur = head;
while (cur != null) {
    Node next = cur.next;   // remember the rest
    cur.next = prev;        // flip the link
    prev = cur;             // advance prev
    cur = next;             // advance cur
}
// 'prev' is the new head` },
        { type: 'h2', text: 'Fast / slow pointers' },
        { type: 'code', code: `Node slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;        // +1
    fast = fast.next.next;   // +2
}
// slow is now at the middle (and this loop also detects cycles)` },
        { type: 'callout', variant: 'warning', text: 'The #1 linked-list bug is a **NullPointerException**: always check `node != null` before reading `node.next`. In the fast pointer, check both `fast != null` AND `fast.next != null`.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-ll-reverse',
      title: 'Reverse a Linked List',
      difficulty: 'Easy',
      tags: ['linked-list'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Build a linked list from the given values, **reverse it by relinking the pointers**, and print the values of the reversed list.' }],
      examples: [{ input: '5\n1 2 3 4 5', output: '5 4 3 2 1' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n values. Output: the reversed list, space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n1 2 3 4 5', expected: '5 4 3 2 1' },
        { stdin: '1\n9', expected: '9' },
        { stdin: '2\n1 2', expected: '2 1', hidden: true },
        { stdin: '4\n10 20 30 40', expected: '40 30 20 10', hidden: true },
      ],
      hints: ['Build the list with a tail pointer.', 'Use three pointers (prev, cur, next) to flip each link; prev ends as the new head.'],
      solutions: [
        {
          label: 'Iterative reversal',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    static class Node { int val; Node next; Node(int v){ val = v; } }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null, tail = null;
        for (int i = 0; i < n; i++) {
            Node node = new Node(sc.nextInt());
            if (head == null) head = tail = node;
            else { tail.next = node; tail = node; }
        }

        Node prev = null, cur = head;
        while (cur != null) {
            Node next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        head = prev;

        StringBuilder sb = new StringBuilder();
        for (Node p = head; p != null; p = p.next) {
            sb.append(p.val);
            if (p.next != null) sb.append(' ');
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'The three-pointer dance: save `next`, flip `cur.next` to point back at `prev`, then slide both forward. After one pass every link is reversed and `prev` is the new head. **O(n)** time, **O(1)** space.' }],
        },
      ],
    },
    {
      id: 'dsa-ll-middle',
      title: 'Middle of the Linked List',
      difficulty: 'Easy',
      tags: ['linked-list', 'two-pointers'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the value of the **middle node**. If there are two middles (even length), print the **second** one.' }],
      examples: [{ input: '5\n1 2 3 4 5', output: '3' }, { input: '6\n1 2 3 4 5 6', output: '4' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n values. Output: the middle node’s value.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n1 2 3 4 5', expected: '3' },
        { stdin: '6\n1 2 3 4 5 6', expected: '4' },
        { stdin: '1\n1', expected: '1', hidden: true },
        { stdin: '2\n1 2', expected: '2', hidden: true },
      ],
      hints: ['Fast & slow pointers.', 'When fast reaches the end, slow is at the middle.'],
      solutions: [
        {
          label: 'Fast & slow',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    static class Node { int val; Node next; Node(int v){ val = v; } }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null, tail = null;
        for (int i = 0; i < n; i++) {
            Node node = new Node(sc.nextInt());
            if (head == null) head = tail = node;
            else { tail.next = node; tail = node; }
        }

        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        System.out.println(slow.val);
    }
}`,
          explanation: [{ type: 'p', text: 'Fast moves twice as quickly, so when it falls off the end, slow has covered exactly half — landing on the (second) middle. One pass, **O(1)** extra space, no length count needed.' }],
        },
      ],
    },
    {
      id: 'dsa-ll-remove-nth',
      title: 'Remove N-th Node From End',
      difficulty: 'Medium',
      tags: ['linked-list', 'two-pointers'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Remove the **k-th node from the end** and print the resulting list (which may become empty).' }],
      examples: [{ input: '5\n1 2 3 4 5\n2', output: '1 2 3 5', explanation: 'The 2nd from the end is 4.' }],
      constraints: ['1 ≤ k ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n values. Line 3: k. Output: the list after removal (possibly empty).',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n1 2 3 4 5\n2', expected: '1 2 3 5' },
        { stdin: '1\n7\n1', expected: '' },
        { stdin: '3\n1 2 3\n3', expected: '2 3', hidden: true },
        { stdin: '2\n1 2\n1', expected: '1', hidden: true },
      ],
      hints: ['Use a dummy node before the head so removing the first node is no special case.', 'Advance a fast pointer k steps, then move fast & slow together until fast hits the end.'],
      solutions: [
        {
          label: 'Two pointers + dummy',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    static class Node { int val; Node next; Node(int v){ val = v; } }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null, tail = null;
        for (int i = 0; i < n; i++) {
            Node node = new Node(sc.nextInt());
            if (head == null) head = tail = node;
            else { tail.next = node; tail = node; }
        }
        int k = sc.nextInt();

        Node dummy = new Node(0);
        dummy.next = head;
        Node fast = dummy, slow = dummy;
        for (int i = 0; i < k; i++) fast = fast.next;   // fast leads by k
        while (fast.next != null) { fast = fast.next; slow = slow.next; }
        slow.next = slow.next.next;                     // unlink the target
        head = dummy.next;

        StringBuilder sb = new StringBuilder();
        for (Node p = head; p != null; p = p.next) {
            sb.append(p.val);
            if (p.next != null) sb.append(' ');
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Put a **dummy** before the head (so deleting the first node isn’t a special case). Move `fast` k steps ahead, then advance both until `fast` reaches the last node — now `slow` sits just before the target, ready to unlink it. One pass, **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-ll-merge',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Medium',
      tags: ['linked-list'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Merge two **sorted** linked lists into one sorted list and print its values.' }],
      examples: [{ input: '3\n1 3 5\n3\n2 4 6', output: '1 2 3 4 5 6' }],
      constraints: ['1 ≤ n, m ≤ 10^5', 'both lists are sorted ascending'],
      ioNote: 'Line 1: n. Line 2: list A (sorted). Line 3: m. Line 4: list B (sorted). Output: the merged sorted list.',
      starterCode: STARTER,
      tests: [
        { stdin: '3\n1 3 5\n3\n2 4 6', expected: '1 2 3 4 5 6' },
        { stdin: '2\n1 5\n3\n2 3 4', expected: '1 2 3 4 5' },
        { stdin: '1\n1\n1\n2', expected: '1 2', hidden: true },
        { stdin: '2\n2 4\n2\n1 3', expected: '1 2 3 4', hidden: true },
      ],
      hints: ['Use a dummy node and a tail pointer to build the result.', 'Repeatedly attach the smaller head; when one list ends, attach the rest of the other.'],
      solutions: [
        {
          label: 'Dummy + merge',
          bigO: 'Time O(n + m) · Space O(1)',
          code: `import java.util.*;

public class Main {
    static class Node { int val; Node next; Node(int v){ val = v; } }

    static Node build(Scanner sc) {
        int n = sc.nextInt();
        Node head = null, tail = null;
        for (int i = 0; i < n; i++) {
            Node node = new Node(sc.nextInt());
            if (head == null) head = tail = node;
            else { tail.next = node; tail = node; }
        }
        return head;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Node a = build(sc), b = build(sc);

        Node dummy = new Node(0), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;   // attach the remainder

        StringBuilder sb = new StringBuilder();
        for (Node p = dummy.next; p != null; p = p.next) {
            sb.append(p.val);
            if (p.next != null) sb.append(' ');
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Walk both lists at once, always attaching the smaller current node to the result’s tail. When one runs out, the other is already sorted — just link it on. **O(n + m)**, and a `dummy` head keeps the code clean.' }],
        },
      ],
    },
    {
      id: 'dsa-ll-cycle',
      title: 'Detect a Cycle',
      difficulty: 'Medium',
      tags: ['linked-list', 'two-pointers'],
      isInterview: true,
      statement: [
        { type: 'p', text: 'Determine whether the linked list has a **cycle**. The input gives a `pos`: the index the last node’s `next` connects back to (or `-1` for no cycle). Print `true` or `false`.' },
      ],
      examples: [{ input: '4\n3 2 0 4\n1', output: 'true', explanation: 'The tail links back to index 1.' }],
      constraints: ['1 ≤ n ≤ 10^5', '-1 ≤ pos < n'],
      ioNote: 'Line 1: n. Line 2: n values. Line 3: pos (tail connects here, or -1). Output: true or false.',
      starterCode: STARTER,
      tests: [
        { stdin: '4\n3 2 0 4\n1', expected: 'true' },
        { stdin: '2\n1 2\n-1', expected: 'false' },
        { stdin: '1\n1\n-1', expected: 'false', hidden: true },
        { stdin: '1\n1\n0', expected: 'true', hidden: true },
      ],
      hints: ['Build the list, keeping node references in an array so you can wire the cycle.', 'Floyd’s algorithm: fast & slow pointers; if they ever meet, there’s a cycle.'],
      solutions: [
        {
          label: 'Floyd’s tortoise & hare',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    static class Node { int val; Node next; Node(int v){ val = v; } }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node[] nodes = new Node[n];
        for (int i = 0; i < n; i++) nodes[i] = new Node(sc.nextInt());
        for (int i = 0; i < n - 1; i++) nodes[i].next = nodes[i + 1];
        int pos = sc.nextInt();
        if (pos >= 0) nodes[n - 1].next = nodes[pos];   // create the cycle

        Node head = nodes[0];
        Node slow = head, fast = head;
        boolean cycle = false;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) { cycle = true; break; }
        }
        System.out.println(cycle);
    }
}`,
          explanation: [{ type: 'p', text: 'Two pointers move at different speeds. In a straight list, fast simply reaches the end. If there’s a loop, fast keeps lapping the track and **must eventually meet** slow. Meeting ⇒ cycle. **O(n)** time, **O(1)** space — no extra set needed.' }],
        },
      ],
    },
    {
      id: 'dsa-ll-palindrome',
      title: 'Palindrome Linked List',
      difficulty: 'Medium',
      tags: ['linked-list', 'two-pointers'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print `true` if the list reads the same forwards and backwards, else `false`.' }],
      examples: [{ input: '5\n1 2 3 2 1', output: 'true' }, { input: '3\n1 2 3', output: 'false' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: n. Line 2: n values. Output: true or false.',
      starterCode: STARTER,
      tests: [
        { stdin: '5\n1 2 3 2 1', expected: 'true' },
        { stdin: '4\n1 2 2 1', expected: 'true' },
        { stdin: '3\n1 2 3', expected: 'false', hidden: true },
        { stdin: '1\n1', expected: 'true', hidden: true },
      ],
      hints: ['Simple: copy values into a list and check with two pointers.', 'Optimal: find the middle, reverse the second half, then compare the two halves — O(1) space.'],
      solutions: [
        {
          label: 'Collect values (simple)',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.util.*;

public class Main {
    static class Node { int val; Node next; Node(int v){ val = v; } }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Integer> vals = new ArrayList<>();
        for (int i = 0; i < n; i++) vals.add(sc.nextInt());

        int i = 0, j = vals.size() - 1;
        boolean ok = true;
        while (i < j) {
            if (!vals.get(i).equals(vals.get(j))) { ok = false; break; }
            i++; j--;
        }
        System.out.println(ok);
    }
}`,
          explanation: [{ type: 'p', text: 'Pull the values into a list, then two-pointer from both ends. Crystal clear at **O(n)** time and **O(n)** space.' }],
        },
        {
          label: 'Optimal (reverse half)',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.util.*;

public class Main {
    static class Node { int val; Node next; Node(int v){ val = v; } }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null, tail = null;
        for (int i = 0; i < n; i++) {
            Node node = new Node(sc.nextInt());
            if (head == null) head = tail = node;
            else { tail.next = node; tail = node; }
        }

        // find middle (slow ends at start of 2nd half)
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }

        // reverse the second half
        Node prev = null, cur = slow;
        while (cur != null) { Node nx = cur.next; cur.next = prev; prev = cur; cur = nx; }

        // compare halves
        Node p1 = head, p2 = prev;
        boolean ok = true;
        while (p2 != null) {
            if (p1.val != p2.val) { ok = false; break; }
            p1 = p1.next; p2 = p2.next;
        }
        System.out.println(ok);
    }
}`,
          explanation: [{ type: 'p', text: 'Find the middle with fast/slow, reverse the second half in place, then compare it against the first half. Uses only **O(1)** extra space — the answer interviewers are hoping for.' }],
        },
      ],
    },
  ],
};
