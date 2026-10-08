---
slug: pips-lots-leverage-margin
title: "Pips, lots, leverage and margin: the maths of every trade (with calculators)"
after: how-forex-works
---
# Pips, lots, leverage and margin: the maths of every trade

Many beginners blow their accounts not because their analysis was wrong, but because they didn't understand **how much money each price move costs**. This lesson is the arithmetic of forex. Run every calculator, change the numbers, and don't move on until it feels easy.

## Pips and points

A **pip** ("percentage in point") is the standard unit for measuring price changes.

| Pair type | Pip size | Example |
|---|---|---|
| Most pairs (EUR/USD, GBP/USD, AUD/USD…) | 0.0001 (4th decimal) | 1.0850 → 1.0880 = **30 pips** |
| JPY pairs (USD/JPY, EUR/JPY…) | 0.01 (2nd decimal) | 150.20 → 150.70 = **50 pips** |

Most brokers show one extra decimal, a **pipette** or **point** (1/10 of a pip): EUR/USD 1.08503. If a platform says "10 points", that's usually 1 pip. Always check what your platform means by "points".

Gold, oil and indices have their own conventions (gold is often quoted to two decimals, and a $1 move in gold is often called "100 points" or "10 pips" depending on the broker). Confirm with your broker's contract specifications before trading them.

## Lots: the size of your position

| Lot | Units of base currency | Roughly per pip on EUR/USD |
|---|---|---|
| Standard lot (1.00) | 100,000 | $10 |
| Mini lot (0.10) | 10,000 | $1 |
| Micro lot (0.01) | 1,000 | $0.10 |

Beginners should think in **micro lots** (0.01). A 0.01 lot on EUR/USD moving 100 pips is about $1. A 1.00 lot moving 100 pips is about $1,000. Typing "1" instead of "0.01" is a classic, expensive mistake.

## Calculator 1: pip value and profit/loss

```try-python
def pip_size(pair):
    return 0.01 if pair.endswith("JPY") else 0.0001

def pip_value_usd(pair, lots, price):
    """Value of one pip in US dollars for a position (account in USD)."""
    units = lots * 100_000
    value_in_quote = units * pip_size(pair)      # pip value in the QUOTE currency
    quote = pair[-3:]
    if quote == "USD":
        return value_in_quote                     # e.g. EUR/USD: already in USD
    if pair.startswith("USD"):
        return value_in_quote / price             # e.g. USD/JPY: convert quote -> USD
    raise ValueError("For crosses, convert with the quote currency's USD rate")

def profit(pair, lots, entry, exit_price, direction="buy"):
    pips = (exit_price - entry) / pip_size(pair)
    if direction == "sell":
        pips = -pips
    return pips, pips * pip_value_usd(pair, lots, exit_price)

for pair, lots, entry, exit_price, d in [
    ("EURUSD", 0.10, 1.0850, 1.0880, "buy"),
    ("EURUSD", 0.01, 1.0850, 1.0800, "buy"),
    ("USDJPY", 0.05, 150.20, 149.70, "sell"),
    ("GBPUSD", 1.00, 1.2700, 1.2650, "buy"),
]:
    pips, usd = profit(pair, lots, entry, exit_price, d)
    print(f"{d:4} {lots:.2f} lots {pair}: {pips:+.1f} pips = {usd:+.2f} USD")
```

Look at the last line: one standard lot, a 50-pip move against you, **−$500**. On a $200 account, that position would have been wiped out long before reaching 50 pips.

## Leverage and margin

**Leverage** lets you open a position much bigger than your deposit. The broker asks you to put up only a fraction as **margin** (a security deposit), and lends the rest of the exposure.

| Leverage | Margin required for 1 standard lot of EUR/USD (≈ $108,500) |
|---|---|
| 1:10 | ≈ $10,850 |
| 1:30 | ≈ $3,617 |
| 1:100 | ≈ $1,085 |
| 1:500 | ≈ $217 |

Key ideas:
- **Leverage doesn't change how much a pip is worth.** Position size does. Leverage only changes how big a position you're *allowed* to open.
- **High leverage makes it easy to open positions far too large** for your account. That's the danger.
- Regulators in many countries cap retail leverage (e.g. 1:30 on major pairs in the EU and UK) because high leverage harms retail clients. Some offshore brokers offer 1:500 or more; that's a warning sign, not a benefit.

### Margin terms

