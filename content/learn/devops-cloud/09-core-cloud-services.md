---
slug: core-cloud-services
title: "Core cloud services compared: AWS, Azure and Google Cloud side by side"
after: infrastructure-as-code
---
# Core cloud services compared: AWS, Azure and Google Cloud side by side

The three big clouds offer hundreds of services, but most systems use the same dozen building blocks. Learn the categories once and you can switch providers quickly; mostly the names change.

## The building blocks

| Category | AWS | Azure | Google Cloud | What it's for |
|---|---|---|---|---|
| Virtual machines | EC2 | Virtual Machines | Compute Engine | Full control servers |
| Object storage | S3 | Blob Storage | Cloud Storage | Files, images, backups, static sites |
| Block storage | EBS | Managed Disks | Persistent Disk | Disks attached to VMs |
| Managed relational DB | RDS / Aurora | Azure SQL, Database for MySQL/PostgreSQL | Cloud SQL | MySQL, PostgreSQL, SQL Server without managing servers |
| NoSQL database | DynamoDB | Cosmos DB | Firestore / Bigtable | Flexible, highly scalable data |
| Serverless functions | Lambda | Functions | Cloud Functions / Cloud Run functions | Run code on events, pay per use |
| Containers (simple) | ECS / App Runner | Container Apps | Cloud Run | Run containers without managing servers |
| Kubernetes | EKS | AKS | GKE | Managed Kubernetes |
| PaaS web apps | Elastic Beanstalk | App Service | App Engine | Deploy code; platform runs it |
| Networking | VPC | Virtual Network (VNet) | VPC | Private networks |
| Load balancing | Elastic Load Balancing | Load Balancer / Application Gateway | Cloud Load Balancing | Spread traffic |
| DNS | Route 53 | Azure DNS | Cloud DNS | Domain records |
| CDN | CloudFront | Azure Front Door | Cloud CDN | Fast content delivery worldwide |
| Identity & access | IAM | Microsoft Entra ID + RBAC | IAM | Who can do what |
| Secrets | Secrets Manager | Key Vault | Secret Manager | Store passwords and keys |
| Monitoring | CloudWatch | Azure Monitor | Cloud Monitoring / Logging | Metrics, logs, alerts |
| Queues & messaging | SQS / SNS | Service Bus / Event Grid | Pub/Sub | Decouple services |
| Data warehouse | Redshift | Synapse / Fabric | BigQuery | Analytics on large data |

## Choosing a provider

| Consider | Notes |
|---|---|
| **What employers near you use** | Look at job adverts in Kenya and remote roles you want |
| **Existing tools** | Companies on Microsoft 365 often lean to Azure; Google Workspace and data teams often use Google Cloud |
| **Regions** | Nearest regions to Kenya are in Africa (e.g. South Africa) and Europe; check latency and data rules |
| **Free tier and credits** | All three have free tiers and startup credit programmes (rules change; check) |
| **Simplicity** | For small projects, simpler providers (VPS hosts, PaaS platforms) can be cheaper and easier |

For your career: **learn one cloud well**, then the others become easy. AWS has the largest market share globally; Azure is strong in enterprises and government; Google Cloud is strong in data and Kubernetes.

## Common architectures

**1. Simple website or WordPress:** one VM (or a VPS) + managed database + backups to object storage + CDN.

**2. Scalable web app:**
```text
Users → DNS → CDN → Load balancer → App servers (2+ zones, auto scaling)
                                         ↓
                         Managed database (with standby) + cache
                                         ↓
                         Object storage (uploads), backups, monitoring
```

**3. Serverless API:** API gateway → functions → NoSQL or managed SQL database. Pay only when requests arrive; great for spiky traffic.

**4. Static site:** files in object storage + CDN (or GitHub Pages / Netlify / Cloudflare Pages). Very cheap and fast. See [free static hosting](./?track=hosting&lesson=free-static-hosting).

## Managed vs self-managed

| Run it yourself on a VM | Use the managed service |
|---|---|
| More control, sometimes cheaper at small scale | Provider handles backups, patches, failover |
| You do updates, backups and monitoring | Costs more per unit, saves engineering time |

For databases especially, managed services save many painful nights.

:::think A Kenyan startup expects 500 users at launch and doesn't know how fast it will grow. Would you start with Kubernetes on three clouds? What would you suggest?
No: that's expensive and complex. Start simple: one provider, a PaaS or containers service (or a couple of VMs) with a managed database, backups, a CDN and monitoring, all defined in Terraform. Scale up (more instances, auto scaling, Kubernetes later) when real traffic and team size justify it.
:::

## Summary

- Most systems use the same building blocks: compute, storage, databases, networking, identity, monitoring.
- AWS, Azure and Google Cloud offer equivalents under different names.
- Choose based on jobs, existing tools, regions, cost and simplicity; learn one cloud deeply.
- Prefer managed services (especially databases) and start with simple architectures.

```quiz
Q: What is AWS's object storage service called? (abbreviation)
A: s3
Q: What is Google Cloud's managed Kubernetes service called? (abbreviation)
A: gke
Q: Which kind of database service handles backups and patching for you: managed or self-managed? (one word)
A: managed
```
