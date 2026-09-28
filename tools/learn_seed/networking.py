from common import track, lesson

n = track("networking", "Networking", "none",
          "From what a network is to subnetting, CIDR, VLSM, IPv6, routing, VLANs and troubleshooting, with calculators and endless practice.")

lesson(n, "what-is-a-network", "What is a computer network?", """
# What is a computer network?

A **network** is two or more devices connected so they can share data and resources: files, printers, an internet connection, a school system or an M-Pesa till. Your phone on Wi-Fi at a café, the computers in a cyber, and the servers behind Safaricom are all parts of networks.

## Types of networks by size

| Type | Covers | Example |
|---|---|---|
| **PAN** (Personal Area Network) | A few metres | Phone to Bluetooth earphones |
| **LAN** (Local Area Network) | A room, building or campus | A school's computer lab, an office |
| **WLAN** (Wireless LAN) | Same as LAN, over Wi-Fi | Home Wi-Fi |
| **MAN** (Metropolitan Area Network) | A city | A fibre ring linking a university's campuses in Nairobi |
| **WAN** (Wide Area Network) | Countries and continents | The internet; a bank linking all its branches |

## The devices you will meet

- **Router**: connects *different* networks together and decides where traffic goes (your home router connects your LAN to your internet provider).
- **Switch**: connects devices *inside* one LAN using their MAC addresses. Most offices have one or more.
- **Access point (AP)**: lets Wi-Fi devices join a wired network.
- **Modem / ONT**: turns the provider's signal (fibre, DSL, 4G/5G) into something your router understands. Home "routers" from Safaricom, Zuku or Airtel are usually modem + router + switch + access point in one box.
- **Firewall**: filters traffic to keep attackers out.
- **Server**: a computer that provides a service (website, files, email, database).
- **Client**: a device that uses a service (your laptop's browser).

## Network topologies

The **topology** is the shape of the network.

- **Star**: every device connects to a central switch. Most common today; one cable failing affects only one device.
- **Bus**: all devices share one cable (old; one break takes everything down).
- **Ring**: each device connects to two neighbours (used in some fibre networks).
- **Mesh**: devices have many links to each other. Very reliable; used by internet backbones and mesh Wi-Fi systems.
- **Hybrid**: a mix, which is what real networks usually are.

## Client–server vs peer-to-peer

- **Client–server**: central servers provide services; clients request them. Easier to secure and back up. Used by businesses and websites.
- **Peer-to-peer (P2P)**: every computer can share with every other. Simple for 2–5 computers at home, hard to manage when bigger.

## Speed words

- **Bandwidth**: how much data can pass per second, e.g. 100 **Mbps** (mega*bits* per second). Divide by 8 for mega*bytes*: 100 Mbps ≈ 12.5 MB/s.
- **Latency**: how long one message takes to arrive, in milliseconds (ms). Low latency matters for calls and games.
- **Throughput**: the speed you actually get, usually less than the bandwidth.

> Tip: Internet packages are sold in Mbps, but downloads show MB/s. A 20 Mbps package downloads at about 2.5 MB/s at best.

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
```

**Learn more:** [Cloudflare Learning Center: What is a LAN?](https://www.cloudflare.com/learning/network-layer/what-is-a-lan/) · [Cisco Networking Academy (free courses)](https://www.netacad.com/)
""")

lesson(n, "osi-tcpip", "The OSI and TCP/IP models", """
# The OSI and TCP/IP models

When you open a website, many things happen: your browser makes a request, it is split into packets, addressed, sent as electrical, light or radio signals, and put back together at the other end. **Models** divide this work into **layers**, so each layer has one job. Engineers use them to design networks and to troubleshoot ("is it a layer 1 cable problem or a layer 3 IP problem?").

## The OSI model (7 layers)

| # | Layer | Job | Examples | Data unit |
|---|---|---|---|---|
| 7 | **Application** | What the user's program talks | HTTP, HTTPS, DNS, SMTP, FTP | Data |
| 6 | **Presentation** | Format, encryption, compression | TLS encryption, JPEG, UTF-8 | Data |
| 5 | **Session** | Opens, manages and closes conversations | Login sessions, RPC | Data |
| 4 | **Transport** | End-to-end delivery, ports, reliability | TCP, UDP | **Segment** (TCP) / datagram (UDP) |
| 3 | **Network** | Logical addressing and routing between networks | IP, ICMP, routers | **Packet** |
| 2 | **Data link** | Delivery on the local network using MAC addresses | Ethernet, Wi-Fi (802.11), switches | **Frame** |
| 1 | **Physical** | Bits as signals on the medium | Cables, fibre, radio, hubs | **Bits** |

**Memory trick (top to bottom):** *All People Seem To Need Data Processing*.
**Bottom to top:** *Please Do Not Throw Sausage Pizza Away*.

## The TCP/IP model (what the internet actually uses)

| TCP/IP layer | Matches OSI layers | Protocols |
|---|---|---|
| **Application** | 5, 6, 7 | HTTP, DNS, DHCP, SMTP, SSH |
| **Transport** | 4 | TCP, UDP |
| **Internet** | 3 | IPv4, IPv6, ICMP |
| **Network access (Link)** | 1, 2 | Ethernet, Wi-Fi |

## Encapsulation

As data goes **down** the layers on the sender, each layer adds its own **header**:

1. Your browser creates an HTTP request (data).
2. TCP adds a header with **ports** → segment.
3. IP adds a header with **IP addresses** → packet.
4. Ethernet/Wi-Fi adds a header with **MAC addresses** (and a trailer) → frame.
5. The frame is sent as **bits**.

The receiver does the opposite, **de-encapsulation**, going up the layers.

## Troubleshooting with layers

Work from layer 1 up:

1. **Physical**: is the cable plugged in? Is Wi-Fi on? Lights on the switch?
2. **Data link**: is the device connected to the right Wi-Fi/VLAN?
3. **Network**: does it have an IP address? Can you `ping` the gateway?
4. **Transport/Application**: is the service running? Is a firewall blocking the port? Does DNS work?

```quiz
Q: Which OSI layer number is the Network layer?
A: 3 | layer 3 | three
Q: Which OSI layer do switches mainly work at? (number)
A: 2 | layer 2 | two
Q: What is the data unit called at the Network layer?
A: packet | packets
Q: Which layer adds port numbers: Transport or Network?
A: transport | transport layer
Q: In the TCP/IP model, which layer does IP belong to?
A: internet | internet layer
Q: Which OSI layer handles encryption and formatting (name)?
A: presentation | presentation layer
```

**Learn more:** [Cloudflare: What is the OSI model?](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/) · [Professor Messer's free Network+ videos](https://www.professormesser.com/)
""")

