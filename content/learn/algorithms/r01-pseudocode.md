---
slug: pseudocode-flowcharts
title: "Pseudocode and flowcharts: algorithms explained, sequence, selection, iteration, trace tables and turning plans into code"
after: KEEP
---
# Pseudocode and flowcharts: algorithms explained, sequence, selection, iteration, trace tables and turning plans into code

An **algorithm** is a precise, step-by-step set of instructions for solving a problem. You follow algorithms every day: a recipe for chapati, directions to a matatu stage, the steps to send money on M-Pesa. Computers need algorithms written so clearly that there is no guesswork. Before writing code, programmers often plan with **pseudocode** (structured plain-language steps) and **flowcharts** (diagrams). These are tested in KCSE Computer Studies, CBC, university courses and job interviews, and they make you a much better programmer in any language.

:::note What you will learn
- What an algorithm is and the properties of a good one
- The three building blocks: sequence, selection, iteration
- Writing pseudocode with common conventions
- Flowchart symbols and drawing flowcharts
- Inputs, processes and outputs (IPO)
- Trace tables for testing algorithms by hand
- Turning pseudocode into Python
- Worked examples: grades, M-Pesa charges, largest number, totals and averages
:::

## What makes a good algorithm?

| Property | Meaning |
|---|---|
| **Precise** | Each step is clear and unambiguous |
| **Finite** | It finishes after a limited number of steps |
| **Correct** | It gives the right output for all valid inputs |
| **Has inputs and outputs** | Takes data in, produces a result |
| **Efficient** | Doesn't waste time or memory (see Big O) |

## Input, process, output (IPO)

Before designing, identify:

| Inputs | Process | Outputs |
|---|---|---|
| Price and quantity | total = price × quantity; add VAT | Total to pay |
| Student marks | Calculate average; decide grade | Average and grade |

## The three building blocks

Every algorithm is built from:
1. **Sequence**: steps one after another.
2. **Selection**: decisions (IF... THEN... ELSE).
3. **Iteration**: repetition (loops: FOR, WHILE, REPEAT UNTIL).

## Pseudocode conventions

There's no single official standard, but common conventions are:

```
START
  INPUT price
  INPUT quantity
  total ← price * quantity
  IF total > 5000 THEN
      discount ← total * 0.05
  ELSE
      discount ← 0
  ENDIF
  OUTPUT total - discount
STOP
```

| Keyword | Meaning |
|---|---|
| `INPUT` / `READ` | Get data |
| `OUTPUT` / `PRINT` / `DISPLAY` | Show results |
| `←` or `=` or `SET` | Assign a value |
| `IF ... THEN ... ELSE ... ENDIF` | Selection |
| `CASE ... OF` | Multiple choices |
| `FOR i ← 1 TO 10 ... ENDFOR` | Counted loop |
| `WHILE condition DO ... ENDWHILE` | Loop while true (checked first) |
| `REPEAT ... UNTIL condition` | Loop at least once |

Indent the inside of IFs and loops so structure is clear.

## Flowchart symbols

| Symbol | Shape | Meaning |
|---|---|---|
| Terminator | Rounded rectangle (oval) | Start / Stop |
| Process | Rectangle | Calculation or action (`total = price × qty`) |
| Input/Output | Parallelogram | Read input or display output |
| Decision | Diamond | A yes/no question with two exits |
| Flow line | Arrow | Direction of flow |
| Connector | Small circle | Connects parts of a large flowchart |
| Predefined process | Rectangle with side bars | A subroutine/function |

A flowchart for Pass/Fail:

```
   ( Start )
       |
  / Input score /
       |
   < score >= 50 ? >
     yes /    \ no
  / Output Pass / / Output Fail /
        \       /
        ( Stop )
```

Draw neat flowcharts with free tools like draw.io (diagrams.net) or Lucidchart.

## Example 1: Grade calculator (selection)

Pseudocode:

```
INPUT mark
IF mark >= 80 THEN grade ← "A"
ELSE IF mark >= 65 THEN grade ← "B"
ELSE IF mark >= 50 THEN grade ← "C"
ELSE IF mark >= 40 THEN grade ← "D"
ELSE grade ← "E"
ENDIF
OUTPUT grade
```

Python:

```try-python
def grade(mark):
    if mark >= 80:
        return "A"
    elif mark >= 65:
        return "B"
    elif mark >= 50:
        return "C"
    elif mark >= 40:
        return "D"
    return "E"

for m in [91, 70, 55, 42, 18]:
    print(m, grade(m))
```

Notice the order matters: checking `>= 50` before `>= 80` would give a mark of 91 a C.

