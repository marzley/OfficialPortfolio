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
```
