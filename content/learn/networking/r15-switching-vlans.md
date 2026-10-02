---
slug: switching-vlans
title: "Switching, MAC addresses, ARP and VLANs: how LANs really work, trunks, spanning tree and PoE"
after: KEEP
---
# Switching, MAC addresses, ARP and VLANs: how LANs really work, trunks, spanning tree and PoE

Inside every office, school and data centre, **switches** connect the computers, printers, phones, access points and cameras. They work at **layer 2** using **MAC addresses**, deciding which port each frame should go out of. **VLANs** let one physical switch act like several separate networks, so staff, students, guests and CCTV can share the same cabling but stay apart. This unit explains how switches learn and forward, how ARP links IP addresses to MAC addresses, and how VLANs, trunks and spanning tree are used in real networks.

:::note What you will learn
- MAC addresses: format, OUI, unicast/broadcast
- How a switch learns MAC addresses and forwards frames
- Collision and broadcast domains; hubs vs switches
- ARP: finding a MAC address from an IP address
- VLANs: why and how, access vs trunk ports, 802.1Q tagging, native VLAN
- Inter-VLAN routing
- Spanning Tree Protocol and loops
- Managed vs unmanaged switches, PoE, port security
- Basic Cisco switch commands
:::

## MAC addresses

A **MAC (Media Access Control) address** is a **48-bit** hardware address burned into each network interface (Ethernet card, Wi-Fi card, phone):

```
3C:52:82:1A:0F:9B      (Linux/macOS style)
3C-52-82-1A-0F-9B      (Windows)
3c52.821a.0f9b         (Cisco)
```

- The first 24 bits are the **OUI** (Organisationally Unique Identifier) showing the manufacturer.
- `FF:FF:FF:FF:FF:FF` is the **broadcast** MAC: every device on the LAN receives it.
- MAC addresses only matter on the **local** network; routers replace them at every hop.
- Phones and laptops often use **random/private MAC addresses** per Wi-Fi network for privacy, which matters if you use MAC-based reservations or filtering.

Find yours: `ipconfig /all` (Physical Address), `ip link` (Linux).

## How a switch works

A switch keeps a **MAC address table** (CAM table) mapping MAC addresses to ports.

1. **Learn**: when a frame arrives, the switch records the **source** MAC and the port it came in on.
2. **Forward**: it looks up the **destination** MAC:
   - Known → send out only that port.
   - Unknown → **flood** out all ports except the incoming one (the reply will teach it where that device is).
   - Broadcast → flood to all ports in the VLAN.
3. **Age out**: entries not seen for a while (typically 5 minutes) are removed.

```try-python
mac_table = {}
frames = [  # (in_port, src_mac, dst_mac)
    (1, "AA", "BB"),
    (2, "BB", "AA"),
    (3, "CC", "FF"),       # FF = broadcast
    (1, "AA", "CC"),
]
ports = [1, 2, 3, 4]
for port, src, dst in frames:
    mac_table[src] = port                       # learn
    if dst == "FF" or dst not in mac_table:
        out = [p for p in ports if p != port]   # flood
        action = "flood"
    else:
        out = [mac_table[dst]]
        action = "forward"
    print(f"frame {src}->{dst} in port {port}: {action} to {out}; table {mac_table}")
```

## Collision and broadcast domains

| Device | Collision domain | Broadcast domain |
|---|---|---|
| **Hub** (old) | All ports share one (only one device can talk at a time) | One |
| **Switch** | Each port is its own (full duplex, no collisions) | One per VLAN |
| **Router** | Each interface separate | Each interface separate: routers stop broadcasts |

That's why hubs disappeared: switches let every device send and receive at full speed simultaneously.

## ARP: Address Resolution Protocol

To send a frame to `192.168.1.50` on the same LAN, a PC needs its MAC address. ARP finds it:

1. PC broadcasts: "**Who has 192.168.1.50? Tell 192.168.1.20**" (destination MAC FF:FF:FF:FF:FF:FF).
2. The device with that IP replies directly: "**192.168.1.50 is at 3C:52:82:1A:0F:9B**".
3. The PC stores the answer in its **ARP cache** for a few minutes.

For destinations on **other** networks, the PC ARPs for the **gateway's** MAC, not the remote host's.

```bash
arp -a          # Windows/Linux/macOS: view the ARP cache
ip neigh        # Linux
```

**ARP spoofing**: an attacker on the LAN replies falsely ("I'm the gateway"), intercepting traffic. Managed switches defend with **Dynamic ARP Inspection**. IPv6 uses NDP instead of ARP.

## VLANs: Virtual LANs

A **VLAN** splits one physical switch (or many) into separate logical networks. Each VLAN is its **own broadcast domain** and usually its **own subnet**.

| Why VLANs | Example |
|---|---|
| **Security** | Guests and CCTV can't reach staff PCs or servers |
| **Smaller broadcast domains** | Less broadcast traffic per device |
| **Flexibility** | Group users by department regardless of physical location |
| **Quality of service** | Voice VLAN for IP phones gets priority |

