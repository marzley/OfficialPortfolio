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

## Why methods and interfaces matter in Go

Go doesn't have classes or inheritance. Instead, it combines **structs** (data), **methods** (behaviour) and **interfaces** (contracts). This design keeps code simple and flexible: a payment processor, a storage layer or a notifier can be swapped for a test version just by satisfying the same interface. Every Go web framework, database driver and cloud SDK is built on these ideas.

## Constructors and validation

Go uses ordinary functions (often named `NewX`) as constructors:

```try-go
package main

import (
	"errors"
	"fmt"
	"strings"
)

type Account struct {
	owner   string
	phone   string
	balance float64
}

func NewAccount(owner, phone string) (*Account, error) {
	owner = strings.TrimSpace(owner)
	if owner == "" {
		return nil, errors.New("owner is required")
	}
	if len(phone) != 10 || !strings.HasPrefix(phone, "07") && !strings.HasPrefix(phone, "01") {
		return nil, fmt.Errorf("invalid phone %q", phone)
	}
	return &Account{owner: owner, phone: phone}, nil
}

func (a *Account) Deposit(amount float64) error {
	if amount <= 0 {
		return errors.New("deposit must be positive")
	}
	a.balance += amount
	return nil
}

func (a *Account) Withdraw(amount float64) error {
	if amount > a.balance {
		return fmt.Errorf("insufficient funds: balance %.2f, requested %.2f", a.balance, amount)
	}
	a.balance -= amount
	return nil
}

func (a Account) Balance() float64 { return a.balance }

func main() {
	acc, err := NewAccount("Juma Ali", "0712345678")
	if err != nil {
		fmt.Println(err)
		return
	}
	_ = acc.Deposit(2000)
	if err := acc.Withdraw(5000); err != nil {
		fmt.Println("Error:", err)
	}
	_ = acc.Withdraw(500)
	fmt.Printf("%s balance: %.2f\n", acc.owner, acc.Balance())

	if _, err := NewAccount("", "0712345678"); err != nil {
		fmt.Println("Error:", err)
	}
}
```

Lowercase fields (`balance`) can't be changed from other packages, so all changes go through validated methods.

## Embedding: composition instead of inheritance

```try-go
package main

import "fmt"

type Timestamps struct {
	CreatedAt string
	UpdatedAt string
}

func (t *Timestamps) Touch(now string) { t.UpdatedAt = now }

type Order struct {
	ID    int
	Total float64
	Timestamps // embedded: Order gets the fields and the Touch method
}

func main() {
	o := Order{ID: 1024, Total: 3500, Timestamps: Timestamps{CreatedAt: "2026-09-01"}}
	o.Touch("2026-09-03")
	fmt.Println(o.ID, o.CreatedAt, o.UpdatedAt)
}
```

Embedding promotes the inner struct's fields and methods, giving reuse without class hierarchies.

## Interfaces for swappable parts

```try-go
package main

import (
	"fmt"
	"sort"
)

type Notifier interface {
	Notify(to, message string) error
}

type SMS struct{}

func (SMS) Notify(to, message string) error {
	fmt.Printf("SMS to %s: %s\n", to, message)
	return nil
}

type Email struct{ From string }

func (e Email) Notify(to, message string) error {
	fmt.Printf("Email from %s to %s: %s\n", e.From, to, message)
	return nil
}

// FakeNotifier records messages: perfect for tests
type FakeNotifier struct{ Sent []string }

func (f *FakeNotifier) Notify(to, message string) error {
	f.Sent = append(f.Sent, to+": "+message)
	return nil
}

func confirmOrder(n Notifier, customer string, orderID int) error {
	return n.Notify(customer, fmt.Sprintf("Order #%d confirmed", orderID))
}

func main() {
	_ = confirmOrder(SMS{}, "0712345678", 1024)
	_ = confirmOrder(Email{From: "shop@example.co.ke"}, "amina@example.co.ke", 1025)

	fake := &FakeNotifier{}
	_ = confirmOrder(fake, "test", 1)
	sort.Strings(fake.Sent)
	fmt.Println("Fake recorded:", fake.Sent)
}
```

