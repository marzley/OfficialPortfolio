from common import track, lesson

# ---------------- Digital literacy & online safety ----------------
dl = track("digital-literacy", "Digital literacy & online safety", "none",
           "Use phones, the internet and email with confidence: strong passwords, avoiding M-Pesa and online scams, privacy and checking fake news.")

lesson(dl, "internet-basics", "Using the internet well", """
# Using the internet well

## Browsers and search engines

- A **browser** opens websites: Chrome, Firefox, Edge, Safari, Opera Mini (saves data).
- A **search engine** finds websites: Google, Bing, DuckDuckGo.
- A **URL** is a web address: `https://marzleytechsolutions.co.ke/learn/`

## Search like a pro

| Trick | Example | Finds |
|---|---|---|
| Quotes for an exact phrase | `"KCSE results 2025"` | Only pages with that exact phrase |
| Minus to exclude | `laptops nairobi -used` | Laptops, not used ones |
| site: to search one website | `site:kra.go.ke nil returns` | Only KRA pages |
| filetype: for documents | `business plan template filetype:pdf` | PDF files |
| Ask a clear question | `how to transfer airtime safaricom` | Step-by-step answers |

## Save mobile data

- Turn off auto-play for videos on Facebook, Instagram and WhatsApp.
- In WhatsApp: **Settings → Storage and data → Media auto-download** → only on Wi-Fi.
- Download Google Maps areas and YouTube videos on Wi-Fi to use offline.
- Use **Data Saver** in Android settings and "Lite" apps.
- Check your data balance: Safaricom `*544#` to buy bundles; also the My Safaricom / MySafaricom app.

## Bookmarks, tabs and downloads

- **Ctrl+D** bookmarks a page. **Ctrl+T** opens a new tab. **Ctrl+Shift+T** reopens a closed tab.
- Downloads go to the **Downloads** folder by default.

```quiz
Q: What do you put around words to search for an exact phrase?
A: quotes | quotation marks | ""
Q: Which search operator limits results to one website? (write it with the colon)
A: site:
Q: Which keyboard shortcut reopens a tab you just closed?
A: Ctrl+Shift+T | ctrl shift t
Q: Which search operator finds a specific file type? (write it with the colon)
A: filetype:
```
""")

lesson(dl, "passwords-2fa", "Passwords and two-step verification", """
# Passwords and two-step verification

Most accounts are hacked because of **weak or reused passwords**, not clever hacking.

## A strong password

- At least **12 characters**. Longer is stronger.
- A **passphrase** is easy to remember and hard to guess: `Mango-Bus-Kisumu-Rain-42!`
- Never use your name, phone number, ID number, birthday or `123456`.
- **Different password for every important account.** If one site leaks, the others stay safe.

## Use a password manager

A password manager remembers all your passwords and creates strong ones. Free options: **Google Password Manager** (built into Chrome and Android), **Bitwarden**, and **Apple Passwords** on iPhone.

## Turn on two-step verification (2FA)

Even if someone steals your password, they also need a code from your phone.

- **Gmail**: myaccount.google.com → Security → 2-Step Verification
- **WhatsApp**: Settings → Account → **Two-step verification** → set a 6-digit PIN. This stops people hijacking your WhatsApp with a stolen SMS code.
- **Facebook / Instagram**: Accounts Centre → Password and security → Two-factor authentication

Authenticator apps (Google Authenticator, Microsoft Authenticator) are safer than SMS codes.

## Never share

- Your **M-Pesa PIN**, bank PIN or one-time codes (OTPs) with **anyone**, including people who say they're from Safaricom or your bank.
- The 6-digit WhatsApp registration code. Nobody legitimate needs it.

```quiz
Q: What is the minimum recommended password length in characters?
A: 12 | twelve
Q: What does 2FA stand for?
A: two-factor authentication | two factor authentication
Q: Should you use the same password on several sites? (yes or no)
A: no
Q: Where in WhatsApp do you set a 6-digit PIN? (three words)
A: two-step verification | two step verification
```
""")

lesson(dl, "scams", "Spotting M-Pesa and online scams", """
# Spotting M-Pesa and online scams

Scammers rely on **urgency, fear and greed**. Learn the common tricks so you and your family don't lose money.

## Common scams in Kenya

| Scam | How it works | Warning sign |
|---|---|---|
| "Wrong transaction" | A fake SMS says money was sent to you by mistake, then a call asks you to send it back | Check your **real** M-Pesa balance. Real M-Pesa messages come from "MPESA" and your balance changes |
| Fake Safaricom / bank calls | "Your line will be blocked, give us the code we've sent you" | Safaricom's customer care is **100** or **200**; they never ask for your PIN |
| Fake jobs | "Pay KSh 2,000 for a medical / uniform to secure the job" | Real employers don't charge you to get hired |
| Fake online shops | Cheap phones on Facebook/TikTok; pay first, nothing arrives | Too cheap, no physical address, pressure to pay now |
| Phishing links | "Your account is suspended, log in here" | Misspelt web address, urgent threat |
| Investment / crypto schemes | "Double your money in 7 days" | Guaranteed high returns = scam |
| Sim swap | Someone gets a new SIM with your number to receive your codes | Your phone suddenly loses network |

## Protect yourself

1. **Stop and verify.** Hang up and call the official number yourself.
2. **Never share PINs or OTP codes.**
3. **Check links** before tapping: look at the real address, not the display text.
4. Use **Hakikisha** / check the till or paybill name before paying: the M-Pesa confirmation screen shows the registered name.
5. Forward scam SMS messages to **333** (Safaricom's free fraud reporting line).
6. Report cybercrime to the **DCI** or the National KE-CIRT/CC (Communications Authority).

```quiz
Q: Which Safaricom short code do you forward scam SMS messages to?
A: 333
Q: Does Safaricom ever need your M-Pesa PIN? (yes or no)
A: no
Q: A fake message with a link asking you to log in is called…
A: phishing
Q: If your phone suddenly loses network and you get no calls, what scam might be happening? (two words)
A: sim swap | sim-swap
```
""")

