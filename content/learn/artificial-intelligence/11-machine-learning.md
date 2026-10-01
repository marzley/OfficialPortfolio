---
slug: how-machine-learning-works
title: "Level 4: How machine learning works (with code you can run)"
after: ai-automation-no-code
---
# Level 4: How machine learning works (with code you can run)

Now we open the box. In this level you'll see how machines **learn from data**, using short Python programs that run right here. You don't need to be an expert programmer: read the comments, press Run, change numbers and see what happens. (New to Python? Do the first lessons of the **Python** subject first.)

## The machine learning recipe

1. **Collect data**: examples, for instance past house sizes and their rents.
2. **Choose features**: the inputs that matter (size in square metres, distance to town, bedrooms).
3. **Choose a model**: a mathematical shape that can fit the pattern (a straight line, a decision tree, a neural network).
4. **Train**: adjust the model's numbers (its **parameters**) so its predictions match the examples as closely as possible.
5. **Test**: check predictions on examples the model **never saw** during training.
6. **Use it** (inference), and keep monitoring: the world changes.

## Three main types of learning

| Type | Data | Example |
|---|---|---|
| **Supervised learning** | Examples **with answers** (labels) | Predict rent from size; spam or not spam |
| **Unsupervised learning** | Examples **without answers** | Group customers into similar types |
| **Reinforcement learning** | Rewards and penalties from trying actions | Game-playing AI, robots, fine-tuning chatbots |

Supervised learning splits into **regression** (predict a number: rent, price, rainfall) and **classification** (predict a category: spam/OK, disease/healthy).

## Your first model: predicting rent with a straight line

We have rents for apartments of different sizes. We'll **learn** the best line `rent = a × size + b` from the data, using the classic **least squares** method.

```try-python
# size in square metres, rent in KSh per month (training data)
sizes = [30, 45, 50, 60, 75, 90, 110]
rents = [9000, 13000, 15000, 17500, 21000, 26000, 31000]

n = len(sizes)
mean_x = sum(sizes) / n
mean_y = sum(rents) / n

# least squares: the line that makes the squared errors as small as possible
a = sum((x - mean_x) * (y - mean_y) for x, y in zip(sizes, rents)) / sum((x - mean_x) ** 2 for x in sizes)
b = mean_y - a * mean_x
print(f"Learned model: rent = {a:.1f} x size + {b:.0f}")

def predict(size):
    return a * size + b

for s in [40, 80, 120]:
    print(f"{s} m2 -> predicted rent KSh {predict(s):,.0f}")
```

The model **learned** about KSh 275 per extra square metre (plus a base of about KSh 829). Nobody typed that rule; it came from the data.

## Training by gradient descent (how most AI learns)

Least squares has a formula, but neural networks don't. They learn by **gradient descent**: start with random numbers, measure the error, nudge the numbers a little in the direction that reduces the error, and repeat thousands of times. Watch the error fall:

```try-python
sizes = [30, 45, 50, 60, 75, 90, 110]
rents = [9000, 13000, 15000, 17500, 21000, 26000, 31000]

# scale numbers down so learning is stable
xs = [s / 100 for s in sizes]
ys = [r / 10000 for r in rents]

a, b = 0.0, 0.0          # start knowing nothing
lr = 0.5                 # learning rate: how big each nudge is

for step in range(2001):
    # gradients: which way (and how much) each parameter should move
    grad_a = sum(2 * (a * x + b - y) * x for x, y in zip(xs, ys)) / len(xs)
    grad_b = sum(2 * (a * x + b - y) for x, y in zip(xs, ys)) / len(xs)
    a -= lr * grad_a
    b -= lr * grad_b
    if step % 500 == 0:
        error = sum((a * x + b - y) ** 2 for x, y in zip(xs, ys)) / len(xs)
        print(f"step {step:4}: error {error:.5f}")

print(f"Learned: rent = {a * 100:.1f} x size + {b * 10000:.0f}")
```

It arrives at almost the same line as the formula. **This loop (predict, measure error, nudge) is how ChatGPT-sized models are trained too**, just with billions of parameters instead of two.

## Testing: never grade the model on its own homework

If you test on the training data, a model can look perfect by **memorising** instead of learning the pattern. This is called **overfitting**. Always keep some examples aside as a **test set**.

```try-python
data = [(30, 9000), (45, 13000), (50, 15000), (60, 17500), (75, 21000), (90, 26000), (110, 31000), (40, 11500), (65, 19000), (100, 28500)]
train, test = data[:7], data[7:]          # 7 to learn from, 3 held back

xs, ys = [d[0] for d in train], [d[1] for d in train]
mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
a = sum((x - mx) * (y - my) for x, y in train) / sum((x - mx) ** 2 for x in xs)
b = my - a * mx

errors = []
for size, actual in test:
    guess = a * size + b
    errors.append(abs(guess - actual))
    print(f"{size} m2: predicted {guess:,.0f}, actual {actual:,}")
print(f"Average error on unseen data: KSh {sum(errors) / len(errors):,.0f}")
```

The **average error on unseen data** is the honest measure of how good a model is.

## Key ideas to remember

| Idea | Meaning |
|---|---|
| **Parameters** | The numbers a model learns (here `a` and `b`; billions in an LLM) |
| **Loss / error** | How wrong the predictions are |
| **Gradient descent** | Repeatedly nudging parameters to reduce the loss |
| **Learning rate** | The size of each nudge (too big jumps around, too small is slow) |
| **Overfitting** | Memorising the training data instead of learning the pattern |
| **Train / test split** | Learn on some data, judge on the rest |
| **Garbage in, garbage out** | Bad or biased data makes bad or biased models |

```quiz
Q: Learning from examples that include the correct answers is called ... learning?
A: supervised
Q: Predicting a number (like rent) is regression or classification?
A: regression
Q: Predicting a category (like spam or not) is regression or classification?
A: classification
Q: What is it called when a model memorises training data instead of learning the pattern?
A: overfitting
Q: What method nudges parameters step by step to reduce the error?
A: gradient descent
Q: Suppose a model learned rent = 276 x size + 700. What rent does it predict for 50 m2? Give the number.
A: 14500 | 14,500 | KSh 14,500
```
=== exercise ===
Suppose a model learned `rent = 276 * size + 700`. Use it to predict the rent of an **85 m2** apartment and print it as a whole number.
=== starter ===
a = 276
b = 700
size = 85
# calculate and print the predicted rent
=== expected ===
24160
=== must_contain ===
print
