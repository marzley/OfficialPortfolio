---
slug: prompting
title: "Writing good prompts: the RTCF recipe, giving context and examples, step-by-step tasks, iterating and prompt templates"
after: KEEP
---
# Writing good prompts: the RTCF recipe, giving context and examples, step-by-step tasks, iterating and prompt templates

The quality of what you get from an AI assistant depends heavily on what you ask. "Write a CV" gives a generic result; a prompt with your background, the job, the format and the tone gives something you can actually use. **Prompting** is the skill of communicating clearly with AI tools, and it's really the same skill as giving clear instructions to a person. This unit teaches a simple recipe, techniques professionals use, how to refine answers through conversation, and ready-made templates for study, work and business.

:::note What you will learn
- Why vague prompts give vague answers
- The Role, Task, Context, Format (RTCF) recipe
- Adding audience, tone, length and constraints
- Giving examples and source material
- Breaking big tasks into steps
- Asking the AI to ask you questions
- Iterating: refining, critiquing and comparing
- Prompting for images
- Checking outputs and avoiding common mistakes
- Prompt templates you can reuse
:::

## Vague vs specific

| Vague prompt | Specific prompt |
|---|---|
| "Write a CV." | "Write a one-page CV for a 2025 KCSE graduate applying for a customer service job at a Nairobi call centre. I'm fluent in English and Kiswahili, did a 3-month attachment at a cyber café, and know Excel basics. Use clear headings and bullet points." |
| "Explain photosynthesis." | "Explain photosynthesis to a Form 2 student in simple English, using an example of maize plants. Keep it under 200 words and end with 3 quiz questions." |
| "Marketing ideas for my shop." | "Give me 10 low-cost marketing ideas for a small hardware shop in Kitengela. Customers are mostly local builders and homeowners. My budget is KSh 5,000 per month. Put them in a table with cost and expected impact." |

## The RTCF recipe

| Part | Meaning | Example |
|---|---|---|
| **Role** | Who the AI should act as | "You are an experienced Kenyan secondary school biology teacher." |
| **Task** | What exactly to do | "Create a revision guide on the circulatory system." |
| **Context** | Background, audience, purpose, constraints | "For Form 3 students preparing for exams; they struggle with the heart's structure." |
| **Format** | How the answer should look | "Use headings, a labelled list of heart parts, a table comparing arteries and veins, and 5 practice questions with answers." |

Add as needed: **tone** (friendly, formal), **length** (under 150 words), **language** (simple English, Kiswahili), **things to avoid** (no jargon), **examples** of what you like.

## Give examples and source material

AI performs better when you show it what "good" looks like or give it the facts to use:

```
Here are two Instagram captions our bakery liked:
1) "Sunday treat sorted 🍰 Fresh vanilla cakes, ready by 10am. Order on WhatsApp 0712..."
2) "Birthday in the house? 🎉 Custom cakes from KSh 1,800, delivered in Nakuru."
Write 5 new captions in the same style for our new chocolate cupcakes (KSh 150 each, minimum order 6).
```

For documents, paste or upload the text (non-confidential) and ask: "Using only the information below, summarise...". This reduces hallucinations because the model works from your source.

## Break big tasks into steps

Instead of "Write my business plan", work in stages:
1. "Ask me 10 questions you need answered to write a business plan for my poultry project."
2. (Answer them.)
3. "Draft an outline with sections and bullet points."
4. "Write the market analysis section using my answers. Mark anything you're unsure about."
5. "Create a 12-month cash flow table in a format I can paste into Excel."

You can also ask the AI to **think step by step** for reasoning tasks ("Work through the calculation step by step, then give the final answer") and check each step.

## Let the AI interview you

"Before you write anything, ask me the questions you need to do this well." This is one of the most useful prompts: it surfaces details you forgot to include.

## Iterate: conversation, not one shot

The first answer is a draft. Refine it:
- "Make it shorter and more formal."
- "Rewrite for a WhatsApp message, under 60 words."
- "Use simpler words for a primary school parent."
- "Give me three different versions: friendly, professional, urgent."
- "What's missing or weak in this proposal? Then improve it."
- "Turn this into a table."
- "Translate to Kiswahili, keeping a friendly tone."