`confirmOrder` depends only on the `Notifier` interface, so production code uses SMS or email, and tests use the fake. Go interfaces are satisfied implicitly: no `implements` keyword.

## Small interfaces from the standard library

| Interface | Method | Implemented by |
|---|---|---|
| `fmt.Stringer` | `String() string` | Any type you want to print nicely |
| `error` | `Error() string` | All error types |
| `io.Reader` | `Read(p []byte) (n int, err error)` | Files, network connections, HTTP bodies, strings |
| `io.Writer` | `Write(p []byte) (n int, err error)` | Files, buffers, HTTP responses, stdout |
| `sort.Interface` | `Len`, `Less`, `Swap` | Custom sortable collections |

Because so many types implement `io.Reader` and `io.Writer`, one function can read from a file, a web request or a string without changes.

```try-go
package main

import (
	"fmt"
	"io"
	"os"
	"strings"
)

func countLines(r io.Reader) int {
	data, _ := io.ReadAll(r)
	return strings.Count(string(data), "\n")
}

func main() {
	fmt.Println(countLines(strings.NewReader("one\ntwo\nthree\n")))
	fmt.Fprintln(os.Stdout, "Writing through the io.Writer interface")
}
```

## Type switches

```try-go
package main

import "fmt"

func describe(v any) string {
	switch x := v.(type) {
	case int:
		return fmt.Sprintf("int %d", x)
	case float64:
		return fmt.Sprintf("float %.2f", x)
	case string:
		return fmt.Sprintf("string %q (%d chars)", x, len(x))
	case []int:
		return fmt.Sprintf("slice of %d ints", len(x))
	case nil:
		return "nil"
	default:
		return fmt.Sprintf("other %T", x)
	}
}

func main() {
	for _, v := range []any{42, 3.5, "Kenya", []int{1, 2}, nil, true} {
		fmt.Println(describe(v))
	}
}
```

## Custom error types

```try-go
package main

import (
	"errors"
	"fmt"
)

type ValidationError struct {
	Field, Msg string
}

func (e *ValidationError) Error() string { return e.Field + ": " + e.Msg }

func validateAmount(a float64) error {
	if a <= 0 {
		return &ValidationError{Field: "amount", Msg: "must be above 0"}
	}
	return nil
}

func main() {
	err := fmt.Errorf("checkout failed: %w", validateAmount(-5))
	var ve *ValidationError
	if errors.As(err, &ve) {
		fmt.Println("Show under field", ve.Field, "->", ve.Msg)
	}
	fmt.Println(err)
}
```

`errors.As` finds a specific error type inside a wrapped error chain, so an API can return a precise message for the field that failed.

## Practice

1. Create a `Product` struct with a constructor that rejects negative prices.
2. Give `Product` a `String()` method and print a slice of products.
3. Define a `Storage` interface with `Save` and `Load`, then a memory implementation and a fake for tests.
4. Embed an `Address` struct in `Customer` and use its fields directly.
5. Write a custom `NotFoundError` and detect it with `errors.As`.

:::think Why do Go developers say "accept interfaces, return structs"?
Functions that accept small interfaces (like `io.Reader` or `Notifier`) work with any type that has the needed methods, making them flexible and easy to test with fakes. Returning concrete structs gives callers full access to the type's features without forcing a particular interface on them. The result is loosely coupled, testable code.
:::

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
Q: What is putting one struct inside another to reuse its fields and methods called?
A: embedding
Q: Which function finds a specific error type in a wrapped error chain?
A: errors.As | As
Q: Which interface has a single String() method?
A: Stringer | fmt.Stringer
Q: Which standard interface do files, HTTP bodies and strings.Reader all implement for reading?
A: io.Reader | Reader
```