lesson(dl, "privacy-fake-news", "Privacy, digital footprint and fake news", """
# Privacy, digital footprint and fake news

## Your digital footprint

Everything you post, like and share leaves a trail. Employers, universities and scammers can see it.

- Think before posting: would you be happy for your future boss to see it?
- Check privacy settings: who can see your posts, phone number and friends list.
- Turn off **location** on photos and in apps that don't need it.
- Be careful with quizzes and apps asking to "log in with Facebook".

## Kenya's Data Protection Act (2019)

Organisations that collect your personal data (name, ID number, phone, location) must tell you why, keep it safe and let you see or delete it. Complaints go to the **Office of the Data Protection Commissioner (ODPC)**.

## Checking fake news

Before you share, use **SIFT**:

1. **S**top: are you reacting emotionally? That's what fake news wants.
2. **I**nvestigate the source: is it a known news site or an anonymous page?
3. **F**ind better coverage: do trusted outlets report the same thing?
4. **T**race to the original: where did the photo, video or quote first appear?

Tools: **Google Reverse Image Search / Google Lens** shows where a photo appeared before. Fact-checkers such as **PesaCheck** and **Africa Check** investigate viral claims.

## Healthy digital habits

- Screen time settings (Android: Digital Wellbeing; iPhone: Screen Time).
- Block and report people who harass you. Cyberbullying and online harassment are offences under Kenya's Computer Misuse and Cybercrimes Act (2018).

```quiz
Q: In what year was Kenya's Data Protection Act passed?
A: 2019
Q: What does the S in SIFT stand for?
A: Stop
Q: Which Google tool helps you find where a photo appeared before? (two words)
A: Google Lens | reverse image search | Google reverse image search
Q: Name one African fact-checking organisation mentioned.
A: PesaCheck | Africa Check
```
""")

# ---------------- Microsoft Word & Google Docs ----------------
w = track("ms-word", "Microsoft Word & Google Docs", "none",
          "Create professional documents: formatting, styles, tables, CVs, letters, table of contents and mail merge.")

lesson(w, "formatting", "Formatting documents like a pro", """
# Formatting documents like a pro

Whether you use **Microsoft Word** or free **Google Docs** (docs.google.com), the same skills apply.

## Essential shortcuts (Windows; use Cmd on Mac)

| Shortcut | Action |
|---|---|
| Ctrl+B / Ctrl+I / Ctrl+U | Bold / Italic / Underline |
| Ctrl+C / Ctrl+X / Ctrl+V | Copy / Cut / Paste |
| Ctrl+Z / Ctrl+Y | Undo / Redo |
| Ctrl+S | Save |
| Ctrl+F / Ctrl+H | Find / Find and replace |
| Ctrl+E / Ctrl+L / Ctrl+R / Ctrl+J | Centre / Left / Right / Justify |
| Ctrl+Enter | Page break (start a new page) |
| Ctrl+P | Print |

## Font and paragraph settings

- Professional fonts: **Calibri**, **Arial**, **Times New Roman** or **Cambria**, size **11–12** for body text.
- **Line spacing** 1.15 or 1.5 for easy reading.
- Use **Space After** paragraphs (e.g. 6 pt) instead of pressing Enter twice.
- **Margins**: Layout → Margins → Normal (2.54 cm / 1 inch).
- Use **tabs and indents** (the ruler), not lots of spaces, to line up text.

## Show hidden formatting

Click the **¶** (Show/Hide) button to see spaces, tabs and paragraph marks. It helps you find why a layout looks wrong.

## Paste without messy formatting

**Ctrl+Shift+V** (Google Docs, and Word 365) pastes plain text so copied text matches your document.

```quiz
Q: Which shortcut opens Find and Replace in Word?
A: Ctrl+H | ctrl h
Q: Which shortcut starts a new page?
A: Ctrl+Enter | ctrl enter
Q: Which button shows spaces, tabs and paragraph marks? (the symbol's name or ¶)
A: ¶ | show/hide | pilcrow | show hide
Q: What font size is normal for body text? (give 11 or 12)
A: 11 | 12
```
""")

lesson(w, "styles-toc", "Styles, headings and a table of contents", """
# Styles, headings and a table of contents

**Styles** are saved formats (font, size, colour, spacing). They're the secret to long documents like reports, projects and proposals.

## Why use heading styles

- Change every heading at once by editing the style.
- The **Navigation Pane** (View → Navigation Pane) lets you jump between sections.
- Word can build a **table of contents** automatically.

## How to

1. Select a chapter title and click **Heading 1** in the Home tab.
2. Sub-sections get **Heading 2**, then **Heading 3**.
3. Put the cursor where the contents page goes → **References → Table of Contents** → choose a style.
4. After editing, right-click the table → **Update Field → Update entire table**.

In Google Docs: **Insert → Table of contents**.

## Page numbers, headers and footers

- **Insert → Page Number** → Bottom of Page.
- To start numbering after the cover page: put a **Section Break (Next Page)** after the cover (Layout → Breaks), then untick **Link to Previous** in the next section's footer.
- Headers/footers are great for the document title or your school/company name.

## Captions and references

- Right-click a picture or table → **Insert Caption** ("Figure 1", "Table 1").
- **References → Insert Citation** and **Bibliography** create reference lists in APA or Harvard style for academic work.

```quiz
Q: Which tab contains the Table of Contents command?
A: References
Q: Which style should chapter titles use? (two words)
A: Heading 1
Q: What do you insert to start page numbering on a later page? (two words)
A: section break | a section break
Q: How do you add "Figure 1" under a picture? (two words)
A: Insert Caption | caption
```
""")

