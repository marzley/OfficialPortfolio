---
slug: domains
title: "Domain names: how they work, choosing a name, .co.ke vs .com, registering, renewing and protecting your domain"
after: KEEP
---
# Domain names: how they work, choosing a name, .co.ke vs .com, registering, renewing and protecting your domain

A **domain name** is your address on the internet: `safaricom.co.ke`, `kra.go.ke`, `jumia.co.ke`, `marzleytechsolutions.co.ke`. It's what customers type, what appears on business cards and in email addresses (`info@yourbusiness.co.ke`), and it's a big part of looking professional and being found. A domain is separate from hosting: the domain is the *address*, hosting is the *house* where the website lives. This unit explains how domains work, how to choose and register one, Kenyan options like `.co.ke`, and how to avoid the common (and costly) mistakes of losing a domain.

:::note What you will learn
- What a domain is and how it relates to DNS and hosting
- Parts of a domain: subdomain, second-level, top-level
- Kenyan domains (.ke, .co.ke, .or.ke, .ac.ke, .go.ke...) vs .com and others
- Choosing a good name and checking availability
- Registrars, registries and ICANN/KENIC
- Registering a domain step by step
- Renewals, expiry and grace periods
- Ownership, transfers, WHOIS and privacy
- Protecting your domain from loss and hijacking
- Subdomains and email on your domain
:::

## Domains, DNS and hosting

| Thing | Analogy | Example |
|---|---|---|
| **Domain name** | The business's address/name on a signboard | `mamamboga.co.ke` |
| **DNS** | The directory that says where that address points | `mamamboga.co.ke → 203.0.113.10` |
| **Hosting** | The building where the website's files live | A server at a hosting company |

You rent a domain from a **registrar** (usually yearly), point it with **DNS** to your **hosting**, and visitors arrive at your website. You can move hosting without changing your domain; that's why owning your domain matters.

## Parts of a domain

```
https://shop.mamamboga.co.ke/products
        │    │        │  └── TLD (country code): ke
        │    │        └───── second level under .ke: co (commercial)
        │    └────────────── the name you register: mamamboga
        └─────────────────── subdomain: shop (you create these freely)
```

- **TLD (top-level domain)**: the ending. Generic TLDs: `.com`, `.org`, `.net`, `.info`, `.africa`, `.shop`, `.tech`. Country-code TLDs: `.ke` (Kenya), `.ug`, `.tz`, `.uk`.
- **Subdomains** (`shop.`, `portal.`, `blog.`) are free once you own the domain.

## Kenyan domains

Kenya's domains are managed by **KENIC** (Kenya Network Information Centre) and sold through accredited registrars:

| Domain | For | Requirements (check current rules) |
|---|---|---|
| **.co.ke** | Companies and businesses (most popular) | Open to businesses and individuals |
| **.ke** | Anyone (shorter, direct under .ke) | Open registration |
| **.or.ke** | Non-profit organisations, NGOs | Organisation details |
| **.ne.ke** | Network providers | — |
| **.ac.ke** | Universities and colleges | Proof of institution |
| **.sc.ke** | Schools | Proof of school |
| **.go.ke** | Government only | Government authorisation |
| **.me.ke**, **.info.ke**, **.mobi.ke** | Personal, information, mobile sites | Open |

Some second-level domains require documents; registrars will tell you what's needed.

### .co.ke or .com?

| | .co.ke | .com |
|---|---|---|
| Signals | A Kenyan business; local trust | International |
| Local search | Can help show you serve Kenya | Neutral |
| Availability | More short names still available | Many short names taken |
| Price | Usually affordable locally | Similar or cheaper first year, check renewal |

Many businesses register **both** (and point one to the other) to protect their brand. If you target Kenyan customers, `.co.ke` is an excellent choice.

## Choosing a good name

- **Short, easy to say and spell**: test by saying it over the phone.
- Avoid hyphens and numbers (people forget them: "is it 4 or four?").
- Match your business name, or describe what you do + location: `nakurudental.co.ke`.
- Check it's not someone else's trademark.
- Check social media handles are available too, for a consistent brand.
- Don't make it so specific you outgrow it (`nairobi-phone-repairs` if you'll expand to Mombasa).

Check availability on any registrar's search box. If taken, try `.ke`, `.co.ke`, `.com`, `.africa`, or small variations.

