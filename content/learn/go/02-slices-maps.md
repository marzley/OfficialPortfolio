---
slug: slices-maps
title: Slices, maps and strings in Go
after: variables-control-functions
---
# Slices, maps and strings in Go

Go's two workhorse collections are **slices** (growable lists) and **maps** (key → value). Together with strings, they cover most data you'll handle.

## Arrays vs slices

An **array** has a fixed size that's part of its type (`[3]int`). A **slice** (`[]int`) is a flexible view that can grow. You'll use slices almost always.

```try-go
package main

import (
	"fmt"
	"sort"
)

func main() {
	marks := []int{78, 92, 45, 60}
	marks = append(marks, 88)                 // append returns the new slice
	fmt.Println(marks, "len", len(marks))

	fmt.Println(marks[1:3])                   // [92 45]: from index 1 up to (not including) 3
	fmt.Println(marks[:2], marks[3:])

	total := 0
	for _, m := range marks {                 // _ ignores the index
		total += m
	}
	fmt.Printf("Average %.1f\n", float64(total)/float64(len(marks)))

	sort.Ints(marks)
	fmt.Println("Sorted:", marks)

	grid := make([][]int, 2)                  // a 2D slice
	grid[0] = []int{1, 2, 3}
	grid[1] = []int{4, 5, 6}
	fmt.Println(grid[1][2])
}
```

`make([]int, 0, 100)` creates an empty slice with room for 100 items (the **capacity**), which avoids re-allocating while you append.

> A slice of a slice shares the same underlying array: changing `part := marks[0:2]` also changes `marks`. Use `copy` or `append([]int(nil), s...)` for an independent copy.

## Maps

```try-go
package main

import (
	"fmt"
	"sort"
	"strings"
)

func main() {
	stock := map[string]int{
		"Unga":  12,
		"Sugar": 0,
		"Oil":   7,
	}
	stock["Rice"] = 20
	stock["Unga"] -= 2
	delete(stock, "Sugar")

	qty, ok := stock["Beans"]                 // ok is false if the key is missing
	fmt.Println("Beans:", qty, ok)

	keys := make([]string, 0, len(stock))
	for k := range stock {
		keys = append(keys, k)
	}
	sort.Strings(keys)                        // maps have no order: sort keys to print neatly
	for _, k := range keys {
		fmt.Printf("%-5s %3d\n", k, stock[k])
	}

	counts := map[string]int{}
	for _, w := range strings.Fields("haraka haraka haina baraka") {
		counts[w]++                           // missing keys start at 0
	}
	fmt.Println(counts["haraka"])
}
```

Maps iterate in **random order** on purpose. Sort the keys when order matters.

## Strings

```try-go
package main

import (
	"fmt"
	"strings"
)

func main() {
	name := "  amina hassan  "
	clean := strings.TrimSpace(name)
	fmt.Println(strings.ToUpper(clean))
	fmt.Println(strings.Title(clean))
	fmt.Println(strings.Contains(clean, "has"), strings.HasPrefix(clean, "am"))
	fmt.Println(strings.ReplaceAll("0712 345 678", " ", ""))
	parts := strings.Split("Nairobi,Mombasa,Kisumu", ",")
	fmt.Println(len(parts), strings.Join(parts, " | "))

	var b strings.Builder                      // efficient string building
	for i := 1; i <= 3; i++ {
		fmt.Fprintf(&b, "Row %d; ", i)
	}
	fmt.Println(b.String())

	word := "Karibu"
	for i, r := range word {                   // range gives runes (characters)
		fmt.Print(i, ":", string(r), " ")
	}
	fmt.Println()
}
```

Strings are UTF-8 bytes. `len("é")` is 2 (bytes); use `range` or `[]rune(s)` to work with characters.

## Structs and slices of structs

