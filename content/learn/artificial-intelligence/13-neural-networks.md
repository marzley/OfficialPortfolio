---
slug: neural-networks-explained
title: "Level 4: Neural networks explained (and one you can train)"
after: build-a-classifier
---
# Level 4: Neural networks explained (and one you can train)

**Neural networks** power modern AI: speech recognition, image recognition, translation and chatbots. They're loosely inspired by brain cells, but at heart they're just **lots of simple maths units connected together**, trained with the gradient descent you saw earlier.

## One artificial neuron

A neuron takes inputs, multiplies each by a **weight** (how important it is), adds a **bias**, and passes the total through an **activation function** that decides how strongly it "fires".

```
inputs      weights
 x1 ──── w1 ──┐
 x2 ──── w2 ──┼──► sum = w1·x1 + w2·x2 + bias ──► activation ──► output
 x3 ──── w3 ──┘
```

A common activation is the **sigmoid**, which squashes any number into 0 to 1 (like a probability).

## Train a neuron to learn a rule

Let's teach one neuron the rule **"approve a delivery request only if the customer has paid AND the address is confirmed"** (logical AND), purely from examples.

```try-python
import math
import random

random.seed(1)

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

# (paid, address_confirmed) -> approve?
examples = [((0, 0), 0), ((0, 1), 0), ((1, 0), 0), ((1, 1), 1)]

w1, w2, bias = random.uniform(-1, 1), random.uniform(-1, 1), 0.0
lr = 1.0

for epoch in range(3001):
    total_error = 0
    for (x1, x2), target in examples:
        out = sigmoid(w1 * x1 + w2 * x2 + bias)          # forward: make a prediction
        error = out - target
        total_error += error ** 2
        grad = error * out * (1 - out)                   # backward: how to change the weights
        w1 -= lr * grad * x1
        w2 -= lr * grad * x2
        bias -= lr * grad
    if epoch % 1000 == 0:
        print(f"epoch {epoch}: error {total_error:.4f}")

print(f"weights {w1:.2f}, {w2:.2f}, bias {bias:.2f}")
for (x1, x2), target in examples:
    print((x1, x2), "->", round(sigmoid(w1 * x1 + w2 * x2 + bias), 3), "expected", target)
```

The neuron starts with random weights and **learns** the AND rule: outputs near 1 only when both inputs are 1.

## Why we need layers: the XOR problem

One neuron can only draw a **straight line** between categories. Some patterns need more. **XOR** ("exactly one of the two") can't be separated by one straight line. Add a **hidden layer** of neurons, and the network can learn it:

```try-python
import math
import random

random.seed(3)
sig = lambda z: 1 / (1 + math.exp(-z))

data = [((0, 0), 0), ((0, 1), 1), ((1, 0), 1), ((1, 1), 0)]   # XOR
H = 3                                                          # hidden neurons

w_in = [[random.uniform(-1, 1) for _ in range(2)] for _ in range(H)]
b_in = [0.0] * H
w_out = [random.uniform(-1, 1) for _ in range(H)]
b_out = 0.0
lr = 0.8

for epoch in range(10001):
    for (x1, x2), target in data:
        # forward pass
        hidden = [sig(w_in[j][0] * x1 + w_in[j][1] * x2 + b_in[j]) for j in range(H)]
        out = sig(sum(w_out[j] * hidden[j] for j in range(H)) + b_out)
        # backward pass (backpropagation)
        d_out = (out - target) * out * (1 - out)
        for j in range(H):
            d_hidden = d_out * w_out[j] * hidden[j] * (1 - hidden[j])
            w_out[j] -= lr * d_out * hidden[j]
            w_in[j][0] -= lr * d_hidden * x1
            w_in[j][1] -= lr * d_hidden * x2
            b_in[j] -= lr * d_hidden
        b_out -= lr * d_out

for (x1, x2), target in data:
    hidden = [sig(w_in[j][0] * x1 + w_in[j][1] * x2 + b_in[j]) for j in range(H)]
    out = sig(sum(w_out[j] * hidden[j] for j in range(H)) + b_out)
    print((x1, x2), "->", round(out, 3), "expected", target)
```

This is a real (tiny) **multi-layer neural network**, trained with **backpropagation**: errors flow backwards from the output, telling every weight how to change.

## From tiny to huge

| | Our XOR network | A large language model |
|---|---|---|
| Parameters (weights) | 13 | Billions to trillions |
| Training examples | 4 | Trillions of words |
| Training time | Under a second | Months on thousands of specialised chips (GPUs) |
| Same core idea? | Forward pass, measure error, backpropagation, gradient descent | Yes |

## Types of neural networks

| Network | Good for | Example |
|---|---|---|
| **Feed-forward (MLP)** | Tables of numbers | Credit scoring |
| **Convolutional (CNN)** | Images | Detecting crop diseases from leaf photos, reading number plates |
| **Recurrent (RNN, LSTM)** | Sequences (older approach) | Early speech recognition |
| **Transformer** | Language, and now images, audio and video | ChatGPT, Claude, Gemini, translation |

The **transformer** (introduced in 2017) is the architecture behind today's language models. Its key idea, **attention**, lets the model look at every word in the text and decide which words matter most for understanding each other word. That's the subject of the next lesson.

## Tools professionals use

**PyTorch** and **TensorFlow/Keras** build and train neural networks, usually on GPUs (free GPU time is available in Google Colab and Kaggle notebooks). **Hugging Face** hosts thousands of ready-made models you can download and fine-tune.

```quiz
Q: What does each input of a neuron get multiplied by?
A: a weight | weight | weights
Q: Which activation function squashes numbers into the range 0 to 1?
A: sigmoid
Q: Which simple pattern can't be learned by a single neuron, needing a hidden layer?
A: XOR
Q: What is the algorithm called that sends errors backwards to update every weight?
A: backpropagation
Q: Which neural network type is best known for images?
A: CNN | convolutional | convolutional neural network
Q: Which architecture is behind ChatGPT and Claude?
A: transformer | the transformer
```
