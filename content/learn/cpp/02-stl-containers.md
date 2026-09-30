---
slug: vectors-strings-stl
title: vector, string, map and the STL algorithms
after: basics-references-functions
---
# vector, string, map and the STL algorithms

The **Standard Template Library (STL)** is C++'s toolbox of ready-made containers and algorithms. Using it well is the difference between 200 lines of tricky C and 20 lines of clear C++. It's also the secret weapon of competitive programmers.

> These examples use the STL, so they run on Compiler Explorer (internet needed).

## vector: a growable array

```try-cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> marks = {78, 92, 45, 60};
    marks.push_back(88);                     // add to the end
    cout << "Count: " << marks.size() << ", first: " << marks[0] << ", last: " << marks.back() << endl;

    int total = 0;
    for (int m : marks) total += m;          // range-based for
    cout << "Average: " << (double) total / marks.size() << endl;

    marks.pop_back();                        // remove the last
    marks.insert(marks.begin() + 1, 70);     // insert at position 1
    marks.erase(marks.begin());              // remove the first
    for (int m : marks) cout << m << " ";
    cout << endl;
    return 0;
}
```

Use `vector` instead of raw arrays in C++: it knows its size, grows automatically and frees its memory for you.

## string

```try-cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "amina hassan";
    name[0] = toupper(name[0]);
    cout << name << " (" << name.size() << " chars)" << endl;
    cout << name.substr(0, 5) << endl;                  // "Amina"
    size_t pos = name.find("hassan");
    if (pos != string::npos) cout << "found at " << pos << endl;
    name += " - Mombasa";                                // append
    cout << name << endl;

    string phone = "0712 345 678";
    string digits;
    for (char c : phone) if (isdigit(c)) digits += c;
    cout << digits << ", valid length: " << (digits.size() == 10) << endl;

    int n = stoi("250");                                 // string -> int
    string s = to_string(n * 2);                         // int -> string
    cout << s << endl;
    return 0;
}
```

## map and unordered_map: key → value

```try-cpp
#include <iostream>
#include <map>
#include <unordered_map>
#include <sstream>
using namespace std;

int main() {
    map<string, int> stock;                  // kept sorted by key
    stock["Unga"] = 12;
    stock["Oil"] = 7;
    stock["Sugar"] = 0;
    for (auto &[item, qty] : stock) cout << item << ": " << qty << endl;   // structured bindings (C++17)

    if (stock.count("Rice") == 0) cout << "No rice" << endl;

    unordered_map<string, int> counts;       // faster, not sorted
    stringstream words("haraka haraka haina baraka");
    string w;
    while (words >> w) counts[w]++;          // missing keys start at 0
    cout << "haraka appears " << counts["haraka"] << " times" << endl;
    return 0;
}
```

## set

```try-cpp
#include <iostream>
#include <set>
using namespace std;

int main() {
    set<string> visitors = {"Otieno", "Wanjiru", "Otieno", "Kiprop"};
    cout << visitors.size() << " unique visitors:";
    for (const string &v : visitors) cout << " " << v;     // sorted
    cout << endl;
    return 0;
}
```

## The algorithms library

```try-cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

int main() {
    vector<int> v = {45, 78, 92, 60, 33, 88};

    sort(v.begin(), v.end());                                  // ascending
    cout << "Sorted: "; for (int x : v) cout << x << " "; cout << endl;

    sort(v.begin(), v.end(), greater<int>());                  // descending
    cout << "Top: " << v[0] << endl;

    cout << "Sum: " << accumulate(v.begin(), v.end(), 0) << endl;
    cout << "Max: " << *max_element(v.begin(), v.end()) << endl;
    cout << "Passed: " << count_if(v.begin(), v.end(), [](int m) { return m >= 50; }) << endl;

    auto it = find(v.begin(), v.end(), 60);
    cout << "60 is at index " << (it - v.begin()) << endl;

    sort(v.begin(), v.end());
    cout << "Has 78? " << binary_search(v.begin(), v.end(), 78) << endl;   // needs sorted data
    reverse(v.begin(), v.end());
    return 0;
}
```

`[](int m) { return m >= 50; }` is a **lambda**: a small unnamed function passed to the algorithm.

## Sorting objects

```try-cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

struct Student { string name; int mark; };

int main() {
    vector<Student> cls = {{"Amina", 78}, {"Brian", 92}, {"Chebet", 60}};
    sort(cls.begin(), cls.end(), [](const Student &a, const Student &b) { return a.mark > b.mark; });
    for (const auto &s : cls) cout << s.name << " " << s.mark << endl;
    return 0;
}
```

## Choosing a container

| Need | Container |
|---|---|
| A list you mostly add to and loop over | `vector` |
| Look up by key, sorted | `map` |
| Look up by key, fastest | `unordered_map` |
| Unique values | `set` / `unordered_set` |
| Queue / stack | `queue`, `stack`, `deque` |
| Always get the smallest/largest | `priority_queue` |

```quiz
Q: Which STL container is a growable array?
A: vector | std::vector
Q: Which vector method adds an item to the end?
A: push_back | push_back()
Q: Which container keeps key-value pairs sorted by key?
A: map | std::map
Q: Which algorithm function sorts a vector v? Write it as sort(...)
A: sort(v.begin(), v.end()) | sort(v.begin(),v.end())
Q: What is a small unnamed function like [](int m){ return m > 5; } called?
A: lambda | a lambda
```
