---
slug: dns-dhcp
title: "DNS and DHCP: how names become addresses and how devices get IP settings automatically"
after: KEEP
---
# DNS and DHCP: how names become addresses and how devices get IP settings automatically

Two services make networks usable for ordinary people:

- **DNS (Domain Name System)** turns names like `www.kra.go.ke` into IP addresses. Without it, you'd type numbers to visit every website.
- **DHCP (Dynamic Host Configuration Protocol)** gives devices their IP address, mask, gateway and DNS servers automatically when they join a network. Without it, someone would have to configure every phone that connects to the office Wi-Fi by hand.

When "the internet is down", the cause is very often one of these two. This unit explains how both work in detail, how to configure them, and how to troubleshoot them.

:::note What you will learn
- DNS: the hierarchy (root, TLDs like .ke, domains), resolvers and authoritative servers
- A DNS lookup step by step, and caching with TTL
- Record types: A, AAAA, CNAME, MX, TXT, NS, PTR, SRV, CAA
- Managing DNS for a website or business email
- DHCP: the DORA process, leases, scopes, reservations, options
- DHCP relay and DHCP problems
- Troubleshooting DNS and DHCP with commands
- Security: DNS filtering, DNSSEC, rogue DHCP
:::

---

## Part 1: DNS

### The DNS hierarchy

DNS is a worldwide, distributed database organised as a tree, read from right to left:

```
www.marzleytechsolutions.co.ke.
 |          |            |  |  └── root (.)
 |          |            |  └───── top-level domain (TLD): ke
 |          |            └──────── second level: co (under .ke)
 |          └───────────────────── the domain: marzleytechsolutions
 └──────────────────────────────── host/subdomain: www
```

| Level | Who runs it | Examples |
|---|---|---|
| **Root servers** | 13 named root server identities, operated worldwide with many copies (anycast) | `.` |
| **TLD servers** | Registries | `.com`, `.org`, `.ke` (run by KENIC) |
| **Second-level under .ke** | KENIC | `.co.ke`, `.go.ke`, `.ac.ke`, `.or.ke`, `.ne.ke`, `.sc.ke` |
| **Authoritative servers** | The domain owner's DNS host | Holds the actual records for a domain |

### Resolvers and a lookup step by step