## Who's who: ICANN, registries and registrars

| Body | Role |
|---|---|
| **ICANN** | Coordinates the global domain system |
| **Registry** | Runs a TLD's database: **KENIC** for .ke; Verisign for .com |
| **Registrar** | Sells domains to the public: local Kenyan registrars/hosts and international ones |
| **Registrant** | You: the legal holder of the domain |

## Registering step by step

1. Search for the name at an accredited registrar (for .ke, choose a **KENIC-accredited** registrar; many Kenyan hosting companies are).
2. Add it to the cart; choose the registration period (1 year or more).
3. Enter **registrant details accurately**: the business or person who should own it, a working email and phone. This is how ownership is proven later.
4. Pay (many local registrars accept M-Pesa).
5. Set **name servers** (your host's) or manage DNS at the registrar.
6. Turn on **auto-renew** and **2FA** on the registrar account.

## Renewals and expiry

- Domains are rented for a period; **you must renew** before expiry.
- After expiry there's usually a **grace period** where the owner can renew (sometimes with a fee), then a **redemption period** (expensive to recover), then the domain is released and anyone can register it.
- Expired domains break your website **and email**, and can be grabbed by others (sometimes to resell to you, or to host scams using your old reputation).
- First-year prices are often promotional; check the **renewal price**.

## Ownership, transfers and WHOIS

- The **registrant** listed is the legal holder. Freelancers and developers should register clients' domains **in the client's name and email**, and hand over login details. A common painful situation: the developer who registered the domain disappears and the business can't renew or move it.
- **Transfers** between registrars use an **EPP/auth code** from the current registrar; the domain must usually be unlocked and not recently registered or transferred (many TLDs have a waiting period after registration or transfer).
- **WHOIS/RDAP** shows registration information (registrar, dates, name servers); personal details are often hidden by privacy rules or a privacy service.

## Protecting your domain

1. Registrar account: strong unique password + **2FA**.
2. **Auto-renew** with a valid payment method, and calendar reminders a month before expiry.
3. Keep the registrant **email address working** (on a different domain, e.g. Gmail, so you can still receive renewal notices if your own domain's email breaks).
4. Enable **registrar lock** (transfer lock).
5. Register for multiple years for important domains.
6. Keep records of the registrar, login owner and renewal date in your business records.
7. Watch out for "domain renewal" scam letters/emails from companies you didn't register with.

## Subdomains and email

Once you own `yourbusiness.co.ke`:
- Create subdomains in DNS: `shop.yourbusiness.co.ke` for a store, `portal.` for a client system.
- Set up professional email (`info@`, `sales@`, `yourname@`) with your host or Google Workspace/Microsoft 365, using MX records (see the DNS and email lessons).

:::think A small hotel's website and emails stopped working this morning. Investigation shows the domain expired last week, registered under the email of a developer who left two years ago. What should they do now, and what should change for the future?
Contact the registrar immediately (the domain may still be in the grace period), prove the hotel's ownership (business documents) and update the registrant/admin details to the hotel's own name and email, then renew. Going forward: register the domain in the hotel's name with a working hotel-controlled email, enable auto-renew and 2FA, renew for several years, and record renewal dates.
:::

## Summary

- A domain is your internet address; DNS points it to hosting, and you can change hosting without changing the domain.
- TLDs include .com and country codes like .ke; KENIC runs .ke and its second levels (.co.ke, .or.ke, .ac.ke, .sc.ke, .go.ke).
- Choose short, clear, brandable names; register through accredited registrars with accurate details in the true owner's name.
- Renew on time (auto-renew), understand grace/redemption periods, and use EPP codes for transfers.
- Protect domains with 2FA, registrar lock, working contact emails and good records.

```quiz
Q: Which organisation manages .ke domains? (abbreviation)
A: KENIC
Q: Which Kenyan domain ending is the usual choice for businesses?
A: .co.ke | co.ke
Q: What code do you need to transfer a domain to another registrar? (two letters + word, or "auth code")
A: EPP code | auth code | epp | authorization code
Q: Which domain ending is reserved for Kenyan government?
A: .go.ke | go.ke
Q: Should a developer register a client's domain in the developer's own name? (yes/no)
A: no
Q: In shop.mamamboga.co.ke, what is "shop" called?
A: subdomain | a subdomain
```
