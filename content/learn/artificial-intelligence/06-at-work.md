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
```