lesson(w, "cv-letters", "Writing a CV and formal letters", """
# Writing a CV and formal letters

## A strong CV (1–2 pages)

1. **Contact details**: name, phone, professional email (not `sweetgirl99@...`), town, LinkedIn.
2. **Profile**: 2–3 lines on who you are and what you offer.
3. **Skills**: specific ones (Excel pivot tables, graphic design with Canva, customer service).
4. **Experience**: most recent first. Use action verbs and results: "Increased shop sales by 20% by starting a WhatsApp catalogue".
5. **Education and certifications**: KCSE, college, online certificates.
6. **Referees**: 2–3 people, or "Available on request".

Tips: use a clean template, one font, clear headings, no photo unless asked, save and send as **PDF** named `Firstname-Lastname-CV.pdf`.

## Formal (business) letter layout

```
Your name
P.O. Box 123-00100, Nairobi
0712 345 678 · you@email.com

28 September 2026

The Human Resources Manager
ABC Company Ltd
P.O. Box 456-00200, Nairobi

Dear Sir/Madam,

RE: APPLICATION FOR THE POSITION OF ICT ASSISTANT

Opening: say why you're writing and where you saw the job.
Body: two short paragraphs on your skills and experience that match the job.
Closing: say you're available for an interview and thank them.

Yours faithfully,
(signature)
Your name
```

- "Dear Sir/Madam" → **Yours faithfully**. "Dear Ms Wanjiku" → **Yours sincerely**.
- Keep it to one page.

## Templates

Word: **File → New** and search "CV" or "letter". Google Docs: **Template gallery**. Canva also has good CV templates.

```quiz
Q: Which ending goes with "Dear Sir/Madam"? (two words)
A: Yours faithfully
Q: Which ending goes with "Dear Ms Wanjiku"? (two words)
A: Yours sincerely
Q: In what file format should you usually send a CV?
A: PDF
Q: In the experience section, list jobs from most recent or oldest first?
A: most recent | most recent first | recent
```
""")

lesson(w, "tables-mail-merge", "Tables and mail merge", """
# Tables and mail merge

## Tables

- **Insert → Table**, choose rows and columns.
- **Table Design** tab: styles, shading, borders. **Layout** tab: merge cells, add rows, align text.
- Repeat the header row on every page: select it → Layout → **Repeat Header Rows**.
- Word tables can even do sums: Layout → **Formula** → `=SUM(ABOVE)`.

## Mail merge: 100 personalised letters in minutes

Use it for invitations, fee reminders, certificates or labels.

1. Make an Excel list with columns such as `Name`, `Class`, `Balance`.
2. In Word: **Mailings → Start Mail Merge → Letters**.
3. **Select Recipients → Use an Existing List** → choose the Excel file.
4. Write the letter and click **Insert Merge Field** where the name, class and balance go:

```
Dear «Name»,
This is a reminder that «Name» in «Class» has a fee balance of KSh «Balance».
```

5. **Preview Results** to check.
6. **Finish & Merge → Edit Individual Documents** (to save/print) or **Send Email Messages**.

Google Docs users can use add-ons like "Mail Merge" or Gmail's built-in mail merge in Google Workspace business plans.

```quiz
Q: Which Word tab contains Mail Merge?
A: Mailings
Q: What formula adds up the numbers above in a Word table?
A: =SUM(ABOVE) | SUM(ABOVE)
Q: Which kind of file usually holds the list of names for a mail merge?
A: Excel | spreadsheet | excel spreadsheet
```
""")

# ---------------- Excel & Google Sheets ----------------
x = track("excel", "Excel & Google Sheets", "none",
          "From basic formulas to VLOOKUP, IF, pivot tables and charts. The number one computer skill employers ask for in Kenya.")

lesson(x, "basics", "Spreadsheet basics", """
# Spreadsheet basics

A spreadsheet is a grid of **cells**. Columns have letters (A, B, C…), rows have numbers (1, 2, 3…). Cell **B3** is column B, row 3.

**Excel** is part of Microsoft 365; **Google Sheets** (sheets.google.com) is free and works on phones. Almost everything here works in both.

## Entering data

- Put **one type of thing per column** (Date, Item, Quantity, Price) with a heading in row 1.
- No empty rows in the middle of a table.
- Numbers should be numbers: type `1500`, not `KSh 1,500`. Use **Format → Number/Currency** to show "KSh".

## Formulas start with =

| Formula | Result |
|---|---|
| `=5+3` | 8 |
| `=B2*C2` | Quantity × price |
| `=B2-B3` | Difference |
| `=B2/4` | Divide |
| `=B2^2` | Power |

## Fill handle

Type a formula in D2, then drag the small square at the cell's bottom-right corner down: Excel copies it to every row, adjusting `B2` to `B3`, `B4`… This is called a **relative reference**.

## Absolute references with $

To always point to the same cell (for example a VAT rate in F1), use `$`:

```
=D2*$F$1
```

Press **F4** after typing a cell reference to add the dollar signs.

## Handy shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+Arrow | Jump to the end of the data |
| Ctrl+Shift+L | Turn filters on/off |
| Ctrl+T | Format as a table |
| Alt+= | AutoSum |
| Ctrl+; | Insert today's date |

```quiz
Q: What character must every formula start with?
A: = | equals | equal sign
Q: In cell reference C7, what is the column?
A: C
Q: Which key adds $ signs to make a reference absolute?
A: F4
Q: Which shortcut inserts AutoSum? (write like Alt+=)
A: Alt+= | alt =
```
""")

lesson(x, "functions", "Essential functions: SUM, AVERAGE, IF and COUNTIF", """
# Essential functions

Imagine marks in cells **B2:B31** (30 students).

| Function | Example | Does |
|---|---|---|
| SUM | `=SUM(B2:B31)` | Adds the range |
| AVERAGE | `=AVERAGE(B2:B31)` | Mean |
| MAX / MIN | `=MAX(B2:B31)` | Highest / lowest |
| COUNT | `=COUNT(B2:B31)` | How many cells contain numbers |
| COUNTA | `=COUNTA(A2:A31)` | How many cells are not empty |
| ROUND | `=ROUND(C2, 0)` | Round to whole numbers |
| RANK | `=RANK(B2, $B$2:$B$31)` | Position (1 = top) |

## IF: make decisions

```
=IF(B2>=50, "Pass", "Fail")
```

Nested IF for grades (or use IFS in newer Excel):

```
=IF(B2>=70,"A",IF(B2>=60,"B",IF(B2>=50,"C",IF(B2>=40,"D","E"))))
=IFS(B2>=70,"A", B2>=60,"B", B2>=50,"C", B2>=40,"D", TRUE,"E")
```

## Counting and adding with conditions

```
=COUNTIF(C2:C31, "Pass")               how many passed
=COUNTIF(B2:B31, ">=70")               how many scored 70+
=SUMIF(A2:A100, "Sugar", D2:D100)      total sales of sugar
=AVERAGEIF(E2:E31, "Form 3", B2:B31)   average for Form 3
=COUNTIFS(C2:C31,"Pass", E2:E31,"Form 3")   several conditions
```

## Text functions

```
=A2 & " " & B2                  join first and last name
=UPPER(A2)  =PROPER(A2)         CAPITALS / Title Case
=LEFT(A2, 4)  =RIGHT(A2, 3)     first 4 / last 3 characters
=TRIM(A2)                       remove extra spaces
=TEXT(D2, "#,##0")              1500 → 1,500
```

```quiz
Q: Which function counts cells that meet one condition?
A: COUNTIF
Q: Write the formula to show "Pass" if B2 is 50 or more, otherwise "Fail".
A: =IF(B2>=50,"Pass","Fail") | =IF(B2>=50, "Pass", "Fail") | IF(B2>=50,"Pass","Fail")
Q: Which function adds numbers that meet a condition?
A: SUMIF
Q: Which function removes extra spaces from text?
A: TRIM
```
""")