## Example 2: Totals and averages (iteration)

```
total ← 0
FOR i ← 1 TO 5
    INPUT mark
    total ← total + mark
ENDFOR
average ← total / 5
OUTPUT average
```

```try-python
marks = [67, 82, 45, 90, 58]    # instead of typing inputs
total = 0
for mark in marks:
    total = total + mark
average = total / len(marks)
print("Total:", total, "Average:", average)
```

## Example 3: Largest number

```
largest ← first number
FOR each remaining number n
    IF n > largest THEN largest ← n
ENDFOR
OUTPUT largest
```

```try-python
numbers = [34, 78, 12, 95, 60]
largest = numbers[0]
for n in numbers[1:]:
    if n > largest:
        largest = n
print("Largest:", largest)
```

## Example 4: A tiered charge (like transaction fees)

Many systems charge fees by bands. With made-up example bands:

```
INPUT amount
IF amount <= 100 THEN fee ← 0
ELSE IF amount <= 1000 THEN fee ← 15
ELSE IF amount <= 5000 THEN fee ← 30
ELSE fee ← 50
ENDIF
OUTPUT fee
```

```try-python
def fee(amount):
    # example bands for learning, not real M-Pesa tariffs
    if amount <= 100:
        return 0
    elif amount <= 1000:
        return 15
    elif amount <= 5000:
        return 30
    return 50

for a in [50, 100, 101, 2500, 20000]:
    print(f"KSh {a:>6}: fee KSh {fee(a)}")
```

Testing the **boundaries** (100, 101, 1000, 1001) is where most bugs hide.

## WHILE vs REPEAT UNTIL

- `WHILE` checks the condition **first** (may run zero times).
- `REPEAT ... UNTIL` runs **at least once** (useful for menus and input validation).

```
REPEAT
    INPUT pin
UNTIL pin is 4 digits
```

Python has no REPEAT UNTIL, so we use `while True` with `break`:

```try-python
attempts = ["12", "abcd", "4821"]     # simulated user inputs
i = 0
while True:
    pin = attempts[i]
    i += 1
    print("Entered:", pin)
    if len(pin) == 4 and pin.isdigit():
        break
print("Valid PIN entered after", i, "attempts")
```

## Trace tables

A **trace table** tests an algorithm by hand, recording variable values at each step. Trace the totals algorithm with marks 10, 20, 30:

| Step | mark | total | Output |
|---|---|---|---|
| Start | – | 0 | |
| 1 | 10 | 10 | |
| 2 | 20 | 30 | |
| 3 | 30 | 60 | |
| End | | | average = 20 |

Trace tables catch logic errors before you code, and exam questions often ask you to complete them.

## From plan to code

1. Understand the problem (IPO).
2. Write pseudocode or draw a flowchart.
3. Trace with sample data, including edge cases (0, negative, maximum, empty).
4. Translate line by line into Python (or any language).
5. Test with the same data and compare.

:::think Write pseudocode for: "Read the prices of items until the user enters 0, then output the total and the number of items."
```
total ← 0
count ← 0
INPUT price
WHILE price <> 0 DO
    total ← total + price
    count ← count + 1
    INPUT price
ENDWHILE
OUTPUT total, count
```
The 0 is a **sentinel value** that ends the loop and isn't counted.
:::

## Summary

- An algorithm is a precise, finite, correct set of steps with inputs and outputs.
- All algorithms combine sequence, selection (IF/CASE) and iteration (FOR, WHILE, REPEAT UNTIL).
- Pseudocode uses INPUT, OUTPUT, assignment, IF/ENDIF and loops with indentation; flowcharts use ovals, rectangles, parallelograms, diamonds and arrows.
- Trace tables test algorithms by hand, especially at boundaries.
- Plan with IPO and pseudocode, trace, then translate to code and test.

```quiz
Q: Which flowchart symbol is used for a decision?
A: diamond | a diamond
Q: Which flowchart symbol is used for input and output?
A: parallelogram
Q: Which loop always runs at least once: WHILE or REPEAT UNTIL?
A: REPEAT UNTIL | repeat
Q: What are the three basic building blocks of algorithms? (three words)
A: sequence selection iteration | sequence, selection, iteration
Q: What table tracks variable values step by step to test an algorithm? (two words)
A: trace table
Q: A special value like 0 that ends an input loop is called a what?
A: sentinel | sentinel value
```

=== exercise ===
Write code that prints **Pass** if `score` is 50 or more, otherwise **Fail**. Test it with `score = 72`.
=== starter ===
score = 72
=== expected ===
Pass
=== must_contain ===
if
