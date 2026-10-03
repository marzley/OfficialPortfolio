---
slug: ai-for-business
title: "Level 3: AI for business and marketing"
after: hallucinations-fact-checking
---
# Level 3: AI for business and marketing

A small business with one owner and AI can now produce marketing, customer replies and plans that used to need a whole team. This lesson shows how Kenyan businesses use AI, step by step, and where to be careful.

## 1. Know your customer (research)

> *"I run a beauty shop in Embu selling hair products and cosmetics. Describe my 3 main customer types: who they are, what they want, what worries them, where they spend time online, and what message would make them buy."*

Use the answer as a starting point, then **talk to real customers** to confirm.

## 2. A month of social media content in an hour

> *"Create a 4-week content calendar for my bakery in Nakuru on Instagram and TikTok: 3 posts per week. Mix: product showcases, behind-the-scenes, customer stories, offers and tips. For each post give: day, idea, caption under 40 words with 3 hashtags, and a short video idea."*

Then ask for the captions in **Kiswahili** or **Sheng** for some posts, and design the images in Canva.

## 3. Product descriptions that sell

> *"Write a product description for an online listing: 'Ramtons 2-plate electric cooker'. Audience: families in town apartments. Mention: saves time, easy to clean, 1-year warranty. 80 words, benefits first, then key specs as bullets. End with 'Order on WhatsApp 07XX...'."*

Generate many at once with a spreadsheet of products (see the automation lesson).

## 4. Customer service replies

Create a document of **approved facts**: prices, delivery areas and fees, opening hours, return policy, payment methods (Till/Paybill). Then:

> *"Using only these facts: [paste], reply to this customer message politely and briefly: [paste message]. If the answer isn't in the facts, say we'll confirm and get back to them."*

"Using only these facts" reduces made-up answers. Never let AI promise discounts or delivery times you don't offer.

## 5. WhatsApp chatbots

Businesses connect AI to **WhatsApp Business** (through the WhatsApp Business Platform and providers) so customers get instant answers at night. Before you build one:

- Start with **quick replies and a catalogue** in the free WhatsApp Business app.
- Add an AI assistant only for **frequent questions**, with an easy way to reach a human.
- Respect privacy: tell customers they're chatting with an assistant, and don't store data you don't need (Kenya's Data Protection Act applies).

## 6. Ads and offers

- *"Write 5 Facebook ad headlines (under 40 characters) and 3 primary texts (under 125 characters) for a back-to-school uniform offer in Kisumu."*
- *"Suggest a simple A/B test: two versions of this ad and what to measure."*

## 7. Plans, pricing and numbers

- *"Help me price my catering service: food cost per plate KSh 180, staff KSh 3,000 per event, transport KSh 1,500. I want 30% profit. What should I charge for 100 guests?"*
- *"Write a one-page business plan summary for a youth fund application from these notes: [paste]."*

**Always check the maths.** Here's the catering example done in code: compare it to what the AI says.

```try-python
guests = 100
food_per_plate = 180
staff = 3000
transport = 1500
target_margin = 0.30   # 30% of the price is profit

cost = guests * food_per_plate + staff + transport
price = cost / (1 - target_margin)
print(f"Total cost: KSh {cost:,}")
print(f"Price for 30% margin: KSh {price:,.0f}  (about KSh {price / guests:,.0f} per plate)")
print(f"Profit: KSh {price - cost:,.0f}")
```

Note: "30% profit" can mean 30% **markup** on cost or 30% **margin** of the price. They give different prices. Make sure you and the AI mean the same thing.

## 8. Branding and design

- Name ideas, slogans, colour palettes, logo concepts (then refine with a designer or in Canva).
- Check that a name isn't already registered (eCitizen business name search) or trademarked.

## Business AI rules

| Do | Don't |
|---|---|
| Give AI your real facts and brand voice | Let it invent prices, policies or testimonials |
| Review everything before posting | Post fake reviews or AI images pretending to be real customers |
| Keep customer data private | Paste customers' personal data into public tools |
| Use AI to save time on routine work | Replace real conversations with customers |

## How small businesses use AI to compete

Small businesses rarely have marketing teams, designers or analysts. AI tools can help a shop, salon, restaurant, farm or online seller do tasks that used to require hiring help: writing product descriptions, planning social media, replying to customers, drafting business plans and analysing sales. Used carefully, AI saves time and money; used carelessly, it can produce generic content, mistakes and privacy problems.

## A weekly AI workflow for a small business

