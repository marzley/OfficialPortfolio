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
```