lesson(x, "lookups", "VLOOKUP, XLOOKUP and IFERROR", """
# VLOOKUP, XLOOKUP and IFERROR

Lookups find information in a table, like the price of a product from its code.

Price list in **A2:C50**: `Code | Product | Price`

## VLOOKUP

```
=VLOOKUP(F2, $A$2:$C$50, 3, FALSE)
```

- `F2`: what to look for (the product code)
- `$A$2:$C$50`: the table (the code must be in the **first** column)
- `3`: return the 3rd column (Price)
- `FALSE`: exact match only (almost always what you want)

## XLOOKUP (Excel 365/2021 and Google Sheets)

Easier and more powerful: it can look left, and it has a built-in "not found" message.

```
=XLOOKUP(F2, A2:A50, C2:C50, "Not found")
```

## INDEX + MATCH (works in every version)

```
=INDEX(C2:C50, MATCH(F2, A2:A50, 0))
```

## IFERROR: hide ugly errors

```
=IFERROR(VLOOKUP(F2, $A$2:$C$50, 3, FALSE), "Check code")
```

## Common errors

| Error | Meaning |
|---|---|
| `#N/A` | Lookup value not found |
| `#DIV/0!` | Divided by zero (or an empty cell) |
| `#VALUE!` | Wrong type, e.g. text in a sum |
| `#REF!` | A referenced cell was deleted |
| `#NAME?` | Misspelt function name |
| `#####` | Column too narrow: make it wider |

```quiz
Q: In VLOOKUP, what should the last argument be for an exact match?
A: FALSE | 0
Q: Which newer function can look to the left and has a built-in 'not found' value?
A: XLOOKUP
Q: Which error means a lookup value was not found?
A: #N/A | N/A
Q: What does ##### in a cell usually mean? (the column is too …)
A: narrow | too narrow
```
""")

lesson(x, "charts-pivots", "Charts, sorting, filters and pivot tables", """
# Charts, sorting, filters and pivot tables

## Sort and filter

- Click inside your table → **Data → Sort** (e.g. by Sales, largest to smallest).
- **Ctrl+Shift+L** adds filter arrows: show only "Nairobi" or only "Paid".
- **Conditional formatting** (Home tab) colours cells automatically: red for balances over 10,000, green for marks above 70, data bars and colour scales.

## Choosing the right chart

| You want to show | Use |
|---|---|
| Comparing categories (sales per branch) | Column or bar chart |
| Change over time (monthly sales) | Line chart |
| Parts of a whole (few categories) | Pie or doughnut, max 5–6 slices |
| Relationship between two numbers | Scatter chart |

Select the data → **Insert → Recommended Charts**. Always add a clear title and axis labels.

## Pivot tables: summaries in seconds

Sales list: `Date | Branch | Product | Amount` (thousands of rows).

1. Click in the data → **Insert → PivotTable** → New worksheet.
2. Drag **Branch** to Rows, **Product** to Columns, **Amount** to Values.
3. Instantly see total sales per branch per product. Drag **Date** to Filters or group it by month (right-click → Group).

Pivot tables are the skill that most impresses employers in interviews for accounts, admin and data roles.

## Protect and share

- **Review → Protect Sheet** to stop formulas being changed.
- **Data Validation** creates drop-down lists and stops wrong entries (e.g. only numbers 0–100).
- Google Sheets: **Share** with view/comment/edit rights; changes save automatically and show **Version history**.

```quiz
Q: Which chart type is best for showing change over time?
A: line | line chart
Q: Which tool summarises thousands of rows by dragging fields? (two words)
A: pivot table | pivottable
Q: Which feature creates drop-down lists and blocks wrong entries? (two words)
A: data validation
Q: Which feature colours cells automatically based on their value? (two words)
A: conditional formatting
```
""")

lesson(x, "practical-projects", "Practical Excel projects", """
# Practical Excel projects

Practise with these real-life sheets. Build each one from scratch.

## 1. Shop sales book

Columns: `Date | Item | Qty | Unit price | Total | Payment (Cash/M-Pesa)`

- Total: `=C2*D2`
- Today's sales: `=SUMIF(A:A, TODAY(), E:E)`
- M-Pesa vs cash: `=SUMIF(F:F, "M-Pesa", E:E)`
- A pivot table of sales per item per month.

## 2. Student mark sheet

Columns: `Name | English | Kiswahili | Maths | Science | Total | Mean | Grade | Position`

- Total: `=SUM(B2:E2)`, Mean: `=AVERAGE(B2:E2)`
- Grade with IFS, Position with `=RANK(F2, $F$2:$F$41)`
- Conditional formatting: red below 40, green 70+.
- A column chart of mean per subject.

## 3. Personal budget

| Category | Budget | Actual | Difference |
|---|---|---|---|
| Rent | 8,000 | 8,000 | `=B2-C2` |
| Food | 6,000 | 7,200 | |
| Transport | 3,000 | 2,650 | |

- Total income, total spending, savings rate `=Savings/Income` formatted as %.
- A doughnut chart of spending by category.

## 4. Chama / SACCO contributions

Members down the side, months across the top, `=SUM` per member and per month, `=COUNTIF(B2:M2, 0)` to find missed months, and conditional formatting to highlight anyone behind.

## Learn more

- Microsoft's free Excel training: **support.microsoft.com/excel** (Excel video training)
- Google Sheets help centre and the free **Google Applied Digital Skills** lessons
- Certification: **Microsoft Office Specialist (MOS) Excel** is widely recognised by Kenyan employers.

```quiz
Q: Which function gives today's date?
A: TODAY | TODAY()
Q: Which function ranks a student's total among the class?
A: RANK
Q: Which certification is widely recognised for Excel skills? (three words, or MOS)
A: Microsoft Office Specialist | MOS
```
""")

