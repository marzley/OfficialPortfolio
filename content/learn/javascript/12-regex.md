---
slug: regular-expressions
title: "Regular expressions: validating phone numbers, emails, KRA PINs and searching text"
after: forms-validation
---
# Regular expressions: validating phone numbers, emails, KRA PINs and searching text

How do you check that a phone number looks like `0712 345 678`, find every M-Pesa transaction code in a pasted SMS, or replace all double spaces in a document? **Regular expressions** (regex) are patterns that describe text. They look cryptic at first, but a small set of symbols covers most everyday needs. This unit builds them up slowly with Kenyan examples you can run.

:::note What you will learn
- What regex is and where it's used
- Creating patterns in JavaScript: `/.../flags` and `RegExp`
- Literal characters, character classes, quantifiers and anchors
- Groups, alternation and capturing
- `test`, `match`, `matchAll`, `replace`, `split`
- Practical patterns: phone numbers, emails, KRA PINs, M-Pesa codes, passwords
- When not to use regex, and how to test patterns safely
:::

## What is a regular expression?

:::define Regular expression (regex)
A pattern that describes a set of text strings, used to **check** (does this text match?), **find** (where are the matches?) and **replace** text.
:::

Where regex is used: form validation, search-and-replace in code editors (VS Code supports regex search), data cleaning in Excel/Python, log analysis, routing URLs on servers, and extracting data from messages.

## Creating a regex in JavaScript

```try-javascript
const re = /unga/i;                       // literal syntax: /pattern/flags
const re2 = new RegExp("unga", "i");      // constructor (useful when the pattern is built from a variable)

console.log(re.test("Buy UNGA today"));   // true (i = case-insensitive)
console.log(re2.test("Buy sugar"));       // false
```

### Flags

| Flag | Meaning |
|---|---|
| `i` | Ignore case |
| `g` | Global: find **all** matches, not just the first |
| `m` | Multiline: `^` and `$` match at line starts/ends |
| `u` | Unicode mode (better with emojis and non-English text) |
| `s` | Dot `.` also matches new lines |

## The building blocks

### Character classes

| Pattern | Matches |
|---|---|
| `\d` | Any digit 0–9 |
| `\D` | Any non-digit |
| `\w` | Word character: letters, digits, underscore |
| `\s` | Whitespace (space, tab, new line) |
| `.` | Any character (except new line) |
| `[abc]` | One of a, b or c |
| `[a-z]` | Any lowercase letter |
| `[A-Z0-9]` | Uppercase letter or digit |
| `[^0-9]` | Anything **except** a digit |

### Quantifiers (how many)

| Pattern | Means |
|---|---|
| `a?` | 0 or 1 |
| `a*` | 0 or more |
| `a+` | 1 or more |
| `a{3}` | Exactly 3 |
| `a{2,4}` | 2 to 4 |
| `a{2,}` | 2 or more |

### Anchors

| Pattern | Means |
|---|---|
| `^` | Start of the string |
| `$` | End of the string |
| `\b` | Word boundary |

**Anchors matter for validation.** `/\d{10}/` finds 10 digits *anywhere* (so "abc0712345678xyz" passes); `/^\d{10}$/` requires the **whole** string to be exactly 10 digits.

```try-javascript
console.log(/\d{10}/.test("call 0712345678 now"));    // true: found inside
console.log(/^\d{10}$/.test("call 0712345678 now"));  // false: whole string must be digits
console.log(/^\d{10}$/.test("0712345678"));           // true
```

### Escaping special characters

These have special meanings: `. * + ? ^ $ { } ( ) [ ] | \ /`. To match them literally, add a backslash: `\.` matches a real dot, `\+` a real plus sign.

## Groups and alternation

- `(abc)` groups and **captures** the matched text.
- `(?:abc)` groups without capturing.
- `a|b` means a **or** b.
- `(?<name>...)` is a named capture group.

```try-javascript
const re = /^(?:\+?254|0)([17]\d{8})$/;       // Kenyan mobile: 07.., 01.., 2547.., +2547..
for (const raw of ["0712345678", "+254712345678", "254112345678", "0812345678", "071234567"]) {
  const m = raw.match(re);
  console.log(raw.padEnd(14), m ? "valid → 254" + m[1] : "invalid");
}
```

