---
slug: what-is-ai
title: "What is AI? Machine learning, large language models, how chatbots work, what they can and can't do, and staying safe"
after: KEEP
---
# What is AI? Machine learning, large language models, how chatbots work, what they can and can't do, and staying safe

**Artificial intelligence (AI)** is now part of everyday life: chatbots like ChatGPT, Claude, Gemini, Copilot and Meta AI (inside WhatsApp) answer questions and write text; phones recognise faces and translate speech; banks detect fraud; Google Maps predicts traffic; TikTok and YouTube recommend videos; M-Pesa and lenders use models to assess risk. Knowing what AI really is (and isn't) helps you use it well for study and work, judge its answers, protect your privacy, and see the career opportunities it creates.

:::note What you will learn
- What AI, machine learning and deep learning mean
- Types of AI you use daily
- What a large language model (LLM) is and how chatbots generate answers
- Popular AI assistants and tools
- What AI is good at, and its limits: hallucinations, bias, outdated knowledge
- Privacy and safety rules
- How AI is changing jobs in Kenya and how to prepare
:::

## Key terms

| Term | Meaning | Example |
|---|---|---|
| **Artificial intelligence (AI)** | Computer systems doing tasks that normally need human intelligence | Understanding language, recognising images, making predictions |
| **Machine learning (ML)** | AI that **learns patterns from data** instead of following hand-written rules | A spam filter learning from millions of emails |
| **Deep learning** | ML using large **neural networks** with many layers | Face recognition, speech-to-text |
| **Generative AI** | AI that **creates** new content | Text, images, music, video, code |
| **Large language model (LLM)** | A deep learning model trained on huge amounts of text to predict and generate language | The models behind ChatGPT, Claude, Gemini |
| **Model** | The trained system that makes predictions | — |
| **Training data** | The examples a model learns from | Books, websites, code, images |
| **Prompt** | The instruction or question you give a generative AI | "Explain photosynthesis for a Form 2 student" |

## AI you already use

| Area | Example |
|---|---|
| Phones | Face unlock, voice typing, photo enhancement, keyboard suggestions |
| Social media | Feed recommendations, auto-captions, filters |
| Maps and transport | Traffic predictions, route suggestions, ride-hailing pricing |
| Finance | Fraud detection, credit scoring, chatbots for customer care |
| Email | Spam filtering, smart replies |
| Health | Reading scans, triage chatbots (with medical oversight) |
| Agriculture | Crop disease detection from leaf photos, weather predictions |
| Education | Tutoring assistants, automatic transcription and translation |

## How LLM chatbots generate answers

1. **Training**: the model reads a massive amount of text and learns statistical patterns: which words and ideas tend to follow others.
2. **Fine-tuning and safety training**: humans and techniques guide it to follow instructions helpfully and avoid harmful outputs.
3. **Generating**: when you type a prompt, the model predicts the next piece of text (a **token**, roughly a word or part of a word) again and again, building an answer.

```try-python
# A toy illustration of "predict the next word" (real LLMs are vastly more complex)
import random
random.seed(3)
text = "the farmer plants maize the farmer sells maize at the market the market is busy"
words = text.split()
following = {}
for a, b in zip(words, words[1:]):
    following.setdefault(a, []).append(b)

word, sentence = "the", ["the"]
for _ in range(8):
    word = random.choice(following.get(word, words))
    sentence.append(word)
print(" ".join(sentence))
```

Important consequences:
- The model produces **likely-sounding** text, not guaranteed truth.
- It doesn't "look up" facts like a database unless the tool is connected to search or documents.
- Its knowledge has a **cutoff date** unless it can browse the web.
- Wording matters: clearer prompts give better results (next lesson).

Many assistants now can also **search the web**, read files (PDFs, spreadsheets), see images, speak, and run code, which helps with accuracy and new tasks, but you still need to check results.

## Popular AI tools

| Tool | Notes |
|---|---|
| **ChatGPT** (OpenAI) | General assistant; writing, analysis, images |
| **Claude** (Anthropic) | General assistant; strong at long documents, writing and coding |
| **Gemini** (Google) | Integrated with Google services |
| **Microsoft Copilot** | In Windows, Edge and Microsoft 365 |
| **Meta AI** | Inside WhatsApp, Facebook and Instagram |
| **Perplexity** | AI search with sources |
| **Canva Magic Studio, Adobe Firefly** | AI design and images |
| **Otter, Whisper-based tools** | Transcription |
| **GitHub Copilot and coding assistants** | Programming help |

Free versions are enough to learn; paid plans add more capable models and limits. Features change quickly.

## What AI is good at

- Explaining concepts in simple language, with examples.
- Drafting and editing text: emails, CVs, proposals, social posts, reports.
- Summarising long documents and meetings.
- Brainstorming ideas (business names, content plans, lesson ideas).
- Translating and adjusting tone (formal English, simple Kiswahili).
- Writing and explaining code; creating formulas in Excel/Sheets.
- Analysing data you provide; creating tables and outlines.

## Limits and risks

| Limit | What it means | What to do |
|---|---|---|
| **Hallucinations** | Confident but false answers, made-up references, wrong numbers | Verify important facts with reliable sources |
| **Outdated knowledge** | May not know recent laws, prices, events | Check current official sources (e.g. KRA, CBK, eCitizen) |
| **Bias** | Can reflect biases in training data | Review outputs critically, especially about people and groups |
| **Local context gaps** | May be weaker on Kenyan specifics, Sheng, local procedures | Provide context; verify locally |
| **No real understanding of your situation** | Doesn't know your full circumstances | Use for guidance, not final decisions on health, legal, finance |
| **Over-reliance** | Weakens your own skills | Use AI to learn, not to avoid learning |

## Privacy and safety rules

- Don't paste **passwords, PINs, ID numbers, M-Pesa statements, medical records or confidential client/company data** into public AI tools.
- Check your employer's or school's AI policy.
- Turn off chat history/training in settings if you don't want conversations used to improve models (options vary by tool).
- Be careful with AI-generated images and voices: **deepfakes** and voice-cloning scams exist; verify unusual requests by calling people directly.
- Follow academic integrity rules: using AI to write graded work you submit as your own is often cheating (see the study lesson).

## AI and jobs in Kenya

AI changes tasks more than it replaces whole jobs, but people who use AI well will outperform those who don't.

| Opportunity | Examples |
|---|---|
| Productivity in existing jobs | Teachers preparing materials, accountants checking data, marketers drafting content |
| AI training/data work | Annotation and evaluation work (see Make Money Online: AI data work) |
| AI-enabled freelancing | Faster content, design and coding services (with human quality control) |
| Building AI products | Developers integrating AI APIs into apps (see the AI subject) |
| Local solutions | Agriculture, health, fintech, education tools for African contexts and languages |

Skills to build: clear writing and prompting, critical thinking and fact-checking, domain knowledge, digital skills (Excel, design, coding), and ethics.

:::think A student asks a chatbot for "the KRA filing deadline and current turnover tax rate" and gets a confident answer. How should they treat it?
As a starting point only: AI can be outdated or wrong (hallucination). They should confirm on KRA's official website or iTax, or with a tax professional, before relying on it, especially since tax rules change with Finance Acts.
:::

## Summary

- AI does tasks needing human-like intelligence; machine learning learns from data; deep learning uses neural networks; generative AI creates content.
- LLMs predict text token by token from patterns learned in training, so answers sound fluent but aren't guaranteed true.
- Popular assistants include ChatGPT, Claude, Gemini, Copilot and Meta AI; many can search, read files and see images.
- AI is great for explaining, drafting, summarising, brainstorming, translating and coding help; it can hallucinate, be outdated or biased.
- Protect private data, verify important facts, follow integrity rules, and build AI skills for the changing job market.

```quiz
Q: What does LLM stand for?
A: large language model
Q: When an AI confidently gives a false answer, it's called a…
A: hallucination
Q: Should you paste passwords or ID numbers into a public AI chatbot? (yes or no)
A: no
Q: What type of AI learns patterns from data instead of hand-written rules? (two words)
A: machine learning
Q: What is the small unit of text an LLM predicts, roughly a word or part of a word?
A: token | a token
Q: AI-generated fake videos or voices of real people are called what?
A: deepfakes | deepfake
```
