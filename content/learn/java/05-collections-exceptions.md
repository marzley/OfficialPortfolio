---
slug: collections-exceptions
title: HashMap, collections and exception handling
after: inheritance-interfaces
---
# HashMap, collections and exception handling

Two things every real Java program needs: the right **collection** for the data, and **exception handling** so one bad input doesn't crash everything.

## The main collections

| Interface | Class | Use when |
|---|---|---|
| `List` | `ArrayList` | Ordered items, duplicates allowed, access by index |
| `Set` | `HashSet` | Unique items, fast "contains" |
| `Set` | `TreeSet` | Unique items kept sorted |
| `Map` | `HashMap` | Key → value look-ups |
| `Map` | `TreeMap` | Key → value, keys sorted |
| `Queue`/`Deque` | `ArrayDeque` | Queues and stacks |

## HashMap: key → value

```try-java
import java.util.HashMap;
import java.util.Map;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> stock = new HashMap<>();
        stock.put("Unga", 12);
        stock.put("Sugar", 0);
        stock.put("Oil", 7);
        stock.put("Unga", 15);                        // same key: replaces 12

        System.out.println(stock.get("Oil"));         // 7
        System.out.println(stock.get("Rice"));        // null (missing)
        System.out.println(stock.getOrDefault("Rice", 0));
        System.out.println(stock.containsKey("Sugar") + " " + stock.size());

        for (Map.Entry<String, Integer> e : stock.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }

        // Counting words
        Map<String, Integer> counts = new HashMap<>();
        for (String w : "haraka haraka haina baraka".split(" ")) {
            counts.merge(w, 1, Integer::sum);
        }
        System.out.println(counts);
    }
}
```

## Sets for uniqueness

```try-java
import java.util.*;

class Main {
    public static void main(String[] args) {
        List<String> visitors = List.of("Otieno", "Wanjiru", "Otieno", "Kiprop");
        Set<String> unique = new HashSet<>(visitors);
        Set<String> sorted = new TreeSet<>(visitors);
        System.out.println(unique.size() + " unique, sorted: " + sorted);
    }
}
```

## Exceptions: handling errors

When something goes wrong at runtime (bad input, missing file, network down), Java **throws an exception**. If nothing catches it, the program crashes with a stack trace.

```try-java
class Main {
    public static void main(String[] args) {
        String[] inputs = {"250", "abc", "0"};
        for (String input : inputs) {
            try {
                int qty = Integer.parseInt(input);
                int perItem = 1000 / qty;
                System.out.println(input + " -> " + perItem);
            } catch (NumberFormatException e) {
                System.out.println(input + " -> not a number");
            } catch (ArithmeticException e) {
                System.out.println(input + " -> can't divide by zero");
            } finally {
                System.out.println("  (checked " + input + ")");
            }
        }
    }
}
```

| Exception | Common cause |
|---|---|
| `NullPointerException` | Using a variable that is `null` |
| `NumberFormatException` | `Integer.parseInt("abc")` |
| `ArithmeticException` | Dividing an int by zero |
| `ArrayIndexOutOfBoundsException` | Index outside the array |
| `IOException` | File or network problems (a **checked** exception: you must handle or declare it) |

## Throwing your own exceptions

```try-java
class Main {
    static class InsufficientFundsException extends Exception {
        InsufficientFundsException(String msg) { super(msg); }
    }

    static double withdraw(double balance, double amount) throws InsufficientFundsException {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        if (amount > balance) throw new InsufficientFundsException("Balance is only KSh " + balance);
        return balance - amount;
    }

    public static void main(String[] args) {
        double[] tries = {300, 5000, -1};
        for (double amt : tries) {
            try {
                System.out.println("New balance: " + withdraw(1000, amt));
            } catch (InsufficientFundsException | IllegalArgumentException e) {
                System.out.println("Refused: " + e.getMessage());
            }
        }
    }
}
```

- **Checked** exceptions (extend `Exception`) must be caught or declared with `throws`.
- **Unchecked** exceptions (extend `RuntimeException`, like `IllegalArgumentException`) don't have to be declared: they usually mean a programming mistake.

## try-with-resources

Files, database connections and network streams must be closed. This form closes them automatically:

```java
try (BufferedReader reader = new BufferedReader(new FileReader("marks.csv"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.out.println("Could not read the file: " + e.getMessage());
}
```

## Good habits

- Catch **specific** exceptions, not just `Exception`.
- Never leave a catch block empty: at least log the problem.
- Validate input early and give users a clear message.
- Use exceptions for unexpected situations, not for normal control flow.

```quiz
Q: Which collection stores key-value pairs?
A: HashMap | Map
Q: What does map.get() return for a missing key?
A: null
Q: Which collection keeps only unique items?
A: Set | HashSet
Q: Which exception does Integer.parseInt("abc") throw?
A: NumberFormatException
Q: Which block always runs after try/catch?
A: finally
```