```try-go
package main

import (
	"fmt"
	"sort"
)

type Student struct {
	Name string
	Form string
	Mark int
}

func main() {
	class := []Student{
		{"Amina", "2A", 78},
		{"Brian", "3B", 92},
		{"Chebet", "2A", 60},
	}
	sort.Slice(class, func(i, j int) bool { return class[i].Mark > class[j].Mark })
	for pos, s := range class {
		fmt.Printf("%d. %-7s %s %d\n", pos+1, s.Name, s.Form, s.Mark)
	}

	byForm := map[string][]string{}
	for _, s := range class {
		byForm[s.Form] = append(byForm[s.Form], s.Name)
	}
	fmt.Println(byForm["2A"])
}
```

## Where slices and maps are used

Slices and maps are the workhorses of Go programs: lists of orders, products and users; lookups by ID, phone number or code; counting and grouping data for reports; caching results. JSON from APIs becomes slices and maps of structs. Understanding how slices share memory and how maps behave avoids some of the most common Go bugs.

## How slices really work

A slice is a small header pointing to an underlying array, with a **length** and a **capacity**:

```try-go
package main

import "fmt"

func main() {
	s := make([]int, 0, 3) // length 0, capacity 3
	for i := 1; i <= 5; i++ {
		s = append(s, i*100)
		fmt.Printf("len=%d cap=%d %v\n", len(s), cap(s), s)
	}

	original := []int{1, 2, 3, 4, 5}
	part := original[1:3]   // shares memory with original
	part[0] = 99
	fmt.Println(original)  // [1 99 3 4 5]: the change shows in original

	independent := make([]int, len(part))
	copy(independent, part) // a real copy
	independent[0] = 7
	fmt.Println(original, independent)
}
```

When `append` exceeds capacity, Go allocates a bigger array and copies the data. Sub-slices share the original array, so changing one can change the other; use `copy` (or `slices.Clone`) when you need independence.

## Removing and filtering items

```try-go
package main

import (
	"fmt"
	"slices"
)

func main() {
	towns := []string{"Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"}

	i := slices.Index(towns, "Kisumu")
	towns = slices.Delete(towns, i, i+1) // remove Kisumu
	fmt.Println(towns)

	towns = slices.Insert(towns, 1, "Thika")
	fmt.Println(towns, slices.Contains(towns, "Nakuru"))

	marks := []int{67, 82, 45, 90, 58, 39}
	passed := marks[:0:0] // empty slice, new backing array when appended
	for _, m := range marks {
		if m >= 50 {
			passed = append(passed, m)
		}
	}
	slices.Sort(passed)
	fmt.Println(passed, slices.Max(marks), slices.Min(marks))
}
```

The `slices` package (Go 1.21+) provides common operations like `Sort`, `Contains`, `Index`, `Insert`, `Delete`, `Max` and `Min`.

## Maps: counting, grouping and sorted output

```try-go
package main

import (
	"fmt"
	"sort"
)

type Sale struct {
	Town    string
	Product string
	Amount  int
}

func main() {
	sales := []Sale{
		{"Nakuru", "Unga", 1800}, {"Thika", "Sugar", 840},
		{"Nakuru", "Oil", 1400}, {"Eldoret", "Unga", 900},
	}

	totals := map[string]int{}
	byProduct := map[string][]Sale{}
	for _, s := range sales {
		totals[s.Town] += s.Amount // missing keys start at 0
		byProduct[s.Product] = append(byProduct[s.Product], s)
	}

	towns := make([]string, 0, len(totals))
	for t := range totals {
		towns = append(towns, t)
	}
	sort.Strings(towns) // maps have no order: sort keys for stable output
	for _, t := range towns {
		fmt.Printf("%-8s %5d\n", t, totals[t])
	}
	fmt.Println("Unga sales:", len(byProduct["Unga"]))

	delete(totals, "Thika")
	if _, ok := totals["Thika"]; !ok {
		fmt.Println("Thika removed")
	}
}
```

Map iteration order is deliberately random in Go; always sort keys when output order matters (reports, tests).

## Sets with maps

