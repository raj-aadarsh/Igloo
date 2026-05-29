import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
//
// Trees here are given in LEVEL ORDER on one line, with "N" for a missing child,
// e.g.  "1 2 3 N N 4 5".  You'll build the tree, then operate on it.
`;

// A reusable level-order tree builder shown to learners and reused in solutions.
const BUILDER = `import java.io.*;
import java.util.*;

public class Main {
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    // Build a binary tree from level-order tokens ("N" = null).
    static TreeNode build(String line) {
        if (line == null || line.trim().isEmpty()) return null;
        String[] t = line.trim().split("\\\\s+");
        if (t[0].equals("N")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(t[0]));
        Queue<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < t.length) {
            TreeNode cur = q.poll();
            if (i < t.length && !t[i].equals("N")) { cur.left = new TreeNode(Integer.parseInt(t[i])); q.add(cur.left); }
            i++;
            if (i < t.length && !t[i].equals("N")) { cur.right = new TreeNode(Integer.parseInt(t[i])); q.add(cur.right); }
            i++;
        }
        return root;
    }
}`;

export const trees: SubCourse = {
  id: 'trees',
  slug: 'trees',
  order: 11,
  title: 'Trees & BST',
  subtitle: 'Hierarchies, traversals & the binary search tree',
  icon: 'network',
  badge: { name: 'Tree Whisperer', emoji: '🌳' },
  learn: [
    {
      id: 'dsa-tree-l1',
      title: 'Trees — the essentials',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'A **tree** is a hierarchy of **nodes**: one **root** at the top, each node pointing to its **children**. A **binary tree** has at most two children (left and right). Trees are recursive by nature — a node’s children are themselves trees.' },
        { type: 'keyterms', terms: [
          { term: 'Root / Leaf', def: 'Root = the top node. Leaf = a node with no children.' },
          { term: 'Height / Depth', def: 'Height = longest path from a node down to a leaf. Depth = distance from the root.' },
          { term: 'Binary Search Tree (BST)', def: 'A binary tree where, for every node, **all left descendants < node < all right descendants**. This ordering makes search O(height).' },
        ] },
        { type: 'h2', text: 'The four traversals (know these cold)' },
        { type: 'ul', items: [
          '**Inorder** (Left, Node, Right) — on a **BST this visits values in sorted order**. Hugely useful.',
          '**Preorder** (Node, Left, Right) — good for copying/serializing a tree.',
          '**Postorder** (Left, Right, Node) — good for deleting, or computing sizes/heights bottom-up.',
          '**Level order** (BFS) — visit level by level using a **queue**.',
        ] },
        { type: 'callout', variant: 'key', text: 'Most tree problems are solved by **recursion**: do something at the node, recurse left, recurse right. For "level by level" use **BFS with a queue**. Inorder on a BST = sorted — remember that one.' },
      ],
    },
    {
      id: 'dsa-tree-l2',
      title: 'Trees in Java',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'Define your own node, then walk it. Here’s the node + the **level-order builder** the problems use (so you can read input like `"1 2 3 N N 4 5"`).' },
        { type: 'code', code: BUILDER, caption: 'Copy this builder into your solutions — it turns the level-order input line into a tree.' },
        { type: 'h2', text: 'Recursive traversal (inorder)' },
        { type: 'code', code: `static void inorder(TreeNode n, List<Integer> out) {
    if (n == null) return;       // base case
    inorder(n.left, out);        // Left
    out.add(n.val);              // Node
    inorder(n.right, out);       // Right
}` },
        { type: 'h2', text: 'Level order (BFS with a queue)' },
        { type: 'code', code: `Queue<TreeNode> q = new ArrayDeque<>();
