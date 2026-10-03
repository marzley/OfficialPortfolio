---
slug: structs-web
title: "Structs and a web server in Go: structs, methods, JSON, net/http handlers, routing, a REST API, databases and deployment"
after: KEEP
---
# Structs and a web server in Go: structs, methods, JSON, net/http handlers, routing, a REST API, databases and deployment

Go shines at building **web services**: its standard library includes a production-quality HTTP server, JSON support and concurrency, so you can build fast APIs without heavy frameworks. This unit introduces **structs** (Go's way of grouping data) and **methods**, then builds a small JSON REST API step by step with `net/http`: routing, handling requests, validating input, returning proper status codes, and safely sharing data between concurrent requests. It finishes with databases, configuration, testing and deployment.

:::note What you will learn
- Structs, fields and struct literals
- Methods with value and pointer receivers
- Slices and maps of structs
- JSON encoding and decoding with struct tags
- The net/http package: handlers, ServeMux routing (with methods and path parameters)
- Building a REST API: list, get, create
- Validation and HTTP status codes
- Protecting shared data with sync.Mutex
- Middleware for logging
- Databases with database/sql
- Configuration, testing handlers, and deploying a single binary
:::

## Structs

```try-go
package main

import "fmt"

type Student struct {
	AdmissionNo string
	Name        string
	Form        int
	Balance     float64
}

func main() {
	s1 := Student{AdmissionNo: "ADM001", Name: "Brian", Form: 3, Balance: 12500}
	s2 := Student{"ADM002", "Faith", 4, 0}     // positional (less clear; avoid for big structs)
	var s3 Student                              // zero value: empty strings, 0
	s3.Name = "Juma"

	s1.Balance -= 5000
	fmt.Println(s1.Name, s1.Balance)
	fmt.Printf("%+v\n", s2)
	fmt.Printf("%+v\n", s3)
}
```

Fields starting with a **capital letter** are **exported** (visible outside the package and to the JSON encoder); lowercase fields are private to the package.

## Methods

A **method** is a function with a **receiver**:

```try-go
package main

import (
	"errors"
	"fmt"
)

type Account struct {
	Owner   string
	balance float64
}

func (a Account) Balance() float64 {           // value receiver: works on a copy (reading)
	return a.balance
}

func (a *Account) Deposit(amount float64) error {   // pointer receiver: can modify the original
	if amount <= 0 {
		return errors.New("deposit must be positive")
	}
	a.balance += amount
	return nil
}

func (a *Account) Withdraw(amount float64) error {
	if amount <= 0 || amount > a.balance {
		return fmt.Errorf("cannot withdraw %.2f (balance %.2f)", amount, a.balance)
	}
	a.balance -= amount
	return nil
}

func main() {
	acc := &Account{Owner: "Wanjiku"}
	acc.Deposit(3500)
	if err := acc.Withdraw(5000); err != nil {
		fmt.Println("Error:", err)
	}
	acc.Withdraw(1500)
	fmt.Printf("%s: KSh %.2f\n", acc.Owner, acc.Balance())
}
```

Use **pointer receivers** when a method changes the struct (or the struct is large); be consistent within a type.

## Slices and maps of structs

```try-go
package main

import (
	"fmt"
	"sort"
)

type Product struct {
	Name  string
	Price float64
	Stock int
}

func main() {
	products := []Product{
		{"Laptop bag", 2500, 12},
		{"USB flash", 900, 3},
		{"Mouse", 1200, 25},
	}
	products = append(products, Product{"Charger", 800, 2})

	sort.Slice(products, func(i, j int) bool { return products[i].Price < products[j].Price })
	for _, p := range products {
		flag := ""
		if p.Stock < 5 {
			flag = " <- reorder"
		}
		fmt.Printf("%-10s KSh %6.0f stock %2d%s\n", p.Name, p.Price, p.Stock, flag)
	}

	byName := map[string]Product{}
	for _, p := range products {
		byName[p.Name] = p
	}
	if p, ok := byName["Mouse"]; ok {
		fmt.Println("Found:", p.Name, p.Price)
	}
}
```

## JSON with struct tags

```try-go
package main

import (
	"encoding/json"
	"fmt"
)

type Payment struct {
	Receipt string  `json:"receipt"`
	Phone   string  `json:"phone"`
	Amount  float64 `json:"amount"`
	Note    string  `json:"note,omitempty"`   // left out when empty
}

func main() {
	p := Payment{Receipt: "QJK7RT61SV", Phone: "254712345678", Amount: 1500}
	data, _ := json.Marshal(p)
	fmt.Println(string(data))

	var incoming Payment
	body := `{"receipt":"QJK8PL22AB","phone":"254722000111","amount":2500,"note":"Term 3 fees"}`
	if err := json.Unmarshal([]byte(body), &incoming); err != nil {
		fmt.Println("bad JSON:", err)
		return
	}
	fmt.Printf("%+v\n", incoming)
}
```

Struct tags control JSON field names; only exported fields are encoded.

## A web server with net/http

The Go standard library can serve HTTP directly (run this on your computer, then visit http://localhost:8080):

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Habari! The Go server is running.")
	})
	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

