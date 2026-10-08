---
slug: trading-plan-strategies
title: "Building a trading plan and strategy: written rules, example strategy types and when not to trade"
after: risk-management-position-sizing
---
# Building a trading plan and strategy

A **trading plan** is a written document that decides, in advance, what you trade, when, how you enter and exit, how much you risk, and what you do when things go wrong. Without one, every decision is made in the moment, under emotion, and you can't learn from results because you never did the same thing twice.

:::note Examples, not recommendations
The strategy types below are explained so you understand how rule-based strategies are built. They are not recommendations and come with no promise of profit. Any strategy must be tested by you on historical data and demo before risking money.
:::

## The parts of a trading plan

| Section | Questions to answer |
|---|---|
| **1. Goals and limits** | Why am I trading? What money can I afford to lose completely? How much time per day/week? |
| **2. Markets** | Which pairs (start with 1–3 majors)? Why those? |
| **3. Timeframes and sessions** | Which charts (e.g. daily for direction, H1 for entries)? Which hours (e.g. London session only)? |
| **4. Setup** | What exact conditions must be present before I consider a trade? |
| **5. Entry trigger** | What exactly makes me enter (an order type and condition)? |
| **6. Stop loss** | Where exactly, and why? |
| **7. Take profit / exit** | Fixed target, level-based, trailing, partial? Time-based exit? |
| **8. Position sizing** | Risk % per trade, maximum open risk, correlation rules |
| **9. Trade management** | When (if ever) do I move to break-even or trail the stop? |
| **10. No-trade rules** | News, spreads, emotions, daily loss limit reached… |
| **11. Routine** | Pre-market preparation, during-session rules, end-of-day review |
| **12. Review** | Journal fields, weekly and monthly review process, criteria to change the plan |

Write it in plain language, short enough to read before every session (one or two pages).

## Rules must be specific

| Vague (useless) | Specific (testable) |
|---|---|
| "Buy when the trend is up" | "Daily close above the 200 SMA and the last swing low is higher than the previous one" |
| "Enter at support" | "Buy limit at the top of a daily support zone marked before the session" |
| "Use a tight stop" | "Stop 5 pips beyond the zone, or 1.2 × ATR(14) H1, whichever is larger" |
| "Take profit when it looks good" | "Close half at 1.5R, move the stop to break-even, close the rest at the next H4 resistance" |

If two people reading your rules would take different trades, the rules aren't specific enough.

## Common strategy types (how they work)

### 1. Trend-following pullback

**Idea:** in a trend, enter after a temporary pullback, in the direction of the trend.
- **Setup:** higher timeframe uptrend (higher highs/lows, price above a rising moving average).
- **Entry:** price pulls back to support or a moving average; enter on a sign of rejection (e.g. bullish engulfing on the entry timeframe).
- **Stop:** below the pullback low.
- **Target:** previous high, or a fixed R multiple.
- **Weakness:** in ranges and trend reversals, pullbacks keep failing.

### 2. Breakout

**Idea:** when price escapes a range or consolidation, it may continue strongly.
- **Setup:** a clear range or triangle; volatility contracting (narrow Bollinger Bands, small candles).
- **Entry:** a candle close beyond the range, or a stop order beyond it, or the retest of the broken level.
- **Stop:** back inside the range.
- **Target:** e.g. the height of the range projected from the breakout.
- **Weakness:** many false breakouts; usually a lower win rate with bigger winners.

### 3. Range trading (mean reversion)

**Idea:** in sideways markets, buy near the bottom of the range and sell near the top.
- **Setup:** flat moving averages; at least two clear touches of range highs and lows.
- **Entry:** rejection signals at the range edges.
- **Stop:** beyond the range edge.
- **Target:** the middle or opposite edge.
- **Weakness:** when the range breaks, losses come quickly; works poorly in trends.

### 4. Swing vs day trading vs scalping

| Style | Holding time | Notes for beginners |
|---|---|---|
| **Swing trading** | Days to weeks | Fewer decisions, less screen time, works with jobs/studies; overnight swaps and weekend gaps apply |
| **Day trading** | Minutes to hours, closed by the end of the day | Needs focused session time; costs matter more |
| **Scalping** | Seconds to minutes | Very cost-sensitive and stressful; not recommended for beginners |

Many people with full-time jobs or studies find **swing trading on higher timeframes** more realistic.

## No-trade rules (often the most valuable part)

Don't trade when:
- high-impact news on either currency is due within your no-trade window (e.g. 30 minutes before to 30 minutes after);
- spreads are unusually wide (market open, rollover, holidays);
- you've hit your daily loss limit or had 2–3 losses in a row;
- you're tired, angry, rushed, ill, or trying to "win back" money;
- the setup is "almost" there; almost isn't a setup;
- it's Friday evening and you'd be holding over the weekend without a plan for gaps.

## Daily routine example

**Before the session (20 min)**
1. Read the plan.
2. Check the economic calendar.
3. Mark key levels and trend on your pairs; write down possible setups and invalidation points.
4. Check your mood and your loss limits.

**During the session**
- Only act on setups you wrote down; set orders with stops and targets; then step away from the screen rather than watching every tick.

**After the session (15 min)**
- Journal every trade (and every setup you skipped, and why).
- Note one lesson.

## When should you change the plan?

Not after one loss, or even five. Change it based on **data**: after a meaningful sample of trades (e.g. 50–100) in your journal or backtest shows a rule is hurting results. Change **one thing at a time**, then test again. Constantly switching strategies after each losing streak ("strategy hopping") is one of the biggest reasons beginners never improve.

## Summary

- A written plan covers markets, timeframes, setup, entry, stop, exit, sizing, management, no-trade rules, routine and review.
- Rules must be specific enough that anyone would take the same trades.
- Trend pullbacks, breakouts and range trading each work in some conditions and fail in others.
- No-trade rules protect you; change the plan only based on enough data, one thing at a time.

```quiz
Q: In a trend-following pullback strategy, do you trade with or against the higher-timeframe trend?
A: with | with the trend
Q: Which strategy type buys near the bottom of a sideways market and sells near the top? (two words)
A: range trading | mean reversion
Q: Which trading style is usually most realistic for people with full-time jobs? (one word)
A: swing | swing trading
Q: Constantly switching strategies after each losing streak is called strategy ___ (one word)
A: hopping
```