# ---------------- PowerPoint & presentations ----------------
pp = track("powerpoint", "PowerPoint & presentations", "none",
           "Design clear slides and present with confidence: layouts, visuals, animations and speaking tips.")

lesson(pp, "slide-design", "Designing clear slides", """
# Designing clear slides

Tools: **Microsoft PowerPoint**, free **Google Slides**, or **Canva** presentations.

## The golden rules

- **One idea per slide.**
- **Few words**: a short title and at most 3–5 bullet points of a few words each. You speak the details.
- **Big text**: titles 36–44 pt, body at least 24 pt, so the back row can read it.
- **High contrast**: dark text on a light background or light on dark.
- **Pictures over paragraphs**: a photo, icon or chart explains faster.
- **Consistent design**: use one theme (Design tab) and the same fonts and colours throughout.

## Useful features

- **Design → Designer / Design Ideas** suggests professional layouts from your content.
- **Slide Master** (View → Slide Master): change the logo, fonts or colours on every slide at once.
- **Insert → SmartArt** turns bullet points into diagrams (process, cycle, hierarchy).
- **Insert → Chart** or paste from Excel.
- **Alignment tools**: select shapes → Shape Format → Align (left, centre, distribute).

## A simple structure

1. Title slide
2. The problem or question
3. 3 main points (one or two slides each)
4. Evidence: numbers, chart, photo, story
5. Summary and the action you want
6. Questions / thank you with contact details

```quiz
Q: How many ideas should each slide have?
A: one | 1
Q: What is the smallest recommended body text size in points? (a number)
A: 24 | 24 pt
Q: Which view changes the design of every slide at once? (two words)
A: Slide Master
Q: Which feature turns bullet points into diagrams?
A: SmartArt | smart art
```
""")

lesson(pp, "animations-delivery", "Animations, video and presenting well", """
# Animations, video and presenting well

## Use animations carefully

- **Transitions** (between slides): pick one subtle one like Fade or Morph, and use it everywhere.
- **Animations** (on objects): use them to reveal points one at a time or show a process step by step. Avoid spinning, bouncing text.
- **Morph** transition (PowerPoint 365/2019+): duplicate a slide, move or resize objects, and PowerPoint animates the change smoothly.

## Media

- **Insert → Video** or **Audio**. Embedded files make the presentation large; compress with File → Info → Compress Media.
- Record your talk: **Record** tab (or Slide Show → Record) creates a video you can share.
- **Export → Create a Video** turns slides into an MP4 for WhatsApp or YouTube.

## Presenter tools

- **F5** starts from the beginning; **Shift+F5** from the current slide.
- **Presenter View** shows your notes and the next slide on your laptop while the audience sees only the slide.
- Press **B** to black out the screen and bring attention back to you.
- Type a slide number and press Enter to jump to it.

## Speaking tips

- Practise out loud at least 3 times and time yourself.
- Look at people, not the screen. Don't read your slides.
- Start with a hook: a question, a surprising number or a short story.
- Arrive early and test the projector, clicker and sound. Carry your file as **PDF and PPTX** on a flash drive and in Google Drive.

```quiz
Q: Which key starts a slideshow from the beginning?
A: F5
Q: Which view shows your notes privately while presenting? (two words)
A: Presenter View
Q: Which key blacks out the screen during a slideshow?
A: B
Q: Which PowerPoint transition animates the changes between two similar slides?
A: Morph
```
""")

# ---------------- Google Workspace & cloud ----------------
gw = track("google-workspace", "Email, Google Drive & cloud tools", "none",
           "Work like a modern office: professional email, Google Drive, sharing files, online meetings and collaboration.")

lesson(gw, "email", "Professional email", """
# Professional email

## Set up

- Use a professional address: `firstname.lastname@gmail.com` or your company domain (`info@yourbusiness.co.ke`), not `hotboy254@...`.
- Add a **signature**: name, role, phone, website (Gmail: Settings → See all settings → Signature).
- Add a profile photo so people recognise you.

## Writing a good email

1. **Subject line** says what it's about: "Quotation for school website – Gatanga TVC".
2. **Greeting**: "Dear Mr Kamau," or "Hello Achieng,".
3. **Short body**: the purpose in the first line, details in short paragraphs, what you need and by when.
4. **Closing**: "Kind regards," + your signature.
5. **Attachments**: PDF where possible; mention them in the email; check they're attached before sending.

## To, CC and BCC

| Field | Use |
|---|---|
| To | The people who must act |
| CC (carbon copy) | People who should be informed |
| BCC (blind carbon copy) | Hidden recipients: use for mass emails so addresses stay private |

## Gmail power tools

- **Labels** and **filters** to sort mail automatically.
- **Schedule send** (arrow beside Send).
- **Undo send** (set to 30 seconds in settings).
- **Search**: `from:kra.go.ke has:attachment`, `is:unread older_than:7d`.
- Don't click links or open attachments you weren't expecting.

```quiz
Q: Which field hides recipients from each other?
A: BCC | blind carbon copy
Q: Which field is for people who only need to be informed?
A: CC | carbon copy
Q: Which Gmail search finds emails with attachments? (write has:…)
A: has:attachment
```
""")