if (root != null) q.add(root);
while (!q.isEmpty()) {
    int levelSize = q.size();           // how many nodes on this level
    for (int i = 0; i < levelSize; i++) {
        TreeNode cur = q.poll();
        // ... use cur.val ...
        if (cur.left != null)  q.add(cur.left);
        if (cur.right != null) q.add(cur.right);
    }
    // here we've finished one full level
}` },
        { type: 'callout', variant: 'tip', text: 'The "size of the queue at the start of the loop = number of nodes on this level" trick is how you separate BFS into per-level groups.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-tree-inorder',
      title: 'Inorder Traversal',
      difficulty: 'Easy',
      tags: ['trees', 'recursion'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Build the tree from the level-order input and print its **inorder** traversal (Left, Node, Right), space-separated.' }],
      examples: [{ input: '1 N 2 3', output: '1 3 2' }],
      constraints: ['0 ≤ nodes ≤ 10^4'],
      ioNote: 'Input: level-order tokens ("N" = null). Output: inorder values, space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '1 N 2 3', expected: '1 3 2' },
        { stdin: '1 2 3', expected: '2 1 3' },
        { stdin: 'N', expected: '', hidden: true },
        { stdin: '5 3 8 1 4', expected: '1 3 4 5 8', hidden: true },
      ],
      hints: ['Build the tree with the level-order builder.', 'Recurse: inorder(left), visit node, inorder(right).'],
      solutions: [
        {
          label: 'Recursive inorder',
          bigO: 'Time O(n) · Space O(h)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }

    static TreeNode build(String line) {
        if (line == null || line.trim().isEmpty()) return null;
        String[] t = line.trim().split("\\\\s+");
        if (t[0].equals("N")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(t[0]));
        Queue<TreeNode> q = new ArrayDeque<>(); q.add(root); int i = 1;
        while (!q.isEmpty() && i < t.length) {
            TreeNode cur = q.poll();
            if (i < t.length && !t[i].equals("N")) { cur.left = new TreeNode(Integer.parseInt(t[i])); q.add(cur.left); } i++;
            if (i < t.length && !t[i].equals("N")) { cur.right = new TreeNode(Integer.parseInt(t[i])); q.add(cur.right); } i++;
        }
        return root;
    }

    static StringBuilder sb = new StringBuilder();
    static void inorder(TreeNode n) {
        if (n == null) return;
        inorder(n.left);
        sb.append(n.val).append(' ');
        inorder(n.right);
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        inorder(build(br.readLine()));
        System.out.println(sb.toString().trim());
    }
}`,
          explanation: [{ type: 'p', text: 'Classic recursion: fully traverse the left subtree, visit the node, then the right subtree. Visits each node once → **O(n)**; the recursion stack uses **O(h)** (tree height).' }],
        },
      ],
    },
    {
      id: 'dsa-tree-depth',
      title: 'Maximum Depth',
      difficulty: 'Easy',
      tags: ['trees', 'recursion'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the **maximum depth** (height) — the number of nodes on the longest path from the root down to a leaf.' }],
      examples: [{ input: '3 9 20 N N 15 7', output: '3' }],
      constraints: ['0 ≤ nodes ≤ 10^4'],
      ioNote: 'Input: level-order tokens. Output: the maximum depth.',
      starterCode: STARTER,
      tests: [
        { stdin: '3 9 20 N N 15 7', expected: '3' },
        { stdin: '1 2', expected: '2' },
        { stdin: 'N', expected: '0', hidden: true },
        { stdin: '1', expected: '1', hidden: true },
      ],
      hints: ['Depth of null is 0.', 'Depth of a node = 1 + max(depth of left, depth of right).'],
      solutions: [
        {
          label: 'Recursion',
          bigO: 'Time O(n) · Space O(h)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }

    static TreeNode build(String line) {
        if (line == null || line.trim().isEmpty()) return null;
        String[] t = line.trim().split("\\\\s+");
        if (t[0].equals("N")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(t[0]));
        Queue<TreeNode> q = new ArrayDeque<>(); q.add(root); int i = 1;
        while (!q.isEmpty() && i < t.length) {
            TreeNode cur = q.poll();
            if (i < t.length && !t[i].equals("N")) { cur.left = new TreeNode(Integer.parseInt(t[i])); q.add(cur.left); } i++;
            if (i < t.length && !t[i].equals("N")) { cur.right = new TreeNode(Integer.parseInt(t[i])); q.add(cur.right); } i++;
        }
        return root;
    }

    static int depth(TreeNode n) {
        if (n == null) return 0;
        return 1 + Math.max(depth(n.left), depth(n.right));
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        System.out.println(depth(build(br.readLine())));
    }
}`,
          explanation: [{ type: 'p', text: 'A textbook recursive definition: an empty tree has depth 0; any node is 1 plus the deeper of its two subtrees. **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-tree-levelorder',
      title: 'Level Order Traversal',
      difficulty: 'Medium',
      tags: ['trees', 'queues'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the tree **level by level** (BFS): one level per line, values space-separated.' }],
      examples: [{ input: '3 9 20 N N 15 7', output: '3\n9 20\n15 7' }],
      constraints: ['0 ≤ nodes ≤ 10^4'],
      ioNote: 'Input: level-order tokens. Output: each level on its own line.',
      starterCode: STARTER,
      tests: [
        { stdin: '3 9 20 N N 15 7', expected: '3\n9 20\n15 7' },
        { stdin: '1', expected: '1' },
        { stdin: 'N', expected: '', hidden: true },
        { stdin: '1 2 3 4 5', expected: '1\n2 3\n4 5', hidden: true },
      ],
      hints: ['BFS with a queue.', 'At each loop, record the current queue size — that’s one level.'],
      solutions: [
        {
          label: 'BFS by level',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }

    static TreeNode build(String line) {
        if (line == null || line.trim().isEmpty()) return null;
        String[] t = line.trim().split("\\\\s+");
        if (t[0].equals("N")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(t[0]));
        Queue<TreeNode> q = new ArrayDeque<>(); q.add(root); int i = 1;
        while (!q.isEmpty() && i < t.length) {
            TreeNode cur = q.poll();
            if (i < t.length && !t[i].equals("N")) { cur.left = new TreeNode(Integer.parseInt(t[i])); q.add(cur.left); } i++;
            if (i < t.length && !t[i].equals("N")) { cur.right = new TreeNode(Integer.parseInt(t[i])); q.add(cur.right); } i++;
        }
        return root;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        TreeNode root = build(br.readLine());
        StringBuilder out = new StringBuilder();
        Queue<TreeNode> q = new ArrayDeque<>();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int k = 0; k < sz; k++) {
                TreeNode cur = q.poll();
                out.append(cur.val);
                if (k < sz - 1) out.append(' ');
                if (cur.left != null) q.add(cur.left);
                if (cur.right != null) q.add(cur.right);
            }
            out.append('\\n');
        }
        System.out.println(out.toString().trim());
    }
}`,
          explanation: [{ type: 'p', text: 'Standard BFS, but we snapshot `q.size()` at the start of each loop to know exactly how many nodes form the current level, emitting one line per level. **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-tree-invert',
      title: 'Invert a Binary Tree',
      difficulty: 'Easy',
      tags: ['trees', 'recursion'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Mirror the tree (swap every node’s left and right child), then print the **inorder traversal** of the inverted tree.' }],
      examples: [{ input: '4 2 7 1 3 6 9', output: '9 7 6 4 3 2 1' }],
      constraints: ['0 ≤ nodes ≤ 10^4'],
      ioNote: 'Input: level-order tokens. Output: inorder of the inverted tree, space-separated.',
      starterCode: STARTER,
      tests: [
        { stdin: '4 2 7 1 3 6 9', expected: '9 7 6 4 3 2 1' },
        { stdin: '2 1 3', expected: '3 2 1' },
        { stdin: 'N', expected: '', hidden: true },
        { stdin: '1', expected: '1', hidden: true },
      ],
      hints: ['Invert recursively: swap left and right, then invert both subtrees.', 'Then run a normal inorder traversal.'],
      solutions: [
        {
          label: 'Recursive invert',
          bigO: 'Time O(n) · Space O(h)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }

    static TreeNode build(String line) {
        if (line == null || line.trim().isEmpty()) return null;
        String[] t = line.trim().split("\\\\s+");
        if (t[0].equals("N")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(t[0]));
        Queue<TreeNode> q = new ArrayDeque<>(); q.add(root); int i = 1;
        while (!q.isEmpty() && i < t.length) {
            TreeNode cur = q.poll();
            if (i < t.length && !t[i].equals("N")) { cur.left = new TreeNode(Integer.parseInt(t[i])); q.add(cur.left); } i++;
            if (i < t.length && !t[i].equals("N")) { cur.right = new TreeNode(Integer.parseInt(t[i])); q.add(cur.right); } i++;
        }
        return root;
    }

    static TreeNode invert(TreeNode n) {
        if (n == null) return null;
        TreeNode l = invert(n.left), r = invert(n.right);
        n.left = r; n.right = l;
        return n;
    }

    static StringBuilder sb = new StringBuilder();
    static void inorder(TreeNode n) {
        if (n == null) return;
        inorder(n.left); sb.append(n.val).append(' '); inorder(n.right);
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        inorder(invert(build(br.readLine())));
        System.out.println(sb.toString().trim());
    }
}`,
          explanation: [{ type: 'p', text: 'Inverting is just swapping each node’s children, done recursively. (Famously the question that "stumped" a library author on Twitter — but it’s a clean **O(n)** recursion.) Inorder of the mirror reads the original right-to-left.' }],
        },
      ],
    },
    {
      id: 'dsa-tree-validate-bst',
      title: 'Validate a BST',
      difficulty: 'Medium',
      tags: ['trees', 'bst'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print `true` if the tree is a valid **Binary Search Tree** (every left descendant < node < every right descendant), else `false`.' }],
      examples: [{ input: '2 1 3', output: 'true' }, { input: '5 1 4 N N 3 6', output: 'false' }],
      constraints: ['0 ≤ nodes ≤ 10^4'],
      ioNote: 'Input: level-order tokens. Output: true or false.',
      starterCode: STARTER,
      tests: [
        { stdin: '2 1 3', expected: 'true' },
        { stdin: '5 1 4 N N 3 6', expected: 'false' },
        { stdin: '1', expected: 'true', hidden: true },
        { stdin: '10 5 15 N N 6 20', expected: 'false', hidden: true },
      ],
      hints: ['A node alone isn’t enough — track the (low, high) range each node must fall within.', 'Going left tightens the upper bound to the node; going right tightens the lower bound.'],
      solutions: [
        {
          label: 'Range recursion',
          bigO: 'Time O(n) · Space O(h)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }

    static TreeNode build(String line) {
        if (line == null || line.trim().isEmpty()) return null;
        String[] t = line.trim().split("\\\\s+");
        if (t[0].equals("N")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(t[0]));
        Queue<TreeNode> q = new ArrayDeque<>(); q.add(root); int i = 1;
        while (!q.isEmpty() && i < t.length) {
            TreeNode cur = q.poll();
            if (i < t.length && !t[i].equals("N")) { cur.left = new TreeNode(Integer.parseInt(t[i])); q.add(cur.left); } i++;
            if (i < t.length && !t[i].equals("N")) { cur.right = new TreeNode(Integer.parseInt(t[i])); q.add(cur.right); } i++;
        }
        return root;
    }

    static boolean valid(TreeNode n, long low, long high) {
        if (n == null) return true;
        if (n.val <= low || n.val >= high) return false;
        return valid(n.left, low, n.val) && valid(n.right, n.val, high);
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        System.out.println(valid(build(br.readLine()), Long.MIN_VALUE, Long.MAX_VALUE));
    }
}`,
          explanation: [{ type: 'p', text: 'Checking only `left < node < right` locally is **wrong** — a deep descendant can still violate the order. Instead, pass down the allowed `(low, high)` range: left children must be below the node, right children above. Using `long` bounds avoids overflow at `Integer.MIN/MAX_VALUE`. **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-tree-diameter',
      title: 'Diameter of a Binary Tree',
      difficulty: 'Medium',
      tags: ['trees', 'recursion'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the **diameter**: the number of edges on the longest path between any two nodes (the path need not pass through the root).' }],
      examples: [{ input: '1 2 3 4 5', output: '3', explanation: 'Path 4-2-1-3 (or 5-2-1-3) has 3 edges.' }],
      constraints: ['0 ≤ nodes ≤ 10^4'],
      ioNote: 'Input: level-order tokens. Output: the diameter (in edges).',
      starterCode: STARTER,
      tests: [
        { stdin: '1 2 3 4 5', expected: '3' },
        { stdin: '1 2 N 3', expected: '2' },
        { stdin: '1', expected: '0', hidden: true },
        { stdin: 'N', expected: '0', hidden: true },
      ],
      hints: ['Compute each node’s height with recursion.', 'At every node, the longest path THROUGH it is leftHeight + rightHeight; track the max of those.'],
      solutions: [
        {
          label: 'Height + global max',
          bigO: 'Time O(n) · Space O(h)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }

    static TreeNode build(String line) {
        if (line == null || line.trim().isEmpty()) return null;
        String[] t = line.trim().split("\\\\s+");
        if (t[0].equals("N")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(t[0]));
        Queue<TreeNode> q = new ArrayDeque<>(); q.add(root); int i = 1;
        while (!q.isEmpty() && i < t.length) {
            TreeNode cur = q.poll();
            if (i < t.length && !t[i].equals("N")) { cur.left = new TreeNode(Integer.parseInt(t[i])); q.add(cur.left); } i++;
            if (i < t.length && !t[i].equals("N")) { cur.right = new TreeNode(Integer.parseInt(t[i])); q.add(cur.right); } i++;
        }
        return root;
    }

    static int best = 0;
    static int height(TreeNode n) {
        if (n == null) return 0;
        int l = height(n.left), r = height(n.right);
        best = Math.max(best, l + r);     // longest path through this node (in edges)
        return 1 + Math.max(l, r);
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        height(build(br.readLine()));
        System.out.println(best);
    }
}`,
          explanation: [{ type: 'p', text: 'Compute heights bottom-up; at each node the longest path **through** it equals leftHeight + rightHeight (edges). Track the global best while computing heights — one **O(n)** pass instead of recomputing heights for every node.' }],
        },
      ],
    },
  ],
};
