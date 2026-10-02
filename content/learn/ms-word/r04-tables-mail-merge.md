---
slug: tables-mail-merge
title: "Tables and mail merge: organising information and sending personalised letters in bulk"
after: KEEP
---
# Tables and mail merge: organising information and sending personalised letters in bulk

Tables organise information clearly in documents: timetables, price lists, invoices, schedules, comparison charts and forms. **Mail merge** is a powerful time-saver: write one letter and automatically produce hundreds of personalised copies (invitations, fee reminders, certificates, offer letters, labels and envelopes) using names and details from a spreadsheet. This unit teaches both step by step in Microsoft Word, with notes for Google Docs.

:::note What you will learn
- Inserting and drawing tables; adding and deleting rows and columns
- Formatting tables: styles, borders, shading, alignment, widths
- Merging and splitting cells; repeating header rows
- Converting text to tables; simple formulas and sorting in Word tables
- What mail merge is and where it's used
- Preparing the data source in Excel
- Running a mail merge: letters, emails, labels and certificates
- Rules and fields (IF...THEN...ELSE), formatting merged numbers and dates
:::

## Part 1: Tables

### Inserting a table

1. **Insert → Table** → drag across the grid to choose columns × rows, or **Insert Table** to type exact numbers.
2. Type in the first cell; press **Tab** to move to the next cell (Tab in the last cell adds a new row); **Shift+Tab** moves back.

**Google Docs:** Insert → Table → choose size.

### Changing the structure

Click in the table: Word shows **Table Design** and **Layout** tabs.

| Task | How (Layout tab or right-click) |
|---|---|
| Insert rows/columns | Insert Above/Below/Left/Right (or hover at the edge and click the ⊕) |
| Delete rows/columns/table | Delete → Rows/Columns/Table |
| Merge cells | Select cells → Merge Cells (e.g. a title across the top) |
| Split cells | Split Cells → choose columns/rows |
| Column width | Drag borders, or AutoFit → AutoFit Contents / AutoFit Window |
| Distribute evenly | Distribute Rows / Distribute Columns |
| Cell alignment | Alignment group (e.g. align centre vertically) |
| Text direction | Text Direction (vertical headers) |

### Formatting tables

- **Table Design → Table Styles:** professional colour schemes in one click; tick **Header Row**, **Banded Rows** (alternating shading) and **Total Row** options.
- **Borders and shading:** select cells → Borders/Shading.
- **Repeat header rows:** select the header row → Layout → **Repeat Header Rows**, so long tables show headers on every page.
- **Prevent rows breaking across pages:** Table Properties → Row → untick "Allow row to break across pages".
- **Numbers:** right-align number columns; decimal tabs can line up decimals.

### Converting text to a table (and back)

If you have text separated by tabs or commas (e.g. pasted from elsewhere):
1. Select it → **Insert → Table → Convert Text to Table**.
2. Choose the separator (tabs, commas).

Layout → **Convert to Text** does the reverse.

### Sorting and simple formulas

- **Sort:** Layout → **Sort** (by a column, ascending/descending; tick "Header row").
- **Formula:** Layout → **Formula** → `=SUM(ABOVE)` totals a column; `=SUM(LEFT)` totals a row. Word formulas don't update automatically: select and press **F9**. For serious calculations, use Excel and paste/link the table.

### Example: an invoice table

| Item | Qty | Unit price (KSh) | Amount (KSh) |
|---|---|---|---|
| Website design (5 pages) | 1 | 25,000 | 25,000 |
| Domain (.co.ke, 1 year) | 1 | 1,200 | 1,200 |
| Hosting (1 year) | 1 | 6,000 | 6,000 |
| **Total** | | | **32,200** |

Format: header row shaded, numbers right-aligned, total row bold, borders light.

:::tip Tables for layout vs data
In Word, tables are also useful for layout (e.g. a form with label and answer columns, or a signature block), with borders hidden. On websites, layout tables are bad practice, but in documents they're fine.
:::

## Part 2: Mail merge

### What is mail merge?

:::define Mail merge
A feature that combines a **main document** (a letter, email, label or certificate template) with a **data source** (a list of names and details, usually in Excel) to produce many personalised documents automatically.
:::

| Use | Example |
|---|---|
| Schools | Fee balance letters to 600 parents with each student's name, class and balance |
| Businesses | Personalised offers or statements to customers |
| Events | Invitations, name badges, certificates of attendance |
| HR | Offer letters, payslip notices |
| Churches/chamas | Contribution statements, meeting invitations |
| Shipping | Address labels and envelopes |

Without mail merge, you'd type or edit each letter manually: slow and error-prone.

### Step 1: Prepare the data source (Excel)

| FirstName | LastName | Class | Balance | Phone |
|---|---|---|---|---|
| Amina | Hassan | Grade 9A | 12500 | 0712000001 |
| Brian | Otieno | Grade 8B | 0 | 0712000002 |
| Chebet | Kiprono | Grade 9A | 4200 | 0712000003 |

Rules:
- **One header row** with simple names (no spaces is easiest: `FirstName`, `Balance`).
- One record per row; no blank rows or merged cells.
- Keep numbers as numbers; format phone numbers as text to keep leading zeros.
- Save and **close** the Excel file before merging.

