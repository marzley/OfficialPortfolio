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

## Why coroutines matter in Android

Android apps must never block the main (UI) thread: if the screen freezes for about 5 seconds, Android shows an "App Not Responding" dialog, and users uninstall slow apps quickly. Network calls (loading products, checking M-Pesa payment status), database queries and file operations must run in the background. Kotlin coroutines make this background work look like simple, sequential code, and they're the standard approach in modern Android with Jetpack libraries.

## A typical screen: loading data with a ViewModel

```kotlin
data class ProductsUiState(
    val isLoading: Boolean = false,
    val products: List<Product> = emptyList(),
    val error: String? = null,
)

class ProductsViewModel(private val repo: ProductRepository) : ViewModel() {
    private val _state = MutableStateFlow(ProductsUiState())
    val state: StateFlow<ProductsUiState> = _state.asStateFlow()

    init { load() }

    fun load() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true, error = null) }
            try {
                val items = repo.getProducts()            // suspend function, runs off the main thread
                _state.update { it.copy(isLoading = false, products = items) }
            } catch (e: IOException) {
                _state.update { it.copy(isLoading = false, error = "No internet connection") }
            }
        }
    }
}
```

In Compose, the screen collects the state: `val state by viewModel.state.collectAsStateWithLifecycle()`. When the user leaves the screen, `viewModelScope` cancels the work automatically, so no wasted data or memory leaks.

## Repository with withContext

```kotlin
class ProductRepository(private val api: ShopApi, private val dao: ProductDao) {
    suspend fun getProducts(): List<Product> = withContext(Dispatchers.IO) {
        try {
            val fresh = api.fetchProducts()          // network
            dao.replaceAll(fresh)                    // cache in the local database
            fresh
        } catch (e: IOException) {
            dao.getAll()                             // offline: fall back to cached data
        }
    }
}
```

`withContext(Dispatchers.IO)` switches to a background thread pool for I/O work and returns the result to the caller. The **offline-first** pattern (show cached data when the network fails) is very valuable for users with unstable connections or limited data bundles.

## Running requests in parallel

```kotlin
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val balance = async { api.getBalance() }
    val transactions = async { api.getRecentTransactions() }
    val offers = async { api.getOffers() }
    Dashboard(balance.await(), transactions.await(), offers.await())   // total time ≈ slowest call
}
```

`coroutineScope` ensures that if one request fails, the others are cancelled and the error is passed up: this is **structured concurrency**.

## Polling a payment status with timeout

```kotlin
suspend fun waitForPayment(checkoutId: String): PaymentStatus =
    withTimeoutOrNull(60_000) {                       // give up after 60 seconds
        while (true) {
            val status = api.paymentStatus(checkoutId)
            if (status != PaymentStatus.PENDING) return@withTimeoutOrNull status
            delay(3_000)                               // wait 3 s between checks without blocking
        }
        @Suppress("UNREACHABLE_CODE") PaymentStatus.PENDING
    } ?: PaymentStatus.TIMED_OUT
```

After starting an M-Pesa payment, apps often show "Check your phone to enter your PIN" and poll their **own server** (which receives the provider's callback) until the payment is confirmed or times out. Keep payment secrets on the server, never in the app.

## Flow for live updates

```kotlin
fun searchResults(queries: Flow<String>): Flow<List<Product>> =
    queries
        .debounce(300)                       // wait until typing pauses
        .map { it.trim() }
        .distinctUntilChanged()              // skip repeated queries
        .filter { it.length >= 2 }
        .mapLatest { q -> repo.search(q) }   // cancel the previous search when a new query arrives
        .catch { emit(emptyList()) }
```

This search pipeline avoids sending a request for every keystroke, saving data and server load.

## Exception handling in coroutines

| Situation | Approach |
|---|---|
| A single call may fail | `try/catch` around the suspend call |
| Expected failures (no internet) | Return a `Result` or sealed class instead of throwing |
| Unexpected crashes in a scope | `CoroutineExceptionHandler` for logging |
| One child failure shouldn't cancel siblings | `supervisorScope` |

```kotlin
sealed interface LoadResult<out T> {
    data class Success<T>(val data: T) : LoadResult<T>
    data class Failure(val message: String) : LoadResult<Nothing>
}
```

Never catch `CancellationException` and ignore it; that breaks cancellation. Rethrow it if you catch general exceptions.

## Testing coroutines

```kotlin
@Test
fun loadsProducts() = runTest {
    val repo = FakeProductRepository(listOf(Product("Unga", 180)))
    val vm = ProductsViewModel(repo)
    advanceUntilIdle()                               // run pending coroutines
    assertEquals(1, vm.state.value.products.size)
}
```

`runTest` (from kotlinx-coroutines-test) skips real delays, so tests involving `delay(3000)` run instantly.

## Common mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Network call on the main thread | Freezes or crashes (NetworkOnMainThreadException) | `withContext(Dispatchers.IO)` or a suspend library (Retrofit, Ktor) |
| `GlobalScope.launch` | Work outlives the screen; leaks | `viewModelScope` / `lifecycleScope` |
| `Thread.sleep` in coroutines | Blocks the thread | `delay()` |
| Swallowing `CancellationException` | Coroutines can't be cancelled | Rethrow it |
| Updating UI from a background thread | Crashes | Update state flows; collect them on the main thread |

## Practice

1. Write a ViewModel that loads a list from a fake repository with a 1-second `delay` and exposes loading/error states.
2. Load three fake API results in parallel with `async` and measure the time.
3. Implement payment status polling with `withTimeoutOrNull` against a fake API.
4. Build a search `Flow` with `debounce` and `distinctUntilChanged`.
5. Write a `runTest` unit test for your ViewModel.

:::think A developer starts a network request with `GlobalScope.launch` in an Activity. Users rotate the phone several times and the app becomes slow and uses lots of data. Why?
Each rotation recreates the Activity and starts a new request, but GlobalScope coroutines aren't tied to any lifecycle, so old requests keep running and may update screens that no longer exist. Using `viewModelScope` (which survives rotation and cancels when the screen is truly closed) or `lifecycleScope` fixes the leak and duplicate work.
:::

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
Q: Which scope automatically cancels coroutines when a ViewModel is cleared?
A: viewModelScope
Q: Which dispatcher is used for network and disk work?
A: Dispatchers.IO | IO
Q: Which function returns null instead of throwing when a timeout passes?
A: withTimeoutOrNull
Q: Which test function from kotlinx-coroutines-test skips real delays?
A: runTest
```
