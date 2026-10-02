---
slug: passwords-2fa
title: "Passwords and two-step verification: protecting your accounts properly"
after: KEEP
---
# Passwords and two-step verification: protecting your accounts properly

Your email, M-Pesa, bank, social media, school portal and eCitizen accounts hold your money, identity and reputation. Most account takeovers happen because of **weak, reused or stolen passwords**, or because someone tricked the owner into giving away a code. This unit teaches how attackers get passwords, how to create strong ones you can remember, how password managers work, and how **two-step verification (2FA)** stops most attacks even when a password leaks.

:::note What you will learn
- How passwords get stolen
- What makes a password strong (length beats complexity)
- Passphrases you can remember
- Why reusing passwords is dangerous
- Password managers and browser password saving
- Two-step verification: SMS, authenticator apps, passkeys
- Securing your phone, SIM and email (the master key)
- What to do if an account is hacked
:::

## How passwords get stolen

| Method | How it works |
|---|---|
| **Guessing** | Trying common passwords (`123456`, `password`, `qwerty`), names, birthdays, phone numbers, football teams |
| **Brute force** | Computers try millions of combinations; short passwords fall quickly |
| **Data breaches** | A website you used gets hacked; leaked emails and passwords are sold and tried on other sites |
| **Credential stuffing** | Using leaked passwords from one site to log into others (works when you reuse passwords) |
| **Phishing** | Fake login pages or messages trick you into typing your password or code |
| **Shoulder surfing** | Someone watches you type (cyber cafés, M-Pesa agents, ATMs) |
| **Malware/keyloggers** | Infected computers record what you type |
| **Social engineering** | Someone pretends to be customer care or IT support and asks for your PIN or code |

## What makes a password strong?

**Length is the most important factor.** Each extra character multiplies the number of combinations an attacker must try.

| Password | Strength |
|---|---|
| `wanjiku1990` | Weak: a name and year, easy to guess |
| `P@ssw0rd!` | Weak: a common pattern despite symbols |
| `Kq7#m` | Weak: too short |
| `mango-river-bicycle-47` | Strong: long and random words |
| `TeaAtSixWithMamaInNyeri!` | Strong: long and memorable for you |

A strong password is:
- **Long:** at least 12–16 characters (longer for email and banking).
- **Unique:** never used on another site.
- **Unpredictable:** not your name, birthday, ID number, phone number, child's name or common words like "password".

### Passphrases

A **passphrase** is several random words joined together: easy to remember, hard to crack.

- `kettle-sunset-matatu-planet`
- `Blue!Goat!Dances!Kisumu9`

Make one by picking 4 or more **unrelated** words (avoid famous quotes or song lyrics), and add a number or symbol if the site requires it.

## Never reuse passwords

If you use the same password everywhere and **one** site is breached (this happens to big companies), criminals try that email and password on Gmail, Facebook, banking apps and more. One leak becomes a disaster.

Check whether your email appears in known breaches at **haveibeenpwned.com**; if it does, change passwords for affected accounts (and anywhere you reused them).

## Password managers

How can you remember 50 unique passwords? You don't: use a **password manager**, an app that stores your passwords securely (encrypted) and fills them in for you. You remember one strong **master password**.

| Option | Notes |
|---|---|
| **Google Password Manager** (Chrome/Android) | Built in; syncs with your Google account; can warn about leaked or reused passwords |
| **iCloud Keychain** (Apple) | Built into iPhone/Mac |
| **Bitwarden** | Free, open source, works on all devices |
| **Others** (1Password, etc.) | Paid options with extra features |

Benefits: unique strong passwords everywhere, auto-fill only on the correct website (which helps protect against fake phishing sites), alerts for breached passwords.

Protect the password manager with a strong master password and 2FA. Don't save passwords in browsers on **shared** computers.

:::warning Never share these
Your **M-Pesa PIN**, **bank PIN**, **OTP codes**, and passwords. Safaricom, banks, KRA and genuine IT support will never ask for your PIN or a one-time code. Anyone who asks is a scammer.
:::

## Two-step verification (2FA)

**Two-step verification** (also called two-factor authentication, 2FA, or multi-factor authentication, MFA) requires **something extra** besides your password, so a stolen password alone isn't enough.

| Factor type | Examples |
|---|---|
| Something you **know** | Password, PIN |
| Something you **have** | Phone (SMS code or app), security key |
| Something you **are** | Fingerprint, face |

### Types of second steps

