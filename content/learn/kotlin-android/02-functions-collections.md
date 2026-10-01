---
slug: kotlin-functions-collections
title: Kotlin functions, lambdas and collections
after: kotlin-basics
---
# Kotlin functions, lambdas and collections

Android apps are full of lists (products, messages, orders) and small functions that transform them. Kotlin makes this beautifully short.

## Functions

```try-kotlin
// A normal function
fun withVat(amount: Double, rate: Double = 0.16): Double {
    return amount * (1 + rate)
}

// One-expression functions can use =
fun square(n: Int) = n * n

// Named arguments make calls readable
fun greet(name: String, title: String = "", shout: Boolean = false): String {
    val text = if (title.isEmpty()) "Habari $name" else "Habari $title $name"
    return if (shout) text.uppercase() else text
}

fun main() {
    println(withVat(1000.0))              // uses the default rate
    println(withVat(1000.0, rate = 0.0))  // named argument
    println(square(12))
    println(greet("Otieno", title = "Dr.", shout = true))
}
```

**Default** and **named arguments** are used constantly in Jetpack Compose: `Text(text = "Hi", fontSize = 20.sp, color = Color.Red)`.

## Lambdas: functions as values

A **lambda** is a small function without a name, written in braces:

```try-kotlin
fun main() {
    val double = { x: Int -> x * 2 }
    println(double(21))

    // A function that takes another function
    fun applyDiscount(price: Int, rule: (Int) -> Int): Int = rule(price)

    println(applyDiscount(1000) { it - 100 })          // `it` is the single parameter
    println(applyDiscount(1000) { (it * 0.9).toInt() })
}
```

When the last parameter is a function, you can put the lambda **outside the parentheses**. That's why Compose code looks like `Button(onClick = { ... }) { Text("Pay") }`.

## Lists, sets and maps

```try-kotlin
fun main() {
    val towns = listOf("Nyeri", "Meru", "Embu")          // read-only list
    val cart = mutableListOf("Unga", "Sugar")             // can change
    cart.add("Milk")
    cart.remove("Sugar")
    println("$towns | $cart | first: ${cart.first()} | size: ${cart.size}")

    val unique = setOf("Wanjiku", "Otieno", "Wanjiku")     // no duplicates
    println(unique)

    val prices = mapOf("Unga" to 180, "Sugar" to 150, "Milk" to 60)
    println("Milk costs ${prices["Milk"]}")
    println("Bread costs ${prices["Bread"] ?: "not sold here"}")
    for ((item, price) in prices) println("$item: KSh $price")

    val stock = mutableMapOf("Unga" to 12)
    stock["Rice"] = 20
    stock["Unga"] = stock.getValue("Unga") - 2
    println(stock)
}
```

## Collection operations (the real power)

```try-kotlin
data class Product(val name: String, val price: Int, val stock: Int, val category: String)

fun main() {
    val products = listOf(
        Product("Unga 2kg", 180, 12, "Food"),
        Product("Sugar 1kg", 150, 0, "Food"),
        Product("Soap", 120, 30, "Home"),
        Product("Cooking oil 1L", 350, 4, "Food"),
        Product("Matches", 10, 100, "Home"),
    )

    val inStock = products.filter { it.stock > 0 }
    val names = inStock.map { it.name }
    val stockValue = products.sumOf { it.price * it.stock }
    val cheapest = products.minByOrNull { it.price }
    val byCategory = products.groupBy { it.category }
    val sorted = products.sortedByDescending { it.price }
    val anyOut = products.any { it.stock == 0 }

    println("In stock: $names")
    println("Stock value: KSh $stockValue")
    println("Cheapest: ${cheapest?.name}")
    println("Categories: ${byCategory.mapValues { (_, list) -> list.size }}")
    println("Most expensive: ${sorted.first().name}")
    println("Anything sold out? $anyOut")
}
```

| Function | Does |
|---|---|
| `filter { }` | Keep items that match |
| `map { }` | Transform each item |
| `sumOf { }` | Add up a value |
| `minByOrNull` / `maxByOrNull` | Smallest / largest by a value |
| `groupBy { }` | Group into a map |
| `sortedBy` / `sortedByDescending` | Sort |
| `any` / `all` / `none` | Yes/no checks |
| `first()` / `firstOrNull { }` | Find items |
| `take(n)` / `drop(n)` | Part of the list |

## Extension functions

Add your own functions to existing types:

```try-kotlin
fun Int.toKsh(): String = "KSh " + "%,d".format(this)

fun String.isKenyanPhone(): Boolean {
    val digits = filter { it.isDigit() }
    return Regex("^(0[17]\\d{8}|254[17]\\d{8})$").matches(digits)
}

fun main() {
    println(125000.toKsh())
    println("0712 345 678".isKenyanPhone())
    println("12345".isKenyanPhone())
}
```

```quiz
Q: What is the default name of a lambda's single parameter?
A: it
Q: Which function keeps only items that match a condition?
A: filter
Q: Which function transforms every item in a list?
A: map
Q: Which list type can you add items to?
A: mutableListOf | MutableList | mutable list
Q: Which operator gives a default when a value is null, as in prices["Bread"] ?: "none"?
A: ?: | elvis | elvis operator
Q: Adding your own function to an existing type like Int is called an ... function?
A: extension
```
=== exercise ===
Given the list of prices, print the **total of prices above 100** using `filter` and `sum`. The answer is **680**.
=== starter ===
fun main() {
    val prices = listOf(180, 60, 150, 350, 40)
    // filter prices above 100, then sum them and print
}
=== expected ===
680
=== must_contain ===
filter
