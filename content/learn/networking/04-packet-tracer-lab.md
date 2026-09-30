---
slug: packet-tracer-first-lab
title: Your first lab in Cisco Packet Tracer
after: switching-vlans
---
# Your first lab in Cisco Packet Tracer

**Cisco Packet Tracer** is a free network simulator. You drag routers, switches and PCs onto a canvas, connect them and configure them exactly as you would real equipment. It's the best way to practise for CCNA, TVET networking units and job interviews, without buying hardware.

## Getting it

1. Create a free account at **netacad.com** (Cisco Networking Academy).
2. Enrol in the free "Getting Started with Cisco Packet Tracer" course.
3. Download Packet Tracer for Windows, Linux or macOS.

## The lab: two offices connected by a router

We'll build this:

```
 PC1 (192.168.10.10) ─┐                          ┌─ PC3 (192.168.20.10)
                      ├─ Switch1 ── Router ── Switch2 ─┤
 PC2 (192.168.10.11) ─┘   G0/0: 192.168.10.1        └─ PC4 (192.168.20.11)
                          G0/1: 192.168.20.1
```

Two networks: **192.168.10.0/24** (Sales) and **192.168.20.0/24** (Accounts). The router joins them.

## Step 1: place the devices

- Router: **2911** (Network Devices → Routers).
- Two switches: **2960**.
- Four **PCs** (End Devices).
- Connect with **Copper Straight-Through** cables: PCs to switch FastEthernet ports, switches to router Gigabit ports (G0/0 and G0/1).

The link lights are red until the router interfaces are turned on.

## Step 2: configure the router

Click the router → **CLI** tab. Press Enter, then type:

```
enable
configure terminal
hostname HQ-R1

interface gigabitEthernet0/0
 description Sales LAN
 ip address 192.168.10.1 255.255.255.0
 no shutdown
 exit

interface gigabitEthernet0/1
 description Accounts LAN
 ip address 192.168.20.1 255.255.255.0
 no shutdown
 exit

end
write memory
```

| Command | Meaning |
|---|---|
| `enable` | Privileged mode (prompt ends with `#`) |
| `configure terminal` | Global configuration mode |
| `interface ...` | Configure one port |
| `ip address A M` | Set the address and mask |
| `no shutdown` | Turn the port on (router ports start **off**) |
| `write memory` | Save, so settings survive a reboot |

## Step 3: configure the PCs

Click each PC → **Desktop** → **IP Configuration**:

| PC | IP address | Subnet mask | Default gateway |
|---|---|---|---|
| PC1 | 192.168.10.10 | 255.255.255.0 | 192.168.10.1 |
| PC2 | 192.168.10.11 | 255.255.255.0 | 192.168.10.1 |
| PC3 | 192.168.20.10 | 255.255.255.0 | 192.168.20.1 |
| PC4 | 192.168.20.11 | 255.255.255.0 | 192.168.20.1 |

The **default gateway** is the router's address on that PC's network. Without it, a PC can only talk inside its own network.

## Step 4: test

On PC1 → Desktop → **Command Prompt**:

```
ping 192.168.10.11     (same network: through the switch only)
ping 192.168.10.1      (the gateway)
ping 192.168.20.10     (other network: through the router!)
```

The first ping to another network may time out once while ARP finds MAC addresses; the next ones should reply.

Useful checks on the router:

```
show ip interface brief     (are the ports up/up with the right IPs?)
show ip route               (C = directly connected networks)
show running-config
```

## Step 5: add DHCP (so PCs get addresses automatically)

```
configure terminal
ip dhcp excluded-address 192.168.10.1 192.168.10.9
ip dhcp pool SALES
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 8.8.8.8
 exit
end
```

Now set PC1 and PC2 to **DHCP** in IP Configuration: they receive addresses from .10 upwards.

## Common mistakes

| Symptom | Likely cause |
|---|---|
| Red link lights on the router | Forgot `no shutdown` |
| Can ping inside the network but not the other one | Wrong or missing default gateway on the PC |
| "% Invalid input detected" | Typo, or you're in the wrong mode (`enable` / `configure terminal`) |
| Settings gone after reload | Forgot `write memory` |

## Next steps

- Add VLANs on one switch and route between them ("router on a stick").
- Add a third router and configure **OSPF** routing.
- Follow Jeremy's IT Lab free CCNA course, which has a Packet Tracer lab for every video.

```quiz
Q: Which command turns on a router interface?
A: no shutdown
Q: Which command saves the configuration so it survives a reboot?
A: write memory | copy running-config startup-config | wr
Q: What must each PC have set to reach other networks? (two words)
A: default gateway | gateway
Q: Which command shows all interfaces with their IPs and status in one table?
A: show ip interface brief | sh ip int br
Q: What free Cisco website gives you Packet Tracer?
A: netacad | netacad.com | networking academy
```
