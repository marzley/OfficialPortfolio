---
slug: introduction
title: "Java introduction: what Java is, where it's used, the JDK and JVM, your first program, syntax rules and input/output"
after: KEEP
---
# Java introduction: what Java is, where it's used, the JDK and JVM, your first program, syntax rules and input/output

**Java** is one of the world's most widely used programming languages. It powers large banking and insurance systems, government and telecom back ends, enterprise web applications, Android apps (alongside Kotlin), big data tools, and countless university courses, including many computer science programmes in Kenya. Java's motto, "write once, run anywhere", comes from the **Java Virtual Machine (JVM)**, which lets the same compiled program run on Windows, Linux and macOS. Learning Java teaches strong programming fundamentals (types, classes, structure) that transfer to Kotlin, C#, and other languages.

:::note What you will learn
- What Java is, its history and why it's popular
- Where Java is used and jobs that need it
- JDK, JRE and JVM: how Java code runs
- Installing Java and choosing an editor/IDE
- Your first program, line by line
- Syntax rules: classes, methods, statements, braces, case sensitivity
- Variables and data types (primitive and String)
- Operators and type casting
- Output with println/printf and input with Scanner
- Comments, naming conventions and common errors
:::

## Why Java?

| Strength | What it means |
|---|---|
| **Portable** | Compiled to bytecode that runs on any device with a JVM |
| **Strongly typed** | Catches many errors at compile time |
| **Object-oriented** | Organises big programs into classes and objects |
| **Huge ecosystem** | Libraries and frameworks for almost everything (Spring, Hibernate, Apache tools) |
| **Mature and stable** | Used for decades in critical systems; long-term support releases |
| **Jobs** | Constant demand in banks, telcos, enterprise software and Android |

## Where Java is used

| Area | Examples |
|---|---|
| **Enterprise back ends** | Banking cores, insurance, payroll, ERP systems (Spring Boot APIs) |
| **Android** | Many existing apps are written in Java; Kotlin is now Google's preferred language, and they interoperate |
| **Web applications** | Spring Boot, Jakarta EE |
| **Big data** | Hadoop, Kafka, Spark (JVM ecosystem) |
| **Desktop and tools** | IntelliJ IDEA, Eclipse, Minecraft (Java Edition) |
| **Education** | University programming courses, AP/IGCSE-style curricula |

## How Java runs: JDK, JRE, JVM

```
Main.java  --javac (compiler)-->  Main.class (bytecode)  --JVM-->  runs on Windows/Linux/macOS
```

| Term | Meaning |
|---|---|
| **JDK** (Java Development Kit) | Everything to write and compile Java: compiler (`javac`), tools, runtime |
| **JRE** (Java Runtime Environment) | What's needed to run Java programs |
| **JVM** (Java Virtual Machine) | Executes bytecode, manages memory (garbage collection) |

## Installing and tools

1. Install a **JDK** (an LTS version such as 21) from Adoptium (Eclipse Temurin), Oracle or Microsoft.
2. Check: `java -version` and `javac -version`.
3. Choose an editor:
   - **IntelliJ IDEA Community** (free, excellent), Eclipse, NetBeans, or VS Code with the Java extension pack.
   - **Android Studio** for Android development.
4. Compile and run from the terminal:

```bash
javac Main.java     # creates Main.class
java Main           # runs it
java Main.java      # newer JDKs can compile and run a single file in one step
```

In this hub, the **Run** button compiles and runs Java for you online.

## Your first program

```try-java
class Main {
    public static void main(String[] args) {
        System.out.println("Habari, Kenya!");
        System.out.println("Learning Java on the Marzley learning hub.");
    }
}
```

Line by line:
- `class Main { ... }`: every Java program lives inside a **class**. In a file, the public class name must match the file name (`Main.java`).
- `public static void main(String[] args)`: the **main method**, where the program starts.
  - `public`: can be called from outside; `static`: belongs to the class, no object needed; `void`: returns nothing; `String[] args`: command-line arguments.
- `System.out.println(...)`: prints text followed by a new line.
- Statements end with `;`; code blocks are wrapped in `{ }`.

## Syntax rules

- Java is **case-sensitive**: `Main` ≠ `main`, `String` ≠ `string`.
- Every statement ends with a **semicolon**.
- **Braces** `{}` group code; indentation is for humans (but always indent neatly).
- Text (Strings) uses **double quotes**; single characters use single quotes: `'A'`.

## Variables and data types

Java variables must be declared with a type:

```try-java
class Main {
    public static void main(String[] args) {
        int students = 45;               // whole numbers
        long population = 53_000_000L;   // big whole numbers (underscores for readability)
        double fee = 12500.50;           // decimals
        float discount = 0.1f;           // smaller decimals (f suffix)
        char grade = 'A';                // one character
        boolean paid = true;             // true/false
        String school = "Kenya High";    // text (a class, not a primitive)

        System.out.println(school + ": " + students + " students, fee KSh " + fee);
        System.out.println("Grade " + grade + ", paid: " + paid + ", population " + population);

        final double VAT_RATE = 0.16;    // final = constant
        var town = "Kisumu";             // var infers the type (String)
        System.out.println(town + " VAT rate " + VAT_RATE + ", discount " + discount);
    }
}
```

