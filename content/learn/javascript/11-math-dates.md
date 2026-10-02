---
slug: math-dates-numbers
title: "Numbers, Math and dates: money, rounding, random numbers and time"
after: strings-numbers-operators
---
# Numbers, Math and dates: money, rounding, random numbers and time

Almost every real app calculates: cart totals with VAT, loan interest, exam averages, discounts, random OTP codes, countdowns, "posted 3 hours ago", and due dates. JavaScript's numbers, the `Math` object and `Date` (plus the newer `Intl` formatting tools) handle all of this, but each has traps: floating-point errors with money, months that start at 0, and time zones. This unit teaches the right way.

:::note What you will learn
- Number types, `NaN`, `Infinity` and converting strings to numbers
- Floating-point problems and how to handle money safely
- Rounding: `Math.round`, `floor`, `ceil`, `toFixed`
- `Math` functions: `max`, `min`, `abs`, `pow`, `sqrt`, `random`
- Random numbers and why `Math.random` isn't for security
- Formatting numbers and currency with `Intl.NumberFormat` and `toLocaleString`
- Dates: creating, reading, adding days, differences, formatting and time zones
:::

## Numbers in JavaScript

JavaScript has one main number type (64-bit floating point) for integers and decimals: `42`, `3.14`, `-7`. (There's also `BigInt` for huge integers, rarely needed.)

```try-javascript
console.log(typeof 42, typeof 3.5);    // number number
console.log(10 / 3);                   // 3.3333333333333335
console.log(1 / 0);                    // Infinity
console.log("abc" * 2);                // NaN (Not a Number)
console.log(Number.isNaN("abc" * 2));  // true
console.log(Number.MAX_SAFE_INTEGER);  // 9007199254740991
```

### Converting strings to numbers

Form inputs and URL parameters are **strings**. Convert them before calculating:

```try-javascript
console.log("100" + 50);               // "10050" (string joining!)
console.log(Number("100") + 50);       // 150
console.log(parseInt("250 bob", 10));  // 250 (reads digits at the start)
console.log(parseFloat("3.75kg"));     // 3.75
console.log(Number(""));               // 0 (careful: empty becomes 0)
console.log(Number("12a"));            // NaN
console.log(+"42");                    // 42 (unary plus)

function readAmount(text) {
  const n = Number(String(text).replace(/,/g, ""));   // allow "1,500"
  return Number.isFinite(n) ? n : null;
}
console.log(readAmount("1,500"), readAmount("abc"));
```

## Floating-point and money

Computers store decimals in binary, so some decimals can't be represented exactly:

```try-javascript
console.log(0.1 + 0.2);                // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);        // false!
```

For money this matters. Safe approaches:

1. **Work in whole units.** KSh amounts are usually whole shillings; for cents, store **cents as integers** (KSh 199.50 → 19950).
2. **Round at the end** for display.
3. For complex financial systems, use decimal libraries.

```try-javascript
// Prices in cents (integers): exact maths
const items = [{ price: 19950, qty: 2 }, { price: 4999, qty: 3 }];   // KSh 199.50, KSh 49.99
const totalCents = items.reduce((s, i) => s + i.price * i.qty, 0);
console.log("Total:", (totalCents / 100).toFixed(2));                // "548.97"

// VAT included in a price (Kenya 16%): VAT part = price × 16 / 116
const price = 1160;
const vat = Math.round(price * 16 / 116);
console.log(`Price ${price} includes VAT of ${vat} (net ${price - vat})`);
```

## Rounding

```try-javascript
console.log(Math.round(4.5));      // 5   nearest integer (.5 rounds up)
console.log(Math.round(-4.5));     // -4  (rounds towards +infinity at .5)
console.log(Math.floor(4.9));      // 4   down
console.log(Math.ceil(4.1));       // 5   up
console.log(Math.trunc(-4.9));     // -4  remove decimals
console.log((3.14159).toFixed(2)); // "3.14" (a string)
console.log(Number((2.345).toFixed(2)));   // 2.35 or 2.34? floating point can surprise: test!

// Round to 2 decimals as a number
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
console.log(round2(1.005), round2(2.675));
```

Use `ceil` for "how many buses for 130 people at 33 seats each" (you can't hire a partial bus): `Math.ceil(130 / 33)` = 4.

## The `Math` object

```try-javascript
const sales = [3400, 12000, 7800, 15200];
console.log(Math.max(...sales), Math.min(...sales));   // 15200 3400
console.log(Math.abs(-250));       // 250
console.log(Math.pow(2, 10), 2 ** 10);   // 1024 1024
console.log(Math.sqrt(144));       // 12
console.log(Math.PI.toFixed(4));   // 3.1416

// Compound interest: amount = P × (1 + r)^n
const P = 50000, r = 0.12 / 12, n = 12;   // 12% a year, monthly, 1 year
console.log("After 1 year:", Math.round(P * (1 + r) ** n));
```

## Random numbers

`Math.random()` gives a decimal from 0 (inclusive) up to 1 (exclusive):

```try-javascript
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

console.log(randomInt(1, 6));                     // dice roll
const towns = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];
console.log(towns[randomInt(0, towns.length - 1)]);   // random pick

// Shuffle (Fisher–Yates) for quiz questions
const qs = [1, 2, 3, 4, 5];
for (let i = qs.length - 1; i > 0; i--) {
  const j = randomInt(0, i);
  [qs[i], qs[j]] = [qs[j], qs[i]];
}
console.log(qs);
```

:::warning Not for security
`Math.random()` is predictable enough that it must **not** be used for OTP codes, passwords, tokens or anything security-related. Use `crypto.getRandomValues()` in browsers (or `crypto.randomInt` in Node.js), and generate OTPs on the **server**.
:::

```try-javascript
const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const code = String(buf[0] % 1000000).padStart(6, "0");
console.log("Demo 6-digit code:", code);   // in real apps, generate on the server
```

## Formatting numbers and currency

```try-javascript
const n = 1234567.891;
console.log(n.toLocaleString("en-KE"));                               // "1,234,567.891"
console.log(n.toLocaleString("en-KE", { maximumFractionDigits: 0 })); // "1,234,568"

const ksh = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" });
console.log(ksh.format(2500));             // e.g. "Ksh 2,500.00" (format depends on the browser/runtime data)

const compact = new Intl.NumberFormat("en", { notation: "compact" });
console.log(compact.format(1500000));      // "1.5M"

const pct = new Intl.NumberFormat("en", { style: "percent", maximumFractionDigits: 1 });
console.log(pct.format(0.163));            // "16.3%"
```

Many Kenyan sites prefer to write `"KSh " + amount.toLocaleString("en-KE")` for a consistent look.

## Dates and times

### Creating dates

```try-javascript
const now = new Date();                                  // current date and time
const d1 = new Date("2026-10-02");                       // ISO date (treated as UTC midnight)
const d2 = new Date(2026, 9, 2, 14, 30);                 // year, MONTH (0-11!), day, hour, minute: local time
console.log(d2.getFullYear(), d2.getMonth(), d2.getDate()); // 2026 9 2  (9 = October)
console.log(d2.getDay());                                // day of week: 0 = Sunday
console.log(typeof now.getTime(), now.getTime() > 0);    // milliseconds since 1 Jan 1970 (UTC)
```

:::warning Months start at 0
In `new Date(year, month, day)` and `getMonth()`, **January is 0 and December is 11**. This catches everyone at least once. Days of the month start at 1; `getDay()` (weekday) starts at 0 for Sunday.
:::

### Adding days and calculating differences

```try-javascript
const start = new Date(2026, 9, 2);           // 2 Oct 2026
const due = new Date(start);
due.setDate(due.getDate() + 30);              // add 30 days (month rollover handled)
console.log(due.toDateString());              // Sun Nov 01 2026

const DAY = 24 * 60 * 60 * 1000;
const exam = new Date(2026, 10, 3);           // 3 Nov 2026
const daysLeft = Math.ceil((exam - start) / DAY);
console.log(daysLeft, "days until the exam");

// Age from date of birth
function age(dob, today = new Date(2026, 9, 2)) {
  let a = today.getFullYear() - dob.getFullYear();
  const beforeBirthday = today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());
  return beforeBirthday ? a - 1 : a;
}
console.log(age(new Date(2005, 11, 15)));     // 20
```

### Formatting dates

```try-javascript
const d = new Date(Date.UTC(2026, 9, 2, 11, 30));   // 11:30 UTC = 14:30 in Nairobi (UTC+3)
const fmt = new Intl.DateTimeFormat("en-KE", { dateStyle: "full", timeStyle: "short", timeZone: "Africa/Nairobi" });
console.log(fmt.format(d));
console.log(d.toISOString());                        // "2026-10-02T11:30:00.000Z": for APIs and databases
console.log(d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" }));

// "Time ago"
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
console.log(rtf.format(-3, "hour"), "|", rtf.format(1, "day"));
```

### Time zones

- Kenya uses **East Africa Time (EAT), UTC+3**, with no daylight saving time.
- Computers store moments as UTC timestamps; display converts to the user's zone.
- **Store and send dates in ISO format with time zone** (`2026-10-02T14:30:00+03:00` or UTC with `Z`); never store "02/10/2026" text (is that 2 October or 10 February?).
- For heavy date work, libraries like **date-fns** or **Day.js** help, and the upcoming **Temporal** API improves dates in JavaScript.

## Countdown example

```try-javascript
function countdown(target, now) {
  let ms = Math.max(0, target - now);
  const d = Math.floor(ms / 86400000); ms %= 86400000;
  const h = Math.floor(ms / 3600000);  ms %= 3600000;
  const m = Math.floor(ms / 60000);
  return `${d} days ${h} hours ${m} minutes`;
}
console.log(countdown(new Date(2026, 11, 25, 0, 0), new Date(2026, 9, 2, 9, 15)), "until Christmas");
```

## Common mistakes

| Mistake | Fix |
|---|---|
| `"100" + 50` = "10050" | Convert with `Number()` first |
| Comparing decimals with `===` | Use integers (cents) or a tolerance |
| `toFixed` returns a string | Wrap in `Number()` if you need a number |
| `Math.random()` for OTPs/tokens | `crypto.getRandomValues()` / server-side |
| Months from 1 | `new Date(2026, 0, 15)` is 15 January |
| Storing local date strings | ISO strings with time zone |

## Practice tasks

1. Write `addVat(net)` and `vatFromGross(gross)` for 16% VAT, keeping whole shillings.
2. Calculate a monthly loan repayment using the amortisation formula `P × r / (1 − (1 + r)^−n)`.
3. Generate a random quiz order of 10 questions with Fisher–Yates.
4. Show "Due in X days" or "Overdue by X days" for an invoice date.
5. Format 1234567 as KSh currency and as "1.2M".

## Summary

- JavaScript numbers are floating point; convert strings with `Number`, `parseInt`, `parseFloat`; check `Number.isFinite`.
- Handle money in whole units or cents to avoid floating-point errors; round for display.
- `Math` gives rounding, max/min, powers, roots and `random` (never for security; use `crypto`).
- Format with `toLocaleString` and `Intl.NumberFormat`.
- Dates: months are 0–11; add days with `setDate`; differences in milliseconds; format with `Intl.DateTimeFormat`; Kenya is UTC+3; store ISO strings.

```quiz
Q: What does "5" + 5 give in JavaScript?
A: 55 | "55"
Q: What does 0.1 + 0.2 === 0.3 give?
A: false
Q: Which Math method always rounds down?
A: floor | Math.floor
Q: Which Math method always rounds up?
A: ceil | Math.ceil
Q: In new Date(2026, 0, 15), which month is it?
A: January
Q: Which function should generate secure random codes in browsers?
A: crypto.getRandomValues | getRandomValues
Q: What is Kenya's time zone offset from UTC? Write like +3.
A: +3 | UTC+3 | 3
Q: How many buses of 33 seats are needed for 130 people?
A: 4 | four
```
