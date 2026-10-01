---
slug: kotlin-coroutines
title: Coroutines and Flow (doing slow work without freezing the app)
after: kotlin-classes-null-safety
---
# Coroutines and Flow (doing slow work without freezing the app)

Network calls, database queries and file reads are **slow**. If an app does them on the main (UI) thread, the screen freezes, and after about 5 seconds Android shows "App isn't responding". **Coroutines** let you write slow work in simple, top-to-bottom code that doesn't block the screen.

> Coroutines come from the `kotlinx.coroutines` library, which Android projects include by default. The online runner on this page doesn't include it, so these examples are for reading and for running in Android Studio.

## suspend functions

A `suspend` function can **pause** while waiting (for the network, a timer, the database) without blocking the thread, then continue where it left off:

```kotlin
import kotlinx.coroutines.*

suspend fun fetchBalance(phone: String): Int {
    delay(1000)              // pretend network call: pauses this coroutine, not the whole app
    return 2450
}

fun main() = runBlocking {   // runBlocking: only for small programs and tests
    println("Checking balance…")
    val balance = fetchBalance("0712345678")
    println("Balance: KSh $balance")
}
```

## launch and async

```kotlin
import kotlinx.coroutines.*

suspend fun loadProducts(): List<String> { delay(800); return listOf("Unga", "Sugar") }
suspend fun loadOrders(): Int { delay(1200); return 14 }

fun main() = runBlocking {
    // launch: start work, don't need a result back
    val job = launch {
        repeat(3) { i ->
            println("Syncing batch ${i + 1}")
            delay(300)
        }
    }

    // async: start work that returns a result; both run at the same time
    val products = async { loadProducts() }
    val orders = async { loadOrders() }
    println("Products: ${products.await()}, orders today: ${orders.await()}")   // ~1.2 s total, not 2 s

    job.join()
}
```

| Builder | Use |
|---|---|
| `launch { }` | Fire-and-forget work (save, sync, log) |
| `async { } ... await()` | Work that returns a value; run several in parallel |
| `withContext(Dispatchers.IO) { }` | Switch to a background thread for blocking I/O |

## Dispatchers: which thread runs the work

| Dispatcher | For |
|---|---|
| `Dispatchers.Main` | Updating the UI (Android) |
| `Dispatchers.IO` | Network, database, files |
| `Dispatchers.Default` | Heavy calculations (sorting big lists, parsing) |

Libraries like **Retrofit** and **Room** already switch threads for you when you use their `suspend` functions.

## Structured concurrency and viewModelScope

In Android, you don't create coroutines anywhere: you launch them in a **scope** tied to a lifecycle, so they're **cancelled automatically** when no longer needed:

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class OrdersViewModel(private val repo: OrdersRepository) : ViewModel() {
    fun refresh() {
        viewModelScope.launch {          // cancelled when the screen's ViewModel is cleared
            try {
                val orders = repo.fetchOrders()
                // update UI state with orders
            } catch (e: Exception) {
                // show an error message
            }
        }
    }
}

interface OrdersRepository { suspend fun fetchOrders(): List<String> }
```

## Flow: streams of values over time

A `suspend` function returns **one** value. A **Flow** emits **many** values over time: live database results, a countdown, download progress.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun countdown(from: Int): Flow<Int> = flow {
    for (i in from downTo 0) {
        emit(i)
        delay(1000)
    }
}

fun main() = runBlocking {
    countdown(3)
        .map { if (it == 0) "Offer ended" else "Offer ends in $it s" }
        .collect { println(it) }
}
```

In Android, **StateFlow** holds the current screen state; the UI collects it and redraws when it changes (next lessons). **Room** returns `Flow<List<Product>>`, so lists update automatically when the database changes.

## Cancellation and timeouts

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val result = withTimeoutOrNull(2000) {      // give up after 2 seconds
        delay(5000)
        "Done"
    }
    println(result ?: "Timed out: please check your connection")
}
```

```quiz
Q: Which keyword marks a function that can pause without blocking a thread?
A: suspend
Q: Which builder starts work that returns a value you can await?
A: async
Q: Which dispatcher is for network and database work?
A: Dispatchers.IO | IO
Q: Which scope cancels coroutines automatically when a ViewModel is cleared?
A: viewModelScope
Q: What emits many values over time: suspend function or Flow?
A: Flow
Q: About how long can the main thread be blocked before Android shows "App isn't responding"? Give seconds.
A: 5 | five | 5 seconds
```
