---
slug: hallucinations-fact-checking
title: "Level 2: When AI is wrong: hallucinations, bias and fact-checking"
after: ai-at-work
---
# Level 2: When AI is wrong: hallucinations, bias and fact-checking

AI assistants write fluently and confidently, even when they're wrong. Knowing **how and why AI makes mistakes** is what separates careless users from professionals.

## Hallucinations: confident but false

A **hallucination** is when an AI states something false as if it were true: a made-up statistic, a fake quote, a book that doesn't exist, a wrong law, a non-existent website, or a reference to a court case that never happened.

Why it happens: language models are trained to produce **likely-sounding text**. Most of the time, likely text is also true. When the model doesn't know, it may still produce text that *sounds* right.

Risky areas:

| Area | Example of a hallucination |
|---|---|
| Numbers and statistics | "Kenya has 72% internet penetration" (made-up figure) |
| Laws, rates and fees | An outdated tax rate or a wrong fee |
| References and links | Real-looking papers or URLs that don't exist |
| Recent events | Confident answers about events after its training data |
| People | Wrong jobs, quotes or biographies of real people |
| Local details | Wrong office locations, phone numbers, prices |

## Bias

AI learns from human-written data, which contains human biases. It may:

- Assume a doctor is a man and a nurse is a woman.
- Know far more about the US or Europe than about Kenya, and give foreign answers to local questions (US laws, dollar prices, American examples).
- Under-represent African languages, names and faces.

Fix it by **giving local context** ("in Kenya", "in KSh", "under Kenyan law") and by questioning answers that feel stereotyped.

## The fact-checking routine

1. **Ask for sources**: *"What are your sources? Give links."* Then **open the links**: do they exist and say what the AI claimed?
2. **Check official sources** for rules, fees and procedures: KRA, eCitizen, the relevant ministry, Kenya Law (kenyalaw.org), the Central Bank, your county government.
3. **Cross-check**: ask a second AI or search the web. Agreement isn't proof, but disagreement is a warning.
4. **Ask the AI to doubt itself**: *"Which parts of your answer are you least sure about?"*
5. **Use tools with search** (Perplexity, assistants with web search on) for current information, and still check.
6. **For anything important** (money, health, law, publishing, clients), a human expert has the final word.

## Spot the problems

Read each AI answer and decide what's wrong.

## Why fact-checking AI is a core skill

AI tools can sound confident while being wrong. They may invent statistics, quotes, laws, references and even entire events (**hallucinations**), give outdated information, or reflect biases from their training data. Students, journalists, researchers, business owners and professionals who check AI outputs avoid embarrassing and costly mistakes. Fact-checking is now part of digital literacy.

## Types of AI errors

| Error | Example | How to catch it |
|---|---|---|
| Invented facts | A report that doesn't exist, a made-up statistic | Search for the original source |
| Fake references | A real-looking journal article with a wrong title or DOI | Open the link or search the exact title |
| Outdated information | Old fees, tax rates or procedures | Check the official source and date |
| Wrong calculations | Incorrect totals or percentages | Recalculate with a calculator, spreadsheet or code |
| Wrong context | US law applied to Kenya | Ask "Is this true in Kenya?" and verify locally |
| Bias | Stereotypes in descriptions or recommendations | Compare perspectives; question assumptions |
| Misquotes | Words attributed to someone who never said them | Find the original speech or article |

## A practical verification routine

1. **Identify claims**: underline each fact, number, name, date, quote and reference.
2. **Rank by importance**: what would cause harm if wrong (money, health, legal, reputation)?
3. **Find primary sources**: government sites, official statistics (e.g. KNBS), court and legal databases (e.g. Kenya Law), company announcements, peer-reviewed journals.
4. **Cross-check** with at least two reliable sources for important claims.
5. **Check dates**: is the information current?
6. **Recalculate numbers** yourself.
7. **Correct or remove** anything you can't verify.

## Lateral reading

Professional fact-checkers don't just read a page deeply; they open new tabs to learn **about the source**:

- Who published this? What's their reputation and possible bias?
- What do other reliable sources say about the same claim?
- Is the website, account or document what it claims to be?

## Checking images and videos

