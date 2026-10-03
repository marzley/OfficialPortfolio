---
slug: kotlin-basics
title: "Kotlin basics: variables, types, strings and decisions"
after: START
---
# Kotlin basics: variables, types, strings and decisions

**Kotlin** is Google's preferred language for Android. It's modern, concise and safe: it prevents whole classes of bugs (like the famous "null pointer" crash) that plagued older Java apps. Kotlin also runs on servers, desktops and even iPhone (Kotlin Multiplatform).

> The Kotlin examples on this page run on a free online compiler when you press **Run** (it takes a few seconds). You can also paste them into **play.kotlinlang.org**.

## Your first program

```try-kotlin
fun main() {
    println("Habari, Kenya!")
    println("Welcome to Android development with Kotlin")
}
```

Every Kotlin program starts at `fun main()`. `println` prints a line. No semicolons needed.

## Variables: val and var

```try-kotlin
fun main() {
    val shopName = "Mama Mboga"     // val: can't be changed (read-only)
    var stock = 24                  // var: can change
    stock = stock - 3
    println("$shopName has $stock items left")

    val price: Int = 180            // you can state the type...
    val vatRate = 0.16              // ...or let Kotlin infer it (Double)
    val total = price * (1 + vatRate)
    println("Price with VAT: KSh $total")
}
```

**Rule:** use `val` by default; use `var` only when the value must change. Read-only values make code easier to reason about.

## Basic types

| Type | Example | Use |
|---|---|---|
| `Int` | `42` | Whole numbers |
| `Long` | `254712345678L` | Big whole numbers (phone numbers as numbers, timestamps) |
| `Double` | `1240.50` | Decimal numbers |
| `Boolean` | `true` | Yes/no |
| `String` | `"Unga"` | Text |
| `Char` | `'K'` | One character |

Convert between them explicitly: `"180".toInt()`, `42.toString()`, `3.99.toInt()` (gives 3), `"12.5".toDoubleOrNull()` (gives `null` if not a number instead of crashing).

## String templates

```try-kotlin
fun main() {
    val name = "Achieng"
    val items = 3
    val amount = 1240
    println("Hello $name, you bought $items items")      // $variable
    println("Total with delivery: KSh ${amount + 150}")   // ${expression}
    println("Name in capitals: ${name.uppercase()}, length ${name.length}")

    val receipt = """
        RECEIPT
        Customer: $name
        Total:    KSh $amount
    """.trimIndent()                                      // multi-line string
    println(receipt)
}
```

## Decisions: if is an expression

In Kotlin, `if` **returns a value**:

```try-kotlin
fun main() {
    val marks = 68
    val grade = if (marks >= 70) "A" else if (marks >= 50) "C" else "E"
    println("Marks $marks -> grade $grade")

    val balance = 300
    val price = 450
    if (balance >= price) {
        println("Payment approved")
    } else {
        println("Insufficient balance: you need KSh ${price - balance} more")
    }
}
```

## when: Kotlin's powerful switch

```try-kotlin
fun deliveryFee(town: String): Int = when (town.lowercase()) {
    "nairobi", "kiambu" -> 200
    "thika", "machakos", "kajiado" -> 350
    "mombasa", "kisumu", "nakuru" -> 600
    else -> 800
}

fun describe(amount: Int): String = when {
    amount <= 0 -> "Invalid amount"
    amount < 1000 -> "Small order"
    amount in 1000..9999 -> "Medium order"
    else -> "Large order"
}

fun main() {
    for (town in listOf("Nairobi", "Thika", "Kisumu", "Garissa")) {
        println("$town: KSh ${deliveryFee(town)}")
    }
    println(describe(1500))
}
```

`when` can match values, ranges (`in 1000..9999`), types and conditions. It's used everywhere in Android code.

## Loops and ranges

```try-kotlin
fun main() {
    for (i in 1..5) print("$i ")             // 1 to 5
    println()
    for (i in 10 downTo 0 step 2) print("$i ")
    println()
    for (i in 0 until 3) print("$i ")        // 0, 1, 2 (until excludes the end)
    println()

    var savings = 0
    var week = 0
    while (savings < 5000) {
        week++
        savings += 750
    }
    println("Reached KSh $savings after $week weeks")
}
```

## Why Kotlin is the language of Android

Google recommends Kotlin for Android development, and most new Android apps (banking, mobile money, ride-hailing, delivery and e-commerce apps) are written in it. Kotlin is concise, null-safe and fully compatible with Java, so it works with existing Android libraries. It's also used for back-end services (Ktor, Spring) and shared mobile code (Kotlin Multiplatform). Since Android dominates the Kenyan smartphone market, Kotlin skills lead directly to app development jobs and freelance projects.

## Null safety in practice

```try-kotlin
fun findPhone(name: String, contacts: Map<String, String>): String? = contacts[name]

fun main() {
    val contacts = mapOf("Amina" to "0712000001", "Brian" to "0722000002")

    val phone: String? = findPhone("Chebet", contacts)
    println(phone ?: "No phone saved")                 // Elvis operator: default when null
    println(phone?.length)                             // safe call: null instead of a crash

    findPhone("Amina", contacts)?.let { p ->          // run only when not null
        println("Calling $p")
    }

    val length = findPhone("Brian", contacts)?.length ?: 0
    println("Length: $length")
}
```

| Syntax | Meaning |
|---|---|
| `String?` | May be null |
| `a?.b` | Access `b` only if `a` isn't null |
| `a ?: b` | `a` if not null, otherwise `b` |
| `a?.let { }` | Run the block only when `a` isn't null |
| `a!!` | Assert not null (crashes if it is; avoid) |

Most crashes in older Android apps were `NullPointerException`s; Kotlin's type system prevents most of them at compile time.

