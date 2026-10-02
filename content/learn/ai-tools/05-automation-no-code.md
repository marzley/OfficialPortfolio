---
slug: ai-automation-no-code
title: "Automating work with AI and no-code tools: Zapier, Make, Google Apps Script, chatbots and AI agents"
after: ai-office-productivity
---
# Automating work with AI and no-code tools: Zapier, Make, Google Apps Script, chatbots and AI agents

Many daily tasks are repetitive: copying form entries into a spreadsheet, sending the same confirmation message, reminding clients about payments, saving email attachments, posting to social media, generating weekly reports. **Automation** tools connect your apps so these happen automatically, and AI can now be one of the steps (summarising, classifying, drafting replies). For small businesses this saves hours every week; for freelancers, setting up automations is a sellable service. This unit explains how automation works, introduces popular no-code tools and simple scripts, and shows how to add AI safely.

:::note What you will learn
- Triggers, actions and workflows
- Finding tasks worth automating
- No-code tools: Zapier, Make, n8n, Power Automate, IFTTT
- Google Forms + Sheets + Apps Script automations
- Adding AI steps: classify, summarise, draft
- WhatsApp and website chatbots
- AI agents: what they are and their limits
- Testing, monitoring and security
- Offering automation as a service
:::

## How automation works

| Term | Meaning | Example |
|---|---|---|
| **Trigger** | The event that starts a workflow | A new Google Form response; a new email with an invoice |
| **Action** | What happens next | Add a row to a sheet; send an email/SMS; create a task |
| **Filter/condition** | Only continue if something is true | Only if amount > KSh 10,000 |
| **Workflow (Zap/scenario/flow)** | The full chain of steps | Form → Sheet → confirmation email → Slack/WhatsApp alert |

## What's worth automating?

Look for tasks that are **frequent, repetitive, rule-based and error-prone**:
- Logging enquiries from website forms into a sheet and notifying the team.
- Sending booking confirmations and reminders.
- Creating invoices/receipts from form or payment data.
- Saving email attachments to the right Drive folder.
- Weekly sales summaries emailed to the manager.
- Posting new blog articles to social media.

Estimate the benefit: minutes saved per task × times per month.

```try-python
tasks = [("Copy form enquiries to sheet + notify team", 4, 120),
         ("Booking confirmation messages", 3, 200),
         ("Weekly sales report", 45, 4),
         ("Save invoice attachments to folders", 2, 80)]
total = 0
for name, minutes, per_month in tasks:
    hours = minutes * per_month / 60
    total += hours
    print(f"{name:45} ~{hours:.1f} hours/month")
print(f"Total time that could be saved: ~{total:.0f} hours per month")
```

## No-code tools

| Tool | Notes |
|---|---|
| **Zapier** | Very easy, thousands of app connections; free tier with limits |
| **Make** (formerly Integromat) | Visual scenarios, powerful, generous pricing |
| **n8n** | Open source, can be self-hosted; good for technical users |
| **Microsoft Power Automate** | Best for Microsoft 365 organisations |
| **IFTTT** | Simple personal automations |

Example Zapier/Make workflow for a training centre:
1. **Trigger**: new Google Form registration.
2. **Action**: add the student to a Google Sheet.
3. **Action**: send a confirmation email with course details.
4. **Filter**: if "needs payment plan" = yes → notify the accounts officer.
5. **Action**: add the event to a Google Calendar.

## Google Forms + Sheets + Apps Script

Google's built-in scripting (JavaScript) is free and powerful. Example: email a confirmation whenever a form response arrives (open the linked Sheet → Extensions → Apps Script):

```javascript
function onFormSubmit(e) {
  const r = e.namedValues;              // answers keyed by question title
  const name = r["Full name"][0];
  const email = r["Email"][0];
  const course = r["Course"][0];
  MailApp.sendEmail({
    to: email,
    subject: "Registration received: " + course,
    body: "Hi " + name + ",\n\nThanks for registering for " + course +
          ". We'll contact you within 24 hours with payment details.\n\nMarzley Training"
  });
}
```

Then add a trigger (Triggers → Add trigger → onFormSubmit → From spreadsheet → On form submit) and authorise it. Test with your own email first. AI assistants are very good at writing and explaining Apps Script; describe your sheet's columns precisely.

