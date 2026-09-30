---
slug: variables-control-functions
title: Variables, control flow and functions in Go
after: introduction
---
# Variables, control flow and functions in Go

Go (Golang) was created at Google for building fast, reliable servers and tools. Docker, Kubernetes and many payment and fintech back-ends are written in Go. It's deliberately small: few keywords, one way to loop, and a compiler that catches lots of mistakes.

> Examples run on Compiler Explorer (online), so they need internet. Every program starts with `package main` and a `func main()`.

## Variables

```try-go
package main

import "fmt"

func main() {
	var school string = "Moi Forces Academy"
	var students int = 45
	fee := 12500.50            // := declares and infers the type (inside functions)
	paid := true
	const vat = 0.16

	fmt.Println(school, "has", students, "students")
	fmt.Printf("Fee: KSh %.2f, paid: %t, VAT: %.0f%%\n", fee, paid, vat*100)

	var count int              // zero value: 0
	var name string            // zero value: ""
	fmt.Printf("count=%d name=%q\n", count, name)
}
```

- `:=` is the short form you'll use most.
- Every type has a **zero value** (`0`, `""`, `false`, `nil`): no uninitialised garbage.
- Go **refuses to compile** if you declare a variable or import a package and don't use it. Annoying at first, great for clean code.

| Type | Example |
|---|---|
| `int`, `int64` | `qty := 3` |
| `float64` | `price := 180.5` |
| `string` | `town := "Eldoret"` |
| `bool` | `ok := true` |
| `rune` | `'K'` (a character) |

## Conversions are always explicit

```try-go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	qty := 3
	price := 180.5
	total := float64(qty) * price          // must convert int to float64 yourself
	fmt.Println(total)

	n, err := strconv.Atoi("250")          // string -> int, with an error value
	if err != nil {
		fmt.Println("not a number")
	} else {
		fmt.Println(n * 2)
	}
	s := strconv.Itoa(2026)                // int -> string
	fmt.Println("Year " + s)
}
```

## if and switch

```try-go
package main

import "fmt"

func grade(mark int) string {
	switch {
	case mark >= 80:
		return "A"
	case mark >= 65:
		return "B"
	case mark >= 50:
		return "C"
	default:
		return "Fail"
	}
}

func main() {
	for _, m := range []int{92, 67, 55, 30} {
		fmt.Println(m, grade(m))
	}

	if balance := 1200; balance >= 1000 {  // a short statement before the condition
		fmt.Println("Enough for the order")
	}

	day := "SAT"
	switch day {
	case "SAT", "SUN":
		fmt.Println("Weekend")
	default:
		fmt.Println("Weekday")
	}
}
```

No brackets around conditions, braces always required, and `switch` cases don't fall through (no `break` needed).

## for: Go's only loop

```try-go
package main

import "fmt"

func main() {
	for i := 1; i <= 3; i++ {           // classic
		fmt.Println("Round", i)
	}

	savings, week := 0, 0
	for savings < 10000 {               // like while
		savings += 1500
		week++
	}
	fmt.Println("Week", week)

	towns := []string{"Nyeri", "Meru", "Embu"}
	for i, t := range towns {           // range over a slice
		fmt.Println(i, t)
	}
}
```

## Functions, multiple returns and errors

```try-go
package main

import (
	"errors"
	"fmt"
)

func withVat(amount, rate float64) float64 {
	return amount * (1 + rate/100)
}

func divide(total float64, people int) (float64, error) {   // returns a value AND an error
	if people == 0 {
		return 0, errors.New("cannot split between zero people")
	}
	return total / float64(people), nil
}

func main() {
	fmt.Printf("%.2f\n", withVat(1000, 16))

	share, err := divide(3000, 4)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Printf("Each pays KSh %.2f\n", share)

	if _, err := divide(3000, 0); err != nil {
		fmt.Println("Error:", err)
	}
}
```

Go has no exceptions for normal errors: functions **return an error** as the last value, and you check `if err != nil`. It's verbose, but you always see where things can fail.

```quiz
Q: Which operator declares a variable and infers its type inside a function?
A: :=
Q: How many loop keywords does Go have?
A: 1 | one
Q: What is the zero value of an int in Go?
A: 0 | zero
Q: What value means "no error" in Go?
A: nil
Q: Will Go compile a program with an unused variable? (yes or no)
A: no
```
