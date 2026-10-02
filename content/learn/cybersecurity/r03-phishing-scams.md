---
slug: phishing-scams
title: "Phishing, social engineering and fraud: how the tricks work, how to spot them and what to do"
after: KEEP
---
# Phishing, social engineering and fraud: how the tricks work, how to spot them and what to do

**Phishing** is when criminals pretend to be someone you trust (your bank, Safaricom, KRA, a courier, your boss, a friend) to trick you into giving passwords, PINs, codes or money, or into opening malware. It arrives by email, SMS ("smishing"), phone calls ("vishing"), WhatsApp, social media and fake websites. It's the most common starting point of cyber attacks worldwide, because it's easier to trick a person than to break strong technology.

This unit teaches you to recognise the tricks, check messages safely, and respond correctly, for yourself and for an organisation.

:::note What you will learn
- Types of phishing: email, smishing, vishing, spear phishing, whaling, business email compromise
- The psychological tricks used
- Warning signs in emails, links, SMS and calls
- Checking a link or sender safely
- Common Kenyan scams (fake M-Pesa messages, KRA, jobs, deliveries, "wrong number")
- What to do if you clicked or gave information
- Reporting channels in Kenya
- Protecting a whole organisation
:::

## Types of phishing

| Type | How it arrives | Example |
|---|---|---|
| **Email phishing** | Mass emails | "Your account will be suspended, verify now" with a fake login link |
| **Smishing** | SMS | "Your parcel is held, pay KSh 150 customs fee: link" |
| **Vishing** | Phone calls | "This is Safaricom customer care, we're upgrading your line, read me the code we've sent" |
| **WhatsApp/social media** | Messages, often from hacked friends' accounts | "Help, I'm stuck, send me KSh 3,000, I'll refund tomorrow" |
| **Spear phishing** | Targeted at one person using researched details | An email to an accountant mentioning a real supplier and invoice |
| **Whaling** | Targeted at executives | Fake legal or board documents |
| **Business email compromise (BEC)** | A hacked or look-alike email of a supplier/CEO | "We've changed our bank account; pay this invoice to the new account" |
| **Fake websites and ads** | Search ads, social media pages | A look-alike bank or eCitizen page collecting details |
| **QR phishing** | Malicious QR codes | Stickers over real payment QR codes |

## The psychological tricks

| Trick | Sounds like |
|---|---|
| **Urgency** | "Within 24 hours", "immediately", "last warning" |
| **Fear** | "Your account will be blocked", "legal action", "KRA penalty" |
| **Authority** | Pretending to be police, KRA, a bank manager, your CEO |
| **Greed/reward** | "You've won", "refund due", "investment doubling" |
| **Curiosity** | "See who viewed your profile", "your photos leaked" |
| **Helpfulness/trust** | "I'm IT support fixing your email", or a "friend" in trouble |
| **Secrecy** | "Don't tell anyone, it's confidential" |

When a message makes you feel a strong emotion and pushes you to act **right now**, slow down. That's the trap.

## Warning signs

### In emails

