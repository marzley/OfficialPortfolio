---
slug: descriptive-statistics
title: "Averages and spread: mean, median, mode, range and standard deviation"
after: types-of-data-sources
---
# Averages and spread: mean, median, mode, range and standard deviation

Descriptive statistics summarise a pile of numbers in a few figures. They answer two questions: **What is typical?** (the centre) and **How much do values vary?** (the spread). You'll use them in almost every report.

## Measures of the centre

| Measure | How to find it | Best when |
|---|---|---|
| **Mean** (average) | Add all values, divide by how many | Values are fairly even, no extreme outliers |
| **Median** | The middle value when sorted | There are extreme values (salaries, house prices) |
| **Mode** | The most common value | Categories or repeated values (most common shoe size) |

### Why the median matters: a salary example

Ten workers earn (KSh per month): 18,000, 20,000, 21,000, 22,000, 22,000, 24,000, 25,000, 26,000, 28,000 and the owner's 400,000.

```try-python
import statistics as st

salaries = [18000, 20000, 21000, 22000, 22000, 24000, 25000, 26000, 28000, 400000]

print("Mean:  ", round(st.mean(salaries)))
print("Median:", st.median(salaries))
print("Mode:  ", st.mode(salaries))

without_owner = salaries[:-1]
print("Mean without the owner:", round(st.mean(without_owner)))
```

The mean is pulled far up by one huge salary, so it describes **nobody**. The median describes a typical worker much better. That's why reports on incomes and house prices usually use the median.

## Measures of spread

Two shops can have the same average daily sales but very different reliability. Spread tells you how much values jump around.

| Measure | Meaning |
|---|---|
| **Range** | Maximum minus minimum. Simple, but one extreme value changes it a lot |
| **Variance** | The average of the squared distances from the mean |
| **Standard deviation (SD)** | The square root of the variance; roughly "the typical distance from the mean", in the same units as the data |

```try-python
import statistics as st

shop_a = [5000, 5200, 4900, 5100, 5000, 4800, 5000]   # steady
shop_b = [1000, 9000, 2000, 8000, 5000, 3000, 7000]   # up and down

for name, sales in [("Shop A", shop_a), ("Shop B", shop_b)]:
    print(name)
    print("  mean:", round(st.mean(sales)))
    print("  range:", max(sales) - min(sales))
    print("  standard deviation:", round(st.stdev(sales)))
```

Both shops average about the same, but Shop B's standard deviation is far bigger: its sales are much less predictable. A manager planning stock would treat them differently.

:::tip Sample or population?
`stdev` calculates the **sample** standard deviation (used when your data is a sample from a bigger group), and `pstdev` the **population** standard deviation (when you have every value). In Excel these are `STDEV.S` and `STDEV.P`. For most business data, the sample version is the usual choice.
:::

## The same calculations in Excel

| Statistic | Excel / Google Sheets formula |
|---|---|
| Mean | `=AVERAGE(B2:B100)` |
| Median | `=MEDIAN(B2:B100)` |
| Mode | `=MODE.SNGL(B2:B100)` |
| Range | `=MAX(B2:B100)-MIN(B2:B100)` |
| Standard deviation | `=STDEV.S(B2:B100)` |
| Count | `=COUNT(B2:B100)` |

## Calculate it yourself: the mean step by step

```try-python
scores = [62, 75, 58, 90, 71, 66, 84]

total = 0
for s in scores:
    total += s
mean = total / len(scores)

squared_gaps = [(s - mean) ** 2 for s in scores]
variance = sum(squared_gaps) / (len(scores) - 1)   # sample variance
sd = variance ** 0.5

print("Mean:", round(mean, 1))
print("Standard deviation:", round(sd, 1))
```

Change the scores and run it again to see how one very high or low score changes the mean and the standard deviation.

:::think A report says "the average house rent in an estate is KSh 45,000". Most tenants pay about KSh 15,000, but a few penthouses cost KSh 300,000. Is the mean a fair summary? What would you report?
No: a few very expensive units pull the mean far above what most tenants pay. Report the median rent (closer to what a typical tenant pays), and perhaps the range or the share of units in each price band.
:::

## Summary

- Centre: mean (average), median (middle) and mode (most common).
- Use the median when extreme values exist (incomes, prices).
- Spread: range, variance and standard deviation; a bigger SD means less predictable values.
- Excel: AVERAGE, MEDIAN, MODE.SNGL, STDEV.S.

```quiz
Q: Which measure of centre is best for salaries with one very high earner? (one word)
A: median
Q: What is the middle value of 3, 9, 4, 7, 5 when sorted? (a number)
A: 5
Q: Which Excel function gives the sample standard deviation? (write it like STDEV.S)
A: stdev.s | stdevs
```
