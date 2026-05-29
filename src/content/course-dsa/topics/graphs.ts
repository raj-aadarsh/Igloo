import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
//
// Graphs here have n nodes labelled 0..n-1. Input line 1 is "n m" (nodes, edges),
// then m lines "u v". Build an adjacency list, then traverse.
`;

export const graphs: SubCourse = {
  id: 'graphs',
  slug: 'graphs',
  order: 13,
  title: 'Graphs',
  subtitle: 'Nodes, edges, BFS/DFS & the algorithms on top',
  icon: 'network',
  badge: { name: 'Graph Guru', emoji: '🕸️' },
  learn: [
    {
      id: 'dsa-graph-l1',
      title: 'Graphs — the essentials',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'A **graph** is a set of **nodes (vertices)** connected by **edges**. It’s the most general structure here — trees and linked lists are just special graphs. Maps, social networks, dependencies, road systems: all graphs.' },
        { type: 'keyterms', title: 'Vocabulary', terms: [
          { term: 'Directed vs undirected', def: 'Edges have a direction (one-way) or not (two-way).' },
          { term: 'Weighted vs unweighted', def: 'Edges carry a cost (distance) or not.' },
          { term: 'Adjacency list', def: 'For each node, a list of its neighbours. The usual representation — O(V + E) space.' },
          { term: 'Degree', def: 'How many edges touch a node (in-degree / out-degree for directed).' },
        ] },
        { type: 'h2', text: 'The two traversals (the foundation of everything)' },
        { type: 'ul', items: [
          '**BFS** (breadth-first) — explore level by level with a **queue**. Finds the **shortest path in an unweighted graph**.',
          '**DFS** (depth-first) — go as deep as possible with **recursion** (or a stack), then backtrack. Great for connectivity, cycles, and topological sort.',
          'Both need a **visited** set/array so you don’t loop forever.',
        ] },
        { type: 'callout', variant: 'key', text: 'On top of BFS/DFS sit the famous algorithms: **topological sort** (ordering dependencies), **Dijkstra** (shortest path with weights, via a min-heap), and **union-find** (connectivity). Master BFS + DFS first — most graph problems are a variation.' },
      ],
    },
    {
      id: 'dsa-graph-l2',
      title: 'Graphs in Java',
      minutes: 7,
      blocks: [
        { type: 'h2', text: 'Build an adjacency list' },
        { type: 'code', code: `import java.util.*;

int n = sc.nextInt(), m = sc.nextInt();
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
for (int i = 0; i < m; i++) {
    int u = sc.nextInt(), v = sc.nextInt();
    adj.get(u).add(v);
    adj.get(v).add(u);   // omit this line for a DIRECTED graph
}` },
        { type: 'h2', text: 'BFS (queue + visited)' },
        { type: 'code', code: `boolean[] visited = new boolean[n];
Queue<Integer> q = new ArrayDeque<>();
q.add(start); visited[start] = true;
while (!q.isEmpty()) {
    int u = q.poll();
    // ... process u ...
    for (int v : adj.get(u)) {
        if (!visited[v]) { visited[v] = true; q.add(v); }
    }
}` },
        { type: 'h2', text: 'DFS (recursion + visited)' },
        { type: 'code', code: `static boolean[] visited;
static List<List<Integer>> adj;

