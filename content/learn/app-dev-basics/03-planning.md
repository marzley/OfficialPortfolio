---
slug: planning-an-app
title: "Planning an app: requirements, user stories, MVP and data"
after: choosing-your-stack
---
# Planning an app: requirements, user stories, MVP and data

Most failed apps fail **before any code is written**: nobody agreed what the app must do, the scope kept growing, or it solved a problem nobody had. An hour of planning saves weeks of rework. We'll plan a real example: **"Duka Connect"**, an app for small shops to record sales and stock and let regular customers order.

## 1. The problem statement

One or two sentences everyone agrees on:

> *Small shop owners in Kenyan towns lose money because they don't know what's selling, what's running out, or which customers owe them. Duka Connect lets them record sales, track stock and credit, and take orders from regular customers on their phone.*

## 2. Users and their goals

| User | Goal |
|---|---|
| Shop owner | See today's sales, low stock and debts at a glance |
| Shop attendant | Record a sale in under 10 seconds |
| Regular customer | Order and pay by M-Pesa without calling |
| Admin (you) | Manage shops and subscriptions |

## 3. User stories

User stories describe features from the user's side: **As a [user], I want [action] so that [benefit].**

- As an **attendant**, I want to record a sale by tapping products, so that sales are quick even when the shop is busy.
- As an **owner**, I want an alert when stock is low, so that I reorder before running out.
- As an **owner**, I want to record credit sales and see who owes what, so that I can follow up.
- As a **customer**, I want to pay by M-Pesa in the app, so that I don't need cash.

Each story gets **acceptance criteria**: *"Given stock of 3 and a low-stock level of 5, when the owner opens the app, then a low-stock badge shows the product."*

## 4. MoSCoW: what goes in version 1

| Must have (MVP) | Should have | Could have | Won't have (yet) |
|---|---|---|---|
| Products, stock, record sales, daily total, low-stock alerts, login | Credit/debts, M-Pesa payments | Customer ordering, reports by month | Multi-branch, loyalty points, AI forecasting |

The **MVP** (minimum viable product) is only the **Must have** column. Launch it, get real users, then build the rest based on what they actually use.

## 5. Screens and flow

List screens and how users move between them (draw boxes and arrows on paper or in Figma):

```
Login → Home (today's total, low stock, quick actions)
         ├── Sell → choose products → confirm → receipt
         ├── Stock → product list → add / edit product
         ├── Debts → customer → record payment
         └── Settings
```

## 6. The data model

What information must be stored, and how it connects:

| Table | Fields |
|---|---|
| shops | id, name, owner_phone, town, plan, created_at |
| users | id, shop_id, name, phone, role (owner/attendant), password_hash |
| products | id, shop_id, name, price, stock, low_at |
| sales | id, shop_id, user_id, total, method (cash/mpesa/credit), customer_id, created_at |
| sale_items | id, sale_id, product_id, qty, price |
| customers | id, shop_id, name, phone, balance |

Practise designing and querying tables like these in the **SQL** subject. Getting the data model right early makes everything else easier.

## 7. Non-functional requirements

Not features, but qualities the app must have:

- Works on **cheap Android phones** (2 GB RAM, Android 8+).
- Recording a sale works **offline** and syncs later.
- Each screen loads in under **2 seconds** on 3G.
- Data is **backed up daily**; personal data handled under the **Data Protection Act**.
- Available in **English and Kiswahili**.

## 8. Estimate and plan the work

Break the MVP into tasks of half a day to two days each, estimate them, and add **30% buffer** for the unexpected. Plan in **1 to 2 week sprints**, each ending with something the client can try.

## Planning template

```
App name:
Problem statement:
Users and goals:
User stories (with acceptance criteria):
MVP (Must have):
Later (Should / Could):
Screens and flow:
Data model:
Non-functional requirements:
Tech stack:
Timeline and budget:
```

## Why planning saves projects

Many app projects fail not because of bad code but because nobody agreed what to build: features keep growing, budgets run out, and the client is unhappy with something different from what they imagined. A short, clear plan aligns everyone, makes estimates realistic and helps you say "that's for version 2" politely. Product managers, freelance developers, agency teams and startup founders all use these planning tools.

## Discovery questions to ask the client

| Area | Questions |
|---|---|
| Business goal | What problem are we solving? How will we measure success (orders, time saved, fewer calls)? |
| Users | Who will use it? What phones and internet do they have? Which languages? |
| Current process | How is it done today (paper, WhatsApp, Excel)? What goes wrong? |
| Must-have features | What's the smallest version that's useful? |
| Integrations | M-Pesa? SMS? Existing systems (accounting, school system)? |
| Content and data | Who provides product lists, photos, text? Is there existing data to import? |
| Constraints | Budget, deadline, who maintains it after launch |
| Risks | Legal requirements (data protection, licences), dependencies on third parties |

