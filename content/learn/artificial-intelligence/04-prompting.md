---
slug: prompting-masterclass
title: "Level 2: Prompting masterclass: getting great answers every time"
after: ai-tools-map
---
# Level 2: Prompting masterclass: getting great answers every time

The same AI gives a weak answer to a vague question and an excellent answer to a clear one. Writing clear instructions is called **prompting**, and it's the most valuable AI skill for everyone, from students to CEOs.

## Why vague prompts fail

> ❌ *"Write a business plan."*

The AI doesn't know your business, location, budget, audience or what the plan is for. It fills the gaps with generic guesses.

> ✅ *"I'm starting a mobile car wash in Ruiru with KSh 80,000. Write a one-page business plan for a youth fund application: services and prices, target customers, startup costs, monthly costs, expected income, and risks. Use simple English and a table for the numbers."*

## The RTCFE formula

Good prompts usually include five parts:

| Part | Question it answers | Example |
|---|---|---|
| **R**ole | Who should the AI act as? | "Act as an experienced KCSE chemistry teacher." |
| **T**ask | What exactly should it do? | "Explain moles and write 5 practice questions." |
| **C**ontext | What does it need to know? | "My student is in Form 3 and struggles with calculations." |
| **F**ormat | How should the answer look? | "Short steps, then questions in a numbered list, answers at the end." |
| **E**xamples | What does good look like? | "Like this: 'Q1. How many moles are in 22 g of CO₂?'" |

You don't need all five every time, but **task + context + format** fixes most weak answers.

## Before and after

| Weak prompt | Strong prompt |
|---|---|
| "Write a CV." | "Write a one-page CV for a fresh IT diploma graduate from a TVET in Nyeri applying for a junior IT support role. Skills: networking, Windows, Excel, customer service. Attachment: 3 months at a county office. Use clear headings and bullet points." |
| "Make a poster text." | "Write text for a A4 poster for a church fundraiser (harambee) on 12 October at 2 pm, at PCEA Kiambu. Goal: KSh 500,000 for a new roof. M-Pesa Paybill 123456, account ROOF. Keep it under 60 words, warm and respectful." |
| "Help with Excel." | "In Excel, column B has sales amounts and column C has M-Pesa or Cash. Give me a formula for total M-Pesa sales, and explain it step by step." |

## Techniques that work

### 1. Ask for questions first
> *"Before you write it, ask me 5 questions you need answered to do this well."*

### 2. Give it something to work from
Paste the article, your notes, the job advert or your draft. AI is much better at improving your material than inventing from nothing.

### 3. Iterate, don't restart
Treat the first answer as a draft: *"Shorter."*, *"More formal."*, *"Add prices in KSh."*, *"Remove the jargon."*, *"Make point 3 clearer."*

### 4. Break big jobs into steps
Instead of "write my whole proposal", go: outline → section 1 → section 2 → review → final edit.

### 5. Ask it to check itself
> *"Review your answer. List any mistakes, missing points or assumptions."*

### 6. Control the format
> *"Answer in a table with columns: Task, Who, Deadline."* · *"Give me exactly 3 options."* · *"Reply in Kiswahili."* · *"Use bullet points, no more than 100 words."*

### 7. Set the audience and tone
> *"Explain for a farmer with primary education."* · *"Friendly and professional, like a bank's customer care."*

### 8. Use examples (few-shot prompting)
Show 1 to 3 examples of what you want, and the AI copies the style and structure.

## A reusable prompt template

```
Act as [role].
I need you to [task].
Background: [who it's for, your situation, important facts].
Requirements: [length, tone, must-include points, things to avoid].
Format: [table / bullets / steps / email / language].
First, ask me any questions you need.
```

Save templates for things you do often (social posts, emails, lesson plans, reports) in a notes app.

## Prompting practice in Python

AI apps often build prompts from data. This program fills a template for several products, which is exactly what businesses do to generate many product descriptions at once.

```try-python
template = (
    "Act as a copywriter for a Kenyan online shop.\n"
    "Write a {words}-word product description for: {name}.\n"
    "Price: KSh {price:,}. Key features: {features}.\n"
    "Tone: friendly. End with a call to order on WhatsApp."
)

products = [
    {"name": "Solar lantern", "price": 1850, "features": "8 hours light, phone charging, 1-year warranty"},
    {"name": "Ceramic jiko", "price": 1200, "features": "saves charcoal, durable, keeps heat long"},
]

for p in products:
    prompt = template.format(words=60, **p)
    print(prompt)
    print("-" * 40)
```

## Common mistakes

- **Too short and vague.** Add context.
- **Trying to do everything in one prompt.** Split it.
- **Accepting the first answer.** Iterate.
- **Not checking facts.** Especially numbers, laws and names.
- **Sharing private data** you shouldn't.

```quiz
Q: In the RTCFE formula, what does the T stand for?
A: task
Q: In the RTCFE formula, what does the C stand for?
A: context
Q: Giving the AI 1 to 3 examples of what you want is called ...-shot prompting?
A: few | few-shot
Q: Should you restart from scratch, or improve the first answer with follow-ups?
A: improve | follow-ups | iterate | improve the first answer
Q: Which simple instruction makes the AI gather information before writing? Complete: "Before you write, ask me ..."
A: questions | 5 questions | any questions
```
=== exercise ===
Make the prompt better. Fill in the template so it prints a full prompt for a **matatu sacco** that wants a **WhatsApp message** reminding members about a meeting on **Saturday at 10am**. The printed prompt must contain the words `matatu`, `WhatsApp` and `Saturday`.
=== starter ===
role = "a friendly sacco secretary"
task = ""
context = ""
fmt = ""
print(f"Act as {role}. {task} Background: {context} Format: {fmt}")
=== expected ===
Saturday
=== must_contain ===
WhatsApp
matatu
