---
slug: risk-management-position-sizing
title: "Risk management and position sizing: the 1% rule, reward-to-risk, expectancy and drawdowns"
after: forex-indicators
---
# Risk management and position sizing

This is the most important lesson in the subject. Traders with average analysis and excellent risk management can survive long enough to improve. Traders with brilliant analysis and poor risk management eventually lose everything, often in one bad week. Every professional trading desk is built around risk control first.

## Rule 1: Risk a small, fixed percentage per trade

Decide the **maximum money you'll lose if your stop loss is hit**, as a percentage of your account. Common guidance: **0.5–1% per trade**, never more than 2%.

Why so small? Because losing streaks are normal. Even a decent strategy can lose 8–10 trades in a row. Look at what a losing streak does:

```try-python
for risk in (0.01, 0.02, 0.05, 0.10):
    balance = 100.0
    for _ in range(10):            # ten losses in a row
        balance *= (1 - risk)
    print(f"Risking {risk:.0%} per trade: after 10 losses you have {balance:.1f}% of your account left")
```

At 1%, ten losses leave about 90% of the account. At 10%, they leave about 35%, and you'd need to almost **triple** the remainder just to get back to the start.

## The recovery problem

```try-python
for loss in (10, 20, 30, 50, 75, 90):
    needed = loss / (100 - loss) * 100
    print(f"Lose {loss}% -> you need +{needed:.0f}% to get back to break-even")
```

A 50% loss needs a 100% gain to recover. That's why protecting capital matters more than chasing big wins.

## Rule 2: Size every position from your stop

Never pick a lot size first. Work it out from:
1. **Account size** and **risk %** → money at risk.
2. **Stop distance** in pips (from your analysis: where the idea is wrong).
3. **Pip value** per lot.

> **Lots = (Account × Risk%) ÷ (Stop in pips × Pip value per 1.00 lot)**

```try-python
def position_size(account, risk_pct, stop_pips, pip_value_per_lot=10.0):
    risk_money = account * risk_pct / 100
    lots = risk_money / (stop_pips * pip_value_per_lot)
    return risk_money, lots

for account, risk, stop in [(500, 1, 25), (500, 1, 60), (2000, 0.5, 40), (100, 1, 30)]:
    money, lots = position_size(account, risk, stop)
    print(f"Account ${account}, risk {risk}% (${money:.2f}), stop {stop} pips -> {lots:.3f} lots (round DOWN to {int(lots*100)/100:.2f})")
```

Notice the last example: a $100 account risking 1% with a 30-pip stop needs about 0.003 lots, smaller than most brokers' minimum 0.01. That tells you something important: the account is too small for that stop with proper risk control. Use a cent/micro account, a smaller stop that still makes sense, or keep practising on demo until you have a larger amount you can genuinely afford to risk.

(EUR/USD and other XXX/USD pairs: about $10 per pip per 1.00 lot. For other pairs, use the pip value calculator in [pips, lots, leverage and margin](./?track=forex&lesson=pips-lots-leverage-margin).)

## Rule 3: Reward-to-risk and win rate work together

**Reward-to-risk (R:R)** compares the potential profit to the potential loss. If you risk 30 pips to make 60, that's **1:2** (or "2R").

Your **win rate** needed to break even depends on R:R:

| Reward : Risk | Break-even win rate (before costs) |
|---|---|
| 1 : 1 | 50% |
| 1.5 : 1 | 40% |
| 2 : 1 | 33% |
| 3 : 1 | 25% |

A high R:R isn't automatically better: bigger targets are hit less often. What matters is the combination.

## Expectancy: does your method make money on average?

> **Expectancy (in R) = Win rate × Average win (R) − Loss rate × Average loss (R)**

```try-python
def expectancy(win_rate, avg_win_r, avg_loss_r=1.0):
    return win_rate * avg_win_r - (1 - win_rate) * avg_loss_r

for wr, aw in [(0.55, 1.0), (0.40, 2.0), (0.30, 2.0), (0.35, 2.5), (0.70, 0.4)]:
    e = expectancy(wr, aw)
    verdict = "positive" if e > 0 else "negative"
    print(f"Win rate {wr:.0%}, average win {aw}R -> expectancy {e:+.2f}R per trade ({verdict})")
```

The last case is common among beginners: winning 70% of trades by taking small profits quickly, but letting losers run to the full stop. The result is negative. Expectancy is measured from **your journal**, over many trades, after costs.

## Rule 4: Limit total exposure

- **Daily loss limit:** stop trading for the day after e.g. 2–3% total loss (or 2–3 losing trades).
- **Weekly/monthly limit:** pause and review after e.g. 6% or 10% drawdown.
- **Correlated trades:** buying EUR/USD, GBP/USD and AUD/USD at the same time is mostly **one** bet against the US dollar. Three 1% trades = about 3% risk on the same idea. Count them together.
- **Maximum open risk:** e.g. never more than 3% of the account at risk across all open trades.

## Rule 5: Respect leverage and margin

Use leverage to allow correct position sizes, not to maximise them. If you size positions properly from your stop, your **effective leverage** usually stays modest, and you'll rarely get anywhere near a margin call.

## Drawdown: expect it, plan for it

**Drawdown** is the fall from an account's peak to a later low. Every trader has them. Plan in advance:

| Drawdown from peak | Action (example) |
|---|---|
| 5% | Review recent trades: am I following the plan? |
| 10% | Halve risk per trade until a new equity high |
| 15–20% | Stop live trading; go back to demo and review the strategy |

## A risk checklist before every trade

- Is the stop where the idea is proven wrong, beyond normal noise?
- Is the position size calculated from risk %, not chosen by feel?
- Does the target give an acceptable reward-to-risk?
- Is total open risk (including correlated trades) within my limit?
- Any high-impact news before the trade has time to work?
- Am I within my daily loss limit and in a calm state of mind?

## Summary

- Risk 0.5–1% per trade; losing streaks are normal and large losses are hard to recover.
- Calculate lot size from account, risk % and stop distance, never the other way round.
- Reward-to-risk and win rate together decide expectancy; measure it from your journal.
- Set daily and drawdown limits, count correlated trades together, and use leverage only for correct sizing.

```quiz
Q: You lose 50% of your account. What percentage gain do you need to get back to break-even?
A: 100 | 100% | one hundred
Q: Account $1000, risk 1%, stop 20 pips on EUR/USD ($10 per pip per lot). How many lots? (two decimals)
A: 0.50 | 0.5
Q: With a 2:1 reward-to-risk, what win rate breaks even before costs? (whole percent)
A: 33 | 33% | 33.3 | 33.3%
Q: Buying EUR/USD and GBP/USD at once is mostly one bet against which currency? (code)
A: USD | US dollar | dollar
```
