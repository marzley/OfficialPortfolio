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

## Where strings and collections are used

Almost every Java program processes text and lists: names and phone numbers from forms, CSV files from banks, product lists, student marks, transaction histories. Android apps display lists of items, and back-end systems filter, sort and group thousands of records. Mastering `String`, arrays, `ArrayList` and `HashMap` covers most day-to-day Java work.

## Strings are immutable

```try-java
class Main {
    public static void main(String[] args) {
        String town = "nairobi";
        town.toUpperCase();                  // creates a new String, which is thrown away
        System.out.println(town);            // still "nairobi"
        town = town.toUpperCase();           // keep the new String
        System.out.println(town);

        String a = "Kenya";
        String b = new String("Kenya");
        System.out.println(a == b);          // false: different objects
        System.out.println(a.equals(b));     // true: same text
        System.out.println("kenya".equalsIgnoreCase(a));
    }
}
```

## Parsing CSV-style text

```try-java
class Main {
    public static void main(String[] args) {
        String csv = "name,town,amount\nAmina,Mombasa,1200\nBrian,Nakuru,850\nChebet,Eldoret,2300";
        String[] lines = csv.split("\n");
        int total = 0;
        for (int i = 1; i < lines.length; i++) {          // skip the header
            String[] parts = lines[i].split(",");
            String name = parts[0].trim();
            int amount = Integer.parseInt(parts[2].trim());
            total += amount;
            System.out.printf("%-8s %-10s KSh %,6d%n", name, parts[1], amount);
        }
        System.out.printf("%-19s KSh %,6d%n", "TOTAL", total);
    }
}
```

Simple `split(",")` works for clean data; real CSV files with quoted commas need a CSV library (such as OpenCSV or Apache Commons CSV).

## StringBuilder for building text

```try-java
class Main {
    public static void main(String[] args) {
        String[] items = {"Unga", "Sugar", "Oil", "Salt"};
        int[] prices = {180, 210, 350, 40};

        StringBuilder receipt = new StringBuilder("RECEIPT\n");
        for (int i = 0; i < items.length; i++) {
            receipt.append(String.format("%-6s %5d%n", items[i], prices[i]));
        }
        receipt.append("-".repeat(12)).append('\n');
        System.out.print(receipt);
        System.out.println(new StringBuilder("racecar").reverse());
    }
}
```

Joining strings with `+` inside a loop creates many temporary objects; `StringBuilder` is much faster for large outputs.

## Arrays utilities and 2D arrays

```try-java
import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] marks = {67, 82, 45, 90, 58};
        int[] sorted = marks.clone();
        Arrays.sort(sorted);
        System.out.println(Arrays.toString(sorted));
        System.out.println("Index of 82 after sorting: " + Arrays.binarySearch(sorted, 82));
        System.out.println("Sum: " + Arrays.stream(marks).sum() + ", average: " + Arrays.stream(marks).average().orElse(0));

        // 2D array: rows = students, columns = subjects
        int[][] scores = {
            {78, 84, 90},
            {92, 71, 65},
            {55, 62, 70},
        };
        String[] students = {"Amina", "Brian", "Chebet"};
        for (int r = 0; r < scores.length; r++) {
            int total = 0;
            for (int c = 0; c < scores[r].length; c++) total += scores[r][c];
            System.out.println(students[r] + ": " + total);
        }
    }
}
```

## HashMap: key–value lookups

```try-java
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> stock = new HashMap<>();
        stock.put("unga", 40);
        stock.put("sugar", 25);
        stock.put("unga", stock.get("unga") - 5);             // update
        stock.merge("rice", 30, Integer::sum);                 // add new or combine
        stock.merge("sugar", 10, Integer::sum);
        System.out.println(stock.getOrDefault("salt", 0));     // 0: missing key

        String[] sales = {"Nakuru", "Thika", "Nakuru", "Eldoret", "Nakuru"};
        Map<String, Integer> counts = new TreeMap<>();         // TreeMap keeps keys sorted
        for (String town : sales) counts.merge(town, 1, Integer::sum);
        for (Map.Entry<String, Integer> e : counts.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
        System.out.println(new TreeMap<>(stock));
    }
}
```