| Method | Security | Notes |
|---|---|---|
| **SMS code** | Good (much better than nothing) | Vulnerable to SIM swap fraud and phishing |
| **Authenticator app** (Google Authenticator, Microsoft Authenticator, Authy) | Better | Codes change every 30 seconds and are generated on your phone |
| **Push prompt** ("Is it you trying to sign in?") | Good | Never approve a prompt you didn't start |
| **Passkeys** | Best for many sites | Sign in with your phone's fingerprint/face/PIN; resistant to phishing; supported by Google, Microsoft, Apple and more |
| **Security keys** (USB/NFC) | Very strong | For high-risk accounts |

### Turn on 2FA now (most important accounts first)

1. **Email** (Gmail: myaccount.google.com → Security → **2-Step Verification**) because email resets every other account.
2. **WhatsApp:** Settings → Account → **Two-step verification** → set a 6-digit PIN (stops hijacking when someone gets your SMS code).
3. **Facebook/Instagram/TikTok:** Settings → Security → Two-factor authentication.
4. **Banking apps and M-Pesa app:** use app PINs/biometrics.
5. **Microsoft account, iCloud, LinkedIn, Upwork/Fiverr, freelance platforms.**

Save **backup codes** (printed or in a safe place) in case you lose your phone.

:::think Someone calls claiming to be from Safaricom, says your line will be blocked, and asks you to read out the code you just received by SMS. What's happening?
It's a scam. The code is likely a login or password-reset code for one of your accounts (WhatsApp, M-Pesa app, email) that the scammer triggered. Reading it out gives them access. Hang up, never share codes, and call the official customer care number yourself if you're worried.
:::

## Protect the master keys: phone, SIM and email

- **Phone lock:** use a PIN, pattern (not simple shapes), fingerprint or face unlock; set the screen to lock quickly.
- **SIM PIN:** a SIM lock PIN stops someone using your SIM in another phone.
- **SIM swap fraud:** criminals convince or bribe someone to move your number to their SIM, then receive your SMS codes. Warning sign: your phone suddenly shows "No service/SIM not registered" in an area with network. Contact your provider immediately from another phone.
- **Email:** strong unique password + 2FA + up-to-date recovery phone and email.
- **Find My Device** (Android) / **Find My** (iPhone) to locate, lock or erase a lost phone.

## If an account is hacked

1. **Try to recover it** through the official "Forgot password" / account recovery page.
2. **Change the password** (and anywhere you reused it), then **turn on 2FA**.
3. **Log out other sessions** (most services show active devices: sign them out).
4. **Check recovery details** (phone, email) and remove unknown ones; check email forwarding rules.
5. **Warn your contacts** that messages from your account may be scams.
6. For money accounts (M-Pesa, bank), **call the provider immediately** to block transactions.
7. Report serious cases to the police/DCI cybercrime unit, and to the platform.
8. Scan your devices for malware.

## Common mistakes

| Mistake | Fix |
|---|---|
| One password for everything | Unique passwords + a password manager |
| Birthdays, names, phone numbers | Random passphrases |
| Writing passwords on a sticky note on the screen | Password manager (or a secure place at home) |
| Sharing PINs and OTPs | Never share them with anyone |
| No 2FA on email and WhatsApp | Turn it on today |
| Approving login prompts you didn't start | Deny and change your password |
| Saving passwords on shared computers | Use private windows; never "remember" |

## Practice tasks

1. Create three passphrases using 4 random words each.
2. Check your email at haveibeenpwned.com.
3. Turn on 2-Step Verification for your email and two-step verification for WhatsApp.
4. Install or open a password manager and save your 5 most important accounts with unique passwords.
5. Set a SIM PIN and a strong phone lock, and test Find My Device.

## Summary

- Passwords are stolen by guessing, breaches, credential stuffing, phishing, shoulder surfing and malware.
- Strong passwords are **long, unique and unpredictable**; passphrases make this easy.
- Never reuse passwords; use a password manager.
- Turn on **two-step verification** everywhere, especially email and WhatsApp; prefer authenticator apps or passkeys; keep backup codes.
- Never share PINs or OTP codes; protect your phone, SIM (beware SIM swaps) and email.
- If hacked: recover, change passwords, enable 2FA, sign out other devices, warn contacts and call financial providers.

```quiz
Q: What is the most important factor in password strength?
A: length
Q: Should you use the same password on several sites? (yes or no)
A: no
Q: What does 2FA stand for? Write the full words.
A: two-factor authentication | two factor authentication | two-step verification
Q: Which account should get 2FA first because it can reset other accounts?
A: email
Q: Should you share an OTP code with "Safaricom customer care" on the phone? (yes or no)
A: no
Q: What fraud moves your phone number to a criminal's SIM? (two words)
A: SIM swap | sim swap
Q: Which website checks whether your email appeared in a data breach?
A: haveibeenpwned.com | haveibeenpwned | have i been pwned
```
