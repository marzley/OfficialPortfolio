---
slug: ai-office-productivity
title: "AI in office work: Word, Excel, PowerPoint, Google Docs and Sheets, email and meetings"
after: ai-for-business
---
# AI in office work: Word, Excel, PowerPoint, Google Docs and Sheets, email and meetings

Most office jobs revolve around documents, spreadsheets, presentations, email and meetings. AI is now built into these tools (**Microsoft Copilot** in Microsoft 365 and Windows, **Gemini** in Google Workspace) and general assistants (ChatGPT, Claude, Gemini) can help even if your organisation doesn't pay for built-in AI. This unit shows practical, step-by-step uses for each office task, with prompts you can copy, plus the checks that keep your work accurate and professional.

:::note What you will learn
- Built-in AI vs general chat assistants
- Word/Docs: drafting, rewriting, summarising, formatting long documents
- Excel/Sheets: formulas, cleaning data, analysis, charts, explaining spreadsheets
- PowerPoint/Slides: outlines, slide content, speaker notes, design
- Email: drafting replies, tone, summarising long threads
- Meetings: agendas, transcription, minutes and action items
- Reports and proposals workflow
- Accuracy and confidentiality checks
:::

## Built-in AI vs general assistants

| Option | Pros | Cons |
|---|---|---|
| **Copilot in Microsoft 365** / **Gemini in Google Workspace** | Works inside your documents, emails and files; organisation privacy controls | Paid add-ons/plans in many cases; availability varies |
| **General assistants** (ChatGPT, Claude, Gemini, Copilot web) | Free tiers, flexible | You copy-paste; be careful with confidential data |

If your workplace provides approved AI tools, use those for work documents.

## Word and Google Docs

| Task | Prompt |
|---|---|
| First draft | "Draft a 1-page memo to all staff announcing the new leave application process via the HR portal starting 1 November. Tone: clear and friendly. Include steps and a contact person." |
| Rewrite | "Rewrite this paragraph to be clearer and more concise for senior management." |
| Summarise | "Summarise this 20-page report into a one-page executive summary with 5 key findings and 3 recommendations." |
| Tone change | "Make this letter more formal and polite." |
| Structure | "Suggest headings and a logical structure for a project report on our school's ICT lab upgrade." |
| Proofread | "Check this for grammar, spelling and consistency (British English). List changes." |

Then use Word's features properly: **Styles** for headings (for an automatic table of contents), consistent formatting, track changes for review (see the MS Word subject).

## Excel and Google Sheets

AI turns plain-language requests into formulas and explains confusing spreadsheets.

```
My sheet: column A = date, B = branch (Nairobi, Mombasa, Kisumu), C = product, D = quantity, E = unit price.
1) Write a formula for total revenue per row in F.
2) Write a formula that sums revenue for Mombasa in September 2026.
3) Suggest a pivot table layout to compare branches by month.
```

Typical answers you should understand and check:

```
F2:  =D2*E2
Sum: =SUMIFS(F:F, B:B, "Mombasa", A:A, ">="&DATE(2026,9,1), A:A, "<"&DATE(2026,10,1))
```

Other uses:
- **Cleaning data**: "Give me steps to split full names into first and last names", "remove duplicates", "standardise phone numbers to 2547... format" (TEXT functions, Flash Fill, Power Query).
- **Analysis**: paste a small non-confidential summary and ask for trends and questions to investigate.
- **Charts**: "Which chart best shows monthly sales by branch?" (usually a line or clustered column chart).
- **Explaining**: "Explain what this formula does step by step: ..."
- **Macros/scripts**: VBA or Google Apps Script for repetitive tasks (test on a copy first).

Always test formulas on a few rows where you know the correct answer.

## PowerPoint and Google Slides

1. Ask for an **outline**: "Create a 10-slide outline for a presentation to the board on reducing fee arrears: problem, data, causes, options, recommendation, timeline, budget."
2. Ask for **slide content**: short bullet points (max ~5 per slide), suggested visuals, and **speaker notes**.
3. Build slides with your organisation's template; use **Designer** (PowerPoint) or layouts for clean design.
4. Replace generic statements with **your real data**, charts and photos.
5. Rehearse: "Ask me 5 tough questions the board might ask about this proposal."

Avoid walls of text: slides support your talk; details go in notes or a handout.

## Email

| Task | Prompt |
|---|---|
| Reply | "Draft a polite reply declining this meeting request and proposing two alternative times next week." |
| Difficult message | "Help me write a firm but respectful email to a supplier about repeated late deliveries, referencing our contract's delivery terms." |
| Thread summary | "Summarise this email thread: decisions made, open questions, who must do what." |
| Shorten | "Make this email half as long without losing key information." |

Read before sending: check names, dates, amounts, attachments mentioned, and the tone for your relationship with the reader.

## Meetings

- **Before**: "Create a 45-minute agenda for our monthly sales meeting with time per item."
- **During**: Teams, Google Meet and Zoom can record and transcribe (with participants' consent and organisational permission); tools can generate summaries.
- **After**: "Turn this transcript into minutes: attendees, decisions, action items (owner, deadline), next meeting date." Check the minutes against your notes; AI can misattribute who said what.

## A report or proposal workflow

1. Gather facts, data and requirements yourself.
2. Ask AI for an outline; adjust it.
3. Draft section by section, giving the AI your facts and asking it to mark assumptions.
4. Insert real numbers, tables and charts from Excel.
5. Ask AI to critique: "What would a sceptical reviewer criticise?"
6. Edit for accuracy, voice and formatting; add a table of contents and references.
7. Have a colleague review important documents.

## Accuracy and confidentiality checklist

| ✓ | Check |
|---|---|
| | Facts, dates, names, amounts verified |
| | Formulas tested on known values |
| | No confidential or personal data in unapproved tools |
| | Organisation's AI policy followed |
| | Output edited to sound like you and fit the audience |
| | Sources cited where needed; no invented references |

:::think You must produce a monthly sales report in Excel and a 6-slide summary for management, and you have 2 hours. How could AI help, and where must you be careful?
Use AI to write/explain SUMIFS and pivot formulas, suggest the right charts, draft the slide outline and concise bullet points with speaker notes, and summarise key trends from your aggregated numbers. Be careful to verify every calculation, avoid pasting confidential customer-level data into unapproved tools, replace generic text with real insights, and check the final numbers on the slides match the spreadsheet.
:::

## Summary

- Use approved built-in AI (Copilot, Gemini) for work files where available; general assistants help with care.
- In Word/Docs: draft, rewrite, summarise and structure, then format with styles and track changes.
- In Excel/Sheets: get and explain formulas, clean data, choose charts and automate, testing on known values.
- In PowerPoint/Slides: outlines, concise content and speaker notes, then real data and your template.
- For email and meetings: draft replies, summarise threads and transcripts into minutes, and always check accuracy and confidentiality.

```quiz
Q: What is Microsoft's AI assistant in Microsoft 365 called?
A: Copilot | microsoft copilot
Q: What is Google's AI in Google Workspace called?
A: Gemini
Q: Which Excel function sums values that meet several conditions?
A: SUMIFS
Q: How should you check an AI-written formula? (test it on known …)
A: values | known values | data | rows
Q: Should you record and transcribe a meeting without participants' consent? (yes/no)
A: no
```
