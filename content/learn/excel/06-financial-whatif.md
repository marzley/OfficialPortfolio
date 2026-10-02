---
slug: financial-functions-what-if
title: "Financial functions and what-if analysis: loans, savings, depreciation, Goal Seek and scenarios"
after: charts-pivots
---
# Financial functions and what-if analysis: loans, savings, depreciation, Goal Seek and scenarios

Should you take the 12-month or 24-month loan? How much must you save monthly to reach KSh 500,000 in three years? What price gives the profit you need? Excel's financial functions and **what-if analysis** tools answer these questions in seconds, and they're used daily in banks, SACCOs, microfinance institutions, accounting, business planning and personal finance. This unit explains them with practical Kenyan examples.

:::warning Learning examples only
Interest rates, fees and loan terms here are illustrative. Real loans include fees, insurance and specific interest methods; always read the lender's terms and the Annual Percentage Rate (APR) or total cost of credit disclosed.
:::

:::note What you will learn
- Interest basics: flat vs reducing balance, simple vs compound
- PMT (repayments), IPMT/PPMT (interest and principal parts)
- Building a loan amortisation schedule
- FV and PV (savings and investments), RATE and NPER
- NPV and IRR for evaluating projects (introduction)
- Depreciation (SLN, DB)
- Goal Seek, Data Tables and Scenario Manager
:::

## Interest basics

| Concept | Meaning |
|---|---|
| **Principal** | The amount borrowed or invested |
| **Rate** | Interest per period (e.g. 14% per year = 14%/12 per month) |
| **Periods (nper)** | Number of payment periods (e.g. 24 months) |
| **Simple interest** | Interest only on the original principal |
| **Compound interest** | Interest on principal **plus** accumulated interest |
| **Flat-rate loan** | Interest calculated on the original amount for the whole term (common in some informal/chama loans); the effective rate is much higher than it looks |
| **Reducing-balance loan** | Interest calculated on the remaining balance each period (banks, SACCOs commonly) |

### Flat vs reducing: the same "10%" isn't the same

- **Flat 10% per year** on KSh 100,000 for 1 year: interest = 10,000 → total 110,000 → monthly 9,167.
- **Reducing 10% per year** on KSh 100,000 for 12 months: monthly repayment `=PMT(10%/12, 12, -100000)` ≈ 8,792 → total ≈ 105,500.

The flat loan costs more because you pay interest on money you've already repaid.

## PMT: loan repayments

```
=PMT(rate, nper, pv, [fv], [type])
```

| Argument | Meaning | Example |
|---|---|---|
| rate | Interest **per period** | `14%/12` (monthly) |
| nper | Number of periods | `24` |
| pv | Present value (loan amount); enter as negative to get a positive payment | `-200000` |
| fv | Future value (usually 0 for loans) | |
| type | 0 = payments at end of period (default), 1 = beginning | |

Example: KSh 200,000 at 14% per year over 24 months:

```
=PMT(14%/12, 24, -200000)      → about 9,603 per month
```

Total repaid: `=9,603 × 24` ≈ 230,470; total interest ≈ 30,470.

**Use cell references** (rate in B1, months in B2, amount in B3): `=PMT(B1/12, B2, -B3)`. Then change inputs to compare options instantly.

### IPMT and PPMT

Each payment contains **interest** and **principal**:
- `=IPMT(rate, period, nper, pv)` → interest part of a given payment.
- `=PPMT(rate, period, nper, pv)` → principal part.

Early payments are mostly interest; later ones mostly principal.

## Building an amortisation schedule

| | A | B | C | D | E |
|---|---|---|---|---|---|
| 1 | Loan amount | 200,000 | | | |
| 2 | Annual rate | 14% | | | |
| 3 | Months | 24 | | | |
| 4 | Monthly payment | `=PMT(B2/12,B3,-B1)` | | | |
| 6 | **Month** | **Opening balance** | **Interest** | **Principal** | **Closing balance** |
| 7 | 1 | `=B1` | `=B7*$B$2/12` | `=$B$4-C7` | `=B7-D7` |
| 8 | 2 | `=E7` | `=B8*$B$2/12` | `=$B$4-C8` | `=B8-D8` |

Copy row 8 down to month 24; the closing balance reaches (about) zero. Add totals of interest and principal; chart the declining balance.

This is exactly how lenders compute schedules (with their specific conventions).

## Savings and investments: FV, PV, RATE, NPER

### FV: what will my savings grow to?

```
=FV(rate, nper, pmt, [pv], [type])
```

Saving KSh 5,000 monthly for 3 years at 9% per year (e.g. an illustrative money market fund return, compounded monthly):

```
=FV(9%/12, 36, -5000)          → about 205,800
```

