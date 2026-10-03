---
slug: variables-types
title: Variables, data types and operators in Java
after: introduction
---
# Variables, data types and operators in Java

Java is **statically typed**: every variable has a type that's fixed when you write the code. The compiler checks types before the program runs, which catches many mistakes early. That's one reason banks and big companies like Java.

> Examples here run on Compiler Explorer (an online service), so they need internet and take a few seconds. Keep the class name `Main`.

## Declaring variables

```try-java
class Main {
    public static void main(String[] args) {
        int students = 45;
        double feePerTerm = 12500.50;
        char grade = 'A';
        boolean isBoarding = true;
        String school = "Kenya High";

        System.out.println(school + " has " + students + " students in this class.");
        System.out.println("Fee: KSh " + feePerTerm + ", grade " + grade + ", boarding: " + isBoarding);

        final double VAT = 0.16;     // final = a constant, can't be changed
        var town = "Kisumu";          // var: Java infers the type (String)
        System.out.println(town + " VAT " + VAT);
    }
}
```

## Primitive types

| Type | Size | Holds | Example |
|---|---|---|---|
| `byte` | 8 bits | −128 to 127 | `byte age = 20;` |
| `short` | 16 bits | ±32,767 | |
| `int` | 32 bits | about ±2.1 billion | `int stock = 500;` |
| `long` | 64 bits | very big whole numbers | `long population = 52_000_000L;` |
| `float` | 32 bits | decimals (~7 digits) | `float rate = 3.5f;` |
| `double` | 64 bits | decimals (~15 digits): the default | `double price = 199.99;` |
| `char` | 16 bits | one character, single quotes | `char c = 'K';` |
| `boolean` | | `true` / `false` | |

`String` isn't primitive: it's an **object** (note the capital S), written in double quotes.

## Arithmetic and the integer division trap

```try-java
class Main {
    public static void main(String[] args) {
        int a = 17, b = 5;
        System.out.println(a + b);        // 22
        System.out.println(a / b);        // 3   (int / int = whole number!)
        System.out.println(a % b);        // 2   remainder
        System.out.println((double) a / b); // 3.4 (cast one to double first)

        int count = 10;
        count++;          // 11
        count += 5;       // 16
        System.out.println(count);

        System.out.println(Math.round(12.567 * 100) / 100.0);  // 12.57
        System.out.println(Math.max(3, 9) + " " + Math.pow(2, 10) + " " + Math.sqrt(144));
    }
}
```

## Casting between types

```try-java
class Main {
    public static void main(String[] args) {
        int whole = 7;
        double d = whole;             // widening: automatic (int -> double)
        double price = 99.99;
        int rounded = (int) price;    // narrowing: must cast, cuts off decimals -> 99

        String text = "250";
        int qty = Integer.parseInt(text);          // String -> int
        double amount = Double.parseDouble("1500.75");
        String back = String.valueOf(qty * 2);    // int -> String

        System.out.println(d + " " + rounded + " " + (qty + 50) + " " + amount + " " + back);
    }
}
```

## Comparison and logical operators

```try-java
class Main {
    public static void main(String[] args) {
        int age = 19;
        boolean hasId = true;
        System.out.println(age >= 18 && hasId);   // AND
        System.out.println(age < 13 || age > 65); // OR
        System.out.println(!hasId);               // NOT

        String a = "Nairobi";
        String b = new String("Nairobi");
        System.out.println(a == b);          // false: compares memory locations
        System.out.println(a.equals(b));     // true: compares the text (always use this)

        String status = age >= 18 ? "adult" : "minor";   // ternary
        System.out.println(status);
    }
}
```

> Always compare strings with `.equals()` (or `.equalsIgnoreCase()`), never `==`.

## Formatting output

```try-java
class Main {
    public static void main(String[] args) {
        String name = "Amina";
        double balance = 12345.6;
        System.out.printf("%-10s KSh %,.2f%n", name, balance);   // Amina      KSh 12,345.60
        String msg = String.format("%s has %d items", name, 3);
        System.out.println(msg);
    }
}
```

## Naming conventions

- Variables and methods: **camelCase** (`totalPrice`, `calculateFee()`)
- Classes: **PascalCase** (`BankAccount`)
- Constants: **UPPER_SNAKE_CASE** (`MAX_LOGIN_TRIES`)

## Why Java fundamentals matter

Java runs Android apps, banking and telecom back-end systems, large enterprise software, and many university programming courses. Its strict types catch mistakes early, which is one reason banks and big companies trust it for systems that handle money. Getting variables, types and operators right is the foundation: most beginner bugs in Java come from integer division, wrong comparisons of strings, and type conversions.

## Wrapper classes and autoboxing

Each primitive has a matching **wrapper class** (an object version) used in collections like `ArrayList`:

| Primitive | Wrapper | Useful methods |
|---|---|---|
| `int` | `Integer` | `Integer.parseInt("42")`, `Integer.MAX_VALUE` |
| `double` | `Double` | `Double.parseDouble("3.5")` |
| `boolean` | `Boolean` | `Boolean.parseBoolean("true")` |
| `char` | `Character` | `Character.isDigit('7')`, `Character.toUpperCase('a')` |
| `long` | `Long` | `Long.parseLong("254712345678")` |

