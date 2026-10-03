---
slug: project-grade-report
title: Project: a school grade report system
---
# Project: a school grade report system

In this project you'll build a small but real program: it takes students' marks, calculates totals, averages, grades and positions, prints report cards and saves a CSV that opens in Excel. It uses functions, lists, dictionaries, loops, sorting, f-strings and files.

## Step 1: the data

```python
subjects = ["Maths", "English", "Kiswahili", "Science"]
students = [
    {"name": "Amina Hassan", "marks": [78, 84, 90, 71]},
    ...
]
```

## Step 2: the complete program

Run it, then read it section by section.

```try-python
import csv

SUBJECTS = ["Maths", "English", "Kiswahili", "Science"]
students = [
    {"name": "Amina Hassan",  "marks": [78, 84, 90, 71]},
    {"name": "Brian Otieno",  "marks": [92, 71, 65, 88]},
    {"name": "Chebet Kiprop", "marks": [55, 62, 70, 49]},
    {"name": "Dennis Mwangi", "marks": [38, 45, 52, 41]},
    {"name": "Esther Wanjiku","marks": [88, 90, 85, 93]},
]

def grade(mark):
    """Kenyan-style letter grade for a mark out of 100."""
    bands = [(80, "A"), (75, "A-"), (70, "B+"), (65, "B"), (60, "B-"),
             (55, "C+"), (50, "C"), (45, "C-"), (40, "D+"), (35, "D"), (30, "D-")]
    for cutoff, letter in bands:
        if mark >= cutoff:
            return letter
    return "E"

def comment(avg):
    if avg >= 80: return "Excellent work. Keep it up!"
    if avg >= 65: return "Very good. Aim higher."
    if avg >= 50: return "Fair. More effort needed."
    return "Needs serious improvement. See your teacher."

# calculate totals and averages
for s in students:
    s["total"] = sum(s["marks"])
    s["average"] = round(s["total"] / len(SUBJECTS), 1)
    s["grade"] = grade(s["average"])

# rank by total (highest first) and assign positions
ranked = sorted(students, key=lambda s: s["total"], reverse=True)
for position, s in enumerate(ranked, start=1):
    s["position"] = position

# print a report card for each student
for s in ranked:
    print("=" * 38)
    print(f"REPORT CARD: {s['name'].upper()}")
    print("-" * 38)
    for subject, mark in zip(SUBJECTS, s["marks"]):
        print(f"{subject:<12}{mark:>5}{grade(mark):>6}")
    print("-" * 38)
    print(f"{'Total':<12}{s['total']:>5}")
    print(f"{'Average':<12}{s['average']:>5}{s['grade']:>6}")
    print(f"Position: {s['position']} of {len(students)}")
    print("Comment:", comment(s["average"]))

# class summary
print("=" * 38)
print("CLASS SUMMARY")
for i, subject in enumerate(SUBJECTS):
    marks = [s["marks"][i] for s in students]
    best = max(students, key=lambda s: s["marks"][i])
    print(f"{subject:<12} mean {sum(marks)/len(marks):5.1f}   top: {best['name']}")
mean = sum(s["average"] for s in students) / len(students)
print(f"Class mean: {mean:.1f} ({grade(mean)})")

# save a CSV for Excel
with open("results.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["Position", "Name", *SUBJECTS, "Total", "Average", "Grade"])
    for s in ranked:
        w.writerow([s["position"], s["name"], *s["marks"], s["total"], s["average"], s["grade"]])
print("\nSaved results.csv:")
print(open("results.csv").read())
```

## What you practised

| Skill | Where |
|---|---|
| Functions with docstrings | `grade()`, `comment()` |
| Lists of dictionaries | `students` |
| Loops, `zip`, `enumerate` | report cards and ranking |
| Sorting with `key=lambda` | `ranked` |
| f-string alignment | the neat columns |
| List comprehensions | subject means |
| Writing CSV files | `results.csv` |

## Challenges

