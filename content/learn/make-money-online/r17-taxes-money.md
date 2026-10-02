---
slug: taxes-and-money
title: "Taxes, records and managing money: KRA PIN, filing returns, turnover tax, record keeping and saving for online earners"
after: KEEP
---
# Taxes, records and managing money: KRA PIN, filing returns, turnover tax, record keeping and saving for online earners

Online income is real income. Whether you're paid through M-Pesa, PayPal, Payoneer or a bank, the money you earn freelancing, creating content or selling products is generally taxable in Kenya. Many online earners ignore this until KRA writes to them or a bank, visa or tender asks for a **tax compliance certificate**. Others earn well but have nothing saved because irregular income is hard to manage.

This unit explains the basics of tax for online earners, how to keep records, and how to manage irregular income so you build real wealth.

:::warning General education, not tax advice
Tax rules change with each Finance Act. Always confirm current rates and rules on **kra.go.ke** or with a qualified tax adviser before filing, especially as your income grows.
:::

:::note What you will learn
- Why online earners should be tax compliant
- Getting a KRA PIN and using iTax
- Which taxes may apply: income tax, turnover tax, and others
- Filing your annual return step by step
- eTIMS invoices and what they mean for you
- Simple record keeping
- Managing irregular income: budgeting, emergency fund, saving and investing
- Pension and health cover when you're self-employed
:::

## Why be tax compliant?

- It's the law, and penalties and interest for late filing add up.
- A **Tax Compliance Certificate (TCC)** is needed for government tenders, some jobs, and is often asked for in business deals.
- Records of declared income help with **loans, visas and mortgages**: banks want proof of income.
- Some international platforms and payment providers report or request tax information.

## Step 1: Get a KRA PIN

1. Go to **itax.kra.go.ke**.
2. Choose *New PIN Registration* → *Individual* → *Online form*.
3. Enter your ID details, contact information and income sources (you can select employment and/or business income).
4. Submit; your PIN certificate is sent to your email.

If you already have a PIN (for example from employment), update your income sources to include business income if you're freelancing.

## Which taxes might apply?

| Situation | Possible tax | How it works (check current rules) |
|---|---|---|
| Employed, with side freelancing | **Income tax** on total income | Salary is taxed through PAYE; side income is declared in your annual return |
| Self-employed freelancer/creator | **Income tax** on profit (income minus allowable expenses) | Graduated rates apply; declared in your annual return |
| Small business with sales between the turnover tax bands | **Turnover Tax (TOT)** | A flat percentage of gross sales (1.5% under recent law for annual turnover of KSh 1–25 million), filed monthly; eligible businesses may choose it instead of income tax on profit |
| Large turnover businesses | **VAT** registration | Required above the VAT threshold (KSh 5 million annual taxable turnover under current law) |
| Paying for professional services as a business | **Withholding tax** | Some clients deduct it and give you a certificate you can claim |

### Individual income tax bands (monthly, as at recent years)

| Monthly taxable income (KSh) | Rate |
|---|---|
| First 24,000 | 10% |
| Next 8,333 | 25% |
| Next 467,667 (up to 500,000) | 30% |
| Next 300,000 (up to 800,000) | 32.5% |
| Above 800,000 | 35% |

Residents get a **personal relief** of KSh 2,400 per month (KSh 28,800 per year). Here's an example of how bands work:

```try-python
bands = [(24000, 0.10), (8333, 0.25), (467667, 0.30), (300000, 0.325), (float("inf"), 0.35)]
def monthly_tax(income):
    tax, left = 0, income
    for size, rate in bands:
        part = min(left, size)
        tax += part * rate
        left -= part
        if left <= 0:
            break
    return max(tax - 2400, 0)   # personal relief

for income in [20000, 50000, 100000]:
    print("Profit KSh %d/month -> tax about KSh %.0f" % (income, monthly_tax(income)))
```

This is a simplified calculation for learning: it ignores deductions, reliefs and levies such as SHIF and the housing levy.

## Step 2: Allowable expenses (for income tax on profit)

If you pay income tax on profit, you're taxed on **income minus expenses wholly and exclusively incurred** to earn it. For online workers these can include:
- Internet and phone costs used for work (the business share)
- Software subscriptions, hosting, domain names
- Equipment (laptop, camera, microphone) through capital allowances
- Platform fees and payment charges
- Co-working space rent, training directly related to your work

