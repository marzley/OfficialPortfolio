---
slug: what-is-a-network
title: "What is a computer network? Types, devices, topologies, models of sharing and speed explained"
after: KEEP
---
# What is a computer network? Types, devices, topologies, models of sharing and speed explained

A **network** is two or more devices connected so they can share data and resources: files, printers, an internet connection, a school management system or an M-Pesa till. Your phone on Wi-Fi at a café, the computers in a cyber, the CCTV cameras in a supermarket and the servers behind Safaricom, KRA's iTax and your bank are all parts of networks. The **internet** itself is a network of networks: millions of them connected together.

Networking is the foundation for almost every IT career: network and system administration, cybersecurity, cloud, telecoms, and even software development (every app talks over a network). This first unit gives you the vocabulary and big picture you'll build on in every later lesson.

:::note What you will learn
- Why networks exist and who uses them
- Network types by size: PAN, LAN, WLAN, MAN, WAN (and SAN, VPN)
- The devices: routers, switches, access points, modems/ONTs, firewalls, servers and clients
- Wired and wireless media at a glance
- Topologies: star, bus, ring, mesh, hybrid
- Client–server vs peer-to-peer
- Bandwidth, latency, throughput, jitter and packet loss
- How a request travels from your phone to a website
- Jobs that use networking
:::

## Why do we need networks?

| Need | Example |
|---|---|
| **Share resources** | One printer or internet line for a whole office |
| **Share data** | A school's student records accessed from every staff computer |
| **Communicate** | Email, WhatsApp, video calls, VoIP phones |
| **Centralise and back up** | Files stored on a server instead of 30 separate laptops |
| **Run business systems** | Point-of-sale tills, M-Pesa, banking, hospital records, KRA eTIMS |
| **Remote access** | Working from home, managing a server in another city |

Without networks, every computer would be an island and data would move on flash disks.

## Who uses networks, and where?

- **Homes**: a Wi-Fi router connecting phones, TVs and laptops to a fibre or 4G/5G internet line.
- **Schools and universities**: computer labs, staff networks, campus Wi-Fi, e-learning systems.
- **Businesses**: offices, supermarkets with tills and CCTV, banks linking branches, factories with sensors.
- **Hospitals**: patient records, lab machines and imaging systems.
- **Government**: eCitizen, KRA, county offices, the National Optic Fibre Backbone (NOFBI).
- **Internet service providers (ISPs)**: Safaricom, Airtel, Zuku, Faiba and others running huge networks of fibre, towers and data centres.
- **Data centres and cloud**: thousands of servers connected by high-speed switches.

## Types of networks by size

| Type | Covers | Example |
|---|---|---|
| **PAN** (Personal Area Network) | A few metres | Phone to Bluetooth earphones or a smartwatch |
| **LAN** (Local Area Network) | A room, building or campus | A school's computer lab, an office floor |
| **WLAN** (Wireless LAN) | Same as LAN, over Wi-Fi | Home or café Wi-Fi |
| **CAN** (Campus Area Network) | Several buildings on one site | A university campus |
| **MAN** (Metropolitan Area Network) | A city | A fibre ring linking a company's branches across Nairobi |
| **WAN** (Wide Area Network) | Countries and continents | The internet; a bank linking all its branches countrywide |

Two more terms you'll meet:
- **SAN** (Storage Area Network): a fast network connecting servers to shared storage in data centres.
- **VPN** (Virtual Private Network): an encrypted "tunnel" that makes a remote device or branch act as if it were on the private network (covered in the firewalls and VPN lesson).

## The devices you will meet

| Device | Job | Works with |
|---|---|---|
| **Router** | Connects *different* networks and decides where traffic goes | IP addresses (layer 3) |
| **Switch** | Connects devices *inside* one LAN | MAC addresses (layer 2) |
| **Access point (AP)** | Lets Wi-Fi devices join a wired network | Radio + Ethernet |
| **Modem / ONT** | Converts the provider's signal (fibre, DSL, cable, 4G/5G) | ISP connection |
| **Firewall** | Filters traffic to keep attackers out | Rules about addresses and ports |
| **Server** | Provides a service: website, files, email, database | Any |
| **Client** | Uses a service: your laptop's browser, a phone app | Any |
| **Hub** (old) | Repeats every signal to every port | Replaced by switches |

Home "routers" from Safaricom, Zuku, Airtel or Faiba are usually **modem/ONT + router + switch + access point + firewall** in one box. In offices these are usually separate devices so each can be bigger and better managed.

## Media: how the signal travels

| Medium | Typical use | Notes |
|---|---|---|
| **Copper twisted pair** (Cat5e, Cat6) | Office and home wiring | Up to 100 m per run; RJ45 connectors |
| **Fibre optic** | ISP lines, building backbones, long distances | Light signals; very fast; immune to electrical interference |
| **Wireless (Wi-Fi)** | Laptops, phones | Convenient; affected by walls and interference |
| **Mobile (4G/5G)** | Phones, MiFi routers, rural sites | Coverage-dependent |
| **Microwave and satellite** | Remote areas, backhaul links | Long distances without cables |

The devices and cables lesson covers these in detail.

