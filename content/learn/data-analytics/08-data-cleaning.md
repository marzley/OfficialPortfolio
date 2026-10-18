---
slug: data-cleaning
title: "Data cleaning: duplicates, missing values, messy formats and a cleaning checklist"
after: ab-testing-hypothesis
---
# Data cleaning: duplicates, missing values, messy formats and a cleaning checklist

Analysts often say they spend most of their time cleaning data. Real data has typing errors, blanks, duplicates and the same thing written five ways. Cleaning is not glamorous, but it decides whether your answers are right.

## The most common problems

| Problem | Example |
|---|---|
| Duplicates | The same order entered twice |
| Missing values | A blank branch or amount |
| Inconsistent text | "Nairobi", "nairobi ", "NRB" |
| Wrong data types | Amounts stored as text ("KSh 1,200") |
| Mixed formats | Phone numbers as 0712..., +254712..., 712... |
| Mixed date formats | 03/04/2026: 3 April or 4 March? |
| Impossible values | Age 230, negative quantity |
| Extra spaces | " Kiambu" vs "Kiambu" |

## Clean a messy dataset (run it)

```try-python
raw = [
    {"id": "1", "county": " Nairobi", "phone": "0712 345 678", "amount": "KSh 1,200"},
    {"id": "2", "county": "nairobi", "phone": "+254712345679", "amount": "850"},
    {"id": "2", "county": "nairobi", "phone": "+254712345679", "amount": "850"},
    {"id": "3", "county": "KIAMBU", "phone": "712345680", "amount": ""},
    {"id": "4", "county": "Murang'a", "phone": "0722-000-111", "amount": "2,500"},
]

def clean_phone(p):
    digits = "".join(ch for ch in p if ch.isdigit())
    if digits.startswith("0"):
        digits = "254" + digits[1:]
    elif len(digits) == 9:
        digits = "254" + digits
    return digits

def clean_amount(a):
    digits = "".join(ch for ch in a if ch.isdigit() or ch == ".")
    return float(digits) if digits else None

seen, clean = set(), []
for row in raw:
    if row["id"] in seen:          # remove duplicates
        continue
    seen.add(row["id"])
    clean.append({
        "id": int(row["id"]),
        "county": row["county"].strip().capitalize(),
        "phone": clean_phone(row["phone"]),
        "amount": clean_amount(row["amount"]),
    })

for row in clean:
    print(row)

missing = [r["id"] for r in clean if r["amount"] is None]
print("Rows with a missing amount:", missing)
```

:::warning A classic trap: .title()
Python's `.title()` (and Excel's `PROPER`) capitalises after every apostrophe, so "murang'a" becomes "Murang'A". We used `.capitalize()` instead. For real projects, keep a lookup table of correct county and town names and map messy values to it.
:::

## What to do with missing values

| Option | When to use |
|---|---|
| **Find the real value** | Best choice: check receipts or the source system |
| **Leave it blank and exclude from that calculation** | Common; say how many rows were excluded |
| **Fill with a sensible value** (median, "Unknown") | Carefully, and only when it won't mislead |
| **Delete the row** | Only if the row is useless and few rows are affected |

Never quietly fill blanks with zero: a missing sale is not a sale of KSh 0.

## A cleaning checklist

1. **Keep the original** file untouched; work on a copy.
2. **Count rows** before and after each step.
3. **Remove exact duplicates** (and check near-duplicates).
4. **Trim spaces** and fix capitalisation.
5. **Standardise categories** (a lookup table: "NRB" → "Nairobi").
6. **Convert types:** numbers to numbers, dates to real dates.
7. **Handle missing values** with a clear rule.
8. **Check ranges:** no negative quantities or impossible ages.
9. **Document every step** so someone else can repeat it.

## Cleaning in Excel

| Task | Excel tool |
|---|---|
| Remove duplicates | Data > Remove Duplicates |
| Trim spaces | `=TRIM(A2)` |
| Fix capitals | `=PROPER(A2)` or `=UPPER(A2)` |
| Split text | Data > Text to Columns |
| Find blanks | Filter, or `=COUNTBLANK(range)` |
| Repeatable cleaning | **Power Query** (Data > Get & Transform): records every step and reruns it on new data |

:::tip Power Query is a superpower
If you clean the same monthly report every month, build the steps once in Power Query and click Refresh next month. The same tool is inside Power BI.
:::

:::think After cleaning, your total sales are KSh 40,000 lower than the finance team's figure. What do you check?
Compare row counts before and after cleaning, check whether you removed rows that weren't really duplicates, whether amounts stored as text became blank, whether a date filter cut off days, and whether finance includes refunds or tax differently. Reconcile until you can explain the difference.
:::

## Summary

- Real data has duplicates, blanks, inconsistent text, wrong types and mixed formats.
- Clean on a copy, count rows at each step and document what you did.
- Handle missing values deliberately; never treat blanks as zero.
- Use TRIM, Remove Duplicates and Power Query in Excel.

```quiz
Q: Should you fill missing sales amounts with zero? (yes or no)
A: no
Q: Which Excel function removes extra spaces? (one word)
A: trim
Q: Which Excel tool records cleaning steps so you can refresh them? (two words)
A: power query | powerquery
```
