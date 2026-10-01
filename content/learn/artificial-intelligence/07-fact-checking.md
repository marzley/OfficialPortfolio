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
