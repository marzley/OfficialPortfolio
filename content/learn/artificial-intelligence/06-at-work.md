---
slug: ai-at-work
title: "Level 2: AI at work: emails, Excel, reports, meetings and presentations"
after: ai-everyday-life
---
# Level 2: AI at work: emails, Excel, reports, meetings and presentations

Office workers who use AI well finish routine work faster and spend more time on work that needs judgement. This lesson shows practical workflows you can use tomorrow, with Microsoft 365 Copilot, Gemini in Google Workspace, or any chat assistant.

> **First, check your organisation's AI policy.** Many employers restrict pasting confidential documents into public AI tools. Use approved tools, and remove names, ID numbers and confidential figures when in doubt.

## Emails

| Task | Prompt |
|---|---|
| Reply quickly | *"Draft a polite reply agreeing to the meeting on Thursday, asking for the agenda: [paste email]."* |
| Firm but polite | *"Rewrite this to sound firm but respectful. A supplier is 2 weeks late: [paste draft]."* |
| Summarise a long thread | *"Summarise this email thread: decisions made, open questions, who must do what."* |
| Translate | *"Translate this customer email from French and draft a reply in French."* |

## Excel and Google Sheets

AI is excellent at formulas. Describe your columns and what you want:

> *"Column A has dates, B has product names, C has quantities, D has prices. Give me a formula for total sales of 'Unga' in September 2026, and explain it."*

Typical answer:

```
=SUMPRODUCT((B2:B500="Unga")*(MONTH(A2:A500)=9)*(YEAR(A2:A500)=2026)*C2:C500*D2:D500)
```

Other things to ask: *"Explain this formula: [paste]"*, *"Why does my VLOOKUP show #N/A?"*, *"Make a pivot table showing sales per month per branch: step by step"*, *"Clean this list: remove duplicates and fix capital letters."*

Practise these skills in the **Excel & Google Sheets** subject.

## Analysing data with Python (AI-style analysis, by hand)

AI tools that "analyse your spreadsheet" often write small programs like this behind the scenes. Here's one you can run and understand:

```try-python
sales = [
    ("Thika", "Sep", 182000), ("Thika", "Oct", 205500),
    ("Nyeri", "Sep", 143000), ("Nyeri", "Oct", 128500),
    ("Ruiru", "Sep", 99000),  ("Ruiru", "Oct", 131000),
]

by_branch = {}
for branch, month, amount in sales:
    by_branch.setdefault(branch, {})[month] = amount

print(f"{'Branch':<8}{'Sep':>10}{'Oct':>10}{'Change':>9}")
for branch, m in by_branch.items():
    change = (m["Oct"] - m["Sep"]) / m["Sep"] * 100
    print(f"{branch:<8}{m['Sep']:>10,}{m['Oct']:>10,}{change:>8.1f}%")

best = max(by_branch, key=lambda b: by_branch[b]["Oct"] - by_branch[b]["Sep"])
print("Biggest growth:", best)
```

The value of AI here is speed; the value of **you** is asking the right question ("why did Nyeri drop?") and checking the result makes sense.

## Reports and documents

1. **Outline first**: *"Create an outline for a quarterly report on our customer service performance. Include: summary, key numbers, issues, actions."*
2. **Feed it your facts**: paste your numbers and notes; ask it to write each section from them.
3. **Edit**: *"Make this more concise"*, *"Add a short executive summary"*, *"Turn this into bullet points for the board."*
4. **Check every number and claim** before sending.

## Meetings

- Use **meeting notes features** (Teams, Google Meet, Zoom, Otter) to transcribe, with everyone's consent.
- Ask: *"From this transcript, list decisions, action items with owners and deadlines, and open questions."*
- Send the summary within an hour: you'll look extremely organised.

## Presentations

- *"Create a 10-slide outline for a presentation to farmers about our new savings product: one title and 3 bullets per slide, plus speaker notes."*
- Copilot in PowerPoint and Gemini in Slides can build first drafts; Canva can design them.
- Keep slides simple: AI tends to put too much text on each slide. Cut it.

## Customer service

- Draft replies to common questions, then personalise them.
- Build a **library of approved answers** (refunds, delivery times, prices) and ask AI to adapt them to each customer's message.
- Never let AI promise things your company doesn't offer.

## Measure your time saved

For one week, note tasks where AI helped and the minutes saved. It's useful evidence when asking for a promotion, or when offering AI training to your team.

## AI in the workplace: productivity with responsibility

Many organisations now use AI for drafting, summarising, analysing data, customer support and coding. Staff who use it well finish routine work faster and spend more time on judgement, relationships and problem solving. But workplace use brings extra responsibilities: confidentiality, accuracy, and following company policy.

