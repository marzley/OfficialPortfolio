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

## Why data protection matters to developers and businesses

Every business in Kenya collects personal data: customer phone numbers for M-Pesa, ID numbers for loans, students' records, patients' health information, employees' KRA PINs and bank details. The Data Protection Act, 2019 sets rules for how this data must be handled, and the Office of the Data Protection Commissioner (ODPC) can investigate complaints and impose penalties. Beyond the law, protecting data builds customer trust. Developers who design systems with privacy in mind are increasingly in demand.

(This lesson is general guidance for learning, not legal advice. Check the Act, regulations and ODPC guidance for current requirements.)

## Sensitive personal data

The Act treats some data as **sensitive**, needing extra protection. It includes categories such as health, biometric data, genetic data, race or ethnic origin, religious or philosophical beliefs, sex life, family details (including names of children and parents) and property details. Systems for hospitals, schools, churches, SACCOs and HR departments often handle this kind of data, so stronger security and clearer consent are needed.

## Registration with the ODPC

Certain data controllers and processors must register with the ODPC, depending on factors such as their sector, size and the type of processing (for example, processing health data or data for marketing). Check the ODPC website for the current registration requirements and thresholds before launching a system or business that handles personal data.

## Privacy by design: building it into systems

| Practice | Example in a school or shop system |
|---|---|
| Collect the minimum | Do you need a customer's ID number for a delivery? Usually not |
| Purpose limitation | Phone numbers collected for order updates aren't used for unrelated marketing without consent |
| Access control | Teachers see their class only; bursar sees fees; admin roles are limited |
| Encryption | HTTPS everywhere; encrypt backups and sensitive fields |
| Retention limits | Delete or anonymise records you no longer need, per a written retention schedule |
| Audit logs | Record who viewed or changed sensitive records |
| Secure defaults | Profiles private by default; opt-in for marketing |
| Pseudonymisation | Use IDs instead of names in analytics and testing data |

## Consent done right

Valid consent should be **specific, informed, freely given and clear**, and people should be able to withdraw it.

| Poor consent | Better consent |
|---|---|
| Pre-ticked "I agree to everything" box | Unticked box: "Send me offers by SMS (optional)" |
| One long legal text nobody reads | Short plain-language explanation with a link to the full policy |
| Consent required to use an unrelated service | Service works without agreeing to marketing |
| No way to unsubscribe | "Reply STOP to unsubscribe" or a settings toggle |

## Writing a privacy notice (outline)

A privacy notice on a website or app should explain, in plain language:

1. Who you are and how to contact you (and your data protection officer, if any).
2. What personal data you collect.
3. Why you collect it and the lawful basis.
4. Who you share it with (payment providers, couriers, cloud hosts).
5. Whether data is transferred outside Kenya, and how it's protected.
6. How long you keep it.
7. People's rights and how to exercise them (access, correction, deletion, objection).
8. How to complain, including to the ODPC.

## Handling data subject requests

Set up a simple process:

1. Receive the request (email or form), record the date.
2. Verify the person's identity before releasing or deleting data.
3. Find their data across systems (database, spreadsheets, email, backups).
4. Respond within the time required by the regulations, explaining what was done.
5. Log the request and the outcome.

Developers can help by building "download my data" and "delete my account" features.

## Data breaches: being prepared

A data breach includes data being lost, stolen, accessed without authorisation or accidentally disclosed (for example, sending a spreadsheet of customer details to the wrong email list).

- Have a breach response plan: who investigates, who decides, who communicates.
- Contain the breach, assess the risk to people, and record what happened.
- Notify the ODPC and affected people when required by the Act and regulations, within the required time.
- Fix the cause and learn from it.

## Cross-border transfers and cloud services

Using cloud services hosted abroad (email, storage, hosting) means data may leave Kenya. The Act sets conditions for transfers outside the country, such as appropriate safeguards. When choosing providers, check where data is stored, their security certifications and their data processing terms.

## A developer's data protection checklist

- Only necessary fields are collected; optional fields are clearly marked.
- Passwords are hashed with bcrypt/Argon2; secrets are in environment variables.
- HTTPS everywhere; sensitive data encrypted at rest where appropriate.
- Role-based access control and audit logs for sensitive records.
- Clear consent for marketing; easy unsubscribe.
- Data export and account deletion features.
- Retention rules implemented (automatic clean-up of old data).
- Test and development environments use fake or anonymised data, not real customer records.
- Backups encrypted and access-restricted.
- A privacy notice that matches what the system actually does.

## Practice

1. Review a sign-up form you've built (or a popular app's) and list fields that aren't strictly necessary.
2. Write a short privacy notice for a small online shop using the outline above.
3. Design a retention schedule: how long to keep orders, CCTV footage, job applications and chat logs.
4. Add an "export my data" and "delete my account" feature plan to a project.
5. Create anonymised test data for a customer table (fake names and phone numbers).

:::think A developer copies the live customer database (names, phones, ID numbers) to their laptop to test a new feature. What are the risks, and what's a better approach?
If the laptop is lost, stolen or infected, real customers' personal data is exposed, which may be a reportable breach. It also widens access beyond what's necessary. Better: use generated fake data or an anonymised/pseudonymised copy for development, keep real data only in secured production systems, and restrict who can access it.
:::

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
Q: Is health information treated as sensitive personal data under Kenya's Act? (yes or no)
A: yes
Q: Should consent checkboxes for marketing be pre-ticked? (yes or no)
A: no
Q: What should test and development systems use instead of real customer data? (two words)
A: fake data | anonymised data | anonymized data | test data
```
