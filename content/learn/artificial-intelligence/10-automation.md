---
slug: ai-automation-no-code
title: "Level 3: AI automation without code: custom assistants and workflows"
after: earning-with-ai
---
# Level 3: AI automation without code: custom assistants and workflows

So far you've used AI by chatting. The next step is making AI do work **automatically** or **the same way every time**. You can go far without writing code.

## Custom assistants (your own "trained" chatbot)

Most chat tools let you save instructions and documents into a reusable assistant:

| Tool | Feature | What it does |
|---|---|---|
| ChatGPT | **Custom GPTs** / Projects | Save instructions and files; share the assistant |
| Claude | **Projects** | Keep documents and instructions for a topic or client |
| Gemini | **Gems** | Saved instructions for repeated tasks |
| Microsoft Copilot | Agents (in Copilot Studio) | Business assistants connected to company data |

Example: a **"School Admissions Helper"** with:

- **Instructions**: "You answer parents' questions about St. Mary's Academy admissions politely, in English or Kiswahili. Use only the attached documents. If unsure, give the school phone number."
- **Documents**: fee structure, admission requirements, calendar, FAQ.

Now staff paste parents' questions and get consistent answers.

### Writing good instructions (system prompts)

1. **Who** the assistant is and **who** it serves.
2. **What** it must do, step by step.
3. **Sources**: "Use only the attached documents."
4. **Boundaries**: what it must not do (no medical advice, no promises of discounts).
5. **Format and tone**.
6. **What to do when unsure**: hand over to a human.

Test with 10 real questions, including tricky ones, before sharing.

## Workflow automation: "When this happens, do that"

Tools like [Zapier](https://zapier.com), [Make](https://www.make.com) and [n8n](https://n8n.io) connect apps (Gmail, Google Sheets, Forms, WhatsApp providers, Slack, CRMs) and can include AI steps.

### Example 1: enquiries summarised automatically

```
Trigger:  a customer fills in a Google Form (name, phone, message)
Step 1:   AI: classify the message (Sales / Support / Complaint) and summarise in one line
Step 2:   add a row to Google Sheets with the category and summary
Step 3:   if "Complaint", email the manager immediately
```

### Example 2: content repurposing

```
Trigger:  a new blog post is published (RSS)
Step 1:   AI: write 3 social posts and a WhatsApp status text from it
Step 2:   save drafts to a Google Doc for review
```

### Example 3: receipts to a spreadsheet

```
Trigger:  an email with a receipt arrives in a special Gmail label
Step 1:   AI: extract date, supplier, amount, category
Step 2:   add a row to the expenses sheet
```

Always keep a **human review step** for anything sent to customers or involving money.

## How automation thinks (a tiny simulation)

Every workflow is a trigger, some steps and some rules. This Python program simulates Example 1 with simple keyword rules standing in for the AI step. Run it, then add your own messages.

```try-python
enquiries = [
    {"name": "Achieng", "message": "How much is delivery to Kisumu?"},
    {"name": "Kamau", "message": "My order arrived broken, I want a refund"},
    {"name": "Fatuma", "message": "The app won't let me log in"},
]

def classify(text):
    t = text.lower()
    if any(w in t for w in ["refund", "broken", "angry", "complain"]):
        return "Complaint"
    if any(w in t for w in ["price", "how much", "delivery", "buy"]):
        return "Sales"
    return "Support"

sheet = []
for e in enquiries:
    category = classify(e["message"])
    sheet.append((e["name"], category, e["message"][:40]))
    if category == "Complaint":
        print(f"ALERT to manager: complaint from {e['name']}")

for row in sheet:
    print(row)
```

In a real workflow, the `classify` step would be an AI call, which understands messages that don't contain the keywords, like "This is unacceptable, I paid last week!"

## Google Apps Script: free automation inside Google Workspace

If you use Google Sheets, **Apps Script** (Extensions → Apps Script) can automate it with JavaScript, and AI assistants can write the script for you: *"Write a Google Apps Script that emails me every morning with yesterday's total sales from column D."* Learn JavaScript in this hub to understand and fix what it writes.

## Costs and limits

- Zapier and Make have **free tiers** with limited runs per month; paid plans add more.
- AI steps may cost money per use (API usage).
- Start with **one workflow that saves real time**, measure it, then add more.

```quiz
Q: What are ChatGPT's saved custom assistants called?
A: Custom GPTs | GPTs
Q: What are Gemini's saved assistants called?
A: Gems
Q: In automation, what starts a workflow?
A: a trigger | trigger
Q: What should a custom assistant do when it's unsure?
A: hand over to a human | ask a human | give a human contact | hand over
Q: Which Google tool automates Sheets with JavaScript?
A: Apps Script | Google Apps Script
```