## Adding AI steps

Automation platforms and APIs let you insert AI into workflows:

| AI step | Example |
|---|---|
| **Classify** | Label incoming enquiries as "quote request", "complaint", "job application", "spam" |
| **Extract** | Pull name, phone, product and budget from a free-text message |
| **Summarise** | Summarise long emails or call transcripts for the manager |
| **Draft** | Prepare a reply for a human to review and send |
| **Translate** | English ↔ Kiswahili customer messages |

Design principle: **AI drafts, humans decide** for anything customer-facing, financial or sensitive. Add a review step (e.g. drafts saved to Gmail drafts or a sheet for approval).

For developers, AI APIs (OpenAI, Anthropic Claude, Google Gemini) can be called directly from code; see the Artificial Intelligence subject's AI APIs lesson.

## Chatbots

- **WhatsApp Business app**: greeting messages, away messages, quick replies, catalogue: simple automation for free.
- **WhatsApp Business Platform** (via providers): automated menus, order flows, AI answers, integration with your systems; costs per conversation apply.
- **Website chat widgets** with AI trained on your FAQs.

Good chatbot rules: answer only from approved information (prices, policies), clearly offer "talk to a person", never invent prices or promises, log conversations, and review regularly.

## AI agents

An **AI agent** is an AI system that can plan multi-step tasks and use tools (browse, read files, fill forms, call APIs) with less step-by-step instruction. They're improving quickly and can save time on research, data gathering and routine workflows, but they can make mistakes, misunderstand goals, or take unwanted actions. Use them on low-risk tasks first, keep humans approving important steps (payments, sending emails to clients, deleting data), and give them the minimum access needed.

## Testing, monitoring and security

| Practice | Why |
|---|---|
| Test with sample data before going live | Catch mapping errors (wrong columns, missing fields) |
| Add error notifications | Know when a workflow fails |
| Document each workflow (what, why, owner) | Others can maintain it |
| Use least-privilege connections | Limit what each automation can access |
| Protect personal data | Follow the Data Protection Act; avoid sending personal data to unnecessary services |
| Review AI outputs regularly | Catch drift and errors |
| Keep backups of key sheets | Recover from bad automated changes |

## Offering automation as a service

SMEs, schools, clinics and NGOs often need:
- Form → sheet → notification → confirmation setups
- Booking and reminder systems
- WhatsApp quick replies, catalogues and simple chatbots
- Weekly reports emailed automatically
- Invoice/receipt generation from sheets

Package it: discovery (map their manual process), build, test, train staff, and monthly maintenance. Price by complexity and value of time saved, and be clear about third-party tool subscription costs the client must pay.

:::think A small clinic receives appointment requests through a website form, and the receptionist copies each one into a notebook, then sends SMS confirmations manually. Design a simple automated workflow.
Form submission → add row to a Google Sheet (appointments log) → automatic confirmation email/SMS via an SMS provider integration ("Request received, we'll confirm your slot shortly") → notify the receptionist (email/WhatsApp alert) → receptionist confirms the time in the sheet → status change triggers a confirmation message and a reminder the day before. Keep humans approving appointment times, protect patient data, and test with dummy entries.
:::

## Summary

- Automations run actions when triggers happen, with filters for conditions.
- Automate frequent, repetitive, rule-based tasks; estimate time saved.
- Use no-code tools (Zapier, Make, n8n, Power Automate) or Google Apps Script for Forms/Sheets workflows.
- Add AI steps to classify, extract, summarise, draft and translate, with human review for important outputs.
- Build chatbots and agents carefully; test, monitor, secure data, and offer automation as a paid service.

```quiz
Q: What starts an automation workflow?
A: trigger | a trigger
Q: Which free Google tool lets you script Forms and Sheets automations? (three words)
A: Google Apps Script | apps script
Q: Name a no-code automation tool.
A: Zapier | Make | n8n | Power Automate | IFTTT
Q: For customer-facing messages, who should make the final decision: AI or a human?
A: human | a human
Q: An AI system that plans multi-step tasks and uses tools is called an AI what?
A: agent | ai agent
```