## Functions: defaults, named arguments and single-expression functions

```try-kotlin
fun withVat(amount: Double, rate: Double = 0.16): Double = amount * (1 + rate)

fun formatKsh(amount: Double, decimals: Int = 0): String =
    "KSh " + "%,.${decimals}f".format(amount)

fun greet(name: String, title: String = "", greeting: String = "Habari") =
    if (title.isEmpty()) "$greeting $name" else "$greeting $title $name"

fun main() {
    println(formatKsh(withVat(2500.0)))
    println(formatKsh(withVat(2500.0, rate = 0.08), decimals = 2))
    println(greet("Otieno"))
    println(greet("Akinyi", title = "Dr.", greeting = "Karibu"))
}
```

## Collections and their functions

```try-kotlin
data class Product(val name: String, val category: String, val price: Int, val stock: Int)

fun main() {
    val products = listOf(
        Product("Unga 2kg", "Food", 180, 12),
        Product("Sugar 1kg", "Food", 210, 0),
        Product("Soap", "Home", 60, 30),
        Product("Cooking oil 1L", "Food", 350, 7),
    )

    val inStock = products.filter { it.stock > 0 }
    println(inStock.map { it.name })
    println("Stock value: " + products.sumOf { it.price * it.stock })
    println("Cheapest: " + products.minByOrNull { it.price }?.name)
    println("By category: " + products.groupBy { it.category }.mapValues { (_, list) -> list.size })
    println("Sorted: " + products.sortedByDescending { it.price }.map { it.name })
    println("Any out of stock? " + products.any { it.stock == 0 })

    val (cheap, pricey) = products.partition { it.price < 200 }
    println("Cheap ${cheap.size}, pricey ${pricey.size}")
}
```

`it` is the default name for a single lambda parameter. `data class` gives you `toString`, `equals` and `copy` automatically.

## Data classes and copy

```try-kotlin
data class Order(val id: Int, val customer: String, val total: Double, val status: String = "pending")

fun main() {
    val order = Order(1024, "Wanjiru", 3500.0)
    val paid = order.copy(status = "paid")       // new object, one field changed
    println(order)
    println(paid)
    println(order == Order(1024, "Wanjiru", 3500.0))   // value equality: true
    val (id, customer) = paid                     // destructuring
    println("Order $id for $customer")
}
```

Android apps keep screen state in data classes and create updated copies, which works well with Jetpack Compose.

## Mutable vs read-only collections

```try-kotlin
fun main() {
    val towns = listOf("Nairobi", "Mombasa")      // read-only
    val cart = mutableListOf("Unga")              // can change
    cart.add("Milk")
    cart += "Bread"
    cart.remove("Unga")
    println("$towns $cart")

    val stock = mutableMapOf("unga" to 40, "sugar" to 25)
    stock["rice"] = 30
    stock["unga"] = (stock["unga"] ?: 0) - 5
    stock.getOrPut("salt") { 0 }
    println(stock)
    for ((item, qty) in stock) println("$item: $qty")
}
```

Prefer read-only collections (`listOf`, `mapOf`) and use mutable ones only where changes are needed; it prevents accidental modifications.

## Extension functions

```try-kotlin
fun String.toKenyanIntl(): String? {
    val digits = filter { it.isDigit() }
    return when {
        digits.length == 10 && digits.startsWith("0") -> "254" + digits.drop(1)
        digits.length == 12 && digits.startsWith("254") -> digits
        else -> null
    }
}

fun Int.ksh(): String = "KSh " + "%,d".format(this)

fun main() {
    println("0712 345 678".toKenyanIntl())
    println("+254-722-000-111".toKenyanIntl())
    println("12345".toKenyanIntl())
    println(15000.ksh())
}
```

Extension functions add methods to existing types (even `String` and `Int`) without inheritance, keeping helper code readable: `phone.toKenyanIntl()`.

## Practice

1. Write `fun parseAmount(text: String): Double?` that returns null for invalid input, and print a default with `?:`.
2. Use `groupBy` and `sumOf` to total sales per town from a list of data classes.
3. Create a data class `Student` and use `copy` to update a mark.
4. Write an extension function `String.initials()` that returns "AO" for "Achieng Odhiambo".
5. Use `partition` to split marks into passed and failed lists.

:::think Why is `val name: String = getName() ?: "Guest"` safer than `val name = getName()!!`?
`!!` throws a NullPointerException (crashing the app) whenever `getName()` returns null. The Elvis operator provides a sensible default instead, so the app keeps working and the compiler guarantees `name` is never null afterwards.
:::

```quiz
Q: Which keyword declares a read-only variable in Kotlin?
A: val
Q: Which keyword declares a variable that can change?
A: var
Q: Where does every Kotlin program start? Write the function.
A: main | fun main() | main()
Q: Complete the template to print a variable called name: "Hello ..."
A: $name | ${name}
Q: Which Kotlin keyword is a powerful replacement for switch?
A: when
Q: Does 0 until 3 include 3? (yes or no)
A: no
Q: What is the ?: operator called in Kotlin?
A: Elvis | Elvis operator
Q: Which data class function creates a changed copy of an object?
A: copy
Q: What is the default name of a single lambda parameter in Kotlin?
A: it
Q: Which collection function splits a list into two lists by a condition?
A: partition
```
=== exercise ===
Write a function `vat(amount: Double): Double` that returns 16% of the amount, and print the VAT on **2500.0**. The output should be **400.0**.
=== starter ===
fun vat(amount: Double): Double {
    // return 16% of amount
    return 0.0
}

fun main() {
    println(vat(2500.0))
}
=== expected ===
400.0
=== must_contain ===
fun vat
