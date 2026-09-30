---
slug: methods-interfaces
title: Methods, interfaces and error handling in Go
after: structs-web
---
# Methods, interfaces and error handling in Go

Go has no classes and no inheritance. Instead it uses **structs** with **methods**, and **interfaces** that types satisfy automatically. This small set of ideas scales to huge systems.

## Methods on structs

```try-go
package main

import (
	"errors"
	"fmt"
)

type Account struct {
	Owner   string
	balance float64 // lowercase = private to the package
}

// Value receiver: reads a copy
func (a Account) Balance() float64 { return a.balance }

// Pointer receiver: can change the account
func (a *Account) Deposit(amount float64) error {
	if amount <= 0 {
		return errors.New("deposit must be positive")
	}
	a.balance += amount
	return nil
}

func (a *Account) Withdraw(amount float64) error {
	if amount > a.balance {
		return fmt.Errorf("insufficient funds: balance is %.2f", a.balance)
	}
	a.balance -= amount
	return nil
}

func main() {
	acc := &Account{Owner: "Faith"}
	_ = acc.Deposit(5000)
	if err := acc.Withdraw(8000); err != nil {
		fmt.Println("Refused:", err)
	}
	_ = acc.Withdraw(1200)
	fmt.Printf("%s: KSh %.2f\n", acc.Owner, acc.Balance())
}
```

- `func (a *Account) Deposit(...)` attaches a method to `*Account`.
- Use a **pointer receiver** (`*Account`) when the method changes the struct or the struct is large.
- Capitalised names (`Owner`, `Deposit`) are **exported** (public); lowercase (`balance`) are private to the package.

## Interfaces: satisfied automatically

An interface lists methods. **Any** type with those methods satisfies it, with no `implements` keyword.

```try-go
package main

import (
	"fmt"
	"math"
)

type Shape interface {
	Area() float64
	Name() string
}

type Rectangle struct{ W, H float64 }
type Circle struct{ R float64 }

func (r Rectangle) Area() float64 { return r.W * r.H }
func (r Rectangle) Name() string  { return "rectangle" }
func (c Circle) Area() float64    { return math.Pi * c.R * c.R }
func (c Circle) Name() string     { return "circle" }

func totalArea(shapes []Shape) float64 {
	sum := 0.0
	for _, s := range shapes {
		fmt.Printf("%-9s %8.2f m2\n", s.Name(), s.Area())
		sum += s.Area()
	}
	return sum
}

func main() {
	plot := []Shape{Rectangle{20, 15}, Circle{4}, Rectangle{3, 3}}
	fmt.Printf("Total: %.2f m2\n", totalArea(plot))
}
```

Small interfaces are the Go way. The standard library's most famous ones have **one** method:

| Interface | Method | Used by |
|---|---|---|
| `fmt.Stringer` | `String() string` | How a value prints |
| `io.Reader` | `Read([]byte) (int, error)` | Files, network, HTTP bodies |
| `io.Writer` | `Write([]byte) (int, error)` | Files, network, responses |
| `error` | `Error() string` | Every error value |

```try-go
package main

import "fmt"

type Money float64

func (m Money) String() string { return fmt.Sprintf("KSh %.2f", float64(m)) }

func main() {
	var price Money = 1999.5
	fmt.Println("Price:", price)      // uses String() automatically
}
```

## Errors in depth

```try-go
package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("not found")        // a sentinel error to compare against

type ValidationError struct {                    // a custom error type with details
	Field, Problem string
}

func (e ValidationError) Error() string { return e.Field + ": " + e.Problem }

func findPhone(name string) (string, error) {
	book := map[string]string{"Amina": "0712345678"}
	p, ok := book[name]
	if !ok {
		return "", fmt.Errorf("finding %q: %w", name, ErrNotFound)   // %w wraps the error
	}
	return p, nil
}

func validate(phone string) error {
	if len(phone) != 10 {
		return ValidationError{"phone", "must be 10 digits"}
	}
	return nil
}

func main() {
	if _, err := findPhone("Zawadi"); errors.Is(err, ErrNotFound) {
		fmt.Println("Error:", err)
	}

	err := validate("12345")
	var ve ValidationError
	if errors.As(err, &ve) {
		fmt.Println("Invalid field:", ve.Field, "-", ve.Problem)
	}
}
```

| Tool | Use |
|---|---|
| `errors.New("...")` | A simple error |
| `fmt.Errorf("context: %w", err)` | Add context while keeping the original |
| `errors.Is(err, ErrX)` | Is it (or does it wrap) a specific error? |
| `errors.As(err, &target)` | Is it a specific error **type**? Get its details |

## panic and recover

`panic` is for truly unexpected situations (a bug), not normal errors. Normal code returns errors; you'll rarely use panic yourself.

```quiz
Q: Which receiver type lets a method change the struct: value or pointer?
A: pointer | pointer receiver
Q: Does Go need an implements keyword for interfaces? (yes or no)
A: no
Q: Is a struct field named balance (lowercase) visible outside its package? (yes or no)
A: no
Q: Which method must a type have to satisfy the error interface?
A: Error | Error()
Q: Which function checks whether an error wraps a specific error value?
A: errors.Is | Is
```
