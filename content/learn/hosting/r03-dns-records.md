---
slug: dns-records
title: "Pointing a domain: name servers, DNS records (A, CNAME, MX, TXT), propagation and fixing common DNS problems"
after: KEEP
---
# Pointing a domain: name servers, DNS records (A, CNAME, MX, TXT), propagation and fixing common DNS problems

You've registered a domain and bought hosting. Now you need to connect them: tell the world that `yourbusiness.co.ke` lives on your hosting server, and that its email goes to Google Workspace, Microsoft 365 or your host's mail server. That's done with **DNS**. Getting DNS right means the website loads, email arrives and doesn't land in spam, SSL certificates work, and services like Google Search Console can verify you. Getting it wrong can take a website and email offline. This unit is a practical guide for web developers and site owners.

:::note What you will learn
- Name servers vs DNS records, and where DNS is managed
- The records you'll use: A, AAAA, CNAME, MX, TXT, NS, CAA, SRV
- Pointing a domain to shared hosting, a VPS, or a website builder
- Setting up email records, including SPF, DKIM and DMARC
- Verification records for Google and others
- TTL and propagation
- Using Cloudflare
- Checking and troubleshooting DNS
:::

## Name servers vs records

Two ways to connect a domain to hosting:

1. **Change the name servers** at the registrar to your host's (e.g. `ns1.examplehost.co.ke`, `ns2.examplehost.co.ke`). The host then manages all DNS records for you (in cPanel → Zone Editor). Simplest for shared hosting.
2. **Keep DNS at the registrar (or Cloudflare)** and add records yourself (e.g. an A record to the server's IP). Better when you use several services (website on one host, email on Google, a shop on another platform).

Only **one** place is authoritative: wherever the name servers point. Editing records anywhere else does nothing, a very common source of confusion.

## The records you'll use

| Record | Purpose | Example |
|---|---|---|
| **A** | Points a name to an IPv4 address | `@ → 203.0.113.10` |
| **AAAA** | Points a name to an IPv6 address | `@ → 2001:db8::10` |
| **CNAME** | Makes a name an alias of another name | `www → yourbusiness.co.ke` or `shop → shops.myplatform.com` |
| **MX** | Mail servers for the domain, with priority (lower = preferred) | `@ → 10 mail.yourbusiness.co.ke` |
| **TXT** | Text for verification and email security | SPF, DKIM, DMARC, Google verification |
| **NS** | Which servers are authoritative | `ns1.examplehost.co.ke` |
| **CAA** | Which certificate authorities may issue SSL for the domain | `0 issue "letsencrypt.org"` |
| **SRV** | Locations of specific services | Microsoft 365, VoIP |

`@` means the root domain itself (`yourbusiness.co.ke`). A **CNAME can't be placed on the root** in standard DNS (some providers offer "CNAME flattening" or ALIAS records to get around this).

## Pointing to hosting

### Shared hosting
Change name servers to the host's; the host creates A records for `@` and `www`. Or keep DNS elsewhere and add:

```
Type   Name   Value            TTL
A      @      203.0.113.10     3600
CNAME  www    yourbusiness.co.ke.   3600
```

### A VPS or cloud server
Add A (and AAAA if the server has IPv6) records for `@` and `www` pointing to the server's public IP.

### Website builders and platforms
Platforms like Shopify, Wix, Webflow or GitHub Pages give you specific records (usually a CNAME for `www` and A records for the root). Copy them exactly.

## Email records

### MX
Use the exact MX records from your email provider. Examples (always confirm the current values in the provider's own setup instructions):
- Host's cPanel email: `@ MX 0 yourbusiness.co.ke` (cPanel sets this up)
- Google Workspace: one MX record `smtp.google.com` (priority 1) for newer setups
- Microsoft 365: `yourdomain-co-ke.mail.protection.outlook.com`

Only list MX records for the service you actually use; leftover old MX records cause lost email.

### SPF, DKIM, DMARC: stop spoofing and spam folders

| Record | What it does | Example |
|---|---|---|
| **SPF** (TXT on @) | Lists servers allowed to send email for your domain | `v=spf1 include:_spf.google.com ~all` |
| **DKIM** (TXT on a selector, e.g. `google._domainkey`) | Public key that verifies signed emails weren't altered | Long key from your provider |
| **DMARC** (TXT on `_dmarc`) | Tells receivers what to do if SPF/DKIM fail, and sends reports | `v=DMARC1; p=none; rua=mailto:dmarc@yourbusiness.co.ke` |

Rules:
- Only **one SPF record** per domain; combine providers in one: `v=spf1 include:_spf.google.com include:spf.examplehost.co.ke ~all`.
- Start DMARC with `p=none` (monitor), then move to `quarantine` or `reject` once legitimate senders pass.
- If your website's contact form sends email, make sure that sender is covered by SPF/DKIM too.

## Verification records

Google Search Console, Microsoft 365, Facebook Business, and SSL providers ask you to add a TXT (or CNAME) record to prove you own the domain:

```
TXT   @   google-site-verification=abc123xyz...
```

Leave verification records in place; removing them can un-verify the service.

## TTL and propagation

**TTL** (time to live) is how long resolvers cache a record (in seconds). With TTL 3600, changes can take up to an hour to be seen by everyone; name server changes can take longer (often a few hours; occasionally up to 48 hours) because TLD servers and caches must update.

Tips:
- Before a planned move, lower TTL to 300 a day ahead; change records; raise TTL again after.
- Different people may see the old and new site during the change; that's normal caching.
- Flush your own cache (`ipconfig /flushdns`) and test with public resolvers.

## Cloudflare

Many sites put **Cloudflare** in front (free plan available): you change name servers to Cloudflare's, and manage DNS there. Benefits: fast DNS, a CDN that caches static files near visitors, DDoS protection, free SSL at the edge, firewall rules. With the orange-cloud **proxy** on, visitors connect to Cloudflare, which connects to your server. Email (MX) records are never proxied. Use **Full (strict)** SSL mode with a valid certificate on your server.

## Checking DNS

```bash
nslookup yourbusiness.co.ke
nslookup -type=MX yourbusiness.co.ke
nslookup -type=TXT yourbusiness.co.ke 8.8.8.8
dig yourbusiness.co.ke +short          # Linux/macOS
dig NS yourbusiness.co.ke +short       # which name servers are authoritative?
dig TXT _dmarc.yourbusiness.co.ke +short
```

Online tools like MXToolbox, DNSChecker and Google Admin Toolbox check records from many locations and validate SPF/DKIM/DMARC.

```try-python
# Validate a few common SPF mistakes before publishing
def check_spf(records):
    spf = [r for r in records if r.startswith("v=spf1")]
    if len(spf) == 0:
        return "No SPF record"
    if len(spf) > 1:
        return "ERROR: more than one SPF record; merge them into one"
    r = spf[0]
    if not r.rstrip().endswith(("~all", "-all", "?all")):
        return "WARNING: SPF should end with ~all or -all"
    return "SPF looks OK: " + r

print(check_spf(["v=spf1 include:_spf.google.com ~all"]))
print(check_spf(["v=spf1 include:_spf.google.com ~all", "v=spf1 a mx ~all"]))
print(check_spf(["google-site-verification=abc"]))
```

## Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| Changed records, nothing happens | Editing DNS in the wrong place (name servers point elsewhere) | Check `dig NS`, edit at the authoritative provider |
| Site works on `www` but not without (or vice versa) | Missing A record for `@` or CNAME for `www` | Add both and redirect one to the other |
| Old site still showing | Caching/TTL | Wait, flush cache, test with another resolver |
| Emails not arriving | Wrong/missing/old MX records | Use only the provider's MX values |
| Emails going to spam | Missing SPF/DKIM/DMARC, or the web server sending unauthenticated mail | Add records; send via authenticated SMTP |
| SSL certificate fails | DNS not pointing to the server yet, or a CAA record blocking the issuer | Fix A records; adjust CAA |
| "DNS_PROBE_FINISHED_NXDOMAIN" | Domain expired, no records, or typo | Check registration and records |

:::think A company moved its website to a new host by changing name servers. The website works, but since then no one receives email at info@company.co.ke. Why, and how do you fix it?
The new host's DNS zone was created without the old MX (and SPF/DKIM) records for their email provider, so mail now points to the new host (or nowhere). Add the correct MX records and email TXT records (SPF, DKIM, DMARC) for the email provider in the new authoritative DNS zone, then test with nslookup/MXToolbox.
:::

## Summary

- Connect a domain either by changing name servers to the host or by adding records where DNS is managed; only the authoritative provider's records count.
- Key records: A/AAAA (IP), CNAME (alias, not on root), MX (mail), TXT (verification, SPF, DKIM, DMARC), NS, CAA, SRV.
- Email needs correct MX plus one SPF record, DKIM and DMARC to avoid spoofing and spam folders.
- TTL controls caching; lower it before moves; name server changes take longer.
- Check with nslookup/dig and online tools; most issues are wrong location, missing @/www records, old MX or missing email authentication.

```quiz
Q: Which record points a domain to an IPv4 address?
A: A | A record
Q: Which record type lists mail servers?
A: MX
Q: How many SPF records should a domain have?
A: 1 | one
Q: Which record type is an alias from one name to another?
A: CNAME
Q: What does @ mean in a DNS zone?
A: the root domain | root | the domain itself | root domain
Q: Which TXT record name holds the DMARC policy?
A: _dmarc
```
