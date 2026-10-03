---
slug: strings-numbers-operators
title: Strings, numbers and operators
after: variables-types
---
# Strings, numbers and operators

Most programs are about text (names, messages, receipts) and numbers (prices, totals, dates). This lesson gives you the tools for both.

## Arithmetic operators

```try-javascript
const a = 17, b = 5;
console.log(a + b);   // 22 add
console.log(a - b);   // 12 subtract
console.log(a * b);   // 85 multiply
console.log(a / b);   // 3.4 divide
console.log(a % b);   // 2  remainder (modulo)
console.log(a ** 2);  // 289 power

let total = 100;
total += 50;   // same as total = total + 50
total *= 2;
total++;       // add 1
console.log(total); // 301
```

`%` (remainder) is surprisingly useful: `n % 2 === 0` tests for even numbers.

## Rounding and money

```try-javascript
const price = 1234.5678;
console.log(Math.round(price));      // 1235
console.log(Math.floor(price));      // 1234
console.log(Math.ceil(price));       // 1235
console.log(price.toFixed(2));       // "1234.57" (a string)
console.log((1500).toLocaleString("en-KE"));  // "1,500"
console.log(0.1 + 0.2);              // 0.30000000000000004 !
```

> Computers store decimals in binary, so `0.1 + 0.2` isn't exactly `0.3`. For money, work in **whole cents** (or whole shillings) and format at the end.

## Useful Math functions

```try-javascript
console.log(Math.max(3, 19, 7), Math.min(3, 19, 7));
console.log(Math.abs(-40));
console.log(Math.sqrt(144));
const dice = Math.floor(Math.random() * 6) + 1;   // random 1 to 6
console.log("Dice:", dice);
```

## Strings

```try-javascript
const first = "Grace", last = "Achieng";
const full = first + " " + last;                // joining (concatenation)
const greeting = `Habari ${first}! Your balance is KSh ${(2500).toLocaleString()}.`; // template literal
console.log(full);
console.log(greeting);
console.log(full.length);             // 13
console.log(full.toUpperCase());      // GRACE ACHIENG
console.log(full[0], full.at(-1));    // G g
```

Template literals use **backticks** and `${...}` to drop values into text. They can also span several lines.

## String methods you'll use every day

```try-javascript
const phone = "  0712 345 678 ";
console.log(phone.trim());                          // remove spaces at the ends
console.log(phone.replaceAll(" ", ""));             // "0712345678"
console.log("Nairobi".includes("robi"));            // true
console.log("Nairobi".startsWith("Nai"));           // true
console.log("Nairobi".indexOf("r"));                // 3
console.log("Nairobi".slice(0, 3));                 // "Nai"
console.log("a,b,c".split(","));                    // ["a","b","c"]
console.log(["x", "y"].join(" - "));                // "x - y"
console.log("7".padStart(3, "0"));                  // "007"
console.log("ha".repeat(3));                        // "hahaha"
```

## Comparison and logical operators

| Operator | Meaning |
|---|---|
| `===`, `!==` | Equal / not equal (strict) |
| `>`, `<`, `>=`, `<=` | Greater, less... |
| `&&` | AND: both must be true |
| `||` | OR: at least one true |
| `!` | NOT |
| `??` | Use a default if the value is `null` or `undefined` |

```try-javascript
const age = 20, hasId = true;
console.log(age >= 18 && hasId);        // true
console.log(age < 13 || age > 65);      // false
console.log(!hasId);                    // false

const nickname = null;
console.log(nickname ?? "Guest");       // "Guest"
const status = age >= 18 ? "adult" : "minor";   // ternary operator
console.log(status);
```

## Project: format an M-Pesa style message

```try-javascript
const amount = 1250;
const to = "JOYCE WAMBUI";
const balance = 8430.5;
const code = "SJ" + Math.random().toString(36).slice(2, 10).toUpperCase();
console.log(`${code} Confirmed. Ksh${amount.toFixed(2)} sent to ${to} on ${new Date().toLocaleDateString("en-KE")}. New M-PESA balance is Ksh${balance.toLocaleString("en-KE", { minimumFractionDigits: 2 })}.`);
```

## Where you'll use strings and numbers

Almost every screen shows formatted text and numbers: prices with commas, phone numbers in the right format, names capitalised, search boxes that ignore case, receipts with aligned columns, countdowns. Getting these right is what makes a site look professional and trustworthy.

## Formatting numbers for Kenya

`toLocaleString` and `Intl.NumberFormat` format numbers the way people expect:

```try-javascript
const amount = 1234567.891;
console.log(amount.toLocaleString("en-KE"));                       // 1,234,567.891
console.log(amount.toLocaleString("en-KE", { maximumFractionDigits: 2 }));
const ksh = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" });
console.log(ksh.format(2500));                                     // Ksh 2,500.00 (style depends on the runtime)
const compact = new Intl.NumberFormat("en", { notation: "compact" });
console.log(compact.format(1250000), compact.format(45300));       // 1.3M 45K
const pct = new Intl.NumberFormat("en", { style: "percent", maximumFractionDigits: 1 });
console.log(pct.format(0.1625));                                   // 16.3%
```

Create the formatter once and reuse it; it's faster than building a new one each time.

## Searching and comparing text