Example school design:

| VLAN | Name | Subnet |
|---|---|---|
| 10 | LAB1 | 10.20.10.0/24 |
| 20 | STAFF | 10.20.20.0/24 |
| 30 | STUDENT-WIFI | 10.20.32.0/22 |
| 40 | CCTV | 10.20.40.0/24 |
| 60 | GUEST | 10.20.60.0/24 |
| 99 | MANAGEMENT | 10.20.99.0/24 (switch and AP management) |

### Access ports and trunk ports

| Port type | Carries | Connects to |
|---|---|---|
| **Access** | One VLAN, untagged | PCs, printers, cameras |
| **Trunk** | Many VLANs, tagged | Other switches, routers, firewalls, Wi-Fi APs with several SSIDs |

### 802.1Q tagging

On a trunk, each frame gets a 4-byte **802.1Q tag** containing the **VLAN ID** (1–4094), so the receiving switch knows which VLAN it belongs to. Frames on the **native VLAN** travel untagged (VLAN 1 by default; best practice is to change it to an unused VLAN for security).

## Inter-VLAN routing

VLANs are separate networks, so traffic between them needs **routing**: a router-on-a-stick, a **layer 3 switch** with SVIs, or a firewall. Routing between VLANs is where you apply access control (e.g. allow staff → server, block guests → anything internal).

## Spanning Tree Protocol (STP)

Network designers add **redundant links** between switches so one cable failure doesn't cut people off. But layer 2 has no TTL, so a loop lets broadcast frames circle forever (a **broadcast storm**) and brings the network down within seconds.

**STP** (IEEE 802.1D; faster versions **RSTP** 802.1w and per-VLAN variants) prevents loops:
1. Switches elect a **root bridge** (lowest bridge ID).
2. Each switch finds its best path to the root.
3. Redundant ports are put into **blocking** state.
4. If an active link fails, a blocked port takes over.

**Classic office mistake**: someone plugs both ends of a cable into the same switch, or connects two wall ports together. With STP enabled, it's harmless; on cheap unmanaged switches without STP, the whole network may freeze.

Features like **PortFast** (for ports to end devices) and **BPDU Guard** (shut a port if a switch appears where a PC should be) make STP faster and safer.

## Managed vs unmanaged switches

| | Unmanaged | Managed |
|---|---|---|
| Configuration | None: plug and play | Web/CLI configuration |
| VLANs, STP control, monitoring | No | Yes |
| Price | Cheap | More expensive |
| Use | Homes, very small offices | Businesses, schools, anything with VLANs or CCTV |

**PoE (Power over Ethernet)** switches power devices through the network cable: IP cameras, Wi-Fi access points, IP phones. Check the **PoE budget** (total watts) covers all devices, and the standard (802.3af/at/bt).

**Port security** limits which/how many MAC addresses can use a port, stopping someone plugging an unknown device into a classroom wall socket.

## Basic Cisco switch commands

```
enable
configure terminal
vlan 10
 name LAB1
vlan 40
 name CCTV
interface fastEthernet0/5
 switchport mode access
 switchport access vlan 10
interface gigabitEthernet0/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30,40,60,99
end
show vlan brief
show interfaces trunk
show mac address-table
copy running-config startup-config
```

Practise these in Cisco Packet Tracer (see the Packet Tracer lab lesson).

:::think A teacher's PC in VLAN 20 can't print to a printer in VLAN 50, but PCs in VLAN 50 can. Both VLANs exist on the switch. What's likely missing?
Inter-VLAN routing or a rule allowing it: the router/layer 3 switch may not have an interface (SVI or sub-interface) for VLAN 50, the trunk may not allow VLAN 50, or a firewall/ACL blocks VLAN 20 → 50. Check `show interfaces trunk`, the routing device's interfaces, and ACLs.
:::

## Summary

- MAC addresses are 48-bit hardware addresses used on the local network; the OUI identifies the maker.
- Switches learn source MACs, forward known destinations, flood unknown and broadcast frames.
- ARP maps IPv4 addresses to MACs via broadcast; check with `arp -a`; beware ARP spoofing.
- VLANs split switches into separate broadcast domains; access ports carry one VLAN, trunks carry many with 802.1Q tags.
- STP blocks redundant links to stop loops; managed switches add VLANs, PoE, monitoring and port security.

```quiz
Q: How many bits long is a MAC address?
A: 48 | 48 bits
Q: Which protocol finds the MAC address for a known IPv4 address?
A: ARP
Q: What does a switch do with a frame for an unknown destination MAC?
A: flood | floods it | floods
Q: Which standard tags VLANs on trunk links?
A: 802.1Q | ieee 802.1q | dot1q
Q: What kind of port carries many VLANs between switches?
A: trunk | trunk port
Q: Which protocol prevents loops between switches?
A: STP | spanning tree | spanning tree protocol
Q: What is the broadcast MAC address?
A: FF:FF:FF:FF:FF:FF | ff-ff-ff-ff-ff-ff | ffff.ffff.ffff
```