static void dfs(int u) {
    visited[u] = true;
    // ... process u ...
    for (int v : adj.get(u)) {
        if (!visited[v]) dfs(v);
    }
}` },
        { type: 'callout', variant: 'warning', text: 'Always mark a node visited **when you enqueue/enter it**, not later — otherwise the same node gets added many times and you can loop or blow up memory. For deterministic output, sort each neighbour list.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-graph-bfs',
      title: 'BFS Traversal',
      difficulty: 'Easy',
      tags: ['graphs', 'bfs'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Undirected graph. Print the **BFS order** starting from node 0. Visit neighbours in **ascending** order so the output is deterministic.' }],
      examples: [{ input: '4 4\n0 1\n0 2\n1 3\n2 3', output: '0 1 2 3' }],
      constraints: ['1 ≤ n ≤ 10^5', 'graph is connected'],
      ioNote: 'Line 1: "n m". Next m lines: "u v" (undirected). Output: BFS order from node 0.',
      starterCode: STARTER,
      tests: [
        { stdin: '4 4\n0 1\n0 2\n1 3\n2 3', expected: '0 1 2 3' },
        { stdin: '5 4\n0 1\n0 2\n1 3\n1 4', expected: '0 1 2 3 4' },
        { stdin: '1 0', expected: '0', hidden: true },
        { stdin: '3 2\n0 1\n1 2', expected: '0 1 2', hidden: true },
      ],
      hints: ['Build the adjacency list, then sort each neighbour list.', 'Standard BFS with a queue and a visited array, starting at 0.'],
      solutions: [
        {
          label: 'BFS with a queue',
          bigO: 'Time O(V + E) · Space O(V)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj.get(u).add(v); adj.get(v).add(u);
        }
        for (List<Integer> nb : adj) Collections.sort(nb);

        boolean[] vis = new boolean[n];
        Queue<Integer> q = new ArrayDeque<>();
        q.add(0); vis[0] = true;
        StringBuilder sb = new StringBuilder();
        while (!q.isEmpty()) {
            int u = q.poll();
            if (sb.length() > 0) sb.append(' ');
            sb.append(u);
            for (int v : adj.get(u)) if (!vis[v]) { vis[v] = true; q.add(v); }
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'BFS visits the start, then all its neighbours, then their neighbours — level by level via a queue. Mark visited on enqueue. Each node and edge is touched once → **O(V + E)**.' }],
        },
      ],
    },
    {
      id: 'dsa-graph-dfs',
      title: 'DFS Traversal',
      difficulty: 'Easy',
      tags: ['graphs', 'dfs'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Undirected graph. Print the **DFS order** starting from node 0, visiting neighbours in **ascending** order.' }],
      examples: [{ input: '4 4\n0 1\n0 2\n1 3\n2 3', output: '0 1 3 2' }],
      constraints: ['1 ≤ n ≤ 10^5', 'graph is connected'],
      ioNote: 'Line 1: "n m". Next m lines: "u v" (undirected). Output: DFS order from node 0.',
      starterCode: STARTER,
      tests: [
        { stdin: '4 4\n0 1\n0 2\n1 3\n2 3', expected: '0 1 3 2' },
        { stdin: '5 4\n0 1\n0 2\n1 3\n1 4', expected: '0 1 3 4 2' },
        { stdin: '1 0', expected: '0', hidden: true },
        { stdin: '3 2\n0 1\n1 2', expected: '0 1 2', hidden: true },
      ],
      hints: ['Sort neighbour lists for deterministic order.', 'Recurse into each unvisited neighbour; mark visited on entry.'],
      solutions: [
        {
          label: 'Recursive DFS',
          bigO: 'Time O(V + E) · Space O(V)',
          code: `import java.util.*;

public class Main {
    static List<List<Integer>> adj;
    static boolean[] vis;
    static StringBuilder sb = new StringBuilder();

