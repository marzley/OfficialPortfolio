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

## Who needs firewalls and VPNs

Every network connected to the internet is scanned by automated attack tools constantly. Firewalls decide what traffic is allowed in and out; VPNs create private, encrypted connections over public networks. Banks connect branches with site-to-site VPNs, companies let staff work from home securely, cloud servers use firewalls to expose only websites while hiding databases, and individuals use VPNs on public Wi-Fi. Network administrators, cloud engineers and security analysts configure these every day.

## Writing firewall rules: a worked example

A small company web server should allow: website traffic from anyone, SSH only from the office, and nothing else.

| # | Action | Protocol | Port | Source | Purpose |
|---|---|---|---|---|---|
| 1 | Allow | TCP | 443 | Any | HTTPS website |
| 2 | Allow | TCP | 80 | Any | HTTP (redirects to HTTPS) |
| 3 | Allow | TCP | 22 | Office public IP only | SSH administration |
| 4 | Deny | Any | Any | Any | Everything else |

The same rules with **ufw** on Ubuntu:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow from 203.0.113.10 to any port 22 proto tcp    # example office IP
sudo ufw enable
sudo ufw status numbered
```

Before enabling a firewall on a remote server, make sure the SSH rule is in place, or you'll lock yourself out. Cloud providers also have their own firewalls (security groups); both layers should agree.

## Stateful firewalls

Modern firewalls are **stateful**: they remember outgoing connections and automatically allow the replies. That's why "allow outgoing, deny incoming" still lets you browse the web: replies to your requests are recognised as part of an existing connection.

## Common ports to know

| Port | Service | Expose to the internet? |
|---|---|---|
| 80 / 443 | HTTP / HTTPS | Yes, for websites |
| 22 | SSH | Restrict by IP, keys only |
| 25, 465, 587 | Email sending (SMTP) | Mail servers only |
| 53 | DNS | DNS servers only |
| 3306 | MySQL | No: keep private |
| 5432 | PostgreSQL | No |
| 3389 | Remote Desktop (RDP) | No: use a VPN |
| 21 | FTP (unencrypted) | Avoid; use SFTP |

## Windows Defender Firewall

- Keep it on for all network profiles; mark public Wi-Fi as a **Public** network (stricter).
- When an app asks to allow access, allow it only on Private networks unless needed.
- Advanced settings show inbound/outbound rules; administrators can push rules via Group Policy.

## Port forwarding and its risks

Port forwarding on a router sends traffic from the internet to a device inside, e.g. CCTV DVRs, game servers or a small office server. Risks: anything exposed is attacked continuously, and many devices have weak default passwords or old firmware.

Safer alternatives:

- Use the vendor's secure cloud app (with strong passwords and updates) or a VPN to reach CCTV.
- Use tunnelling services (e.g. Cloudflare Tunnel) for small web apps.
- If you must forward a port, change default passwords, update firmware and restrict source IPs.

## VPN types compared

| Type | Use | Examples |
|---|---|---|
| Remote-access VPN | Staff working from home connect to the office network | WireGuard, OpenVPN, IPsec clients, vendor VPNs |
| Site-to-site VPN | Connect two office networks permanently | IPsec between routers/firewalls |
| Commercial/consumer VPN | Privacy on public Wi-Fi; hides browsing from the local network | Paid VPN apps |
| Zero-trust / mesh access | Access to specific apps based on identity and device | Tailscale, Cloudflare Access and similar |

A consumer VPN encrypts traffic between your device and the VPN provider, so you shift trust from the local Wi-Fi/ISP to the VPN company. It doesn't make you anonymous or protect you from phishing and malware. Free VPN apps of unknown origin may collect and sell data; choose reputable providers.

## Setting up WireGuard (overview)

1. Install WireGuard on the server and the client.
2. Generate a key pair on each (`wg genkey | tee private.key | wg pubkey > public.key`).
3. Server config: its private key, a VPN subnet (e.g. 10.8.0.1/24), listening UDP port, and each client's public key and allowed IP.
4. Client config: its private key, the server's public key and endpoint (public IP:port), and which traffic goes through the tunnel (AllowedIPs).
5. Open the UDP port in the firewall and start the tunnel (`wg-quick up wg0`).

WireGuard is popular because its configuration is short and it's fast on phones and low-power devices.

## Split tunnelling vs full tunnelling

| Full tunnel | Split tunnel |
|---|---|
| All traffic goes through the VPN | Only company traffic goes through the VPN |
| More secure monitoring and filtering | Less load on the office internet |
| Slower personal browsing; uses office bandwidth | Personal traffic isn't protected by company controls |

## Network segmentation

Don't put everything on one flat network. Separate:

- Staff computers
- Servers
- Guest Wi-Fi
- CCTV and IoT devices (smart TVs, printers)
- Point-of-sale/payment systems

Use VLANs and firewall rules between them, so a compromised guest phone or camera can't reach the accounting server.

## Practice

1. On an Ubuntu VM, configure ufw to allow only SSH and HTTP, then check with `sudo ufw status`.
2. Use `ss -tulpn` (Linux) or `netstat -ano` (Windows) to list listening ports and decide which should be closed.
3. Check whether your home router has port forwarding rules or UPnP enabled; disable what you don't need.
4. Draw a network with separate VLANs for staff, guests, CCTV and servers.
5. Install WireGuard on two VMs and create a tunnel between them.

:::think A small company exposes its accounting server's Remote Desktop (port 3389) to the internet so the director can work from home. What's the risk and the better solution?
RDP exposed to the internet is constantly scanned and attacked with password guessing and exploits, and is a common entry point for ransomware. Better: close the port and give the director VPN access (or a zero-trust access tool) with MFA, then use RDP only inside the VPN, keeping the server patched and accounts protected with strong passwords.
:::

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
Q: What kind of firewall remembers connections and allows reply traffic automatically?
A: stateful | stateful firewall
Q: Which default MySQL port should never be open to the internet?
A: 3306
Q: Which VPN type permanently connects two office networks? (hyphenated)
A: site-to-site | site to site
Q: What is splitting a network into separate zones like staff, guests and CCTV called?
A: segmentation | network segmentation | VLANs
```
