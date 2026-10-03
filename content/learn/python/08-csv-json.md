---
slug: csv-json-files
title: Working with CSV and JSON data
after: files-errors
---
# Working with CSV and JSON data

Most business data lives in **spreadsheets** (saved as CSV) or comes from **APIs** (as JSON). Python's built-in `csv` and `json` modules read and write both in a few lines.

## CSV: comma-separated values

A CSV file is a plain-text table. Excel and Google Sheets can open and save it.

```
name,town,amount
Amina,Mombasa,1200
Brian,Nakuru,850
Chebet,Eldoret,2300
```

## Writing a CSV file

```try-python
import csv

rows = [
    ["name", "town", "amount"],
    ["Amina", "Mombasa", 1200],
    ["Brian", "Nakuru", 850],
    ["Chebet", "Eldoret", 2300],
]
with open("sales.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print(open("sales.csv").read())
```

`with open(...)` closes the file automatically, even if something goes wrong. `newline=""` stops blank lines appearing on Windows.

## Reading a CSV as dictionaries

`DictReader` uses the first row as keys, so you can refer to columns by name:

```try-python
import csv

with open("sales.csv", "w", newline="") as f:
    f.write("name,town,amount\nAmina,Mombasa,1200\nBrian,Nakuru,850\nChebet,Eldoret,2300\n")

total = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        amount = int(row["amount"])      # CSV values are always text
        total += amount
        print(f"{row['name']:<8} {row['town']:<10} KSh {amount:>6,}")
print(f"{'TOTAL':<19} KSh {total:>6,}")
```

## Writing dictionaries to CSV

```try-python
import csv

students = [
    {"name": "Wanjiru", "maths": 78, "english": 84},
    {"name": "Otieno", "maths": 92, "english": 71},
]
for s in students:
    s["average"] = round((s["maths"] + s["english"]) / 2, 1)

with open("report.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["name", "maths", "english", "average"])
    w.writeheader()
    w.writerows(students)

print(open("report.csv").read())
```

## JSON: data from APIs and apps

JSON looks almost like Python dicts and lists:

| JSON | Python |
|---|---|
| `{"a": 1}` object | `dict` |
| `[1, 2]` array | `list` |
| `"text"` | `str` |
| `12`, `3.5` | `int`, `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

```try-python
import json

text = '{"TransID": "SJK4H2L9XA", "TransAmount": "1500.00", "MSISDN": "254712345678", "FirstName": "JOHN", "paid": true, "note": null}'
payment = json.loads(text)          # JSON text -> Python dict
print(payment["TransAmount"], payment["paid"], payment["note"])
amount = float(payment["TransAmount"])
print(f"Received KSh {amount:,.2f} from {payment['FirstName'].title()}")

record = {"id": 1, "items": ["unga", "oil"], "total": 530, "delivered": False}
print(json.dumps(record))           # Python -> JSON text
print(json.dumps(record, indent=2)) # pretty
```

## Saving and loading JSON files

```try-python
import json

settings = {"shop": "Duka Bora", "vat": 16, "towns": ["Thika", "Juja"]}
with open("settings.json", "w") as f:
    json.dump(settings, f, indent=2)

with open("settings.json") as f:
    loaded = json.load(f)
print(loaded["towns"])
```

Remember: `loads`/`dumps` work with **strings**, `load`/`dump` work with **files** (the "s" is for string).

## Handling bad data safely

```try-python
import json

samples = ['{"amount": 500}', '{"amount": }', '{"amount": "abc"}']
for s in samples:
    try:
        data = json.loads(s)
        amount = float(data["amount"])
        print("OK:", amount)
    except json.JSONDecodeError:
        print("Not valid JSON:", s)
    except (ValueError, KeyError) as e:
        print("Bad value:", s, "->", type(e).__name__)
```

> Going further: the `pandas` library reads CSV and Excel files into tables and can summarise thousands of rows in one line. It's the most popular tool for data analysis in Python.

## Why CSV and JSON matter in real jobs

| Who | What they do with CSV/JSON |
|---|---|
| Accountants and SACCO clerks | Export M-Pesa statements, bank statements and member lists as CSV, then total and reconcile them |
| Data analysts | Clean survey exports (Google Forms, KoboToolbox) saved as CSV before charting |
| Web and app developers | Send and receive JSON between a website, a mobile app and the server |
| Integrators | Read JSON callbacks from payment systems (Daraja, card gateways) and save them |
| Teachers and admins | Export marks or attendance from a school system to CSV and produce reports |

Knowing both formats means you can move data between Excel, websites and databases without retyping anything.

## Cleaning messy CSV data

Real CSV files are rarely perfect: extra spaces, empty rows, commas inside amounts, missing values. Clean as you read:

```try-python
import csv, io

raw = """name, town ,amount
 Amina ,Mombasa,"1,200"
Brian,Nakuru,850

Chebet,,2300
Dennis,Kisumu,
"""
clean = []
for row in csv.DictReader(io.StringIO(raw)):
    row = {k.strip(): (v or "").strip() for k, v in row.items()}
    if not row["name"]:
        continue                                   # skip blank lines
    amount_text = row["amount"].replace(",", "")
    row["amount"] = int(amount_text) if amount_text else 0
    row["town"] = row["town"] or "Unknown"
    clean.append(row)

for r in clean:
    print(r)
print("Total:", sum(r["amount"] for r in clean))
```

`io.StringIO` lets you treat a string like a file: handy for testing CSV code without creating files. Note the quoted `"1,200"`: the csv module understands quotes, so the comma inside does not split the column. Never split CSV lines yourself with `line.split(",")` for this reason.

## Summarising a CSV: totals by group

```try-python
import csv, io
from collections import defaultdict

