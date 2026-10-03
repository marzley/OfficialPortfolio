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

## Who works with network hardware

Every office, school, hospital, hotel, bank branch, SACCO and cyber café needs a working network. Network technicians install cables and Wi-Fi, ICT officers configure routers and switches, and support staff fix "no internet" problems daily. Fibre providers (Safaricom Home Fibre, Zuku, Faiba and others) employ installers, and businesses hire technicians to set up and maintain their networks. Understanding devices and cables is the foundation for networking certifications such as CompTIA Network+ and Cisco CCNA.

## Devices in more detail

| Device | OSI layer | Works with | Typical place |
|---|---|---|---|
| Hub (old) | 1 (Physical) | Repeats signals to every port | Rarely used today |
| Switch | 2 (Data link) | MAC addresses; sends frames only to the right port | Office network cabinet |
| Router | 3 (Network) | IP addresses; connects different networks | Between LAN and internet |
| Wireless access point (AP) | 2 | Connects Wi-Fi devices to the wired network | Ceilings and walls |
| Modem / ONT | 1–2 | Converts the provider's signal (fibre, DSL, cable) | Where the ISP line enters |
| Firewall | 3–7 | Allows or blocks traffic by rules | At the network edge |
| Home "router" | Several | Router + switch + Wi-Fi AP + firewall + DHCP in one box | Homes and small offices |

## Managed vs unmanaged switches

| Unmanaged | Managed |
|---|---|
| Plug and play, no configuration | Configurable through a web page or command line |
| Cheap | More expensive |
| Good for homes and tiny offices | VLANs, port security, monitoring, link aggregation |

**PoE (Power over Ethernet)** switches power devices like IP phones, Wi-Fi access points and CCTV cameras through the network cable, so no separate power socket is needed. Check the switch's PoE power budget (watts) against the devices you'll connect.

## MAC addresses up close

A MAC address is a 48-bit hardware address written in hexadecimal, like `3C:52:82:1A:9F:04`. The first half identifies the manufacturer (OUI). Switches learn which MAC address is on which port and store it in a **MAC address table**.

```
Windows:  ipconfig /all       → "Physical Address"
Linux:    ip link             → "link/ether"
Android:  Settings → About phone → Status (Wi-Fi MAC; modern phones may use a randomised MAC per network)
```

## Cable categories

| Category | Max speed (typical) | Notes |
|---|---|---|
| Cat5e | 1 Gbps | Still common, fine for most offices |
| Cat6 | 1 Gbps (10 Gbps for short runs) | Common for new installations |
| Cat6a | 10 Gbps up to 100 m | Thicker, more expensive |
| Fibre (single-mode / multi-mode) | 10 Gbps and much more | Long distances, between buildings, ISP connections |

Copper Ethernet runs are limited to about 100 metres; beyond that use a switch in between or fibre. Fibre also resists electrical interference and lightning damage between buildings.

## Straight-through vs crossover

- **Straight-through** (T568B on both ends): PC to switch, switch to router. The normal cable.
- **Crossover** (T568A on one end, T568B on the other): historically for PC to PC or switch to switch. Most modern devices auto-detect (Auto-MDI/MDIX), so straight-through cables work almost everywhere now.

## Tools of a network technician

| Tool | Use |
|---|---|
| Crimping tool | Attaches RJ45 connectors to cable |
| Cable stripper | Removes the outer jacket without damaging wires |
| Punch-down tool | Terminates cables on patch panels and wall sockets |
| Cable tester | Checks each wire is connected in the right order |
| Toner and probe | Finds which cable is which in a bundle |
| Wi-Fi analyser app | Measures signal strength and channel congestion |
| Labelling machine | Labels both ends of every cable |

## Wi-Fi standards and planning

| Standard | Also called | Notes |
|---|---|---|
| 802.11n | Wi-Fi 4 | Older, 2.4 and 5 GHz |
| 802.11ac | Wi-Fi 5 | 5 GHz, common in homes |
| 802.11ax | Wi-Fi 6 / 6E | Better with many devices; 6E adds 6 GHz |
| 802.11be | Wi-Fi 7 | Newest generation |

- **2.4 GHz**: longer range, goes through walls better, slower, more interference (microwaves, neighbours).
- **5 GHz**: faster, shorter range.
- Place access points centrally and high, away from metal and thick concrete walls.
- For large buildings, use several access points connected by cable (or a mesh system) rather than one powerful router.
- Use WPA2 or WPA3 with a strong password; create a separate **guest network** for visitors.

## Planning a small office network

For an office of 15 staff:

1. Fibre connection from an ISP → ONT/modem → router/firewall.
2. A 24-port switch (PoE if using IP phones or access points) in a lockable cabinet with a UPS.
3. A patch panel; cables run to wall sockets at each desk, labelled.
4. Two ceiling-mounted access points for Wi-Fi coverage; a separate guest Wi-Fi.
5. A printer with a fixed (reserved) IP address.
6. Documentation: a network diagram, IP plan, passwords stored securely, and ISP support contacts.

## Practice

1. Find the MAC address and IP address of your computer and phone.
2. Look at your home or school router: identify the WAN port, LAN ports and the Wi-Fi bands it offers.
3. Use a Wi-Fi analyser app to see which channels nearby networks use.
4. Draw a network diagram for a small shop with a router, switch, 3 PCs, a printer and Wi-Fi.
5. If you have the tools, crimp a T568B cable and test it.

:::think Users at the far end of an office complain Wi-Fi is slow, while those near the router are fine. What could you suggest?
The signal weakens with distance and walls. Options: add a second access point wired back to the switch (best), use a mesh Wi-Fi system, move the router or AP to a central and higher position, switch nearby users to 5 GHz and distant users to 2.4 GHz if needed, and check for channel interference with a Wi-Fi analyser.
:::

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
Q: Which switch feature powers phones, cameras and access points through the network cable? (abbreviation)
A: PoE | Power over Ethernet
Q: Which Wi-Fi band has longer range but slower speeds: 2.4 GHz or 5 GHz?
A: 2.4 GHz | 2.4
Q: Which tool finds which cable is which in a bundle? (three words)
A: toner and probe | tone generator | toner
Q: Which type of switch supports VLANs and configuration?
A: managed | managed switch
```
