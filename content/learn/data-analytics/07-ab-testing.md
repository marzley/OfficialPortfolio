---
slug: ab-testing-hypothesis
title: "A/B tests and hypothesis testing: proving what works (with p-values explained simply)"
after: correlation-regression
---
# A/B tests and hypothesis testing: proving what works (with p-values explained simply)

Did the new SMS message really bring more customers back, or was it luck? **A/B testing** answers questions like this. You split people randomly into two groups, show each group a different version, and compare the results.

## How an A/B test works

1. **Question:** "Does a discount SMS bring more repeat orders than a reminder SMS?"
2. **Randomly split** customers into group A (reminder) and group B (discount).
3. **Run the test** for a fixed period.
4. **Measure** the result (the share who ordered again).
5. **Check whether the difference is bigger than chance** would explain.

Random splitting is the key: it makes the groups alike in every other way, so a difference in results can be credited to the change you made.

## Hypotheses

- **Null hypothesis (H0):** there's no real difference; any gap is just chance.
- **Alternative hypothesis (H1):** there is a real difference.

We look for strong enough evidence to reject H0.

## The p-value in plain words

The **p-value** answers: "If there were really no difference, how often would we see a gap at least this big just by chance?"

- A **small p-value** (commonly below 0.05) means such a gap would rarely happen by luck, so we treat the difference as real ("statistically significant").
- A **large p-value** means luck could easily explain it.

A p-value is **not** "the probability that B is better". It's about how surprising the data would be if nothing had changed.

## Test it by simulation (no formulas needed)

Results: Group A (reminder): 48 of 400 ordered again. Group B (discount): 72 of 400 ordered again.

We can ask the computer: if both messages were truly the same, how often would random shuffling produce a gap this big?

```try-python
import random
random.seed(42)

a_orders, a_total = 48, 400
b_orders, b_total = 72, 400
observed_gap = b_orders / b_total - a_orders / a_total
print(f"A: {a_orders / a_total:.1%}  B: {b_orders / b_total:.1%}  gap: {observed_gap:.1%}")

# Pretend there is no difference: pool everyone, shuffle, split again many times
pool = [1] * (a_orders + b_orders) + [0] * (a_total + b_total - a_orders - b_orders)
extreme = 0
trials = 5000
for _ in range(trials):
    random.shuffle(pool)
    fake_a = sum(pool[:a_total]) / a_total
    fake_b = sum(pool[a_total:]) / b_total
    if abs(fake_b - fake_a) >= observed_gap:
        extreme += 1

p_value = extreme / trials
print("p-value ≈", round(p_value, 3))
print("Significant at 0.05?", "yes" if p_value < 0.05 else "no")
```

This is called a **permutation test**. Change the numbers (try 55 instead of 72) and see how the p-value grows when the gap shrinks.

## Practical significance vs statistical significance

With a huge sample, even a tiny difference (0.1%) can be "significant" but not worth the cost. Always ask: **is the difference big enough to matter for the business?**

## Common A/B testing mistakes

| Mistake | Why it's a problem |
|---|---|
| Stopping the test as soon as B looks good | Early results swing a lot; decide the length in advance |
| Testing many changes at once | You won't know which change caused the result |
| Groups not random (e.g. A = Nairobi, B = Mombasa) | Other differences may cause the gap |
| Too few people | Real differences can be missed |
| Testing 20 things and reporting the one "winner" | By chance, about 1 in 20 tests looks significant at 0.05 |

:::kenya Where A/B tests are used
Kenyan fintechs test loan reminder messages, e-commerce sites test checkout pages, NGOs test which SMS wording gets more people to clinics, and marketers test ad images. Ethical rule: never test something that could harm people, and follow data protection rules.
:::

:::think An online shop shows the new checkout page to customers on Monday and the old one on Tuesday, then compares sales. Why is this a poor test, and how should it be done?
Days differ (paydays, weather, promotions), so day-to-day differences could cause the gap. Instead, randomly show each visitor either page at the same time, for a fixed period decided in advance, then compare conversion rates with a significance check.
:::

## Summary

- A/B tests randomly split people to compare two versions fairly.
- H0 says no difference; a small p-value (below 0.05) suggests a real difference.
- A permutation test simulates "no difference" to estimate the p-value.
- Check practical significance, fix the test length in advance and avoid common mistakes.

```quiz
Q: Which hypothesis says there's no real difference? (one word: the ___ hypothesis)
A: null
Q: What p-value threshold is commonly used for significance? (a number)
A: 0.05 | .05 | 5%
Q: Should you stop a test as soon as B looks better? (yes or no)
A: no
```
