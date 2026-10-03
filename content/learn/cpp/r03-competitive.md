---
slug: competitive-programming
title: "C++ for competitive programming: fast I/O, STL containers and algorithms, complexity, common patterns and how to practise"
after: KEEP
---
# C++ for competitive programming: fast I/O, STL containers and algorithms, complexity, common patterns and how to practise

**Competitive programming** means solving algorithmic problems under time and memory limits: reading input, computing the answer efficiently, and printing it, judged automatically. Platforms like Codeforces, AtCoder, LeetCode and HackerRank host contests and practice problems; students compete in events such as the ICPC, and many Kenyan universities have competitive programming clubs. The skills (thinking in algorithms, choosing data structures, writing correct code fast) are exactly what big tech coding interviews test. C++ is the most popular contest language because it's fast and its **Standard Template Library (STL)** provides ready-made data structures and algorithms.

:::note What you will learn
- How online judges work: input/output format, limits, verdicts
- A contest template and fast input/output
- Estimating whether a solution is fast enough
- STL containers: vector, pair, string, set, map, unordered_map, stack, queue, deque, priority_queue
- STL algorithms: sort, custom comparators, binary search, accumulate, min/max, reverse
- Common patterns: prefix sums, two pointers, frequency counting, greedy, BFS
- Overflow, edge cases and debugging
- How to practise and improve
:::

## How online judges work

1. Read the problem: input format, output format, **constraints** (e.g. n ≤ 200,000), time limit (often 1–2 seconds), memory limit.
2. Write a program that reads from **standard input** and writes to **standard output** exactly as specified.
3. Submit; the judge runs hidden tests.

| Verdict | Meaning |
|---|---|
| **AC** (Accepted) | Correct on all tests |
| **WA** (Wrong Answer) | Incorrect output on some test |
| **TLE** (Time Limit Exceeded) | Too slow |
| **MLE** (Memory Limit Exceeded) | Too much memory |
| **RE** (Runtime Error) | Crash: out-of-range index, division by zero, stack overflow |
| **CE** (Compilation Error) | Doesn't compile |

## A contest template

```cpp
#include <bits/stdc++.h>          // includes the whole standard library (GCC-specific, contests only)
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);  // fast I/O
    cin.tie(nullptr);

    int t;                        // many problems have several test cases
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        vector<ll> a(n);
        for (auto &x : a) cin >> x;
        cout << accumulate(a.begin(), a.end(), 0LL) << "\n";   // "\n" is faster than endl
    }
    return 0;
}
```

- `bits/stdc++.h` and `using namespace std` are fine in contests but avoid them in production code.
- Fast I/O matters when reading hundreds of thousands of numbers.
- Use `long long` for sums and products that might exceed about 2.1 billion.

## Is my solution fast enough?

A typical judge does roughly **10⁸ simple operations per second**. Compare your algorithm's complexity with the constraints:

| n up to | Acceptable complexity |
|---|---|
| ~10–12 | O(n!) |
| ~20–25 | O(2ⁿ) |
| ~500 | O(n³) |
| ~5,000 | O(n²) |
| ~200,000–1,000,000 | O(n log n) or O(n) |
| ~10¹⁸ | O(log n) or O(1) (maths) |

If n = 200,000, an O(n²) double loop (4 × 10¹⁰ operations) will TLE; you need sorting, prefix sums, two pointers, hashing or another O(n log n) idea.

## STL containers

```try-cpp
#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <string>
using namespace std;

int main() {
    vector<int> v = {5, 3, 8, 1};
    v.push_back(10);
    cout << "size " << v.size() << ", last " << v.back() << endl;

    pair<string, int> p = {"Nairobi", 47};
    cout << p.first << " " << p.second << endl;

    set<int> s = {5, 1, 5, 3};                 // sorted, unique
    for (int x : s) cout << x << " ";
    cout << "| has 3? " << s.count(3) << endl;

    map<string, int> stock;                    // sorted keys
    stock["unga"] = 40;
    stock["sugar"] = 25;
    stock["unga"] -= 5;
    for (auto &item : stock) cout << item.first << "=" << item.second << " ";
    cout << endl;
    return 0;
}
```

| Container | Use | Key operations |
|---|---|---|
| `vector` | Dynamic array | push_back O(1), index O(1) |
| `string` | Text | +, substr, find |
| `pair` / `tuple` | Group values | .first, .second |
| `set` | Sorted unique values | insert/find/erase O(log n) |
| `multiset` | Sorted, duplicates allowed | O(log n) |
| `map` | Sorted key → value | O(log n) |
| `unordered_map` / `unordered_set` | Hash table | O(1) average |
| `stack` | LIFO | push, pop, top |
| `queue` | FIFO (BFS) | push, pop, front |
| `deque` | Both ends | push/pop front and back |
| `priority_queue` | Largest (or smallest) first | push/pop O(log n) |

```try-cpp
#include <iostream>
#include <queue>
#include <stack>
#include <vector>
using namespace std;

int main() {
    priority_queue<int> maxHeap;                               // largest on top
    priority_queue<int, vector<int>, greater<int>> minHeap;    // smallest on top
    int vals[5] = {7, 2, 9, 4, 1};
    for (int i = 0; i < 5; i++) {
        maxHeap.push(vals[i]);
        minHeap.push(vals[i]);
    }
    cout << "max " << maxHeap.top() << ", min " << minHeap.top() << endl;

    stack<char> st;
    string brackets = "(()())";
    bool ok = true;
    for (char c : brackets) {
        if (c == '(') st.push(c);
        else if (st.empty()) { ok = false; break; }
        else st.pop();
    }
    cout << "Balanced: " << (ok && st.empty() ? "yes" : "no") << endl;
    return 0;
}
```

