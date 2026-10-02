---
slug: automation-web-requests
title: "Automation with Python: files, Excel reports, web APIs and scheduled tasks"
after: dates-random-math
---
# Automation with Python: files, Excel reports, web APIs and scheduled tasks

One of the most practical uses of Python is **automation**: making the computer do repetitive work for you. Renaming 500 photos, merging monthly sales files, producing an Excel report every Monday, checking exchange rates from an API, sending reminder emails. Office workers, analysts and freelancers save hours every week with small Python scripts, and "automate my spreadsheet" is a common paid freelance job. This unit shows the main automation patterns with runnable examples.

:::note What you will learn
- What to automate (and what not to)
- Batch file operations with `pathlib`
- Processing CSV data and producing summaries
- Creating Excel files (openpyxl) and charts (overview)
- Calling web APIs with `requests` and handling JSON
- Sending emails and scheduling scripts
- Safety: backups, dry runs, secrets and rate limits
:::

## What should you automate?

Good candidates are tasks that are **repetitive**, **rule-based** and **frequent**:

| Task | Python approach |
|---|---|
| Renaming/organising many files | `pathlib`, `shutil` |
| Merging many CSV/Excel files | `csv`, `pandas`, `openpyxl` |
| Weekly sales/attendance reports | Scripts that read data and write Excel/PDF |
| Checking prices or rates | Web APIs with `requests` |
| Reminders and notifications | Email (`smtplib`) or SMS/WhatsApp APIs |
| Cleaning messy data | String methods, regex, pandas |

Rule of thumb: if you do a task more than a few times and it takes more than a few minutes, consider automating it.

## Batch file operations

```try-python
from pathlib import Path

# Set up some sample files (in real life these would already exist)
folder = Path("photos")
folder.mkdir(exist_ok=True)
for name in ["IMG_001.JPG", "IMG_002.JPG", "IMG_003.jpg", "notes.txt"]:
    (folder / name).write_text("x")

# Rename all photos to a clean pattern, with a DRY RUN first
def rename_photos(folder, prefix, dry_run=True):
    photos = sorted(p for p in folder.iterdir() if p.suffix.lower() == ".jpg")
    for i, p in enumerate(photos, start=1):
        new = folder / f"{prefix}-{i:03d}{p.suffix.lower()}"
        print(("Would rename" if dry_run else "Renaming"), p.name, "->", new.name)
        if not dry_run:
            p.rename(new)

rename_photos(folder, "wedding-kamau")             # dry run: just shows what will happen
rename_photos(folder, "wedding-kamau", dry_run=False)
print(sorted(p.name for p in folder.iterdir()))
```

:::warning Always do a dry run and keep backups
Automation can make 500 mistakes in one second. Print what the script **would** do first (a "dry run"), test on copies of your files, and keep backups before running scripts that rename, move or delete.
:::

## Processing CSV data

```try-python
import csv, io
from collections import defaultdict

# Imagine this came from an exported M-Pesa statement or sales system
data = """date,branch,product,amount
2026-10-01,Thika,Unga,5400
2026-10-01,Ruiru,Sugar,3000
2026-10-02,Thika,Sugar,4500
2026-10-02,Ruiru,Unga,7200
2026-10-03,Thika,Milk,2600
"""

by_branch = defaultdict(int)
by_product = defaultdict(int)
for row in csv.DictReader(io.StringIO(data)):
    amount = int(row["amount"])
    by_branch[row["branch"]] += amount
    by_product[row["product"]] += amount

print("Sales by branch:")
for branch, total in sorted(by_branch.items(), key=lambda x: -x[1]):
    print(f"  {branch:<8} KSh {total:>8,}")
print("Best product:", max(by_product, key=by_product.get))

# Write the summary to a new CSV file
with open("summary.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["branch", "total"])
    w.writerows(sorted(by_branch.items()))
print(open("summary.csv", encoding="utf-8").read())
```

For bigger data, **pandas** does this in a few lines: `df.groupby("branch")["amount"].sum()`.

## Creating Excel reports (on your computer)

Install with `pip install openpyxl`, then:

```
from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.chart import BarChart, Reference

wb = Workbook()
ws = wb.active
ws.title = "Sales"
ws.append(["Branch", "Total (KSh)"])
for branch, total in [("Thika", 12500), ("Ruiru", 10200)]:
    ws.append([branch, total])
ws["A1"].font = ws["B1"].font = Font(bold=True)

chart = BarChart()
chart.title = "Sales by branch"
chart.add_data(Reference(ws, min_col=2, min_row=1, max_row=3), titles_from_data=True)
chart.set_categories(Reference(ws, min_col=1, min_row=2, max_row=3))
ws.add_chart(chart, "D2")

wb.save("weekly-report.xlsx")
```

You can also **read** existing Excel files (`openpyxl.load_workbook`) and fill templates, which is great for invoices and report cards.

## Calling web APIs

The **requests** package (`pip install requests`) makes HTTP calls simple:

