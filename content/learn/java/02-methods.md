---
slug: methods
title: Methods: parameters, return values and overloading
after: control-flow
---
# Methods: parameters, return values and overloading

A **method** is a named block of code that does one job. Methods keep programs organised, avoid repetition and make testing easier. In Java every method lives inside a class.

## Anatomy of a method

```java
static double withVat(double amount, double rate) {
    return amount * (1 + rate / 100);
}
```

| Part | Meaning |
|---|---|
| `static` | Belongs to the class; call it without creating an object (for now, use `static` in `Main`) |
| `double` (first) | The **return type**; `void` if nothing is returned |
| `withVat` | The name (camelCase, a verb) |
| `(double amount, double rate)` | **Parameters** with their types |
| `return` | Sends a value back and ends the method |

## Calling methods

```try-java
class Main {
    static double withVat(double amount, double rate) {
        return amount * (1 + rate / 100);
    }

    static String formatKsh(double amount) {
        return String.format("KSh %,.2f", amount);
    }

    static void printReceipt(String item, int qty, double price) {    // void: returns nothing
        double total = withVat(qty * price, 16);
        System.out.println(qty + " x " + item + " = " + formatKsh(total) + " (incl. VAT)");
    }

    public static void main(String[] args) {
        printReceipt("Exercise book", 10, 45);
        printReceipt("Calculator", 1, 1500);
        System.out.println(formatKsh(withVat(1000, 16)));
    }
}
```

## Pass by value

Java passes **copies** of primitive values. Changing a parameter inside a method doesn't change the caller's variable:

```try-java
class Main {
    static void addBonus(int marks) {
        marks += 5;
        System.out.println("Inside: " + marks);
    }
    public static void main(String[] args) {
        int marks = 60;
        addBonus(marks);
        System.out.println("Outside: " + marks);   // still 60
    }
}
```

