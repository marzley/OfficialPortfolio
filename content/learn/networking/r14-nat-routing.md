---
slug: nat-routing
title: "NAT, gateways and routing: how packets find their way, routing tables, static and dynamic routing, NAT and PAT"
after: KEEP
---
# NAT, gateways and routing: how packets find their way, routing tables, static and dynamic routing, NAT and PAT

Switches move data **within** a network. **Routers** move data **between** networks: from your home LAN to your ISP, from a Nairobi branch to the Mombasa branch, from one country to another across the internet. Every router reads the destination IP address of each packet, looks it up in its **routing table**, and forwards the packet one step (hop) closer. And because private addresses can't travel on the internet, routers at the edge use **NAT** to swap them for public ones.

This unit explains how routing decisions are made, how routes are learned, and how NAT lets a whole office share one public IP address.

:::note What you will learn
- The default gateway and why every device needs one
- How a router forwards packets, hop by hop
- Reading a routing table; connected, static and dynamic routes
- Longest prefix match and administrative distance
- The default route 0.0.0.0/0
- Dynamic routing protocols: RIP, OSPF, EIGRP, BGP
- NAT, PAT (NAT overload) and port forwarding
- Inter-VLAN routing
- Troubleshooting routing problems
:::

## The default gateway

Every device has a **default gateway**: the IP address of the router on its own subnet. When a device sends to an address **outside** its subnet (as decided by the mask), it sends the packet to the gateway.