lesson(n, "binary-hex", "Binary and hexadecimal for networking", """
# Binary and hexadecimal

Computers store everything as **bits**: 0 or 1. IP addresses and subnet masks are just 32 bits, so to subnet confidently you must be comfortable with **binary**. It is easier than it looks.

## Place values in one byte (8 bits)

Each position is worth double the one to its right:

| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|

To convert binary to decimal, **add the values where there is a 1**.

Example: `11000000` = 128 + 64 = **192**.
Example: `10101000` = 128 + 32 + 8 = **168**.

## Decimal to binary (subtraction method)

Convert **200**:

1. Is 128 ≤ 200? Yes → 1, remaining 72.
2. 64 ≤ 72? Yes → 1, remaining 8.
3. 32 ≤ 8? No → 0. 16? No → 0.
4. 8 ≤ 8? Yes → 1, remaining 0.
5. 4, 2, 1 → 0 0 0.

So 200 = `11001000`.

## Numbers you should memorise

These appear in subnet masks all the time:

| Binary | Decimal | Bits turned on |
|---|---|---|
| `10000000` | 128 | 1 |
| `11000000` | 192 | 2 |
| `11100000` | 224 | 3 |
| `11110000` | 240 | 4 |
| `11111000` | 248 | 5 |
| `11111100` | 252 | 6 |
| `11111110` | 254 | 7 |
| `11111111` | 255 | 8 |

And the powers of two: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536.

## Hexadecimal

Hex uses 16 symbols: 0–9 then **A=10, B=11, C=12, D=13, E=14, F=15**. One hex digit = 4 bits, so one byte = 2 hex digits. You'll see hex in **MAC addresses** (`3C:52:82:1A:0F:9B`) and **IPv6** (`2001:db8::1`).

- `FF` = 255, `C0` = 192, `A8` = 168, `0A` = 10.
- Binary `1111` = F, `1010` = A, `0101` = 5.

## Try the converter

Type in any box; the others update. The row shows which bits are on.

```tool-binary
```

```quiz
Q: What is binary 11100000 in decimal?
A: 224
Q: What is binary 00001010 in decimal?
A: 10
Q: Write 172 in binary (8 bits).
A: 10101100
H: 128 + 32 + 8 + 4
Q: Write 255 in hexadecimal.
A: FF | 0xFF
Q: How many bits are turned on in the mask octet 252?
A: 6
Q: What is 2 to the power of 10?
A: 1024
```

**Learn more:** [Khan Academy: binary numbers](https://www.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:digital-information/xcae6f4a7ff015e7d:binary-numbers/a/bits-and-binary) · [Cisco binary game](https://learningcontent.cisco.com/games/binary/index.html)
""")

lesson(n, "ipv4-addresses", "IPv4 addresses", """
# IPv4 addresses

An **IPv4 address** identifies a device on a network, like a postal address. It is **32 bits**, written as four **octets** (bytes) in decimal separated by dots: `192.168.1.25`. Each octet is 0–255.

In binary: `192.168.1.25` = `11000000.10101000.00000001.00011001`.

Every address has two parts:

- **Network part**: which network the device is on (like the street).
- **Host part**: which device on that network (like the house number).

The **subnet mask** or **prefix** (next lessons) tells you where the split is.

## Address classes (the old system)

Before 1993 addresses were split into fixed classes. You still need them for exams and to recognise defaults:

| Class | First octet | Default mask | Default prefix | Networks / hosts |
|---|---|---|---|---|
| **A** | 1–126 | 255.0.0.0 | /8 | Few, huge networks (16,777,214 hosts) |
| **B** | 128–191 | 255.255.0.0 | /16 | 65,534 hosts each |
| **C** | 192–223 | 255.255.255.0 | /24 | 254 hosts each |
| **D** | 224–239 | — | — | Multicast |
| **E** | 240–255 | — | — | Reserved / experimental |

127.x.x.x is reserved for **loopback** (`127.0.0.1` = "this computer").

## Private vs public addresses (RFC 1918)

These ranges are **private**. They are used inside homes and offices and are **not routed on the internet**; your router uses **NAT** to share one public address:

| Range | CIDR block | Typical use |
|---|---|---|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | Large companies, ISPs |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | Medium networks, Docker |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 | Homes and small offices |

## Other special addresses

- **169.254.x.x** (APIPA / link-local): a computer gives itself this when it **can't reach a DHCP server**. If you see it, the device isn't getting an address.
- **0.0.0.0**: "this network / any address" (used in default routes: 0.0.0.0/0).
- **255.255.255.255**: broadcast to everyone on the local network.
- **100.64.0.0/10**: carrier-grade NAT, used by mobile networks. If your "public" IP starts with 100.64–100.127, your ISP is sharing it with other customers.

## Unicast, broadcast, multicast

- **Unicast**: one to one (most traffic).
- **Broadcast**: one to all on the local network (e.g. DHCP discovery, ARP requests).
- **Multicast**: one to a group that asked for it (IPTV, routing protocols like OSPF use 224.0.0.5).

```quiz
Q: How many bits long is an IPv4 address?
A: 32 | 32 bits
Q: Which class is the address 172.20.5.9 (A, B or C)?
A: B | class b
Q: Is 172.20.5.9 private or public?
A: private
Q: Is 172.40.5.9 private or public?
A: public
H: The private 172 range is only 172.16 to 172.31.
Q: A laptop shows the address 169.254.33.10. What service did it fail to reach?
A: DHCP | dhcp server
Q: What is the default prefix of a Class C network?
A: /24 | 24
Q: What address means "this computer" (loopback)?
A: 127.0.0.1
```

**Learn more:** [RFC 1918: private address space](https://datatracker.ietf.org/doc/html/rfc1918) · [Cloudflare: What is my IP address?](https://www.cloudflare.com/learning/dns/glossary/what-is-my-ip-address/)
""")

lesson(n, "subnet-masks", "Subnet masks", """
# Subnet masks

A **subnet mask** is 32 bits that mark which part of an IP address is the **network** (1s) and which part is the **host** (0s). The 1s are always together on the left.

```
IP address:  192.168.10.77   = 11000000.10101000.00001010.01001101
Mask:        255.255.255.0   = 11111111.11111111.11111111.00000000
                               |------- network --------||- host -|
```

## Finding the network address: the AND operation

The network address = **IP AND mask**, bit by bit (1 AND 1 = 1, anything else = 0).

```
01001101   (77)
AND
00000000   (mask octet 0)
= 00000000 (0)      → network 192.168.10.0
```

With a mask ending in 224:

```
01001101   (77)
AND
11100000   (224)
= 01000000 (64)     → network 192.168.10.64
```

## Mask ↔ prefix table (last octet)

| Mask | Prefix | Host bits | Total addresses | Usable hosts |
|---|---|---|---|---|
| 255.255.255.0 | /24 | 8 | 256 | 254 |
| 255.255.255.128 | /25 | 7 | 128 | 126 |
| 255.255.255.192 | /26 | 6 | 64 | 62 |
| 255.255.255.224 | /27 | 5 | 32 | 30 |
| 255.255.255.240 | /28 | 4 | 16 | 14 |
| 255.255.255.248 | /29 | 3 | 8 | 6 |
| 255.255.255.252 | /30 | 2 | 4 | 2 |
| 255.255.255.254 | /31 | 1 | 2 | 2 (point-to-point links only) |
| 255.255.255.255 | /32 | 0 | 1 | 1 (a single host) |

The same pattern repeats in the third octet: 255.255.128.0 = /17, 255.255.192.0 = /18, 255.255.224.0 = /19, 255.255.240.0 = /20, 255.255.248.0 = /21, 255.255.252.0 = /22, 255.255.254.0 = /23.

## Why two addresses are not usable

In every normal subnet:

- The **first** address (all host bits 0) is the **network address**, the name of the subnet.
- The **last** address (all host bits 1) is the **broadcast address**.

So usable hosts = total − 2.

## The wildcard mask

Routers (Cisco ACLs, OSPF) often use a **wildcard mask**, the mask inverted: 255.255.255.255 − mask.

- Mask 255.255.255.0 → wildcard **0.0.0.255**
- Mask 255.255.255.224 → wildcard **0.0.0.31**

```quiz
Q: What prefix length is the mask 255.255.255.192?
A: /26 | 26
Q: What mask matches /28?
A: 255.255.255.240
Q: How many usable hosts does a /29 give?
A: 6
Q: What is the network address of 192.168.10.77 with mask 255.255.255.224?
A: 192.168.10.64
Q: What is the wildcard mask for 255.255.255.248?
A: 0.0.0.7
Q: What mask matches /20?
A: 255.255.240.0
```

**Learn more:** [Practical Networking: subnetting mastery](https://www.practicalnetworking.net/series/subnetting/subnetting/)
""")