To "change" a value, **return** the new one: `marks = addBonus(marks);`. (For objects and arrays, the method gets a copy of the *reference*, so it can change the object's contents.)

## Overloading: same name, different parameters

```try-java
class Main {
    static int area(int side) { return side * side; }                       // square
    static int area(int width, int height) { return width * height; }      // rectangle
    static double area(double radius) { return Math.PI * radius * radius; } // circle

    public static void main(String[] args) {
        System.out.println(area(4));
        System.out.println(area(4, 6));
        System.out.printf("%.2f%n", area(1.5));
    }
}
```

Java picks the version whose parameter types match the call.

## Methods with validation and early return

```try-java
class Main {
    static String grade(int mark) {
        if (mark < 0 || mark > 100) return "Invalid";
        if (mark >= 80) return "A";
        if (mark >= 65) return "B";
        if (mark >= 50) return "C";
        return "D";
    }

    static boolean isValidPhone(String phone) {
        return phone != null && phone.matches("0[17]\\d{8}");
    }

    public static void main(String[] args) {
        int[] marks = {92, 67, 45, 101};
        for (int m : marks) System.out.println(m + " -> " + grade(m));
        System.out.println(isValidPhone("0712345678") + " " + isValidPhone("12345"));
    }
}
```

## Recursion

A method can call itself; it needs a **base case** to stop:

```try-java
class Main {
    static long factorial(int n) {
        if (n <= 1) return 1;          // base case
        return n * factorial(n - 1);   // recursive case
    }
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) System.out.println(i + "! = " + factorial(i));
    }
}
```

## Good method habits

- One method, one job. If you need "and" to describe it, split it.
- Descriptive names: `calculateFee()`, `isOverdue()`, `sendReminder()`.
- Keep them short: under ~20–30 lines is a good guide.
- Prefer returning values over printing inside helper methods: it makes them reusable.

## Why methods matter in real Java projects

Professional Java code is organised into many small methods, each doing one clear job: validating a phone number, calculating a loan repayment, formatting a receipt, saving an order. Small methods are easier to read, test and reuse. Android apps, Spring Boot back ends and banking systems are all built this way, and interviews often ask you to write and explain methods.

## Varargs: any number of arguments

```try-java
class Main {
    static int total(int... amounts) {          // amounts is an int[] inside the method
        int sum = 0;
        for (int a : amounts) sum += a;
        return sum;
    }

    static String joinTowns(String separator, String... towns) {
        return String.join(separator, towns);
    }

    public static void main(String[] args) {
        System.out.println(total());                    // 0
        System.out.println(total(500));                 // 500
        System.out.println(total(500, 1200, 350));      // 2050
        System.out.println(joinTowns(" | ", "Nairobi", "Nakuru", "Kisumu"));
    }
}
```

A varargs parameter must be the last parameter.

## Returning several values

Java methods return one value, but that value can be an object holding several:

```try-java
class Main {
    static class LoanSummary {
        final double monthly;
        final double totalPaid;
        final double interest;
        LoanSummary(double monthly, double totalPaid, double interest) {
            this.monthly = monthly; this.totalPaid = totalPaid; this.interest = interest;
        }
    }

    static LoanSummary reducingBalance(double principal, double annualRate, int months) {
        double r = annualRate / 12;
        double monthly = principal * r / (1 - Math.pow(1 + r, -months));
        double totalPaid = monthly * months;
        return new LoanSummary(monthly, totalPaid, totalPaid - principal);
    }

    public static void main(String[] args) {
        LoanSummary s = reducingBalance(100_000, 0.14, 12);
        System.out.printf("Monthly: KSh %,.2f%n", s.monthly);
        System.out.printf("Total paid: KSh %,.2f%n", s.totalPaid);
        System.out.printf("Interest: KSh %,.2f%n", s.interest);
    }
}
```

Modern Java also offers **records** (`record LoanSummary(double monthly, double totalPaid, double interest) {}`), a short way to define such data classes.

## Pass by value with objects

Java always passes a **copy of the value**. For objects, the value is a reference, so a method can change the object's contents but can't make the caller's variable point to a different object:

```try-java
import java.util.ArrayList;

class Main {
    static void addItem(ArrayList<String> cart) {
        cart.add("Milk");                    // changes the shared list: caller sees it
    }
    static void replaceCart(ArrayList<String> cart) {
        cart = new ArrayList<>();            // only changes the local copy of the reference
        cart.add("Bread");
    }

    public static void main(String[] args) {
        ArrayList<String> cart = new ArrayList<>();
        cart.add("Unga");
        addItem(cart);
        replaceCart(cart);
        System.out.println(cart);            // [Unga, Milk]
    }
}
```

## Recursion vs loops

```try-java
class Main {
    static long factorialRecursive(int n) {
        if (n <= 1) return 1;                // base case
        return n * factorialRecursive(n - 1);
    }
    static long factorialLoop(int n) {
        long result = 1;
        for (int i = 2; i <= n; i++) result *= i;
        return result;
    }
    static int sumDigits(int n) {
        return n < 10 ? n : n % 10 + sumDigits(n / 10);
    }
    static boolean isPalindrome(String s) {
        if (s.length() <= 1) return true;
        return s.charAt(0) == s.charAt(s.length() - 1) && isPalindrome(s.substring(1, s.length() - 1));
    }

    public static void main(String[] args) {
        System.out.println(factorialRecursive(10) + " " + factorialLoop(10));
        System.out.println(sumDigits(254712));
        System.out.println(isPalindrome("racecar") + " " + isPalindrome("kenya"));
    }
}
```

Each recursive call uses stack memory; very deep recursion causes a `StackOverflowError`. Loops are usually more efficient for simple repetition; recursion shines for naturally recursive problems (trees, folders, divide-and-conquer algorithms).

## Static vs instance methods

| Static method | Instance method |
|---|---|
| Belongs to the class: `MathUtils.round2(x)` | Belongs to an object: `account.deposit(500)` |
| Can't use instance fields directly | Uses the object's fields (`this.balance`) |
| Utilities, factory methods | Behaviour of a specific object |

```try-java
class Main {
    static class Account {
        private double balance;
        private final String owner;
        Account(String owner) { this.owner = owner; }

        void deposit(double amount) {                    // instance method
            if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
            balance += amount;
        }
        double getBalance() { return balance; }

        static Account openWith(String owner, double first) {   // static factory method
            Account a = new Account(owner);
            a.deposit(first);
            return a;
        }
    }

    public static void main(String[] args) {
        Account acc = Account.openWith("Juma", 1000);
        acc.deposit(250);
        System.out.println(acc.owner + ": " + acc.getBalance());
        try {
            acc.deposit(-5);
        } catch (IllegalArgumentException e) {
            System.out.println("Rejected: " + e.getMessage());
        }
    }
}
```

## Writing testable methods

```try-java
class Main {
    static String normalisePhone(String input) {
        String digits = input.replaceAll("[^0-9]", "");
        if (digits.matches("0[17]\\d{8}")) return "254" + digits.substring(1);
        if (digits.matches("254[17]\\d{8}")) return digits;
        return null;
    }

    static void check(String input, String expected) {
        String actual = normalisePhone(input);
        boolean ok = expected == null ? actual == null : expected.equals(actual);
        System.out.println((ok ? "PASS " : "FAIL ") + input + " -> " + actual);
    }

    public static void main(String[] args) {
        check("0712 345 678", "254712345678");
        check("+254-722-000-111", "254722000111");
        check("0112345678", "254112345678");
        check("12345", null);
    }
}
```

Pure methods (same input, same output, no side effects) are easy to test. In real projects, JUnit runs tests like these automatically.

## Practice

1. Write `average(double... values)` that returns 0 for no values.
2. Write a method returning a `MinMax` object with the lowest and highest mark.
3. Write a recursive `power(base, exp)` and compare it with a loop version.
4. Create an `Account` class with deposit, withdraw (rejecting overdrafts) and a static factory method.
5. Write five checks for a `isValidKraPin(String pin)` method (format: a letter, 9 digits, a letter).

:::think A method `void reset(int count) { count = 0; }` is called with a variable `total`, but `total` doesn't change. Yet `void clear(ArrayList<String> list) { list.clear(); }` does empty the caller's list. Why the difference?
Java passes copies of values. For `int`, the copy is the number itself, so changing it doesn't affect the caller. For an `ArrayList`, the copy is a reference to the same list object, so calling `clear()` modifies that shared object. Reassigning the parameter (`list = new ArrayList<>()`) wouldn't affect the caller either.
:::

```quiz
Q: What return type does a method that returns nothing have?
A: void
Q: Which keyword sends a value back from a method?
A: return
Q: Two methods with the same name but different parameters is called what?
A: overloading | method overloading
Q: If a method changes an int parameter, does the caller's variable change? (yes or no)
A: no
Q: What must every recursive method have so it stops? (two words)
A: base case | a base case
Q: What is the syntax for a parameter that accepts any number of ints? (type then dots)
A: int... | int ...
Q: Which error occurs when recursion goes too deep?
A: StackOverflowError | stack overflow
Q: Which kind of method can be called without creating an object?
A: static
```