| Primitive type | Size | Example |
|---|---|---|
| `byte` | 8-bit | -128 to 127 |
| `short` | 16-bit | ±32,767 |
| `int` | 32-bit | about ±2.1 billion |
| `long` | 64-bit | very large numbers |
| `float` | 32-bit decimal | `3.14f` |
| `double` | 64-bit decimal | `3.14159` (default for decimals) |
| `char` | 16-bit character | `'K'` |
| `boolean` | true/false | `true` |

`String` isn't primitive; it's a class with useful methods (next lessons).

## Operators and casting

```try-java
class Main {
    public static void main(String[] args) {
        int a = 17, b = 5;
        System.out.println(a + b);          // 22
        System.out.println(a / b);          // 3: int / int drops the decimal!
        System.out.println(a % b);          // 2: remainder
        System.out.println((double) a / b); // 3.4: cast to double first

        int count = 10;
        count++;                            // 11
        count += 5;                         // 16
        System.out.println(count);

        double price = 1999.99;
        int whole = (int) price;            // narrowing cast: 1999 (decimal dropped)
        System.out.println(whole);

        int bigSum = Integer.MAX_VALUE;
        System.out.println(bigSum + 1);     // overflow wraps to a negative number!
        System.out.println(Math.round(12.567 * 100) / 100.0);   // 12.57
    }
}
```

Watch for **integer division** and **overflow** (use `long` for large values such as totals in cents).

## Output formatting

```try-java
class Main {
    public static void main(String[] args) {
        String name = "Amina";
        double balance = 15250.5;
        int items = 3;
        System.out.printf("Hello %s, you have %d items.%n", name, items);
        System.out.printf("Balance: KSh %,.2f%n", balance);
        System.out.println(String.format("%-10s|%6d|", "Chapati", 30));
    }
}
```

| Format | Meaning |
|---|---|
| `%s` | String |
| `%d` | Integer |
| `%.2f` | Decimal with 2 places |
| `%,.2f` | With thousands separators |
| `%n` | New line |

## Input with Scanner

Reading keyboard input (run this on your own computer, as the online runner has no keyboard input):

```java
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = sc.nextLine();
        System.out.print("Enter your age: ");
        int age = sc.nextInt();
        System.out.println("Hello " + name + ", next year you'll be " + (age + 1));
        sc.close();
    }
}
```

`nextInt()` leaves the Enter key in the buffer; if you read a line after it, call `sc.nextLine()` once first.

## Comments and naming conventions

```java
// single-line comment
/* multi-line
   comment */
/** Javadoc comment: documents classes and methods */
```

| Item | Convention | Example |
|---|---|---|
| Classes | PascalCase | `StudentRecord` |
| Methods and variables | camelCase | `calculateFee`, `totalAmount` |
| Constants | UPPER_SNAKE_CASE | `VAT_RATE` |
| Packages | lowercase | `ke.co.marzley.fees` |

## Common errors

| Error | Cause |
|---|---|
| `error: ';' expected` | Missing semicolon |
| `cannot find symbol` | Typo in a variable/method name, or missing import |
| `incompatible types: possible lossy conversion from double to int` | Assigning a decimal to an int without casting |
| `class X is public, should be declared in a file named X.java` | File name doesn't match the public class |
| `Exception in thread "main" java.lang.ArithmeticException: / by zero` | Dividing an integer by zero at runtime |

:::think A student writes `int average = total / count;` where total = 245 and count = 4, expecting 61.25, but gets 61. Why, and how do they fix it?
Both are ints, so Java performs integer division and the result is stored in an int. Use a double and cast: `double average = (double) total / count;` which gives 61.25.
:::

## Summary

- Java is a portable, strongly typed, object-oriented language used in enterprise systems, Android, web back ends, big data and education.
- `javac` compiles `.java` to bytecode; the JVM runs it anywhere; install a JDK (LTS) and use IntelliJ, VS Code or Android Studio.
- Programs start in `public static void main(String[] args)` inside a class; statements end with `;`; Java is case-sensitive.
- Declare variables with types (int, long, double, char, boolean, String); watch integer division, casting and overflow.
- Print with println/printf, read input with Scanner, follow naming conventions and learn common error messages.

```quiz
Q: What does JVM stand for?
A: Java Virtual Machine
Q: Which command compiles a Java file?
A: javac
Q: What is the name of the method where a Java program starts?
A: main
Q: What does 17 / 5 give in Java when both are ints?
A: 3
Q: Which keyword makes a variable constant?
A: final
Q: Which class reads keyboard input?
A: Scanner
```