- The sender's **actual address** doesn't match the name: "KCB Bank" <security@kcb-verify-alert.com>.
- Generic greetings ("Dear customer") from a service that knows your name.
- Spelling and grammar mistakes, odd formatting (though AI makes phishing more polished, so don't rely on this).
- Unexpected attachments, especially `.zip`, `.exe`, `.html`, `.iso`, or Office files asking to "enable content/macros".
- Links whose real destination (hover over them on a computer, or long-press on a phone) differs from the text.
- Requests for passwords, PINs, OTPs, or to "confirm" personal details.
- Changes to payment details by email.

### In links

```try-python
from urllib.parse import urlparse

links = [
    "https://www.kcbgroup.com/login",
    "https://kcbgroup.com.secure-login.info/verify",
    "https://www.safaricom.co.ke/personal",
    "http://safaricom-bonus.xyz/claim",
    "https://itax.kra.go.ke/KRA-Portal/",
    "https://kra-refund.go-ke.top/claim",
]
def real_domain(host):
    parts = host.split(".")
    # Kenyan second-level endings like .co.ke and .go.ke take three parts; most others take two
    keep = 3 if len(parts) >= 3 and parts[-1] == "ke" and parts[-2] in ("co", "go", "ac", "or", "ne", "sc") else 2
    return ".".join(parts[-keep:])

for link in links:
    host = urlparse(link).hostname
    print(f"{host:35} real domain: {real_domain(host)}")
```

The **real domain** is the part just before the first single slash, read from the **right**: in `kcbgroup.com.secure-login.info`, the domain is `secure-login.info`, not KCB. Government sites in Kenya end in `.go.ke`. Watch for look-alikes: `safaricorn`, `rnpesa`, extra words, odd endings like `.xyz`, `.top`.

### In SMS and calls

- Fake M-Pesa confirmations come from a **normal phone number**, not from "MPESA". Check your actual balance.
- Real Safaricom/bank staff **never ask for your PIN or OTP**.
- Callers who know some of your details (name, ID number) aren't necessarily genuine; data leaks are common.
- Pressure to act while on the call, or to install an app (like a remote-access app) to "help".

## Common Kenyan scams

| Scam | How it works | Defence |
|---|---|---|
| **"Wrong number" M-Pesa** | Fake "you received KSh 3,500" SMS, then a call asking you to send it back | Check your real balance; only Safaricom reverses transactions |
| **Fake Safaricom/bank calls** | "Upgrading your account", asking for PIN/OTP or to dial codes | Hang up; call the official number yourself |
| **KRA refund/penalty** | Links to fake iTax pages | Go to itax.kra.go.ke directly |
| **Delivery fees** | "Parcel held, pay KSh 200" | Check with the real courier; don't pay via links |
| **Fake jobs** | Pay "registration/training" fees | Real employers don't charge (see Make Money Online: avoiding scams) |
| **Hacked friend on WhatsApp** | Urgent requests for money or codes | Call the friend on a known number first |
| **Fake online sellers** | Cheap goods, pay deposit, nothing arrives | Pay on delivery, verify sellers |
| **Romance and investment** | Long-term trust building, then "emergency" or "opportunity" | Never send money to people you've only met online |

## How to check safely

1. **Don't use the contact details in the message.** Open the app or type the official website yourself, or call the number on the back of your card / official website.
2. **Hover/long-press** links to see the real address before tapping.
3. **Ask someone** you trust; scammers rely on isolation and speed.
4. For payment changes at work, **call the supplier** on a known number to confirm before paying.

## If you clicked or gave information

| What happened | Do this immediately |
|---|---|
| Entered a password on a fake site | Change that password (and anywhere you reused it), turn on 2FA, check for unknown logins/forwarding rules |
| Shared an M-Pesa PIN or OTP | Call Safaricom (100 for prepaid, 200 for postpaid, or the official channels) to block/secure the account; change PINs |
| Shared bank details | Call your bank's official number to block cards/accounts |
| Opened an attachment / installed an app | Disconnect from the internet, run antivirus, tell IT; remove unknown apps; consider a reset |
| Sent money | Contact your provider/bank immediately to request reversal; report to DCI |
| WhatsApp taken over | Re-register your number, enable two-step verification, warn contacts |

Then **report** it. Don't feel ashamed: scammers are professionals who target everyone, including experts.

## Reporting in Kenya

- Forward scam SMS to **333** (Safaricom).
- Report cybercrime to the **DCI** and the national **KE-CIRT/CC** (Communications Authority of Kenya).
- Report phishing emails using your email provider's "Report phishing" button.
- Report fake social media pages/accounts to the platform.
- At work: report to IT/security immediately; quick reporting limits damage.

## Protecting an organisation

- **Training and simulations**: regular short awareness sessions and practice phishing emails.
- **Email security**: spam/phishing filters, SPF/DKIM/DMARC on your domain (stops others spoofing it), warning banners on external emails.
- **MFA** on email and all remote access, so stolen passwords alone aren't enough.
- **Payment verification process**: any change of bank details must be confirmed by phone with a known contact; two people approve large payments.
- **Easy reporting**: a "Report phishing" button and a blame-free culture.
- **Least privilege**: limit what each account can access, so one compromised account does less harm.

:::think An accountant receives an email from the CEO's name (but sent from ceo.office.ke@gmail.com): "I'm in a meeting, urgently pay KSh 480,000 to this new supplier account today and keep it confidential." Which warning signs are present, and what should the accountant do?
Wrong sender address (Gmail, not the company domain), urgency, authority, secrecy, and a new bank account. This is business email compromise. The accountant should not pay; verify by calling the CEO on a known number (not replying to the email), follow the two-person payment approval process, and report the email to IT.
:::

## Summary

- Phishing impersonates trusted parties by email, SMS, calls, WhatsApp, social media, fake sites and QR codes.
- It uses urgency, fear, authority, greed, curiosity, helpfulness and secrecy; strong emotion is a warning sign.
- Check sender addresses and real link domains (read from the right; .go.ke for government); never share PINs/OTPs.
- Verify using official channels you look up yourself; act fast and report if you clicked or paid.
- Organisations need training, email security, MFA, payment verification and easy reporting.

```quiz
Q: What number do you forward scam SMS to on Safaricom?
A: 333
Q: A message says "urgent, pay today or lose your account". Which warning sign is this?
A: urgency | urgency or fear | fear
Q: Someone asks you to forward a WhatsApp code sent "by mistake". Should you? (yes/no)
A: no
Q: Phishing by SMS is called what?
A: smishing
Q: In https://kcbgroup.com.secure-login.info/verify, what is the real domain?
A: secure-login.info
Q: Kenyan government websites end with which domain?
A: .go.ke | go.ke
```
