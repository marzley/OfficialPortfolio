---
slug: google-docs-sheets-slides
title: Google Docs, Sheets and Slides: free office tools online
after: drive-collaboration
---
# Google Docs, Sheets and Slides

Google's free office apps run in any browser and on phones, save automatically, and let several people work on the same file at once. For students, small businesses and NGOs they replace expensive software.

## Getting started

- Go to **docs.google.com**, **sheets.google.com** or **slides.google.com** (or Drive → **+ New**).
- Everything saves automatically to **Google Drive**: no "Save" button.
- Name the file straight away (click "Untitled document").
- On phones, install the Docs, Sheets and Slides apps; turn on **offline** access for important files (Drive → file ⋮ → Make available offline).

## Google Docs essentials

| Task | How |
|---|---|
| Headings and a table of contents | Styles drop-down (Heading 1, 2), then Insert → Table of contents |
| Voice typing | Tools → **Voice typing** (Ctrl + Shift + S) |
| Suggest edits | Pencil icon → **Suggesting** |
| Comments | Ctrl + Alt + M; @mention to notify someone |
| Page setup | File → Page setup (A4, margins) |
| Download | File → Download → PDF / Word (.docx) |
| Word count | Ctrl + Shift + C |
| Templates | Template gallery (CVs, letters, reports) |

## Google Sheets essentials

Most Excel formulas work the same (`SUM`, `IF`, `VLOOKUP`, `XLOOKUP`, `COUNTIF`, `SUMIFS`, `FILTER`, `SORT`, `UNIQUE`). Extras worth knowing:

| Feature | Use |
|---|---|
| `=GOOGLEFINANCE("CURRENCY:USDKES")` | Live exchange rate |
| `=GOOGLETRANSLATE(A2,"en","sw")` | Translate text |
| `=IMPORTRANGE("url","Sheet1!A1:D50")` | Pull data from another spreadsheet |
| `=SPARKLINE(B2:M2)` | A tiny chart in a cell |
| **Explore** button (bottom right) | Automatic charts and answers ("total sales by town") |
| Data → **Dropdown** | Drop-down lists |
| Data → **Protect sheets and ranges** | Stop others editing formulas |
| Extensions → Apps Script | Automations in JavaScript |

Tip: link a **Google Form** to a Sheet to collect responses automatically (next lesson).

## Google Slides essentials

- Themes on the right when you create a deck; **Insert → Image/Chart/Diagram**.
- Charts inserted from Sheets stay **linked**: click Update when the data changes.
- **Present** (Ctrl + Enter), with speaker notes in **Presenter view**.

## Sharing and permissions (all three apps)

Click **Share**:

- Add people by email and choose **Viewer**, **Commenter** or **Editor**.
- Or **General access → Anyone with the link** (choose carefully: anyone who gets the link can open it).
- For assignments or forms, share **view-only** templates and ask people to **File → Make a copy**.

## Version history: never lose work

**File → Version history → See version history** shows every saved version and who changed what. Restore any earlier version, or name important versions ("Submitted draft").

## Office compatibility

- Open Word, Excel and PowerPoint files directly in Drive; edit them in Office format or convert them.
- Download as .docx/.xlsx/.pptx or PDF to send to people using Microsoft Office.
- Complex Excel features (some macros, advanced pivot options) may not work fully in Sheets.

## Useful keyboard shortcuts

| Shortcut | Does |
|---|---|
| Ctrl + / | Show all shortcuts |
| Ctrl + K | Insert link |
| Ctrl + Alt + M | Comment |
| Ctrl + Shift + V | Paste without formatting |
| Ctrl + Enter | Page break (Docs) / Present (Slides) |

## Who uses Google Workspace

Google Docs, Sheets and Slides are free with any Gmail account and work on phones, cheap laptops and in cyber cafés without installing anything. Schools use them for assignments and class lists, chamas and SACCOs for contribution records, small businesses for invoices and stock, NGOs for reports, and remote teams for everything. Many Kenyan startups and organisations use Google Workspace (the paid business version with custom email like `name@business.co.ke`) as their main office system.

## Organising Google Drive

- Create a clear folder structure: `Business / Clients / 2026 / ClientName`.
- Use **Shared drives** (Workspace accounts) for team files so files stay with the organisation when someone leaves.
- **Star** important files and use **Recent** and **Search** (Drive search can find text inside PDFs and even images).
- Colour-code folders (right-click → Organise → Folder colour).
- Upload Office files and choose whether to convert them to Google format (Settings → Convert uploads).

## Docs power features

| Feature | How | Use |
|---|---|---|
| Voice typing | Tools → Voice typing (in Chrome) | Dictate notes or drafts |
| Explore / research | Tools → Explore (where available) | Find images and sources |
| Smart chips | Type `@` | Insert people, files, dates, dropdowns, meeting notes |
| Document outline | View → Show outline | Navigate by headings |
| Templates | File → New → From template | CVs, letters, reports, meeting notes |
| Pageless format | File → Page setup → Pageless | Easier reading on screens |
| Translate document | Tools → Translate document | English ↔ Kiswahili drafts (check the result) |
| Equation editor | Insert → Equation | Maths and science notes |
| Word count | Ctrl + Shift + C | Essays with word limits |