1. Add a fifth subject. What do you need to change? (If you wrote it well, only the lists.)
2. Handle **ties**: students with the same total should share a position.
3. Read the marks from a CSV file instead of the list.
4. Add input validation: marks must be 0–100.
5. Print the top 3 students with 🥇🥈🥉.

## How real school systems work

Schools in Kenya use spreadsheets, school management systems and portals to compute results. The logic underneath is what you just built: read marks, validate, compute totals and means, assign grades, rank, and export. Understanding it lets you build tools for schools, tuition centres and colleges, or automate reports a teacher would otherwise type by hand for hours.

| Stage | What happens | Python tools |
|---|---|---|
| Collect | Teachers enter marks per subject | input forms, CSV from Excel/Google Sheets |
| Validate | Reject marks below 0 or above 100, missing entries | `if` checks, `try`/`except` |
| Compute | Totals, means, grades | `sum`, `round`, functions |
| Rank | Positions, with ties sharing a position | `sorted`, `enumerate` |
| Report | Report cards, class lists, subject analysis | f-strings, files |
| Export | CSV for Excel, JSON for a website | `csv`, `json` |

## Step 3: reading marks from a CSV

In practice the marks come from a spreadsheet. Here is the same data as CSV, read and validated:

```try-python
import csv, io

marks_csv = """name,Maths,English,Kiswahili,Science
Amina Hassan,78,84,90,71
Brian Otieno,92,71,65,88
Chebet Kiprop,55,62,abc,49
Dennis Mwangi,38,45,52,141
Esther Wanjiku,88,90,85,93
"""
reader = csv.DictReader(io.StringIO(marks_csv))
subjects = reader.fieldnames[1:]
students, errors = [], []
for line_no, row in enumerate(reader, start=2):
    marks = []
    for subj in subjects:
        try:
            m = int(row[subj])
        except ValueError:
            errors.append(f"Line {line_no}: {row['name']} {subj} '{row[subj]}' is not a number")
            m = None
        else:
            if not 0 <= m <= 100:
                errors.append(f"Line {line_no}: {row['name']} {subj} {m} is out of range")
                m = None
        marks.append(m)
    students.append({"name": row["name"], "marks": marks})

print("Subjects:", subjects)
for e in errors:
    print("ERROR", e)
print("Students loaded:", len(students))
```

Reporting the **line number** and the exact problem lets the teacher fix the spreadsheet quickly instead of guessing.

## Step 4: handling ties fairly

If two students have the same total they should share a position, and the next student skips a number (1, 2, 2, 4). This is sometimes called "competition ranking":

```try-python
results = [("Amina", 323), ("Brian", 316), ("Chebet", 316), ("Dennis", 176), ("Esther", 356)]
ranked = sorted(results, key=lambda r: r[1], reverse=True)

position = 0
previous_total = None
for i, (name, total) in enumerate(ranked, start=1):
    if total != previous_total:
        position = i
        previous_total = total
    print(f"{position:>2}. {name:<8} {total}")
```

## Step 5: subject analysis

Teachers and heads of department want to know how each subject performed:

```try-python
import statistics as st

SUBJECTS = ["Maths", "English", "Kiswahili", "Science"]
marks = {
    "Amina": [78, 84, 90, 71], "Brian": [92, 71, 65, 88], "Chebet": [55, 62, 70, 49],
    "Dennis": [38, 45, 52, 41], "Esther": [88, 90, 85, 93],
}
print(f"{'Subject':<10}{'Mean':>6}{'Median':>8}{'Max':>5}{'Min':>5}{'Pass%':>7}")
for i, subj in enumerate(SUBJECTS):
    col = [m[i] for m in marks.values()]
    pass_rate = 100 * sum(1 for x in col if x >= 50) / len(col)
    print(f"{subj:<10}{st.mean(col):>6.1f}{st.median(col):>8}{max(col):>5}{min(col):>5}{pass_rate:>6.0f}%")

# a simple text bar chart of the class means
for name, m in marks.items():
    avg = sum(m) / len(m)
    print(f"{name:<7} {'#' * int(avg // 5):<20} {avg:.1f}")
```