The capture group `([17]\d{8})` grabs the part after the prefix, so we can normalise every format to `2547XXXXXXXX` (the format M-Pesa's API expects).

## Regex methods

| Method | Use |
|---|---|
| `regex.test(text)` | `true`/`false`: validation |
| `text.match(regex)` | First match with groups (or all matches with `g`) |
| `text.matchAll(regex)` | Iterate over all matches with their groups (needs `g`) |
| `text.replace(regex, replacement)` | Replace matches (`g` for all) |
| `text.split(regex)` | Split on a pattern |
| `text.search(regex)` | Index of the first match |

```try-javascript
const sms = "SJ12ABC3DE Confirmed. Ksh1,500.00 sent to JUMA SHOP. TQ45XYZ9KL Confirmed. Ksh250.00 paid to KPLC.";

// Find all M-Pesa-style transaction codes (10 uppercase letters/digits) with their amounts
const re = /\b([A-Z0-9]{10})\b Confirmed\. Ksh([\d,]+\.\d{2})/g;
for (const m of sms.matchAll(re)) {
  console.log("Code:", m[1], "Amount:", Number(m[2].replace(/,/g, "")));
}

// Replace: tidy extra spaces
console.log("Too    many     spaces".replace(/\s+/g, " "));

// Split on commas or semicolons with optional spaces
console.log("Nairobi, Mombasa;Kisumu ;  Nakuru".split(/\s*[,;]\s*/));

// Replace with groups: reformat 0712345678 as 0712 345 678
console.log("0712345678".replace(/^(\d{4})(\d{3})(\d{3})$/, "$1 $2 $3"));
```

## Practical validation patterns

```try-javascript
const patterns = {
  kenyanMobile: /^(?:\+?254|0)[17]\d{8}$/,
  // Simple email check (good enough for forms; real verification = send an email)
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  // KRA PIN format: a letter, 9 digits, a letter (e.g. A012345678Z)
  kraPin: /^[A-Z]\d{9}[A-Z]$/i,
  // Kenyan number plate (common format, e.g. KDA 123B)
  numberPlate: /^K[A-Z]{2}\s?\d{3}[A-Z]$/i,
  // Strong password: 8+ chars with lower, upper and a digit
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  // Postal code: 5 digits
  postalCode: /^\d{5}$/,
};

const samples = {
  kenyanMobile: ["0712345678", "07123", "+254712345678"],
  email: ["wanjiku@gmail.com", "wanjiku@gmail", "a b@x.co"],
  kraPin: ["A012345678Z", "A12345Z"],
  numberPlate: ["KDA 123B", "KDA123B", "ABC 123"],
  password: ["Mombasa2026", "password", "Short1"],
  postalCode: ["00100", "100"],
};

for (const [name, re] of Object.entries(patterns)) {
  console.log(name + ":", samples[name].map((s) => `${s} ${re.test(s) ? "✓" : "✗"}`).join(" | "));
}
```

(`(?=...)` is a **lookahead**: "somewhere ahead there must be...", used in the password pattern to require each character type.)

:::think The email regex accepts "test@test.co". Does that prove the email address exists?
No. Regex only checks the **format**. Whether the address exists and belongs to the user can only be confirmed by sending a verification email (or code). Use regex for quick format checks, then verify properly, and always validate again on the server.
:::

## Regex in HTML forms

The `pattern` attribute uses regex for built-in validation (the whole value must match; no slashes or flags):

```try-html
<form>
  <label>M-Pesa number
    <input name="phone" required pattern="(\+?254|0)[17][0-9]{8}" title="Format: 07XXXXXXXX or 2547XXXXXXXX" placeholder="0712345678">
  </label>
  <button>Pay</button>
</form>
```

## When not to use regex

- **Parsing HTML or complex nested formats:** use a proper parser (`DOMParser`, JSON).
- **Very complex rules:** a few lines of normal code with clear names is often more readable than one giant pattern.
- **Untrusted, user-supplied patterns:** some badly written patterns can take extremely long on certain inputs ("catastrophic backtracking", a possible denial-of-service). Keep patterns simple and avoid nested quantifiers like `(a+)+`.

## Testing and learning tools

- **regex101.com:** explains each part of a pattern, shows matches live, and has a JavaScript mode.
- **VS Code search** with the `.*` button enabled lets you practise find-and-replace with regex on real files.
- Write small tests with good and bad examples, like the samples above.

## Common mistakes

| Mistake | Fix |
|---|---|
| No anchors in validation | `^...$` to match the whole string |
| Forgetting to escape `.` | `\.` for a literal dot |
| Forgetting `g` when replacing all | `/x/g` |
| Overly strict email patterns rejecting valid emails | Keep it simple; verify by sending |
| Validating only in the browser | Validate again on the server |
| Unreadable mega-patterns | Split into steps or add comments in code |

## Practice tasks

1. Write a regex for a 4-digit M-Pesa PIN (don't actually collect PINs in real apps!) and test it.
2. Normalise a list of phone numbers in different formats to `2547XXXXXXXX`.
3. Extract all amounts (like `Ksh1,500.00`) from a pasted SMS and total them.
4. Write a pattern that checks a student admission number like `ADM/2026/0457`.
5. Use regex101 to explain each part of the Kenyan mobile pattern.

## Summary

- Regex patterns describe text; create with `/pattern/flags` or `new RegExp`.
- Building blocks: character classes (`\d`, `\w`, `\s`, `[...]`), quantifiers (`?`, `*`, `+`, `{n,m}`), anchors (`^`, `$`, `\b`), groups and `|`.
- Methods: `test`, `match`, `matchAll`, `replace`, `split`.
- Use anchors for validation; escape special characters; keep patterns simple; validate on the server too.

```quiz
Q: Which regex symbol matches any digit?
A: \d
Q: Which flag makes a regex ignore upper/lower case?
A: i
Q: Which flag finds all matches instead of just the first?
A: g
Q: Which anchor means "start of the string"?
A: ^
Q: What does a{3} mean? (two words)
A: exactly 3 | exactly three
Q: Which method returns true or false for a match?
A: test | test()
Q: How do you match a literal dot in regex?
A: \. | backslash dot
```
=== exercise ===
Use a regex with `test` to check whether `phone` is a valid Kenyan mobile number like `0712345678` (starts with 0, then 7 or 1, then 8 digits). Print the result: it should be **true**.
=== starter ===
const phone = "0712345678";
=== expected ===
true
=== must_contain ===
test