lesson(n, "cidr", "CIDR notation and calculations", """
# CIDR: Classless Inter-Domain Routing

**CIDR** replaced the rigid class system in 1993. Instead of writing a mask, we write the **number of network bits** after a slash: `192.168.1.0/24` means the first 24 bits are the network.

CIDR lets networks be *any* size (a /22 for 1,000 hosts, a /30 for a link between two routers), which saved the internet from running out of addresses much sooner.

## The formulas you need

With prefix **/n**:

- **Host bits** = 32 − n
- **Total addresses** = 2^(32 − n)
- **Usable hosts** = 2^(32 − n) − 2 (except /31 and /32)
- **Number of subnets** when you split a /a into /b pieces = 2^(b − a)
- **Block size** (how far apart subnets are, in the octet where the prefix ends) = 256 − the mask value in that octet

## Worked example 1: 10.20.30.40/22

1. Host bits = 32 − 22 = **10** → total = 2^10 = **1,024**, usable **1,022**.
2. /22 ends in the **third octet** (16 + 6 bits). Mask = 255.255.**252**.0.
3. Block size in the third octet = 256 − 252 = **4**. Networks go 0, 4, 8, … 28, **28**, 32…
4. 30 falls in the block starting at **28**: network **10.20.28.0**.
5. Next network is 10.20.32.0, so broadcast = **10.20.31.255**.
6. Usable range: **10.20.28.1 – 10.20.31.254**.

## Worked example 2: 172.16.5.200/26

1. /26 ends in the fourth octet; mask 255.255.255.**192**; block size = 256 − 192 = **64**.
2. Blocks: 0, 64, 128, **192**. 200 falls in the block starting at 192.
3. Network **172.16.5.192**, broadcast **172.16.5.255**, hosts **.193 – .254**, **62** usable.

## Quick table: prefix → size

| Prefix | Addresses | Prefix | Addresses |
|---|---|---|---|
| /8 | 16,777,216 | /20 | 4,096 |
| /12 | 1,048,576 | /21 | 2,048 |
| /16 | 65,536 | /22 | 1,024 |
| /17 | 32,768 | /23 | 512 |
| /18 | 16,384 | /24 | 256 |
| /19 | 8,192 | /30 | 4 |

## Try the calculator

Type any address with a prefix (or with a mask, e.g. `10.0.0.5 255.255.252.0`). Check your hand calculations against it.

```tool-cidr
```

```quiz
Q: How many total addresses are in a /23?
A: 512
Q: How many usable hosts are in a /21?
A: 2046
Q: What is the network address of 10.20.30.40/22?
A: 10.20.28.0
Q: What is the broadcast address of 172.16.5.200/26?
A: 172.16.5.255
Q: How many /27 subnets fit in one /24?
A: 8
H: 2 to the power of (27 − 24)
Q: What is the subnet mask for /22?
A: 255.255.252.0
Q: What is the last usable host of 192.168.100.130/25?
A: 192.168.100.254
```

**Learn more:** [Cloudflare: What is CIDR?](https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/) · [subnettingpractice.com](https://subnettingpractice.com/)
""")

lesson(n, "subnetting-step-by-step", "Subnetting step by step (the magic number method)", """
# Subnetting step by step

Given any host like `192.168.37.150/28`, you should be able to find, in under a minute and without a calculator:

- the **network address**, **broadcast address**, **first and last usable host**, and **number of usable hosts**.

## The magic number method

1. **Find the interesting octet**: the octet where the prefix ends.
   - /1–/8 → 1st octet, /9–/16 → 2nd, /17–/24 → 3rd, /25–/32 → 4th.
2. **Find the mask value** in that octet (from the table: 128, 192, 224, 240, 248, 252, 254, 255).
3. **Magic number (block size)** = 256 − mask value.
4. **List multiples** of the magic number in the interesting octet: 0, M, 2M, 3M, …
5. The **network** starts at the multiple just at or below the host's value in that octet. Octets **after** it become 0.
6. The **broadcast** is one less than the next multiple. Octets after it become 255.
7. **First host** = network + 1, **last host** = broadcast − 1.

## Example A: 192.168.37.150/28

1. /28 → 4th octet is interesting.
2. Mask value: 240 (28 − 24 = 4 bits → 240).
3. Magic number: 256 − 240 = **16**.
4. Multiples: 0, 16, 32, … 128, **144**, 160…
5. 150 is between 144 and 160 → network **192.168.37.144**.
6. Broadcast = 160 − 1 → **192.168.37.159**.
7. Hosts **.145 – .158**, usable = 16 − 2 = **14**.

## Example B: 10.14.200.9/19

1. /19 → 3rd octet (19 − 16 = 3 bits).
2. Mask value: 224. Magic number: **32**.
3. Multiples in the 3rd octet: 0, 32, 64, 96, 128, 160, **192**, 224.
4. 200 is between 192 and 224 → network **10.14.192.0**.
5. Broadcast: 223 in the 3rd octet, 255 after → **10.14.223.255**.
6. First host **10.14.192.1**, last **10.14.223.254**. Usable = 2^13 − 2 = **8,190**.

## Example C: 172.29.4.1/14

1. /14 → 2nd octet (14 − 8 = 6 bits). Mask value 252, magic number **4**.
2. Multiples: …24, **28**, 32. 29 is in the block at 28.
3. Network **172.28.0.0**, broadcast **172.31.255.255**. Usable 2^18 − 2 = **262,142**.

## Endless practice

Every question below is new. Work it out on paper, type the answers, then check. Your score is saved on this device.

```tool-subnet-practice
```

```quiz
Q: What is the magic number (block size) for /27?
A: 32
Q: Network address of 192.168.37.150/28?
A: 192.168.37.144
Q: Broadcast address of 10.14.200.9/19?
A: 10.14.223.255
Q: First usable host of 172.16.99.66/29?
A: 172.16.99.65
Q: Last usable host of 192.168.1.200/26?
A: 192.168.1.254
Q: Network address of 10.1.130.5/17?
A: 10.1.128.0
```

**Learn more:** [Practical Networking: subnetting cheat sheet](https://www.practicalnetworking.net/series/subnetting/subnetting/) · [Jeremy's IT Lab (free CCNA course on YouTube)](https://www.youtube.com/@JeremysITLab)
""")