Each request is handled in its own **goroutine** automatically, so the server handles many clients at once.

## A small REST API

Since Go 1.22, `http.ServeMux` supports **HTTP methods** and **path parameters** in patterns:

```go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
)

type Student struct {
	AdmissionNo string  `json:"admissionNo"`
	Name        string  `json:"name"`
	Balance     float64 `json:"balance"`
}

type Store struct {
	mu       sync.Mutex                 // protects the map: requests run concurrently
	students map[string]Student
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func (s *Store) list(w http.ResponseWriter, r *http.Request) {
	s.mu.Lock()
	defer s.mu.Unlock()
	out := make([]Student, 0, len(s.students))
	for _, st := range s.students {
		out = append(out, st)
	}
	writeJSON(w, http.StatusOK, out)
}

func (s *Store) get(w http.ResponseWriter, r *http.Request) {
	adm := r.PathValue("adm")
	s.mu.Lock()
	st, ok := s.students[adm]
	s.mu.Unlock()
	if !ok {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "student not found"})
		return
	}
	writeJSON(w, http.StatusOK, st)
}

func (s *Store) create(w http.ResponseWriter, r *http.Request) {
	var st Student
	if err := json.NewDecoder(r.Body).Decode(&st); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
		return
	}
	if st.AdmissionNo == "" || st.Name == "" || st.Balance < 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "admissionNo and name are required; balance can't be negative"})
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, exists := s.students[st.AdmissionNo]; exists {
		writeJSON(w, http.StatusConflict, map[string]string{"error": "student already exists"})
		return
	}
	s.students[st.AdmissionNo] = st
	writeJSON(w, http.StatusCreated, st)
}

func logging(next http.Handler) http.Handler {      // middleware
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func main() {
	store := &Store{students: map[string]Student{
		"ADM001": {"ADM001", "Brian", 12500},
	}}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /students", store.list)
	mux.HandleFunc("GET /students/{adm}", store.get)
	mux.HandleFunc("POST /students", store.create)

	log.Println("API on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", logging(mux)))
}
```

Test it:

```bash
curl http://localhost:8080/students
curl http://localhost:8080/students/ADM001
curl -X POST -H "Content-Type: application/json" \
     -d '{"admissionNo":"ADM002","name":"Faith","balance":0}' http://localhost:8080/students
```

Key ideas:
- **Handlers** receive a `ResponseWriter` (to write the response) and a `*Request` (method, URL, headers, body).
- Return correct **status codes**: 200, 201 Created, 400 Bad Request, 404 Not Found, 409 Conflict, 500.
- **sync.Mutex** prevents data races when concurrent requests modify shared data (run `go run -race .` to detect races).
- **Middleware** wraps handlers to add logging, authentication, CORS or rate limiting.

