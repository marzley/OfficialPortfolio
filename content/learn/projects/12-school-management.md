---
slug: school-management-system
title: "Project 11: School management system (students, classes, marks, report cards, fees)"
after: job-board
---
# Project 11: School management system

Thousands of Kenyan schools, from small private academies to large secondary schools, still keep student records, marks and fee balances in exercise books and scattered Excel files. A school management system brings it together: **students, classes, subjects, teachers, exams, marks, report cards, attendance and fees**. It's an advanced project because the data model is rich and the rules are real. It's also a system schools genuinely pay for.

**You'll practise:** designing a complex relational database, many-to-many relationships, multiple roles, bulk data entry, calculations (means, grades, positions), PDF report generation and data privacy.

**Lessons you need:** [keys and design](./?track=sql&lesson=keys-design), [JOINs](./?track=sql&lesson=joins), [window functions](./?track=sql&lesson=window-functions) (for positions), [sessions and login](./?track=php&lesson=sessions-login), [the inventory project](./?track=projects&lesson=inventory-system) (roles, transactions), [data protection in Kenya](./?track=cybersecurity&lesson=data-protection-kenya). The [Python grade report project](./?track=python&lesson=project-grade-report) is a good warm-up.

## Step 1: Scope it (seriously)

A full school system is huge. Version 1 (your portfolio version) should do these well:

1. **Admin**: set up the academic year, terms, classes/streams, subjects, teachers and students; import students from Excel/CSV.
2. **Teachers**: enter marks for their subject and class per exam; take attendance.
3. **Report cards**: per student per term: subject marks, grades, mean, position, teacher comments; print/PDF.
4. **Fees**: fee structure per class per term, payments recorded (cash, bank, M-Pesa), balances.
5. **Parents** (could): log in with phone number to see their child's results and fee balance.

Leave timetabling, library, transport and hostel management for later versions.

:::kenya Curriculum note
Kenya is moving from 8-4-4 to the **Competency-Based Curriculum (CBC)**, which assesses learners with performance levels (for example, Exceeding, Meeting, Approaching and Below Expectations) rather than only percentage marks. Design your grading as **configurable** (a grading scale table) so the same system can handle percentage grades (A, A−, B+…) for some classes and CBC performance levels for others. Check the latest official guidance from the Ministry of Education and KNEC before building for a real school.
:::

## Step 2: Database design

The heart of the system:

```text
academic_years 1─* terms 1─* exams
classes 1─* students
classes *─* subjects        (class_subjects: which subjects a class takes, and who teaches them)
exams × students × subjects → marks
students 1─* fee_payments ;  classes × terms → fee_structure
```

A runnable version (SQLite) with enough data to produce a class ranking:

```try-sql
CREATE TABLE classes (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE students (id INTEGER PRIMARY KEY, adm_no TEXT UNIQUE NOT NULL, name TEXT NOT NULL, class_id INTEGER REFERENCES classes(id));
CREATE TABLE subjects (id INTEGER PRIMARY KEY, code TEXT UNIQUE, name TEXT NOT NULL);
CREATE TABLE exams (id INTEGER PRIMARY KEY, name TEXT NOT NULL, term TEXT NOT NULL);
CREATE TABLE marks (
  exam_id INTEGER REFERENCES exams(id), student_id INTEGER REFERENCES students(id), subject_id INTEGER REFERENCES subjects(id),
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  PRIMARY KEY (exam_id, student_id, subject_id)
);
CREATE TABLE grading (min_score INTEGER, grade TEXT, points INTEGER);

INSERT INTO classes VALUES (1, 'Form 2 East');
INSERT INTO students VALUES (1, '2041', 'Achieng Otieno', 1), (2, '2042', 'Brian Kiprono', 1), (3, '2043', 'Cynthia Wanjiku', 1), (4, '2044', 'David Mwangi', 1);
INSERT INTO subjects VALUES (1, 'ENG', 'English'), (2, 'MAT', 'Mathematics'), (3, 'BIO', 'Biology');
INSERT INTO exams VALUES (1, 'End of Term 2', '2026 T2');
INSERT INTO marks VALUES
 (1,1,1,78),(1,1,2,64),(1,1,3,81), (1,2,1,55),(1,2,2,88),(1,2,3,60),
 (1,3,1,90),(1,3,2,72),(1,3,3,85), (1,4,1,48),(1,4,2,39),(1,4,3,52);
INSERT INTO grading VALUES (80,'A',12),(75,'A-',11),(70,'B+',10),(65,'B',9),(60,'B-',8),(55,'C+',7),(50,'C',6),(45,'C-',5),(40,'D+',4),(35,'D',3),(30,'D-',2),(0,'E',1);

-- Class ranking: total, mean and position for each student
WITH totals AS (
  SELECT s.adm_no, s.name, SUM(m.score) AS total, AVG(m.score) AS mean
  FROM marks m JOIN students s ON s.id = m.student_id
  WHERE m.exam_id = 1 AND s.class_id = 1
  GROUP BY s.id
)
SELECT adm_no, name, total, ROUND(mean, 1) AS mean,
       (SELECT grade FROM grading WHERE min_score <= mean ORDER BY min_score DESC LIMIT 1) AS mean_grade,
       RANK() OVER (ORDER BY total DESC) AS position
FROM totals
ORDER BY position;
```

`RANK()` gives tied students the same position (two students on 230 are both 2nd, and the next is 4th), which is how schools usually rank. Try `DENSE_RANK()` to see the difference.

