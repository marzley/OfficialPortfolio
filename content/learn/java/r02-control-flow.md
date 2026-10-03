---
slug: control-flow
title: "Conditions, loops and arrays in Java: if/else, switch, for, while, do-while, break/continue, arrays and 2D arrays"
after: KEEP
---
# Conditions, loops and arrays in Java: if/else, switch, for, while, do-while, break/continue, arrays and 2D arrays

Programs become useful when they **decide** (is the fee fully paid? is stock low?) and **repeat** (print every student's report, total every sale). Java's control flow statements and arrays let you do both. This unit covers conditions, the modern switch, all loop types, and arrays (including 2D arrays for tables like class mark sheets), with runnable examples based on school and business tasks.

:::note What you will learn
- Comparison and logical operators
- if, else if, else and nested conditions
- The ternary operator
- switch statements and switch expressions (modern Java)
- for, enhanced for, while and do-while loops
- break, continue and loop patterns (sum, count, max, search)
- Arrays: creating, accessing, looping, length, default values
- Useful Arrays methods: sort, toString, fill, copyOf
- 2D arrays for tables
- Common mistakes: off-by-one, ArrayIndexOutOfBounds, == with Strings
:::

## Comparison and logical operators

| Operator | Meaning |
|---|---|
| `==`, `!=` | Equal, not equal (for primitives) |
| `<`, `>`, `<=`, `>=` | Comparisons |
| `&&` | AND (both true) |
| `\|\|` | OR (at least one true) |
| `!` | NOT |

:::warning Comparing Strings
Use `.equals()` to compare String contents: `town.equals("Nairobi")`. `==` checks whether two variables point to the same object and can give surprising results. Use `.equalsIgnoreCase()` to ignore case.
:::

## if, else if, else

```try-java
class Main {
    public static void main(String[] args) {
        int mark = 72;
        String grade;
        if (mark >= 80) {
            grade = "A";
        } else if (mark >= 65) {
            grade = "B";
        } else if (mark >= 50) {
            grade = "C";
        } else if (mark >= 40) {
            grade = "D";
        } else {
            grade = "E";
        }
        System.out.println("Mark " + mark + " = grade " + grade);

        double balance = 0;
        boolean boarding = true;
        if (balance == 0 && boarding) {
            System.out.println("Cleared to report to the dormitory");
        }

        String town = "nairobi";
        System.out.println(town.equalsIgnoreCase("Nairobi") ? "Nairobi branch" : "Other branch");  // ternary
    }
}
```

## switch

Classic switch (needs `break` to stop falling through):

```try-java
class Main {
    public static void main(String[] args) {
        int day = 3;
        switch (day) {
            case 1: System.out.println("Monday"); break;
            case 2: System.out.println("Tuesday"); break;
            case 3: System.out.println("Wednesday"); break;
            default: System.out.println("Another day");
        }

        // Modern switch expression (Java 14+): no fall-through, returns a value
        String status = "shipped";
        String label = switch (status) {
            case "pending" -> "Waiting for payment";
            case "paid", "processing" -> "Preparing your order";
            case "shipped" -> "On the way";
            default -> "Unknown";
        };
        System.out.println(label);
    }
}
```

## Loops

### for loop

```try-java
class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("7 x " + i + " = " + (7 * i));
        }
        // Counting down in steps of 2
        for (int i = 10; i > 0; i -= 2) {
            System.out.print(i + " ");
        }
        System.out.println();
    }
}
```

### while and do-while

```try-java
class Main {
    public static void main(String[] args) {
        // Months to save KSh 50,000 at KSh 4,500/month with 1% monthly interest
        double balance = 0;
        int months = 0;
        while (balance < 50000) {
            balance = balance * 1.01 + 4500;
            months++;
        }
        System.out.printf("Months: %d, balance KSh %,.0f%n", months, balance);

        int tries = 0;
        do {
            tries++;            // runs at least once
        } while (tries < 3);
        System.out.println("Tries: " + tries);
    }
}
```

### break and continue

```try-java
class Main {
    public static void main(String[] args) {
        int[] readings = {4, 7, -1, 12, 0, 9};
        for (int r : readings) {
            if (r < 0) continue;      // skip invalid readings
            if (r == 0) break;        // stop at a zero
            System.out.println(r);
        }
    }
}
```

## Arrays

An **array** stores a fixed number of values of the same type, indexed from **0**.

```try-java
import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] marks = {67, 82, 45, 90, 58};
        String[] towns = new String[3];      // default values: null for objects, 0 for numbers
        towns[0] = "Nairobi";
        towns[1] = "Mombasa";
        towns[2] = "Kisumu";

        System.out.println("First mark: " + marks[0] + ", count: " + marks.length);

        int total = 0, highest = marks[0];
        for (int m : marks) {                // enhanced for loop
            total += m;
            if (m > highest) highest = m;
        }
        double average = (double) total / marks.length;
        System.out.printf("Total %d, average %.1f, highest %d%n", total, average, highest);

        int passCount = 0;
        for (int i = 0; i < marks.length; i++) {   // classic loop when you need the index
            if (marks[i] >= 50) passCount++;
        }
        System.out.println(passCount + " passed");

        Arrays.sort(marks);
        System.out.println(Arrays.toString(marks));
        System.out.println(Arrays.toString(towns));
        int[] copy = Arrays.copyOf(marks, 7);    // longer copy padded with zeros
        System.out.println(Arrays.toString(copy));
    }
}
```

Arrays have a **fixed size**. For lists that grow and shrink, use `ArrayList` (see the collections lesson).

## 2D arrays

A table of rows and columns: students × subjects.

```try-java
class Main {
    public static void main(String[] args) {
        String[] students = {"Brian", "Faith", "Juma"};
        String[] subjects = {"Math", "Eng", "Sci"};
        int[][] marks = {
            {72, 65, 80},
            {88, 91, 79},
            {55, 60, 49},
        };

        for (int s = 0; s < marks.length; s++) {
            int total = 0;
            for (int j = 0; j < marks[s].length; j++) {
                total += marks[s][j];
            }
            System.out.printf("%-6s total %3d average %.1f%n", students[s], total, total / 3.0);
        }

        // Subject averages (column by column)
        for (int j = 0; j < subjects.length; j++) {
            int sum = 0;
            for (int[] row : marks) sum += row[j];
            System.out.printf("%s average: %.1f%n", subjects[j], sum / (double) marks.length);
        }
    }
}
```

## Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| `i <= arr.length` in a loop | `ArrayIndexOutOfBoundsException` | Use `i < arr.length` (last index is length − 1) |
| Comparing Strings with `==` | Conditions unexpectedly false | Use `.equals()` |
| Missing `break` in classic switch | Several cases run | Add `break` or use the `->` switch |
| Infinite while loop | Program never ends | Make sure the loop variable changes |
| Integer division in averages | Rounded down results | Cast to double |
| Semicolon after if: `if (x > 5);` | Body always runs | Remove the stray semicolon |

:::think Write the logic (in words or code) to count how many students in an int array `marks` scored above the class average.
First loop to compute the total and average (`double avg = (double) total / marks.length;`), then a second loop counting marks greater than `avg`. Two passes are needed because you can't know the average until all marks are summed.
:::

## Summary

- Combine comparisons with `&&`, `||`, `!`; compare Strings with `.equals()`.
- Use if/else if/else, the ternary operator, and switch (prefer modern `->` switch expressions).
- Loops: for (known count), enhanced for (each element), while (condition first), do-while (at least once); break and continue control them.
- Arrays are fixed-size, zero-indexed, with `.length`; `Arrays.sort`, `toString` and `copyOf` help; 2D arrays model tables.
- Avoid off-by-one errors, missing breaks, infinite loops and integer division.

```quiz
Q: Which method compares the contents of two Strings in Java?
A: equals | .equals() | equals()
Q: What is the index of the first element of a Java array?
A: 0 | zero
Q: Which loop always runs at least once?
A: do-while | do while
Q: Which exception occurs when you access index arr.length?
A: ArrayIndexOutOfBoundsException
Q: Which keyword skips to the next loop iteration?
A: continue
Q: Which property gives the number of elements in an array?
A: length | .length
```