data = """date,town,product,qty,price
2026-09-01,Nakuru,Unga,10,180
2026-09-01,Thika,Sugar,5,210
2026-09-02,Nakuru,Sugar,8,210
2026-09-02,Thika,Unga,12,180
2026-09-03,Nakuru,Oil,4,350
"""
by_town = defaultdict(float)
by_product = defaultdict(int)
for row in csv.DictReader(io.StringIO(data)):
    revenue = int(row["qty"]) * float(row["price"])
    by_town[row["town"]] += revenue
    by_product[row["product"]] += int(row["qty"])

print("Revenue by town")
for town, total in sorted(by_town.items(), key=lambda kv: kv[1], reverse=True):
    print(f"  {town:<8} KSh {total:>8,.0f}")
print("Units by product:", dict(by_product))
```

This is exactly what a pivot table does in Excel, written in a few lines that you can rerun on next month's file.

## Delimiters and encodings

| Situation | Solution |
|---|---|
| File uses semicolons (common in European Excel exports) | `csv.reader(f, delimiter=";")` |
| Tab-separated file (.tsv) | `delimiter="\t"` |
| Strange characters like `Ã©` | Open with the correct encoding: `open(path, encoding="utf-8")` or `"utf-8-sig"` for Excel files that start with a hidden BOM |
| Excel shows everything in one column | Your delimiter doesn't match the user's regional settings; use commas and UTF-8, or save as .xlsx with a library like openpyxl |

## Nested JSON from APIs

API responses often nest data several levels deep. Walk down step by step and use `.get()` for keys that may be missing:

```try-python
import json

response = '''{
  "Body": {"stkCallback": {
    "ResultCode": 0,
    "ResultDesc": "The service request is processed successfully.",
    "CallbackMetadata": {"Item": [
      {"Name": "Amount", "Value": 1500},
      {"Name": "MpesaReceiptNumber", "Value": "SJK4H2L9XA"},
      {"Name": "PhoneNumber", "Value": 254712345678}
    ]}
  }}
}'''
data = json.loads(response)
cb = data["Body"]["stkCallback"]
if cb["ResultCode"] == 0:
    items = {i["Name"]: i.get("Value") for i in cb.get("CallbackMetadata", {}).get("Item", [])}
    print("Paid:", items["Amount"], "Receipt:", items["MpesaReceiptNumber"])
else:
    print("Payment failed:", cb["ResultDesc"])
```

This mirrors the shape of a typical STK Push callback (simplified and with made-up values). Turning the `Item` list into a dict makes the values easy to read by name.

## Converting between CSV and JSON

```try-python
import csv, io, json

csv_text = "name,phone,balance\nAmina,0712000001,1500\nBrian,0722000002,0\n"
rows = list(csv.DictReader(io.StringIO(csv_text)))
for r in rows:
    r["balance"] = int(r["balance"])
json_text = json.dumps(rows, indent=2)
print(json_text)

# and back again
back = json.loads(json_text)
out = io.StringIO()
w = csv.DictWriter(out, fieldnames=back[0].keys())
w.writeheader()
w.writerows(back)
print(out.getvalue())
```

## JSON pitfalls

| Pitfall | Example | Fix |
|---|---|---|
| Single quotes | `{'a': 1}` is not valid JSON | JSON needs double quotes; use `json.dumps` to produce it |
| Trailing commas | `[1, 2,]` fails | Remove the last comma |
| Dates | `json.dumps(date.today())` raises TypeError | Convert first: `d.isoformat()`, or `json.dumps(x, default=str)` |
| Kiswahili or emoji shown as `é` | `json.dumps("café")` | `json.dumps(x, ensure_ascii=False)` |
| Numbers as text | `"1500.00"` | Convert with `float()` before maths |
| Keys become strings | `{1: "a"}` dumps as `{"1": "a"}` | Convert keys back with `int()` after loading |

```try-python
import json
from datetime import date

order = {"id": 7, "customer": "Wanjirũ", "date": date(2026, 9, 30)}
print(json.dumps(order, default=str, ensure_ascii=False))
```

## Practice

1. Read a CSV of expenses (date, category, amount) from a string and print the total per category, largest first.
2. Write a function `load_json(text)` that returns the parsed data, or `None` if the text is not valid JSON.
3. Convert a list of product dicts to a CSV with columns name, price and in_stock.
4. From the STK callback example, write a function that returns `(amount, receipt, phone)` or `None` when ResultCode isn't 0.

:::think Why is `csv.DictReader` safer than `line.split(",")` for reading a bank statement?
Because descriptions and amounts can contain commas inside quotes (`"Payment, school fees"`, `"1,200"`). `split(",")` breaks those into extra columns; the csv module understands quoting and keeps each field intact, and DictReader also lets you use column names instead of fragile position numbers.
:::

```quiz
Q: Which csv class lets you read columns by their header names?
A: DictReader | csv.DictReader
Q: What type are values read from a CSV file?
A: str | string | text
Q: Which json function turns a JSON string into a Python dict?
A: loads | json.loads
Q: Which json function writes Python data into a file?
A: dump | json.dump
Q: What does JSON null become in Python?
A: None
Q: Which io class lets you treat a string like a file?
A: StringIO | io.StringIO
Q: Which json.dumps argument keeps characters like é and ũ readable instead of escaped?
A: ensure_ascii=False | ensure_ascii
Q: Which csv.reader argument changes the separator, e.g. to a semicolon?
A: delimiter
```
=== exercise ===
Parse the JSON text `'{"amount": 1500}'` with `json.loads` and print the amount: **1500**.
=== starter ===
import json
text = '{"amount": 1500}'
# parse and print the amount
=== expected ===
1500
=== must_contain ===
json.loads
