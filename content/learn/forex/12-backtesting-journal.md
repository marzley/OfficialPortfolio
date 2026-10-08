---
slug: backtesting-journaling
title: "Backtesting, demo trading and journaling: proving a strategy before risking money"
after: trading-plan-strategies
---
# Backtesting, demo trading and journaling

How do you know if your trading plan has an edge, or if it just *feels* like it works? You test it, record everything, and measure. This lesson turns your plan into evidence.

## The testing ladder

```text
1. Backtest (history)  →  2. Forward test on demo  →  3. Tiny live account  →  4. Gradual scaling
   100+ trades             2–3 months, 50+ trades     only money you can lose    only with evidence
```

Each step must meet criteria **you write down in advance** before you move to the next.

## Step 1: Backtesting

**Backtesting** means applying your exact rules to past price data and recording the trades that *would* have happened.

### Manual backtesting (best for learning)

1. Open a chart (TradingView's free **Bar Replay** feature, or scroll back on your platform).
2. Hide the future: replay candles one by one, so you don't see what happens next.
3. Every time your setup appears, record the entry, stop, target, and result **exactly as your rules say**: no "I wouldn't have taken that one".
4. Do at least **100 trades**, across different market conditions (trends, ranges, high and low volatility periods). Fewer than that, and luck dominates.

### Automated backtesting

Coders can test rules automatically (Python, MT5 Strategy Tester, TradingView Pine Script). It's faster, but beware:
- **Overfitting / curve fitting:** tuning settings until the past looks perfect. Test on data you didn't use to design the rules (**out-of-sample**).
- **Unrealistic fills:** include spread, commission, slippage and swaps.
- **Look-ahead bias:** accidentally using information that wasn't available at the time (e.g. a daily close before the day ended).

## Step 2: Forward testing on demo

Trade your plan live on a **demo account** for 2–3 months (at least 50 trades), with the same position sizes and rules you'd use with real money. Demo isn't the same as live (no fear of loss, sometimes better fills), but it tests whether you can **execute** the plan in real time and whether the edge survives current market conditions.

## Step 3: Keep a trading journal

Your journal is your most valuable trading tool. A spreadsheet (Excel or Google Sheets) is perfect ([Excel basics](./?track=excel&lesson=basics)).

| Column | Example |
|---|---|
| Date & time (EAT) | 2026-10-08 11:40 |
| Pair | EURUSD |
| Direction | Buy |
| Setup type | Trend pullback |
| Timeframes | D1 trend / H1 entry |
| Entry, stop, target | 1.0812 / 1.0782 / 1.0872 |
| Risk % and lots | 1% / 0.33 |
| Planned R:R | 2.0 |
| Exit price and reason | 1.0872 target hit |
| Result (R and money) | +2.0R / +$99 |
| Followed the plan? | Yes / No (what was broken?) |
| Emotion before/during | Calm / impatient / fearful |
| Screenshot links | before entry & after exit |
| Lesson | Waited for close; good patience |

Also record **setups you skipped** and why. Over time, the journal shows your real behaviour, not the trader you imagine yourself to be.

## Step 4: Measure the right statistics

```try-python
# Results in R (multiples of risk) from a journal or backtest, e.g. +2 = won twice the risk, -1 = full loss
results = [2, -1, -1, 2, 1.5, -1, 2, -1, -1, -1, 2.5, -1, 2, -1, 1, -1, 2, -1, -1, 2,
           -1, 2, -1, -0.5, 2, -1, -1, 2, 1.8, -1]

wins = [r for r in results if r > 0]
losses = [r for r in results if r <= 0]
win_rate = len(wins) / len(results)
avg_win = sum(wins) / len(wins)
avg_loss = -sum(losses) / len(losses)
expectancy = sum(results) / len(results)
profit_factor = sum(wins) / -sum(losses)

# Maximum drawdown in R and the longest losing streak
equity, peak, max_dd, streak, worst_streak = 0, 0, 0, 0, 0
for r in results:
    equity += r
    peak = max(peak, equity)
    max_dd = max(max_dd, peak - equity)
    streak = streak + 1 if r <= 0 else 0
    worst_streak = max(worst_streak, streak)

print(f"Trades: {len(results)}  Win rate: {win_rate:.0%}")
print(f"Average win: {avg_win:.2f}R  Average loss: {avg_loss:.2f}R")
print(f"Expectancy: {expectancy:+.2f}R per trade  Profit factor: {profit_factor:.2f}")
print(f"Total: {equity:+.1f}R  Max drawdown: {max_dd:.1f}R  Longest losing streak: {worst_streak}")
```

What they mean:
- **Expectancy** (average R per trade, after costs) must be positive.
- **Profit factor** = gross wins ÷ gross losses; above 1 is profitable, and higher is more robust.
- **Maximum drawdown** tells you the pain to expect; at 1% risk, a 10R drawdown ≈ 10% of the account.
- **Longest losing streak** prepares you mentally: if backtests show 7 losses in a row, expect it live.

Thirty trades (like the sample above) are still too few to be confident. Aim for 100+.

## Step 5: Criteria to go live (write yours in advance)

Example criteria:
- 100+ backtested trades with positive expectancy after costs;
- 50+ demo trades over at least 2 months, following the plan in at least 90% of trades;
- demo expectancy positive and maximum drawdown within what you can tolerate;
- an emergency fund in place and live capital that you can lose completely.

If you don't meet them, keep testing and improving. There's no deadline.

## Step 6: Tiny live account

- Start with the **smallest possible size** (micro or cent account), even if you're "sure".
- Expect results to be worse than demo at first (emotions, real slippage).
- Keep journaling. Compare live statistics with demo and backtest.
- Increase size **slowly** (e.g. after every 50 trades that meet your criteria), never after a lucky streak, and never to "win back" losses.

## Weekly and monthly reviews

**Weekly (30 min):** plan adherence %, mistakes (which rule broke, and why), best and worst trade, one improvement.
**Monthly (1 hour):** statistics vs expectations, which setups work best, whether market conditions changed, whether any rule should be tested for change.

## Summary

- Test in steps: backtest 100+ trades → demo 50+ trades → tiny live → slow scaling, with written criteria for each step.
- Avoid overfitting, unrealistic costs and look-ahead bias in backtests.
- Journal every trade (and skipped setups) with reasons, emotions and screenshots.
- Measure expectancy, profit factor, drawdown and losing streaks; increase risk only with evidence.

```quiz
Q: What TradingView feature replays past candles one by one? (two words)
A: Bar Replay | bar replay
Q: Roughly how many backtested trades should you collect before trusting results?
A: 100 | 100+ | one hundred
Q: Profit factor equals gross wins divided by gross ___ (one word)
A: losses
Q: Using information that wasn't available at the time in a backtest is called what bias? (two words, or one hyphenated)
A: look-ahead | look ahead | lookahead
```
