---
slug: passwords-2fa
title: "Passwords and two-factor authentication: how passwords are attacked, strong passphrases, password managers and MFA"
after: KEEP
---
# Passwords and two-factor authentication: how passwords are attacked, strong passphrases, password managers and MFA

Your passwords protect your email, M-Pesa-linked apps, bank, social media, school portal and work systems. Stolen or guessed passwords are one of the most common ways accounts get taken over, and when one password is reused everywhere, a single leak opens every door. This unit explains how attackers break passwords, how to create ones they can't, how password managers make it easy, and how **two-factor authentication (2FA/MFA)** stops most account takeovers even when a password leaks.

:::note What you will learn
- How passwords are stolen and cracked (guessing, brute force, credential stuffing, phishing, keyloggers)
- What makes a password strong: length and randomness
- Passphrases
- Password managers: how they work and how to start
- Checking if your accounts were in a breach
- Two-factor authentication: types, strengths and weaknesses
- Securing your email and phone first
- Passkeys: the future of logins
- Rules for organisations and developers
:::

## How attackers get passwords

| Method | How it works | Defence |
|---|---|---|
| **Guessing** | Trying common passwords: 123456, password, qwerty, names, birthdays, "Kenya2026" | Avoid anything predictable |
| **Brute force** | Trying every combination, very fast on stolen password hashes | Length: long passwords take impossibly long |
| **Dictionary attacks** | Trying lists of millions of real leaked passwords and variations ("P@ssw0rd!") | Random passphrases, not clever substitutions |
| **Credential stuffing** | Using email+password pairs leaked from one site on other sites | **Unique password for every site** |
| **Phishing** | Fake login pages that capture what you type | Check URLs, use a password manager, 2FA |
| **Keyloggers/malware** | Recording keystrokes on infected or shared computers (cybers) | Avoid logging in on public PCs, keep devices clean |
| **Shoulder surfing / social engineering** | Watching you type, or asking "for support" | Never share; cover the keypad |

## What makes a password strong

Strength comes mostly from **length** and **unpredictability**. Each extra character multiplies the possibilities:

```try-python
import math

def guesses(length, alphabet):
    return alphabet ** length

rate = 10_000_000_000      # 10 billion guesses per second (a powerful cracking rig against weak hashes)
for desc, length, alphabet in [
    ("8 lowercase letters", 8, 26),
    ("8 mixed letters, digits, symbols", 8, 94),
    ("12 mixed characters", 12, 94),
    ("4 random common words (7,776-word list)", 4, 7776),   # each 'character' is a whole word
    ("6 random common words", 6, 7776),
]:
    seconds = guesses(length, alphabet) / rate
    years = seconds / (3600 * 24 * 365)
    print(f"{desc:42} ~{seconds:.3g} seconds (~{years:.3g} years) worst case")
```

The numbers show why short passwords fall quickly no matter how "complex", while long random ones become impractical to brute force. (Real cracking speed depends on how the site stored the hash; good sites use slow hashes like bcrypt, which makes attacks far slower.)

Weak patterns attackers try first: names + years (`Wanjiku1998`), keyboard walks (`qwerty123`), team names, simple substitutions (`P@ssw0rd`), and the site name (`Facebook2026!`).

## Passphrases

A **passphrase** is several random words: `maize-lantern-orbit-tuesday-pebble`. It's long (strong) and easy to remember. Rules:
- At least 4–6 **random** words (not a famous quote or song lyric).
- Add separators or a number if a site insists.
- Use passphrases for the few passwords you must remember: your password manager's master password, your device login, your email.

## Password managers