| Collection | Use |
|---|---|
| `ArrayList<T>` | Ordered list that grows |
| `HashMap<K, V>` | Fast lookup by key (no order guarantee) |
| `TreeMap<K, V>` | Keys kept sorted |
| `LinkedHashMap<K, V>` | Keeps insertion order |
| `HashSet<T>` | Unique values, fast "contains" |

## Sorting objects with Comparator

```try-java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class Main {
    static class Student {
        final String name; final int form; final double mean;
        Student(String name, int form, double mean) { this.name = name; this.form = form; this.mean = mean; }
        public String toString() { return "Form " + form + " " + name + " (" + mean + ")"; }
    }

    public static void main(String[] args) {
        List<Student> list = new ArrayList<>(List.of(
            new Student("Wanjiru", 2, 71.5),
            new Student("Otieno", 1, 80.2),
            new Student("Akinyi", 2, 84.0),
            new Student("Baraka", 1, 80.2)
        ));
        list.sort(Comparator.comparingInt((Student s) -> s.form)
                .thenComparing(s -> s.mean, Comparator.reverseOrder())
                .thenComparing(s -> s.name));
        list.forEach(System.out::println);
    }
}
```

## Streams for data processing

```try-java
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

class Main {
    static class Sale {
        final String town; final String product; final int amount;
        Sale(String town, String product, int amount) { this.town = town; this.product = product; this.amount = amount; }
    }

    public static void main(String[] args) {
        List<Sale> sales = List.of(
            new Sale("Nakuru", "Unga", 1800), new Sale("Thika", "Sugar", 840),
            new Sale("Nakuru", "Oil", 1400), new Sale("Eldoret", "Unga", 900));

        int total = sales.stream().mapToInt(s -> s.amount).sum();
        Map<String, Integer> byTown = sales.stream()
            .collect(Collectors.groupingBy(s -> s.town, Collectors.summingInt(s -> s.amount)));
        List<String> bigSales = sales.stream()
            .filter(s -> s.amount > 1000)
            .map(s -> s.town + ":" + s.product)
            .collect(Collectors.toList());

        System.out.println("Total " + total);
        System.out.println("By town " + byTown);
        System.out.println("Over 1000 " + bigSales);
    }
}
```

## Common mistakes

| Mistake | Fix |
|---|---|
| `str1 == str2` for text | `str1.equals(str2)` |
| Changing a list while looping with for-each | Use an `Iterator` with `remove()`, or `removeIf` |
| `ArrayIndexOutOfBoundsException` | Loop with `i < array.length` |
| `map.get(key)` returns null and is unboxed to int | `getOrDefault(key, 0)` |
| Using `List.of(...)` then trying to add | `List.of` is immutable; wrap in `new ArrayList<>(...)` |

## Practice

1. Parse a CSV string of products and print the most expensive one.
2. Count how many times each word appears in a sentence with a `TreeMap`.
3. Sort a list of students by form, then by mean (highest first).
4. Use streams to get the names of products costing over KSh 500, sorted alphabetically.
5. Build a receipt with `StringBuilder` and aligned columns.

:::think Why does `list.forEach(x -> { if (x < 50) list.remove(x); })` throw a ConcurrentModificationException, and how do you remove items safely?
Changing a list's structure while iterating over it invalidates the iteration. Use `list.removeIf(x -> x < 50)`, an explicit `Iterator` and its `remove()` method, or build a new filtered list with streams.
:::

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
Q: Which Map method adds a new key or combines with the existing value?
A: merge
Q: Which Map implementation keeps keys sorted?
A: TreeMap
Q: Which list method removes all items matching a condition?
A: removeIf
Q: Are Java Strings mutable or immutable?
A: immutable
```
