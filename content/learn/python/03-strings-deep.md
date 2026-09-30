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
