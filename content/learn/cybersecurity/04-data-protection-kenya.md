---
slug: data-protection-kenya
title: Privacy and the Kenya Data Protection Act
after: web-security
---
# Privacy and the Kenya Data Protection Act

If you build websites or systems, run a business, or handle customer lists, you handle **personal data**. Kenya's **Data Protection Act, 2019** sets rules for how that data is collected, used and protected, and the **Office of the Data Protection Commissioner (ODPC)** enforces them, including with fines. This lesson is a practical overview, not legal advice.

## What counts as personal data?

Any information about an identifiable person:

- Name, phone number, email, ID number, KRA PIN, address, photo
- Location, IP address, device IDs
- M-Pesa and bank transactions
- **Sensitive personal data** needs extra care: health records, biometrics (fingerprints, face), ethnic origin, religion, sexual orientation, family details, property details.

## Key roles

| Role | Who | Example |
|---|---|---|
| **Data subject** | The person the data is about | A customer, student, patient |
| **Data controller** | Decides why and how data is processed | A school, a shop, a hospital |
| **Data processor** | Processes data on the controller's behalf | A web developer or hosting company running the system |

Controllers and processors above certain thresholds must **register** with the ODPC.

## The core principles

Personal data must be:

1. Processed **lawfully, fairly and transparently**.
2. Collected for **specific, clear purposes** and not used for unrelated ones.
3. **Adequate and limited** to what's necessary (data minimisation): don't ask for an ID number just to subscribe to a newsletter.
4. **Accurate** and kept up to date.
5. **Kept no longer than needed**.
6. Kept **secure**.

## Lawful reasons to process data

You need a valid basis, such as the person's **consent**, performing a **contract** (delivering their order), a **legal obligation** (tax records), or **legitimate interests** that don't override the person's rights. Consent must be freely given, specific and as easy to withdraw as to give.

## People's rights

Data subjects have the right to:

- Be **informed** how their data is used (privacy notice),
- **Access** their data,
- Have it **corrected** or **deleted**,
- **Object** to processing, including direct marketing,
- Data **portability** in some cases.

## What this means when you build a system

| Do | Example |
|---|---|
| Publish a clear **privacy notice** | What you collect, why, how long, who you share with, how to contact you |
| Collect the **minimum** | Phone + name for delivery; don't ask for a birth date "just in case" |
| Get proper **consent** for marketing | An unticked "Send me offers" checkbox, and an easy unsubscribe |
| **Secure** the data | HTTPS, hashed passwords, access control, backups, updates |
| Limit **access** | Staff see only what their job needs |
| Set **retention** periods | Delete old leads after, say, 2 years |
| Plan for **breaches** | Know who to notify and how, quickly |
| Sign **agreements** with processors | Your hosting, SMS and email providers |

## Data breaches

A breach is when personal data is lost, stolen, or accessed without permission (a hacked database, a lost laptop, an email sent to the wrong list). Under the Act, controllers must notify the ODPC promptly (the law sets a deadline of 72 hours in many cases) and, where there's high risk, the affected people. Having backups, logs and an incident plan makes this manageable.

## Everyday examples

- A school posting a WhatsApp group photo of exam results with names: think twice, share privately.
- A shop exporting customers' numbers to a friend for "promotions": not allowed without a lawful basis.
- CCTV at a business: put up a notice that recording is happening.
- Sending bulk SMS: include a way to opt out.

## Where to learn more

Read the Act and guidance on the ODPC website (**odpc.go.ke**). For a real business system, get proper legal advice.

```quiz
Q: In which year was Kenya's Data Protection Act passed?
A: 2019
Q: What does ODPC stand for? (Office of the Data Protection ...)
A: Commissioner | Office of the Data Protection Commissioner
Q: Is a phone number personal data? (yes or no)
A: yes
Q: Who decides why and how data is processed: the controller or the processor?
A: controller | the controller | data controller
Q: What is the principle of collecting only what you need called? (two words)
A: data minimisation | data minimization | minimisation
```
