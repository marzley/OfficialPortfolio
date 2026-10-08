---
slug: charts-candlesticks
title: "Charts and candlesticks: timeframes, reading candles and common patterns (and their limits)"
after: fundamental-analysis
---
# Charts and candlesticks: timeframes, reading candles and common patterns

**Technical analysis** studies price charts to find areas where buying or selling pressure has shown up before, and to plan trades with clear entries, stops and targets. It doesn't predict the future; it helps you organise probabilities and risk. This lesson starts with the basics: chart types, timeframes and candlesticks.

## Chart types

| Type | Shows | Use |
|---|---|---|
| **Line chart** | A line joining closing prices | Seeing the big picture and clean trends |
| **Bar chart (OHLC)** | Open, high, low and close for each period | Detailed, less visual |
| **Candlestick chart** | OHLC as coloured "candles" | The most popular: easy to read buying vs selling pressure |

## Anatomy of a candlestick

Each candle shows one period (1 minute, 1 hour, 1 day…):

```text
        │   ← upper wick (shadow): the high
      ┌─┴─┐
      │   │ ← body: between open and close
      │   │
      └─┬─┘
        │   ← lower wick: the low
```

- **Bullish candle** (often green or white): close **above** open; price rose during the period.
- **Bearish candle** (often red or black): close **below** open; price fell.
- **Long body**: strong move in one direction.
- **Long wick**: price went there but was **rejected** (pushed back) before the close.
- **Small body with long wicks**: indecision.

## Timeframes

| Timeframe | Typical use | Trader style |
|---|---|---|
| Monthly / Weekly | Long-term trend and major levels | Position traders, investors |
| Daily (D1) | Main trend, key levels; one candle per day | Swing traders |
| 4-hour (H4) | Swings within the trend | Swing traders |
| 1-hour (H1) | Entries and trade management | Day/swing traders |
| 15-minute and below | Precise entries | Day traders, scalpers |

Beginners usually do better on **higher timeframes** (H4, daily): less noise, fewer decisions, spreads are a smaller part of each move, and you don't need to stare at screens all day. Lower timeframes are noisier, more stressful and cost-heavy.

**Multiple timeframe analysis:** look at a higher timeframe for direction and key levels (e.g. daily), then a lower one for timing (e.g. H1). Covered in [support, resistance and trends](./?track=forex&lesson=support-resistance-trends).

## Single-candle patterns

| Pattern | Look | Possible meaning (context needed) |
|---|---|---|
| **Doji** | Open ≈ close, tiny body | Indecision; may warn a move is slowing |
| **Hammer** | Small body at top, long lower wick, after a fall | Sellers pushed down, buyers pushed back: possible bullish rejection |
| **Shooting star** | Small body at bottom, long upper wick, after a rise | Possible bearish rejection |
| **Pin bar** | Long wick sticking out from surrounding candles | Rejection of a price level |
| **Marubozu** | Big body, almost no wicks | Strong one-sided pressure |

## Multi-candle patterns

| Pattern | Look | Possible meaning |
|---|---|---|
| **Bullish engulfing** | A bullish body completely covers the previous bearish body | Buyers took control, especially at support |
| **Bearish engulfing** | A bearish body covers the previous bullish body | Sellers took control, especially at resistance |
| **Inside bar** | A candle within the previous candle's range | Consolidation; a breakout may follow |
| **Morning star / evening star** | Three-candle reversal patterns | Possible bottom / top |

## Chart patterns (bigger shapes)

| Pattern | Idea |
|---|---|
| **Double top / double bottom** | Price fails twice at a level, possible reversal when the middle level breaks |
| **Head and shoulders** (and inverse) | Three peaks, the middle highest; a break of the "neckline" may signal reversal |
| **Triangles** (ascending, descending, symmetrical) | Price squeezes into a narrowing range before breaking out |
| **Flags and pennants** | Short pauses within strong moves; possible continuation |
| **Channels** | Price moves between parallel lines |

## The honest truth about patterns

- Patterns are **probabilities, not signals that always work**. Many fail.
- The same pattern means much more **at a key level** (support, resistance, trend line) than in the middle of nowhere.
- Pattern names differ between books; the underlying idea is always buyers vs sellers.
- Seeing patterns everywhere is a common beginner bias. Test any pattern-based rule on lots of past examples before trusting it ([backtesting](./?track=forex&lesson=backtesting-journaling)).

## Reading a chart step by step

1. **Zoom out** (daily/weekly): is price trending up, down or sideways?
2. **Mark key levels** where price has turned several times.
3. **Look at the last few candles** near those levels: strong rejection (long wicks), strong momentum (big bodies) or indecision (dojis)?
4. **Check the calendar** for upcoming news.
5. **Decide what would make you act**, and where you'd be wrong, *before* price gets there.

## Practice tasks

- On TradingView (free), open EUR/USD daily. Find and screenshot 5 bullish engulfing candles at clear lows and 5 in random places. What happened next in each case?
- Switch between line, bar and candlestick charts for the same month.
- Compare a 15-minute and a daily chart of the same week. Which looks noisier?

## Summary

- Candlesticks show open, high, low and close; bodies show direction and strength, wicks show rejection.
- Higher timeframes are calmer and better for beginners; use multiple timeframes together.
- Candle and chart patterns are probabilities that work better at key levels, and they need testing.

```quiz
Q: What four prices does a candlestick show? (letters, like ABCD)
A: OHLC | open high low close
Q: A long lower wick usually shows rejection of lower or higher prices?
A: lower | lower prices
Q: What is a candle with open almost equal to close called?
A: doji
Q: Which is noisier: the 15-minute chart or the daily chart?
A: 15-minute | 15 minute | the 15-minute chart | 15m
```