## Step 6: grade distribution

```try-python
from collections import Counter

def grade(mark):
    bands = [(80, "A"), (75, "A-"), (70, "B+"), (65, "B"), (60, "B-"),
             (55, "C+"), (50, "C"), (45, "C-"), (40, "D+"), (35, "D"), (30, "D-")]
    for cutoff, letter in bands:
        if mark >= cutoff:
            return letter
    return "E"

averages = [80.8, 79.0, 59.0, 44.0, 89.0, 66.5, 72.3, 51.0]
dist = Counter(grade(a) for a in averages)
order = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"]
for g in order:
    if dist[g]:
        print(f"{g:<3} {dist[g]}")
```

## Step 7: exporting JSON for a website

If the school has a parent portal, the same results can be saved as JSON for the website to display:

```try-python
import json

results = [
    {"position": 1, "name": "Esther Wanjiku", "average": 89.0, "grade": "A"},
    {"position": 2, "name": "Amina Hassan", "average": 80.8, "grade": "A"},
]
payload = {"term": "Term 3 2026", "class": "Form 2 East", "results": results}
print(json.dumps(payload, indent=2))
```

Real portals must protect this data: results are personal information under Kenya's Data Protection Act, so access must be limited to the learner, their parents and authorised staff.

## Designing the program well

- **Keep data separate from code**: subjects and grade bands in lists (or a settings file), so changes don't require rewriting logic.
- **One job per function**: `load_marks()`, `validate()`, `compute()`, `rank()`, `print_report()`, `export_csv()`. Each is easy to test.
- **Test with tricky data**: ties, a missing mark, a student absent from one exam, an empty class.
- **Don't overwrite raw marks**: keep the original data and compute results from it, so mistakes can be traced.

```try-python
def compute(student, n_subjects):
    valid = [m for m in student["marks"] if m is not None]
    total = sum(valid)
    average = round(total / n_subjects, 1)
    return {**student, "total": total, "average": average, "missing": n_subjects - len(valid)}

print(compute({"name": "Chebet", "marks": [55, 62, None, 49]}, 4))
assert compute({"name": "T", "marks": [100, 100]}, 2)["average"] == 100
print("tests passed")
```

`assert` stops the program if a condition is false: a quick way to check your functions still behave correctly after changes.

## Extension ideas for a portfolio

1. Turn it into a small **Flask** web app where a teacher uploads a CSV and downloads report cards.
2. Generate **PDF report cards** with a library such as reportlab or fpdf2.
3. Store marks in **SQLite** and keep results for several terms, then show each student's improvement.
4. Send each parent an SMS summary through an SMS API (with consent).
5. Plot subject means with **matplotlib**.

A finished version of any of these is a strong portfolio piece when looking for internships or freelance work with schools.

:::think A student was absent for Science, so their mark is missing. Should their average divide by 4 subjects or 3?
It depends on the school's policy, and the program should make that rule explicit. Dividing by 3 rewards the student for missing an exam; dividing by 4 (treating missing as 0) penalises them. Many schools mark the result as incomplete ("X") until the exam is sat. Good software shows the missing mark clearly instead of hiding it.
:::

```quiz
Q: Which built-in function pairs each subject with its mark?
A: zip | zip()
Q: Which function gives positions starting from 1 while looping?
A: enumerate | enumerate()
Q: Which argument makes sorted() put the highest first?
A: reverse=True | reverse
Q: What grade does a mark of 72 get in this program?
A: B+
Q: In competition ranking, if two students tie for 2nd, what position does the next student get?
A: 4 | 4th | fourth
Q: Which statement stops a program when a condition you expect to be true is false?
A: assert
Q: Which statistics function gives the middle value of a list of marks?
A: median | statistics.median
```