lesson(n, "subnetting-requirements", "Subnetting to meet requirements", """
# Subnetting to meet requirements

In real jobs you don't start with an answer; you start with a **requirement**: "We have 192.168.50.0/24. We need 6 departments with up to 25 computers each." You must pick a prefix and list the subnets.

## Two questions you ask

1. **How many subnets?** Borrow *s* host bits so that **2^s ≥ subnets needed**.
2. **How many hosts per subnet?** Keep *h* host bits so that **2^h − 2 ≥ hosts needed**.

Both must fit inside the original network: original prefix + s + h ≤ 32.

## Example: 6 departments, 25 hosts each, from 192.168.50.0/24

- Subnets: 2^3 = 8 ≥ 6 → borrow **3 bits** → /24 + 3 = **/27**.
- Hosts in a /27: 2^5 − 2 = **30** ≥ 25 ✓.
- Mask 255.255.255.224, block size 32.

| Subnet | Network | First host | Last host | Broadcast |
|---|---|---|---|---|
| 1 | 192.168.50.0/27 | .1 | .30 | .31 |
| 2 | 192.168.50.32/27 | .33 | .62 | .63 |
| 3 | 192.168.50.64/27 | .65 | .94 | .95 |
| 4 | 192.168.50.96/27 | .97 | .126 | .127 |
| 5 | 192.168.50.128/27 | .129 | .158 | .159 |
| 6 | 192.168.50.160/27 | .161 | .190 | .191 |
| spare | .192/27 and .224/27 | | | |

## Example: hosts first

"Each branch needs 500 devices; we have 10.10.0.0/16." Hosts: 2^9 − 2 = 510 ≥ 500 → keep 9 host bits → **/23** (32 − 9). Number of /23s in a /16 = 2^(23 − 16) = **128** branches possible. Networks go up by **2** in the third octet: 10.10.0.0/23, 10.10.2.0/23, 10.10.4.0/23…

## Always plan for growth

Choose sizes with room to grow (a department with 25 people today may have 40 next year). Changing IP plans later is painful.

> Rule of thumb: in offices, a /24 (254 hosts) per floor or department is common and easy to read. Save small prefixes (/30, /31) for router-to-router links.

```quiz
Q: You need 12 subnets. How many bits must you borrow?
A: 4
H: 2^3 = 8 is too few.
Q: From a /24, you need subnets of at least 50 hosts each. Which prefix do you use?
A: /26 | 26
Q: How many /26 subnets fit in a /24?
A: 4
Q: You need 1,000 hosts in one subnet. What is the largest prefix (smallest network) that fits?
A: /22 | 22
Q: What is the network address of the 5th /27 subnet of 192.168.50.0/24?
A: 192.168.50.128
Q: What is the broadcast address of the 3rd /23 subnet of 10.10.0.0/16?
A: 10.10.5.255
H: The /23s are 10.10.0.0, 10.10.2.0, 10.10.4.0 …
```
""")

lesson(n, "vlsm", "VLSM: different sizes in one network", """
# VLSM: Variable Length Subnet Masking

Giving every subnet the same size wastes addresses: a router link with 2 devices doesn't need 30 addresses. **VLSM** lets you use **different prefixes** for different subnets inside one block.

## The method

1. List every requirement and **sort from largest to smallest**.
2. For each, pick the **smallest subnet that fits** (hosts + 2 ≤ block).
3. Allocate them **one after another**, starting at the beginning of the block. Because you go largest first, every subnet starts on a correct boundary.

## Example

You have **192.168.10.0/24** and need:

- Sales: 100 hosts
- Admin: 50 hosts
- IT: 20 hosts
- Guests: 10 hosts
- Two router links: 2 hosts each

| Need | Hosts | Block that fits | Prefix | Subnet | Usable range | Broadcast |
|---|---|---|---|---|---|---|
| Sales | 100 | 128 | /25 | 192.168.10.0/25 | .1 – .126 | .127 |
| Admin | 50 | 64 | /26 | 192.168.10.128/26 | .129 – .190 | .191 |
| IT | 20 | 32 | /27 | 192.168.10.192/27 | .193 – .222 | .223 |
| Guests | 10 | 16 | /28 | 192.168.10.224/28 | .225 – .238 | .239 |
| Link 1 | 2 | 4 | /30 | 192.168.10.240/30 | .241 – .242 | .243 |
| Link 2 | 2 | 4 | /30 | 192.168.10.244/30 | .245 – .246 | .247 |
| Free | | | | 192.168.10.248/29 | | |

Everything fits in one /24 with room to spare. Without VLSM, using /25 for everything, it would need **3** whole /24s.

## Common mistakes

- **Not sorting largest first**: small subnets placed first push bigger ones onto the wrong boundaries.
- **Forgetting the 2 reserved addresses**: 62 hosts need a /26 (62 usable), but 63 hosts need a /25.
- **Overlapping subnets**: check that each new subnet starts after the previous broadcast.

Use the calculator from the CIDR lesson to verify each line.

```tool-cidr
```

```quiz
Q: A subnet needs 60 hosts. Which prefix is the smallest that fits?
A: /26 | 26
Q: A subnet needs 64 hosts. Which prefix?
A: /25 | 25
H: A /26 has only 62 usable addresses.
Q: For a point-to-point router link (2 hosts, not using /31), which prefix?
A: /30 | 30
Q: In the table, what is the network address of the Guests subnet?
A: 192.168.10.224
Q: In VLSM, do you allocate largest or smallest subnets first?
A: largest | largest first | biggest
```
""")