Keep receipts. Under eTIMS rules, many expenses must be backed by **eTIMS invoices** from the supplier to be deductible.

## Step 3: File your annual return

- Annual individual returns are due by **30 June** for the previous year (January–December).
- If you had no income at all, file a **nil return**. Not filing at all attracts penalties.
- Log in to iTax → *Returns* → *File Return* → select *Income Tax – Resident Individual*.
- Download the Excel or use the online form (simpler cases), enter employment income (from your P9 form if employed), business income and expenses.
- Submit and pay any tax due via **M-Pesa Paybill 572572** using the payment registration number generated (check the current details on iTax).

## eTIMS (electronic Tax Invoice Management System)

Businesses are required to issue electronic tax invoices through eTIMS, including small businesses and service providers. Options include the eTIMS web portal, the eTIMS mobile app and USSD (*222#). If you invoice businesses for your services, expect some to ask for an eTIMS invoice. Check KRA's eTIMS guidance for current requirements.

## Step 4: Keep simple records

A sheet with these columns is enough to start:

| Date | Description | Client/Supplier | Income (KSh) | Expense (KSh) | Category | Payment ref | Receipt/invoice link |
|---|---|---|---|---|---|---|---|

Tips:
- Separate business and personal money: a separate M-Pesa line, Till, or bank account for business.
- Record foreign income in KSh using the rate on the day received.
- Save invoices, platform statements (Upwork, Fiverr, PayPal, Payoneer) and receipts in a dated folder.
- Review monthly: total income, total expenses, profit.

## Managing irregular income

Online income often goes up and down. A system:

1. **Pay yourself a fixed "salary"**: put all earnings into a business account, then transfer the same amount to yourself every month.
2. **Set aside tax**: move a percentage (e.g. 10–20%) of each payment into a separate savings account for tax.
3. **Emergency fund**: build 3–6 months of essential expenses in a money market fund (MMF) or savings account you can access quickly.
4. **Budget**: needs first (rent, food, transport, internet), then savings, then wants. The 50/30/20 rule is a simple guide.
5. **Invest for the long term** only after the emergency fund: MMFs, government bonds and Treasury bills, SACCOs. Avoid "investments" that promise guaranteed high returns.
6. **Reinvest in skills and equipment** that increase your earnings.

## Pension and health cover

Self-employed people don't get employer contributions, so:
- Register and contribute to the **Social Health Authority (SHA)** scheme as required for self-employed persons.
- Consider **NSSF** voluntary contributions and/or a registered **personal pension scheme** or income drawdown fund; contributions to registered schemes may also attract tax benefits within limits.
- Consider private health or life insurance if you support a family.

:::think A freelancer earns KSh 120,000 one month and KSh 20,000 the next. In good months they spend everything, and in bad months they borrow. What system would fix this?
Put all income into a business account, pay themselves a fixed monthly amount based on their average income, set aside a tax percentage from every payment, build a 3–6 month emergency fund in an MMF, and only spend from the fixed salary.
:::

## Summary

- Online income is generally taxable; compliance unlocks TCCs, loans, visas and peace of mind.
- Register on iTax for a KRA PIN and include business income as a source.
- Possible taxes: income tax on profit (graduated rates, KSh 2,400 monthly relief), turnover tax for eligible small businesses, VAT above the threshold, withholding tax.
- File annual returns by 30 June (nil returns if no income); keep records and eTIMS invoices for expenses.
- Manage irregular income with a fixed salary, a tax pot, an emergency fund, a budget, safe long-term investing and your own pension and health cover.

```quiz
Q: What is the deadline each year for filing individual annual returns in Kenya?
A: 30 June | 30th June | June 30 | june 30th
Q: What is the online portal for KRA PINs and returns called?
A: iTax | itax.kra.go.ke
Q: If you had no income in a year, what kind of return do you file? (two words)
A: nil return | a nil return
Q: What is the monthly personal relief for a resident individual (KSh)?
A: 2400 | 2,400 | ksh 2400
Q: How many months of essential expenses should an emergency fund cover? (give a range like 3-6)
A: 3-6 | 3 to 6 | 3–6 | three to six
Q: What KRA system issues electronic tax invoices? (abbreviation)
A: eTIMS | etims
```