## Before you use AI at work

| Check | Why |
|---|---|
| Does your organisation have an AI policy or approved tools? | Some tools are allowed, others aren't |
| Is the information confidential or personal? | Customer data, salaries, contracts and strategy may be restricted |
| Who is accountable for the output? | You are: AI doesn't take responsibility for errors |
| Does the work need disclosure? | Some clients and employers require you to say when AI was used |

When in doubt, anonymise (remove names, account numbers, amounts) or ask your manager.

## Writing and communication

```text
Prompt: Draft a polite email to a supplier explaining that our payment will be 5 days
late because of a bank system delay. Keep it under 120 words, apologise once, and
confirm the new payment date as [date].
```

- Ask for several tones (formal, friendly) and pick one.
- Always read and edit: check facts, names, dates and promises before sending.
- Use AI to shorten long emails into clear action points.

## Spreadsheets and data

AI assistants can explain formulas, suggest the right function and help clean data:

```text
Prompt: In Excel, column A has dates, column B has branch names, column C has amounts.
Write a formula for total sales for "Nakuru" in March 2026, and explain each part.
```

A typical answer uses `SUMIFS`; test it on a few rows where you know the answer. For bigger analysis, AI can write Python or pivot-table steps, but **check results** against simple totals.

```try-python
sales = [
    ("2026-03-02", "Nakuru", 1800), ("2026-03-05", "Thika", 840),
    ("2026-03-11", "Nakuru", 1400), ("2026-04-01", "Nakuru", 900),
]
march_nakuru = sum(a for d, b, a in sales if b == "Nakuru" and d.startswith("2026-03"))
print("Nakuru March total:", march_nakuru)    # check AI-suggested formulas against a known answer
```

## Meetings and reports

- Record meetings only with participants' consent; use transcription to create notes.
- Ask AI to turn notes into: decisions, action items (who, what, by when) and open questions.
- Draft report sections from your bullet points, then add real figures and analysis yourself.
- Keep the final report's numbers traceable to their sources.

## Customer service

- Draft reply templates for common questions (delivery times, refunds, opening hours).
- Use AI to suggest replies, but have a human check anything about money, complaints or personal circumstances.
- Ground chatbots in approved information ("Answer only using our FAQ below; if unsure, say a staff member will help").
- Escalate angry customers and sensitive issues to people.

## Measuring the value

Track for two weeks:

| Task | Time before | Time with AI | Quality check |
|---|---|---|---|
| Weekly report | 3 hours | 1.5 hours | Manager feedback |
| Customer emails | 2 hours/day | 1 hour/day | Errors found |
| Meeting notes | 45 min | 15 min | Accuracy of action items |

Real measurements help you and your organisation decide where AI genuinely helps.

## Risks at work

| Risk | Example | Prevention |
|---|---|---|
| Data leaks | Pasting a client contract into an unapproved tool | Use approved tools; anonymise |
| Errors | Wrong figures in a board report | Verify against sources |
| Over-reliance | Not understanding work you submit | Review and understand everything |
| Bias | Unfair screening of job applicants | Human review, clear criteria |
| Copyright | Copying AI images or text that resembles others' work | Check licences; add original work |

## Practice

1. Draft three versions of a work email with different tones and choose the best one.
2. Ask AI to explain a formula you use, then test it on known data.
3. Turn rough meeting notes into decisions and action items.
4. Write a customer reply template and list which parts need human checking.
5. Measure the time saved on one recurring task for a week.

:::think Your manager asks you to use AI to write a quarterly report quickly. The AI produces impressive paragraphs with figures. What must you do before submitting?
Check every number against the actual data sources, remove any invented statistics or claims, make sure the analysis reflects what really happened, add your own insights, and confirm the report doesn't include confidential information that was shared with an unapproved tool. You remain responsible for the content.
:::

```quiz
Q: What should you check before pasting work documents into an AI tool?
A: your organisation's AI policy | the AI policy | company policy | policy
Q: Which Excel function adds up values that meet several conditions in the example?
A: SUMPRODUCT
Q: What three things should you ask AI to pull from a meeting transcript? Name one: decisions, action items or ...
A: open questions | questions | decisions | action items
Q: Should you check every number in an AI-written report before sending? (yes or no)
A: yes
Q: Which subject in this hub practises spreadsheet skills?
A: Excel | Excel & Google Sheets
Q: Who is responsible for errors in work you submit that used AI?
A: you | me | the person | the employee
Q: What should you do with names and account numbers before using an unapproved AI tool?
A: remove them | anonymise | anonymize | remove
Q: Should a human review AI replies about refunds and complaints? (yes or no)
A: yes
```
