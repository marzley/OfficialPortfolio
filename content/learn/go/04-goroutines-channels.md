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
```