The `WITH totals AS (...)` part (a *common table expression*) works out each student's total and mean first; the main query then looks up the grade and ranks. For each subject's grade, look up `grading` the same way. The grading scale lives in a **table**, not in code, so a school can change it without a programmer.

In MySQL for the real system, add `teachers`, `class_subjects (class_id, subject_id, teacher_id)`, `academic_years`, `terms`, `attendance (student_id, date, status)`, `fee_structure (class_id, term_id, amount)` and `fee_payments (student_id, term_id, amount, method, reference, paid_on, recorded_by)`.

## Step 3: Roles

| Role | Can |
|---|---|
| Admin / principal | Everything, including setup and users |
| Deputy / academics | Exams, report cards, all marks (read), comments |
| Teacher | Enter marks **only for subjects and classes assigned to them**; attendance for their class |
| Bursar | Fees: structure, payments, balances, statements |
| Parent | Read-only: their own children's results and fees |

Enforce on the server with a query like: *is there a `class_subjects` row for this class, subject and teacher?* before saving any mark.

## Step 4: Fast mark entry

Teachers enter marks for 40–60 students at a time, often on a phone. Make it fast:
- One screen per class + subject + exam: a list of students with one number box each.
- Keyboard-friendly: `inputmode="numeric"`, Enter moves to the next student, auto-save each row with `fetch` (and show a small tick).
- Validate 0–100 in the browser **and** on the server; allow "absent" as a separate value, not 0.
- **Upsert** so re-entering a mark updates it: `INSERT … ON DUPLICATE KEY UPDATE score = VALUES(score)` (MySQL) thanks to the composite primary key.
- Lock an exam once report cards are published, so marks can't silently change afterwards; log any changes made after that by an admin.

## Step 5: Import students from Excel

Schools already have class lists in Excel. Let the admin upload a CSV (Excel → Save As → CSV) with columns `adm_no, name, class, gender, parent_phone`:
- Preview the first rows and show errors before saving (missing admission number, unknown class, duplicate).
- Import in a **transaction**: all rows or none.
- See [CSV files](./?track=python&lesson=csv-json-files) for the idea; in PHP use `fgetcsv`.

## Step 6: Report cards (PDF)

A report card shows: school name and logo, student details, each subject's score, grade and teacher's initials, total, mean grade, position (e.g. "5 out of 46"), class teacher's and principal's comments, fee balance (optional), next term's opening date.

Generate PDFs on the server with a library such as **Dompdf** or **TCPDF** (PHP, installed with Composer) from an HTML template, or design a print stylesheet so the browser's "Save as PDF" produces a clean A4 page:

```css
@media print {
  @page { size: A4; margin: 15mm; }
  nav, .no-print { display: none; }
  .report { page-break-after: always; }   /* one student per page when printing a whole class */
}
```

Offer "Print whole class" (one page per student) for the class teacher.

## Step 7: Fees

- Fee structure per class per term (tuition, lunch, transport as separate items if needed).
- Record payments: method (M-Pesa, bank, cash), reference (M-Pesa code or bank slip number, **unique**), amount, date, who recorded it.
- **Balance** = total fees billed − total paid (including carried-forward balance from last term).
- Statements per student; a defaulters list for the bursar; receipts as PDF.
- Optional: parents pay school fees via STK push with the admission number as the account reference ([M-Pesa project](./?track=projects&lesson=mpesa-payment-system)).

## Step 8: Privacy and safety

Student data is **children's personal data**: names, marks, health notes, parents' phone numbers. Under Kenya's Data Protection Act, schools must protect it.
- Strong passwords and 2FA for admin and bursar accounts; each staff member has their own login (never a shared "admin" account).
- Parents see only their own children.
- Daily **encrypted backups** stored off the server ([backups](./?track=cybersecurity&lesson=backups-ransomware)).
- An **audit log** of sensitive actions: marks changed, fees edited, users created.
- Use fake data in your portfolio demo. Never publish a real school's data.

## Step 9: Tests

- A teacher tries to enter marks for a class they don't teach: refused
- Mark of 105, −3 or "abc": refused; "absent" handled and excluded from the mean
- Tied totals get the same position
- Changing the grading scale updates grades on report cards
- Import a CSV with one bad row: nothing imported, error shown for that row
- Parent account can't see another child by changing an ID in the URL

## Stretch goals

- Attendance analytics (students absent 3+ days this month).
- SMS results and fee reminders to parents.
- Subject performance analysis per teacher and per term (charts).
- Timetable generator: a genuinely hard algorithm problem.
- An app for parents ([Flutter](./?track=flutter&lesson=setup-first-app)) using an API from this system.

## Summary

- Scope version 1 tightly: setup, marks, report cards, fees, parents.
- Composite keys (exam, student, subject) for marks; grading scales in a table; RANK() for positions.
- Roles enforced on the server, down to "this teacher teaches this class and subject".
- Fast mark entry, CSV import in a transaction, PDF report cards, careful fee records.
- Children's data needs strong security, backups and audit logs.

```quiz
Q: Which SQL window function gives tied students the same position and skips the next number?
A: RANK | RANK()
Q: What is the primary key of the marks table? List the three columns separated by commas.
A: exam_id, student_id, subject_id | exam_id,student_id,subject_id
Q: Should the grading scale be written in code or stored in a table?
A: table | in a table | stored in a table
Q: What do the letters CBC stand for in Kenyan education? (three words)
A: Competency-Based Curriculum | Competency Based Curriculum
```