lesson(n, "summarization", "Route summarisation (supernetting)", """
# Route summarisation (supernetting)

**Summarisation** is the opposite of subnetting: combining several networks into one bigger route. Routers then need fewer entries, and a problem in one small subnet doesn't disturb routers far away.

Example: a branch office uses

```
192.168.8.0/24
192.168.9.0/24
192.168.10.0/24
192.168.11.0/24
```

Instead of four routes, the head office can use **one**: `192.168.8.0/22`.

## How to find the summary

1. Write the **changing octet** of each network in binary.

```
 8 = 000010 00
 9 = 000010 01
10 = 000010 10
11 = 000010 11
```

2. Count the **bits that are the same** from the left: the first 6 bits (`000010`) match.
3. Summary prefix = bits in earlier octets + matching bits = 16 + 6 = **/22**.
4. Summary address = the matching bits followed by zeros = 00001000 = **8** → `192.168.8.0/22`.

## Check it

192.168.8.0/22 covers 2^10 = 1,024 addresses = 4 × 256 → exactly .8.0 to .11.255. ✓

## Careful: don't over-summarise

`172.16.4.0/24` and `172.16.7.0/24` share `000001` → 172.16.4.0/22, but that summary **also includes** 172.16.5.0 and .6.0. If those networks are somewhere else, traffic will go to the wrong place. Only summarise address space that really lives behind that router.

## Why providers love CIDR

Internet providers receive big blocks (for example a /16) and advertise **one** route to the rest of the internet, while splitting it into thousands of customer subnets inside. This is why the global routing table has around one million routes instead of billions.

```quiz
Q: What is the summary of 10.1.4.0/24, 10.1.5.0/24, 10.1.6.0/24 and 10.1.7.0/24?
A: 10.1.4.0/22
Q: What is the summary of 172.16.32.0/24 through 172.16.47.0/24 (16 networks)?
A: 172.16.32.0/20
H: 16 networks = 2^4, so 4 fewer bits than /24.
Q: How many /24 networks does one /21 summary cover?
A: 8
Q: What is the summary of 192.168.0.0/24 and 192.168.1.0/24?
A: 192.168.0.0/23
```
""")

lesson(n, "ipv6", "IPv6 addressing", """
# IPv6

IPv4 has about 4.3 billion addresses, far fewer than the world's devices. **IPv6** has **128-bit** addresses: 340 undecillion (3.4 × 10^38). Safaricom and other Kenyan providers already give IPv6 to many customers.

## Format

Eight groups of four **hex** digits, separated by colons:

`2001:0db8:0000:0000:0000:ff00:0042:8329`

## Shortening rules

1. **Remove leading zeros** in each group: `0db8` → `db8`, `0042` → `42`, `0000` → `0`.
2. Replace **one** run of consecutive all-zero groups with `::` (only once per address).

`2001:0db8:0000:0000:0000:ff00:0042:8329` → `2001:db8::ff00:42:8329`

More examples:

- `fe80:0000:0000:0000:0202:b3ff:fe1e:8329` → `fe80::202:b3ff:fe1e:8329`
- `0000:0000:0000:0000:0000:0000:0000:0001` → `::1` (loopback)
- `2001:0db8:0000:0001:0000:0000:0000:0001` → `2001:db8:0:1::1` (the `::` goes on the *longer* zero run)

## Prefixes

IPv6 always uses CIDR. The standard LAN size is **/64**: the first 64 bits are the network, the last 64 bits are the **interface ID**. A home typically receives a **/56** (256 × /64 networks) or **/48** from the provider.

## Address types

| Type | Starts with | Like in IPv4 |
|---|---|---|
| **Global unicast** | `2000::/3` (2xxx or 3xxx) | Public addresses |
| **Link-local** | `fe80::/10` | 169.254.x.x (every IPv6 interface has one) |
| **Unique local** | `fc00::/7` (usually fd…) | Private 10.x / 192.168.x |
| **Multicast** | `ff00::/8` | 224.x.x.x |
| **Loopback** | `::1` | 127.0.0.1 |

There is **no broadcast** in IPv6; multicast is used instead.

## How devices get addresses

- **SLAAC** (Stateless Address Autoconfiguration): the router advertises the /64 prefix; the device makes up its own interface ID (randomised for privacy, or **EUI-64** from its MAC address).
- **DHCPv6**: a server hands out addresses, like DHCP in IPv4.

## No NAT needed

With so many addresses every device can have a public IPv6 address; **firewalls**, not NAT, provide protection.

```quiz
Q: How many bits long is an IPv6 address?
A: 128 | 128 bits
Q: Shorten 2001:0db8:0000:0000:0000:0000:0000:0001
A: 2001:db8::1
Q: What is the IPv6 loopback address?
A: ::1
Q: Which prefix do link-local addresses start with?
A: fe80 | fe80::/10 | fe80::
Q: What is the standard prefix length for an IPv6 LAN?
A: /64 | 64
Q: How many /64 networks are in a /56?
A: 256
Q: Can :: be used twice in one address? (yes/no)
A: no
```

**Learn more:** [Google IPv6 statistics](https://www.google.com/intl/en/ipv6/statistics.html) · [Cloudflare: What is IPv6?](https://www.cloudflare.com/learning/network-layer/what-is-ipv6/)
""")

lesson(n, "tcp-udp-ports", "TCP, UDP and port numbers", """
# TCP, UDP and ports

The **Transport layer** delivers data between *programs*, not just computers. A **port number** (0–65535) says which program: one server can run a website (443), email (587) and SSH (22) at the same time.

A connection is identified by the **socket pair**: source IP + source port + destination IP + destination port + protocol.

## TCP: reliable

**Transmission Control Protocol**:

- **Connection-oriented**: starts with the **three-way handshake**: SYN → SYN-ACK → ACK.
- **Reliable**: numbers every byte, receiver sends acknowledgements, lost data is re-sent.
- **Ordered**: data is put back in order.
- **Flow and congestion control**: slows down when the network or receiver is busy.
- Closes with FIN / ACK.

Used for: web pages, email, file transfers, SSH, M-Pesa APIs. Anything that must arrive complete.

## UDP: fast

**User Datagram Protocol**:

- **Connectionless**: just sends.
- No acknowledgements, no re-sending, no ordering, tiny header.

Used for: voice and video calls, live streaming, online games, **DNS** queries, DHCP. A late packet is useless in a call, so resending doesn't help.

## Port ranges

- **0–1023**: well-known ports (need admin rights to use on a server).
- **1024–49151**: registered ports (e.g. 3306 MySQL, 8080 web alt).
- **49152–65535**: dynamic/ephemeral: your computer picks one of these as the *source* port for each connection.

## Ports to memorise

| Port | Protocol | Use |
|---|---|---|
| 20, 21 | TCP | FTP (file transfer, insecure) |
| 22 | TCP | SSH / SFTP (secure remote login) |
| 23 | TCP | Telnet (insecure, avoid) |
| 25 | TCP | SMTP (server-to-server email) |
| 53 | UDP/TCP | DNS |
| 67, 68 | UDP | DHCP (server, client) |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 |
| 123 | UDP | NTP (time) |
| 143 | TCP | IMAP |
| 161 | UDP | SNMP |
| 443 | TCP (and UDP for HTTP/3) | HTTPS |
| 465 / 587 | TCP | SMTP with encryption (sending email) |
| 993 / 995 | TCP | IMAPS / POP3S |
| 3306 | TCP | MySQL / MariaDB |
| 3389 | TCP | Windows Remote Desktop (RDP) |

```quiz
Q: What are the three steps of the TCP handshake? (write like SYN, SYN-ACK, ACK)
A: SYN, SYN-ACK, ACK | syn syn-ack ack | syn,synack,ack | syn, syn/ack, ack
Q: Which port does HTTPS use?
A: 443
Q: Which port does SSH use?
A: 22
Q: Does DNS mainly use TCP or UDP?
A: UDP
Q: Which protocol is better for a live video call, TCP or UDP?
A: UDP
Q: Which port does MySQL use by default?
A: 3306
Q: Which ports does DHCP use? (server, client)
A: 67, 68 | 67 68 | 67,68 | 67 and 68
```
""")

