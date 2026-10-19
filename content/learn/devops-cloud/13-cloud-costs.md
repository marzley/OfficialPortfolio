---
slug: cloud-cost-control
title: "Cloud cost control (FinOps): free tiers, budgets, right-sizing and avoiding surprise bills"
after: cloud-security
---
# Cloud cost control (FinOps): free tiers, budgets, right-sizing and avoiding surprise bills

The cloud's pay-as-you-go model is powerful, and dangerous for beginners. Stories of students receiving bills of hundreds of dollars for a forgotten server are common. Cost control is part of an engineer's job; companies call it **FinOps**.

## Before you create anything

1. **Set a budget and billing alerts** (e.g. alert at $5, $10, $20).
2. **Read the free tier rules:** limits on hours, storage and services; some offers last 12 months, some are always free.
3. **Pick small sizes** and one region.
4. **Turn on MFA** (stolen accounts are a major source of huge bills).

## What usually causes surprise bills

| Cause | Prevention |
|---|---|
| Forgotten servers and databases left running | Delete practice resources the same day; use `terraform destroy` |
| Managed Kubernetes clusters and NAT gateways (charged hourly even when idle) | Delete after practice |
| Unattached disks, snapshots and public IPs | Clean up after deleting servers |
| **Data transfer out** of the cloud | Use a CDN; keep traffic inside one region |
| Leaked access keys used for crypto-mining | Never commit keys; MFA; billing alerts |
| Logs stored forever | Set retention periods |

## Saving money on real systems

| Technique | Idea |
|---|---|
| **Right-sizing** | Use the smallest instance that meets needs; check actual CPU and memory use |
| **Auto scaling** | Add servers at busy times, remove them when quiet |
| **Scheduling** | Turn off dev and test environments at night and weekends |
| **Reserved instances / savings plans** | Commit for 1–3 years for steady workloads |
| **Spot / preemptible instances** | Cheap capacity for jobs that can be interrupted |
| **Storage tiers** | Move old backups to cheaper archive storage |
| **Serverless** | Pay only when code runs, for spiky or low traffic |
| **Tagging** | Tag every resource (project, owner, environment) to see who spends what |

## How much can scheduling save? (run it)

```try-python
hours_in_month = 730
hourly_cost = 0.10            # example price per server-hour (USD)
servers = 4                   # a dev/test environment

always_on = hours_in_month * hourly_cost * servers
office_hours = 22 * 12        # 22 weekdays x 12 hours
scheduled = office_hours * hourly_cost * servers

print(f"Always on:      ${always_on:,.2f} per month")
print(f"Office hours:   ${scheduled:,.2f} per month")
print(f"Saving:         ${always_on - scheduled:,.2f} ({1 - scheduled / always_on:.0%})")
```

Turning off test servers outside office hours saves most of their cost.

## Paying for cloud from Kenya

- Cloud providers usually bill in US dollars by card. Use a debit card or a virtual card (some banks and mobile money services offer virtual cards; check fees and limits).
- Exchange rates and card fees change your real cost; keep a buffer.
- For businesses, check invoicing and tax requirements with an accountant.
- Some local hosting providers bill in shillings and accept M-Pesa, which can suit small websites better than a big cloud.

## A monthly cost review habit

1. Open the billing dashboard; compare with last month.
2. Look at the top 5 services by cost.
3. Find idle or oversized resources.
4. Delete, downsize or schedule.
5. Check that alerts and budgets still match reality.

:::think You finish a Kubernetes tutorial on a cloud free trial and close your laptop. What might still be costing money, and what should you do?
The managed cluster's control plane, worker node VMs, load balancers, NAT gateways, disks and public IPs may all still be running. Delete the cluster and related resources (or run terraform destroy), check the billing page and resource lists in every region you used, and keep billing alerts on.
:::

## Summary

- Set budgets and billing alerts before creating anything; know the free tier rules.
- Surprise bills come from forgotten resources, idle clusters, data transfer and leaked keys.
- Save with right-sizing, auto scaling, scheduling, commitments, spot capacity, storage tiers and tagging.
- Review costs monthly; consider local, shilling-billed hosting for small sites.

```quiz
Q: What is the practice of managing cloud costs often called? (one word)
A: finops
Q: Should you leave practice Kubernetes clusters running overnight? (yes or no)
A: no
Q: Using the smallest instance that meets your needs is called ___-sizing (one word)
A: right | rightsizing | right-sizing
```
