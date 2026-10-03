---
slug: strings-in-depth
title: Strings in depth: slicing, methods and f-strings
after: operators-booleans
---
# Strings in depth: slicing, methods and f-strings

Text is everywhere: names, phone numbers, SMS messages, receipts. Python has excellent tools for it.

## Indexing and slicing

Each character has a position (index), starting at **0**. Negative indexes count from the end.

```
 K  e  n  y  a
 0  1  2  3  4
-5 -4 -3 -2 -1
```

```try-python
word = "Kenya"
print(word[0], word[-1])      # K a
print(word[1:4])              # "eny"  (from 1 up to, not including, 4)
print(word[:3], word[2:])     # "Ken" "nya"
print(word[::-1])             # "ayneK" reversed
print(len(word))              # 5

phone = "0712345678"
print("Last 4 digits:", phone[-4:])
print("Masked:", phone[:4] + "***" + phone[-3:])
```

Strings are **immutable**: `word[0] = "k"` is an error. Methods return a *new* string instead.

## Everyday string methods

```try-python
raw = "  mama NJERI's bakery  "
print(raw.strip())                 # remove spaces at both ends
print(raw.strip().title())         # "Mama Njeri'S Bakery" (title case)
print(raw.upper(), raw.lower())
print("0712 345 678".replace(" ", ""))
print("nairobi,mombasa,kisumu".split(","))
print(" - ".join(["Nyeri", "Meru", "Embu"]))
print("Nairobi".startswith("Nai"), "photo.jpg".endswith(".jpg"))
print("banana".count("a"), "banana".find("n"), "banana".find("x"))
print("2026".isdigit(), "abc".isalpha(), "   ".isspace())
print("7".zfill(3), "Hi".center(10, "*"))
```

| Method | Does |
|---|---|
| `strip()`, `lstrip()`, `rstrip()` | Remove spaces (or given characters) |
| `upper()`, `lower()`, `title()`, `capitalize()` | Change case |
| `replace(old, new)` | Swap text |
| `split(sep)` | String → list |
| `sep.join(list)` | List → string |
| `find(x)` | Position, or -1 if missing |
| `startswith()`, `endswith()` | Checks |
| `isdigit()`, `isalpha()` | What kind of characters |

## f-strings: the best way to build text

```try-python
name = "Achieng"
amount = 12500.5
items = 3

print(f"Hello {name}!")
print(f"{items} items cost KSh {amount:,.2f}")     # 12,500.50
print(f"{'Item':<10}{'Price':>10}")                 # align left / right
print(f"{'Sugar':<10}{160:>10}")
print(f"{'Oil':<10}{350:>10}")
print(f"Paid: {0.875:.0%}")                         # 88%
print(f"{name=}")                                   # shows name='Achieng' (debugging)
print(f"Next year you'll pay {amount * 1.1:,.0f}")  # maths inside
```

Format codes after the `:`:

| Code | Meaning | Example output |
|---|---|---|
| `,` | Thousands separator | `12,500` |
| `.2f` | 2 decimal places | `12500.50` |
| `.0%` | Percentage | `88%` |
| `<10` / `>10` / `^10` | Left / right / centre in 10 spaces | |
| `05d` | Pad with zeros to 5 digits | `00042` |

## Escape characters and raw strings

```try-python
print("Line one\nLine two")      # \n new line
print("Name:\tAmina")            # \t tab
print("She said \"karibu\"")     # \" a quote inside quotes
print('It\'s fine')
print(r"C:\new\folder")          # raw string: backslashes stay as they are

message = """This is a
multi-line string,
great for SMS templates."""
print(message)
```

## Looping over text

```try-python
sms = "Your M-Pesa balance is Ksh1,250.00"
digits = ""
for ch in sms:
    if ch.isdigit():
        digits += ch
print(digits)                    # 125000

vowels = sum(1 for ch in "Harambee" if ch.lower() in "aeiou")
print("Vowels:", vowels)
```

## Mini project: clean and validate a phone number

```try-python
def clean_phone(text):
    digits = "".join(ch for ch in text if ch.isdigit())
    if digits.startswith("254") and len(digits) == 12:
        digits = "0" + digits[3:]
    if len(digits) == 10 and digits[:2] in ("07", "01"):
        return digits
    return None

for p in ["0712 345 678", "+254 712-345-678", "12345", "0110 123 456"]:
    print(f"{p:<20} -> {clean_phone(p)}")
```

## Strings are immutable

