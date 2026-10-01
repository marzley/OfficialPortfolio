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