Record the answers in a shared document and send a summary for the client to confirm.

## Writing good user stories

```text
As a parent, I want to see my child's fee balance, so that I can pay the right amount.
   Acceptance criteria:
   - Balance shows the latest payment within 5 minutes of the M-Pesa confirmation
   - Shows the date and receipt of the last payment
   - Works on a 4.7-inch screen on a slow connection
```

**Acceptance criteria** describe exactly when a story is "done", which prevents arguments later.

## An MVP example: a school fees app

| Must have (MVP) | Should have | Could have | Won't have (now) |
|---|---|---|---|
| Parent login with phone + OTP | Fee statement PDF download | Report cards | Online exams |
| View balance and payment history | Push notification when payment is received | Chat with teachers | Transport tracking |
| Pay with M-Pesa (STK push) | Several children per parent | Kiswahili interface | Alumni module |
| Admin: upload fee structure, record payments | SMS reminders before deadlines | Analytics dashboard | |

Launching the MVP gets real feedback quickly; later versions add features people actually ask for.

## Data model example

```text
Parent (id, name, phone, email)
Student (id, admission_no, name, class, parent_id → Parent)
FeeItem (id, term, class, description, amount)
Invoice (id, student_id → Student, term, total, balance)
Payment (id, invoice_id → Invoice, amount, mpesa_receipt UNIQUE, paid_at, status)
```

Drawing the data model early reveals questions: Can one parent have several children? Can a payment cover two terms? What happens with overpayments?

## Screen list and flows

```text
Splash → Login (phone) → Enter OTP → Home (children list)
Home → Child details (balance, history) → Pay → Enter amount → STK prompt → Waiting → Success/Failure
Home → Profile → Settings / Logout
```

Sketch each screen on paper first, then create clickable wireframes (Figma) for the client to try before development.

## Estimating realistically

1. Break features into tasks small enough to estimate (half a day to two days each).
2. Estimate each task, including testing and fixes.
3. Add time for: setup, design, integrations (payments often take longer than expected), deployment, store review, project communication.
4. Add a **buffer** (20–30%) for unknowns.
5. Group tasks into milestones with deliverables the client can see.

| Milestone | Deliverable |
|---|---|
| 1. Design | Approved wireframes and visual design |
| 2. Core build | Login, balances and history working on test data |
| 3. Payments | M-Pesa sandbox payments end to end |
| 4. Beta | App on internal testing for staff and a few parents |
| 5. Launch | Published app, admin training, handover documents |

## Managing scope changes

Change is normal; uncontrolled change is the problem.

- Keep a **change log**: each new request gets a description, estimate and decision.
- Explain the impact: "Adding chat adds about two weeks and KSh X. We can add it after launch."
- Get written approval before starting extra work.

## Planning tools

| Tool | Use |
|---|---|
| Google Docs / Notion | Requirements, decisions, meeting notes |
| Trello, GitHub Projects, Jira | Task boards (To do, In progress, Review, Done) |
| Figma | Wireframes and designs |
| draw.io / Excalidraw | Data models and flow diagrams |
| A shared calendar | Milestones and demo meetings |

## Practice

1. Write 10 user stories with acceptance criteria for a salon booking app.
2. Sort them into MoSCoW and define the MVP.
3. Draw the data model and the main screen flow.
4. Estimate the MVP tasks, add a 25% buffer, and group them into milestones.
5. Write a one-page project summary a client could approve.

:::think Halfway through a project, the client asks to add "a small chat feature". How do you handle it professionally?
Thank them, clarify what they need (real-time chat, or simply WhatsApp links?), estimate the time and cost including testing and moderation, explain the effect on the launch date, and record it in the change log. Offer options: add it after launch, swap it for another feature of similar size, or extend the timeline and budget with written approval.
:::

```quiz
Q: In the user story format "As a ..., I want ... so that ...", what comes after "As a"?
A: user | the user | a user
Q: In MoSCoW, which column becomes the MVP?
A: Must have | must | must have
Q: How much buffer should you add to estimates? Give a percentage.
A: 30% | 30 | thirty percent
Q: Qualities like speed, offline use and security are called ...-functional requirements?
A: non | non-functional
Q: Which table in the data model links each sold product to a sale?
A: sale_items
Q: What describes exactly when a user story is complete? (two words)
A: acceptance criteria
Q: What is a record of requested changes with estimates and decisions called? (two words)
A: change log | changelog
Q: In MoSCoW, what does the W stand for? (two words)
A: won't have | wont have | will not have
```
