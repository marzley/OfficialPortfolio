---
slug: text-date-functions
title: Cleaning data: text and date functions
after: if-logic-functions
---
# Cleaning data: text and date functions

Data from forms, M-Pesa statements, school systems and copied web pages is often messy: extra spaces, names in capitals, phone numbers in different formats, dates as text. Text and date functions clean it quickly, and cleaning skills are exactly what data-entry and data-analyst jobs ask for.

## Text functions

| Function | Example | Result |
|---|---|---|
| `TRIM` | `=TRIM("  Amina   Hassan ")` | `Amina Hassan` (extra spaces removed) |
| `PROPER` | `=PROPER("AMINA HASSAN")` | `Amina Hassan` |
| `UPPER` / `LOWER` | `=UPPER("kisumu")` | `KISUMU` |
| `LEN` | `=LEN("0712345678")` | `10` |
| `LEFT` / `RIGHT` | `=LEFT("0712345678", 4)` | `0712` |
| `MID` | `=MID("KCA/2026/0451", 5, 4)` | `2026` |
| `FIND` | `=FIND(" ", "Amina Hassan")` | `6` (position of the space) |
| `SUBSTITUTE` | `=SUBSTITUTE("0712 345 678"," ","")` | `0712345678` |
| `&` or `CONCAT` | `=A2&" "&B2` | Joins text |
| `TEXTJOIN` | `=TEXTJOIN(", ",TRUE,A2:A5)` | Joins a range with commas |
| `TEXT` | `=TEXT(1500,"#,##0")` | `1,500` as text |
| `VALUE` | `=VALUE("250")` | The number 250 |

## Real cleaning recipes

**First and last name from a full name in A2:**

```
First name:  =LEFT(A2, FIND(" ", A2) - 1)
Last name:   =MID(A2, FIND(" ", A2) + 1, 100)
```

**Tidy a name:** `=PROPER(TRIM(A2))`

**Standardise phone numbers** to `2547XXXXXXXX` (the format SMS and M-Pesa systems need):

```
=IF(LEFT(SUBSTITUTE(A2," ",""),1)="0", "254"&MID(SUBSTITUTE(A2," ",""),2,9), SUBSTITUTE(SUBSTITUTE(A2," ",""),"+",""))
```

**Check a phone number is 10 digits:** `=AND(LEN(A2)=10, ISNUMBER(--A2))`

**Build an email:** `=LOWER(LEFT(A2,1)&B2&"@school.ac.ke")`

**Split text into columns** without formulas: select the column → **Data → Text to Columns** → choose the delimiter (comma, space).

> **Flash Fill** (Ctrl + E): type the result you want for the first one or two rows (e.g. just the first names), press Ctrl + E and Excel fills the rest by following your pattern.

## Dates are numbers

Excel stores a date as a **number** (days since 1 January 1900), formatted to look like a date. That's why you can subtract dates.

| Function | Example | Result |
|---|---|---|
| `TODAY()` | `=TODAY()` | Today's date (updates daily) |
| `NOW()` | `=NOW()` | Date and time |
| `DATE(y,m,d)` | `=DATE(2026,12,12)` | 12/12/2026 |
| `YEAR`, `MONTH`, `DAY` | `=YEAR(A2)` | 2026 |
| `WEEKDAY` | `=WEEKDAY(A2,2)` | 1 = Monday ... 7 = Sunday |
| `TEXT` for names | `=TEXT(A2,"dddd")` | Saturday |
| Days between | `=B2-A2` | Number of days |
| `DATEDIF` | `=DATEDIF(A2,TODAY(),"y")` | Age in full years |
| `EDATE` | `=EDATE(A2, 3)` | Same day 3 months later |
| `EOMONTH` | `=EOMONTH(A2, 0)` | Last day of that month |
| `NETWORKDAYS` | `=NETWORKDAYS(A2,B2,Holidays)` | Working days, minus holidays |
| `WORKDAY` | `=WORKDAY(A2, 10)` | 10 working days later |

## Date recipes

```
Loan due in 30 days:        =A2+30
Days overdue:               =MAX(0, TODAY()-B2)
Overdue flag:               =IF(TODAY()>B2, "Overdue", "OK")
Age from date of birth:     =DATEDIF(C2, TODAY(), "y")
Month name for reports:     =TEXT(A2, "mmm yyyy")          e.g. Sep 2026
```

## When dates won't behave

If `=B2-A2` gives `#VALUE!` or dates are left-aligned, they're stored as **text** (common with data copied from websites or CSV files). Fixes:

- **Data → Text to Columns → Finish** converts many text dates.
- `=DATEVALUE(A2)` converts text to a date.
- Check your system's date format (day/month vs month/day): Kenya uses **dd/mm/yyyy**.

## Removing duplicates

**Data → Remove Duplicates** (keep a backup copy first), or in Excel 365: `=UNIQUE(A2:A500)`.

```quiz
Q: Which function removes extra spaces from text?
A: TRIM | TRIM()
Q: Which function capitalises the first letter of each word?
A: PROPER | PROPER()
Q: Which shortcut starts Flash Fill?
A: Ctrl + E | ctrl+e
Q: How does Excel really store dates: as text or as numbers?
A: numbers | as numbers | number
Q: Which function returns today's date?
A: TODAY | TODAY()
```
