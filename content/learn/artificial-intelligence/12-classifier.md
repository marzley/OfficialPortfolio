---
slug: build-a-classifier
title: "Level 4: Build a classifier: nearest neighbours and a spam filter"
after: how-machine-learning-works
---
# Level 4: Build a classifier: nearest neighbours and a spam filter

**Classification** means putting things into categories: spam or not, healthy or diseased leaf, loan likely repaid or not. You'll build two real classifiers from scratch in pure Python.

## Classifier 1: k-nearest neighbours (k-NN)

The idea is beautifully simple: **to classify something new, look at the most similar examples you've seen, and go with the majority.**

Example: a SACCO wants to predict whether a loan applicant will repay on time, using two features: **monthly income** (thousands of KSh) and **number of loans already running**.

```try-python
import math

# (income in thousands, active loans) -> repaid on time?
history = [
    ((45, 0), "repaid"), ((60, 1), "repaid"), ((38, 1), "repaid"), ((80, 2), "repaid"),
    ((25, 3), "late"), ((30, 2), "late"), ((18, 1), "late"), ((22, 4), "late"),
    ((55, 3), "repaid"), ((28, 0), "repaid"), ((20, 2), "late"), ((70, 0), "repaid"),
]

def distance(p, q):
    # straight-line distance; loans count more, so we scale them up
    return math.sqrt((p[0] - q[0]) ** 2 + ((p[1] - q[1]) * 10) ** 2)

def knn(new, k=3):
    nearest = sorted(history, key=lambda item: distance(new, item[0]))[:k]
    votes = {}
    for _, label in nearest:
        votes[label] = votes.get(label, 0) + 1
    return max(votes, key=votes.get), nearest

for applicant in [(50, 1), (24, 3), (35, 2)]:
    label, nearest = knn(applicant)
    print(f"Applicant {applicant}: predicted {label}  (neighbours: {[n[1] for n in nearest]})")
```

Things to notice:

- **Features need scaling**: income is in tens, loans are 0 to 4, so we multiplied loans by 10. Without scaling, one feature can drown the other.
- **k matters**: k=1 follows single odd examples (overfitting); a large k ignores local detail.
- **Fairness matters**: real lending models must avoid unfair features (like tribe, gender or religion) and are regulated. A model learns whatever bias is in its data.

## Classifier 2: a Naive Bayes spam filter

This is the method behind early email spam filters, and still a great baseline. It learns **how often each word appears in spam vs normal messages**, then combines the evidence.

```try-python
import math
from collections import Counter

training = [
    ("Congratulations you have won KSh 100000 send fee to claim", "spam"),
    ("Your account will be blocked click this link now", "spam"),
    ("Win free airtime today reply YES now", "spam"),
    ("Send 500 to receive your prize money", "spam"),
    ("Hi, are we still meeting at 4pm", "ham"),
    ("Please send the report before Friday", "ham"),
    ("Mum says dinner is at 7", "ham"),
    ("Your order has been delivered thank you", "ham"),
]

def words(text):
    return [w.strip(".,!?").lower() for w in text.split()]

counts = {"spam": Counter(), "ham": Counter()}
docs = Counter()
for text, label in training:
    counts[label].update(words(text))
    docs[label] += 1
vocab = set(counts["spam"]) | set(counts["ham"])

def score(text, label):
    total = sum(counts[label].values())
    s = math.log(docs[label] / sum(docs.values()))          # how common the class is
    for w in words(text):
        s += math.log((counts[label][w] + 1) / (total + len(vocab)))   # +1 so unseen words aren't zero
    return s

def classify(text):
    return max(["spam", "ham"], key=lambda label: score(text, label))

tests = ["Click now to claim your free prize", "Can you send the invoice today", "You have won airtime send fee"]
for t in tests:
    print(f"{classify(t):>4}  <- {t}")
```

How it works:

- It estimates the probability of each word in spam and in normal ("ham") messages.
- For a new message, it multiplies the word probabilities (adding logs is the same, but avoids tiny numbers).
- `+1` (**Laplace smoothing**) stops a single unseen word from making a probability zero.

## Measuring a classifier properly

**Accuracy** (percentage correct) can mislead. If only 2% of transactions are fraud, a model that always says "OK" is 98% accurate and completely useless. Professionals also measure:

| Measure | Question it answers |
|---|---|
| **Precision** | Of the messages we flagged as spam, how many really were spam? |
| **Recall** | Of all the real spam, how much did we catch? |
| **Confusion matrix** | A table of correct and wrong predictions for each class |

```try-python
actual    = ["spam", "spam", "ham", "ham", "spam", "ham", "ham", "spam"]
predicted = ["spam", "ham",  "ham", "spam", "spam", "ham", "ham", "spam"]

tp = sum(a == p == "spam" for a, p in zip(actual, predicted))
fp = sum(a == "ham" and p == "spam" for a, p in zip(actual, predicted))
fn = sum(a == "spam" and p == "ham" for a, p in zip(actual, predicted))
tn = sum(a == p == "ham" for a, p in zip(actual, predicted))

print(f"Accuracy:  {(tp + tn) / len(actual):.0%}")
print(f"Precision: {tp / (tp + fp):.0%}")
print(f"Recall:    {tp / (tp + fn):.0%}")
print(f"Confusion: TP={tp} FP={fp} FN={fn} TN={tn}")
```

## In real projects

Professionals use libraries instead of writing these by hand: **scikit-learn** (k-NN, Naive Bayes, decision trees, random forests), **pandas** for data, and **Jupyter** or **Google Colab** notebooks (free, in the browser) to experiment. Writing them once yourself means you'll understand what those libraries do.

```quiz
Q: k-NN classifies something new by looking at its most similar ...?
A: neighbours | neighbors | examples
Q: Which value of k makes k-NN follow single odd examples (overfitting)?
A: 1 | k=1 | one
Q: In Naive Bayes, adding 1 to every word count is called Laplace ...?
A: smoothing
Q: Of everything we flagged as spam, the share that really was spam is called?
A: precision
Q: Of all real spam, the share we caught is called?
A: recall
Q: Which free browser tool runs Python notebooks for machine learning?
A: Google Colab | Colab
```