## STL algorithms

```try-cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <string>
using namespace std;

int main() {
    vector<int> marks = {67, 82, 45, 90, 58, 82};
    sort(marks.begin(), marks.end());                       // ascending
    for (int m : marks) cout << m << " ";
    cout << endl;

    sort(marks.begin(), marks.end(), greater<int>());       // descending
    cout << "Top mark: " << marks[0] << endl;

    cout << "Sum: " << accumulate(marks.begin(), marks.end(), 0) << endl;
    cout << "Max: " << *max_element(marks.begin(), marks.end()) << endl;
    cout << "Count of 82: " << count(marks.begin(), marks.end(), 82) << endl;

    sort(marks.begin(), marks.end());
    cout << "Has 58 (binary search)? " << binary_search(marks.begin(), marks.end(), 58) << endl;
    cout << "First >= 60 at index " << (lower_bound(marks.begin(), marks.end(), 60) - marks.begin()) << endl;

    vector<pair<string, int>> students = {{"Juma", 70}, {"Amina", 91}, {"Brian", 70}};
    sort(students.begin(), students.end(), [](const pair<string, int> &a, const pair<string, int> &b) {
        if (a.second != b.second) return a.second > b.second;   // higher mark first
        return a.first < b.first;                               // then by name
    });
    for (auto &s : students) cout << s.first << " " << s.second << endl;
    return 0;
}
```

`[](...) { ... }` is a **lambda**: an inline function used here as a custom comparator.

## Common patterns

### Prefix sums: fast range totals

Answer "sum of elements from l to r" in O(1) after O(n) preprocessing:

```try-cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> sales = {120, 450, 80, 300, 220, 510};
    int n = sales.size();
    vector<long long> prefix(n + 1, 0);
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + sales[i];

    // total sales for days 2..4 (0-based, inclusive)
    int l = 2, r = 4;
    cout << "Days " << l << "-" << r << ": " << prefix[r + 1] - prefix[l] << endl;
    return 0;
}
```

### Two pointers

On sorted data, move two indices inward or forward instead of trying all pairs (O(n) instead of O(n²)):

```try-cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> prices = {800, 1200, 900, 2500, 3500, 400};
    int budget = 3300;
    sort(prices.begin(), prices.end());
    int i = 0, j = prices.size() - 1, best = -1;
    while (i < j) {
        int sum = prices[i] + prices[j];
        if (sum <= budget) { best = max(best, sum); i++; }
        else j--;
    }
    cout << "Best pair total within budget: " << best << endl;
    return 0;
}
```

### Frequency counting

```try-cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    string votes = "ABACABBCA";
    map<char, int> freq;
    for (char c : votes) freq[c]++;
    for (auto &f : freq) cout << f.first << ": " << f.second << endl;
    return 0;
}
```

Other essential techniques to learn next: greedy algorithms, binary search on the answer, BFS/DFS on graphs (see the algorithms subject), dynamic programming, and number theory (gcd, modular arithmetic, primes with the sieve).

## Overflow, edge cases and debugging

- **Overflow**: `int` holds about ±2.1 × 10⁹. Sums of 200,000 values up to 10⁹ need `long long`. Products often need `long long` too (and sometimes modulo 10⁹ + 7 as problems specify).
- **Edge cases**: n = 1, all equal values, negative numbers, maximum constraints, empty strings.
- **Debugging**: test with the samples, then your own tricky cases; print intermediate values to stderr (`cerr`), which judges ignore; write a brute-force solution for small inputs and compare outputs.
- Read the output format carefully: spaces, new lines, "YES"/"Yes".

## How to practise

1. Learn the STL and basic algorithms (this subject and the algorithms subject).
2. Solve easy problems daily: Codeforces Div. 3/Div. 4, AtCoder Beginner Contests, LeetCode easy, HackerRank.
3. Use a structured problem set: CSES Problem Set (classic and free), the USACO Guide.
4. Join live contests regularly; review editorials for problems you couldn't solve and re-implement the solutions.
5. Track progress (rating, number solved) and focus on weak topics.
6. Join a community: university clubs, online groups, and practise with friends.

:::think A problem gives n ≤ 200,000 numbers and asks for the number of pairs whose sum equals k. A friend's solution uses two nested loops and gets TLE. What would you do instead?
Use a hash map (unordered_map) of counts: for each number x, add count[k − x] to the answer, then increment count[x]. That's O(n) on average. Alternatively sort and use two pointers (O(n log n)). Use long long for the answer, since the number of pairs can exceed 2 × 10⁹.
:::

## Summary

- Online judges test correctness and efficiency; read constraints and match verdicts (AC, WA, TLE, MLE, RE).
- Use a template with fast I/O and long long; estimate ~10⁸ operations per second to choose complexity.
- Master STL containers (vector, set, map, unordered_map, stack, queue, priority_queue) and algorithms (sort with comparators, binary_search, lower_bound, accumulate).
- Learn patterns: prefix sums, two pointers, frequency counting, then greedy, graphs and DP.
- Watch overflow and edge cases, debug with brute force, and practise consistently on Codeforces, AtCoder, CSES and LeetCode.

```quiz
Q: What does TLE stand for?
A: Time Limit Exceeded
Q: Which C++ type should you use for sums that may exceed about 2 billion? (two words)
A: long long
Q: Which STL container keeps unique values in sorted order?
A: set | std::set
Q: Which STL algorithm sorts a range?
A: sort | std::sort
Q: About how many simple operations per second should you assume for a judge? (power of ten)
A: 10^8 | 100000000 | 10⁸ | 100 million
Q: Which technique answers range-sum queries in O(1) after preprocessing? (two words)
A: prefix sums | prefix sum
```
