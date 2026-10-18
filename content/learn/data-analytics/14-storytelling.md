---
slug: storytelling-with-data
title: "Storytelling with data: turning analysis into reports and presentations people act on"
after: power-bi-dashboards
---
# Storytelling with data: turning analysis into reports and presentations people act on

An analysis only matters if someone **understands it and acts on it**. Managers are busy; they want the answer, why it matters and what to do. Storytelling with data means presenting your findings clearly, honestly and in the right order.

## Start with the answer (the pyramid)

Most reports go: background → method → lots of tables → conclusion on page 9. Flip it:

1. **The answer / recommendation** (one or two sentences)
2. **The key evidence** (two or three findings with charts)
3. **Details and method** (appendix, for those who want it)

**Weak opening:** "This report analyses sales data from January to June 2026 across four branches…"
**Strong opening:** "Thika branch sales fell 16% in April (KSh 75,000), mainly because two best-selling fertilisers were out of stock at planting time. Restocking three weeks earlier would recover most of it."

## From data to insight to action

| Level | Example |
|---|---|
| **Data** | Thika sales: March KSh 455k, April KSh 380k |
| **Information** | Thika sales fell 16% in April |
| **Insight** | The fall came from DAP and CAN fertiliser, which were out of stock for 12 days at planting season |
| **Recommendation** | Reorder fertiliser three weeks before planting season; set a minimum stock alert |

Always push past "what happened" to **why** and **so what**.

## Structure of a one-page report

1. **Title that states the finding**
2. **Summary:** 3 bullet points
3. **One or two charts** that prove the main point
4. **Recommendation(s)** with expected impact
5. **Next steps** and who owns them
6. **Notes:** data source, period, limitations

## Presenting to managers

- **Know your audience:** a board wants the big picture; a branch manager wants their numbers.
- **One idea per slide**, with a title that states the point.
- **Highlight** the bar or line that matters; grey out the rest.
- **Use plain language:** "about one in five customers", not "20.3% (n = 1,412)".
- **Prepare for questions:** have the details ready but don't show them all.
- **Be honest about limitations:** missing data, small samples, correlation vs causation.

## Writing numbers well

| Instead of | Write |
|---|---|
| 0.2347 | 23% |
| KSh 1,234,567.89 | KSh 1.2 million |
| "There was an increase" | "Sales rose 18%, from KSh 410k to KSh 485k" |
| "Significant" (vague) | "Statistically significant (p = 0.02)" or "large enough to matter" |

## Turn analysis into a summary (run it)

```try-python
branches = {"Thika": (455000, 380000), "Kenol": (295000, 310000), "Nyeri": (338000, 342000)}

lines = []
for name, (march, april) in branches.items():
    change = (april - march) / march
    lines.append((change, f"{name}: {'up' if change > 0 else 'down'} {abs(change):.0%} (KSh {march // 1000}k → {april // 1000}k)"))

lines.sort()
worst = lines[0][1]
print("Headline: " + worst.split(":")[0] + " had the biggest fall in April.")
for _, text in lines:
    print(" -", text)
```

:::warning Honesty first
Never hide inconvenient results, cherry-pick dates or change axes to make a point look stronger. Your credibility is an analyst's most valuable asset.
:::

:::think Your analysis shows a popular manager's branch is the least profitable. How do you present this fairly?
Present facts neutrally with clear evidence, explain likely causes (costs, location, stock issues) rather than blaming a person, share it first with the manager if appropriate, focus on solutions, and note any data limitations. Fair, private, solution-focused communication keeps trust.
:::

## Summary

- Start with the answer, then the evidence, then details.
- Move from data to information to insight to recommendation.
- One idea per slide or chart; plain language; rounded numbers.
- Be honest about limitations; your credibility matters most.

```quiz
Q: Should a report start with the answer or the background? (one word)
A: answer | the answer
Q: Write 0.2347 as a rounded percentage. (like 23%)
A: 23% | 23
Q: After "insight", what comes next in data → information → insight → ___ ? (one word)
A: recommendation | action
```
