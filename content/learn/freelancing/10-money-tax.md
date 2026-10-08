---
slug: money-and-tax-kenya
title: "Freelance money in Kenya: rates, irregular income, savings, KRA and records"
after: freelance-tools-workday
---
# Freelance money in Kenya: rates, irregular income, savings, KRA and records

Earning is only half of freelancing. Many freelancers earn decent money and still feel broke, because income is irregular, fees and exchange rates eat into it, nothing is saved for quiet months, and tax is an afterthought. This lesson builds a simple money system. For payment methods (Payoneer, PayPal, Wise, M-Pesa, bank), see [getting paid in Kenya](./?track=make-money-online&lesson=getting-paid-kenya); for general money habits, [taxes and money](./?track=make-money-online&lesson=taxes-and-money).

:::note Education, not financial or tax advice
Tax rules, rates and thresholds change, and individual situations differ. Use this lesson to understand the basics, then confirm with **KRA** (kra.go.ke, iTax, KRA offices) or a qualified tax adviser before filing.
:::

## Step 1: Know your real minimum rate

Your rate must cover your living costs, business costs, taxes, savings and the hours you **can't** bill (marketing, admin, learning, gaps between projects). Most freelancers can bill only about half their working hours.

Try this calculator. Change the numbers to match your life:

```try-python
# Monthly needs (KSh)
living_costs = 45000        # rent, food, transport, family support
business_costs = 6000       # internet, software, electricity, equipment savings
savings_goal = 8000         # emergency fund and future
tax_rate = 0.15             # rough share to set aside for tax; confirm your real rate with KRA or an adviser

hours_per_week = 40
billable_share = 0.5        # half your time goes to marketing, admin, learning and gaps
weeks_per_month = 4.3

needed_before_tax = living_costs + business_costs + savings_goal
needed = needed_before_tax / (1 - tax_rate)
billable_hours = hours_per_week * billable_share * weeks_per_month

minimum_hourly = needed / billable_hours
print("You need to bring in about KSh {:,.0f} a month".format(needed))
print("Billable hours per month: {:.0f}".format(billable_hours))
print("Minimum hourly rate: KSh {:,.0f}  (about USD {:.1f} at KSh 129 per USD)".format(minimum_hourly, minimum_hourly / 129))

# A fixed-price project estimate
estimated_hours = 25
buffer = 1.25               # 25% extra for revisions and surprises
print("A {}-hour project should be priced at least KSh {:,.0f}".format(estimated_hours, minimum_hourly * estimated_hours * buffer))
```

The exchange rate here is just an example; use the current rate. If the minimum looks higher than the market pays for your current level, the answer is usually: improve skills and niche, find better-paying clients, or reduce costs, not working 16 hours a day.

## Step 2: Understand what you actually receive

Between the client's payment and your M-Pesa, money passes through several deductions:

| Deduction | Example |
|---|---|
| Platform fee | A percentage of each payment on Upwork, Fiverr and others |
| Withdrawal fee | Fixed or percentage fee for moving money out |
| Currency conversion | The exchange rate offered may be lower than the market rate |
| Transfer to M-Pesa/bank | Small transaction fees |

Compare total costs across methods with a test amount, and include fees in your prices. Withdrawing larger amounts less often can reduce fixed fees.

## Step 3: The freelancer's account system

Separate money by purpose (separate M-Pesa/bank accounts, M-Shwari/KCB M-Pesa lock savings, a money market fund, or SACCO savings):

| Pot | Share of each payment (example) | Purpose |
|---|---|---|
| **Tax pot** | 10–20% | Set aside immediately so tax is never a shock |
| **Business pot** | 5–10% | Software, equipment, internet, courses |
| **Emergency fund** | 10% until you have 3–6 months of expenses | Quiet months, illness, laptop failure |
| **Salary to yourself** | The rest | A fixed amount on a fixed date each month |

**Pay yourself a fixed "salary"** from your business account each month, instead of spending payments as they arrive. In good months, the extra stays in the account to cover quiet months. This one habit makes irregular income feel stable.

