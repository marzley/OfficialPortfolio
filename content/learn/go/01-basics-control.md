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

## Why companies choose Go

Go (Golang) was created at Google for building fast, reliable server software that's easy to maintain. It compiles to a single file that runs anywhere, starts instantly, and handles many simultaneous connections efficiently. Docker, Kubernetes, many cloud tools, payment and fintech back ends, and APIs at companies around the world are written in Go. Its small, simple syntax makes it a good second language after Python or JavaScript, especially for back-end and DevOps careers.

## Constants and iota

```try-go
package main

import "fmt"

const VATRate = 0.16

type Status int

const (
	Pending Status = iota // 0
	Paid                  // 1
	Shipped               // 2
	Delivered             // 3
)

func (s Status) String() string {
	return [...]string{"Pending", "Paid", "Shipped", "Delivered"}[s]
}

func main() {
	price := 2500.0
	fmt.Printf("VAT on %.0f is %.2f\n", price, price*VATRate)
	var s Status = Shipped
	fmt.Println("Order status:", s, int(s))
}
```

`iota` numbers constants automatically, and adding a `String()` method makes them print nicely, a common Go pattern for enumerations.

## Formatted printing in detail

```try-go
package main

import "fmt"

func main() {
	name, qty, price := "Unga 2kg", 3, 180.0
	fmt.Printf("%-10s|%4d|%8.2f|\n", name, qty, price)
	fmt.Printf("%v %T\n", price, price)       // value and type
	fmt.Printf("%q\n", name)                  // quoted string
	fmt.Printf("%05d\n", 42)                  // zero padded
	fmt.Printf("%x %b\n", 255, 5)             // hex and binary
	line := fmt.Sprintf("%s x%d = KSh %.0f", name, qty, float64(qty)*price)
	fmt.Println(line)
}
```

| Verb | Meaning |
|---|---|
| `%v` | Default format for any value |
| `%+v` | Struct with field names |
| `%T` | Type of the value |
| `%d`, `%f`, `%s`, `%q` | Integer, float, string, quoted string |
| `%-10s`, `%8.2f` | Width, alignment and precision |

## switch without a condition (cleaner if/else chains)

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
		return "E"
	}
}

func main() {
	for _, m := range []int{92, 71, 55, 38} {
		fmt.Println(m, grade(m))
	}

	day := "Sat"
	switch day {
	case "Sat", "Sun":
		fmt.Println("Weekend rates apply")
	default:
		fmt.Println("Weekday")
	}
}
```

Go's `switch` cases don't fall through by default (no `break` needed), which avoids a classic C/Java bug.

## Loops with labels, break and continue

```try-go
package main

import "fmt"

func main() {
	balance := 0.0
	months := 0
	for balance < 50000 {
		balance = balance*1.01 + 4500
		months++
	}
	fmt.Printf("Saved %.0f after %d months\n", balance, months)

	for i := 1; i <= 10; i++ {
		if i%2 == 0 {
			continue // skip even numbers
		}
		if i > 7 {
			break
		}
		fmt.Print(i, " ")
	}
	fmt.Println()

outer:
	for row := 1; row <= 3; row++ {
		for col := 1; col <= 3; col++ {
			if row*col == 4 {
				fmt.Println("found 4 at", row, col)
				break outer // leave both loops
			}
		}
	}
}
```

## Errors as values: a real validation example

```try-go
package main

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

var ErrEmpty = errors.New("amount is empty")

func parseAmount(text string) (float64, error) {
	text = strings.ReplaceAll(strings.TrimSpace(text), ",", "")
	if text == "" {
		return 0, ErrEmpty
	}
	n, err := strconv.ParseFloat(text, 64)
	if err != nil {
		return 0, fmt.Errorf("%q is not a number: %w", text, err)
	}
	if n <= 0 {
		return 0, fmt.Errorf("amount must be above 0, got %.2f", n)
	}
	return n, nil
}

func main() {
	for _, input := range []string{"1,500", "", "abc", "-20", " 250 "} {
		amount, err := parseAmount(input)
		switch {
		case errors.Is(err, ErrEmpty):
			fmt.Println("Please enter an amount")
		case err != nil:
			fmt.Println("Error:", err)
		default:
			fmt.Printf("OK: %.2f\n", amount)
		}
	}
}
```

`%w` wraps an error so callers can inspect the original with `errors.Is`. Handling errors right where they happen makes Go programs predictable.

## defer: clean-up that always runs

```try-go
package main

import "fmt"

func process(order int) {
	fmt.Println("start", order)
	defer fmt.Println("finished", order) // runs when the function returns
	if order%2 == 0 {
		fmt.Println("even order, returning early")
		return
	}
	fmt.Println("processing odd order")
}

func main() {
	process(1)
	process(2)
	for i := 1; i <= 3; i++ {
		defer fmt.Println("deferred", i) // run in reverse order: 3, 2, 1
	}
}
```

`defer` is used to close files, release locks and close database connections, guaranteeing clean-up even when a function returns early or an error occurs.

## Go tooling

```bash
go mod init github.com/you/shop     # start a module
go run .                            # compile and run
go build -o shop                    # build a single binary
go fmt ./...                        # format all code the standard way
go vet ./...                        # find suspicious code
go test ./...                       # run tests
GOOS=linux GOARCH=amd64 go build    # cross-compile for a Linux server from any OS
```

`go fmt` ends formatting debates: all Go code looks the same.

## Practice

1. Create constants for three payment methods with `iota` and a `String()` method.
2. Write a `switch`-based function that returns a delivery fee by town.
3. Write `parsePhone(text string) (string, error)` returning 2547XXXXXXXX or an error.
4. Use `defer` to print "done" at the end of a function with several return paths.
5. Print a receipt table with `Printf` widths and precision.

:::think Why does Go return errors as values instead of throwing exceptions like Java or Python?
Returning errors makes every possible failure visible in a function's signature and forces callers to decide what to do right away. Control flow stays explicit and easy to follow, with no hidden jumps up the call stack. The trade-off is more `if err != nil` checks, which Go developers accept for clarity and reliability.
:::

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
Q: Which identifier numbers constants automatically in a const block?
A: iota
Q: Which keyword schedules a function call to run when the surrounding function returns?
A: defer
Q: Which formatting verb wraps an error in fmt.Errorf?
A: %w
Q: Do Go switch cases fall through by default? (yes or no)
A: no
```
