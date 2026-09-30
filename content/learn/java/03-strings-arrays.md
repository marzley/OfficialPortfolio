---
slug: strings-arrays-lists
title: Strings, arrays and ArrayLists
after: methods
---
# Strings, arrays and ArrayLists

Most programs work with text and collections of data: names, marks, products. Java has rich tools for both.

## String methods

```try-java
class Main {
    public static void main(String[] args) {
        String name = "  amina hassan  ";
        String clean = name.trim();
        System.out.println(clean.toUpperCase());
        System.out.println(clean.length());
        System.out.println(clean.charAt(0));
        System.out.println(clean.substring(0, 5));        // "amina"
        System.out.println(clean.indexOf("hassan"));      // 6
        System.out.println(clean.contains("sa"));
        System.out.println(clean.replace("a", "@"));
        System.out.println("0712 345 678".replace(" ", ""));
        String[] parts = "Nairobi,Mombasa,Kisumu".split(",");
        System.out.println(parts.length + " towns, first: " + parts[0]);
        System.out.println(String.join(" | ", parts));
        System.out.println("kenya".equalsIgnoreCase("KENYA"));
    }
}
```

Strings are **immutable**: methods return a new string; the original never changes.

### Building strings in loops: StringBuilder

Joining with `+` inside a big loop creates many temporary strings. Use `StringBuilder`:

```try-java
class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 5; i++) {
            sb.append("Row ").append(i).append("\n");
        }
        System.out.print(sb.toString());
        System.out.println(new StringBuilder("hassan").reverse());
    }
}
```

## Arrays: fixed size

```try-java
import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] marks = {78, 92, 45, 60, 88};
        String[] towns = new String[3];         // 3 empty slots (null)
        towns[0] = "Nyeri"; towns[1] = "Meru"; towns[2] = "Embu";

        System.out.println(marks.length + " marks, first " + marks[0] + ", last " + marks[marks.length - 1]);

        int total = 0, best = marks[0];
        for (int m : marks) {
            total += m;
            if (m > best) best = m;
        }
        System.out.printf("Average %.1f, best %d%n", (double) total / marks.length, best);

        Arrays.sort(marks);
        System.out.println(Arrays.toString(marks));
        System.out.println(Arrays.toString(towns));

        int[][] grid = {{1, 2, 3}, {4, 5, 6}};   // 2D array
        System.out.println(grid[1][2]);          // 6
    }
}
```

> Index out of range (`marks[5]` in a 5-item array) throws `ArrayIndexOutOfBoundsException`. Valid indexes are 0 to length − 1.

## ArrayList: a list that grows

```try-java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> cart = new ArrayList<>();
        cart.add("Unga");
        cart.add("Sugar");
        cart.add("Oil");
        cart.add(1, "Salt");                 // insert at position 1
        System.out.println(cart + " size " + cart.size());

        cart.remove("Sugar");
        System.out.println(cart.get(0) + ", contains Oil? " + cart.contains("Oil"));
        cart.set(0, "Unga 2kg");

        Collections.sort(cart);
        for (String item : cart) System.out.println("- " + item);

        List<Integer> prices = new ArrayList<>(List.of(180, 350, 60));  // Integer, not int
        int sum = 0;
        for (int p : prices) sum += p;
        System.out.println("Total: " + sum);
    }
}
```

| | Array | ArrayList |
|---|---|---|
| Size | Fixed when created | Grows and shrinks |
| Types | Primitives or objects (`int[]`) | Objects only (`ArrayList<Integer>`) |
| Length | `arr.length` | `list.size()` |
| Get / set | `arr[i]` | `list.get(i)`, `list.set(i, x)` |

Java automatically converts `int` ↔ `Integer` (**autoboxing**) so you rarely notice.

## Streams (a modern shortcut)

```try-java
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> marks = List.of(78, 92, 45, 60, 88);
        double avg = marks.stream().mapToInt(Integer::intValue).average().orElse(0);
        long passed = marks.stream().filter(m -> m >= 50).count();
        List<Integer> top = marks.stream().filter(m -> m >= 80).sorted().toList();
        System.out.printf("Average %.1f, passed %d, top %s%n", avg, passed, top);
    }
}
```

```quiz
Q: What is the index of the first item in a Java array?
A: 0 | zero
Q: How do you get the number of items in an array called marks?
A: marks.length
Q: How do you get the number of items in an ArrayList called cart?
A: cart.size() | size()
Q: Which class builds strings efficiently in a loop?
A: StringBuilder
Q: Which exception happens when you use an index that doesn't exist? (the name before Exception is enough)
A: ArrayIndexOutOfBoundsException | ArrayIndexOutOfBounds | IndexOutOfBoundsException
```