Ask it to **critique your own work**: "Here's my cover letter. List the 5 biggest weaknesses and suggest fixes, then show an improved version."

## Prompting for images

For image tools (Canva Magic Media, Adobe Firefly, ChatGPT/Gemini image generation):

```
Subject: a smiling Kenyan woman farmer holding fresh tomatoes
Setting: a green farm in the Rift Valley, morning light
Style: realistic photography, warm natural colours
Composition: medium shot, space on the right for text
Format: square 1:1, for an Instagram post
Avoid: text, logos, distorted hands
```

Check generated images carefully (hands, faces, text, cultural accuracy), and don't create misleading images of real people or fake "real" events.

## Checking outputs

| Check | How |
|---|---|
| **Facts and numbers** | Verify with official or reliable sources |
| **Calculations** | Recalculate in Excel or a calculator |
| **References/links** | Open them; AI sometimes invents sources |
| **Local accuracy** | Kenyan laws, prices, procedures change: check KRA, eCitizen, KNEC, CBK sites |
| **Tone and voice** | Edit so it sounds like you, not generic AI |
| **Privacy** | Remove any personal data you shouldn't share |

## Common mistakes

- Too vague, no context or audience.
- Asking for everything at once.
- Accepting the first answer.
- Not saying the format you need.
- Trusting facts without checking.
- Sharing confidential information.

## Reusable templates

**Explain a topic**
```
Explain [topic] to a [level/audience] in simple language. Use an example from Kenya.
Keep it under [N] words. End with [N] practice questions and answers.
```

**Professional email**
```
Write a polite, professional email to [recipient] about [purpose]. Key points: [points].
Tone: [friendly/formal]. Length: under [N] words. Include a clear subject line.
```

**Summarise a document**
```
Summarise the text below for [audience] in [N] bullet points, then list action items with owners and dates.
Use only information in the text; say "not stated" if something is missing.
[paste text]
```

**Social media content**
```
You are a social media manager for [business] in [town]. Our customers are [audience].
Create a 2-week content calendar (table: date, platform, post idea, caption, call to action).
Tone: [tone]. Include prices where relevant: [prices].
```

**Learning plan**
```
I want to learn [skill] in [N] weeks with [hours] per day. I'm a [beginner/intermediate].
Create a week-by-week plan with free resources, practice projects and checkpoints.
```

**Feedback on my work**
```
Act as a strict but helpful [examiner/editor/client]. Review my [essay/CV/proposal] below.
List strengths, the top 5 weaknesses with specific fixes, and a score out of 10 with reasons.
[paste work]
```

:::think Improve this prompt: "make a poster for my event".
Example improvement: "You are a graphic designer. Suggest the text and layout for an A4 poster for a free youth coding bootcamp in Kisumu on Saturday 14 September, 9 am–4 pm, at the Kisumu Library. Audience: 16–25-year-olds. Include a catchy headline, 3 bullet benefits, registration via a QR code, and the organiser's logo placement. Give 3 headline options and describe colours and imagery." Then use the output in Canva and refine.
:::

## Summary

- Specific prompts beat vague ones; use Role, Task, Context, Format, plus tone, length, language and constraints.
- Provide examples and source material; ask the AI to use only your text when accuracy matters.
- Break big tasks into steps, let the AI ask you questions, and iterate with follow-ups and critiques.
- For images, describe subject, setting, style, composition, format and things to avoid.
- Always check facts, numbers, links and local accuracy; keep private data out; reuse templates.

```quiz
Q: What is the text you give an AI tool called?
A: prompt | a prompt
Q: In the recipe Role, Task, Context, ___ — what is the fourth part?
A: Format
Q: After the first answer, should you refine your request with follow-ups? (yes or no)
A: yes
Q: What is a useful way to reduce hallucinations when summarising a document? (use only your …)
A: source | text | your text | the text | source material
Q: Should you verify references and links an AI gives you? (yes/no)
A: yes
```
