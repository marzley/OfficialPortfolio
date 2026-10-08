---
slug: orders-and-trade-mechanics
title: "Orders and how a trade works: market, limit and stop orders, stop loss, take profit and slippage"
after: brokers-platforms-kenya
---
# Orders and how a trade works

Knowing **how** to enter and exit is as important as knowing **when**. This lesson covers every order type you'll use, how stop losses actually work, and the hidden mechanics (spread, slippage, gaps) that surprise beginners. Practise everything here on a **demo account** until it's automatic.

## The life of a trade

```text
Plan → Calculate size → Place entry order → Attach stop loss & take profit → Manage → Exit → Journal
```

Every step has a rule in your trading plan ([building a trading plan](./?track=forex&lesson=trading-plan-strategies)). A trade without a predefined exit is a hope, not a trade.

## Entry orders

| Order | What it does | Use |
|---|---|---|
| **Market order** | Buy or sell **now** at the best available price | You want in immediately |
| **Buy limit** | Buy **below** the current price, if price falls to your level | Buying a pullback to support |
| **Sell limit** | Sell **above** the current price, if price rises to your level | Selling a rally into resistance |
| **Buy stop** | Buy **above** the current price, if price rises to your level | Buying a breakout above resistance |
| **Sell stop** | Sell **below** the current price, if price falls to your level | Selling a breakdown below support |
| **Stop limit** (some platforms) | A stop that becomes a limit order once triggered | Controls the worst fill price, but may not fill |

Memory aid: **limit = better price than now** (buy cheaper, sell higher). **Stop = worse price than now, in the direction of momentum** (buy higher, sell lower).

Pending orders can have an **expiry** (e.g. end of day), so old orders don't trigger unexpectedly.

## Exit orders

### Stop loss (SL)

A stop loss closes your trade automatically at a set price to **limit your loss**.

- Place it where your trade idea is **proven wrong** (e.g. beyond the support level you bought at), not just "20 pips because that's what I always use".
- Then calculate position size so that, if the stop is hit, you lose no more than your planned risk (e.g. 1% of the account). See [position sizing](./?track=forex&lesson=risk-management-position-sizing).
- Set it **when you open the trade**, not "later".
- Moving a stop loss **further away** to avoid a loss is one of the most destructive habits in trading.

### Take profit (TP)

A take profit closes the trade at a target price to **lock in profit**. Common approaches: at the next key level (support/resistance), at a fixed reward-to-risk multiple (e.g. 2× the stop distance), or partially (close half at the first target, let the rest run).

### Trailing stop

A stop that follows price as the trade moves in your favour (e.g. stays 30 pips behind the best price). It locks in profit in strong trends but can close trades early in choppy markets. On MT4/MT5, trailing stops usually work only while the platform is running; check your platform.

### Break-even stop

Moving the stop to the entry price after the trade moves a certain amount in your favour. It removes the risk of loss on that trade, but moving it too early often gets you stopped out just before the real move.

## Which price triggers what? (Bid and ask)

Charts usually show the **bid** price. Remember:
- **Buy** orders open at the **ask** and close at the **bid**.
- **Sell** orders open at the **bid** and close at the **ask**.

So a **sell** trade's stop loss is triggered when the **ask** reaches your stop. When spreads widen (news, rollover at about midnight server time, quiet hours), a sell stop can be hit even though the chart (bid) never touched it. Leave room for the spread, especially around news and the daily rollover.

## Slippage

**Slippage** is the difference between the price you asked for and the price you got. It happens when price moves fast or liquidity is thin:
- During major news (e.g. US jobs data, central bank decisions)
- At market open on Monday
- On exotic pairs

Stop loss orders normally become market orders when triggered, so they can be filled **worse** than your stop price in a fast market. Limit orders don't slip against you, but may not fill at all.

## Gaps

A **gap** is when price jumps from one level to another with no trading in between: most often over the weekend, or after a shock. If price gaps past your stop loss, you're closed at the next available price, which can mean a much bigger loss than planned. That's why:
- many traders reduce or close positions before weekends and major scheduled events;
- **negative balance protection** (offered by many regulated brokers) matters.

## Partial closes and scaling

- **Partial close:** close part of the position (e.g. 0.05 of 0.10 lots) at a first target.
- **Scaling in:** adding to a winning position under strict rules (and with the total risk still controlled).
- **Averaging down** (adding to a **losing** position hoping it comes back) is how many accounts are destroyed. Avoid it unless it's a tested part of a professional plan with fixed total risk, which is rare for retail traders.

## Hedging and netting

Some platforms let you hold a buy and a sell on the same pair at the same time ("hedging" accounts); others combine them into one net position ("netting"). Opening an opposite trade to "lock" a loss doesn't remove it; it just delays the decision and adds costs.

## A practice routine on demo (do this for a week)

1. Open a 0.01 lot **market** buy on EUR/USD; add a stop loss and take profit; close it manually.
2. Place a **buy limit** 15 pips below the price and a **sell limit** 15 pips above; set expiry to end of day.
3. Place a **buy stop** above a recent high and a **sell stop** below a recent low.
4. Modify a stop loss and take profit by dragging them on the chart, then by typing exact prices.
5. Partially close a position.
6. Find your trade history and export it.
7. Watch spreads around a news release on the economic calendar (don't trade it; just observe).

## Common mistakes

- Wrong lot size (1.00 instead of 0.01): always double-check before clicking.
- Buy stop vs buy limit confusion: say out loud "I want to buy if price goes **up to**…" (stop) or "**down to**…" (limit).
- No stop loss ("I'll watch it"), then the phone dies or the internet goes off.
- Stops too tight inside normal price "noise", or right on round numbers where many stops cluster.
- Forgetting open pending orders, which trigger days later.

## Summary

- Market orders enter now; limit orders enter at a better price; stop orders enter in the direction of momentum.
- Set the stop loss where the idea is wrong, at the time of entry, and never move it further away.
- Buys open at the ask and close at the bid; sells open at the bid and close at the ask; spreads can trigger stops.
- Slippage and gaps can make losses bigger than planned, especially around news and weekends.
- Practise every order type on demo before using real money.

```quiz
Q: You want to buy only if price FALLS to support. Which order type? (two words)
A: buy limit
Q: You want to buy only if price BREAKS ABOVE resistance. Which order type? (two words)
A: buy stop
Q: A sell trade closes at which price: bid or ask?
A: ask
Q: What is the difference between the requested price and the filled price called?
A: slippage
Q: Should you move your stop loss further away to avoid taking a loss? (yes or no)
A: no
```