Your device asks a **recursive resolver** (your ISP's, or a public one like 8.8.8.8, 1.1.1.1 or 9.9.9.9), which does the work:

1. You type `www.example.co.ke`. Your device checks its own **cache**; if not found, it asks the resolver.
2. The resolver checks its cache. If not found, it asks a **root server**: "Where's `.ke`?"
3. The root replies with the **.ke TLD servers**.
4. The resolver asks a .ke server; it replies with the servers for **co.ke**, which point to the domain's **authoritative name servers**.
5. The resolver asks the authoritative server, which replies: `www.example.co.ke = 203.0.113.10`.
6. The resolver caches the answer and returns it to your device. Your browser connects to 203.0.113.10.

All this usually takes milliseconds, and caching means most lookups are answered from step 1 or 2.

### Caching and TTL

Each record has a **TTL (time to live)** in seconds: how long resolvers may cache it. A TTL of 3600 means changes may take up to an hour to be seen everywhere. Before moving a website to a new server, lower the TTL (e.g. to 300) a day ahead so the switch is fast. "DNS propagation" is really caches expiring.

### Record types

| Record | Purpose | Example |
|---|---|---|
| **A** | Name → IPv4 address | `www → 203.0.113.10` |
| **AAAA** | Name → IPv6 address | `www → 2001:db8::10` |
| **CNAME** | Alias to another name | `shop → myshop.platform.com` |
| **MX** | Mail servers for the domain, with priority | `@ → 10 mail.example.co.ke` |
| **TXT** | Text for verification and email security | SPF `v=spf1 include:_spf.google.com ~all`, DKIM, DMARC, site verification |
| **NS** | Authoritative name servers for the domain | `ns1.host.co.ke` |
| **PTR** | Reverse lookup: IP → name | Mail servers need correct PTRs |
| **SRV** | Location of a service (host and port) | VoIP, Microsoft 365 |
| **CAA** | Which certificate authorities may issue SSL certificates | `0 issue "letsencrypt.org"` |
| **SOA** | Zone information (primary server, serial number, timers) | One per zone |

`@` means the domain itself (e.g. `example.co.ke`).

### Practical DNS for a small business

A company with a website on a hosting server and email on Google Workspace or Microsoft 365 needs, at minimum:
- `A` records for `@` and `www` (or `www` as a CNAME) pointing to the web host.
- `MX` records from the email provider.
- `TXT` records for SPF, DKIM and DMARC so their emails don't land in spam.
- Correct `NS` records at the registrar pointing to whoever hosts the DNS.

### Local name resolution

Before DNS, computers check the **hosts file** (`C:\Windows\System32\drivers\etc\hosts` or `/etc/hosts`). Developers use it to test sites (`203.0.113.10 www.example.co.ke`). Malware sometimes edits it to redirect banking sites, so check it if one site behaves strangely.

---

## Part 2: DHCP

### What DHCP provides

When a device joins, DHCP gives it:
- **IP address** and **subnet mask**
- **Default gateway** (router)
- **DNS server(s)**
- **Lease time** (how long it may keep the address)
- Optional extras: domain name, NTP server, TFTP server for IP phones (option 66/150), etc.

### DORA: how a device gets an address

| Step | Message | From → To | Meaning |
|---|---|---|---|
| **D** | Discover | Client → broadcast (255.255.255.255) | "Is there a DHCP server? I need an address" |
| **O** | Offer | Server → client | "You can have 192.168.1.57" |
| **R** | Request | Client → broadcast | "I'd like 192.168.1.57 please" (broadcast so other servers know) |
| **A** | Acknowledge | Server → client | "It's yours for 24 hours" |

DHCP uses **UDP ports 67 (server) and 68 (client)**.

### Leases and renewal

- At **50%** of the lease, the client tries to renew with the same server; at **87.5%** it asks any server.
- Short leases (1–8 hours) suit busy guest Wi-Fi with many visitors; longer leases (1–8 days) suit stable office PCs.
- If a client gets no answer at all, Windows assigns itself an **APIPA** address (169.254.x.x): a sign DHCP failed.

### Scopes, exclusions and reservations

- **Scope (pool)**: the range handed out, e.g. 192.168.1.50 – 192.168.1.250.
- **Exclusions**: addresses inside the subnet not to hand out (kept for static devices).
- **Reservation**: a specific device (by MAC address) always gets the same IP, e.g. the office printer at 192.168.1.20. Easier to manage than static configuration on the device itself.

### Where DHCP runs

| Network | DHCP server |
|---|---|
| Home | The ISP router |
| Small office | Router or firewall |
| Enterprise | Windows Server DHCP, ISC Kea, or the core switch/firewall |

### DHCP relay

DHCP Discover is a **broadcast**, and routers don't forward broadcasts. In networks with many VLANs and one central DHCP server, each router interface is configured as a **DHCP relay** (Cisco: `ip helper-address 10.1.50.10`), which forwards the requests to the server as unicast.

### Example: Cisco router as a DHCP server

```
ip dhcp excluded-address 192.168.10.1 192.168.10.49
ip dhcp pool LAB1
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 8.8.8.8 1.1.1.1
 lease 1
```

---

## Troubleshooting

### DNS

```bash
nslookup www.example.co.ke             # which IP? which DNS server answered?
nslookup -type=MX example.co.ke        # mail servers
nslookup www.example.co.ke 8.8.8.8     # ask a specific resolver
dig www.example.co.ke +short           # Linux/macOS
ipconfig /displaydns                   # Windows DNS cache
ipconfig /flushdns                     # clear it after DNS changes
```

Symptoms of DNS trouble: websites fail by name but `ping 8.8.8.8` works; "DNS_PROBE_FINISHED_NXDOMAIN" in Chrome; some sites work and others don't after a change.

### DHCP

```bash
ipconfig /all              # Windows: is DHCP enabled? which server? lease times?
ipconfig /release
ipconfig /renew
ip a ; ip r                # Linux
```

| Symptom | Likely cause |
|---|---|
| 169.254.x.x address | No DHCP server reachable: cable, VLAN, relay, or server down |
| Wrong subnet address (e.g. 192.168.0.x instead of 10.1.x.x) | A **rogue DHCP server** (someone plugged in a home router) |
| "No addresses available" / new devices can't connect | Scope exhausted: lengthen the pool or shorten leases |
| IP conflict warnings | Static device inside the DHCP pool: use exclusions/reservations |

## Security

- **DNS filtering** (e.g. family-safe or malware-blocking resolvers) blocks known bad domains for a whole school or office.
- **DNSSEC** signs DNS records so resolvers can detect forged answers.
- **DNS over HTTPS/TLS** encrypts lookups so others on the network can't see or tamper with them.
- **DHCP snooping** on managed switches allows DHCP offers only from trusted ports, stopping rogue DHCP servers.
- Protect your domain registrar account with a strong password and 2-step verification: whoever controls your DNS controls your website and email.

:::think After a company moves its website to a new host, some staff see the new site and others still see the old one for several hours. Why, and how could it have been avoided?
DNS caching: resolvers and devices keep the old A record until its TTL expires. Lowering the TTL (e.g. to 300 seconds) a day before the move would have made the change take effect within minutes. Staff can also flush their local cache with `ipconfig /flushdns`.
:::

## Summary

- DNS translates names to IPs through a hierarchy: root → TLD (.ke) → authoritative servers, via a caching recursive resolver.
- TTL controls caching; key records: A, AAAA, CNAME, MX, TXT, NS, PTR, SRV, CAA.
- DHCP gives IP, mask, gateway and DNS using DORA on UDP 67/68, with leases, scopes, exclusions and reservations.
- Routers need DHCP relay (ip helper-address) for central servers; 169.254.x.x means DHCP failed.
- Troubleshoot with nslookup/dig and ipconfig; secure with DNS filtering, DNSSEC, encrypted DNS and DHCP snooping.

```quiz
Q: What do the letters DORA stand for? (four words)
A: Discover Offer Request Acknowledge | discover, offer, request, acknowledge | discover offer request acknowledgement
Q: Which DNS record maps a name to an IPv4 address?
A: A | A record
Q: Which DNS record lists a domain's mail servers?
A: MX | mx record
Q: Which record type is an alias from one name to another?
A: CNAME
Q: A printer must always get the same address from DHCP. What is this called?
A: reservation | dhcp reservation | static lease
Q: Which record type maps a name to an IPv6 address?
A: AAAA
Q: Which organisation runs the .ke domain registry?
A: KENIC
Q: Which Windows command clears the DNS cache?
A: ipconfig /flushdns
```

**Learn more:** [Cloudflare: What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/) · [Cloudflare: What is DHCP?](https://www.cloudflare.com/learning/network-layer/what-is-dhcp/)