lesson(n, "dns-dhcp", "DNS and DHCP", """
# DNS and DHCP

Two services quietly make every network usable.

## DHCP: automatic IP settings

When your phone joins Wi-Fi, a **DHCP server** (usually the router) gives it:

- an **IP address** and **subnet mask**,
- a **default gateway** (the router's address),
- **DNS servers**,
- a **lease time** (how long it may keep the address).

The four steps are called **DORA**:

1. **Discover**: the client broadcasts "is there a DHCP server?"
2. **Offer**: the server offers an address.
3. **Request**: the client asks for that address.
4. **Acknowledge**: the server confirms.

Useful ideas:

- **Reservation**: always give the same IP to a device (printers, servers, the M-Pesa till PC) based on its MAC address.
- **Scope/pool**: the range the server hands out, e.g. 192.168.1.100–199.
- **DHCP relay** (`ip helper-address` on Cisco): forwards DHCP requests to a server on another subnet.
- A device with **169.254.x.x** couldn't reach any DHCP server.

## DNS: names to addresses

People remember `marzleytechsolutions.co.ke`; computers need an IP. **DNS** (Domain Name System) translates.

What happens when you type a website:

1. Your device checks its **cache**.
2. It asks its **resolver** (your ISP's, or a public one like 1.1.1.1 or 8.8.8.8).
3. The resolver asks a **root server** → "ask the `.ke` servers" → the `.ke` servers → "ask the `.co.ke` servers" → then the domain's **authoritative name servers** (e.g. your host's `ns1.host.com`).
4. The answer is cached for its **TTL** (time to live).

## DNS record types

| Record | Purpose | Example |
|---|---|---|
| **A** | Name → IPv4 | `example.co.ke → 102.68.1.10` |
| **AAAA** | Name → IPv6 | `→ 2001:db8::10` |
| **CNAME** | Alias to another name | `www → example.co.ke` |
| **MX** | Mail servers for the domain | `10 mail.example.co.ke` |
| **TXT** | Text: SPF, DKIM, site verification | `v=spf1 include:… ~all` |
| **NS** | Which servers are authoritative | `ns1.hostingcompany.com` |
| **PTR** | IP → name (reverse DNS) | used by mail servers |

> When you "point a domain to hosting" you change its **NS** records at the registrar, or its **A** record.

## Commands to try

```
nslookup marzleytechsolutions.co.ke
nslookup -type=mx gmail.com
ipconfig /all          (Windows: see your DHCP server and DNS)
ipconfig /release  then  ipconfig /renew
```

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
```

**Learn more:** [Cloudflare: What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/) · [Cloudflare: What is DHCP?](https://www.cloudflare.com/learning/network-layer/what-is-dhcp/)
""")

lesson(n, "nat-routing", "NAT, gateways and routing", """
# NAT, gateways and routing

## The default gateway

When a device sends to an address **outside its own subnet**, it sends the packet to its **default gateway**, the router. That's why a wrong gateway means "local things work but no internet".

A device decides: *is the destination in my subnet?* (compare network addresses using the mask). If yes → send directly; if no → send to the gateway.

## How routers decide: the routing table

A router keeps a table of networks and where to send packets for each. Example:

```
C   192.168.1.0/24 is directly connected, GigabitEthernet0/1
S   10.50.0.0/16 [1/0] via 172.16.0.2
O   10.50.8.0/22 [110/20] via 172.16.0.6
S*  0.0.0.0/0 [1/0] via 41.90.1.1        (default route: "everything else")
```

**Longest prefix match**: if several routes match, the router uses the **most specific** (longest prefix). A packet to 10.50.9.4 matches both 10.50.0.0/16 and 10.50.8.0/22 → it follows the **/22**.

## Kinds of routes

- **Connected**: networks on the router's own interfaces.
- **Static**: typed in by an admin. Simple, good for small networks and default routes.
- **Dynamic**: learned from other routers with a routing protocol:
  - **RIP**: counts hops, old and slow.
  - **OSPF**: link-state, fast, uses cost based on bandwidth; common in companies.
  - **EIGRP**: Cisco's advanced distance-vector.
  - **BGP**: the protocol of the internet; ISPs use it to exchange routes between each other (e.g. at the Kenya Internet Exchange Point, KIXP).

**Administrative distance** decides which *source* is trusted when two protocols know the same network (connected 0, static 1, OSPF 110, RIP 120).

## NAT and PAT

Private addresses (192.168.x.x) can't be used on the internet. **NAT** (Network Address Translation) on your router swaps the private source address for its **public** one.

**PAT / NAT overload** lets hundreds of devices share **one** public IP by also changing the **source port** and remembering who used which port. This is what every home and office router does.

- **Port forwarding (static NAT)**: sends incoming traffic on a public port to an inside device, e.g. public port 8080 → 192.168.1.20:80 to reach a CCTV DVR from outside.
- **CGNAT**: mobile networks put customers behind another layer of NAT (100.64.0.0/10), so port forwarding from outside usually doesn't work on mobile data.

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
```
""")

lesson(n, "switching-vlans", "Switching, MAC addresses, ARP and VLANs", """
# Switching, MAC addresses, ARP and VLANs

## MAC addresses

Every network card has a **MAC address**: 48 bits written in hex, e.g. `3C:52:82:1A:0F:9B`. The first half (OUI) identifies the maker. MAC addresses are used for delivery **inside** a LAN (layer 2); IP addresses for delivery **between** networks (layer 3).

## How a switch learns

A switch keeps a **MAC address table** (CAM table):

1. A frame arrives on port 3 from MAC A → the switch **learns** "A is on port 3".
2. If it knows the destination's port, it **forwards** only there.
3. If not, it **floods** the frame out of all other ports.
4. Entries age out after about 5 minutes.

This is why switches are much better than old **hubs**, which repeated everything to everyone.

## ARP: finding the MAC for an IP

Before sending to 192.168.1.20 on the same LAN, a PC must know its MAC. It **broadcasts** an ARP request: "Who has 192.168.1.20? Tell 192.168.1.5." The owner replies with its MAC, which is cached. See yours with `arp -a`.

For addresses in other networks, the PC ARPs for the **gateway's** MAC instead.

## VLANs

A **VLAN** (Virtual LAN) splits one physical switch into several separate networks. Examples in a school: VLAN 10 Staff, VLAN 20 Students, VLAN 30 Guests Wi-Fi, VLAN 40 CCTV.

Benefits: security (students can't reach the finance PCs), smaller broadcast areas, and flexible moves.

- **Access port**: belongs to one VLAN (for PCs, printers).
- **Trunk port**: carries many VLANs between switches or to a router, **tagging** each frame with its VLAN ID (**IEEE 802.1Q**, 12 bits → VLANs 1–4094).
- VLANs talk to each other only through a **router** or **layer 3 switch** (inter-VLAN routing, "router on a stick").
- Each VLAN normally gets its own **IP subnet**, e.g. VLAN 10 = 10.10.10.0/24.

## Loops and STP

Redundant cables between switches create **loops** that can flood a network in seconds (broadcast storm). **Spanning Tree Protocol (STP)** blocks extra paths and re-enables them if a link fails.

## Cisco example

```
Switch(config)# vlan 20
Switch(config-vlan)# name STUDENTS
Switch(config)# interface fa0/5
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20
Switch(config)# interface gi0/1
Switch(config-if)# switchport mode trunk
```

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
```
""")