`@` smart chips are very useful: `@date` inserts a date, `@Kamau` mentions a colleague, `@dropdown` creates a status selector (Not started / In progress / Done).

## Sheets formulas that are especially useful

```
=GOOGLEFINANCE("CURRENCY:USDKES")                 live exchange rate (may be delayed)
=GOOGLETRANSLATE(A2, "en", "sw")                  translate text to Kiswahili
=IMPORTRANGE("sheet_url", "Sheet1!A1:D100")       pull data from another spreadsheet
=QUERY(A1:E100, "select B, sum(E) where C = 'Nakuru' group by B", 1)   SQL-like summaries
=UNIQUE(B2:B), =SORT(...), =FILTER(...)           dynamic lists
=SPARKLINE(B2:M2)                                  tiny chart inside a cell
=IMAGE("https://example.com/logo.png")             show an image in a cell
=DETECTLANGUAGE(A2)                                detect the language of text
```

`QUERY` is powerful for reports: it filters, groups and sorts data in one formula using a language similar to SQL.

## Sheets for small business tasks

| Task | Features to use |
|---|---|
| Daily sales record | Data validation drop-downs, SUMIFS, a Form feeding the sheet |
| Stock tracking | Conditional formatting for low stock, checkboxes |
| Chama contributions | One row per payment; pivot table by member and month |
| Invoices | A template sheet with formulas; File → Download → PDF |
| Attendance | Checkboxes (Insert → Checkbox), COUNTIF |

**Insert → Checkbox** creates tick boxes that count as TRUE/FALSE: `=COUNTIF(C2:C40, TRUE)` counts how many are ticked.

## Protecting ranges and sheets

**Data → Protect sheets and ranges** lets you lock formulas or a whole sheet so only certain people can edit them. Collaborators can still edit other areas. Use it in shared sheets so nobody accidentally deletes the totals.

## Slides power features

- **Explore/Assist** suggestions and templates for quick designs.
- **Speaker notes** and **Presenter view**.
- **Q&A** (Slideshow → Presenter view → Audience tools) lets the audience submit questions from their phones during a talk.
- **Linked charts** from Sheets update with one click.
- **Publish to the web** (File → Share → Publish to web) for a self-advancing slideshow on a website.
- Download as PowerPoint (.pptx) or PDF for offline presenting.

## Working offline

1. In Chrome, go to Drive → Settings → turn on **Offline**.
2. Right-click important files → **Available offline**.
3. Edit without internet; changes sync when you reconnect.

Useful for areas with unreliable internet or when your data bundle runs out.

## Collaboration best practices

- Share with specific people; avoid "Anyone with the link can edit" for important files.
- Use comments with `@mentions` and assign tasks ("Assign to" in a comment).
- Use **Suggesting** mode in Docs when reviewing someone else's work.
- Name important versions in Version history.
- Agree on one master file; don't download, edit and re-upload copies.
- Check **Activity dashboard** (Workspace) to see who has viewed a file.

## Security of your Google account

- Turn on 2-Step Verification with an authenticator app or prompts.
- Run the **Security Checkup** (myaccount.google.com/security-checkup) regularly.
- Remove access for third-party apps you no longer use.
- Be careful with files shared by strangers: phishing links often look like "shared documents".

## Practice

1. Create a folder structure in Drive for a small business and share one folder with a "colleague" as a commenter.
2. Build a sales sheet with checkboxes, data validation and a QUERY summary by branch.
3. Use `=GOOGLEFINANCE("CURRENCY:USDKES")` to convert a price list from USD to KES.
4. Write a document using `@` smart chips for dates, people and a status dropdown.
5. Turn on offline mode and edit a document with Wi-Fi off.

:::think Your organisation's shared files are all in a former employee's personal "My Drive", and their account is about to be deleted. What's the risk, and how should files be stored?
When the account is deleted, files they own can be lost or become inaccessible. Ownership should be transferred to someone else (or the files moved) before deletion. For the future, keep organisational files in Shared drives owned by the organisation, not individuals' My Drive.
:::

```quiz
Q: Do Google Docs need a Save button? (yes or no)
A: no
Q: Which Docs mode lets people propose edits without changing the text directly?
A: Suggesting | suggesting mode
Q: Which Sheets function pulls a live USD to KES rate?
A: GOOGLEFINANCE | GOOGLEFINANCE()
Q: Where can you restore an earlier version of a Google file? (two words)
A: Version history | version history
Q: Which sharing role can add comments but not edit?
A: Commenter
Q: Which Sheets function summarises data using SQL-like statements?
A: QUERY
Q: Which Sheets function pulls data from another spreadsheet?
A: IMPORTRANGE
Q: Which symbol inserts smart chips like people, dates and dropdowns in Google Docs?
A: @
Q: Which Workspace feature keeps team files owned by the organisation? (two words)
A: Shared drives | shared drive
```