You can't remember 80 unique strong passwords. A **password manager** does it for you:
- Generates long random passwords for every site.
- Stores them encrypted, unlocked by one strong master passphrase (plus 2FA).
- Fills them in automatically on the **real** site only (so it won't fill on a phishing look-alike, a useful warning sign).
- Syncs across your phone and computer.

| Option | Notes |
|---|---|
| **Bitwarden** | Free, open source, works on all devices |
| **Google Password Manager / Apple Passwords** | Built into Chrome/Android and iPhone/Mac; easy start |
| **KeePassXC** | Free, offline file you control |
| **1Password, Proton Pass** and others | Paid or freemium options |

How to start in one evening:
1. Install a manager and create a strong master passphrase (write it down and keep it somewhere physically safe until memorised).
2. Turn on 2FA for the manager account.
3. Change your **most important** passwords first: email, banking/M-Pesa-related apps, social media.
4. Change others as you log in to them over the following weeks.

## Have your accounts leaked?

Sites like **Have I Been Pwned** (haveibeenpwned.com) let you check whether your email appeared in known data breaches. If it did, change that password and any other site where you reused it. Many password managers include breach alerts too.

## Two-factor authentication (2FA / MFA)

Authentication factors:
1. **Something you know**: password, PIN.
2. **Something you have**: phone, authenticator app, security key.
3. **Something you are**: fingerprint, face.

**2FA/MFA** requires two or more different factors. Even if criminals get your password, they still need your phone or key, which stops the large majority of automated account takeovers.

| Method | Security | Notes |
|---|---|---|
| **Security key / passkey** (FIDO2) | Strongest | Resists phishing completely |
| **Authenticator app** (Google Authenticator, Microsoft Authenticator, Authy, 2FAS) | Strong | 6-digit codes change every 30 seconds; works offline |
| **Push approval** (tap "Yes, it's me") | Good | Beware "MFA fatigue": never approve a prompt you didn't start |
| **SMS / phone call codes** | Weakest of these, but far better than nothing | Vulnerable to SIM swap and interception |
| **Email codes** | Depends on your email security | Secure your email first |

Turn on 2FA in each account's **Security** settings. Save the **backup/recovery codes** somewhere safe (in your password manager or printed and stored securely); you'll need them if you lose your phone.

:::warning Never share codes
No bank, Safaricom, WhatsApp or employer will ever ask you for your OTP, M-Pesa PIN or 2FA code. Anyone who asks is a scammer. Messages like "I sent you a code by mistake, please forward it" are attempts to take over your WhatsApp or other accounts.
:::

## Secure these first

1. **Email**: the "key to everything", because password resets for other accounts go there. Strong unique password + 2FA (authenticator app or key).
2. **Phone number and SIM**: set a SIM PIN, keep your M-Pesa PIN secret, and contact your provider immediately if your phone suddenly loses network (possible SIM swap).
3. **WhatsApp**: Settings → Account → **Two-step verification** (a PIN that stops others registering your number on their phone).
4. **Banking and money apps**: app PINs, biometrics and transaction alerts.
5. **Social media**: 2FA and login alerts (accounts are hijacked to scam your contacts).

## Passkeys

**Passkeys** replace passwords with a cryptographic key stored on your phone or computer, unlocked with your fingerprint, face or device PIN. They can't be phished or reused, and there's nothing to remember. Google, Apple, Microsoft, WhatsApp, PayPal and many others support them: look for "Create a passkey" in security settings.

## For organisations and developers

- Require MFA, especially for email, VPN, admin and remote access.
- Follow modern guidance (e.g. NIST): favour **length** (allow long passwords and all characters), check new passwords against breach lists, **don't force arbitrary regular changes** (only change after suspected compromise), no password hints.
- Store passwords only as slow salted hashes (`password_hash` in PHP, bcrypt/Argon2); never plain text or MD5.
- Limit login attempts and alert on suspicious logins.
- Offer passkeys/SSO where possible.

:::think Brian uses "Brian@2003" for Gmail, Facebook, his school portal and his bank app. The school portal gets hacked and its passwords leak. What could happen, and what three changes should Brian make?
Attackers try the leaked email+password on other sites (credential stuffing), so his Gmail, Facebook and bank could be taken over, and from Gmail they can reset other accounts. He should: use a password manager with a unique strong password per site (changing the bank and Gmail first), turn on 2FA (authenticator app) for email, bank and social media, and check Have I Been Pwned for other leaks.
:::

## Summary

- Attackers guess, brute force, use leaked password lists (credential stuffing), phish and use keyloggers.
- Length and randomness make passwords strong; random passphrases are strong and memorable.
- Use a password manager for unique passwords everywhere, starting with your most important accounts.
- Turn on 2FA everywhere: security keys/passkeys > authenticator apps > SMS; save recovery codes; never share codes.
- Secure email, SIM/WhatsApp and money apps first; organisations should require MFA and store only strong hashes.

```quiz
Q: Which is stronger: a long passphrase or a short complex password?
A: passphrase | long passphrase | a long passphrase
Q: Name a free password manager.
A: Bitwarden | google password manager | keepass | keepassxc
Q: Which 2FA method is weakest because of SIM-swap fraud?
A: SMS | sms codes
Q: Which account is "the key to everything" and must have 2FA first?
A: email | your email
Q: Using leaked passwords from one site on other sites is called what? (two words)
A: credential stuffing
Q: Which WhatsApp setting adds a PIN to stop others registering your number? (two words)
A: two-step verification | two step verification
```
