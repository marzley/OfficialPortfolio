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
```