| Setting | Example |
|---|---|
| PC IP | 192.168.1.20/24 |
| Default gateway | 192.168.1.1 (the router's LAN interface) |

If the gateway is missing or wrong, the device can talk to neighbours on the LAN but not to other networks or the internet. This is one of the most common faults you'll fix.

## How routing works, hop by hop

1. The PC sends the packet to the gateway. The **IP addresses** are PC → website; the **MAC addresses** are PC → router.
2. The router removes the layer 2 frame, reads the destination IP, and looks it up in its routing table.
3. It picks the best route and forwards the packet out of that interface, in a new frame addressed to the **next-hop** router's MAC.
4. It decrements the packet's **TTL** (time to live) by 1. If TTL reaches 0, the packet is dropped (this prevents endless loops; `traceroute` uses it to discover each hop).
5. Repeat at every router until the packet reaches the destination network, where the last router delivers it directly.

## The routing table

A Cisco router's table (`show ip route`) might show:

```
C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
L    192.168.1.1/32 is directly connected, GigabitEthernet0/0
C    10.0.0.0/30 is directly connected, GigabitEthernet0/1
S    172.16.0.0/16 [1/0] via 10.0.0.2
O    10.20.0.0/16 [110/20] via 10.0.0.2, GigabitEthernet0/1
S*   0.0.0.0/0 [1/0] via 41.90.64.9
```

| Code | Meaning |
|---|---|
| **C** | Connected: a network on one of the router's interfaces |
| **L** | Local: the router's own address |
| **S** | Static: typed in by an administrator |
| **O** | Learned by OSPF |
| **D** | Learned by EIGRP |
| **B** | Learned by BGP |
| **\*** | Candidate default route |

Linux and Windows have routing tables too: `ip route` and `route print`.

## Longest prefix match

If several routes match a destination, the router uses the **most specific** (longest prefix).

For destination **10.1.2.50** with routes 10.0.0.0/8, 10.1.0.0/16 and 10.1.2.0/24, all three match, but **10.1.2.0/24** is chosen (24 bits is the longest match). The default route 0.0.0.0/0 matches everything but has the shortest prefix, so it's used only when nothing else matches.

```try-python
import ipaddress
routes = {
    "10.0.0.0/8": "via 10.0.0.2",
    "10.1.0.0/16": "via 10.0.0.6",
    "10.1.2.0/24": "via 10.0.0.10",
    "0.0.0.0/0": "via ISP 41.90.64.9",
}
def lookup(dest):
    d = ipaddress.ip_address(dest)
    matches = [ipaddress.ip_network(r) for r in routes if d in ipaddress.ip_network(r)]
    best = max(matches, key=lambda n: n.prefixlen)
    return best, routes[str(best)]

for dest in ["10.1.2.50", "10.1.99.1", "10.200.0.1", "8.8.8.8"]:
    print(dest, "->", *lookup(dest))
```

## The default route

`0.0.0.0/0` (the "gateway of last resort") means "anything I don't have a specific route for, send here". Home and branch routers usually have just their LAN routes plus a default route to the ISP. ISPs' core routers carry full internet routing tables instead.

## Static vs dynamic routing

| | Static routes | Dynamic routing |
|---|---|---|
| How | Admin types each route | Routers exchange routes automatically |
| Good for | Small networks, default routes, stub branches | Medium to large networks, many paths |
| Changes | Manual updates | Adapts automatically when links fail |
| Overhead | None | CPU, memory, bandwidth for updates |

Cisco static route example:

```
ip route 172.16.0.0 255.255.0.0 10.0.0.2       ! network, mask, next hop
ip route 0.0.0.0 0.0.0.0 41.90.64.9            ! default route to the ISP
```

## Dynamic routing protocols

| Protocol | Type | Where used | Notes |
|---|---|---|---|
| **RIP** (v2) | Distance vector | Labs, very small networks | Uses hop count; max 15 hops; slow |
| **OSPF** | Link state | Enterprises, campuses, ISPs internally | Open standard; uses cost (bandwidth); areas for scale |
| **EIGRP** | Advanced distance vector | Cisco-heavy enterprises | Fast convergence |
| **IS-IS** | Link state | Large ISPs | |
| **BGP** | Path vector | **Between** organisations/ISPs: the internet's routing protocol | Policy-based; how Safaricom, Liquid and others exchange routes with the world |

Interior protocols (OSPF, EIGRP, RIP, IS-IS) run **inside** one organisation. **BGP** connects **autonomous systems** (each ISP/large organisation has an AS number) and is what holds the internet together. Kenyan networks also exchange traffic locally at the **Kenya Internet Exchange Point (KIXP)**, keeping local traffic in the country (faster and cheaper).

## Administrative distance

If two **sources** offer a route to the same network, the router trusts the one with the lower **administrative distance (AD)**:

| Source | Cisco default AD |
|---|---|
| Connected | 0 |
| Static | 1 |
| EIGRP | 90 |
| OSPF | 110 |
| RIP | 120 |
| External BGP | 20 |

Between routes from the **same** protocol, the lowest **metric** wins (OSPF cost, RIP hop count). Remember the order: longest prefix first, then AD, then metric.

## NAT: Network Address Translation

Private addresses (10/8, 172.16/12, 192.168/16) aren't routed on the internet. **NAT** on the edge router replaces the private source address with a public one on the way out, and reverses it for replies.

| Type | How | Use |
|---|---|---|
| **Static NAT** | One private ↔ one public address, permanently | A server that must be reachable from the internet |
| **Dynamic NAT** | Private addresses use a pool of public addresses | Rare today |
| **PAT / NAT overload** | Many private addresses share **one** public IP, distinguished by **port numbers** | Every home and most offices |

### PAT step by step

| Inside device | Inside socket | Translated to (public IP 41.90.64.10) |
|---|---|---|
| Laptop | 192.168.1.20:51515 | 41.90.64.10:40001 |
| Phone | 192.168.1.35:51515 | 41.90.64.10:40002 |
| TV | 192.168.1.50:49200 | 41.90.64.10:40003 |

The router keeps this **translation table**. When a reply arrives at 41.90.64.10:40002, it knows to send it to the phone at 192.168.1.35:51515.

### Port forwarding

PAT allows connections **out**, but blocks unsolicited connections **in**. To reach a device inside (a CCTV recorder, a game server, a test web server), you create a **port forward**: "TCP 8000 on the public IP → 192.168.1.100:8000".

:::warning Port forwarding and CGNAT
Port forwarding exposes the device to the whole internet: keep it updated, change default passwords, or better, use a VPN. And if your ISP uses carrier-grade NAT (your router's WAN address is 100.64.x.x–100.127.x.x), port forwarding won't work without the ISP's help or a public IP.
:::

## Inter-VLAN routing

Devices in different VLANs are in different subnets, so they need a router to talk. Options:
- **Router-on-a-stick**: one router interface with sub-interfaces for each VLAN on a trunk.
- **Layer 3 switch**: switch virtual interfaces (SVIs) route between VLANs at high speed (common in enterprises).
- A **firewall** routing between VLANs, so it can also filter traffic (e.g. guests can't reach staff).

## Troubleshooting routing

1. Check the device's IP, mask and **gateway** (`ipconfig /all`).
2. `ping` the gateway. If that fails, the problem is local (layer 1–2, VLAN, wrong subnet).
3. `ping` a public IP (8.8.8.8). If the gateway works but this fails, check the router's default route, NAT and ISP link.
4. `tracert`/`traceroute` to see where packets stop.
5. On routers: `show ip route`, `show ip interface brief`, check for missing return routes (traffic can go out but replies don't know the way back).

:::think A PC at 192.168.1.20/24 can reach the router at 192.168.1.1 and a server at 10.10.0.5 behind another router, but not the internet. The main router's table has routes for 192.168.1.0/24 and 10.10.0.0/16 only. What's missing?
A default route (0.0.0.0/0) to the ISP, and probably NAT/PAT on the internet-facing interface. Without the default route, the router doesn't know where to send packets for internet addresses.
:::

## Summary

- Devices send off-subnet traffic to the default gateway; routers forward packets hop by hop, decrementing TTL.
- Routing tables hold connected, static and dynamic routes; longest prefix match wins, then administrative distance, then metric.
- 0.0.0.0/0 is the default route; static routes suit small networks, dynamic protocols (OSPF, EIGRP, BGP) suit larger ones.
- BGP connects ISPs and the internet; KIXP keeps Kenyan traffic local.
- NAT swaps private for public addresses; PAT shares one IP using ports; port forwarding allows inbound connections.

```quiz
Q: What is the default route in CIDR notation?
A: 0.0.0.0/0
Q: A router has routes 10.0.0.0/8 and 10.1.2.0/24. Which one does it use for 10.1.2.50?
A: 10.1.2.0/24 | /24
H: Longest prefix match.
Q: Which routing protocol runs the internet between ISPs?
A: BGP
Q: Which is more trusted by default, a static route or OSPF?
A: static | static route
Q: What lets many devices share one public IP by also changing port numbers?
A: PAT | nat overload | port address translation
Q: A PC can reach other PCs on its LAN but not the internet. Which setting is most likely wrong?
A: default gateway | gateway
Q: What is OSPF's default administrative distance on Cisco?
A: 110
```
