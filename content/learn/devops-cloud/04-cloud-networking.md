---
slug: cloud-networking
title: "Cloud networking: VPCs, subnets, security groups, DNS, load balancers and HTTPS"
after: linux-servers-devops
---
# Cloud networking: VPCs, subnets, security groups, DNS, load balancers and HTTPS

Networking is where many cloud beginners get stuck. The good news: cloud networking uses the same ideas as normal networking (IP addresses, subnets, ports, DNS). If you need a refresher, see [CIDR](./?track=networking&lesson=cidr), [ports](./?track=networking&lesson=tcp-udp-ports) and [DNS](./?track=networking&lesson=dns-dhcp).

## The VPC: your private network in the cloud

A **VPC** (Virtual Private Cloud; called a **VNet** in Azure) is your own isolated network inside the provider's cloud. You choose its IP range, for example `10.0.0.0/16`.

Inside it you create **subnets**:
- **Public subnets:** have a route to the internet (for load balancers and web servers).
- **Private subnets:** no direct internet access (for databases and internal services).

```text
VPC 10.0.0.0/16
├── Public subnet  10.0.1.0/24  (zone A)  → load balancer
├── Public subnet  10.0.2.0/24  (zone B)  → load balancer
├── Private subnet 10.0.11.0/24 (zone A)  → app servers
├── Private subnet 10.0.12.0/24 (zone B)  → app servers
└── Private subnet 10.0.21.0/24 (zone A)  → database
```

## Plan subnets with Python (run it)

```try-python
import ipaddress

vpc = ipaddress.ip_network("10.0.0.0/16")
print("VPC:", vpc, "has", vpc.num_addresses, "addresses")

subnets = list(vpc.subnets(new_prefix=24))
print("It can hold", len(subnets), "subnets of /24")
for name, net in [("public-a", subnets[1]), ("public-b", subnets[2]), ("private-a", subnets[11]), ("db-a", subnets[21])]:
    hosts = list(net.hosts())
    print(f"{name:<10} {net}  usable {hosts[0]} - {hosts[-1]}")

print("Is 10.0.11.25 in private-a?", ipaddress.ip_address("10.0.11.25") in subnets[11])
```

Note: cloud providers reserve a few addresses in each subnet for their own use, so slightly fewer are usable than in normal networking.

## Getting to and from the internet

| Component | Purpose |
|---|---|
| **Internet gateway** | Lets public subnets reach the internet (and be reached) |
| **NAT gateway** | Lets private servers download updates without being reachable from the internet |
| **Route tables** | Decide where traffic from each subnet goes |
| **Public / elastic IP** | A fixed public address for a server or load balancer |

## Firewalls: security groups and network ACLs

- **Security groups** (AWS; similar "network security groups" in Azure, "firewall rules" in Google Cloud) are virtual firewalls on each server or service. They're **stateful**: if a request is allowed in, the reply is allowed out.
- **Network ACLs** are optional subnet-level rules.

**Typical rules:**

| Resource | Allow inbound |
|---|---|
| Load balancer | 443 (HTTPS) and 80 (HTTP) from anywhere |
| App servers | App port only from the load balancer's security group |
| Database | 3306 (MySQL) / 5432 (PostgreSQL) only from app servers |
| SSH (22) | Only from your office IP, or not at all (use a provider's secure session manager) |

:::warning The most common mistake
Opening port 22 (SSH) or a database port to `0.0.0.0/0` (the whole internet). Bots scan the internet constantly and will find and attack it within minutes.
:::

## DNS: names to addresses

You point your domain to your load balancer or server with DNS records:

| Record | Use |
|---|---|
| **A** | Name → IPv4 address |
| **AAAA** | Name → IPv6 address |
| **CNAME** | Name → another name (e.g. `www` → a load balancer's name) |
| **MX** | Email servers |
| **TXT** | Verification and email security (SPF, DKIM, DMARC) |

Providers have DNS services (Route 53, Azure DNS, Cloud DNS), or you can use your registrar or Cloudflare. See [DNS records](./?track=hosting&lesson=dns-records).

## Load balancers

A **load balancer** spreads traffic across several servers and stops sending traffic to unhealthy ones (using **health checks**). Benefits: no single server failure takes the site down, and you can add servers when traffic grows.

- **Layer 7 (application)** load balancers understand HTTP: route `/api` to one group and `/` to another, and handle HTTPS certificates.
- **Layer 4 (network)** load balancers work with TCP/UDP: very fast, for non-HTTP traffic.

## HTTPS everywhere

- Use HTTPS for every public site (free certificates from **Let's Encrypt**, or the provider's certificate manager).
- Terminate HTTPS at the load balancer or on the server with Nginx.
- Redirect HTTP to HTTPS.

:::think A developer puts the database in a public subnet with port 3306 open to the internet "so the app can reach it". What's a safer design?
Put the database in a private subnet with no public IP, and allow port 3306 only from the app servers' security group. The app reaches it privately inside the VPC; the internet can't reach it at all.
:::

## Summary

- A VPC is your private network; split it into public and private subnets across zones.
- Internet and NAT gateways and route tables control internet access.
- Security groups are stateful firewalls: allow only what's needed; never expose SSH or databases to the world.
- DNS points names to load balancers; load balancers spread traffic with health checks; use HTTPS everywhere.

```quiz
Q: What does VPC stand for? (three words)
A: virtual private cloud
Q: Which subnet type should hold a database: public or private? (one word)
A: private
Q: Which DNS record points a name to an IPv4 address? (one letter)
A: a
```
