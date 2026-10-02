---
slug: osi-tcpip
title: "The OSI and TCP/IP models: all seven layers, encapsulation, PDUs and layered troubleshooting"
after: KEEP
---
# The OSI and TCP/IP models: all seven layers, encapsulation, PDUs and layered troubleshooting

When you open a website, many things happen: your browser makes a request, it's split into pieces, addressed, sent as electrical, light or radio signals across many devices, and put back together at the other end. That's a lot of different jobs. **Network models** divide the work into **layers**, so each layer has one clear job and only talks to the layers just above and below it.

Why it matters to you:
- **Design**: vendors can build a Wi-Fi card (layer 1–2) without caring which website you'll visit (layer 7).
- **Troubleshooting**: engineers ask "is this a layer 1 cable problem or a layer 3 IP problem?" and fix faults faster.
- **Exams and interviews**: the OSI model is in every networking certification (Network+, CCNA) and most networking interviews.

:::note What you will learn
- The seven OSI layers, each with its job, protocols, devices and data unit
- Memory tricks for the layer order
- The four-layer TCP/IP model and how it maps to OSI
- Encapsulation and de-encapsulation step by step
- Which devices work at which layer
- A layer-by-layer troubleshooting method with real examples
:::

## The OSI model (7 layers)

OSI (Open Systems Interconnection) was published by ISO as a reference model. Count the layers from the bottom (1) to the top (7).

| # | Layer | Job | Examples | Data unit (PDU) |
|---|---|---|---|---|
| 7 | **Application** | Network services for the user's programs | HTTP, HTTPS, DNS, SMTP, FTP, SSH | Data |
| 6 | **Presentation** | Format, encryption, compression | TLS encryption, JPEG, UTF-8 | Data |
| 5 | **Session** | Opens, manages and closes conversations | Login sessions, RPC | Data |
| 4 | **Transport** | End-to-end delivery, ports, reliability | TCP, UDP | **Segment** (TCP) / datagram (UDP) |
| 3 | **Network** | Logical addressing and routing between networks | IP, ICMP, routers | **Packet** |
| 2 | **Data link** | Delivery on the local network using MAC addresses | Ethernet, Wi-Fi (802.11), switches | **Frame** |
| 1 | **Physical** | Bits as signals on the medium | Cables, fibre, radio, connectors, hubs | **Bits** |

**Memory trick (top to bottom, 7→1):** *All People Seem To Need Data Processing*.
**Bottom to top (1→7):** *Please Do Not Throw Sausage Pizza Away*.

## Each layer in more detail

### Layer 1: Physical
Moves raw **bits** as voltages on copper, pulses of light on fibre, or radio waves. Defines cables (Cat6, fibre), connectors (RJ45, LC), pin-outs, signal speeds and Wi-Fi radio frequencies. Problems here: unplugged or damaged cables, bad crimping, weak Wi-Fi signal, a dead port.

### Layer 2: Data link
Delivers **frames** between devices on the **same local network** using **MAC addresses** (hardware addresses like `3C:52:82:1A:0F:9B`). Detects transmission errors with a checksum (FCS) at the end of each frame. Switches, network cards and Wi-Fi access points work here. **VLANs** and **ARP** live around this layer.

### Layer 3: Network
Gives devices **logical addresses** (IP addresses) and **routes** packets between different networks, choosing paths across the internet. Routers and layer 3 switches work here. **ICMP** (used by `ping` and `traceroute`) is a layer 3 helper protocol.

### Layer 4: Transport
Delivers data between **applications** on the two devices using **port numbers** (HTTPS uses 443, SSH 22). **TCP** is reliable: it numbers segments, resends lost ones and puts them in order. **UDP** is fast and simple with no guarantees, used for video calls, gaming, DNS lookups and streaming.

### Layer 5: Session
Sets up, manages and ends conversations between applications: keeping a login session alive, resuming an interrupted transfer. In TCP/IP, applications usually handle this themselves.

### Layer 6: Presentation
Makes sure data is in a format the receiver understands: character encoding (UTF-8), file formats (JPEG, MP4), compression and **encryption** (TLS, which turns HTTP into HTTPS).

