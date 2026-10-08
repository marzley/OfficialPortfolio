---
slug: bonds-tbills-mmfs
title: "Option 10: T-bills, Treasury bonds, money market funds and other lower-risk options in Kenya"
after: copy-trading-bots
---
# Option 10: T-bills, Treasury bonds, money market funds and other lower-risk options

This isn't trading; it's **saving and investing**. It belongs in this subject because many people chasing trading profits would be better off starting here, and because it's where your emergency fund and long-term money should usually live. Returns are lower than the "dream" returns advertised for trading, but they're far more predictable.

## 1. What they are

| Option | What it is | Regulator |
|---|---|---|
| **Treasury bills (T-bills)** | Short-term loans to the Government of Kenya: 91, 182 or 364 days. You buy at a discount and receive the full face value at maturity | CBK |
| **Treasury bonds** | Longer-term loans to the government (2 to 30 years) paying interest (coupons) twice a year; **infrastructure bonds** have had tax-free interest | CBK |
| **Money market funds (MMFs)** | Pooled funds investing in short-term, lower-risk instruments (T-bills, bank deposits); interest calculated daily; easy to withdraw | CMA (fund managers and schemes) |
| **Fixed deposits** | Bank deposits for a fixed period at an agreed rate | CBK (banks) |
| **SACCO deposits and shares** | Member savings that earn interest/dividends and give access to loans | SASRA (deposit-taking SACCOs) |
| **Other unit trusts** (balanced, equity, fixed income funds) | Pooled funds with more growth potential and more risk | CMA |

## 2. How they work: examples

**T-bill:** you buy a 364-day T-bill with face value KSh 100,000 at a discount price of about KSh 88,500 (the exact price depends on the rate at the auction). After a year you receive KSh 100,000. The difference is your interest (minus withholding tax).

**Money market fund:** you invest KSh 10,000. The fund's net annual yield is, say, 10% (yields change with interest rates). Interest accrues daily; after a year, about KSh 11,000 before tax. You can usually withdraw within a few working days.

**Compare the outcomes:**

```try-python
amount = 50_000
years = 3
mmf_rate = 0.10            # example net yield; real yields change
tax = 0.15                 # example withholding tax on interest; check current rates

value = amount
for year in range(1, years + 1):
    interest = value * mmf_rate
    value += interest * (1 - tax)
    print(f"Year {year}: about KSh {value:,.0f}")

print()
print("A trader who loses 30% in a bad month:", f"KSh {amount * 0.7:,.0f}", "and needs +43% just to recover")
```

## 3. How to start

- **T-bills and bonds:** open a CDS account with the CBK through the **DhowCSD** platform (online and app), then bid in auctions; payments by bank transfer. Minimum amounts apply (T-bills have required larger minimums than bonds; check current figures on the CBK website). You can also invest through banks and stockbrokers, which may charge fees.
- **MMFs and unit trusts:** choose a **CMA-licensed fund manager**; open an account online (ID, KRA PIN); deposit by M-Pesa or bank. Compare **net** yields (after fees), fund size, the manager's reputation, and withdrawal times.
- **SACCOs:** choose a licensed SACCO (check SASRA's list for deposit-taking SACCOs); understand rules on share capital, deposits and withdrawals.

## 4. Costs

MMF management fees (usually already deducted from the quoted yield, so compare **net** yields), possible transfer fees, withholding tax on interest (some government infrastructure bonds have been tax-exempt), bank or broker fees if you don't buy directly.

## 5. Risk level: low to medium

- **T-bills and bonds:** backed by the government; low default risk in practice, but **bond prices fall when interest rates rise** if you sell before maturity, and inflation can reduce real returns.
- **MMFs:** low risk but not zero: fund management and credit risks exist; returns change with interest rates; they're not insured like bank deposits in all cases.
- **Fixed deposits:** bank deposits are protected up to a limit by the Kenya Deposit Insurance Corporation (check the current limit).
- **SACCOs:** governance varies; choose regulated, well-run SACCOs.
- **Equity unit trusts:** higher risk (share prices fall at times) with higher long-term growth potential.

## 6. Who it may suit

- **Everyone**, for emergency funds (MMFs are popular for this).
- Savers wanting predictable returns for goals 1–5 years away (T-bills, bonds, fixed deposits).
- Long-term investors combining these with shares or equity funds.

## 7. Red flags

- "Money market" or "investment" schemes promising returns far above T-bill rates, especially fixed weekly returns
- Unlicensed "chama investment" apps
- Anyone asking you to send money to a personal account to buy T-bills for you

## 8. Verdict

T-bills, bonds, MMFs, fixed deposits and good SACCOs are the **foundation** of personal finance in Kenya: lower risk, regulated, and predictable. They won't make you rich quickly, but they protect and grow money steadily, and they're where an emergency fund and much long-term money belongs before any trading.

```quiz
Q: Which Kenyan institution issues and runs auctions for T-bills and Treasury bonds? (abbreviation)
A: CBK | Central Bank of Kenya
Q: What is the name of the CBK's online platform for buying government securities?
A: DhowCSD | Dhow CSD | Dhow
Q: Which option is popular for emergency funds because it's easy to withdraw and earns daily interest? (three words or abbreviation)
A: money market fund | MMF | money market funds | MMFs
Q: When interest rates rise, do existing bond prices tend to rise or fall?
A: fall | they fall
```