    static void dfs(int u) {
        vis[u] = true;
        if (sb.length() > 0) sb.append(' ');
        sb.append(u);
        for (int v : adj.get(u)) if (!vis[v]) dfs(v);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj.get(u).add(v); adj.get(v).add(u);
        }
        for (List<Integer> nb : adj) Collections.sort(nb);
        vis = new boolean[n];
        dfs(0);
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'DFS plunges as deep as it can before backtracking. The recursion call stack does the bookkeeping; `visited` prevents revisiting. **O(V + E)**.' }],
        },
      ],
    },
    {
      id: 'dsa-graph-components',
      title: 'Connected Components',
      difficulty: 'Medium',
      tags: ['graphs', 'dfs'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Count the number of **connected components** in an undirected graph (groups of nodes reachable from each other).' }],
      examples: [{ input: '5 2\n0 1\n2 3', output: '3', explanation: '{0,1}, {2,3}, and {4} alone.' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: "n m". Next m lines: "u v" (undirected). Output: number of connected components.',
      starterCode: STARTER,
      tests: [
        { stdin: '5 2\n0 1\n2 3', expected: '3' },
        { stdin: '4 4\n0 1\n1 2\n2 3\n3 0', expected: '1' },
        { stdin: '3 0', expected: '3', hidden: true },
        { stdin: '1 0', expected: '1', hidden: true },
      ],
      hints: ['Loop over every node; if it’s not visited yet, that’s a new component.', 'Run a DFS/BFS from it to mark the whole component, then continue.'],
      solutions: [
        {
          label: 'DFS over all nodes',
          bigO: 'Time O(V + E) · Space O(V)',
          code: `import java.util.*;

public class Main {
    static List<List<Integer>> adj;
    static boolean[] vis;

    static void dfs(int u) {
        vis[u] = true;
        for (int v : adj.get(u)) if (!vis[v]) dfs(v);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj.get(u).add(v); adj.get(v).add(u);
        }
        vis = new boolean[n];
        int components = 0;
        for (int i = 0; i < n; i++) {
            if (!vis[i]) { components++; dfs(i); }
        }
        System.out.println(components);
    }
}`,
          explanation: [{ type: 'p', text: 'Each time you find an unvisited node, it starts a fresh component; a single DFS/BFS floods that whole component. The number of times you start equals the number of components. **O(V + E)**.' }],
        },
      ],
    },
    {
      id: 'dsa-graph-cycle',
      title: 'Detect a Cycle (undirected)',
      difficulty: 'Medium',
      tags: ['graphs', 'bfs'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print `true` if the undirected graph contains a **cycle**, else `false`.' }],
      examples: [{ input: '4 4\n0 1\n1 2\n2 3\n3 0', output: 'true' }, { input: '4 3\n0 1\n1 2\n2 3', output: 'false' }],
      constraints: ['1 ≤ n ≤ 10^5'],
      ioNote: 'Line 1: "n m". Next m lines: "u v" (undirected). Output: true or false.',
      starterCode: STARTER,
      tests: [
        { stdin: '4 4\n0 1\n1 2\n2 3\n3 0', expected: 'true' },
        { stdin: '4 3\n0 1\n1 2\n2 3', expected: 'false' },
        { stdin: '3 3\n0 1\n1 2\n2 0', expected: 'true', hidden: true },
        { stdin: '1 0', expected: 'false', hidden: true },
      ],
      hints: ['BFS/DFS, remembering the node you came from (the parent).', 'If you reach an already-visited neighbour that ISN’T your parent, there’s a cycle. Check every component.'],
      solutions: [
        {
          label: 'BFS with parent tracking',
          bigO: 'Time O(V + E) · Space O(V)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj.get(u).add(v); adj.get(v).add(u);
        }

        boolean[] vis = new boolean[n];
        boolean cycle = false;
        for (int s = 0; s < n && !cycle; s++) {
            if (vis[s]) continue;
            Queue<int[]> q = new ArrayDeque<>();   // {node, parent}
            q.add(new int[]{s, -1});
            vis[s] = true;
            while (!q.isEmpty()) {
                int[] cur = q.poll();
                int u = cur[0], parent = cur[1];
                for (int v : adj.get(u)) {
                    if (!vis[v]) { vis[v] = true; q.add(new int[]{v, u}); }
                    else if (v != parent) { cycle = true; break; }
                }
                if (cycle) break;
            }
        }
        System.out.println(cycle);
    }
}`,
          explanation: [{ type: 'p', text: 'In an undirected graph, every edge connects you back to your parent — that’s expected. But reaching an *already-visited* node that **isn’t** your parent means there’s another way to get there → a cycle. Check each component. **O(V + E)**.' }],
        },
      ],
    },
    {
      id: 'dsa-graph-islands',
      title: 'Number of Islands',
      difficulty: 'Medium',
      tags: ['graphs', 'dfs', 'grid'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Given a grid of `1`s (land) and `0`s (water), count the **islands** — groups of `1`s connected horizontally or vertically. A grid is just a graph in disguise.' }],
      examples: [{ input: '3 3\n110\n010\n001', output: '2' }],
      constraints: ['1 ≤ rows, cols ≤ 1000'],
      ioNote: 'Line 1: "rows cols". Next: rows lines, each a string of 0/1 (length cols). Output: the island count.',
      starterCode: STARTER,
      tests: [
        { stdin: '3 3\n110\n010\n001', expected: '2' },
        { stdin: '2 2\n00\n00', expected: '0' },
        { stdin: '1 1\n1', expected: '1', hidden: true },
        { stdin: '1 5\n10101', expected: '3', hidden: true },
      ],
      hints: ['Scan every cell; when you hit an unvisited 1, that’s a new island.', 'Flood-fill it (DFS/BFS in 4 directions), sinking the connected 1s, then keep scanning.'],
      solutions: [
        {
          label: 'DFS flood fill',
          bigO: 'Time O(rows · cols) · Space O(rows · cols)',
          code: `import java.util.*;

public class Main {
    static char[][] grid;
    static int R, C;

    static void sink(int r, int c) {
        if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] != '1') return;
        grid[r][c] = '0';                 // mark visited by sinking it
        sink(r + 1, c); sink(r - 1, c);
        sink(r, c + 1); sink(r, c - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        R = sc.nextInt(); C = sc.nextInt();
        grid = new char[R][];
        for (int r = 0; r < R; r++) grid[r] = sc.next().toCharArray();

        int islands = 0;
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (grid[r][c] == '1') { islands++; sink(r, c); }
        System.out.println(islands);
    }
}`,
          explanation: [{ type: 'p', text: 'Treat each land cell as a node connected to its 4 neighbours. Every time you find unsunk land, increment the count and flood-fill (DFS) the entire connected island to `0` so you don’t count it again. Each cell is visited once → **O(rows·cols)**.' }],
        },
      ],
    },
    {
      id: 'dsa-graph-toposort',
      title: 'Topological Sort',
      difficulty: 'Medium',
      tags: ['graphs', 'topological-sort'],
      isInterview: true,
      statement: [
        { type: 'p', text: 'Given a **directed acyclic graph** (e.g. task dependencies — edge `u v` means u must come before v), print a valid **topological order**. To make it unique, print the **lexicographically smallest** one.' },
      ],
      examples: [{ input: '4 3\n0 1\n0 2\n1 3', output: '0 1 2 3' }],
      constraints: ['1 ≤ n ≤ 10^5', 'graph is a DAG (no cycles)'],
      ioNote: 'Line 1: "n m". Next m lines: directed edge "u v" (u before v). Output: the lexicographically smallest topological order.',
      starterCode: STARTER,
      tests: [
        { stdin: '4 3\n0 1\n0 2\n1 3', expected: '0 1 2 3' },
        { stdin: '6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1', expected: '4 5 0 2 3 1' },
        { stdin: '3 0', expected: '0 1 2', hidden: true },
        { stdin: '2 1\n1 0', expected: '1 0', hidden: true },
      ],
      hints: ['Kahn’s algorithm: compute in-degrees; repeatedly remove a node with in-degree 0.', 'Use a MIN-HEAP of the zero-in-degree nodes to always pick the smallest label → lexicographically smallest order.'],
      solutions: [
        {
          label: 'Kahn’s algorithm (min-heap)',
          bigO: 'Time O((V + E) log V) · Space O(V + E)',
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj.get(u).add(v);     // directed: u -> v
            indeg[v]++;
        }

        PriorityQueue<Integer> ready = new PriorityQueue<>();   // zero in-degree, smallest first
        for (int i = 0; i < n; i++) if (indeg[i] == 0) ready.offer(i);

        StringBuilder sb = new StringBuilder();
        while (!ready.isEmpty()) {
            int u = ready.poll();
            if (sb.length() > 0) sb.append(' ');
            sb.append(u);
            for (int v : adj.get(u)) {
                if (--indeg[v] == 0) ready.offer(v);
            }
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Kahn’s algorithm peels off nodes with no remaining prerequisites (in-degree 0); removing a node lowers its neighbours’ in-degrees, freeing them next. Using a **min-heap** of ready nodes yields the lexicographically smallest valid order. **O((V+E) log V)**.' }],
        },
      ],
    },
  ],
};