lesson(gw, "drive-collaboration", "Google Drive and working together", """
# Google Drive and working together

**Google Drive** gives every Google account **15 GB** free storage shared across Gmail, Drive and Photos.

## Organise

- Create folders by client, subject or year.
- Upload by dragging files in, or with the Drive app on your phone (it can **scan** documents to PDF with the camera).
- **Starred** and **Recent** find files quickly; search even finds words inside PDFs and images.

## Share safely

Click **Share**:

| Permission | Can |
|---|---|
| Viewer | Only see |
| Commenter | See and comment |
| Editor | Change everything |

- "Anyone with the link" is convenient but public to whoever gets the link. Use "Restricted" for private files (fee lists, IDs, contracts).
- Remove access when a project ends.

## Collaborate in real time

- Several people edit the same Docs, Sheets or Slides file at once and see each other's cursors.
- **Comments** (Ctrl+Alt+M) and **@mentions** assign tasks.
- **Suggesting mode** (like Track Changes in Word) lets others approve edits.
- **File → Version history** restores older versions.

## Other cloud tools

- **Google Forms**: surveys, registrations, quizzes that mark themselves; answers go to a Sheet.
- **Google Meet / Zoom / Microsoft Teams**: video meetings. Mute when not speaking, use a headset, share your screen.
- **OneDrive** and **Dropbox**: alternatives to Drive.
- **Backups**: keep important files in the cloud **and** on an external drive (the 3-2-1 rule: 3 copies, 2 types of storage, 1 off-site).

```quiz
Q: How many GB of free storage does a Google account get?
A: 15 | 15 GB
Q: Which sharing permission can only see a file?
A: Viewer
Q: Which Google tool creates surveys whose answers go to a spreadsheet?
A: Google Forms | Forms
Q: In the 3-2-1 backup rule, how many copies should you keep?
A: 3 | three
```
""")

# ---------------- AI tools ----------------
ai = track("ai-tools", "AI tools for work & study", "none",
           "Use AI assistants like ChatGPT, Claude and Gemini wisely: writing prompts, real uses for business and study, and knowing their limits.")

lesson(ai, "what-is-ai", "What is AI?", """
# What is AI?

**Artificial intelligence (AI)** is software that does tasks that normally need human thinking: understanding language, recognising images, making predictions.

## Types you'll meet

| Type | Examples |
|---|---|
| **Generative AI / chatbots** (large language models) | ChatGPT, Claude, Gemini, Microsoft Copilot, Meta AI in WhatsApp |
| Image generation | Canva Magic Media, Adobe Firefly, Midjourney |
| Speech | Voice typing, transcription, translation |
| Recommendation | YouTube, TikTok and Netflix suggestions |
| Prediction | Fraud detection at banks and M-Pesa, credit scoring for mobile loans |

## How chatbots work (simply)

A **large language model (LLM)** learned patterns from huge amounts of text. When you ask something, it predicts a helpful answer one piece at a time. This makes it great at writing, summarising, explaining and brainstorming, but it can also sound confident while being **wrong** (this is called a **hallucination**).

## Good uses

- Drafting emails, posts, CVs and proposals (then editing them yourself).
- Explaining a hard topic simply, or in Kiswahili.
- Brainstorming business names, content ideas, questions to revise.
- Summarising long documents.
- Helping to write and debug code.

## Be careful with

- Facts, numbers, laws, medical and legal advice: **check** with trusted sources.
- Private data: don't paste ID numbers, passwords, client files or patient records into public tools.
- School and exam rules: many institutions have AI policies; using AI to cheat can lead to penalties.

```quiz
Q: What does LLM stand for?
A: large language model
Q: When an AI confidently gives a false answer, it's called a…
A: hallucination
Q: Should you paste passwords or ID numbers into a public AI chatbot? (yes or no)
A: no
```
""")

lesson(ai, "prompting", "Writing good prompts", """
# Writing good prompts

The quality of the answer depends on the quality of your request (the **prompt**).

## The recipe: Role, Task, Context, Format

Weak: *"Write a Facebook post about my salon."*

Strong:

```
You are a social media manager for a small beauty salon in Thika.
Write 3 short Facebook posts announcing a 20% discount on braids
this Friday and Saturday only. Our customers are working women aged 20-40.
Use a friendly tone with a little Sheng, include 2 emojis each,
and end with "Book on WhatsApp 0712 345 678".
```

## Tips

- **Give context**: who it's for, your goal, your location, your budget.
- **Say the format**: bullet list, table, 100 words, email, step-by-step.
- **Give examples** of the style you like.
- **Iterate**: "Make it shorter", "more formal", "explain step 3 in detail", "give me 5 more options".
- **Ask it to ask you**: "Before you answer, ask me any questions you need."
- **Ask for reasoning or sources** for facts, then verify them.

## Prompt ideas to try

- "Explain subnetting to a Form 4 student using an estate and house numbers as an example."
- "Create a 4-week study timetable for KCSE Chemistry revision, 1 hour a day."
- "Here is my CV [paste]. Improve it for an ICT support job; keep it to one page."
- "Turn these meeting notes into a short summary with action points and owners."
- "Write Python code that reads a CSV of sales and prints total sales per month. Explain each line."

```quiz
Q: What is the text you give an AI tool called?
A: prompt | a prompt
Q: In the recipe Role, Task, Context, ___ — what is the fourth part?
A: Format
Q: After the first answer, should you refine your request with follow-ups? (yes or no)
A: yes
```
""")

lesson(ai, "ai-for-business", "AI for business, study and earning", """
# AI for business, study and earning

## Business

- **Marketing**: captions, product descriptions, ad copy, blog outlines, content calendars.
- **Customer service**: draft replies to common questions; FAQ pages; WhatsApp message templates.
- **Admin**: meeting summaries, letters, quotations, simple contracts to review with a lawyer.
- **Data**: explain Excel formulas, analyse a sales table, suggest charts.
- **Design**: Canva Magic Studio for images and layouts; remove backgrounds; resize designs.

## Study

- Ask for explanations at your level, then ask it to **quiz you**.
- Turn notes into flashcards and practice questions.
- Get feedback on your essay's structure (but write it yourself).
- Learn to code: paste an error message and ask what it means.

## Earning with AI skills

- Offer social media management for small businesses, using AI to work faster.
- Writing and editing services (always edit AI drafts to be accurate and natural).
- Data entry and cleaning with AI-assisted Excel.
- Building simple websites and chatbots.

## Responsible use checklist

- ✔ Check facts, numbers and names.
- ✔ Keep private and client data out of public tools.
- ✔ Be honest when work is AI-assisted if your school, client or employer requires it.
- ✔ Add your own knowledge, local context and voice. That's what clients pay for.

```quiz
Q: Which Canva feature set includes AI image and design tools? (two words)
A: Magic Studio
Q: Should you check facts and numbers in AI answers? (yes or no)
A: yes
Q: What is the main thing clients pay for that AI can't replace? (your own knowledge, context and …)
A: voice | your voice | judgement | experience
```
""")

