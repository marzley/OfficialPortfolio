---
slug: monitoring-reliability
title: "Monitoring, logging and reliability: metrics, alerts, SLOs, incidents and backups"
after: deploy-real-app
---
# Monitoring, logging and reliability: metrics, alerts, SLOs, incidents and backups

Deploying is the beginning. Users expect services to work all the time, and when they don't, you need to know before customers start calling. Monitoring and reliability practices are the core of **site reliability engineering (SRE)**.

## The three pillars of observability

| Pillar | What it is | Example |
|---|---|---|
| **Metrics** | Numbers over time | CPU 85%, 120 requests per second, 2% errors |
| **Logs** | Event records with details | "Payment callback failed: timeout after 30s" |
| **Traces** | The path of one request through many services | Checkout took 4s: 3.2s waiting for the payment API |

## What to monitor: the golden signals

1. **Latency:** how long requests take
2. **Traffic:** how many requests
3. **Errors:** the share of failed requests
4. **Saturation:** how full resources are (CPU, memory, disk, database connections)

Also: uptime from outside, SSL certificate expiry, backups succeeding, queue lengths and business metrics (orders per hour, M-Pesa payments confirmed).

## Popular tools

| Tool | Use |
|---|---|
| **Prometheus** + **Grafana** | Open-source metrics collection and dashboards |
| **Loki** / **ELK** (Elasticsearch, Logstash, Kibana) / **OpenSearch** | Collecting and searching logs |
| **OpenTelemetry** | A standard way to produce metrics, logs and traces |
| Cloud tools: CloudWatch, Azure Monitor, Google Cloud Monitoring | Built into each provider |
| Uptime monitors (many free plans) | External checks and alerts |
| Datadog, New Relic and similar | Commercial all-in-one platforms |

## Good alerts

Alert fatigue is real: too many alerts and people ignore them.

- **Alert on symptoms users feel** (site down, errors above 5%, checkout slow), not every CPU spike.
- **Every alert needs an action.** If nobody needs to do anything, it's a dashboard, not an alert.
- **Send alerts where people see them:** SMS, WhatsApp/Telegram bots, Slack, phone calls for critical issues.
- Write a short **runbook** for each alert: what it means, how to check and how to fix.

## SLIs, SLOs and error budgets

- **SLI (service level indicator):** a measurement, e.g. the % of successful requests.
- **SLO (service level objective):** a target, e.g. 99.9% of requests succeed each month.
- **SLA (service level agreement):** a promise to customers, often with penalties.
- **Error budget:** the allowed failure. 99.9% availability allows about 43 minutes of downtime in a 30-day month.

```try-python
minutes_per_month = 30 * 24 * 60
for slo in [99.0, 99.5, 99.9, 99.95, 99.99]:
    allowed = minutes_per_month * (100 - slo) / 100
    print(f"{slo}% availability -> {allowed:,.1f} minutes of downtime allowed per month")
```

Each extra "nine" is much harder and more expensive. Choose targets that match what users actually need.

## Incident response

When something breaks:
1. **Detect:** an alert or a user report.
2. **Communicate:** tell the team and, if needed, users ("We're investigating slow payments").
3. **Mitigate first:** roll back, restart, scale up, switch to backup. Restore service before finding the root cause.
4. **Resolve:** fix the underlying problem.
5. **Post-incident review (blameless):** what happened, why, how we detected it, and what we'll change. Focus on systems, not blaming people.

## Backups and disaster recovery

- **RPO (recovery point objective):** how much data you can afford to lose (e.g. 1 hour).
- **RTO (recovery time objective):** how long you can be down (e.g. 4 hours).
- The **3-2-1 rule:** 3 copies of data, on 2 different types of storage, 1 off-site.
- Automate backups, keep copies in another region or provider, and **test restores regularly**.

:::kenya Local realities
Plan for power and internet interruptions at offices and on-premises servers (UPS, generators, backup internet). Payment integrations like M-Pesa depend on external APIs: monitor callbacks and have a way to reconcile payments if callbacks fail.
:::

:::think At 9am on a Monday, checkout errors jump to 30%. You deployed a new version at 8:50am. What do you do first?
Mitigate first: roll back to the previous version immediately (or switch off the new feature flag), confirm errors drop, and tell stakeholders. Then investigate the cause in logs and traces in a safe environment, fix it, add a test, and hold a blameless review.
:::

## Summary

- Observability: metrics, logs and traces. Watch latency, traffic, errors and saturation.
- Alert on user-facing symptoms; every alert needs an action and a runbook.
- SLIs measure, SLOs set targets, error budgets allow some failure; each extra "nine" costs more.
- In incidents, mitigate first, then fix and review blamelessly. Back up with 3-2-1 and test restores.

```quiz
Q: Name the three pillars of observability: metrics, logs and ___ (one word)
A: traces | tracing
Q: In incidents, what comes first: mitigate or find the root cause? (one word)
A: mitigate | mitigation
Q: In the 3-2-1 backup rule, how many copies should be off-site? (a number)
A: 1 | one
```