| Term | Meaning |
|---|---|
| **Balance** | Money in the account, excluding open trades |
| **Equity** | Balance ± profit/loss of open trades |
| **Used margin** | Margin locked for open positions |
| **Free margin** | Equity − used margin: what's available for new trades or losses |
| **Margin level** | Equity ÷ used margin × 100% |
| **Margin call** | A warning when margin level falls to the broker's threshold |
| **Stop out** | The broker automatically closes your trades when margin level falls to a lower threshold, to stop your account going negative |

## Calculator 2: margin, margin level and stop out

```try-python
balance = 200.0          # USD account
leverage = 100
lots = 0.50              # too big for this account, on purpose
price = 1.0850           # EUR/USD
stop_out_level = 50      # percent; check your broker's real figure

notional = lots * 100_000 * price
used_margin = notional / leverage
pip_value = lots * 100_000 * 0.0001       # USD per pip for EUR/USD

print(f"Position size: {notional:,.0f} USD; margin used: {used_margin:,.2f} USD")
print(f"Each pip is worth {pip_value:.2f} USD")

for pips_against in (0, 10, 20, 30, 40):
    equity = balance - pips_against * pip_value
    level = equity / used_margin * 100
    flag = "STOP OUT: trades closed" if level <= stop_out_level else ""
    print(f"{pips_against:3} pips against: equity {equity:7.2f}  margin level {level:5.0f}%  {flag}")
```

A move of about 30 pips (which can happen in minutes during news) closes this account's trade with most of the money gone. Now change `lots` to `0.01` and run it again: the same 30 pips costs $3.

## Spread, commission and swap: the costs

| Cost | What it is | Example |
|---|---|---|
| **Spread** | Difference between bid and ask, paid when you open | 1.2 pips on 0.10 lots EUR/USD ≈ $1.20 |
| **Commission** | Fixed fee per lot on some accounts (ECN/raw spread) | e.g. a few dollars per standard lot per side |
| **Swap / rollover** | Interest paid or charged for holding a position overnight, based on the interest-rate difference between the two currencies | Can be positive or negative; often tripled on one weekday to cover the weekend |

Islamic (swap-free) accounts exist for clients who can't pay or receive interest; check how the broker replaces swap (sometimes with a fee).

Costs look small per trade, but frequent trading adds up. A strategy that makes 3 pips per trade on average can be destroyed by a 1.5-pip spread plus commission.

## Calculator 3: what costs do to frequent trading

```try-python
trades_per_month = 60
avg_gross_pips = 2.5        # average result per trade BEFORE costs (optimistic)
spread_pips = 1.2
commission_pips = 0.7       # commission expressed in pips
lots = 0.10
pip_value = 1.0             # USD per pip for 0.10 lots EUR/USD

net_pips = avg_gross_pips - spread_pips - commission_pips
print(f"Net per trade: {net_pips:.1f} pips")
print(f"Monthly gross: {trades_per_month * avg_gross_pips * pip_value:,.2f} USD")
print(f"Monthly costs: {trades_per_month * (spread_pips + commission_pips) * pip_value:,.2f} USD")
print(f"Monthly net:   {trades_per_month * net_pips * pip_value:,.2f} USD")
```

## Accounts in KES vs USD

Some Kenyan brokers offer accounts in KES as well as USD. If your account currency differs from the pair's quote currency, profits are converted, and exchange-rate changes and conversion fees affect your balance. Know your account currency and how deposits and withdrawals are converted.

## Summary

- A pip is 0.0001 on most pairs and 0.01 on JPY pairs; check what your platform calls "points".
- 1.00 lot = 100,000 units ≈ $10/pip on EUR/USD; 0.01 lot ≈ $0.10/pip. Beginners use micro lots.
- Leverage lets you open bigger positions with less margin; it magnifies losses and can trigger a stop out quickly.
- Equity, free margin and margin level tell you how close you are to a stop out.
- Spreads, commissions and swaps are real costs; they can turn a small edge into a loss.

```quiz
Q: EUR/USD moves from 1.0850 to 1.0890. How many pips is that?
A: 40
Q: USD/JPY moves from 150.20 to 150.70. How many pips?
A: 50
Q: Roughly how much is one pip worth on 0.01 lots of EUR/USD, in US dollars?
A: 0.10 | 0.1 | $0.10 | 10 cents
Q: Does leverage change the value of a pip for the same position size? (yes or no)
A: no
Q: What happens when your margin level drops to the broker's lowest threshold? (two words)
A: stop out | stopout | stop-out
```
