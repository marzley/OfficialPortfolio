---
slug: goroutines-channels
title: Concurrency: goroutines, channels and sync
after: methods-interfaces
---
# Concurrency: goroutines, channels and sync

Go's superpower is **concurrency**: doing many things at once, cheaply. A payment server may handle thousands of M-Pesa callbacks, SMS sends and database calls simultaneously. Go makes this simple and safe with **goroutines** and **channels**.

## Goroutines: lightweight threads

Put `go` in front of a function call and it runs **concurrently**. Goroutines are tiny (a few KB), so a program can run hundreds of thousands.

```try-go
package main

import (
	"fmt"
	"sync"
	"time"
)

func sendSMS(to string, wg *sync.WaitGroup) {
	defer wg.Done()                       // tell the WaitGroup we're finished (runs at the end)
	time.Sleep(100 * time.Millisecond)    // pretend to call an SMS API
	fmt.Println("Sent to", to)
}

func main() {
	start := time.Now()
	phones := []string{"0712000001", "0712000002", "0712000003", "0712000004"}

	var wg sync.WaitGroup
	for _, p := range phones {
		wg.Add(1)
		go sendSMS(p, &wg)                // all four start at once
	}
	wg.Wait()                             // wait for all of them
	fmt.Printf("All sent in about %d ms (not 400)\n", time.Since(start).Milliseconds()/100*100)
}
```

The order of "Sent to" lines changes between runs: they really run at the same time.

## Channels: goroutines talking safely

A **channel** passes values between goroutines. Sending (`ch <- v`) and receiving (`v := <-ch`) wait for each other, which synchronises them.

```try-go
package main

import "fmt"

func checkBalance(account string, results chan<- string) {
	balances := map[string]int{"A1": 1200, "A2": 300, "A3": 5400}
	results <- fmt.Sprintf("%s: KSh %d", account, balances[account])
}

func main() {
	accounts := []string{"A1", "A2", "A3"}
	results := make(chan string)

	for _, a := range accounts {
		go checkBalance(a, results)
	}
	for range accounts {                  // receive exactly one result per account
		fmt.Println(<-results)
	}
}
```

## A worker pool (a very common real pattern)

Process many jobs with a fixed number of workers, so you don't overload an API or database:

```try-go
package main

import (
	"fmt"
	"sync"
)

type Job struct {
	ID     int
	Amount int
}

func worker(id int, jobs <-chan Job, results chan<- string, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {                 // keeps taking jobs until the channel is closed
		fee := j.Amount / 100
		results <- fmt.Sprintf("worker %d processed payment %d: fee %d", id, j.ID, fee)
	}
}

func main() {
	jobs := make(chan Job, 10)            // buffered channel: holds up to 10 jobs
	results := make(chan string, 10)
	var wg sync.WaitGroup

	for w := 1; w <= 3; w++ {             // 3 workers
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}
	for i := 1; i <= 6; i++ {
		jobs <- Job{ID: i, Amount: i * 1000}
	}
	close(jobs)                           // no more jobs: workers' loops end

	wg.Wait()
	close(results)
	count := 0
	for r := range results {
		_ = r
		count++
	}
	fmt.Println("Processed", count, "payments with 3 workers")
}
```

## Protecting shared data: sync.Mutex

When goroutines change the **same** variable, use a mutex (or a channel) to avoid **race conditions**:

```try-go
package main

import (
	"fmt"
	"sync"
)

type Counter struct {
	mu    sync.Mutex
	total int
}

func (c *Counter) Add(n int) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.total += n
}

func main() {
	var c Counter
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Add(1)
		}()
	}
	wg.Wait()
	fmt.Println("Total:", c.total)       // always 1000 thanks to the mutex
}
```

Run programs with `go run -race main.go` on your computer to detect race conditions automatically.

## select and timeouts

```try-go
package main

import (
	"fmt"
	"time"
)

func slowAPI(result chan<- string) {
	time.Sleep(2 * time.Second)
	result <- "rates received"
}

func main() {
	result := make(chan string, 1)
	go slowAPI(result)
	select {
	case r := <-result:
		fmt.Println(r)
	case <-time.After(500 * time.Millisecond):
		fmt.Println("Timed out: showing cached rates instead")
	}
}
```

In real servers, the `context` package carries timeouts and cancellation through every request.

## The Go proverb

> "Don't communicate by sharing memory; share memory by communicating." Prefer passing data through channels over many goroutines touching the same variables.

## Why concurrency is Go's superpower

A busy API might handle thousands of requests at once: checking M-Pesa payment statuses, sending SMS notifications, resizing images, calling other services. Go makes this kind of concurrency simple and efficient: goroutines are cheap (you can run many thousands), and channels let them communicate safely. This is a major reason Go is popular for back-end services, networking tools and cloud infrastructure.

## Concurrency vs parallelism

| Concept | Meaning | Example |
|---|---|---|
| Concurrency | Managing many tasks that are in progress at the same time | A server juggling 1,000 open connections |
| Parallelism | Literally running tasks at the same instant on multiple CPU cores | Resizing 8 images on 8 cores at once |

Goroutines give you concurrency; the Go runtime spreads them over available cores for parallelism.

## Collecting results in order

```try-go
package main

import (
	"fmt"
	"sync"
	"time"
)

func checkStatus(receipt string) string {
	time.Sleep(10 * time.Millisecond) // pretend to call an API
	return receipt + ": confirmed"
}

func main() {
	receipts := []string{"QJK1", "QJK2", "QJK3", "QJK4"}
	results := make([]string, len(receipts)) // each goroutine writes its own slot

	var wg sync.WaitGroup
	for i, r := range receipts {
		wg.Add(1)
		go func(i int, r string) {
			defer wg.Done()
			results[i] = checkStatus(r)
		}(i, r)
	}
	wg.Wait()
	for _, line := range results {
		fmt.Println(line)
	}
}
```