| Day | Task | Example prompt |
|---|---|---|
| Monday | Plan the week's posts | "Plan 5 WhatsApp Status and Instagram posts for a bakery in Kisumu this week, including one offer and one behind-the-scenes post." |
| Tuesday | Product descriptions | "Write a 50-word description for a chocolate birthday cake (1 kg, serves 10), friendly tone, include price KSh 2,500 and order by WhatsApp." |
| Wednesday | Customer replies | "Draft polite replies to these 3 customer messages: [messages]" |
| Thursday | Review numbers | "Here are this week's sales totals by product: [summary]. What patterns do you notice? Suggest questions I should ask." |
| Friday | Weekend promotion | "Write a short weekend offer message under 40 words with a clear call to action." |

Always add real details (prices, location, photos) and check facts before posting.

## Writing that sounds like you, not like AI

- Give examples of your past posts and say "Write in this style."
- Include local details: your area, landmarks, local words customers use.
- Remove clichés and exaggerations ("best in the universe", "game-changing").
- Read posts aloud; edit until they sound natural.

## Customer service with guardrails

```text
Prompt: You are a helpful assistant for Mama's Kitchen in Nakuru.
Using ONLY the information below, answer the customer's question.
If the answer isn't in the information, say: "Let me check with the team and get back to you."
Information: Open 7am–9pm daily. Delivery within 5 km for KSh 100. Payment by M-Pesa till 123456 or cash.
Customer question: Do you deliver to Milimani and can I pay by card?
```

Grounding replies in approved information reduces made-up answers (like promising card payments you don't accept). Review automated replies regularly.

## Simple market research

- Ask AI to list questions to include in a customer survey (then run it with Google Forms).
- Summarise customer reviews or feedback into common themes (remove names first).
- Compare your offer with competitors you describe, and brainstorm improvements.

AI doesn't know your local market as well as you and your customers do; test ideas with real customers before investing heavily.

## Business planning and numbers

```text
Prompt: I want to start a small poultry business with 200 layers. Help me list the
start-up costs and monthly costs I need to research (housing, chicks, feed, vaccines,
labour, transport), and create a simple profit calculation template. Don't assume prices;
leave blanks for me to fill from local suppliers.
```

Asking AI to leave blanks for prices prevents it from inventing numbers. Fill in real quotes from suppliers, then check the calculations.

## Pricing and promotions

- Use AI to brainstorm bundle ideas ("family pack", "back-to-school combo") and promotion calendars around local events (school opening, holidays, paydays).
- Calculate discount effects on profit before launching offers:

| Price | Cost | Profit per item | With 20% discount |
|---|---|---|---|
| KSh 500 | KSh 300 | KSh 200 | KSh 100 (profit halves) |

You'd need to sell twice as many items to earn the same profit; AI can help create the table, but you decide whether it's worth it.

## Rules for using AI in business

1. Never paste customers' personal data (phone numbers, ID numbers, payment details) into public AI tools.
2. Check every fact, price and promise before publishing.
3. Use real photos of your products where possible; label AI-generated images as illustrations if they could mislead.
4. Respect copyright and other businesses' brands.
5. Keep humans responsible for complaints, refunds and sensitive conversations.

## Practice

1. Create a week of social media posts for a business you know, then edit them to sound local and natural.
2. Write a grounded customer-service prompt using real business information.
3. Build a start-up cost template with blanks and fill it with real quotes.
4. Summarise 10 customer reviews into themes (with names removed).
5. Calculate the profit effect of a discount offer before launching it.

:::think An AI-written post for a salon promises "free hair treatment with every visit", which the owner never offered, and customers start demanding it. How could this have been prevented?
The owner should have reviewed and edited the post before publishing, and the prompt should have included the real offer details with an instruction not to add promotions. AI fills gaps with plausible-sounding content, so business details must come from the owner and be checked.
:::

```quiz
Q: Which phrase reduces made-up answers in customer replies? Complete: "Using only these ..."
A: facts
Q: A cost is KSh 1,000. What price gives a 50% margin (profit is half of the price)?
A: 2000 | 2,000 | KSh 2000 | KSh 2,000
Q: A cost is KSh 1,000. What price gives a 50% markup on cost?
A: 1500 | 1,500 | KSh 1500 | KSh 1,500
Q: Which Kenyan law covers storing customers' personal data?
A: Data Protection Act | the Data Protection Act
Q: Should a business post AI-generated fake customer reviews? (yes or no)
A: no
Q: What instruction helps prevent an AI customer-service assistant from inventing answers? (using only the ...)
A: information below | information provided | only the information | using only the information
Q: Should you paste customers' phone numbers and payment details into public AI tools? (yes or no)
A: no
Q: If a KSh 500 item costs KSh 300, what is the profit per item after a 20% discount?
A: 100 | KSh 100
```
