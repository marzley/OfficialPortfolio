---
slug: devops-cloud-start-here
title: "Start here: what DevOps and cloud engineers do, and your roadmap"
after: START
---
# Start here: what DevOps and cloud engineers do, and your roadmap

When you open the M-Pesa app, a bank's website or a school portal, it runs on servers somewhere, often in "the cloud". Someone built that infrastructure, automated how new code reaches it, and keeps it running day and night. That's the work of **DevOps** and **cloud** engineers.

## What is DevOps?

**DevOps** joins **Dev**elopment (writing software) and **Op**eration**s** (running it). Instead of developers "throwing code over the wall" to a separate team, DevOps teams share responsibility and **automate** the path from code to production:

1. Write code and save it in Git
2. Automatically **build and test** it (continuous integration, CI)
3. Automatically **deploy** it (continuous delivery/deployment, CD)
4. **Monitor** it in production and fix problems fast
5. Learn and improve

## What is the cloud?

**Cloud computing** means renting computing resources (servers, storage, databases, networking) over the internet instead of buying and running your own hardware. You pay for what you use and can grow or shrink in minutes. The biggest providers are **Amazon Web Services (AWS)**, **Microsoft Azure** and **Google Cloud**.

## Jobs in this field

| Role | Focus |
|---|---|
| **DevOps engineer** | CI/CD pipelines, automation, containers, deployment |
| **Cloud engineer / architect** | Designing and building systems on AWS, Azure or Google Cloud |
| **Site reliability engineer (SRE)** | Keeping systems fast and available; monitoring and incidents |
| **Platform engineer** | Internal tools that make developers productive |
| **Systems / Linux administrator** | Servers, users, updates, backups (a common starting point) |
| **Cloud security engineer** | Securing cloud accounts, networks and data |

## Skills you'll need (and where to learn them)

| Skill | Learn here |
|---|---|
| Linux command line | [Linux subject](./?track=linux&lesson=why-linux) |
| Networking (IP, DNS, ports, subnetting) | [Networking subject](./?track=networking&lesson=what-is-a-network) |
| Git and GitHub | [Git subject](./?track=git&lesson=what-is-git) |
| A scripting language (Bash, Python) | [Linux: Bash scripts](./?track=linux&lesson=bash-scripts), [Python](./?track=python) |
| Web hosting basics | [Web hosting subject](./?track=hosting&lesson=hosting-types) |
| Cloud, CI/CD, Docker, Kubernetes, Terraform, monitoring | **This subject** |

## Your roadmap (about 6–9 months part-time)

1. **Foundations (months 1–2):** Linux, networking, Git, one scripting language.
2. **Cloud basics (month 3):** one provider's core services; a free-tier account with cost alerts.
3. **Automation (month 4):** CI/CD with GitHub Actions.
4. **Containers (month 5):** Docker and Docker Compose.
5. **Infrastructure as code (month 6):** Terraform.
6. **Kubernetes and monitoring (months 7–8).**
7. **Portfolio and certification (month 9):** deploy real projects; take an entry certification.

:::note You can start on a basic laptop
Most practice happens in the cloud or in a browser. Free tiers, GitHub Codespaces and Google Cloud Shell give you Linux terminals without a powerful computer. Data costs are the main expense: download large tools on Wi-Fi.
:::

:::warning Protect yourself from surprise bills
Cloud accounts need a card and can charge you if you leave resources running. From day one: turn on billing alerts, use free tiers, delete what you don't need, and never share your access keys. Lesson 13 covers this in detail.
:::

:::think A small online shop in Nairobi deploys new features by copying files to its server by hand every Friday night, and the site often breaks. Which DevOps practices would help first?
Put the code in Git, add automated tests and a CI pipeline that runs them on every change, deploy automatically through a CD pipeline (with an easy rollback), and add monitoring with alerts. Smaller, frequent, automated releases break less than big manual ones.
:::

## Summary

- DevOps automates the path from code to production and shares responsibility for running it.
- Cloud computing rents servers, storage and services on demand (AWS, Azure, Google Cloud).
- Roles: DevOps, cloud, SRE, platform, sysadmin and cloud security engineers.
- Learn Linux, networking and Git first, then cloud, CI/CD, Docker, Terraform and Kubernetes.

```quiz
Q: What do the letters CI stand for? (two words)
A: continuous integration
Q: Name one of the three biggest cloud providers. (one word or abbreviation)
A: aws | azure | google | google cloud | gcp | amazon | microsoft
Q: What should you turn on from day one to avoid surprise cloud bills? (two words: billing ___)
A: alerts | billing alerts | budget alerts | budgets
```