lesson(n, "wifi", "Wi-Fi: standards, planning and security", """
# Wi-Fi

## Standards

| Name | Standard | Bands | Typical real speed |
|---|---|---|---|
| Wi-Fi 4 | 802.11n | 2.4 & 5 GHz | 50–150 Mbps |
| Wi-Fi 5 | 802.11ac | 5 GHz | 200–600 Mbps |
| Wi-Fi 6 / 6E | 802.11ax | 2.4, 5 (and 6 GHz for 6E) | 500 Mbps+ and much better with many users |
| Wi-Fi 7 | 802.11be | 2.4, 5, 6 GHz | Multi-gigabit |

## 2.4 GHz vs 5 GHz

- **2.4 GHz**: longer range, goes through walls better, but slower and crowded. Only **3 non-overlapping channels: 1, 6, 11**.
- **5 GHz**: faster, many channels, shorter range. Best for rooms near the access point.

Most routers broadcast both; "band steering" moves devices to the best one.

## Planning coverage for a home, school or office

- Place access points **high and central**, away from metal cabinets, mirrors and water tanks.
- Concrete walls (common in Kenyan buildings) block a lot: plan **one access point per few rooms** rather than one powerful router.
- Use **wired backhaul** (Ethernet cable to each AP) where possible; **mesh** Wi-Fi is the next best.
- Neighbouring APs on 2.4 GHz should use different channels (1, 6, 11).
- Test with a free Wi-Fi analyser app to find weak spots and busy channels.

## Security

- Use **WPA3** (or **WPA2-AES** if older devices need it). Never use **WEP** or open networks for business.
- Long passphrase (12+ characters) and **change the router's admin password** from the default.
- Separate **guest Wi-Fi** (its own VLAN/SSID) so visitors can't reach your office PCs or till.
- Turn off **WPS** (the push-button/PIN setup), which can be cracked.
- Update the router firmware.
- For companies: **WPA2/WPA3-Enterprise** with a RADIUS server gives each person their own login.

## Common problems

- "Connected, no internet": the Wi-Fi is fine; check the router's internet link, DNS or the provider.
- Slow in some rooms: signal too weak → add an AP or move it.
- Drops when busy: too many users on one AP or on 2.4 GHz → Wi-Fi 6 APs, more APs, 5 GHz.

```quiz
Q: Which three 2.4 GHz channels don't overlap?
A: 1, 6, 11 | 1 6 11 | 1,6,11
Q: Which Wi-Fi security type should you use today?
A: WPA3 | wpa3 or wpa2 | wpa2
Q: Which band has longer range: 2.4 GHz or 5 GHz?
A: 2.4 | 2.4 ghz | 2.4ghz
Q: What is Wi-Fi 6's IEEE standard name?
A: 802.11ax | 11ax
Q: Which easy-setup feature should be turned off because it can be cracked?
A: WPS
```
""")

lesson(n, "troubleshooting", "Troubleshooting commands and method", """
# Troubleshooting networks

## A method that always works

1. **Identify** the problem: who is affected, since when, what changed?
2. **Theory**: guess the most likely cause (start at layer 1).
3. **Test** the theory with commands.
4. **Plan and fix**.
5. **Verify** everything works, and prevent it happening again.
6. **Document** what you found.

## The commands

| Task | Windows | Linux / macOS |
|---|---|---|
| Show IP, mask, gateway | `ipconfig` / `ipconfig /all` | `ip a`, `ip route` (Linux), `ifconfig` |
| Renew DHCP | `ipconfig /release` then `/renew` | `sudo dhclient -r && sudo dhclient` |
| Test reachability | `ping 8.8.8.8` | `ping -c 4 8.8.8.8` |
| See the path | `tracert google.com` | `traceroute google.com` |
| Test DNS | `nslookup google.com` | `dig google.com` / `nslookup` |
| Clear DNS cache | `ipconfig /flushdns` | `resolvectl flush-caches` |
| Open connections/ports | `netstat -ano` | `ss -tulpn` |
| ARP table | `arp -a` | `ip neigh` |
| Test a TCP port | `Test-NetConnection host -Port 443` (PowerShell) | `nc -zv host 443` |

## The ping ladder

When "the internet is down", ping in this order:

1. `ping 127.0.0.1`: does the network software work?
2. `ping` **your own IP**: is the network card OK?
3. `ping` **the gateway** (e.g. 192.168.1.1): is the LAN OK?
4. `ping 8.8.8.8`: is the internet reachable by IP?
5. `ping google.com`: does DNS work?

If step 4 works but 5 fails → **DNS problem**. If step 3 fails → local cable, Wi-Fi or switch problem. If 3 works and 4 fails → router or ISP problem.

## Reading tracert

Each line is a router (hop) on the way. `* * *` means that hop didn't answer (often normal). A sudden big jump in milliseconds shows where delay starts; if it stops at your ISP, call them with the output.

## Common real-life fixes

- **169.254.x.x address** → DHCP not reached: check cable/Wi-Fi, router, DHCP pool full.
- **IP conflict** warning → two devices with the same static IP; use DHCP reservations.
- **Works by IP, not by name** → set DNS to 1.1.1.1 / 8.8.8.8 or fix the router's DNS.
- **One website fails** → try another network, `nslookup` it, clear DNS cache and browser cache.

```quiz
Q: Which Windows command shows your IP address, gateway and DNS servers in full?
A: ipconfig /all
Q: Ping to 8.8.8.8 works but ping to google.com fails. What is the likely problem?
A: DNS | dns problem
Q: Which command shows the route (hops) to a destination on Windows?
A: tracert | tracert google.com
Q: Which Windows command clears the DNS cache?
A: ipconfig /flushdns
Q: Which address do you ping to test the network software on your own computer?
A: 127.0.0.1 | localhost
Q: Which Linux command shows listening ports and the programs using them?
A: ss -tulpn | ss | netstat -tulpn
```
""")