You can't change a character inside a string; you create a new string instead:

```try-python
town = "nairobi"
# town[0] = "N"          # TypeError: 'str' object does not support item assignment
town = "N" + town[1:]     # build a new string
print(town)
print("nairobi".capitalize(), "NAIROBI".lower(), "nairobi city".title())
```

## Searching and checking text

```try-python
message = "Confirmed. KSh1,500.00 sent to JOHN KAMAU 0712345678 on 15/9/26"
print("sent" in message)                         # membership
print(message.find("KSh"), message.find("USD"))  # index, or -1 if missing
print(message.count("0"))
print(message.startswith("Confirmed"), message.endswith("26"))
print("0712345678".isdigit(), "Kamau".isalpha(), "ADM001".isalnum())
```

## Extracting data from text

Combine `split`, `find` and slicing to pull out values, a common real-world task (reading SMS confirmations, CSV lines, log files):

```try-python
message = "Confirmed. KSh1,500.00 sent to JOHN KAMAU 0712345678 on 15/9/26"
start = message.find("KSh") + 3
end = message.find(" ", start)
amount = float(message[start:end].replace(",", ""))
phone = [word for word in message.split() if word.isdigit() and len(word) == 10][0]
print("Amount:", amount, "Phone:", phone)
```

For more complex patterns, Python's `re` module (regular expressions) helps:

```try-python
import re
message = "Confirmed. KSh1,500.00 sent to JOHN KAMAU 0712345678 on 15/9/26"
match = re.search(r"KSh([\d,]+\.\d{2})", message)
print(match.group(1) if match else "no amount")
print(re.findall(r"\b0\d{9}\b", "Call 0712345678 or 0722000111"))
```

## Joining and formatting tables

```try-python
items = [("Unga 2kg", 195), ("Sugar 1kg", 180), ("Cooking oil 1L", 380)]
print(f"{'Item':<16}{'Price':>8}")
print("-" * 24)
for name, price in items:
    print(f"{name:<16}{price:>8,.2f}")
print("-" * 24)
print(f"{'Total':<16}{sum(p for _, p in items):>8,.2f}")
print(", ".join(name for name, _ in items))
```

| Format spec | Meaning |
|---|---|
| `:<16` / `:>8` / `:^10` | Left / right / centre align in a width |
| `:,` | Thousands separators |
| `:.2f` | 2 decimal places |
| `:05d` | Zero-pad to width 5 |
| `:.1%` | Percentage with 1 decimal |

## Common mistakes

| Mistake | Fix |
|---|---|
| Joining text and numbers with `+` (`"Age " + 21`) | `f"Age {21}"` or `"Age " + str(21)` |
| Forgetting methods return new strings (`name.upper()` alone does nothing) | `name = name.upper()` |
| Off-by-one slices (`s[0:3]` gives 3 characters, indexes 0–2) | Remember the end index is excluded |
| Comparing case-sensitive text (`"Yes" == "yes"` is False) | Compare `.lower()` versions |
| Using backslashes in Windows paths (`"C:\new"` contains a newline) | Raw strings `r"C:\new"` or forward slashes |

## Practice

1. From `"KCSE-2025-ADM0042"`, extract the year and the admission number.
2. Write `initials("Wanjiku Mary Kamau")` returning `"W.M.K."`.
3. Check if a word is a palindrome, ignoring case and spaces ("Never odd or even").
4. Print a receipt table of 4 items with aligned columns and a total.

:::think You have `name = "  amina HASSAN "`. Write one expression that produces "Amina Hassan".
`name.strip().title()`: `strip()` removes the spaces at both ends, and `title()` capitalises each word.
:::

```quiz
Q: What is "Nairobi"[0]?
A: N
Q: What is "Nairobi"[-1]?
A: i
Q: What does "Kenya"[1:3] give?
A: en
Q: Which method turns "a,b,c" into a list?
A: split | split() | split(",")
Q: How do you show 2 decimal places in an f-string? Write the format code after the colon.
A: .2f
Q: Can you change one character of a Python string in place? (yes/no)
A: no
Q: What does "nairobi".find("x") return when not found?
A: -1
Q: Which module provides regular expressions?
A: re
```
=== exercise ===
Given `phone = "0712345678"`, print the masked number **0712***678** using slicing.
=== starter ===
phone = "0712345678"
# print the first 4 digits, then ***, then the last 3
=== expected ===
0712***678
=== must_contain ===
phone[
