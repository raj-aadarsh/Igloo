import type { SubCourse } from '../types';

const STARTER = `// Write a COMPLETE Java program from scratch.
// It must be: public class Main { public static void main(String[] args) { ... } }
// Read input from System.in (Scanner or BufferedReader); print with System.out.
`;

export const strings: SubCourse = {
  id: 'strings',
  slug: 'strings',
  order: 2,
  title: 'Strings',
  subtitle: 'Text, immutability & the patterns interviewers love',
  icon: 'message',
  badge: { name: 'String Sensei', emoji: '🧵' },
  learn: [
    {
      id: 'dsa-strings-l1',
      title: 'Strings — the essentials',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **string** is a sequence of characters. It’s really just a (read-only) array of `char`s with handy methods bolted on — so everything you learned about arrays still applies.' },
        { type: 'h2', text: 'The one fact that defines Java strings: immutability' },
        { type: 'p', text: 'In Java, a `String` is **immutable** — once created it can never change. Every "edit" (concatenation, replace, etc.) actually builds a **brand-new String**. This is the #1 thing interviewers probe.' },
        { type: 'callout', variant: 'warning', title: 'The classic trap', text: 'Building a string with `+=` inside a loop is **O(n²)** — each `+` copies the whole string so far. For building text, use a **`StringBuilder`** (O(n) total). Remember this and you’ll dodge a very common interview mistake.' },
        { type: 'keyterms', title: 'Costs to know', terms: [
          { term: 's.charAt(i)', def: '**O(1)** — read one character.' },
          { term: 's.length()', def: '**O(1)** — it’s a method (with `()`), unlike array `.length`.' },
          { term: 's.substring(a, b)', def: '**O(n)** — copies the slice into a new String.' },
          { term: '"a" + "b" in a loop', def: '**O(n²)** — immutability bites. Use StringBuilder.' },
        ] },
        { type: 'h2', text: 'Characters are numbers' },
        { type: 'p', text: 'A `char` is just a small integer (its Unicode code). So `\'c\' - \'a\'` gives `2` — a trick used constantly to index a 26-slot array for letter counts.' },
        { type: 'widget', widget: 'bigo-cheat' },
        { type: 'callout', variant: 'key', text: 'Two reflexes to build: **(1)** never compare strings with `==` (that compares references) — use `.equals()`. **(2)** building text? Reach for `StringBuilder`.' },
      ],
    },
    {
      id: 'dsa-strings-l2',
      title: 'Strings in Java — every move you need',
      minutes: 8,
      blocks: [
        { type: 'p', text: 'Your practical Java string toolkit. Skim it, then solve.' },
        { type: 'h2', text: 'Read & inspect' },
        { type: 'code', code: `String s = "hello world";
s.length();           // 11   (METHOD, with ())
s.charAt(0);          // 'h'
s.substring(0, 5);    // "hello"  (start inclusive, end exclusive)
s.indexOf("world");   // 6   (-1 if not found)
s.contains("lo");     // true
s.toCharArray();      // ['h','e','l','l','o',...]   — handy for scanning
s.split(" ");         // ["hello", "world"]` },
        { type: 'h2', text: 'Compare (carefully!)' },
        { type: 'code', code: `"abc".equals("abc");        // true  — ALWAYS use equals for value
"abc".equalsIgnoreCase("ABC"); // true
"abc".compareTo("abd");     // negative (lexicographic order)

String a = "hi", b = "hi";
boolean wrong = (a == b);   // DON'T: compares references, not contents` },
        { type: 'h2', text: 'Characters as numbers' },
        { type: 'code', code: `char c = 'c';
int idx = c - 'a';                 // 2  -> index into a 26-slot count array
char up = Character.toUpperCase(c);// 'C'
Character.isLetter(c);             // true
Character.isDigit('7');            // true
int[] count = new int[26];
count['z' - 'a']++;                // count the letter 'z'` },
        { type: 'h2', text: 'Build strings the right way: StringBuilder' },
        { type: 'code', code: `StringBuilder sb = new StringBuilder();
sb.append("ab");
sb.append(42);
sb.reverse();          // in place
sb.insert(0, "x");
String result = sb.toString();   // convert back to String when done` },
        { type: 'h2', text: 'Reading input & printing' },
        { type: 'code', code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();      // reads ONE whole line (spaces included)
        if (line == null) line = "";      // guard against empty input
        System.out.println(line.length());
    }
}`, caption: 'BufferedReader.readLine() reads a full line — use it when input is a sentence with spaces. Always handle a null/empty line.' },
        { type: 'callout', variant: 'warning', title: 'String gotchas', text: '• `length()` has `()`; array `.length` does not. • Compare with `.equals()`, never `==`. • Strings are immutable — `s.replace(...)` returns a new string, it doesn’t change `s`. • `split(" ")` on text with double spaces yields empty tokens — clean input first if needed.' },
        { type: 'callout', variant: 'tip', text: 'Two patterns solve a huge share of string problems: a **frequency array/map** (count characters) and **two pointers / sliding window**. You’ll use both in the problems next.' },
      ],
    },
  ],
  problems: [
    {
      id: 'dsa-str-reverse',
      title: 'Reverse a String',
      difficulty: 'Easy',
      tags: ['strings', 'warm-up'],
      statement: [{ type: 'p', text: 'Read a line of text and print it **reversed**.' }],
      examples: [{ input: 'hello', output: 'olleh' }, { input: 'abcd', output: 'dcba' }],
      constraints: ['0 ≤ length ≤ 10^5'],
      ioNote: 'Input: one line (the string). Output: the reversed string.',
      starterCode: STARTER,
      tests: [
        { stdin: 'hello', expected: 'olleh' },
        { stdin: 'a', expected: 'a' },
        { stdin: 'abcd', expected: 'dcba', hidden: true },
        { stdin: 'racecar', expected: 'racecar', hidden: true },
      ],
      hints: ['Read the line with BufferedReader.', 'StringBuilder has a reverse() method — or swap with two pointers.'],
      solutions: [
        {
          label: 'StringBuilder.reverse',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        System.out.println(new StringBuilder(s).reverse().toString());
    }
}`,
          explanation: [{ type: 'p', text: '`StringBuilder` is mutable, so reversing it in place is **O(n)**. (You could also convert to a `char[]` and swap with two pointers — same complexity.)' }],
        },
      ],
    },
    {
      id: 'dsa-str-palindrome',
      title: 'Valid Palindrome',
      difficulty: 'Easy',
      tags: ['strings', 'two-pointers'],
      statement: [{ type: 'p', text: 'Print `true` if the string reads the same forwards and backwards, else `false`.' }],
      examples: [{ input: 'racecar', output: 'true' }, { input: 'hello', output: 'false' }],
      constraints: ['0 ≤ length ≤ 10^5'],
      ioNote: 'Input: one line. Output: true or false (lowercase).',
      starterCode: STARTER,
      tests: [
        { stdin: 'racecar', expected: 'true' },
        { stdin: 'hello', expected: 'false' },
        { stdin: 'a', expected: 'true', hidden: true },
        { stdin: 'abba', expected: 'true', hidden: true },
      ],
      hints: ['Two pointers: one at the start, one at the end.', 'Move them inward; if any pair differs, it’s not a palindrome.'],
      solutions: [
        {
          label: 'Two pointers',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        int i = 0, j = s.length() - 1;
        boolean ok = true;
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) { ok = false; break; }
            i++; j--;
        }
        System.out.println(ok);
    }
}`,
          explanation: [{ type: 'p', text: 'Compare the ends and walk inward. As soon as two characters differ, stop. **O(n)** time, **O(1)** space — the canonical two-pointer move.' }],
        },
      ],
    },
    {
      id: 'dsa-str-vowels',
      title: 'Count the Vowels',
      difficulty: 'Easy',
      tags: ['strings', 'warm-up'],
      statement: [{ type: 'p', text: 'Print how many vowels (a, e, i, o, u — any case) the string contains.' }],
      examples: [{ input: 'hello', output: '2' }, { input: 'xyz', output: '0' }],
      constraints: ['0 ≤ length ≤ 10^5'],
      ioNote: 'Input: one line. Output: the vowel count.',
      starterCode: STARTER,
      tests: [
        { stdin: 'hello', expected: '2' },
        { stdin: 'AEIOU', expected: '5' },
        { stdin: 'xyz', expected: '0', hidden: true },
        { stdin: 'Programming', expected: '3', hidden: true },
      ],
      hints: ['Scan each character once.', 'Lowercase it, then check against a, e, i, o, u.'],
      solutions: [
        {
          label: 'Single scan',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = Character.toLowerCase(s.charAt(i));
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;
        }
        System.out.println(count);
    }
}`,
          explanation: [{ type: 'p', text: 'One pass, lowercase each char, test membership. **O(n)**. `"aeiou".indexOf(c) >= 0` is a neat shorter check.' }],
        },
      ],
    },
    {
      id: 'dsa-str-anagram',
      title: 'Valid Anagram',
      difficulty: 'Medium',
      tags: ['strings', 'hashing'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Two lowercase strings are given. Print `true` if one is an **anagram** of the other (same letters, same counts, any order), else `false`.' }],
      examples: [
        { input: 'anagram\nnagaram', output: 'true' },
        { input: 'rat\ncar', output: 'false' },
      ],
      constraints: ['Both strings are lowercase a–z.', '0 ≤ length ≤ 10^5'],
      ioNote: 'Line 1: first string. Line 2: second string. Output: true or false.',
      starterCode: STARTER,
      tests: [
        { stdin: 'anagram\nnagaram', expected: 'true' },
        { stdin: 'rat\ncar', expected: 'false' },
        { stdin: 'a\nab', expected: 'false', hidden: true },
        { stdin: 'listen\nsilent', expected: 'true', hidden: true },
      ],
      hints: ['Different lengths → instantly false.', 'Count each letter of the first string (a 26-slot array), then subtract using the second. All zero ⇒ anagram.'],
      solutions: [
        {
          label: 'Sort & compare',
          bigO: 'Time O(n log n) · Space O(n)',
          code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine(), t = br.readLine();
        if (s == null) s = ""; if (t == null) t = "";
        char[] a = s.toCharArray(), b = t.toCharArray();
        Arrays.sort(a); Arrays.sort(b);
        System.out.println(Arrays.equals(a, b));
    }
}`,
          explanation: [{ type: 'p', text: 'Sort both and compare — anagrams sort to identical sequences. Simple, but **O(n log n)** because of the sort.' }],
        },
        {
          label: 'Optimal (count array)',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine(), t = br.readLine();
        if (s == null) s = ""; if (t == null) t = "";
        if (s.length() != t.length()) { System.out.println(false); return; }

        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;     // add for s
            count[t.charAt(i) - 'a']--;     // remove for t
        }
        for (int c : count) if (c != 0) { System.out.println(false); return; }
        System.out.println(true);
    }
}`,
          explanation: [
            { type: 'p', text: 'One 26-slot array: `+1` for each letter of `s`, `-1` for each of `t`. If everything cancels to zero, they’re anagrams. **O(n)** time, **O(1)** space (the array is fixed-size 26).' },
            { type: 'callout', variant: 'key', text: 'The `char - \'a\'` → array-index trick is one of the most useful patterns in all of string problems.' },
          ],
        },
      ],
    },
    {
      id: 'dsa-str-first-unique',
      title: 'First Unique Character',
      difficulty: 'Medium',
      tags: ['strings', 'hashing'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Print the **index** of the first character that appears exactly once. If there is none, print `-1`.' }],
      examples: [
        { input: 'leetcode', output: '0', explanation: '\'l\' is the first non-repeating character.' },
        { input: 'aabb', output: '-1' },
      ],
      constraints: ['0 ≤ length ≤ 10^5'],
      ioNote: 'Input: one line. Output: the index of the first unique character, or -1.',
      starterCode: STARTER,
      tests: [
        { stdin: 'leetcode', expected: '0' },
        { stdin: 'loveleetcode', expected: '2' },
        { stdin: 'aabb', expected: '-1', hidden: true },
        { stdin: 'z', expected: '0', hidden: true },
      ],
      hints: ['Two passes: first count every character.', 'Second pass: the first character whose count is 1 — print its index.'],
      solutions: [
        {
          label: 'Count then scan',
          bigO: 'Time O(n) · Space O(1)',
          code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        int[] count = new int[256];
        for (int i = 0; i < s.length(); i++) count[s.charAt(i)]++;
        for (int i = 0; i < s.length(); i++)
            if (count[s.charAt(i)] == 1) { System.out.println(i); return; }
        System.out.println(-1);
    }
}`,
          explanation: [{ type: 'p', text: 'Count every character (first pass), then return the index of the first one with count 1 (second pass). Two passes is still **O(n)**.' }],
        },
      ],
    },
    {
      id: 'dsa-str-reverse-words',
      title: 'Reverse Words in a Sentence',
      difficulty: 'Medium',
      tags: ['strings'],
      isInterview: true,
      statement: [{ type: 'p', text: 'Given a sentence of words separated by single spaces, print the words in **reverse order**.' }],
      examples: [
        { input: 'the sky is blue', output: 'blue is sky the' },
        { input: 'hello world', output: 'world hello' },
      ],
      constraints: ['Words are separated by single spaces.', '1 ≤ length ≤ 10^4'],
      ioNote: 'Input: one line (the sentence). Output: the words in reverse order, single-spaced.',
      starterCode: STARTER,
      tests: [
        { stdin: 'the sky is blue', expected: 'blue is sky the' },
        { stdin: 'hello world', expected: 'world hello' },
        { stdin: 'single', expected: 'single', hidden: true },
        { stdin: 'a b c d', expected: 'd c b a', hidden: true },
      ],
      hints: ['Split the line on spaces into an array of words.', 'Append them to a StringBuilder from the last word to the first.'],
      solutions: [
        {
          label: 'Split & rebuild',
          bigO: 'Time O(n) · Space O(n)',
          code: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        String[] words = s.split(" ");
        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(' ');
        }
        System.out.println(sb.toString());
    }
}`,
          explanation: [{ type: 'p', text: 'Split into words, then append from the back into a `StringBuilder` (so we print once). **O(n)**. The `if (i > 0)` avoids a trailing space.' }],
        },
      ],
    },
  ],
};