lesson(n, "network-security", "Network security basics", """
# Network security basics

## Firewalls

A **firewall** allows or blocks traffic using rules (source, destination, port, protocol).

- **Stateful** firewalls remember connections, so replies to traffic you started are allowed automatically.
- Best practice: **deny everything by default**, then allow only what's needed ("allow 443 to the web server").
- Your router has one; servers have their own (Windows Defender Firewall, `ufw` on Ubuntu); companies use dedicated ones (pfSense/OPNsense, Fortinet, Sophos, MikroTik).

Simple `ufw` example on Ubuntu:

```
sudo ufw default deny incoming
sudo ufw allow 22/tcp
sudo ufw allow 80,443/tcp
sudo ufw enable
```

## VPNs

A **VPN** creates an encrypted tunnel over the internet.

- **Site-to-site**: joins branch networks to head office (e.g. IPsec between two MikroTik routers).
- **Remote access**: staff at home connect to the office (WireGuard, OpenVPN, IPsec).

## Common attacks

| Attack | What happens | Defence |
|---|---|---|
| **DoS / DDoS** | Floods a site so real users can't reach it | Cloudflare/CDN, ISP filtering |
| **Man-in-the-middle** | Attacker reads or changes traffic (e.g. fake café Wi-Fi) | HTTPS everywhere, VPN, WPA3 |
| **ARP spoofing** | Attacker claims the gateway's IP on the LAN | Dynamic ARP inspection, VLANs |
| **Rogue DHCP** | Fake DHCP hands out a malicious gateway | DHCP snooping |
| **Brute force** | Guessing passwords on SSH, RDP, routers | Strong passwords, keys, 2FA, fail2ban, don't expose RDP |
| **Port scanning** | Looking for open services | Close unused ports, firewall |

## Hardening checklist for a small office

- Change all default passwords (router, switches, CCTV DVR, printers).
- Update router and device firmware.
- Separate VLANs for staff, guests and CCTV.
- No port forwarding of RDP (3389) or SMB (445) to the internet.
- Use a VPN for remote access.
- Back up configurations and important data.
- Log and monitor: know when something odd happens.

## Defence in depth

No single tool is enough: combine firewall + updates + strong authentication + backups + training people. Most real break-ins start with a **phishing email or a weak password**, not a clever network hack.

```quiz
Q: What should a firewall's default policy for incoming traffic be?
A: deny | deny all | block
Q: Which type of VPN joins two office networks together?
A: site-to-site | site to site
Q: Which switch feature stops fake DHCP servers?
A: DHCP snooping
Q: Which Windows remote desktop port should never be open directly to the internet?
A: 3389
Q: What does DDoS stand for? (four words)
A: distributed denial of service
```

**Learn more:** [Cloudflare: What is a firewall?](https://www.cloudflare.com/learning/security/what-is-a-firewall/) · [Cisco NetAcad: Network Security](https://www.netacad.com/)
""")

lesson(n, "python-networking", "Networking with Python (practice)", """
# Networking with Python

Python's built-in **ipaddress** module does subnetting for you. It is perfect for checking your work, planning networks and writing small network tools. Run each example and change the numbers.

## Look at a network

```try-python
import ipaddress

net = ipaddress.ip_network("192.168.10.0/26")
print("Network:  ", net.network_address)
print("Broadcast:", net.broadcast_address)
print("Mask:     ", net.netmask)
print("Hosts:    ", net.num_addresses - 2)
hosts = list(net.hosts())
print("First host:", hosts[0], " Last host:", hosts[-1])
```

## Which subnet is a host in?

```try-python
import ipaddress

iface = ipaddress.ip_interface("10.14.200.9/19")
print("Network of this host:", iface.network)
print("Is private?", iface.ip.is_private)
```

## Split a network into subnets

```try-python
import ipaddress

net = ipaddress.ip_network("192.168.50.0/24")
for i, sub in enumerate(net.subnets(new_prefix=27), start=1):
    hosts = list(sub.hosts())
    print(f"{i}. {sub}  hosts {hosts[0]} - {hosts[-1]}  broadcast {sub.broadcast_address}")
```

## Plan with VLSM

```try-python
import ipaddress, math

needs = {"Sales": 100, "Admin": 50, "IT": 20, "Guests": 10, "Link 1": 2, "Link 2": 2}
start = ipaddress.ip_address("192.168.10.0")
for name, hosts in sorted(needs.items(), key=lambda x: -x[1]):
    prefix = 32 - math.ceil(math.log2(hosts + 2))
    sub = ipaddress.ip_network(f"{start}/{prefix}")
    print(f"{name:7} needs {hosts:3} -> {sub}")
    start = sub.broadcast_address + 1
```

## Summarise networks

```try-python
import ipaddress

nets = [ipaddress.ip_network(f"192.168.{i}.0/24") for i in range(8, 12)]
print(list(ipaddress.collapse_addresses(nets)))
```

## IPv6 too

```try-python
import ipaddress

a = ipaddress.ip_address("2001:0db8:0000:0000:0000:0000:0000:0001")
print("Short form:", a.compressed)
print("Long form: ", a.exploded)
```

Challenge: change the VLSM example to your own school or office and print a full IP plan.

**Learn more:** [Python ipaddress documentation](https://docs.python.org/3/library/ipaddress.html)
""")

lesson(n, "careers-certs", "Networking careers and certifications", """
# Networking careers and certifications

## Jobs you can aim for

- **IT support / helpdesk technician**: fixes PCs, printers, Wi-Fi, user accounts. The usual first job.
- **Network technician**: cabling, installing switches, APs and CCTV, fibre splicing, ISP installations.
- **Network engineer / administrator**: designs and runs company networks, routers, firewalls, VPNs.
- **NOC engineer** (network operations centre): monitors ISP or bank networks 24/7.
- **Cybersecurity analyst**: protects networks, investigates attacks.
- **Cloud engineer**: networks inside AWS, Azure, Google Cloud (VPCs, subnets, routing: the same ideas).

In Kenya, employers include ISPs (Safaricom, Airtel, Liquid, Jamii Telecom/Faiba, Zuku), banks, system integrators, universities, county governments and many small companies needing someone who can "do networks".

## Certifications (in a sensible order)

1. **CompTIA A+**: general IT support (optional start).
2. **CompTIA Network+** or **Cisco CCNA**: the core networking certificates. CCNA is the most recognised and covers everything in this track and much more.
3. **MikroTik MTCNA**: very useful in Kenya where many ISPs and offices use MikroTik routers.
4. **Security**: CompTIA Security+, Cisco CyberOps, then more advanced.
5. **Cloud**: AWS Certified Cloud Practitioner → Solutions Architect Associate.

## Free ways to practise

- **Cisco Packet Tracer** (free with a NetAcad account): build virtual networks with routers and switches.
- **GNS3 / EVE-NG**: run real router software (advanced).
- Old routers and switches from second-hand shops or eBay for a home lab.
- Subnet daily: use the practice tool in this track until you can do any question in 30 seconds.

## Study plan (about 3 months, 1–2 hours a day)

1. Weeks 1–2: this track, networking basics, binary, IP addressing.
2. Weeks 3–5: subnetting daily, VLSM, a CCNA video course.
3. Weeks 6–8: switching, VLANs, routing labs in Packet Tracer.
4. Weeks 9–12: security, wireless, automation basics, practice exams, then book the exam.

**Learn more:** [Cisco Networking Academy](https://www.netacad.com/) · [Jeremy's IT Lab CCNA (free)](https://www.youtube.com/@JeremysITLab) · [Professor Messer Network+ (free)](https://www.professormesser.com/) · [MikroTik training](https://mikrotik.com/training/)
""")