### Layer 7: Application
The protocols programs use to talk over the network: HTTP/HTTPS for the web, DNS to look up names, SMTP/IMAP for email, SSH for remote login, FTP/SFTP for files. Note: the application layer is the **protocol**, not the program itself (Chrome uses HTTP; Chrome isn't layer 7).

## The TCP/IP model (what the internet actually uses)

The internet was built on the TCP/IP protocol suite, which uses a simpler 4-layer model:

| TCP/IP layer | Matches OSI layers | Protocols |
|---|---|---|
| **Application** | 5, 6, 7 | HTTP, DNS, DHCP, SMTP, SSH, TLS |
| **Transport** | 4 | TCP, UDP |
| **Internet** | 3 | IPv4, IPv6, ICMP |
| **Network access (Link)** | 1, 2 | Ethernet, Wi-Fi, fibre |

Some books show a 5-layer version that splits network access into Data link and Physical. Engineers use OSI numbers as shorthand ("a layer 2 switch", "a layer 7 firewall") but the real protocols follow TCP/IP.

## Devices by layer

| Device | Layer | Why |
|---|---|---|
| Hub, repeater, cable, media converter | 1 | Just pass signals |
| Switch, bridge, access point, NIC | 2 | Use MAC addresses |
| Router, layer 3 switch | 3 | Use IP addresses |
| Traditional firewall | 3–4 | Filters by IP addresses and ports |
| Next-generation firewall, load balancer, proxy | up to 7 | Understand applications (e.g. block a specific website) |

## Encapsulation

As data goes **down** the layers on the sender, each layer wraps it with its own **header** (like putting a letter in an envelope, then in a courier bag, then in a crate):

1. Your browser creates an HTTP request → **data**.
2. TCP adds a header with **source and destination ports** (e.g. 51515 → 443) and sequence numbers → **segment**.
3. IP adds a header with **source and destination IP addresses** → **packet**.
4. Ethernet/Wi-Fi adds a header with **source and destination MAC addresses** and a trailer (FCS checksum) → **frame**.
5. The network card sends the frame as **bits**.

```
[ Ethernet header | IP header | TCP header | HTTP data | Ethernet trailer ]
     layer 2         layer 3      layer 4       layer 7        layer 2
```

The receiver does the opposite, **de-encapsulation**: each layer reads and removes its header, then passes the rest up.

A key detail: along the path, **routers rewrite the layer 2 header at every hop** (new MAC addresses for each link), but the **IP addresses stay the same** end to end (unless NAT changes them, covered in the NAT lesson).

```try-python
# A toy model of encapsulation: each layer wraps the one above
data = "GET /index.html"
segment = {"src_port": 51515, "dst_port": 443, "payload": data}
packet = {"src_ip": "192.168.1.20", "dst_ip": "93.184.216.34", "payload": segment}
frame = {"src_mac": "3C:52:82:1A:0F:9B", "dst_mac": "A4:91:B1:00:11:22", "payload": packet}

layer = frame
for name in ["Frame (L2)", "Packet (L3)", "Segment (L4)"]:
    print(name, {k: v for k, v in layer.items() if k != "payload"})
    layer = layer["payload"]
print("Data (L7):", layer)
```

## Troubleshooting with layers

The **bottom-up** method: start at layer 1 and work up until you find the fault.

| Layer | Questions | Tools |
|---|---|---|
| 1 Physical | Cable plugged in? Link lights on? Wi-Fi on and signal strong? | Eyes, cable tester, Wi-Fi analyser |
| 2 Data link | Connected to the right Wi-Fi/VLAN? Port enabled? | Switch interface status, `arp -a` |
| 3 Network | Has a valid IP address? Can you ping the gateway? Route correct? | `ipconfig`/`ip a`, `ping`, `tracert` |
| 4 Transport | Is the port open, or blocked by a firewall? | `Test-NetConnection`, `nc`, `ss` |
| 7 Application | Is the service running? Does DNS resolve? Right URL/credentials? | Browser, `nslookup`, logs |

Other approaches: **top-down** (start with the application, good when you suspect software) and **divide-and-conquer** (start in the middle with `ping`: if pinging works, layers 1–3 are fine).

### Example
A cashier says "the till can't reach the M-Pesa system".
1. L1: cable is plugged in, switch port light is on.
2. L3: `ipconfig` shows `169.254.x.x` (an automatic address used when DHCP fails). The till never got an IP address → the problem is DHCP or the switch/VLAN, not M-Pesa.

:::think A user can open websites by IP address (e.g. http://93.184.216.34) but not by name (example.com). Which layer and service is the likely problem?
Layers 1–4 work (data reaches the server by IP). The failure is name resolution: DNS, an application-layer (layer 7) service. Check the DNS server settings with `nslookup` or `ipconfig /all`.
:::

## Summary

- Layers split networking into jobs; OSI has 7 (Physical, Data link, Network, Transport, Session, Presentation, Application).
- PDUs: bits (1), frames (2), packets (3), segments/datagrams (4), data (5–7).
- TCP/IP has 4 layers: Network access, Internet, Transport, Application.
- Encapsulation adds headers going down (ports, IPs, MACs); de-encapsulation removes them going up.
- Switches are layer 2, routers layer 3; troubleshoot bottom-up, top-down or divide-and-conquer.

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
Q: What is the data unit at layer 2 called?
A: frame | frames
```

**Learn more:** [Cloudflare: What is the OSI model?](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/) · [Professor Messer's free Network+ videos](https://www.professormesser.com/)
