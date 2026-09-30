---
slug: firewalls-vpns
title: Firewalls, VPNs and remote access
after: network-security
---
# Firewalls, VPNs and remote access

Every network connected to the internet is constantly probed by automated attacks. **Firewalls** decide what traffic is allowed, and **VPNs** let people connect safely from outside. Both are core skills for network and IT support jobs.

## What a firewall does

A firewall checks each connection against **rules** and allows or blocks it. Rules usually look at:

- Source and destination **IP address**,
- **Port** and protocol (TCP 443 = HTTPS, TCP 22 = SSH, UDP 53 = DNS),
- **Direction** (inbound from the internet, or outbound to it),
- Connection **state** (is this a reply to something we started?).

### Example rule table for a small office

| # | Direction | From | To | Port | Action | Why |
|---|---|---|---|---|---|---|
| 1 | Out | LAN | Any | 80, 443 | Allow | Browsing |
| 2 | Out | LAN | Any | 53 | Allow | DNS |
| 3 | In | Any | Web server | 443 | Allow | Public website |
| 4 | In | Office VPN users | LAN | Any | Allow | Remote staff |
| 5 | In | Any | Any | Any | **Deny** | Default: block everything else |

Rules are read **top to bottom**; the first match wins. A good firewall ends with **deny all**: anything not explicitly allowed is blocked ("default deny").

## Types of firewall

| Type | Where | Example |
|---|---|---|
| Host firewall | On each computer | Windows Defender Firewall, `ufw` on Linux |
| Network firewall | Between the LAN and the internet | Router firewall, pfSense, MikroTik, FortiGate |
| Web application firewall (WAF) | In front of websites | Cloudflare, ModSecurity |
| Stateful | Remembers connections, allows replies automatically | Almost all modern firewalls |
| Next-generation (NGFW) | Also inspects apps, users, malware | FortiGate, Palo Alto, Sophos |

### ufw on a Linux server

```
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp        # SSH (better: only from your IP)
sudo ufw allow 80,443/tcp    # web
sudo ufw enable
sudo ufw status numbered
```

> Always allow SSH **before** enabling a firewall on a remote server, or you'll lock yourself out.

## NAT and port forwarding

Home and office networks use private addresses (192.168.x.x) behind **NAT**, which already blocks unsolicited inbound connections. To make a device inside reachable (e.g. a CCTV recorder), you add **port forwarding**: "send outside port 8443 to 192.168.1.50:443". Every forwarded port is a door into your network, so forward only what's needed, change default passwords, and prefer a VPN instead.

## VPNs: a private tunnel over the internet

A **VPN** (Virtual Private Network) encrypts traffic between two points so it can cross the internet safely.

| Type | Use | Examples |
|---|---|---|
| **Remote-access VPN** | A staff member at home connects to the office network | WireGuard, OpenVPN, FortiClient, Tailscale |
| **Site-to-site VPN** | The Nairobi branch and Mombasa branch networks join as one | IPsec between two routers |
| **Consumer "privacy" VPN** | Hides your browsing from the local network (café Wi-Fi) | Commercial apps |

What a VPN does and doesn't do:

- ✅ Encrypts traffic on untrusted networks (public Wi-Fi).
- ✅ Lets remote staff reach internal systems without exposing them to the internet.
- ❌ Doesn't make you anonymous or stop malware.
- ❌ A free VPN app may sell your data. Choose carefully.

### A WireGuard config (just to see the shape)

```
[Interface]
PrivateKey = <client private key>
Address = 10.8.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = <server public key>
Endpoint = vpn.example.co.ke:51820
AllowedIPs = 192.168.10.0/24     # only office traffic goes through the tunnel
PersistentKeepalive = 25
```

## Remote access safely

- Never expose **RDP** (port 3389) directly to the internet: it's one of the most attacked services. Put it behind a VPN.
- Use **SSH keys** instead of passwords for Linux servers, and disable root login.
- Turn on **multi-factor authentication** for VPNs and admin panels.
- Keep router and firewall firmware updated.
- Log and review failed login attempts.

```quiz
Q: In a firewall rule list, which rule applies: the first match or the last match?
A: first | the first match | first match
Q: What should the final firewall rule usually be? (two words)
A: deny all | default deny | deny
Q: What connects a branch network to head office permanently over the internet? (two words, hyphen allowed)
A: site-to-site | site to site | site-to-site vpn
Q: Which remote desktop port should never be exposed directly to the internet?
A: 3389
Q: Name a modern, fast VPN protocol that starts with W.
A: WireGuard
```
