---
slug: correlation-regression
title: "Correlation and regression: finding relationships (and why correlation isn't causation)"
after: sampling-probability
---
# Correlation and regression: finding relationships (and why correlation isn't causation)

Does more advertising bring more sales? Do farms with more rainfall harvest more maize? **Correlation** measures how strongly two numbers move together, and **regression** draws the best straight line through them so you can estimate one from the other.

## Correlation: the coefficient r

The correlation coefficient **r** runs from −1 to +1:

| r | Meaning | Example |
|---|---|---|
| close to +1 | Strong positive: both rise together | Hours studied and exam score |
| close to 0 | No straight-line relationship | Shoe size and exam score |
| close to −1 | Strong negative: one rises as the other falls | Price of a product and units sold |

A rough guide: above 0.7 (or below −0.7) is strong; 0.3 to 0.7 is moderate; below 0.3 is weak.

```try-python
import statistics as st

ad_spend = [5, 8, 10, 12, 15, 18, 20, 25]          # KSh thousands per week
sales =    [58, 76, 74, 90, 95, 113, 112, 141]    # KSh thousands per week

r = st.correlation(ad_spend, sales)
print("Correlation r =", round(r, 3))
```

A value near +1 means weeks with more advertising had more sales.

## Correlation is not causation

Two things can move together without one causing the other:

| Correlation | The hidden explanation |
|---|---|
| Ice cream sales and drownings rise together | Hot weather causes both (a **confounding variable**) |
| Towns with more churches have more crime | Bigger towns have more of both |
| Students with tutors score lower | Weaker students are more likely to get tutors (reverse causation) |

To show causation you usually need an **experiment** (like an A/B test, next lesson) or very careful analysis that controls for other factors.

## Simple linear regression: the line of best fit

Regression finds the straight line **y = a + b × x** that best fits the points:
- **b (slope):** how much y changes when x goes up by 1
- **a (intercept):** the value of y when x is 0

```try-python
import statistics as st

ad_spend = [5, 8, 10, 12, 15, 18, 20, 25]
sales =    [58, 76, 74, 90, 95, 113, 112, 141]

slope, intercept = st.linear_regression(ad_spend, sales)
print(f"sales ≈ {intercept:.1f} + {slope:.2f} × ad_spend")

for spend in [10, 22, 30]:   # careful: 30k is outside the data (5k to 25k)
    print(f"If we spend {spend}k on ads, expected sales ≈ {intercept + slope * spend:.0f}k")
```

The slope says roughly how many thousand shillings of extra sales came with each extra thousand spent on ads, **in this data**.

## R-squared: how well does the line fit?

**R²** (r squared) is the share of the variation in y explained by x, from 0 to 1.

```try-python
import statistics as st

ad_spend = [5, 8, 10, 12, 15, 18, 20, 25]
sales =    [58, 76, 74, 90, 95, 113, 112, 141]
r = st.correlation(ad_spend, sales)
print(f"R² = {r * r:.2f}  ->  about {r * r:.0%} of the variation in sales moves with ad spend")
```

## Be careful with predictions

- **Don't extrapolate far:** the data covers ad spend from 5k to 25k. Predicting sales at 200k is guesswork; returns usually shrink.
- **Look at the scatter plot first:** some relationships are curved, and a straight line misleads.
- **Outliers can drag the line:** check them (lesson 4).
- **Other factors matter:** holidays, prices and competitors also affect sales.

:::tip In Excel
`=CORREL(A2:A9, B2:B9)` gives r. `=SLOPE(B2:B9, A2:A9)` and `=INTERCEPT(B2:B9, A2:A9)` give the line. Insert a scatter chart and add a trendline with "Display R-squared value".
:::

:::think A study finds that Kenyan households with smartphones have higher incomes. A phone company says: "Buy a smartphone and earn more!" What's wrong with that claim?
It confuses correlation with causation. Higher income lets people buy smartphones (reverse causation), and other factors (education, living in towns, type of job) affect both. Smartphones may help some people earn, but this correlation alone doesn't prove it.
:::

## Summary

- Correlation r (−1 to +1) measures how strongly two numbers move together in a straight line.
- Correlation is not causation: watch for confounders and reverse causation.
- Regression gives a line y = a + b × x; the slope shows the change in y per unit of x.
- R² shows how much variation the line explains; don't extrapolate far beyond your data.

```quiz
Q: What is the highest possible value of the correlation coefficient r? (a number)
A: 1 | +1 | one
Q: A hidden factor that causes two things to move together is called a ___ variable (one word)
A: confounding | confounder
Q: Which Excel function gives the correlation coefficient? (one word)
A: correl
```
