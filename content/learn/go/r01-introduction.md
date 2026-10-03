---
slug: introduction
title: "Go introduction: why Go, where it's used, setup, packages, variables and types, control flow, functions, errors and the go tool"
after: KEEP
---
# Go introduction: why Go, where it's used, setup, packages, variables and types, control flow, functions, errors and the go tool

**Go** (often called Golang) was created at Google by Robert Griesemer, Rob Pike and Ken Thompson, and released in 2009. It was designed to be **simple, fast to compile, fast to run, and easy for teams to maintain**, especially for networked servers and cloud software. Docker, Kubernetes, Terraform, Prometheus and many cloud tools are written in Go, and companies use it for APIs, microservices, payment systems, command-line tools and DevOps automation. Go has a small set of features, excellent built-in tooling, and great support for **concurrency** (doing many things at once), which makes it a strong choice for back-end developers.

:::note What you will learn
- Why Go exists and where it's used
- Installing Go and the go command
- Packages, imports and the main function
- Variables, constants, zero values and basic types
- Strings, formatting with fmt and string conversion
- if, switch and the one loop: for
- Functions with multiple return values
- Error handling the Go way
- defer
- Go modules, formatting and testing tools
:::

## Why Go?

| Strength | Meaning |
|---|---|
| **Simple** | Few keywords, one way to do most things; easy to read others' code |
| **Fast** | Compiled to native code; quick start-up and low memory use |
| **Fast compilation** | Large projects build in seconds |
| **Concurrency** | Goroutines and channels make concurrent programs easier (see the goroutines lesson) |
| **Single binary** | Deploy one file with no runtime to install |
| **Great tooling** | Formatting, testing, dependency management built in |

## Where Go is used

| Area | Examples |
|---|---|
| Cloud infrastructure | Docker, Kubernetes, Terraform |
| Web APIs and microservices | Fast JSON APIs, payment and fintech services |
| DevOps tools | CLIs, monitoring (Prometheus), automation |
| Networking | Proxies, load balancers, DNS servers |
| Data pipelines | High-throughput processing services |

## Setup

1. Download and install Go from go.dev/dl.
2. Check: `go version`.
3. Editor: VS Code with the Go extension, or GoLand.
4. Create and run a program:

```bash
mkdir hello && cd hello
go mod init example.com/hello      # creates go.mod (module definition)
go run .                           # compile and run
go build                           # create an executable
```

In this hub, the **Run** button compiles and runs Go online, and the Go Playground (go.dev/play) is great for quick experiments.

## Your first program

```try-go
package main

import "fmt"

func main() {
	fmt.Println("Habari, Kenya!")
	fmt.Println("Learning Go on the Marzley learning hub.")
}
```

- Every Go file belongs to a **package**; executables use `package main`.
- `import "fmt"` brings in the formatting package.
- `func main()` is where the program starts.
- No semicolons needed at line ends; the opening brace `{` must be on the same line.
- Go code is formatted with tabs by the standard tool `gofmt`.

## Variables, constants and zero values

```try-go
package main

import "fmt"

func main() {
	var school string = "Moi Forces Academy"
	var students int = 45
	fee := 12500.50        // short declaration: type inferred (float64), only inside functions
	paid := true
	const vat = 0.16

	fmt.Println(school, "has", students, "students")
	fmt.Printf("Fee: KSh %.2f, paid: %t, VAT: %.0f%%\n", fee, paid, vat*100)

	var count int          // zero value: 0
	var name string        // zero value: ""
	var ok bool            // zero value: false
	fmt.Printf("count=%d name=%q ok=%t\n", count, name, ok)

	a, b := 10, 3
	fmt.Println(a/b, a%b, float64(a)/float64(b))   // integer division, remainder, float division
}
```

| Type | Examples |
|---|---|
| `int`, `int64`, `uint` | Whole numbers |
| `float64` | Decimals |
| `string` | Text (UTF-8) |
| `bool` | true/false |
| `byte`, `rune` | A byte; a Unicode character |

Go has **no implicit conversions**: convert explicitly with `float64(a)`, `int(x)`. Unused variables and imports are **compile errors**, which keeps code clean.

## Strings and fmt

```try-go
package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	name := "Wanjiku Kamau"
	fmt.Println(strings.ToUpper(name))
	fmt.Println(strings.Contains(name, "Kamau"), len(name))
	fmt.Println(strings.Split("Nairobi,Mombasa,Kisumu", ","))
	fmt.Println(strings.Replace("0712345678", "0", "254", 1))

	n, err := strconv.Atoi("1500")      // string -> int, with an error
	fmt.Println(n+500, err)
	_, err = strconv.Atoi("abc")
	fmt.Println("Converting 'abc':", err)

	msg := fmt.Sprintf("%-10s|%8.2f", "Unga", 195.0)
	fmt.Println(msg)
}
```