Popular routers/frameworks (chi, Gin, Echo, Fiber) add conveniences, but the standard library is enough for many APIs.

## Databases

Use `database/sql` with a driver (PostgreSQL: pgx; MySQL: go-sql-driver/mysql; SQLite: modernc.org/sqlite):

```go
db, err := sql.Open("pgx", os.Getenv("DATABASE_URL"))
if err != nil { log.Fatal(err) }
defer db.Close()

var name string
var balance float64
err = db.QueryRowContext(ctx,
    "SELECT name, balance FROM students WHERE admission_no = $1", adm).Scan(&name, &balance)
if errors.Is(err, sql.ErrNoRows) {
    // not found
}
```

Always use **placeholders** (`$1` or `?`) to prevent SQL injection. Tools like sqlc generate type-safe Go code from SQL queries.

## Configuration and secrets

Read settings from environment variables (`os.Getenv("PORT")`, `DATABASE_URL`, API keys), never hard-code secrets, and provide sensible defaults for local development.

## Testing handlers

Go's `net/http/httptest` package tests handlers without starting a real server:

```go
func TestGetNotFound(t *testing.T) {
	store := &Store{students: map[string]Student{}}
	req := httptest.NewRequest("GET", "/students/NOPE", nil)
	req.SetPathValue("adm", "NOPE")
	rec := httptest.NewRecorder()
	store.get(rec, req)
	if rec.Code != http.StatusNotFound {
		t.Fatalf("want 404, got %d", rec.Code)
	}
}
```

Run with `go test ./...`.

## Deployment

1. Build a binary: `GOOS=linux GOARCH=amd64 go build -o schoolapi`.
2. Copy it to a Linux server and run it as a **systemd** service behind **Nginx** with HTTPS (see the hosting deployment lesson), or
3. Package it in a tiny **Docker** image (multi-stage build, often under 20 MB), or deploy to platforms like Google Cloud Run or Fly.io.

## Next steps

- Concurrency: goroutines, channels, context and worker pools (next lesson).
- Interfaces and generics for clean, reusable code.
- Build a portfolio API: an M-Pesa callback receiver (sandbox) that stores payments in PostgreSQL, a URL shortener, or an SMS reminder worker.
- Practise with the official Go Tour (go.dev/tour) and "Go by Example".

:::think Two customers pay at the same moment and your Go API updates a shared map of balances in both handlers. Sometimes the server crashes with "concurrent map writes". Why, and how do you fix it?
Each request runs in its own goroutine, and Go maps aren't safe for concurrent writes. Protect the map with a sync.Mutex (Lock/Unlock around reads and writes), use sync.Map for specific cases, or better, store balances in a database and use transactions. Run with `-race` during testing to catch such bugs.
:::

## Summary

- Structs group fields; capitalised fields are exported; struct literals create values.
- Methods use value receivers (read) or pointer receivers (modify); slices and maps hold collections of structs.
- encoding/json converts structs to and from JSON using struct tags.
- net/http serves HTTP with handlers; Go 1.22+ ServeMux supports methods and path parameters; return proper status codes and validate input.
- Protect shared data with sync.Mutex, add middleware, use database/sql with placeholders, test with httptest, and deploy a single binary or container.

```quiz
Q: In Go, which fields are exported (visible outside the package)?
A: capitalised | capitalized | fields starting with a capital letter | uppercase
Q: Which receiver type lets a method modify the original struct?
A: pointer | pointer receiver
Q: Which package encodes and decodes JSON?
A: encoding/json | json
Q: Which standard library package provides an HTTP server?
A: net/http
Q: Which type protects shared data from concurrent access?
A: sync.Mutex | mutex
Q: Which HTTP status code means a resource was created?
A: 201
```
