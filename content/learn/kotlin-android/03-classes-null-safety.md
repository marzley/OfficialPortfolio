---
slug: kotlin-classes-null-safety
title: Kotlin classes, data classes, sealed classes and null safety
after: kotlin-functions-collections
---
# Kotlin classes, data classes, sealed classes and null safety

Apps model real things (products, users, orders) as **classes**, and they handle missing data all the time. Kotlin's class features and **null safety** make both clean and crash-resistant.

## Classes

```try-kotlin
class BankAccount(val owner: String, private var balance: Int = 0) {
    fun deposit(amount: Int) {
        require(amount > 0) { "Deposit must be positive" }
        balance += amount
    }

    fun withdraw(amount: Int): Boolean {
        if (amount > balance) return false
        balance -= amount
        return true
    }

    fun balance() = balance
}

fun main() {
    val acc = BankAccount("Wanjiru")
    acc.deposit(5000)
    println("Withdraw 2000: ${acc.withdraw(2000)}")
    println("Withdraw 9000: ${acc.withdraw(9000)}")
    println("${acc.owner} has KSh ${acc.balance()}")
}
```

`private` keeps `balance` hidden, so it can only change through `deposit` and `withdraw`. That's **encapsulation**.

## Data classes: perfect for app data

```try-kotlin
data class Order(val id: Int, val customer: String, val total: Int, val paid: Boolean = false)

fun main() {
    val o1 = Order(1042, "Kamau", 1240)
    val o2 = Order(1042, "Kamau", 1240)
    println(o1)                     // readable toString for free
    println(o1 == o2)               // compares contents: true
    val paid = o1.copy(paid = true) // a changed copy (the original stays the same)
    println(paid)
    val (id, customer) = paid       // destructuring
    println("Order $id for $customer")
}
```

Data classes give you `toString`, `equals`, `copy` and destructuring automatically. Android UI state is usually a data class that you `copy` when something changes.

## Enums and sealed classes

```try-kotlin
enum class PaymentMethod { CASH, MPESA, CARD }

// A sealed class: a fixed set of possible results, each carrying different data
sealed class PaymentResult {
    data class Success(val receipt: String) : PaymentResult()
    data class Failed(val reason: String) : PaymentResult()
    object Cancelled : PaymentResult()
}

fun message(r: PaymentResult): String = when (r) {      // the compiler checks every case is handled
    is PaymentResult.Success -> "Paid. Receipt ${r.receipt}"
    is PaymentResult.Failed -> "Payment failed: ${r.reason}"
    PaymentResult.Cancelled -> "You cancelled the payment"
}

fun main() {
    println(PaymentMethod.MPESA)
    listOf(PaymentResult.Success("SGH4XXXXXX"), PaymentResult.Failed("Insufficient funds"), PaymentResult.Cancelled)
        .forEach { println(message(it)) }
}
```

**Sealed classes** are how Android apps model screen states (`Loading`, `Success(data)`, `Error(message)`), and `when` makes sure you handle every one.

## Interfaces and inheritance

```try-kotlin
interface Payable {
    fun amountDue(): Int
}

open class Customer(val name: String)                    // open: can be inherited

class CreditCustomer(name: String, private val owed: Int) : Customer(name), Payable {
    override fun amountDue() = owed
}

fun main() {
    val c = CreditCustomer("Fatuma", 2300)
    println("${c.name} owes KSh ${c.amountDue()}")
}
```

## Null safety: no more "null pointer" crashes

A normal type **can't be null**. Add `?` to allow null, and Kotlin forces you to handle it:

```try-kotlin
fun findPhone(name: String): String? =                   // may return null
    mapOf("Kamau" to "0712345678", "Amina" to "0722000111")[name]

fun main() {
    val phone: String? = findPhone("Otieno")

    println(phone?.length)                               // safe call: null if phone is null
    println(phone ?: "No phone saved")                   // elvis: default value
    val len = phone?.length ?: 0
    println("Length: $len")

    findPhone("Amina")?.let { println("Calling $it") }  // run only if not null

    val input = "12x"
    val qty = input.toIntOrNull() ?: 1                   // safe conversion
    println("Quantity: $qty")
}
```

| Operator | Meaning |
|---|---|
| `String?` | May be null |
| `a?.b` | Call only if `a` isn't null; otherwise the result is null |
| `a ?: b` | Use `b` if `a` is null |
| `a?.let { }` | Run the block only when `a` isn't null |
| `a!!` | "I promise it's not null": crashes if it is. Avoid. |

## Objects and companion objects

```try-kotlin
object AppConfig {                       // a single shared instance
    const val APP_NAME = "Duka Connect"
    var darkMode = false
}

class Receipt private constructor(val number: String) {
    companion object {                   // like "static" in other languages
        private var counter = 1000
        fun next() = Receipt("R" + counter++)
    }
}

fun main() {
    println(AppConfig.APP_NAME)
    println(Receipt.next().number)
    println(Receipt.next().number)
}
```

## Handling errors

```try-kotlin
fun parseAmount(text: String): Result<Int> = runCatching {
    val n = text.trim().toInt()
    require(n > 0) { "Amount must be more than zero" }
    n
}

fun main() {
    for (t in listOf("500", "abc", "-20")) {
        parseAmount(t)
            .onSuccess { println("OK: $it") }
            .onFailure { println("Error for '$t': ${it.message}") }
    }
}
```

```quiz
Q: Which kind of class automatically gets toString, equals and copy?
A: data class | data
Q: Which kind of class represents a fixed set of possible states?
A: sealed class | sealed
Q: How do you mark a type that can be null? Write it for String.
A: String?
Q: What does the safe call operator look like?
A: ?.
Q: Which operator crashes if the value is null and should be avoided?
A: !!
Q: Which keyword lets a class be inherited from?
A: open
```
