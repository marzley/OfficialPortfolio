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
```