(You deposit 180,000; the rest is growth. Real returns vary and aren't guaranteed.)

### PV: what's a future amount worth today?

`=PV(rate, nper, pmt, [fv])` e.g. how much to invest today to have KSh 500,000 in 5 years at 10%: `=PV(10%, 5, 0, -500000)` → about 310,460.

### Monthly saving needed for a goal

Goal: KSh 500,000 in 3 years at 9% per year:

```
=PMT(9%/12, 36, 0, -500000)    → about 12,150 per month
```

### RATE and NPER

- `=RATE(nper, pmt, pv)` finds the interest rate: useful to reveal the true cost of a loan quoted as "KSh 10,000 now, pay KSh 1,000 weekly for 12 weeks": `=RATE(12, -1000, 10000)` gives the weekly rate (multiply by 52 for a rough yearly rate: it's very high).
- `=NPER(rate, pmt, pv)` finds how many periods to repay or reach a goal.

:::think A digital lender offers KSh 5,000 today, repaid as KSh 5,750 after 30 days. How could you use Excel to understand the cost?
The cost is 750 on 5,000 for 30 days = 15% per month. Excel's `=RATE(1, 0, 5000, -5750)` confirms 15% per period. Annualised (roughly ×12, or compounded `=(1+15%)^12-1`), that's extremely expensive compared with bank or SACCO loans. Comparing true costs helps avoid debt traps.
:::

## Evaluating projects: NPV and IRR (introduction)

A business considers buying a posho mill for KSh 300,000 that's expected to bring net cash flows of 90,000, 110,000, 120,000 and 120,000 over four years.

- **NPV** (net present value) discounts future cash flows to today using a required rate (e.g. 12%):

```
=NPV(12%, B2:B5) - 300000
```

  Positive NPV → the project earns more than the required rate.

- **IRR** (internal rate of return): the rate at which NPV = 0:

```
=IRR(B1:B5)       where B1 = -300000 and B2:B5 are the yearly cash flows
```

Compare IRR with your cost of capital/loan rate. These are standard tools in business plans and investment decisions.

## Depreciation

Assets (vehicles, computers, machines) lose value over time; depreciation spreads the cost across their useful life (for accounting).

| Function | Method | Example |
|---|---|---|
| `=SLN(cost, salvage, life)` | Straight-line (same amount each year) | Laptop KSh 90,000, salvage 10,000, 4 years → `=SLN(90000,10000,4)` = 20,000/year |
| `=DB(cost, salvage, life, period)` | Declining balance (more in early years) | |
| `=DDB(...)` | Double-declining balance | |

(Tax depreciation rules, called capital allowances, follow KRA rules and differ from accounting depreciation.)

## What-if analysis tools

**Data → What-If Analysis** (Excel):

### Goal Seek: work backwards to a target

"What selling price gives a profit of KSh 50,000?"
1. Build the model: price (input) → revenue → costs → profit (formula).
2. Data → What-If Analysis → **Goal Seek**.
3. **Set cell:** the profit cell; **To value:** 50000; **By changing cell:** the price cell.
4. Excel finds the price.

Other uses: the loan amount you can afford with a KSh 15,000 monthly repayment; the sales volume needed to break even (set profit to 0).

### Data Tables: many scenarios at once

A **one-variable data table** shows repayments for different loan terms:

| Months | Payment |
|---|---|
| | `=B4` (link to the PMT result) |
| 12 | |
| 24 | |
| 36 | |
| 48 | |

Select the table → What-If Analysis → **Data Table** → Column input cell: the months input (B3). Excel fills payments for each term.

A **two-variable data table** varies two inputs (e.g. interest rates across the top, terms down the side) for a full comparison grid.

### Scenario Manager

Save sets of inputs as named scenarios ("Pessimistic", "Expected", "Optimistic": different sales volumes, prices and costs), switch between them, and create a **summary report** comparing outcomes. Great for business plans and budgets.

**Google Sheets:** no built-in Goal Seek (there's a Google add-on), but formulas and tables work similarly; Scenario Manager isn't available.

## Practice tasks

1. Calculate the monthly repayment for KSh 150,000 at 13% per year over 18 months, and the total interest.
2. Build a full amortisation schedule and a line chart of the balance.
3. Calculate how much to save monthly to reach KSh 300,000 in 2 years at 8%.
4. Use RATE to find the monthly cost of a short-term loan offer.
5. Use Goal Seek to find the break-even number of units for a small business model.

## Summary

- Know principal, rate per period, number of periods, simple vs compound interest, and flat vs reducing-balance loans (flat costs more).
- PMT calculates repayments; IPMT/PPMT split interest and principal; build amortisation schedules with formulas.
- FV, PV, PMT (for goals), RATE and NPER handle savings and loan analysis.
- NPV and IRR evaluate investments; SLN and DB calculate depreciation.
- Goal Seek works backwards to a target; Data Tables compare many inputs; Scenario Manager compares named scenarios.

```quiz
Q: Which function calculates a loan's fixed periodic repayment?
A: PMT
Q: For a 14% yearly rate with monthly payments, what rate do you enter in PMT? Write like 14%/12.
A: 14%/12 | 0.14/12
Q: Which function shows the future value of regular savings?
A: FV
Q: Which loan type costs more for the same quoted rate: flat or reducing balance?
A: flat
Q: Which tool works backwards to find the input that gives a target result? (two words)
A: Goal Seek
Q: Which function gives straight-line depreciation?
A: SLN
Q: Which function finds the interest rate when you know payments and amount?
A: RATE
```
