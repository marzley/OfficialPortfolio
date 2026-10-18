---
slug: sampling-probability
title: "Sampling and probability: surveys, bias, margin of error and why size matters"
after: distributions-outliers
---
# Sampling and probability: surveys, bias, margin of error and why size matters

You rarely have data on everyone. Pollsters ask about 2,000 people to estimate how millions will vote; a county surveys a few hundred households. Learning how sampling works helps you trust good surveys and spot bad ones.

## Population and sample

- **Population:** everyone or everything you want to know about (all customers, all voters, all farms in a county).
- **Sample:** the smaller group you actually measure.
- A **statistic** describes the sample; we use it to estimate the population.

## Good and bad samples

| Method | How | Risk |
|---|---|---|
| **Simple random sample** | Everyone has an equal chance of being picked | Best basic method |
| **Stratified sample** | Split into groups (counties, age groups) and sample from each | Ensures every group is represented |
| **Systematic sample** | Pick every 10th customer | Fine unless there's a hidden pattern |
| **Convenience sample** | Whoever is easy to reach | Often biased |
| **Self-selected (voluntary)** | People choose to answer (online polls) | Very biased: people with strong opinions answer |

## Types of bias

| Bias | Example |
|---|---|
| **Selection bias** | Surveying only Nairobi shoppers about national habits |
| **Non-response bias** | Busy people don't answer, so results over-represent people with free time |
| **Leading questions** | "Don't you agree our excellent service is great?" |
| **Survivorship bias** | Studying only successful businesses and ignoring the ones that closed |

## Probability basics

**Probability** is how likely something is, from 0 (impossible) to 1 (certain). Probability of an event = favourable outcomes ÷ all possible outcomes. A fair coin landing heads: 1 ÷ 2 = 0.5.

The **law of large numbers:** the more times you repeat a random experiment, the closer the results get to the true probability. Watch it happen:

```try-python
import random
random.seed(7)

for flips in [10, 100, 1000, 10000]:
    heads = sum(random.random() < 0.5 for _ in range(flips))
    print(f"{flips:>6} flips: {heads / flips:.3f} heads")
```

With 10 flips the share of heads can be far from 0.5; with 10,000 it's very close.

## Why sample size matters

Imagine 40% of a county's farmers use certified seed. Let's draw random samples of different sizes and see how close the estimates get:

```try-python
import random
random.seed(1)

population = [1] * 40000 + [0] * 60000   # 1 = uses certified seed (40%)

for n in [20, 100, 500, 2000]:
    estimates = []
    for _ in range(200):
        sample = random.sample(population, n)
        estimates.append(sum(sample) / n)
    print(f"sample of {n:>4}: estimates ranged from {min(estimates):.0%} to {max(estimates):.0%}")
```

Small samples bounce around a lot; bigger samples cluster near the true 40%.

## Margin of error (the rough rule)

Surveys report results like "52% ± 3%". For a simple random sample, a quick approximation of the 95% margin of error for a percentage is:

**margin of error ≈ 1 ÷ √(sample size)**

```try-python
for n in [100, 400, 1000, 2000, 4000]:
    moe = 1 / n ** 0.5
    print(f"sample of {n:>4}: about ±{moe:.1%}")
```

Notice that to halve the margin of error you need **four times** the sample. That's why national polls rarely survey more than a few thousand people.

:::warning A big biased sample is still wrong
100,000 answers to a self-selected online poll can be less accurate than 1,000 well-chosen random interviews. How you choose the sample matters more than how big it is.
:::

:::think A radio station runs a text-in poll: "Should fuel prices be reduced?" 95% vote yes. Does this tell you what Kenyans think?
No. It's self-selected (only listeners who chose to text), and the question is leading (almost everyone wants cheaper fuel). It says little about public opinion on real policy choices. A random sample with a neutral question would be needed.
:::

## Summary

- A sample estimates a population; random sampling is the foundation.
- Watch for selection, non-response, leading-question and survivorship bias.
- Bigger random samples give estimates closer to the truth (law of large numbers).
- Margin of error ≈ 1 ÷ √n for percentages; quadruple the sample to halve it.

```quiz
Q: A sample where everyone has an equal chance of being chosen is called a simple ___ sample (one word)
A: random
Q: Probability ranges from 0 to what number?
A: 1 | one
Q: About how many times bigger must a sample be to halve the margin of error? (a number)
A: 4 | four
```