```
import requests

response = requests.get("https://api.example.com/rates", params={"base": "USD"}, timeout=10)
response.raise_for_status()           # raises an error for 4xx/5xx responses
rates = response.json()
print(rates["KES"])
```

Key habits:
- Always set a **timeout** so scripts don't hang forever.
- Check the status (`raise_for_status()`), and handle network errors with `try/except requests.RequestException`.
- Respect **rate limits** and terms of use; cache results when you can.
- Keep **API keys** in environment variables or a `.env` file (with `python-dotenv`), never in code you share or commit to GitHub.

Here's the pattern simulated so it runs here:

```try-python
import json, time

def fake_get(url, params=None, timeout=10):
    """Pretend API: returns JSON text like a real web service would."""
    time.sleep(0.1)
    return json.dumps({"base": "USD", "rates": {"KES": 129.25, "UGX": 3700.5, "TZS": 2650.0}})

def get_rate(currency):
    try:
        data = json.loads(fake_get("https://api.example.com/latest", params={"base": "USD"}))
        return data["rates"][currency]
    except KeyError:
        return None

for cur in ["KES", "UGX", "XYZ"]:
    rate = get_rate(cur)
    print(cur, "->", rate if rate is not None else "not available")
```

(The rate numbers above are made up for the example.)

## Sending emails

Python's built-in `smtplib` can send email through an email provider (for Gmail you'd use an **App Password**, never your main password):

```
import smtplib, os
from email.message import EmailMessage

msg = EmailMessage()
msg["Subject"] = "Weekly sales report"
msg["From"] = "reports@example.co.ke"
msg["To"] = "manager@example.co.ke"
msg.set_content("Hello, the weekly report is attached.")
msg.add_attachment(open("weekly-report.xlsx", "rb").read(), maintype="application", subtype="octet-stream", filename="weekly-report.xlsx")

with smtplib.SMTP_SSL("smtp.example.co.ke", 465) as server:
    server.login(os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"])
    server.send_message(msg)
```

For SMS and WhatsApp, providers offer APIs (e.g. SMS gateways used in Kenya, and the official WhatsApp Business Platform), called with `requests`. Only message people who agreed to receive messages.

## Scheduling scripts

Make scripts run automatically:

| System | Tool |
|---|---|
| Windows | **Task Scheduler** (run `python report.py` every Monday at 8:00) |
| Linux/Mac/servers | **cron**: `0 8 * * 1 /usr/bin/python3 /home/user/report.py` |
| cPanel hosting | **Cron Jobs** section |
| Cloud | GitHub Actions schedules, cloud functions |

Log what scripts do (the `logging` module) so you can check they ran.

## Web scraping (with care)

**Scraping** means extracting data from web pages (`requests` + `BeautifulSoup`). Before scraping, check if there's an official API, read the site's terms and `robots.txt`, don't overload servers, and respect copyright and personal data laws (Kenya's Data Protection Act applies to personal data you collect).

:::think A freelancer is asked to "automatically download all customer phone numbers from a competitor's website every day". Should they do it?
No. Collecting personal data from another company's site without consent likely breaches the Data Protection Act and the site's terms, and could be illegal. Automation must be legal and ethical: use your own data, official APIs and publicly allowed information, with consent where personal data is involved.
:::

## Common mistakes

| Mistake | Fix |
|---|---|
| No dry run or backup | Print planned actions first; work on copies |
| Hard-coded passwords/API keys | Environment variables or `.env` (not committed) |
| No timeouts on requests | `timeout=10` |
| Scripts that silently fail | Logging and clear error messages |
| Ignoring terms and privacy laws | Use APIs; get consent; respect robots.txt |
| Over-automating rare tasks | Automate frequent, repetitive work |

## Practice tasks

1. Write a script that organises files in a folder into subfolders by extension (dry run first).
2. Summarise a CSV of sales by month and write the summary to a new CSV.
3. On your computer, create an Excel report with openpyxl including a bar chart.
4. Use `requests` with a free public API (many need no key) and print one value, with a timeout and error handling.
5. Schedule a simple script with Task Scheduler or cron that writes the date to a log file.

## Summary

- Automate repetitive, rule-based, frequent tasks; always do dry runs and keep backups.
- `pathlib`/`shutil` for files; `csv`/`pandas` for data; `openpyxl` for Excel reports and charts.
- `requests` for APIs: timeouts, status checks, error handling, rate limits; keep keys in environment variables.
- `smtplib` for email (app passwords); official APIs for SMS/WhatsApp with consent.
- Schedule with Task Scheduler, cron or cPanel cron jobs; log results.
- Scrape responsibly and legally.

```quiz
Q: What should you run first before a script that renames many files? (two words)
A: dry run | a dry run
Q: Which Python package is popular for calling web APIs?
A: requests
Q: Which package creates Excel .xlsx files?
A: openpyxl
Q: Where should API keys be stored instead of in code? (two words)
A: environment variables | env variables | .env
Q: Which Linux tool schedules scripts to run automatically?
A: cron
Q: What should you always set on web requests so scripts don't hang?
A: timeout | a timeout
```