## Network topologies

The **topology** is the shape of the network: how devices are connected.

| Topology | Shape | Pros | Cons |
|---|---|---|---|
| **Star** | Every device connects to a central switch | Easy to add devices; one cable failing affects only one device | The central switch is a single point of failure |
| **Bus** | All devices share one cable | Cheap (old networks) | One break takes everything down |
| **Ring** | Each device connects to two neighbours | Predictable; used in some fibre networks | A break can disrupt the ring (unless it's a dual ring) |
| **Mesh** | Devices have many links to each other | Very reliable; many paths | Expensive, complex |
| **Hybrid** | A mix | Fits real buildings | More planning |

Real networks are usually hybrids: a star in each office, connected by a ring or partial mesh of fibre between buildings.

**Physical vs logical topology**: the physical topology is how cables run; the logical topology is how data actually flows. Wi-Fi looks like a star physically (everyone to the AP) but devices share the same radio channel.

## Client–server vs peer-to-peer

| | Client–server | Peer-to-peer (P2P) |
|---|---|---|
| How | Central servers provide services; clients request them | Every computer can share with every other |
| Best for | Businesses, websites, schools | 2–5 computers at home, file sharing apps |
| Security and backup | Centralised, easier | Each machine managed separately |
| Cost | Needs servers and admin | Cheap to start |

## Speed and quality words

| Term | Meaning | Example |
|---|---|---|
| **Bandwidth** | Maximum data per second | 100 Mbps (megabits per second) |
| **Throughput** | Speed you actually get | 70 Mbps on a 100 Mbps line |
| **Latency** | Time for a message to arrive, in milliseconds (ms) | 20 ms to a Nairobi server, 150+ ms to a US server |
| **Jitter** | Variation in latency | Causes choppy video calls |
| **Packet loss** | Share of data that never arrives | 1–2% loss makes calls break up |

Bits vs bytes: **8 bits = 1 byte**. Internet packages are sold in **Mbps** (megabits), but downloads show **MB/s** (megabytes). Divide by 8:

```try-python
for mbps in [10, 20, 40, 100, 1000]:
    print(f"{mbps} Mbps package -> about {mbps / 8:.1f} MB/s at best")

size_gb = 4                       # a 4 GB movie
speed_mbps = 20
seconds = size_gb * 1000 * 8 / speed_mbps
print(f"Downloading {size_gb} GB at {speed_mbps} Mbps takes about {seconds / 60:.0f} minutes")
```

## How a request travels: opening a website

When you type `www.example.co.ke` on your phone:

1. Your phone is connected to the Wi-Fi **access point** (wireless LAN).
2. It asks a **DNS server** for the website's IP address.
3. It sends the request to its **default gateway** (the home router).
4. The router forwards it to your **ISP**, which routes it across many **routers** and **fibre links** (the WAN/internet) to the web server's data centre.
5. The **server** replies; the reply travels back the same way, possibly through different routes.
6. All of this usually takes well under a second.

Each later lesson zooms into one part of this journey: addresses, DNS, routing, switching, Wi-Fi and security.

## Careers that use networking

Network technician, network administrator/engineer, systems administrator, NOC (network operations centre) engineer at an ISP, cybersecurity analyst, cloud engineer, field engineer installing fibre and CCTV, IT support officer. Certifications like CompTIA Network+ and Cisco CCNA are covered in the careers lesson.

:::think A small hotel in Naivasha has a reception PC, a manager's laptop, a printer, 8 CCTV cameras and guest Wi-Fi. Which devices would the network need, and what topology is most likely?
An ISP modem/ONT, a router with a firewall, a switch (ideally PoE to power cameras), one or more Wi-Fi access points (with a separate guest network), and the end devices. Physically it would be a star (everything cabled to the switch), with Wi-Fi as wireless stars around each AP.
:::

## Summary

- A network connects devices to share data and resources; the internet is a network of networks.
- By size: PAN, LAN/WLAN, CAN, MAN, WAN; plus SAN and VPN.
- Routers join networks, switches connect devices in a LAN, APs add Wi-Fi, modems/ONTs connect to the ISP, firewalls filter traffic.
- Topologies: star (most common), bus, ring, mesh, hybrid; client–server vs peer-to-peer.
- Bandwidth is the maximum, throughput is what you get, latency is delay; divide Mbps by 8 for MB/s.

```quiz
Q: Which device connects *different* networks, for example your home network to the internet?
A: router | a router
Q: Which device connects computers *inside* the same LAN?
A: switch | a switch | network switch
Q: A computer lab in one school building is which type of network (PAN, LAN, MAN or WAN)?
A: LAN
Q: Which topology connects every device to one central switch?
A: star | star topology
Q: About how many megabytes per second can a 40 Mbps connection download at best?
A: 5 | 5 MB/s | 5MB/s
H: Divide megabits by 8.
Q: What is the variation in latency that makes calls choppy called?
A: jitter
```

**Learn more:** [Cloudflare Learning Center: What is a LAN?](https://www.cloudflare.com/learning/network-layer/what-is-a-lan/) · [Cisco Networking Academy (free courses)](https://www.netacad.com/)
