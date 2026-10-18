---
slug: distributions-outliers
title: "Distributions, percentiles and outliers: seeing the shape of your data"
after: descriptive-statistics
---
# Distributions, percentiles and outliers: seeing the shape of your data

Averages hide a lot. To really understand data, look at its **distribution**: how values are spread out, where most of them sit, and which ones are unusual.

## Percentiles and quartiles

A **percentile** tells you the value below which a certain percentage of data falls. If your exam score is at the 90th percentile, you scored higher than 90% of candidates.

**Quartiles** split sorted data into four equal parts:

| Name | Percentile | Meaning |
|---|---|---|
| Q1 (first quartile) | 25th | A quarter of values are below it |
| Q2 (median) | 50th | Half are below it |
| Q3 (third quartile) | 75th | Three quarters are below it |

The **interquartile range (IQR)** is Q3 minus Q1: the spread of the middle half of the data. Extreme values don't affect it, which makes it very useful.

```try-python
import statistics as st

delivery_minutes = [18, 22, 25, 25, 27, 29, 30, 31, 33, 35, 36, 38, 40, 44, 95]

q1, q2, q3 = st.quantiles(delivery_minutes, n=4)
iqr = q3 - q1
print("Q1:", q1, " median:", q2, " Q3:", q3)
print("IQR:", iqr)
```

## Finding outliers with the IQR rule

An **outlier** is a value far from the rest. A common rule: a value is an outlier if it's more than **1.5 × IQR** below Q1 or above Q3.

```try-python
import statistics as st

delivery_minutes = [18, 22, 25, 25, 27, 29, 30, 31, 33, 35, 36, 38, 40, 44, 95]
q1, _, q3 = st.quantiles(delivery_minutes, n=4)
iqr = q3 - q1
low, high = q1 - 1.5 * iqr, q3 + 1.5 * iqr

outliers = [m for m in delivery_minutes if m < low or m > high]
print("Normal range:", round(low, 1), "to", round(high, 1), "minutes")
print("Outliers:", outliers)
```

The 95-minute delivery stands out. Now the analyst's job begins: **why?** A typing error? A breakdown? A far-away customer? Never delete an outlier without finding out what it is.

| Outlier cause | What to do |
|---|---|
| Data entry error (950 instead of 95) | Fix it if you can confirm the right value |
| A real but rare event (a breakdown) | Keep it; report it separately |
| A different group (wholesale order among retail) | Analyse that group separately |

## Shapes of distributions

| Shape | Description | Example |
|---|---|---|
| **Symmetric / normal** | Bell-shaped; mean ≈ median | Heights of adults, many measurement errors |
| **Right-skewed** | Long tail of high values; mean > median | Incomes, house prices, M-Pesa transaction sizes |
| **Left-skewed** | Long tail of low values; mean < median | Scores on a very easy test |
| **Bimodal** | Two peaks | Restaurant orders at lunch and dinner |

A quick check: if the mean is much bigger than the median, the data is probably right-skewed.

## A text histogram (run it)

A **histogram** groups values into ranges ("bins") and shows how many fall in each. Here is one drawn with characters:

```try-python
ages = [19, 22, 23, 24, 25, 25, 26, 27, 28, 29, 31, 33, 34, 36, 38, 41, 45, 52, 58, 63]

for start in range(10, 70, 10):
    count = sum(1 for a in ages if start <= a < start + 10)
    print(f"{start}-{start + 9}: " + "#" * count + f" ({count})")
```

Most customers are in their twenties, with fewer older customers: a right-skewed shape.

:::tip In Excel
Use `=QUARTILE.INC(range, 1)` and `=QUARTILE.INC(range, 3)` for Q1 and Q3, `=PERCENTILE.INC(range, 0.9)` for the 90th percentile, and Insert > Chart > Histogram or Box and Whisker to see the shape.
:::

:::think A boda boda company finds that 3 out of 2,000 trips took over 4 hours. Should it delete them before calculating the average trip time?
Not automatically. First check why: GPS errors, a rider forgetting to end the trip, or real long hires. Fix or exclude clear errors and explain that in the report; keep genuine long trips, and consider reporting the median (which outliers barely affect) alongside the mean.
:::

## Summary

- Percentiles and quartiles show where values sit; the IQR is the spread of the middle half.
- The 1.5 × IQR rule flags outliers; investigate them before deciding what to do.
- Distributions can be symmetric, skewed or bimodal; mean much bigger than median suggests right skew.
- Histograms and box plots show the shape.

```quiz
Q: What is the median also called in quartile terms? (two characters)
A: q2
Q: IQR stands for interquartile ___ (one word)
A: range
Q: Incomes usually have which kind of skew? (one word: left or right)
A: right
```
