---
slug: forex-indicators
title: "Indicators explained: moving averages, RSI, MACD, Bollinger Bands and ATR (and how they mislead)"
after: support-resistance-trends
---
# Indicators explained: moving averages, RSI, MACD, Bollinger Bands and ATR

**Indicators** are calculations based on price (and sometimes volume) drawn on or under the chart. They don't know the future; they **summarise the past** in a different way. Used well, they help you measure trend, momentum and volatility. Used badly (ten indicators on one chart, each "confirming" the other), they create confusion and false confidence.

This lesson explains what the main indicators actually calculate. You'll even compute two yourself.

## Two families

| Family | Examples | Measures | Weakness |
|---|---|---|---|
| **Trend-following (lagging)** | Moving averages, MACD | Direction and strength of trend | Late signals; whipsaws in ranges |
| **Oscillators (momentum)** | RSI, Stochastic | Speed of recent moves, "overbought/oversold" | Stay "overbought" for a long time in strong trends |
| **Volatility** | ATR, Bollinger Bands | How much price is moving | Don't tell direction |

## Moving averages (MA)

A moving average is the **average closing price** of the last N candles, recalculated each candle.

- **SMA** (simple): every candle counts equally.
- **EMA** (exponential): recent candles count more, so it reacts faster.

Common uses:
- **Trend filter:** price above a rising 200-day MA → longer-term uptrend context; below a falling one → downtrend context.
- **Dynamic support/resistance:** in trends, price often pulls back towards the 20 or 50 EMA.
- **Crossovers:** a faster MA crossing a slower one (e.g. 50 crossing 200, the "golden cross"). Crossovers are late and produce many false signals in ranges.

## RSI (Relative Strength Index)

RSI compares the size of recent up-moves with recent down-moves on a scale of 0–100 (usually over 14 candles).
- Above **70**: "overbought": price rose strongly and quickly.
- Below **30**: "oversold".
- **Overbought doesn't mean "sell now".** In strong uptrends, RSI can stay above 70 for a long time.
- **Divergence:** price makes a higher high but RSI makes a lower high, a hint that momentum is fading. Divergences can persist for a long time before (or without) a reversal.

## Calculate a moving average and RSI yourself

```try-python
closes = [1.0800, 1.0812, 1.0825, 1.0819, 1.0840, 1.0856, 1.0849, 1.0870, 1.0888, 1.0881,
          1.0902, 1.0915, 1.0909, 1.0930, 1.0948, 1.0941, 1.0925, 1.0910, 1.0918, 1.0897]

def sma(values, n):
    return [None if i + 1 < n else sum(values[i + 1 - n:i + 1]) / n for i in range(len(values))]

def rsi(values, n=14):
    gains, losses = [], []
    for prev, cur in zip(values, values[1:]):
        change = cur - prev
        gains.append(max(change, 0))
        losses.append(max(-change, 0))
    out = [None] * n
    avg_gain = sum(gains[:n]) / n
    avg_loss = sum(losses[:n]) / n
    for i in range(n, len(gains) + 1):
        if i > n:  # Wilder's smoothing
            avg_gain = (avg_gain * (n - 1) + gains[i - 1]) / n
            avg_loss = (avg_loss * (n - 1) + losses[i - 1]) / n
        rs = avg_gain / avg_loss if avg_loss else float("inf")
        out.append(100 - 100 / (1 + rs))
    return out

ma5 = sma(closes, 5)
r = rsi(closes, 14)
for i, c in enumerate(closes):
    m = f"{ma5[i]:.4f}" if ma5[i] else "   -   "
    rv = f"{r[i]:5.1f}" if r[i] is not None else "  -  "
    print(f"candle {i+1:2}: close {c:.4f}  SMA5 {m}  RSI14 {rv}")
```

Notice: RSI was high during the steady rise, then dropped as price fell back. And the SMA always trails behind price. That's "lagging".

## MACD (Moving Average Convergence Divergence)

MACD = **12-period EMA − 26-period EMA**, plus a **signal line** (9-period EMA of MACD) and a **histogram** (MACD − signal).
- MACD above zero: the short-term average is above the long-term one (upward momentum).
- Crossovers of MACD and its signal line are momentum signals, which are late, like MA crossovers.
- Histogram shrinking: momentum slowing.

## Bollinger Bands

A 20-period SMA with bands **2 standard deviations** above and below.
- Bands **widen** when volatility rises and **narrow** ("squeeze") when it falls; squeezes often come before bigger moves (direction unknown).
- Touching the upper band is **not** automatically a sell signal; in strong trends, price "walks the band".

## ATR (Average True Range)

ATR measures the **average size** of recent candles (including gaps), in pips. It tells you nothing about direction, but it's extremely practical:
- **Stop placement:** e.g. place stops at least 1–1.5 × ATR away so normal noise doesn't hit them.
- **Position sizing:** wider stops on volatile days → smaller positions to keep the same money risk.
- **Realistic targets:** if EUR/USD's daily ATR is 60 pips, expecting 200 pips today is unrealistic.

## Volume in forex

Because forex is OTC, there's no central volume figure. Platforms show **tick volume** (number of price changes), which roughly tracks activity. Treat volume-based indicators in forex with caution.

## How to use indicators sensibly

1. **Price and levels first, indicators second.** Indicators add context to support/resistance and structure; they don't replace them.
2. **One per job:** e.g. one trend filter (200 MA), one momentum tool (RSI), one volatility tool (ATR). That's plenty.
3. **Know the settings** you use and why. Changing settings until past signals "look perfect" is called **curve fitting** and fails on new data.
4. **Test rules on history** before trusting them ([backtesting](./?track=forex&lesson=backtesting-journaling)).
5. **Beware of "holy grail" indicators** sold online, especially "non-repainting 95% accurate" tools. Many repaint (change past signals after the fact) or are curve-fitted.

## Practice tasks

- Add a 50 EMA and 200 SMA to EUR/USD daily. Where was price relative to them during the last big trend?
- Add RSI(14). Count how many times RSI went above 70 during an uptrend without price reversing.
- Add ATR(14) to the daily chart. What's the typical daily range? Use it to judge whether a 15-pip stop is realistic.

## Summary

- Indicators summarise past price: trend (MAs, MACD), momentum (RSI) and volatility (ATR, Bollinger Bands).
- They lag and mislead in the wrong market conditions; "overbought" isn't a sell signal.
- Use few indicators, each with a clear job, alongside price structure and levels.
- ATR is especially useful for stops and position sizing; test everything before trusting it.

```quiz
Q: Which moving average reacts faster to recent prices: SMA or EMA?
A: EMA | exponential
Q: An RSI reading above which number is usually called overbought?
A: 70
Q: Which indicator measures volatility in pips and is useful for stop placement? (three letters)
A: ATR | average true range
Q: Adjusting indicator settings until past results look perfect is called what? (two words)
A: curve fitting | overfitting | over-fitting
```