### Step 2: Write the main document

Write the letter normally, leaving places for personal details:

```
Dear Parent/Guardian of ______,

Our records show a fee balance of KSh ______ for ______ (Class ______)...
```

### Step 3: Run the merge in Word

1. **Mailings → Start Mail Merge → Letters** (or E-mail Messages, Envelopes, Labels).
2. **Select Recipients → Use an Existing List** → choose the Excel file → choose the sheet (tick "First row of data contains column headers").
3. Optional: **Edit Recipient List** to filter (e.g. only students with Balance > 0) or sort.
4. Place the cursor where a detail goes → **Insert Merge Field** → choose `FirstName`, etc. Fields appear as «FirstName».
5. **Preview Results** to see real data; use the arrows to check several records.
6. **Finish & Merge:**
   - **Edit Individual Documents** → creates one new document with all letters (review, save or print).
   - **Print Documents** → print directly.
   - **Send Email Messages** → sends personalised emails (requires Outlook set up, choose the email field and subject).

Your merged letter:

```
Dear Parent/Guardian of «FirstName» «LastName»,

Our records show a fee balance of KSh «Balance» for «FirstName» (Class «Class»)
as at 2 October 2026. Kindly clear the balance by 31 October 2026 through
the school paybill.
```

### Rules: personalise further

**Mailings → Rules** adds logic:
- **If...Then...Else:** e.g. if `Balance` = 0, print "Thank you for clearing all fees."; otherwise, print the balance reminder.
- **Skip Record If:** don't produce letters for some records (e.g. Balance equals 0).
- **Fill-in / Ask:** prompt for a value at merge time.

### Formatting numbers and dates in merges

Merged numbers sometimes lose formatting (12500 instead of 12,500). Fix with field codes:
1. Right-click the field → **Toggle Field Codes** → you'll see `{ MERGEFIELD Balance }`.
2. Change it to `{ MERGEFIELD Balance \# "#,##0" }` for thousands separators (or `\# "#,##0.00"` for decimals).
3. For dates: `{ MERGEFIELD DueDate \@ "d MMMM yyyy" }` shows "31 October 2026".
4. Right-click → Update Field, then Toggle Field Codes back.

### Labels and certificates

- **Labels:** Mailings → Start Mail Merge → **Labels** → choose the label brand/size (matching your label sheets) → select recipients → insert fields in the first label → **Update Labels** (copies the layout to all labels) → Finish & Merge.
- **Certificates:** design one certificate (landscape, borders, logo), insert «FullName» and «Course» fields, merge to individual documents, then export to PDF.

### Google Docs alternatives

Google Docs doesn't have built-in mail merge for letters in the free version; options include Google Workspace mail merge features in Gmail (for some editions), or add-ons/extensions for Docs and Sheets. Many people do mail merges in Word with an Excel or Google Sheets (downloaded) data source.

:::think A school merges fee letters but every balance shows as "12500" without commas, and some parents with zero balance still get reminder letters. How would you fix both problems?
Add a number format switch to the field (`\# "#,##0"`) so balances show as 12,500. Use **Edit Recipient List** to filter out records where Balance equals 0, or a **Skip Record If** rule, or an **If...Then...Else** rule that prints a thank-you message instead of a reminder.
:::

### Privacy and accuracy

- Mail merges often use personal data (names, phones, balances): store the data securely and use it only for the intended purpose (Data Protection Act).
- **Preview and spot-check** before printing or emailing hundreds of documents; a mistake repeated 500 times is embarrassing and costly.
- For emails, send a **test** to yourself first.

## Practice tasks

1. Create a weekly timetable table with merged header cells, repeated header row and banded rows.
2. Build an invoice table with a `=SUM(ABOVE)` total and right-aligned numbers.
3. Create an Excel list of 10 people and mail merge personalised event invitations.
4. Add an If...Then...Else rule that changes the message based on a value.
5. Make a page of address labels from the same list.

## Summary

- Tables: insert, add/delete rows and columns, merge/split cells, table styles, repeat header rows, convert text to tables, sort and simple formulas (F9 to update).
- Mail merge combines a template with a data source to create personalised letters, emails, labels and certificates.
- Prepare clean Excel data (one header row, no blanks), then Mailings → Start Mail Merge → Select Recipients → Insert Merge Fields → Preview → Finish & Merge.
- Use Rules (If...Then...Else, Skip Record If) and field switches for number/date formats.
- Protect personal data and preview before printing or sending.

```quiz
Q: Which key moves to the next cell in a Word table?
A: Tab
Q: Which option shows the header row on every page of a long table? (three words)
A: Repeat Header Rows
Q: Which Word table formula totals the numbers above?
A: =SUM(ABOVE) | SUM(ABOVE)
Q: In mail merge, what is the list of names and details called? (two words)
A: data source
Q: Which Word tab contains mail merge commands?
A: Mailings
Q: Which mail merge rule prints different text depending on a value?
A: If...Then...Else | If Then Else | IF
Q: Which field switch adds thousands separators? Write it like \# "#,##0".
A: \# "#,##0" | #,##0
```
