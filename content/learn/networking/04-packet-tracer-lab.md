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

## Why practise with Packet Tracer

Real routers and switches are expensive, and mistakes on a live network can take an office offline. Cisco Packet Tracer is a free simulator that lets you build networks, configure devices with the same commands as real Cisco equipment, and watch packets move. It's used in CCNA training, university networking courses and TVET colleges, and it's the best way to gain hands-on confidence before touching production equipment.

## Understanding the command-line modes

| Prompt | Mode | How to enter | Used for |
|---|---|---|---|
| `Router>` | User EXEC | Default | Basic viewing |
| `Router#` | Privileged EXEC | `enable` | show commands, saving, reloading |
| `Router(config)#` | Global configuration | `configure terminal` | Device-wide settings |
| `Router(config-if)#` | Interface configuration | `interface g0/0` | IP addresses, enabling ports |
| `Router(config-line)#` | Line configuration | `line console 0` / `line vty 0 4` | Console and remote access passwords |

`exit` goes up one level; `end` (or Ctrl+Z) returns to privileged mode. Press `?` at any prompt to see available commands, and Tab to complete them.

## Securing the router (basic hardening)

```
Router> enable
Router# configure terminal
Router(config)# hostname HQ-R1
HQ-R1(config)# enable secret Str0ngEnablePass!
HQ-R1(config)# service password-encryption
HQ-R1(config)# banner motd #Authorised access only#
HQ-R1(config)# line console 0
HQ-R1(config-line)# password C0nsolePass!
HQ-R1(config-line)# login
HQ-R1(config-line)# exit
HQ-R1(config)# end
HQ-R1# copy running-config startup-config
```

Use `enable secret` (hashed) rather than `enable password`. In real networks, use strong unique passwords and store them in a password manager. (The passwords above are only lab examples.)

## Enabling SSH instead of Telnet

Telnet sends passwords in plain text. Configure SSH for remote management:

```
HQ-R1(config)# ip domain-name lab.local
HQ-R1(config)# username admin secret AdminPass123!
HQ-R1(config)# crypto key generate rsa modulus 2048
HQ-R1(config)# ip ssh version 2
HQ-R1(config)# line vty 0 4
HQ-R1(config-line)# transport input ssh
HQ-R1(config-line)# login local
```

Test from a PC's Command Prompt in Packet Tracer: `ssh -l admin 192.168.10.1`.

## Adding VLANs on a switch

VLANs split one physical switch into separate networks, for example Staff (VLAN 10) and Guests (VLAN 20):

```
Switch(config)# vlan 10
Switch(config-vlan)# name STAFF
Switch(config-vlan)# vlan 20
Switch(config-vlan)# name GUESTS
Switch(config-vlan)# exit
Switch(config)# interface range fa0/1 - 10
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# interface range fa0/11 - 20
Switch(config-if-range)# switchport access vlan 20
Switch(config-if-range)# end
Switch# show vlan brief
```

Devices in different VLANs can't talk unless a router (or layer-3 switch) routes between them, which is where firewall rules can control access.

## Router-on-a-stick (routing between VLANs)

```
Switch(config)# interface g0/1
Switch(config-if)# switchport mode trunk          # carries all VLANs to the router

Router(config)# interface g0/0
Router(config-if)# no shutdown
Router(config-if)# interface g0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
Router(config-subif)# interface g0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0
```

Each VLAN's PCs use their sub-interface address as the default gateway.

## Static routes between routers

When two routers connect different networks, each must know how to reach the other's LAN:

```
HQ-R1(config)# ip route 192.168.30.0 255.255.255.0 10.0.0.2      # Branch LAN via the branch router
BR-R1(config)# ip route 192.168.10.0 255.255.255.0 10.0.0.1      # HQ LAN via the HQ router
BR-R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1                 # default route: everything else via HQ
```

Larger networks use dynamic routing protocols such as OSPF, which share routes automatically.

## Using simulation mode

1. Click **Simulation** (bottom right) instead of Realtime.
2. Use the envelope (Add Simple PDU) to send a ping from one PC to another.
3. Press **Play** or step through and click each packet to see its layers (Ethernet, IP, ICMP) and which device handles it.
4. Watch ARP requests appear first when a device doesn't yet know a MAC address.

This shows exactly how switching, ARP and routing work, which is hard to see on real equipment.

## Troubleshooting checklist in the lab

| Symptom | Check |
|---|---|
| Interface shows red triangles | `no shutdown`; correct cable type |
| PC can ping its gateway but not other networks | Routes on both routers; default gateway on the far PC |
| PCs in a VLAN can't reach the gateway | Port in the right VLAN; trunk configured; sub-interface encapsulation matches VLAN number |
| DHCP not working | Pool network/default-router correct; excluded addresses; PC set to DHCP |
| Lost config after reload | `copy running-config startup-config` |

Commands to diagnose: `show ip interface brief`, `show running-config`, `show ip route`, `show vlan brief`, `show interfaces trunk`, `show mac address-table`.

## Practice projects

1. Build a two-VLAN office with router-on-a-stick and DHCP for both VLANs.
2. Connect HQ and Branch routers with static routes and test pings across.
3. Secure all devices with enable secret, console passwords, SSH and banners.
4. Add a server with a web service (HTTP) and DNS in Packet Tracer and browse to it by name from a PC.
5. Save your `.pkt` files and document each lab with a diagram and IP table for your portfolio.

:::think After configuring both routers, PC-A (HQ) can ping the branch router's HQ-side interface but not PC-B in the branch LAN. Where would you look?
Check that the branch router has a route back to the HQ LAN (replies need a return path), that PC-B's default gateway is set to the branch router's LAN interface, that the branch LAN interface is up (`show ip interface brief`), and that both routers' routes point to the correct next-hop addresses (`show ip route`).
:::

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
Q: Which command enters global configuration mode? (two words)
A: configure terminal | conf t
Q: Which command creates a hashed privileged-mode password? (two words)
A: enable secret
Q: Which switchport mode carries several VLANs between a switch and a router?
A: trunk
Q: Which command shows the routing table? (three words)
A: show ip route
```
