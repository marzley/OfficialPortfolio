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

## Why planning before designing saves money

Changing a sketch takes minutes; changing a finished website takes days. UX (user experience) planning makes sure a website or app helps real people complete real tasks: finding a price, booking an appointment, paying school fees, applying for a job. UX designers, product managers, web designers and developers all use personas, user flows and wireframes. Clients are happier because they can see and approve the structure before money is spent on design and code.

## Researching users without a big budget

| Method | How | What you learn |
|---|---|---|
| Interviews | Talk to 5–8 real or potential users for 20 minutes | Needs, frustrations, words they use |
| Surveys | Short Google Form shared on WhatsApp | Patterns across more people |
| Observation | Watch someone try to complete a task on the current site or a competitor's | Where they get stuck |
| Analytics | Look at popular pages, exits, searches | What people actually do |
| Competitor review | Study 3–5 similar websites | Common patterns and gaps |
| Support messages | Read common questions from WhatsApp, email, calls | Missing information |

Ask open questions ("Tell me about the last time you looked for a plumber"), not leading ones ("Would you like an online booking feature?").

## Personas grounded in research

```
Persona: "Busy Parent Grace"
Age 38, accountant in Nairobi, uses an Android phone, often on mobile data.
Goal: pay school fees and check her child's report quickly.
Frustrations: long forms, needing a laptop, unclear fee balances.
Quote: "I just want to see what I owe and pay with M-Pesa in two minutes."
```

Good personas are based on real research, not stereotypes, and focus on goals, context and frustrations.

## Jobs to be done and user stories

User stories describe what people need in a simple format:

```
As a parent, I want to see my child's fee balance, so that I can pay the exact amount.
As a customer, I want to see delivery fees before checkout, so that there are no surprises.
As an admin, I want to export payments to Excel, so that I can reconcile with the bank.
```

Each story becomes a feature to design and test. Prioritise with MoSCoW: **Must have, Should have, Could have, Won't have (now)**.

## Mapping user flows in detail

A booking flow for a salon:

```
Home → "Book now" → Choose service → Choose stylist (optional) → Choose date/time
     → Enter name & phone → Confirm → Pay deposit (M-Pesa) → Confirmation (SMS/WhatsApp)
          ↘ Payment fails → Retry or pay at salon
```

Include **error paths** (payment fails, slot taken, no internet) and **decision points**. Count the steps: every unnecessary step loses some users.

## Information architecture: card sorting

To decide how to group pages and menu items, try **card sorting**:

1. Write each page/topic on a card (or use a free online tool).
2. Ask 5–10 users to group the cards in ways that make sense to them and name the groups.
3. Look for common patterns; use the users' group names for your menu labels.

Keep main navigation to about 5–7 items, with clear labels ("Pricing", not "Investment Packages").

## Wireframe fidelity levels

| Level | Tool | Purpose |
|---|---|---|
| Sketch (low fidelity) | Paper and pen | Explore many ideas quickly |
| Digital wireframe (mid fidelity) | Figma, Balsamiq, Excalidraw | Layout, content hierarchy, navigation |
| Mockup (high fidelity) | Figma | Final visual design with colours, fonts, images |
| Prototype | Figma prototype links | Clickable flows for testing |

Use real content (or realistic drafts) in wireframes rather than "Lorem ipsum", because content length changes layouts.

## Mobile-first wireframing

Start with the small screen:

- One column; most important action visible without scrolling ("WhatsApp us", "Book now").
- Thumb-friendly buttons at least about 44px tall.
- Short forms with the right keyboard types.
- Sticky call-to-action button on long pages.
- Then expand the layout for tablets and desktops.

## Usability testing step by step

1. Prepare 3–5 realistic tasks: "Find the price of a 3-page website and send an enquiry."
2. Recruit 5 users who match your audience.
3. Ask them to think aloud while using the prototype; don't help or explain.
4. Note where they hesitate, misclick or give up.
5. Fix the biggest problems and test again.

Five users typically uncover most major problems in a design; several small rounds beat one big test.

## Accessibility from the start

- Clear headings and logical reading order.
- Sufficient colour contrast and large tap targets.
- Labels on every form field; error messages that explain the fix.
- Alternatives for images and captions for videos.
- Consider low-literacy and multilingual users (simple words, icons with labels, Kiswahili options).

## Practice

1. Interview three people about how they find and contact a local service provider.
2. Write a persona and five user stories for a school fees portal.
3. Map the user flow for booking and paying for a service, including error paths.
4. Sketch mobile wireframes for the three main screens, then build them in Figma.
5. Run a usability test with three people and list the top three problems found.

:::think A client insists on adding 12 items to the main menu, a large slider and a pop-up newsletter form on page load, "because competitors have them". How would you use UX evidence to respond?
Show research and testing: watch users try to complete key tasks with and without the extras, and look at analytics (sliders and immediate pop-ups often get ignored or annoy visitors). Propose a simpler menu based on card sorting, a single strong hero with a clear call to action, and a newsletter prompt shown later or inline. Decisions backed by user evidence are easier for clients to accept.
:::

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
Q: What does the M in MoSCoW prioritisation stand for? (two words)
A: must have | must
Q: Which research method asks users to group topics to design navigation? (two words)
A: card sorting
Q: What format is "As a [user], I want [goal], so that [reason]"? (two words)
A: user story | user stories
```
