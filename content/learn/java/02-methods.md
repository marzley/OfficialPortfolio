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
```