All four checks run at the same time (about 10 ms total instead of 40 ms), and writing to separate slice positions avoids data races while keeping results in the original order.

## errgroup-style error handling (pattern)

When several tasks run concurrently and any can fail, collect the first error:

```try-go
package main

import (
	"errors"
	"fmt"
	"sync"
)

func fetch(id int) (int, error) {
	if id == 3 {
		return 0, errors.New("order 3 not found")
	}
	return id * 100, nil
}

func main() {
	ids := []int{1, 2, 3, 4}
	var (
		wg       sync.WaitGroup
		mu       sync.Mutex
		total    int
		firstErr error
	)
	for _, id := range ids {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			v, err := fetch(id)
			mu.Lock()
			defer mu.Unlock()
			if err != nil {
				if firstErr == nil {
					firstErr = err
				}
				return
			}
			total += v
		}(id)
	}
	wg.Wait()
	if firstErr != nil {
		fmt.Println("Error:", firstErr)
	}
	fmt.Println("Total of successful fetches:", total)
}
```

The `golang.org/x/sync/errgroup` package wraps this pattern neatly in real projects.

## Context: cancellation and timeouts

```try-go
package main

import (
	"context"
	"fmt"
	"time"
)

func slowPaymentCheck(ctx context.Context) (string, error) {
	select {
	case <-time.After(200 * time.Millisecond): // the "API" takes 200 ms
		return "paid", nil
	case <-ctx.Done(): // cancelled or timed out first
		return "", ctx.Err()
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()
	status, err := slowPaymentCheck(ctx)
	if err != nil {
		fmt.Println("Gave up:", err)
		return
	}
	fmt.Println("Status:", status)
}
```

Every HTTP request in Go carries a `context`; if the client disconnects or a timeout passes, work is cancelled instead of wasting resources. Pass `ctx` as the first parameter of functions that do I/O.

## Rate limiting with a ticker

```try-go
package main

import (
	"fmt"
	"time"
)

func main() {
	messages := []string{"msg1", "msg2", "msg3", "msg4"}
	limiter := time.NewTicker(20 * time.Millisecond) // at most one send per 20 ms
	defer limiter.Stop()
	start := time.Now()
	for _, m := range messages {
		<-limiter.C // wait for the next tick
		fmt.Println("sent", m)
	}
	fmt.Println("took at least 80ms:", time.Since(start) >= 80*time.Millisecond)
}
```

SMS gateways and payment APIs limit how many requests you can send per second; a ticker or token bucket keeps you within limits.

## Pipelines with channels

```try-go
package main

import "fmt"

func generate(nums ...int) <-chan int {
	out := make(chan int)
	go func() {
		for _, n := range nums {
			out <- n
		}
		close(out)
	}()
	return out
}

func addVAT(in <-chan int) <-chan float64 {
	out := make(chan float64)
	go func() {
		for n := range in {
			out <- float64(n) * 1.16
		}
		close(out)
	}()
	return out
}

func main() {
	for v := range addVAT(generate(100, 250, 1000)) {
		fmt.Printf("%.2f\n", v)
	}
}
```

Each stage runs in its own goroutine and passes values along a channel, like an assembly line. Closing a channel signals "no more values", which ends the `range` loop.

## Finding data races

```bash
go run -race .
go test -race ./...
```

The race detector reports when two goroutines access the same variable at the same time without synchronisation. Run it regularly in tests; races cause rare, hard-to-reproduce bugs.

## Common concurrency mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Forgetting `wg.Wait()` | `main` exits before goroutines finish | Wait for the group |
| Writing a shared map from several goroutines | Crash: concurrent map writes | `sync.Mutex` or `sync.Map`, or one owner goroutine |
| Never closing a channel that's ranged over | Goroutine waits forever (deadlock or leak) | Sender closes when done |
| Goroutines that never exit | Memory leaks | Use `context` cancellation |
| Starting unlimited goroutines for huge workloads | Resource exhaustion | Worker pools with a fixed number of workers |

## Practice

1. Check 5 fake payment statuses concurrently and print results in the original order.
2. Add a 30 ms timeout with `context.WithTimeout` to a slow function.
3. Build a three-stage pipeline: generate numbers, square them, print them.
4. Run a program with a deliberate data race using `go run -race` and fix it with a mutex.
5. Limit a loop of 10 "SMS sends" to one every 50 ms with a ticker.

:::think A Go service starts a new goroutine for every incoming request to call a slow third-party API, with no timeout. During an outage of that API, the service's memory keeps growing until it crashes. Why, and how would you fix it?
Each goroutine waits forever on the stuck API, so goroutines (and their memory) pile up with every request. Use `context` with timeouts so calls are abandoned after a reasonable time, limit concurrency with a worker pool or semaphore, and return errors quickly (possibly with retries/backoff or a circuit breaker) when the dependency is down.
:::

```quiz
Q: Which keyword starts a function as a goroutine?
A: go
Q: What type lets goroutines send values to each other safely?
A: channel | chan | channels
Q: Which sync type waits for a group of goroutines to finish?
A: WaitGroup | sync.WaitGroup
Q: Which sync type protects shared data with Lock and Unlock?
A: Mutex | sync.Mutex
Q: Which statement waits on several channel operations at once?
A: select
Q: Which package provides cancellation and timeouts passed through function calls?
A: context
Q: Which go command flag detects data races?
A: -race
Q: Who should close a channel: the sender or the receiver?
A: sender | the sender
Q: Which time type sends a value on a channel at regular intervals?
A: Ticker | time.Ticker
```
