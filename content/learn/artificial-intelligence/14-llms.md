---
slug: how-llms-work
title: "Level 4: How ChatGPT-style models work: tokens, training and embeddings"
after: neural-networks-explained
---
# Level 4: How ChatGPT-style models work: tokens, training and embeddings

**Large language models (LLMs)** like the ones behind ChatGPT, Claude and Gemini can seem magical. Underneath, they do one thing remarkably well: **predict the next piece of text**. Here's how that becomes a helpful assistant.

## Step 1: text becomes tokens

Models don't read letters or whole words. They read **tokens**: common chunks of text. "Habari" might be one or two tokens; a long rare word may be several. Roughly, **1 token ≈ ¾ of an English word**; other languages (including Kiswahili) often use more tokens per word because they appear less in training data.

```try-python
# A toy tokenizer: real ones learn their chunks from huge amounts of text
vocab = ["ha", "bari", "ya", "asub", "uhi", " ", "habari", "?"]

def tokenize(text):
    tokens, i = [], 0
    while i < len(text):
        # take the longest vocabulary piece that matches here
        match = max((v for v in vocab if text.startswith(v, i)), key=len, default=text[i])
        tokens.append(match)
        i += len(match)
    return tokens

print(tokenize("habari ya asubuhi?"))
```

Tokens matter because **models have a limit of tokens they can read at once** (the **context window**) and **AI APIs charge per token**.

## Step 2: predict the next token

Given some text, the model outputs a probability for every possible next token. Then it picks one, adds it to the text, and repeats. That's all generation is: **next-token prediction, one token at a time.**

This toy model learns which word tends to follow which (a "bigram" model) from a few sentences, then generates text:

```try-python
import random
from collections import defaultdict

random.seed(7)
corpus = (
    "the matatu leaves town at six . the matatu is full . "
    "the boda leaves town at seven . the shop opens at six . "
    "the shop is full of customers . customers pay with m-pesa ."
).split()

nxt = defaultdict(list)
for a, b in zip(corpus, corpus[1:]):
    nxt[a].append(b)

def generate(start, length=10):
    words = [start]
    for _ in range(length):
        options = nxt.get(words[-1])
        if not options:
            break
        words.append(random.choice(options))   # choose by how often each followed
    return " ".join(words)

for _ in range(3):
    print(generate("the"))
```

A real LLM is this idea scaled up enormously: instead of looking at **one** previous word, a transformer looks at **thousands** of previous tokens using **attention**, and instead of a small table it has billions of learned parameters.

## Step 3: training in stages

| Stage | What happens | Result |
|---|---|---|
| **Pre-training** | The model reads a huge amount of text and learns to predict the next token | Knows language and many facts, but isn't yet a helpful assistant |
| **Fine-tuning (instruction tuning)** | Trained on example conversations of good questions and answers | Follows instructions and chats |
| **Reinforcement learning from feedback** | People (and AI systems guided by principles) rate answers; the model is rewarded for helpful, honest, harmless answers | Safer, more helpful behaviour |

This is why AI training work exists: people write and rate the examples used in fine-tuning.

## Temperature: creativity vs consistency

When choosing the next token, a setting called **temperature** controls randomness: low temperature picks the most likely tokens (consistent, factual style); high temperature picks less likely ones more often (creative, varied, more mistakes).

```try-python
import math

next_word_scores = {"Nairobi": 4.0, "Mombasa": 2.5, "Kisumu": 2.0, "Mars": 0.5}

def probabilities(scores, temperature):
    exps = {w: math.exp(s / temperature) for w, s in scores.items()}
    total = sum(exps.values())
    return {w: round(e / total, 3) for w, e in exps.items()}

for t in [0.3, 1.0, 2.0]:
    print(f"temperature {t}: {probabilities(next_word_scores, t)}")
```

At low temperature "Nairobi" gets almost all the probability; at high temperature even "Mars" gets a chance.

## Embeddings: meaning as numbers

Models represent words and texts as lists of numbers called **embeddings**, arranged so that **similar meanings are close together**. This powers semantic search ("find documents about school fees" even if they say "tuition"), recommendations and the retrieval systems in the next level.

```try-python
import math

# Tiny made-up embeddings (real ones have hundreds or thousands of numbers)
emb = {
    "teacher":  [0.9, 0.1, 0.0],
    "tutor":    [0.85, 0.15, 0.05],
    "school":   [0.7, 0.3, 0.1],
    "maize":    [0.0, 0.2, 0.9],
    "farm":     [0.1, 0.3, 0.85],
}

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))

query = "teacher"
for word, vec in sorted(emb.items(), key=lambda kv: -cosine(emb[query], kv[1])):
    print(f"{word:<8} similarity to '{query}': {cosine(emb[query], vec):.2f}")
```

## Why LLMs hallucinate (now you know)

The model generates **likely** tokens. When the true answer wasn't well represented in training, or the question is about something recent, the most likely-sounding continuation can be **wrong**. That's why grounding answers in real documents (next level) and checking facts matter.

## Key terms

| Term | Meaning |
|---|---|
| **Token** | A chunk of text the model reads and writes |
| **Context window** | How many tokens the model can consider at once |
| **Parameters** | The learned numbers inside the model |
| **Pre-training** | Learning to predict text from a huge dataset |
| **Fine-tuning** | Further training for a specific behaviour or task |
| **Temperature** | Randomness when choosing tokens |
| **Embedding** | Numbers representing meaning; similar meanings are close |
| **Attention** | The transformer mechanism for weighing which tokens matter to each other |

```quiz
Q: What chunks of text do language models read and write?
A: tokens
Q: What is the maximum amount of text a model can consider at once called?
A: context window | the context window
Q: At its core, an LLM generates text by predicting the next ...?
A: token | word | next token
Q: Which setting controls randomness: low for consistent, high for creative?
A: temperature
Q: Lists of numbers that represent meaning are called?
A: embeddings | embedding
Q: Which mechanism lets transformers weigh which tokens matter to each other?
A: attention
```