# ---------------- Kenya e-services ----------------
ke = track("e-services-kenya", "Online government services (Kenya)", "none",
           "Use eCitizen, KRA iTax, NTSA, KUCCPS, HELB and other online services safely and confidently: a valuable skill for cyber café work too.")

lesson(ke, "ecitizen", "eCitizen: government services online", """
# eCitizen: government services online

**eCitizen** (ecitizen.go.ke) is the Government of Kenya's main portal for applying and paying for services online.

## Services you can reach through eCitizen

- **Passports** and other immigration services
- **Certificate of Good Conduct** (DCI police clearance)
- **Business name and company registration** (Business Registration Service)
- **Driving licence** and vehicle services (via NTSA)
- Birth and death certificates (Civil Registration)
- Many county and ministry services

## Creating an account

1. Go to **ecitizen.go.ke** and choose **Create account** as a citizen.
2. Enter your **ID number**, names as on your ID, phone number and email.
3. Verify with the code sent to your phone/email.
4. Set a strong password and keep your login private.

## Paying

Payments are made on the portal by **M-Pesa (Paybill)**, card or bank. Always use the **bill reference/account number** shown on your invoice, and keep the payment confirmation.

## Stay safe

- Only use addresses that end in **.go.ke**. Fake sites copy the look of government pages.
- Government never asks for your password by phone.
- Cyber café operators: log out after helping each customer, never save customers' passwords in the browser, and clear downloads.

> Fees, requirements and steps change. Always read the current instructions on the official page for the service.

```quiz
Q: What is the web address of eCitizen? (ecitizen.___)
A: ecitizen.go.ke | go.ke
Q: Which government agency issues the Certificate of Good Conduct? (3 letters)
A: DCI
Q: What should official Kenyan government web addresses end with?
A: .go.ke | go.ke
```
""")

lesson(ke, "kra-itax", "KRA PIN and iTax returns", """
# KRA PIN and iTax returns

The **Kenya Revenue Authority (KRA)** handles taxes through **iTax** (itax.kra.go.ke).

## KRA PIN

- A **PIN** is your tax number (e.g. A012345678Z). You need it for jobs, bank accounts, business registration, land and vehicle transactions and many tenders.
- Getting a PIN is **free** on iTax: choose **New PIN Registration**, select Individual, and fill in your ID details.

## Filing annual returns

Every person with a PIN must file an **income tax return** for the previous year by **30 June**, even if they had no income.

- **Nil return**: if you had no income in the year. On iTax: Returns → **File Nil Return** → Income Tax Resident Individual.
- **Employed**: your employer gives you a **P9 form** showing your salary and PAYE. You enter those figures in the return (iTax now pre-fills much of it).
- Late filing attracts a **penalty**, so file early.

## Other useful iTax services

- **Tax Compliance Certificate (TCC)**: often required for jobs and tenders; you can apply on iTax if your returns and payments are up to date.
- Checking and paying taxes via M-Pesa Paybill **572572** (KRA) using the payment registration number (PRN).
- Businesses: turnover tax, VAT and PAYE returns.

## Tips

- Keep your iTax password and email up to date; use **Reset password** if you forget it.
- Save every acknowledgement receipt PDF.
- Only use itax.kra.go.ke or the official **KRA M-Service** app.

> Tax rules and rates change with each Finance Act. Check the KRA website for current details.

```quiz
Q: What is the deadline for filing annual income tax returns in Kenya?
A: 30 June | 30th June | June 30
Q: What return do you file if you had no income? (two words)
A: nil return | a nil return
Q: What form does an employer give showing your yearly salary and PAYE? (2 characters)
A: P9 | P9 form
Q: What does TCC stand for?
A: Tax Compliance Certificate
```
""")

lesson(ke, "education-services", "KUCCPS, HELB, KNEC and other services", """
# KUCCPS, HELB, KNEC and other services

## Education

| Service | Website | Used for |
|---|---|---|
| **KUCCPS** | kuccps.ac.ke / students' portal | Choosing university and college courses after KCSE, revising choices |
| **HELB** | helb.co.ke | Student loans and bursaries (apply through the HELB portal or app), checking and repaying loans |
| **KNEC** | knec.go.ke | Exams; results via the official SMS service and portal |
| **TVETA / KNQA** | tveta.go.ke | Checking accredited TVET institutions and qualifications |

## Health, pensions and work

- **SHA** (Social Health Authority, which replaced NHIF in 2024): registration and contributions; check sha.go.ke.
- **NSSF** (nssf.or.ke): pension contributions and statements.
- **Public Service Commission** (psckjobs.go.ke) and county government websites for government job adverts.

## Transport

- **NTSA** services (driving licences, vehicle searches and transfers) are accessed through eCitizen.

## Cyber café skills checklist

If you work in or run a cyber café, these services are a major source of income. Be able to:

- Create accounts, reset passwords and verify phones/emails.
- Scan and upload documents at the right size and format (usually PDF or JPG).
- Take passport-style photos that meet the portal's rules.
- Explain fees clearly and give customers every receipt.
- Protect privacy: log out, delete downloaded ID scans, never keep customers' passwords.

```quiz
Q: Which body places KCSE students in university courses? (6 letters)
A: KUCCPS
Q: Which body gives student loans in Kenya? (4 letters)
A: HELB
Q: Which authority replaced NHIF in 2024? (3 letters)
A: SHA
Q: After helping a customer at a cyber café, should you log out of their account? (yes or no)
A: yes
```
""")

# ---------------- Computer hardware & maintenance ----------------
hw = track("computer-maintenance", "Computer hardware & maintenance", "none",
           "Know the parts inside a computer, buy the right laptop, install Windows, fix common problems and keep computers fast and virus-free.")