## Step 4: Records (from day one)

Keep a simple spreadsheet or use an accounting tool:

| Date | Client | Description | Invoice no. | Amount (original currency) | KSh received | Fees | Method |
|---|---|---|---|---|---|---|---|

Also keep: copies of invoices, platform earnings statements (Upwork and Fiverr let you download them), receipts for business expenses (laptop, internet, software), and M-Pesa/bank statements. Save everything in a cloud folder by year. Good records make tax returns, loans and visa applications much easier.

## Step 5: KRA basics for freelancers

General principles (confirm details with KRA):

- **Get a KRA PIN** on iTax if you don't have one; it's free.
- **Freelance income is taxable**, including income from foreign clients and platforms paid into your Kenyan accounts. Kenyan tax residents are generally taxed on their income from all sources.
- **File an annual income tax return** on iTax. The deadline for individual returns has been **30 June** each year for the previous year's income. File even in years with low income, because a missed return can attract penalties.
- **Business income vs employment:** if you also have a job, your employer deducts PAYE from your salary, but your freelance income still needs to be declared in your return.
- **Turnover Tax (TOT):** a simplified tax regime has applied to resident businesses with annual turnover within a set band; the rate and band have changed over the years. Check KRA's current rules to see whether TOT or normal income tax applies to you.
- **Allowable expenses:** costs wholly and exclusively for the business (part of internet, software, equipment) can reduce taxable profit under normal income tax. Keep receipts.
- **Withholding tax:** some Kenyan companies and government bodies deduct withholding tax when they pay you for services and give you a certificate; keep these, since they count towards your tax.
- **VAT** registration becomes compulsory only above a turnover threshold; most beginners are far below it.
- **Social contributions:** self-employed people can contribute to NSSF and must follow current SHA (Social Health Authority) rules for health cover. Check the current requirements and rates.

See [KRA iTax](./?track=e-services-kenya&lesson=kra-itax) for how to use iTax step by step. If your income grows, a tax adviser usually pays for themselves.

## Step 6: Registering a business (when it makes sense)

You can freelance as an individual. Registering a **business name** or a **limited company** on eCitizen/BRS ([business registration](./?track=e-services-kenya&lesson=business-registration-online)) can help when:
- clients (especially companies, NGOs, government) want to contract a registered business;
- you want a business bank account, a Paybill/Till in a business name, or to bid for tenders;
- you're growing into a team or agency.

Each structure has different tax and compliance duties. Understand them before registering.

## Step 7: Protect and grow your money

- **Emergency fund first** (3–6 months of expenses), in an accessible, low-risk place such as a money market fund or savings account.
- **Insurance:** health cover; consider equipment insurance for your laptop and phone.
- **Long-term:** retirement savings (NSSF, individual pension plans), and long-term investments you understand.
- **Avoid** "double your money" schemes, pyramid schemes and using trading (forex, crypto, Deriv) as a way to pay bills. Most retail traders lose money ([trading and investing: honest guide](./?track=earn-online&lesson=trading-investing-honest-guide)).

## Monthly money routine (30 minutes)

1. Update the income and expense sheet.
2. Move tax, business and emergency shares to their pots.
3. Pay yourself the fixed salary.
4. Chase unpaid invoices.
5. Check: how many months of expenses do I have saved?

## Summary

- Calculate a minimum rate that covers living costs, business costs, savings, tax and non-billable time.
- Know all the fees between the client and your M-Pesa; include them in prices.
- Separate money into tax, business, emergency and salary pots; pay yourself a fixed salary.
- Keep records from day one, get a KRA PIN, declare freelance income and file on time; confirm details with KRA or an adviser.

```quiz
Q: Roughly what share of working hours can most freelancers bill? Answer as a fraction or percentage.
A: half | 50% | 50 | 1/2 | 0.5
Q: What is the name of KRA's online tax system?
A: iTax
Q: Which pot should you move money into first, before spending? (one word)
A: tax
Q: How many months of expenses should a full emergency fund cover? Write a range like 3-6.
A: 3-6 | 3 to 6 | 6 | 3
```
