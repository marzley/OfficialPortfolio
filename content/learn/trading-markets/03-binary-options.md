---
slug: binary-options
title: "Option 2: Binary options: how they work, the maths, regulation and why most people lose"
after: forex-overview
---
# Option 2: Binary options

Binary options are heavily advertised on social media in Kenya, often with "earn KSh 10,000 a day in 60 seconds" videos. This lesson explains exactly how they work, shows the maths behind the payouts, and why many regulators have banned them for ordinary people.

## 1. What it is

A **binary option** is a yes/no bet on a price: *"Will EUR/USD be higher than 1.0850 in 5 minutes?"* If you're right, you receive a fixed payout (for example 80–90% of your stake). If you're wrong, you lose **100%** of your stake. There's no in-between, hence "binary".

Common types:
- **Up/Down (Call/Put, Higher/Lower):** above or below the current price at expiry.
- **Touch/No touch:** whether price touches a level before expiry.
- **Range (In/Out):** whether price stays inside or leaves a range.
- **Digits** and similar products on some platforms: bets on the last digit of a price.

Expiry times can be as short as **seconds or minutes**.

## 2. How it works: example

You stake **KSh 1,000** on "EUR/USD higher in 5 minutes". The platform offers an **85% payout**.
- Right → you get your KSh 1,000 back + KSh 850 profit.
- Wrong → you lose KSh 1,000.

You win 85% of your stake when right but lose 100% when wrong. That imbalance is the platform's built-in edge.

## 3. The maths: why the odds are against you

```try-python
def breakeven_win_rate(payout):
    # win payout*stake, lose 1*stake: break even when p*payout = (1-p)*1
    return 1 / (1 + payout)

def expected_value(win_rate, payout, stake=1000):
    return stake * (win_rate * payout - (1 - win_rate))

for payout in (0.95, 0.90, 0.85, 0.80, 0.70):
    print(f"Payout {payout:.0%}: you must win {breakeven_win_rate(payout):.1%} of trades just to break even")

print()
# On very short expiries, direction is close to a coin flip for most people
for wr in (0.50, 0.53, 0.55):
    ev = expected_value(wr, 0.85)
    print(f"Win rate {wr:.0%} at 85% payout: expected result per KSh 1,000 bet = KSh {ev:+.0f}")

# 100 trades of KSh 1,000 at a coin-flip win rate
print(f"\n100 trades at 50% win rate and 85% payout: about KSh {100 * expected_value(0.50, 0.85):+,.0f}")
```

At an 85% payout you need to win **more than 54%** of your trades just to break even. On expiries of seconds or minutes, price moves are close to random for nearly everyone, so the average result is a steady loss: about **−KSh 75 per KSh 1,000 bet** at a 50% win rate. Over hundreds of trades, that adds up to large losses. This is the same structure as a casino game.

## 4. Costs

The cost is hidden in the payout: you receive less than you risk. There may also be deposit/withdrawal fees and conversion costs.

## 5. Risk level: very high

- You can lose 100% of every stake, very quickly and repeatedly.
- Very short expiries encourage rapid, emotional, repeated betting, the classic gambling pattern.
- With many binary platforms, the platform is your counterparty: it profits when you lose.
- Many binary "brokers" have been outright frauds that manipulated prices or refused withdrawals.

## 6. Regulation

- **European Union:** the European Securities and Markets Authority (ESMA) prohibited selling binary options to retail clients from 2018.
- **United Kingdom:** the Financial Conduct Authority (FCA) permanently banned selling them to retail consumers in 2019.
- **Australia** and several other countries have also banned or heavily restricted them.
- **United States:** legal only on a few regulated exchanges, with strict rules; many offshore sites operate illegally.
- **Kenya:** binary options are not a product offered under CMA online forex licences. Platforms promoting binary options to Kenyans are typically offshore and unregulated locally, so you have little protection. Check the CMA website and its investor alerts.

When major regulators ban a product for ordinary people, it's because evidence showed most users lose money and fraud was widespread.

## 7. Who it may suit / who should avoid it

- **Avoid:** almost everyone, especially beginners, anyone using essential or borrowed money, and anyone who notices gambling-like urges ([trading psychology](./?track=forex&lesson=trading-psychology)).
- If you're curious, study the maths above, and treat any money spent as entertainment you expect to lose, like betting.

## 8. Red flags and scams

- "Earn KSh X daily", "strategy with 90% accuracy", "never lose" bots or signals
- "Account managers" who trade binary options for you
- Platforms you found through a WhatsApp/Telegram/TikTok promoter paid per sign-up
- Bonuses that lock your deposit until you've traded many times
- Withdrawal delays or demands for "verification fees"

## 9. Verdict

Binary options are, for nearly all retail users, a **negative expected value** product: you win less than you lose, on outcomes that are close to random over short times. They're banned for retail clients in many countries for this reason. If you want to learn markets, study forex or long-term investing properly; if you want income, build skills. Don't let "60-second" videos convince you otherwise.

```quiz
Q: In a binary option, how much of your stake do you lose if you're wrong? (percent)
A: 100 | 100% | all | all of it
Q: At an 85% payout, what win rate do you need just to break even? Write the whole-number percent.
A: 54 | 54% | 54.1 | 54.1%
Q: Which EU authority prohibited selling binary options to retail clients in 2018? (abbreviation)
A: ESMA
Q: Is the expected value of short-expiry binary options positive or negative for most retail users?
A: negative
```
