---
slug: cloud-computing-basics
title: "Cloud computing basics: IaaS, PaaS, SaaS, regions, shared responsibility and pricing"
after: devops-cloud-start-here
---
# Cloud computing basics: IaaS, PaaS, SaaS, regions, shared responsibility and pricing

Before using any cloud provider, understand the ideas they all share. These concepts also appear in every entry-level cloud certification.

## Why companies use the cloud

| Benefit | Example |
|---|---|
| **No upfront hardware** | A startup launches without buying servers |
| **Scale on demand** | An e-commerce site handles Black Friday traffic, then scales down |
| **Pay as you go** | Pay per hour, per GB or per request |
| **Global reach** | Serve users in Kenya, Europe and the US from nearby data centres |
| **Managed services** | The provider runs databases, backups and patches for you |
| **Reliability** | Run in several data centres so one failure doesn't take you down |

## Service models: IaaS, PaaS, SaaS

Think of it like getting a meal:

| Model | You manage | Provider manages | Examples | Meal analogy |
|---|---|---|---|---|
| **IaaS** (Infrastructure) | OS, apps, data | Hardware, network, virtualisation | AWS EC2, Azure Virtual Machines, Google Compute Engine | Rent a kitchen; you cook |
| **PaaS** (Platform) | Your code and data | Servers, OS, runtime | Azure App Service, Google App Engine, Heroku-style platforms | Order ingredients delivered; you assemble |
| **SaaS** (Software) | Just your use and data | Everything else | Gmail, Microsoft 365, Zoom | Eat at a restaurant |

Also common: **serverless / FaaS** (functions that run when triggered: AWS Lambda, Azure Functions, Google Cloud Functions) and **containers as a service**.

## Deployment models

- **Public cloud:** shared provider infrastructure (AWS, Azure, Google Cloud).
- **Private cloud:** infrastructure dedicated to one organisation (on-premises or hosted).
- **Hybrid cloud:** a mix, e.g. sensitive data on-premises, web apps in public cloud.
- **Multi-cloud:** using more than one provider.

## Regions and availability zones

- A **region** is a geographic area with data centres (for example, Cape Town, Johannesburg, Frankfurt, Ireland).
- An **availability zone (AZ)** is one or more separate data centres within a region, with independent power and networking.
- Running across **several AZs** keeps your app alive if one data centre fails.

**Choosing a region:** closeness to users (lower latency), the services available there, price, and legal requirements on where data is stored.

:::kenya Data location and the law
Kenya's Data Protection Act (2019) and its regulations set rules on processing personal data, including conditions for transferring it outside Kenya, and some sectors (government, health, finance) have extra requirements. Check the rules for your sector before choosing where to store personal data. Nairobi also has commercial data centres for organisations that need local hosting.
:::

## The shared responsibility model

Security is shared between you and the provider:

| Provider is responsible for | You are responsible for |
|---|---|
| Physical data centres, hardware, the cloud network | Your data, user accounts and passwords |
| The virtualisation layer | Configuring access (IAM), firewalls and encryption settings |
| Managed service infrastructure | Patching your own servers (in IaaS), your application code |

Most cloud breaches come from **customer mistakes**: public storage buckets, leaked keys, weak passwords, no MFA.

## How cloud pricing works

| Pricing model | Meaning |
|---|---|
| **On-demand / pay as you go** | Per second or hour, no commitment |
| **Reserved / savings plans** | Commit for 1–3 years for lower prices |
| **Spot / preemptible** | Cheap spare capacity that can be taken back at short notice |
| **Free tier** | Limited free usage to learn (rules differ per provider; check them) |

Common costs: compute hours, storage per GB per month, **data transfer out** (often forgotten), managed databases, and IP addresses.

## Estimate a monthly bill (run it)

The prices below are made-up examples for practice only. Real prices differ by provider and region; use each provider's pricing calculator.

```try-python
hours_per_month = 730
server_per_hour = 0.02        # USD, example only
storage_gb, storage_per_gb = 50, 0.10
data_out_gb, data_out_per_gb = 100, 0.09

compute = server_per_hour * hours_per_month
storage = storage_gb * storage_per_gb
transfer = data_out_gb * data_out_per_gb
total = compute + storage + transfer
kes_rate = 129                # example exchange rate

print(f"Compute:  ${compute:.2f}")
print(f"Storage:  ${storage:.2f}")
print(f"Transfer: ${transfer:.2f}")
print(f"Total:    ${total:.2f}  (about KSh {total * kes_rate:,.0f})")
```

Try doubling the data transfer, or running two servers, and see how the bill changes.

:::think A school wants its student portal to keep working even if one data centre loses power. What should it ask its cloud team to do?
Run the application across at least two availability zones in a region, with a load balancer in front and a database that has a standby copy in another zone, plus regular backups (ideally stored in another region). Test that failover actually works.
:::

## Summary

- Cloud gives on-demand, pay-as-you-go computing with managed services and global reach.
- IaaS, PaaS and SaaS differ in how much you manage; serverless runs code on demand.
- Regions contain availability zones; spread across zones for reliability; consider data laws.
- Security is shared; most breaches come from customer misconfigurations. Watch data transfer costs.

```quiz
Q: Gmail is an example of which service model? (abbreviation)
A: saas
Q: What is a separate data centre inside a region called? (two words: availability ___)
A: zone | availability zone | az
Q: Under the shared responsibility model, who configures your user access: you or the provider? (one word)
A: you | customer | me
```
