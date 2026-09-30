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