| Verb | Meaning |
|---|---|
| `%v` | Default format (any value) |
| `%+v` | Struct with field names |
| `%d` | Integer |
| `%.2f` | Float with 2 decimals |
| `%s`, `%q` | String, quoted string |
| `%t` | Boolean |
| `%T` | Type of the value |

## Control flow

```try-go
package main

import "fmt"

func grade(mark int) string {
	if mark >= 80 {
		return "A"
	} else if mark >= 65 {
		return "B"
	} else if mark >= 50 {
		return "C"
	}
	return "D/E"
}

func main() {
	fmt.Println("72 ->", grade(72))

	if balance := 0.0; balance <= 0 {      // if with a short statement
		fmt.Println("Fees cleared")
	}

	status := "shipped"
	switch status {                         // no break needed
	case "pending":
		fmt.Println("Waiting for payment")
	case "paid", "processing":
		fmt.Println("Preparing order")
	case "shipped":
		fmt.Println("On the way")
	default:
		fmt.Println("Unknown")
	}

	for i := 1; i <= 3; i++ {               // classic for
		fmt.Println("7 x", i, "=", 7*i)
	}

	balance, months := 0.0, 0
	for balance < 50000 {                   // for as a while loop
		balance = balance*1.01 + 4500
		months++
	}
	fmt.Println("Months to save 50,000:", months)

	towns := []string{"Nairobi", "Mombasa", "Kisumu"}
	for i, t := range towns {               // range over a slice
		fmt.Println(i, t)
	}
}
```

Go has only one loop keyword, `for`, used in three forms: classic, while-style, and `range`.

## Functions and multiple return values

```try-go
package main

import (
	"errors"
	"fmt"
)

func vat(amount float64) float64 {
	return amount * 0.16
}

func divide(a, b float64) (float64, error) {      // returns a result AND an error
	if b == 0 {
		return 0, errors.New("cannot divide by zero")
	}
	return a / b, nil
}

func minMax(values []int) (min, max int) {          // named results
	min, max = values[0], values[0]
	for _, v := range values {
		if v < min {
			min = v
		}
		if v > max {
			max = v
		}
	}
	return
}

func main() {
	fmt.Println(vat(1000))

	if result, err := divide(10, 4); err == nil {
		fmt.Println("Result:", result)
	}
	if _, err := divide(1, 0); err != nil {
		fmt.Println("Error:", err)
	}

	lo, hi := minMax([]int{67, 82, 45, 90})
	fmt.Println("Lowest", lo, "highest", hi)
}
```

## Errors the Go way

Go doesn't use exceptions for normal errors. Functions return an `error` value, and callers check it immediately:

```go
data, err := os.ReadFile("students.csv")
if err != nil {
    log.Fatalf("could not read file: %v", err)
}
```

You can wrap errors with context: `fmt.Errorf("loading students: %w", err)`, and check them with `errors.Is`. `panic` exists for truly unexpected situations, not routine errors.

## defer

`defer` schedules a call to run when the function returns, usually for cleanup:

```try-go
package main

import "fmt"

func process() {
	fmt.Println("Open connection")
	defer fmt.Println("Close connection")     // runs last, even if we return early
	fmt.Println("Process payments")
}

func main() {
	process()
}
```

Typical use: `f, err := os.Open(name); if err != nil {...}; defer f.Close()`.

## The go tool

| Command | Purpose |
|---|---|
| `go run .` | Compile and run |
| `go build` | Build an executable |
| `go mod init name` | Start a module |
| `go get pkg@version` | Add a dependency |
| `go mod tidy` | Clean up dependencies |
| `go fmt ./...` | Format code |
| `go vet ./...` | Find suspicious code |
| `go test ./...` | Run tests |

Cross-compiling is easy: `GOOS=linux GOARCH=amd64 go build` builds a Linux binary from any OS.

:::think A Go program won't compile because of "declared and not used: total". Why is Go strict about this?
Unused variables (and imports) often signal bugs or leftover code, so Go treats them as compile errors to keep code clean and correct. Use the variable, remove it, or assign to `_` if you must ignore a value.
:::

## Summary

- Go (Google, 2009) is simple, fast and built for servers, cloud tools and concurrency; Docker and Kubernetes are written in it.
- Programs use `package main`, `import`, and `func main()`; modules start with `go mod init`.
- Declare with `var` or `:=`; values have zero defaults; conversions are explicit; unused variables are errors.
- Control flow: if (with short statements), switch (no break), and one `for` loop in three forms including `range`.
- Functions return multiple values, especially `(result, error)`; check errors immediately; `defer` cleans up; use go fmt, vet and test.

```quiz
Q: Which company created Go?
A: Google
Q: Which operator declares and initialises a variable with type inference inside functions?
A: := | colon equals
Q: How many loop keywords does Go have?
A: 1 | one
Q: What value is returned for "no error" in Go?
A: nil
Q: Which keyword schedules a call to run when the function returns?
A: defer
Q: Name a famous tool written in Go.
A: Docker | Kubernetes | Terraform | Prometheus
```
