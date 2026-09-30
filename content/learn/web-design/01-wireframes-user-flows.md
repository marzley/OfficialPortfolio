---
slug: wireframes-user-flows
title: UX research, user flows and wireframes
after: design-principles
---
# UX research, user flows and wireframes

Good design starts **before** colours and fonts. **UX (user experience) design** asks: who uses this, what are they trying to do, and what's the easiest way to let them do it? Skipping this step is why many websites look nice but don't bring customers.

## 1. Understand the users

Ask the business owner and, even better, real customers:

- Who are the customers? (Age, location, phone or computer, data budget)
- What do they want to do on the site? (See prices? Book? Pay? Find the location?)
- What stops them today? (Can't find prices, too many steps, slow pages)
- What do competitors do well or badly?

Write a short **persona**: a realistic description of a typical user.

> **Wanjiru, 29, Juja.** Uses a mid-range Android phone with limited bundles. Wants to order a birthday cake for her son quickly on her lunch break. Needs to see prices and delivery dates upfront, and pay with M-Pesa. Gets annoyed by forms that ask for too much.

## 2. Map the user flow

A **user flow** is the path someone takes to finish a task. Draw it as boxes and arrows:

```
Google search "birthday cakes Juja"
        │
        ▼
 Home page ──► Birthday cakes page ──► Choose a cake ──► Pick size & date
                                                             │
                                                             ▼
                      Confirmation + M-Pesa prompt ◄── Enter name & phone
                                │
                                ▼
                      WhatsApp/SMS receipt
```

Count the steps. Can any be removed? Every extra step loses some customers.

## 3. Information architecture

Decide what pages exist and how they're organised (the **sitemap**) and what goes in the menu. Use the words customers use: "Prices" beats "Our Offerings".

```
Home
├── Cakes
│   ├── Birthday
│   ├── Wedding
│   └── Cupcakes
├── Prices & delivery
├── Gallery
└── Contact / Order
```

Keep the main menu to about **5–7 items**.

## 4. Wireframes: the blueprint

A **wireframe** is a simple black-and-white sketch of a page's layout: boxes for images, lines for text, labels for buttons. No colours or real photos yet, so everyone focuses on **structure and content**.

```
┌───────────────────────────────┐
│ LOGO                  ☰ Menu  │
├───────────────────────────────┤
│  [ Big cake photo ]           │
│  Fresh cakes in Juja          │
│  [ Order on WhatsApp ]        │
├───────────────────────────────┤
│ [img] Birthday   from KSh 1,500│
│ [img] Wedding    from KSh 8,000│
│ [img] Cupcakes   from KSh 600  │
├───────────────────────────────┤
│ ★★★★★ "Best cake ever" – Amina│
├───────────────────────────────┤
│ Delivery: Juja, Thika, Ruiru  │
│ [ Call ]  [ WhatsApp ]        │
└───────────────────────────────┘
```

Start with **mobile** (most visitors), then expand for desktop.

| Fidelity | What it is | Tool |
|---|---|---|
| Low | Paper sketches | Pen and paper, whiteboard |
| Mid | Clean grey boxes | Figma, Balsamiq, Excalidraw |
| High (mockup) | Real colours, fonts, images | Figma |
| Prototype | Clickable mockup | Figma prototype mode |

## 5. Test with real people

Show the wireframe or prototype to 3–5 people from your target group and give them a task: "Order a 2 kg birthday cake for Saturday." **Watch silently.** Where do they hesitate? What do they tap by mistake? Five people usually reveal most big problems.

## UX principles to remember

- **Don't make me think**: obvious labels, familiar patterns (logo top-left links home, cart top-right).
- **Clear primary action** on every page.
- **Consistency**: the same button style and wording everywhere.
- **Feedback**: after every action, show what happened ("Order received!").
- **Forgive mistakes**: allow undo, keep what the user typed after an error.
- **Speed is UX**: a fast site feels better designed.

```quiz
Q: What is a realistic description of a typical user called?
A: persona | a persona
Q: What is the path a user takes to complete a task called? (two words)
A: user flow | flow
Q: What is a simple black-and-white layout sketch of a page called?
A: wireframe | a wireframe
Q: Should you design for mobile first or desktop first for most Kenyan websites?
A: mobile | mobile first
Q: About how many test users reveal most big usability problems?
A: 5 | five | 3-5
```