```try-java
import java.util.ArrayList;

class Main {
    public static void main(String[] args) {
        ArrayList<Integer> marks = new ArrayList<>();
        marks.add(78);              // autoboxing: int -> Integer
        marks.add(91);
        int first = marks.get(0);   // unboxing: Integer -> int
        System.out.println("First mark: " + first);

        System.out.println(Integer.MAX_VALUE);
        System.out.println(Character.isDigit('7') + " " + Character.isLetter('7'));
        long phone = Long.parseLong("254712345678");      // too big for int
        System.out.println("Phone as long: " + phone);
    }
}
```

A phone number like 254712345678 doesn't fit in an `int` (maximum about 2.1 billion). In real apps, store phone numbers as `String`, since you never do maths on them and leading zeros matter.

## Overflow: when numbers wrap around

```try-java
class Main {
    public static void main(String[] args) {
        int big = Integer.MAX_VALUE;
        System.out.println(big + 1);              // wraps to a large negative number!
        long safe = (long) big + 1;
        System.out.println(safe);
        try {
            Math.addExact(big, 1);                // throws instead of silently wrapping
        } catch (ArithmeticException e) {
            System.out.println("Overflow detected: " + e.getMessage());
        }
    }
}
```

For totals that may grow large (e.g. a bank's daily transaction value in cents), use `long`, and `Math.addExact` when overflow must never go unnoticed.

## Money: use BigDecimal, not double

```try-java
import java.math.BigDecimal;
import java.math.RoundingMode;

class Main {
    public static void main(String[] args) {
        System.out.println(0.1 + 0.2);                          // 0.30000000000000004

        BigDecimal price = new BigDecimal("1999.99");
        BigDecimal qty = new BigDecimal("3");
        BigDecimal vatRate = new BigDecimal("0.16");
        BigDecimal subtotal = price.multiply(qty);
        BigDecimal vat = subtotal.multiply(vatRate).setScale(2, RoundingMode.HALF_UP);
        System.out.println("Subtotal: " + subtotal);
        System.out.println("VAT: " + vat);
        System.out.println("Total: " + subtotal.add(vat));
    }
}
```

Create `BigDecimal` from **strings** (`new BigDecimal("0.1")`), not doubles, to avoid carrying the floating-point error in.

## char arithmetic

Characters are stored as numbers (Unicode code points), which allows some useful tricks:

```try-java
class Main {
    public static void main(String[] args) {
        char grade = 'B';
        System.out.println((int) grade);          // 66
        System.out.println((char) (grade - 1));   // A
        char digit = '7';
        int value = digit - '0';                  // convert a digit character to its number
        System.out.println(value * 2);            // 14
        for (char c = 'A'; c <= 'E'; c++) System.out.print(c + " ");
        System.out.println();
    }
}
```

## var: local type inference

Since Java 10, `var` lets the compiler infer the type of local variables:

```try-java
import java.util.ArrayList;

class Main {
    public static void main(String[] args) {
        var town = "Kisumu";                         // String
        var population = 610_082;                    // int (underscores improve readability)
        var towns = new ArrayList<String>();         // ArrayList<String>
        towns.add(town);
        System.out.println(towns + " " + population);
    }
}
```

`var` still has a fixed type; it's just inferred. Use it when the type is obvious from the right-hand side.

## Scanner: reading user input

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.print("Enter amount: ");
        if (in.hasNextDouble()) {
            double amount = in.nextDouble();
            System.out.printf("With VAT: %.2f%n", amount * 1.16);
        } else {
            System.out.println("Please enter a number.");
        }
    }
}
```

`hasNextDouble()` checks the input before reading, avoiding an `InputMismatchException` when someone types letters.

## Common mistakes

| Mistake | Problem | Fix |
|---|---|---|
| `double avg = total / count;` with ints | Integer division happens first | `(double) total / count` |
| `if (name == "Amina")` | Compares object references | `name.equals("Amina")` |
| `int phone = 0712345678;` | Leading zero means octal / too big | Store as `String` |
| `double` for money | Rounding errors | `BigDecimal` or `long` cents |
| `Integer` compared with `==` | Works for small values only (caching), fails for larger ones | `.equals()` or unbox to `int` |

## Practice

1. Calculate the average of three integer marks correctly as a decimal.
2. Show what happens when an `int` overflows, then fix it with `long`.
3. Calculate VAT and total for an invoice using `BigDecimal` with 2 decimal places.
4. Convert the characters `'4'` and `'9'` to numbers and add them.
5. Read a number with `Scanner` and handle non-numeric input gracefully.

:::think Why might `Integer a = 1000; Integer b = 1000; a == b` be false while the same code with 100 gives true?
`==` on `Integer` objects compares references. Java caches small Integer values (by default -128 to 127), so 100 refers to the same cached object, but 1000 creates two different objects. Always compare wrapper objects with `.equals()` or compare primitive `int` values.
:::

```quiz
Q: Which type is the default for decimal numbers in Java?
A: double
Q: What is 17 / 5 in Java when both are int?
A: 3
Q: Which method should you use to compare two strings' text?
A: equals | .equals() | equals()
Q: Which keyword makes a variable a constant?
A: final
Q: Which method converts the String "250" to an int?
A: Integer.parseInt | parseInt
Q: Which class should you use for exact money calculations in Java?
A: BigDecimal
Q: Which wrapper class goes with the primitive int?
A: Integer
Q: Which keyword lets Java infer a local variable's type?
A: var
Q: Which Math method throws an exception on int overflow when adding?
A: addExact | Math.addExact
```