- **Reverse image search** (Google Lens, other search engines) shows where else an image appears and when.
- Look for AI image clues: odd hands, unreadable text, inconsistent shadows, warped backgrounds (though newer tools make fewer obvious mistakes).
- For videos, check the original uploader, date and location; look for credible news coverage.
- Be especially careful with dramatic content during elections, emergencies and protests.

## Checking numbers with code

```try-python
# An AI claimed: "Sales grew 35% from KSh 240,000 to KSh 312,000, and the average order rose to KSh 1,560 from 200 orders."
old, new, orders = 240_000, 312_000, 200
growth = (new - old) / old * 100
avg = new / orders
print(f"Growth: {growth:.1f}%")          # 30.0%, not 35%
print(f"Average order: KSh {avg:,.0f}")  # 1,560 is correct
```

One claim was right and one was wrong; recalculating catches the error.

## Asking AI to help check itself (with care)

```text
Prompt: List every factual claim in your previous answer as a numbered list,
mark which ones you are unsure about, and tell me what source I should check for each.
```

This helps you find what to verify, but the AI's self-assessment can also be wrong; always check independently.

## Reliable Kenyan sources to know

| Topic | Where to check |
|---|---|
| Laws and court decisions | Kenya Law (kenyalaw.org), the Kenya Gazette |
| Statistics | Kenya National Bureau of Statistics (KNBS) |
| Government services and fees | Official ministry and agency websites, eCitizen service pages |
| Tax | KRA official website |
| Banking and digital lenders | Central Bank of Kenya |
| Fact-checking | Established fact-checking organisations and credible newsrooms |

## Practice

1. Ask an AI for three statistics about Kenya's economy with sources, then verify each.
2. Ask for academic references on a topic and check whether each one exists.
3. Recalculate the numbers in an AI-written summary with a spreadsheet or Python.
4. Reverse-search an image that's been shared widely in a WhatsApp group.
5. Write a one-paragraph explanation of a topic using only verified facts, listing your sources.

:::think An AI gives you a perfect-looking reference: author, title, journal, year and page numbers, supporting your assignment's argument. You can't find it anywhere online. What should you assume and do?
Assume it may be fabricated (a hallucinated reference). Don't cite it. Search library databases and Google Scholar for real sources on the topic, read them, and cite only sources you have actually found and read. Citing fake references can count as academic misconduct.
:::

```quiz
Q: An AI says "The capital of Kenya is Mombasa." Is that a hallucination? (yes or no)
A: yes
Q: An AI cites "Kenya Digital Economy Report 2031" in 2026. What's suspicious about it? Write one word.
A: date | year | future
Q: An AI answers a Kenyan tax question using US dollar amounts and US law. What is this a sign of?
A: bias | foreign bias | not local
Q: What should you do with links an AI gives you as sources?
A: open them | check them | open and check them
Q: For fees and procedures, which kind of source is most reliable?
A: official | official sources | government websites
Q: What is checking a source by opening other tabs to learn about it called? (two words)
A: lateral reading
Q: Which Kenyan website publishes laws and court decisions? (two words)
A: Kenya Law | kenyalaw.org
Q: Should you cite a reference you couldn't find or open? (yes or no)
A: no
```

## Checking AI numbers with code

Here an "AI" claims totals in a report. Instead of trusting them, we recompute. Run it.

```try-python
claimed = {"Thika": 387500, "Nyeri": 271500, "Ruiru": 240000}
monthly = {"Thika": [182000, 205500], "Nyeri": [143000, 128500], "Ruiru": [99000, 131000]}

for branch, months in monthly.items():
    actual = sum(months)
    status = "OK" if actual == claimed[branch] else f"WRONG (actual {actual:,})"
    print(f"{branch}: claimed {claimed[branch]:,} -> {status}")
```

One of the totals is wrong: exactly the kind of small error that slips into reports when nobody checks.

## When to trust AI more (and less)

| Trust more | Trust less |
|---|---|
| Rewording, summarising text **you provided** | Facts it produces from memory |
| Brainstorming and drafts | Exact numbers, dates, prices, laws |
| Explaining well-established basics (photosynthesis, how loops work) | Recent events and local details |
| Code you will test | Advice with legal, financial or health consequences |

The skill isn't avoiding AI; it's **knowing when to verify**.
