---
slug: project-mpesa-calculator
title: "Project: a transaction charges calculator with tariff bands, validation and reports"
after: KEEP
---
# Project: a transaction charges calculator with tariff bands, validation and reports

Fintech and billing systems constantly look up fees from **tariff tables**: mobile money charges, bank fees, delivery prices by distance, electricity tariffs, parking fees. In this project you'll build a complete charges calculator in stages: a tariff lookup, validation, a "total deducted" report, comparing ways to split a transfer, loading tariffs from JSON, and tests. It practises lists, tuples, functions, loops, dictionaries, exceptions and files.

:::warning Example numbers only
The tariff bands in this project are **example numbers for practice**, not Safaricom's (or any provider's) current charges. Real tariffs change; always check the official, current tariff before using real values in an app.
:::

:::note What you will practise
- Representing a tariff table as data
- Looking up a band with a loop (and with `bisect`)
- Validating amounts and raising exceptions
- Formatting money and reports with f-strings
- Comparing options (one transfer vs two)
- Loading configuration from JSON
- Writing simple tests with `assert`
:::

## Step 1: The tariff as data

Each band has a **maximum amount** and a **fee**. Bands are sorted by maximum:

```try-python
BANDS = [          # (maximum amount, fee): EXAMPLE values for practice
    (100, 0),
    (500, 7),
    (1000, 13),
    (1500, 23),
    (2500, 33),
    (3500, 53),
    (5000, 57),
    (7500, 78),
    (10000, 90),
    (15000, 100),
    (20000, 105),
    (250000, 108),
]
MIN_AMOUNT, MAX_AMOUNT = 1, 250000

def fee_for(amount):
    """Return the fee for sending `amount` KSh, using the example BANDS."""
    if not isinstance(amount, int):
        raise TypeError("Amount must be a whole number of shillings")
    if amount < MIN_AMOUNT or amount > MAX_AMOUNT:
        raise ValueError(f"Amount must be between {MIN_AMOUNT:,} and {MAX_AMOUNT:,}")
    for maximum, fee in BANDS:
        if amount <= maximum:
            return fee

for amount in [50, 100, 101, 750, 2600, 12000, 70000]:
    print(f"Send KSh {amount:>7,} -> fee KSh {fee_for(amount)}")
```

Why store bands as **data** instead of a long chain of `if/elif`? When the tariff changes, you edit the table, not the logic. That's how real billing systems work (often with the table in a database).

## Step 2: Boundary testing

Bugs hide at the edges of bands (100 vs 101). Test them:

```try-python
BANDS = [(100, 0), (500, 7), (1000, 13), (1500, 23), (2500, 33), (3500, 53), (5000, 57), (7500, 78), (10000, 90), (15000, 100), (20000, 105), (250000, 108)]

def fee_for(amount):
    if amount < 1 or amount > 250000:
        raise ValueError("Amount out of range")
    for maximum, fee in BANDS:
        if amount <= maximum:
            return fee

assert fee_for(1) == 0
assert fee_for(100) == 0
assert fee_for(101) == 7
assert fee_for(500) == 7
assert fee_for(501) == 13
assert fee_for(250000) == 108
for bad in (0, -5, 250001):
    try:
        fee_for(bad)
        raise AssertionError(f"{bad} should have failed")
    except ValueError:
        pass
print("All boundary tests passed")
```

`assert condition` stops the program with an `AssertionError` if the condition is false: a simple way to test. (Professional projects use `pytest`.)

## Step 3: A transaction report

```try-python
BANDS = [(100, 0), (500, 7), (1000, 13), (1500, 23), (2500, 33), (3500, 53), (5000, 57), (7500, 78), (10000, 90), (15000, 100), (20000, 105), (250000, 108)]

def fee_for(amount):
    for maximum, fee in BANDS:
        if amount <= maximum:
            return fee
    raise ValueError("Amount out of range")

def report(transactions):
    print(f"{'#':<3}{'Recipient':<14}{'Amount':>10}{'Fee':>7}{'Total':>10}")
    print("-" * 44)
    totals = {"amount": 0, "fee": 0}
    for i, (name, amount) in enumerate(transactions, start=1):
        fee = fee_for(amount)
        totals["amount"] += amount
        totals["fee"] += fee
        print(f"{i:<3}{name:<14}{amount:>10,}{fee:>7,}{amount + fee:>10,}")
    print("-" * 44)
    grand = totals["amount"] + totals["fee"]
    print(f"{'TOTAL':<17}{totals['amount']:>10,}{totals['fee']:>7,}{grand:>10,}")
    print(f"Fees were {totals['fee'] / totals['amount']:.2%} of the money sent")

report([("Mum", 3000), ("Landlord", 15000), ("Chama", 2500), ("Juma", 450)])
```

## Step 4: Is splitting a transfer cheaper?

Should you send KSh 30,000 in one go or split it? Compare every split in steps of 500:

