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

```quiz
Q: Which built-in function pairs each subject with its mark?
A: zip | zip()
Q: Which function gives positions starting from 1 while looping?
A: enumerate | enumerate()
Q: Which argument makes sorted() put the highest first?
A: reverse=True | reverse
Q: What grade does a mark of 72 get in this program?
A: B+
```