Go has no built-in set type; a `map[string]bool` (or `map[string]struct{}`) does the job:

```try-go
package main

import "fmt"

func main() {
	receipts := []string{"QJK1", "QJK2", "QJK1", "QJK3", "QJK2"}
	seen := map[string]bool{}
	var duplicates []string
	for _, r := range receipts {
		if seen[r] {
			duplicates = append(duplicates, r)
		}
		seen[r] = true
	}
	fmt.Println("Unique:", len(seen), "Duplicates:", duplicates)
}
```

Detecting duplicate M-Pesa receipt codes like this prevents recording the same payment twice.

## Strings, bytes and runes

```try-go
package main

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

func main() {
	word := "Wanjirũ"
	fmt.Println(len(word), utf8.RuneCountInString(word)) // bytes vs characters
	for i, r := range word {
		fmt.Printf("%d:%c ", i, r)
	}
	fmt.Println()

	var b strings.Builder
	for i := 1; i <= 3; i++ {
		fmt.Fprintf(&b, "Item %d; ", i)
	}
	fmt.Println(b.String())
	fmt.Println(strings.Fields("  pay   school   fees  "))
	fmt.Println(strings.ToUpper("kenya"), strings.Repeat("=", 10))
}
```

`len` counts bytes; characters like `ũ` take more than one byte in UTF-8. Range over a string to get **runes** (Unicode characters). Use `strings.Builder` to build long strings efficiently.

## JSON with structs

```try-go
package main

import (
	"encoding/json"
	"fmt"
)

type Product struct {
	ID      int     `json:"id"`
	Name    string  `json:"name"`
	Price   float64 `json:"price"`
	InStock bool    `json:"in_stock"`
}

func main() {
	data := `[{"id":1,"name":"Unga 2kg","price":180,"in_stock":true},{"id":2,"name":"Sugar 1kg","price":210,"in_stock":false}]`
	var products []Product
	if err := json.Unmarshal([]byte(data), &products); err != nil {
		fmt.Println("bad JSON:", err)
		return
	}
	for _, p := range products {
		fmt.Printf("%+v\n", p)
	}
	out, _ := json.MarshalIndent(products[0], "", "  ")
	fmt.Println(string(out))
}
```

Struct tags (`json:"in_stock"`) map Go field names to JSON keys. This is exactly how Go APIs read requests and send responses.

## Practice

1. Show how appending to a slice changes its length and capacity.
2. Remove all out-of-stock products from a slice of structs.
3. Count word frequencies in a sentence and print them sorted alphabetically.
4. Find duplicate phone numbers in a slice using a map as a set.
5. Decode a JSON array of students and print the one with the highest mark.

:::think A function receives `marks []int` and runs `marks[0] = 100`. The caller's slice changes. But when the function does `marks = append(marks, 5)`, the caller doesn't see the new item. Why?
A slice header (pointer, length, capacity) is passed by value, but it points to the same underlying array, so changing an element affects the caller's data. `append` returns a new header (possibly with a new array); assigning it to the local parameter doesn't update the caller's header. Return the new slice (`return marks`) or pass a pointer if the caller must see appended items.
:::

```quiz
Q: Which built-in function adds items to a slice?
A: append | append()
Q: What does marks[1:3] include: indexes 1 and 2, or 1, 2 and 3?
A: 1 and 2 | 1,2
Q: What does the second value ok mean in qty, ok := stock["Beans"]?
A: whether the key exists | key exists | found | exists
Q: Do Go maps keep their keys in order? (yes or no)
A: no
Q: Which function sorts a slice using your own comparison?
A: sort.Slice | Slice
Q: Which built-in function makes an independent copy of slice elements into another slice?
A: copy
Q: Is Go map iteration order guaranteed? (yes or no)
A: no
Q: What Go type represents a single Unicode character?
A: rune
Q: What part of a struct field maps it to a JSON key, like `json:"name"`? (two words)
A: struct tag | struct tags | tag
```