lesson(hw, "hardware-parts", "Parts of a computer", """
# Parts of a computer

## Inside the box

| Part | What it does | What to look for |
|---|---|---|
| **CPU** (processor) | The brain: does the calculations | Intel Core i3/i5/i7, AMD Ryzen 3/5/7; newer generation = faster |
| **RAM** (memory) | Short-term workspace; cleared when off | 8 GB minimum today; 16 GB for design and programming |
| **Storage** | Keeps files and programs | **SSD** (fast) rather than HDD (slow); 256–512 GB+ |
| **Motherboard** | Connects everything | |
| **GPU** (graphics) | Draws the screen; needed for gaming, video editing, AI | Integrated for office work; dedicated (NVIDIA/AMD) for heavy graphics |
| **PSU** (power supply) | Converts mains power for the parts | |
| **Battery** (laptops) | | Check its health before buying second-hand |

## Input, output and ports

- **Input**: keyboard, mouse, microphone, scanner, webcam.
- **Output**: monitor, printer, speakers, projector.
- **Ports**: USB-A, **USB-C**, HDMI (screens/projectors), Ethernet (RJ45 network), audio jack, SD card.

## Units

- 1 KB = 1,024 bytes · 1 MB = 1,024 KB · 1 GB = 1,024 MB · 1 TB = 1,024 GB
- A photo ≈ 3 MB, a song ≈ 4 MB, an hour of HD video ≈ 1–3 GB.

## Buying a laptop (office, school, programming)

- CPU: Core i5 (8th gen or newer) or Ryzen 5
- RAM: 8–16 GB
- Storage: SSD 256 GB+
- Refurbished ex-UK laptops (HP EliteBook, Dell Latitude, Lenovo ThinkPad) are good value in Kenya. Test the battery, keyboard, screen, ports and charger before paying, and ask for a warranty.

```quiz
Q: Which part is called the brain of the computer? (3 letters)
A: CPU | processor
Q: Which type of storage is much faster: SSD or HDD?
A: SSD
Q: What is the minimum RAM recommended today, in GB?
A: 8 | 8 GB
Q: Which port connects a laptop to a projector or TV? (4 letters)
A: HDMI
```
""")

lesson(hw, "windows-setup", "Installing Windows and software", """
# Installing Windows and software

## Make a bootable USB

1. You need an **8 GB+ flash disk** (it will be erased).
2. On a working PC, download Microsoft's **Media Creation Tool** (for Windows 10/11) from microsoft.com/software-download.
3. Choose "Create installation media (USB flash drive)".

## Install

1. Plug in the USB and restart. Press the **boot menu key** (often F12, F9, F10 or Esc, depending on the brand) and choose the USB.
2. Follow the setup: language → Install now → enter or skip the product key → choose **Custom install**.
3. Select the drive, delete/format old partitions if doing a clean install (**back up files first!**), and install.
4. After setup: run **Windows Update**, install drivers (from the manufacturer's website: HP, Dell, Lenovo), and activate Windows.

## Essential software after installing

- A browser (Chrome/Firefox/Edge), **Microsoft 365** or free **LibreOffice**
- A PDF reader, **VLC** media player, **7-Zip**
- Antivirus: the built-in **Microsoft Defender** is good; keep it on and updated.

## BIOS / UEFI

The firmware settings screen (press F2 or Del at start-up) controls the boot order, Secure Boot and the date/time.

## Always use genuine software

Cracked software is a top source of viruses and ransomware. Use genuine licences or free alternatives (LibreOffice, GIMP, Inkscape).

```quiz
Q: What is the minimum USB flash size needed for a Windows installer, in GB?
A: 8 | 8 GB
Q: Which built-in Windows antivirus is recommended? (two words)
A: Microsoft Defender | Windows Defender | Defender
Q: Where do you get the correct drivers for a laptop? (the ___ website)
A: manufacturer | manufacturer's | the manufacturer
Q: Name one free alternative to Microsoft Office.
A: LibreOffice | Google Docs | WPS Office | OpenOffice
```
""")

lesson(hw, "troubleshooting", "Fixing common computer problems", """
# Fixing common computer problems

## A simple troubleshooting method

1. **Identify** the problem: what exactly happens, and when did it start?
2. **Try the simple things first**: restart, check cables and power, check it's switched on.
3. **Change one thing at a time** and test.
4. **Search** the exact error message.
5. **Document** what fixed it.

## Common problems and fixes

| Problem | Try |
|---|---|
| Computer very slow | Restart; check **Task Manager** (Ctrl+Shift+Esc) for heavy programs; remove start-up apps; free disk space; upgrade to SSD and more RAM |
| Won't turn on | Check charger and socket; hold power for 30 s; try without the battery (older laptops) |
| No internet | Restart router and PC; forget and reconnect Wi-Fi; run the network troubleshooter; `ipconfig /release` then `ipconfig /renew` |
| Printer not printing | Check paper, ink and cable/Wi-Fi; clear the print queue; restart the **Print Spooler** service; reinstall the driver |
| Frozen program | Ctrl+Shift+Esc → select it → End task |
| Blue screen (BSOD) | Note the stop code; update drivers and Windows; check RAM and disk |
| Overheating / fan noise | Clean vents with compressed air; use on a hard surface; replace thermal paste |
| Deleted file | Check the Recycle Bin; OneDrive/Google Drive trash; File History backups |

## Keep computers healthy

- Install updates, keep antivirus on, and don't install cracked software.
- **Disk Cleanup** / Storage Sense to delete temporary files.
- Use a **surge protector** or UPS: Kenyan power fluctuations damage PCs.
- **Back up** regularly to the cloud and an external drive.
- Scan flash disks before opening files (right-click → Scan with Microsoft Defender), and turn on "show file extensions" to spot fake `.exe` files named like documents.

## Earning from these skills

Computer repair, installation, networking small offices and cyber café support are in steady demand. CompTIA **A+** is the international entry certification for IT support.

```quiz
Q: Which shortcut opens Task Manager directly?
A: Ctrl+Shift+Esc | ctrl shift esc
Q: Which Windows service do you restart when print jobs get stuck? (two words)
A: Print Spooler | spooler
Q: Which device protects a computer from power surges and short outages? (3 letters)
A: UPS
Q: Which certification is the entry-level standard for IT support? (CompTIA …)
A: A+ | CompTIA A+
```
""")
