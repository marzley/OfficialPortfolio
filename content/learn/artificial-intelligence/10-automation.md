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

## Why automation matters

Repetitive digital tasks (copying form responses into spreadsheets, sending reminder messages, saving email attachments, posting updates) eat hours every week. Automation tools connect apps so these tasks happen on their own, and AI steps can now summarise, classify or draft text inside those workflows. Office workers, small business owners, virtual assistants and developers who can build reliable automations save time and can sell automation as a service.

## Anatomy of a workflow

```text
TRIGGER          →  ACTIONS (steps)                          →  RESULT
New Google Form     1. Add row to Google Sheet                  Customer gets confirmation,
response            2. AI step: classify request (booking,       team gets a summary, nothing
                       complaint, question)                     is forgotten
                    3. If complaint → email the manager
                    4. Send WhatsApp/SMS/email confirmation
```

| Term | Meaning |
|---|---|
| Trigger | The event that starts the workflow (new email, form submission, time of day) |
| Action | A step the workflow performs |
| Condition / filter | Only continue if something is true |
| Variables / data mapping | Passing values (name, phone, amount) between steps |
| Error handling | What happens when a step fails |

## Common automation ideas

| Who | Workflow |
|---|---|
| School | Form registration → sheet → confirmation email → weekly summary to the head teacher |
| Salon | New booking → calendar event → reminder message the day before |
| Online shop | New order → stock sheet updated → low-stock alert |
| Freelancer | Invoice due date → reminder email to client → mark paid when payment confirmed |
| Office | Email attachments with "invoice" → saved to a Drive folder → row added to an accounts sheet |
| Support team | New message → AI suggests category and draft reply → human approves |

## A simulation: how workflow logic works

```try-python
requests = [
    {"name": "Amina", "message": "I want to book braids for Saturday", "phone": "0712000001"},
    {"name": "Brian", "message": "My order arrived late and the cake was damaged", "phone": "0722000002"},
    {"name": "Chebet", "message": "What time do you open on Sunday?", "phone": "0733000003"},
]

def classify(text):                       # a simple rule-based stand-in for an AI step
    t = text.lower()
    if any(w in t for w in ["damaged", "late", "refund", "bad"]):
        return "complaint"
    if any(w in t for w in ["book", "appointment", "reserve"]):
        return "booking"
    return "question"

sheet, manager_alerts, confirmations = [], [], []
for r in requests:                        # trigger: each new form response
    category = classify(r["message"])     # AI-style classification step
    sheet.append((r["name"], category))   # action: add to sheet
    if category == "complaint":           # condition
        manager_alerts.append(f"Call {r['name']} on {r['phone']} today")
    confirmations.append(f"Hi {r['name']}, we received your {category}. We'll reply soon.")

print(sheet)
print(manager_alerts)
print(confirmations[1])
```

Real automation platforms do the same thing visually, and an AI step can classify messages much more flexibly than simple keyword rules (but still needs checking).

## Building reliable automations

1. **Start small**: automate one painful step, test it, then extend.
2. **Use test data** before connecting real customers.
3. **Add a human check** for anything involving money, complaints or sensitive information.
4. **Handle failures**: notifications when a step fails, retries, and a log of runs.
5. **Document** what each workflow does, who owns it, and which accounts it uses.
6. **Review monthly**: remove broken or unused workflows.

## Automation with code: Google Apps Script

Google Sheets includes Apps Script (JavaScript) for free automation inside Google Workspace:

```javascript
// Send a reminder email for each unpaid invoice due today (runs on a daily time trigger)
function sendReminders() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Invoices");
  const rows = sheet.getDataRange().getValues();      // [client, email, amount, dueDate, status]
  const today = new Date().toDateString();
  rows.slice(1).forEach(([client, email, amount, due, status]) => {
    if (status !== "Paid" && new Date(due).toDateString() === today) {
      MailApp.sendEmail(email, "Invoice reminder",
        `Hello ${client}, a friendly reminder that KSh ${amount} is due today. Thank you.`);
    }
  });
}
```

Set it to run daily under Triggers in the Apps Script editor. Test with your own email first, and respect sending limits and recipients' preferences.

## Custom assistants grounded in your documents

Many AI platforms let you create a custom assistant with instructions and uploaded files (a price list, FAQ, policies). Good practice:

- Write clear instructions: role, tone, what to do when unsure ("say you'll check with the team").
- Upload accurate, current documents and update them when things change.
- Test with tricky questions (prices not in the documents, complaints, requests for personal data).
- Don't upload confidential or personal data unless the platform and your policy allow it.

## Costs, limits and privacy

- Automation platforms charge by number of tasks or runs; AI steps may add usage costs.
- Check rate limits of email, SMS and messaging services.
- Workflows often hold access to several accounts: use strong passwords, MFA and least-privilege access.
- Personal data flowing through automations must be protected under the Data Protection Act.

## Practice

1. Map a repetitive task you do weekly as trigger → actions → result.
2. Build a Google Form that adds responses to a sheet and sends a confirmation email.
3. Write an Apps Script that highlights overdue invoices in red.
4. Create a custom assistant grounded in a one-page FAQ and test it with five questions.
5. Add a failure notification to one of your workflows.

:::think An automation sends payment reminders to clients automatically. One day, a bug sends 50 reminders to a client who has already paid. What safeguards should have been in place?
Check payment status from a reliable source before each send, limit reminders per client per day, test changes with sample data first, log every message sent, alert the owner when unusual volumes occur, and have a quick way to pause the workflow. A human review step for unusual cases also helps.
:::

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
Q: What starts an automation workflow?
A: trigger | a trigger
Q: Which Google tool automates Sheets and Gmail with JavaScript? (two words)
A: Apps Script | Google Apps Script
Q: Should automations involving money include a human check or safeguards? (yes or no)
A: yes
```
