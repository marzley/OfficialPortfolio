---
slug: devices-cables
title: Network devices, cables and connectors
after: what-is-a-network
---
# Network devices, cables and connectors

Before addresses and protocols, a network is **physical**: boxes, cables and radio waves. Knowing the hardware helps you set up an office, a school lab or a cyber café, and troubleshoot when "the internet is down".

## The main devices

| Device | What it does | Where you see it |
|---|---|---|
| **Router** | Connects **different networks** together (your office LAN ↔ the internet). Picks the path for each packet using IP addresses. | The Safaricom/Zuku/Airtel box at home |
| **Switch** | Connects devices **within one network** (LAN). Sends each frame only to the right port using MAC addresses. | A box with 8, 24 or 48 ports in the server cabinet |
| **Access point (AP)** | Gives Wi-Fi access to a wired network | Ceiling units in offices and campuses |
| **Modem / ONT** | Converts the provider's signal (fibre, DSL, 4G) into Ethernet | Fibre box from the ISP |
| **Firewall** | Filters traffic by rules to block attacks | Separate device or built into the router |
| **Hub** (old) | Repeats every signal to every port: slow and insecure | Replaced by switches |

A typical home "router" is really 4-in-1: modem + router + switch + Wi-Fi access point.

## A typical small office

```
Internet (fibre) ── ONT ── Router/Firewall ── Switch (24 ports) ─┬─ PCs (cables)
                                                                 ├─ Printer
                                                                 ├─ Server / NAS
                                                                 └─ Access point ── laptops & phones (Wi-Fi)
```

## Network interface card (NIC) and MAC address

Every device connects through a **NIC** (Ethernet port or Wi-Fi chip). Each NIC has a **MAC address**, a unique hardware ID like `3C:52:82:1A:4F:9E`. Switches use MAC addresses; routers use IP addresses.

## Cables

| Cable | Used for | Max length (typical) |
|---|---|---|
| **UTP Cat5e** | 1 Gbps Ethernet | 100 m |
| **Cat6** | 1 Gbps (10 Gbps up to ~55 m) | 100 m |
| **Cat6a** | 10 Gbps | 100 m |
| **Fibre, multimode** | Inside buildings/campuses, high speed | up to a few hundred metres at 10 Gbps |
| **Fibre, single-mode** | Long distances (ISPs, between towns) | many kilometres |
| **Coaxial** | Old cable TV / some ISPs | |

> The 100-metre rule: a copper Ethernet run from switch to device should not exceed 100 m. Longer? Use fibre or add a switch in between.

## Connectors

- **RJ-45**: the 8-pin plug on Ethernet cables.
- **RJ-11**: the smaller 4/6-pin phone plug.
- **LC / SC**: common fibre connectors.
- **SFP module**: a slot on switches that takes fibre or copper modules.

## Making an Ethernet cable: T568B colour order

Most installers in Kenya use **T568B** on both ends ("straight-through"):

| Pin | Colour |
|---|---|
| 1 | White-orange |
| 2 | Orange |
| 3 | White-green |
| 4 | Blue |
| 5 | White-blue |
| 6 | Green |
| 7 | White-brown |
| 8 | Brown |

Tools: crimping tool, cable stripper, RJ-45 plugs, and a **cable tester** to confirm all 8 wires connect. Modern devices auto-detect, so "crossover" cables (T568A on one end) are rarely needed now.

## Structured cabling basics

- Cables run from each wall socket to a **patch panel** in a cabinet, then short **patch cables** connect the panel to the switch.
- Label both ends of every cable ("Office 3 – Port 12").
- Keep data cables away from power cables to avoid interference.
- Use a **UPS** (battery backup) for the router and switch; power cuts cause many "network problems".

## Wireless basics

- Wi-Fi uses the **2.4 GHz** band (longer range, slower, crowded) and **5 GHz** (faster, shorter range); Wi-Fi 6E/7 adds **6 GHz**.
- Walls, water tanks and metal roofs weaken the signal: place access points high and central.
- See the *Wi-Fi* lesson for security settings.

```quiz
Q: Which device connects different networks, like your LAN and the internet?
A: router | a router
Q: Which device connects many devices inside one LAN using MAC addresses?
A: switch | a switch
Q: What is the maximum typical length of a copper Ethernet cable run, in metres?
A: 100 | 100m | 100 m
Q: What is the name of the 8-pin plug on Ethernet cables?
A: RJ-45 | RJ45
Q: In T568B, what colour is pin 1?
A: white-orange | white orange | orange white
```
