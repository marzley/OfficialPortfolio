---
slug: types-of-data-sources
title: "Types of data, where data comes from and what makes data good"
after: data-analytics-start-here
---
# Types of data, where data comes from and what makes data good

Before you analyse anything, you need to know **what kind of data** you have. The type decides which calculations and charts make sense. You can average ages; you can't average county names.

## Quantitative and qualitative data

| Type | Meaning | Examples |
|---|---|---|
| **Quantitative** (numbers you can measure) | Amounts, counts, measurements | Sales in KSh, number of customers, rainfall in mm |
| **Qualitative** (categories or descriptions) | Labels, groups, opinions | County, payment method, product name, customer comment |

### Two kinds of numbers
- **Discrete:** counts that come in whole steps (number of children, matatus, orders).
- **Continuous:** measurements that can take any value (weight, height, temperature, time).

### Two kinds of categories
- **Nominal:** categories with no order (county, payment method, colour).
- **Ordinal:** categories with an order (satisfaction: poor, fair, good, excellent; education level).

## What you can do with each type

| Data type | Good calculations | Good charts |
|---|---|---|
| Continuous / discrete numbers | Sum, average, median, min, max, spread | Histogram, line chart, box plot |
| Nominal categories | Counts and percentages | Bar chart |
| Ordinal categories | Counts, percentages, median category | Ordered bar chart |
| Dates and times | Trends by day, week, month | Line chart |

## Where data comes from

| Source | Examples in Kenya |
|---|---|
| **Business systems** | POS sales, M-Pesa statements, accounting software, CRM |
| **Surveys and forms** | Google Forms, KoboToolbox (popular with NGOs), customer feedback |
| **Websites and apps** | Google Analytics, app usage, social media insights |
| **Government and open data** | Kenya National Bureau of Statistics (KNBS), county data, KNBS census reports |
| **International open data** | World Bank, UN agencies, WHO |
| **Sensors and devices** | Weather stations, smart meters, GPS trackers |

**Primary data** is data you collect yourself (a survey). **Secondary data** was collected by someone else (KNBS reports).

## What makes data good? The quality checklist

| Quality | Question | Bad example |
|---|---|---|
| **Accurate** | Is it correct? | A sale recorded as KSh 50,000 instead of 500 |
| **Complete** | Is anything missing? | Half the rows have no branch name |
| **Consistent** | Is it recorded the same way everywhere? | "Nairobi", "nairobi", "NRB" for the same place |
| **Timely** | Is it recent enough? | Using 2015 prices for a 2026 budget |
| **Valid** | Does it follow the rules? | An age of 250, a date of 31 February |
| **Unique** | Are there duplicates? | The same M-Pesa transaction entered twice |

"Garbage in, garbage out": bad data gives wrong answers, however clever the analysis.

## Check a dataset's types (run it)

```try-python
rows = [
    {"county": "Murang'a", "customers": 120, "rating": "good", "revenue": 45200.5},
    {"county": "Kiambu", "customers": 98, "rating": "excellent", "revenue": 51800.0},
    {"county": "Nyeri", "customers": 75, "rating": "fair", "revenue": 30100.75},
]

for column in rows[0]:
    value = rows[0][column]
    kind = "number (quantitative)" if isinstance(value, (int, float)) else "category (qualitative)"
    print(column, "->", kind)

order = ["poor", "fair", "good", "excellent"]
best = max(rows, key=lambda r: order.index(r["rating"]))
print("Best-rated county:", best["county"])
```

Notice that "rating" is a category, but it has an **order**, so we can still find the best one.

:::warning Personal data
Data about people (names, phone numbers, ID numbers, health, location) is protected by Kenya's Data Protection Act (2019). Collect only what you need, keep it secure, and anonymise it before sharing or analysing when you can.
:::

:::think A survey asks "How many people live in your house?" and "Which county do you live in?" Which answer can you average, and what would you do with the other?
You can average household size (a discrete number). For county (a nominal category), count how many respondents are in each county and show percentages in a bar chart.
:::

## Summary

- Quantitative data is numbers (discrete or continuous); qualitative data is categories (nominal or ordinal).
- The type decides the calculations and charts you can use.
- Data comes from systems, surveys, websites, open data and sensors.
- Check quality: accurate, complete, consistent, timely, valid and unique.

```quiz
Q: Is "payment method" quantitative or qualitative? (one word)
A: qualitative
Q: Satisfaction levels (poor, fair, good) are which kind of category? (one word)
A: ordinal
Q: Which Kenyan body publishes official statistics? (abbreviation)
A: knbs
```
