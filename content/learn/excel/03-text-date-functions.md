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

## Why cleaning data matters

Data rarely arrives clean. Names typed in capitals, phone numbers in different formats, extra spaces from system exports, dates stored as text, M-Pesa statements with combined fields, duplicate entries from Google Forms. Analysts commonly spend more time cleaning data than analysing it. Cleaning skills are what make lookups match, totals add up and reports trustworthy, and they are among the most requested Excel skills in office jobs.

## More text functions

| Function | Example | Result |
|---|---|---|
| `TEXTBEFORE` | `=TEXTBEFORE("Jane Wanjiru"," ")` | Jane |
| `TEXTAFTER` | `=TEXTAFTER("Jane Wanjiru"," ")` | Wanjiru |
| `TEXTSPLIT` | `=TEXTSPLIT("Nairobi,Mombasa,Kisumu",",")` | Three cells across |
| `TEXTJOIN` | `=TEXTJOIN(", ",TRUE,A2:A5)` | Joins non-empty cells with commas |
| `SUBSTITUTE` | `=SUBSTITUTE(A2,"-","")` | Removes dashes |
| `FIND` / `SEARCH` | `=SEARCH("@",A2)` | Position of @ (SEARCH ignores case) |
| `CLEAN` | `=CLEAN(A2)` | Removes non-printing characters from exports |
| `TEXT` | `=TEXT(B2,"#,##0.00")` | Number shown as "1,500.00" text |
| `VALUE` | `=VALUE("1500")` | Converts text to a number |
| `REPT` | `=REPT("■",B2/10)` | Simple in-cell bar chart |

TEXTBEFORE, TEXTAFTER and TEXTSPLIT are in Excel 365 and recent Google Sheets versions; older Excel uses LEFT/MID/FIND combinations.

## Cleaning phone numbers

Phone numbers arrive as `0712 345 678`, `+254712345678`, `712345678` or `254-712-345-678`. To standardise them to the `2547XXXXXXXX` format many systems use:

```
Step 1, digits only:   =SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(A2," ",""),"-",""),"+","")
Step 2, standardise:   =IF(LEFT(B2,1)="0", "254"&MID(B2,2,9), IF(LEN(B2)=9, "254"&B2, B2))
Step 3, check length:  =IF(LEN(C2)=12, "OK", "CHECK")
```

Format the column as **Text** first, or Excel may drop leading zeros and show long numbers in scientific notation (7.12E+11).

## Splitting full names

```
First name:   =LEFT(A2, FIND(" ", A2) - 1)
Last name:    =MID(A2, FIND(" ", A2) + 1, 100)
Or (365):     =TEXTBEFORE(A2, " ")   and   =TEXTAFTER(A2, " ", -1)   (-1 = last space)
Initials:     =LEFT(A2,1) & MID(A2, FIND(" ",A2)+1, 1)
```

Kenyan names often have three parts (Mary Wanjiru Kamau), so decide whether "last name" means the final word (`TEXTAFTER(..., -1)`) or everything after the first name.

## Data → Text to Columns

For a one-time split (for example, a CSV pasted into one column), select the column → **Data → Text to Columns** → choose Delimited (comma, space, tab) or Fixed width. It's faster than formulas when you don't need the split to update.

## Flash Fill in practice

Type the result you want for the first one or two rows, then press **Ctrl + E**:

| Full name | Email (typed by you) |
|---|---|
| Brian Otieno | brian.otieno@school.ac.ke |
| Amina Hassan | (Ctrl + E fills: amina.hassan@school.ac.ke) |

Flash Fill copies the pattern but doesn't create formulas: if the source changes, the results don't update. Always check a few results; it can guess wrong on unusual entries.

## Date functions in depth

```
=TODAY()                         today's date (updates daily)
=NOW()                           date and time
=DATE(2026,12,25)                build a date from year, month, day
=YEAR(A2), MONTH(A2), DAY(A2)    take parts of a date
=EDATE(A2, 3)                    same day 3 months later (loan due dates)
=EOMONTH(A2, 0)                  last day of the month
=NETWORKDAYS(A2, B2, Holidays)   working days between two dates, excluding a holiday list
=WORKDAY(A2, 10, Holidays)       date 10 working days later
=DATEDIF(A2, TODAY(), "Y")       full years between dates (age)
=WEEKDAY(A2, 2)                  1 = Monday ... 7 = Sunday
=TEXT(A2, "dddd")                weekday name, e.g. "Friday"
=TEXT(A2, "mmm yyyy")            "Mar 2026" for monthly grouping
```

Keep a **Holidays** list (a named range of public holiday dates) and update it every year, since some dates change or are gazetted at short notice.

## Fixing dates stored as text

Signs: dates are left-aligned, sorting is wrong, formulas give `#VALUE!`. Fixes:

1. **Data → Text to Columns → Finish** often converts them instantly.
2. `=DATEVALUE(A2)` converts text dates that match your system's date format.
3. For day/month mix-ups (system set to US month/day), split and rebuild: `=DATE(RIGHT(A2,4), MID(A2,4,2), LEFT(A2,2))` for text like `05/03/2026` meaning 5 March.
4. Check your computer's regional settings (Control Panel → Region): Kenya uses day/month/year.

## Cleaning a Google Forms export: a full workflow

1. Copy the raw data to a new sheet; never clean the only copy.
2. `TRIM` and `PROPER` the names; `LOWER` the emails.
3. Standardise phone numbers with the formulas above.
4. Convert text dates; check that all dates fall in a sensible range.
5. Remove duplicates (**Data → Remove Duplicates**) on the email or phone column, after checking which copy to keep.
6. Use COUNTIF to find near-duplicates: `=COUNTIF(C:C, C2)>1`.
7. Paste cleaned results as **values** (Ctrl + Alt + V → Values) so they no longer depend on the raw sheet.

## Common mistakes

| Mistake | Fix |
|---|---|
| Lookups fail because of invisible spaces | `TRIM` (and `CLEAN`) both sides |
| Leading zeros vanish from phone numbers or IDs | Format as Text before typing/pasting |
| Long ID numbers shown as 2.12E+07 | Format as Text or Number with 0 decimals |
| `=A2&" "&B2` shows dates as numbers like 46097 | `=A2&" "&TEXT(B2,"dd/mm/yyyy")` |
| Deleting the raw data after cleaning with formulas | Paste values first |

## Practice

1. Clean a list of 10 messy names (extra spaces, wrong case) with TRIM and PROPER.
2. Standardise 10 phone numbers in different formats to 2547XXXXXXXX.
3. Calculate each staff member's age and years of service with DATEDIF.
4. Find loan due dates 1, 2 and 3 months after the borrowing date with EDATE.
5. Count working days in each month of a term, excluding public holidays.

:::think A VLOOKUP/XLOOKUP for "Kamau " (with a space) returns #N/A even though "Kamau" is in the list. How do you fix it permanently, not just for one cell?
The trailing space makes the text different. Clean the data at the source: TRIM the lookup column (in a helper column, then paste values), or wrap the lookup value with TRIM (`XLOOKUP(TRIM(A2), ...)`). To prevent it recurring, use drop-down lists (Data Validation) instead of free typing.
:::

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
Q: Which function adds a number of months to a date?
A: EDATE
Q: Which function counts working days between two dates?
A: NETWORKDAYS
Q: Which function joins a range of cells with a separator and can skip blanks?
A: TEXTJOIN
Q: Which paste option keeps results but removes the formulas?
A: values | paste values | paste special values
```