```try-javascript
const products = ["Unga Pembe 2kg", "Sugar Kabras 1kg", "Unga Jogoo 2kg", "Cooking Oil 1L"];
const query = "  UNGA ";
const q = query.trim().toLowerCase();
const matches = products.filter(p => p.toLowerCase().includes(q));
console.log(matches);

const names = ["Ouma", "akinyi", "Zawadi", "Émile", "brian"];
console.log([...names].sort());                                    // capital letters first: not what people expect
console.log([...names].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })));
```

`localeCompare` sorts the way a dictionary does, ignoring case and handling accented letters.

## Phone numbers: a real formatting task

```try-javascript
function normalisePhone(input) {
  const digits = String(input).replace(/\D/g, "");        // keep digits only
  if (/^0[17]\d{8}$/.test(digits)) return "254" + digits.slice(1);
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  if (/^[17]\d{8}$/.test(digits)) return "254" + digits;
  return null;
}
function displayPhone(p254) {
  return p254 ? `+${p254.slice(0, 3)} ${p254.slice(3, 6)} ${p254.slice(6, 9)} ${p254.slice(9)}` : "invalid";
}
for (const raw of ["0712 345 678", "+254 722-000-111", "712345678", "0112345678", "12345"]) {
  console.log(raw.padEnd(18), displayPhone(normalisePhone(raw)));
}
```

Payment APIs usually expect the `2547XXXXXXXX` format, while people type numbers many different ways, so normalising input is an everyday job.

## Masking sensitive data

```try-javascript
const phone = "254712345678";
const masked = phone.slice(0, 6) + "***" + phone.slice(-3);
console.log(masked);                                    // 254712***678

const card = "4111111111111111";
console.log("**** **** **** " + card.slice(-4));
```

Show only what's needed on receipts and screens; never log full card numbers or PINs.

## Aligned text receipts

```try-javascript
const items = [["Unga 2kg", 2, 180], ["Sugar 1kg", 1, 210], ["Milk 500ml", 3, 60]];
let total = 0;
console.log("ITEM".padEnd(14) + "QTY".padStart(4) + "AMOUNT".padStart(10));
for (const [name, qty, price] of items) {
  const line = qty * price;
  total += line;
  console.log(name.padEnd(14) + String(qty).padStart(4) + line.toLocaleString("en-KE").padStart(10));
}
console.log("-".repeat(28));
console.log("TOTAL".padEnd(18) + total.toLocaleString("en-KE").padStart(10));
```

## Increment, assignment and precedence

```try-javascript
let stock = 10;
stock -= 3;          // 7
stock *= 2;          // 14
stock++;             // 15
console.log(stock);

let a = 5;
console.log(a++, a); // 5 6  (post-increment returns the old value)
console.log(++a, a); // 7 7  (pre-increment returns the new value)

console.log(2 + 3 * 4, (2 + 3) * 4);   // 14 20
console.log(2 ** 3 ** 2);              // 512 (right to left: 3**2 first)
```

When in doubt, add brackets: they make your intention obvious to the next reader.

## Common mistakes

| Mistake | What happens | Fix |
|---|---|---|
| `"5" * "2"` vs `"5" + "2"` | 10 vs "52" | Convert explicitly with `Number()` |
| `str.replace("a", "b")` expecting all | Only the first is replaced | `replaceAll` or a regex with `/g` |
| Forgetting strings are immutable | `name.toUpperCase()` doesn't change `name` | `name = name.toUpperCase()` |
| `price.toFixed(2)` then sorting | Strings sort as text ("100" before "20") | Sort numbers, format at the end |
| Comparing with different case | `"Nairobi" === "nairobi"` is false | Compare lowercased values |

## Practice

1. Write `titleCase("jane wanjiru KAMAU")` → `"Jane Wanjiru Kamau"`.
2. Format `[1500, 250000, 12.5]` as KSh amounts with commas and 2 decimals.
3. Write `slugify("Web Design in Nakuru!")` → `"web-design-in-nakuru"`.
4. Count the vowels in a sentence.
5. Build a function that checks whether a password has at least 8 characters, a number and a capital letter.

:::think Why might `["100", "25", "3"].sort()` give `["100", "25", "3"]`, and how do you sort them as numbers?
The default `sort()` compares items as strings, character by character, so "1" comes before "2" and "3". Pass a compare function: `arr.sort((a, b) => Number(a) - Number(b))` gives `["3", "25", "100"]`.
:::

```quiz
Q: What is 17 % 5?
A: 2
Q: Which characters wrap a template literal?
A: backticks | backtick | `
Q: Which method removes spaces from both ends of a string?
A: trim | trim()
Q: What does "Kenya".length return?
A: 5
Q: Which operator gives a default value when something is null or undefined?
A: ?? | nullish coalescing
Q: Which method compares strings the way a dictionary sorts them?
A: localeCompare | localeCompare()
Q: Which built-in object formats numbers as currency?
A: Intl.NumberFormat | Intl
Q: Which method pads a string on the left to a fixed width?
A: padStart | padStart()
```
=== exercise ===
Use a **template literal** to log exactly: **Total: KSh 4500** where 4500 comes from the variables `price = 1500` and `qty = 3`.
=== starter ===
const price = 1500;
const qty = 3;
// log the total using `${...}`
=== expected ===
Total: KSh 4500
=== must_contain ===
${