```try-python
BANDS = [(100, 0), (500, 7), (1000, 13), (1500, 23), (2500, 33), (3500, 53), (5000, 57), (7500, 78), (10000, 90), (15000, 100), (20000, 105), (250000, 108)]

def fee_for(amount):
    for maximum, fee in BANDS:
        if amount <= maximum:
            return fee
    raise ValueError("Amount out of range")

def best_split(total, step=500):
    best = (fee_for(total), total, 0)          # (total fees, part1, part2)
    for part1 in range(step, total, step):
        part2 = total - part1
        fees = fee_for(part1) + fee_for(part2)
        if fees < best[0]:
            best = (fees, part1, part2)
    return best

for total in [3000, 8000, 30000]:
    fees, a, b = best_split(total)
    if b == 0:
        print(f"KSh {total:,}: send in one transaction (fee KSh {fees})")
    else:
        print(f"KSh {total:,}: split {a:,} + {b:,} (fees KSh {fees}) vs one transfer (KSh {fee_for(total)})")
```

Run it: with these example bands, splitting is cheaper for some amounts (like KSh 3,000 and 8,000) but not for KSh 30,000, where one transfer in the top band costs least. Results depend entirely on the tariff, which is exactly why writing code to check beats guessing. (Some providers also limit how much you can send per transaction or per day, which affects real decisions.)

:::think Why does this program use a "best so far" variable while looping?
It's the classic way to find a minimum (or maximum) among many options: start with one option (sending everything at once), then compare every alternative and keep the cheapest found so far. At the end, "best so far" is the best overall.
:::

## Step 5: Faster lookup with `bisect`

With thousands of bands (e.g. a delivery price for every kilometre), looping each time is slow. `bisect` finds the band using **binary search**:

```try-python
from bisect import bisect_left

BANDS = [(100, 0), (500, 7), (1000, 13), (1500, 23), (2500, 33), (3500, 53), (5000, 57), (7500, 78), (10000, 90), (15000, 100), (20000, 105), (250000, 108)]
MAXIMA = [m for m, _ in BANDS]

def fee_fast(amount):
    i = bisect_left(MAXIMA, amount)          # first band whose maximum >= amount
    if amount < 1 or i == len(MAXIMA):
        raise ValueError("Amount out of range")
    return BANDS[i][1]

print([fee_fast(a) for a in (1, 100, 101, 2600, 250000)])
```

## Step 6: Loading the tariff from JSON

Store the tariff in a file so it can be updated without changing code:

```try-python
import json
from pathlib import Path

tariff = {
    "name": "Example send-money tariff (practice only)",
    "currency": "KES",
    "bands": [[100, 0], [500, 7], [1000, 13], [2500, 33], [5000, 57], [10000, 90], [250000, 108]],
}
Path("tariff.json").write_text(json.dumps(tariff, indent=2), encoding="utf-8")

def load_bands(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    bands = [tuple(b) for b in data["bands"]]
    if bands != sorted(bands):
        raise ValueError("Bands must be sorted by maximum amount")
    return data["name"], bands

name, bands = load_bands("tariff.json")
print(name)
print(bands[:3], "...")
```

## Step 7: Putting it together (interactive version for your computer)

```
def main():
    name, bands = load_bands("tariff.json")
    print(name)
    while True:
        text = input("Amount to send (or q to quit): ").strip().replace(",", "")
        if text.lower() == "q":
            break
        try:
            amount = int(text)
            fee = fee_for(amount)          # using the loaded bands
        except ValueError as e:
            print("Error:", e)
            continue
        print(f"Fee: KSh {fee}. Total deducted: KSh {amount + fee:,}")

if __name__ == "__main__":
    main()
```

## Extension challenges

1. Add **withdrawal** fees with a second tariff table, and calculate send + withdraw costs together.
2. Read a CSV of transactions and produce the report (Step 3) from it.
3. Make it a small **web app** with Flask (form → fee) or a command-line tool with `argparse`.
4. Build the same calculator in JavaScript for a website, using the same JSON file.
5. Add a monthly summary: total fees, most expensive transaction, average fee.

## Summary

- Represent tariffs as **data** (sorted bands), not long `if` chains.
- Validate inputs, raise clear exceptions, and test **boundaries** with `assert`.
- Format reports with f-string alignment and thousands separators.
- Use "best so far" loops to compare options; use `bisect` for fast lookups in large tables.
- Load configuration from JSON so updates don't need code changes.
- Always use official, current tariffs in real applications.

```quiz
Q: Why store the tariff bands as data instead of many if statements? (one word: easier to ...)
A: update | change | maintain
Q: Which statement stops the program if a condition is false (used for simple tests)?
A: assert
Q: Which module does binary search on a sorted list?
A: bisect
Q: Which amounts should you always test in band tables? (one word)
A: boundaries | boundary | edges | edge
Q: Which file format is used to store the tariff for easy updates?
A: JSON | json
```
