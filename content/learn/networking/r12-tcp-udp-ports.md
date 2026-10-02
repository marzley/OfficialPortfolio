---
slug: tcp-udp-ports
title: "TCP, UDP and port numbers: reliable vs fast delivery, the handshake, sockets and ports to memorise"
after: KEEP
---
# TCP, UDP and port numbers: reliable vs fast delivery, the handshake, sockets and ports to memorise

An IP address gets data to the right **device**. But your laptop might be running a browser, WhatsApp, Zoom, Spotify and a game at the same time. How does incoming data reach the right **program**? **Port numbers** do that, at the **transport layer** (layer 4). The transport layer also decides **how** data is delivered: carefully and reliably (**TCP**) or quickly with no guarantees (**UDP**).

Understanding TCP, UDP and ports is essential for configuring firewalls, troubleshooting "it connects but doesn't load" problems, setting up servers and passing networking and security exams.

:::note What you will learn
- What the transport layer does
- TCP: connections, the three-way handshake, sequence numbers, acknowledgements, retransmission, flow control, closing
- UDP: connectionless and fast
- When to use TCP vs UDP (with real apps)
- Port numbers: ranges, well-known ports, sockets
- How NAT and firewalls use ports
- Seeing connections on your own computer
:::

## What the transport layer does

| Job | Meaning |
|---|---|
| **Multiplexing** | Many apps share one IP address using different ports |
| **Segmentation** | Break large data into segments that fit the network |
| **Reliability** (TCP) | Detect and resend lost data, in order |
| **Flow control** (TCP) | Don't send faster than the receiver can handle |

## TCP: Transmission Control Protocol

TCP is **connection-oriented** and **reliable**. Used for web pages, email, file transfers, SSH, database connections: anything where every byte must arrive correctly.

### The three-way handshake

Before sending data, client and server set up a connection:

```
Client                        Server
  | ---- SYN (seq=100) ------->  |   "I want to connect; my numbering starts at 100"
  | <--- SYN-ACK (seq=300,      |   "OK; mine starts at 300; I got your 100"
  |       ack=101) ------------  |
  | ---- ACK (ack=301) ------->  |   "Got it"
  |      connection established  |
```

### Reliable delivery

- Each byte has a **sequence number**, so the receiver can put segments back in order.
- The receiver sends **acknowledgements (ACKs)** for data received.
- If an ACK doesn't arrive in time, the sender **retransmits** the segment.
- A **checksum** detects corrupted segments.

### Flow and congestion control

- **Window size**: the receiver says how much data it can accept before the sender must wait.
- **Congestion control**: TCP slows down when it detects packet loss (the network is congested) and speeds up gradually when things are clear. That's why downloads "ramp up" at the start.

### Closing a connection

Each side sends **FIN** and receives an **ACK** (a four-step close). A **RST** (reset) abruptly ends a connection, e.g. when a port is closed.

## UDP: User Datagram Protocol

UDP is **connectionless**: no handshake, no acknowledgements, no retransmission, no ordering. Each **datagram** is sent and forgotten. Its header is tiny (8 bytes vs TCP's 20+).

Why use something unreliable? Because for some applications, **late data is useless**: in a live video call, a resent packet from 2 seconds ago only causes lag. It's better to skip it and keep going. Applications that need some reliability over UDP build their own (for example **QUIC**, used by HTTP/3, adds reliability and encryption on top of UDP).

## TCP vs UDP

| | TCP | UDP |
|---|---|---|
| Connection | Yes (handshake) | No |
| Reliability | Guaranteed, ordered | Best effort |
| Speed and overhead | Slower, bigger headers | Faster, small header |
| Flow/congestion control | Yes | No (app's job) |
| Typical uses | Web (HTTP/1.1, HTTP/2), email, SSH, file transfer, databases | Video/voice calls, live streaming, online games, DNS queries, DHCP, VPNs like WireGuard, HTTP/3 (QUIC) |

## Port numbers

A port is a 16-bit number: **0 to 65,535**.

| Range | Name | Use |
|---|---|---|
| 0–1023 | **Well-known ports** | Standard services (HTTP 80, HTTPS 443); need admin rights to listen on |
| 1024–49151 | **Registered ports** | Applications (MySQL 3306, RDP 3389) |
| 49152–65535 | **Dynamic/ephemeral** | Temporary client-side ports picked by your OS for each connection |

### Ports to memorise

| Port | Protocol | Transport | Service |
|---|---|---|---|
| 20, 21 | FTP | TCP | File transfer (data, control) |
| 22 | SSH / SFTP | TCP | Secure remote login, secure file transfer |
| 23 | Telnet | TCP | Insecure remote login (avoid) |
| 25 | SMTP | TCP | Sending email between servers |
| 53 | DNS | UDP (and TCP) | Name lookups |
| 67, 68 | DHCP | UDP | Address assignment (server 67, client 68) |
| 69 | TFTP | UDP | Simple file transfer (network device configs) |
| 80 | HTTP | TCP | Web |
| 110 | POP3 | TCP | Downloading email |
| 123 | NTP | UDP | Time synchronisation |
| 143 | IMAP | TCP | Email access |
| 161, 162 | SNMP | UDP | Network monitoring |
| 389 | LDAP | TCP | Directory services |
| 443 | HTTPS | TCP (and UDP for HTTP/3) | Secure web |
| 445 | SMB | TCP | Windows file sharing |
| 465, 587 | SMTPS / Submission | TCP | Sending email from apps/clients |
| 993, 995 | IMAPS, POP3S | TCP | Secure email access |
| 3306 | MySQL/MariaDB | TCP | Database |
| 3389 | RDP | TCP | Windows Remote Desktop |
| 5432 | PostgreSQL | TCP | Database |
| 8080 | HTTP alternate | TCP | Test/proxy web servers |

## Sockets: the full address of a conversation

A **socket** is an IP address + port, e.g. `192.168.1.20:51515`. A connection is identified by **four values**: source IP, source port, destination IP, destination port.

When you open two tabs to the same website, your computer uses two different **source ports** (e.g. 51515 and 51516) to the same destination `93.184.216.34:443`, so replies reach the right tab.

```try-python
# A connection is identified by four values
connections = [
    ("192.168.1.20", 51515, "93.184.216.34", 443),
    ("192.168.1.20", 51516, "93.184.216.34", 443),
    ("192.168.1.20", 50001, "8.8.8.8", 53),
]
well_known = {443: "HTTPS", 53: "DNS", 22: "SSH", 80: "HTTP"}
for src, sport, dst, dport in connections:
    print(f"{src}:{sport} -> {dst}:{dport} ({well_known.get(dport, '?')})")
```

## Ports, NAT and firewalls

- **Home routers (NAT)** track connections by port so replies return to the right device inside. **Port forwarding** opens a specific port (e.g. TCP 8000 → the CCTV recorder) so outside users can connect in.
- **Firewalls** allow or block traffic by protocol and port: "allow TCP 443 from anywhere to the web server; allow TCP 22 only from the office IP; block everything else".
- An **open** port has a program listening; a **closed** port replies with RST; a **filtered** port is silently dropped by a firewall.

## Seeing connections on your computer

```bash
netstat -ano            # Windows: all connections with process IDs
ss -tunap               # Linux: TCP/UDP connections and processes
ss -tulpn               # Linux: listening ports
Test-NetConnection example.com -Port 443   # Windows PowerShell: is the port reachable?
nc -zv example.com 443  # Linux/macOS: test a TCP port
```

States you'll see: **LISTEN** (waiting for connections), **ESTABLISHED** (active), **TIME_WAIT** (recently closed), **SYN_SENT** (trying to connect: if stuck here, something is blocking).

:::think A new web server works when you browse to it from the server itself, but nobody outside can load the website. `ss -tulpn` shows nginx listening on 0.0.0.0:443. What should you check next?
The service is listening on all addresses, so check the path: the server's firewall (`ufw status` must allow 443), the cloud provider's security group/firewall, any router port forwarding, and DNS pointing to the right IP. Test from outside with `Test-NetConnection` or `nc -zv`.
:::

## Summary

- The transport layer delivers data to the right application using ports and chooses TCP or UDP.
- TCP: handshake (SYN, SYN-ACK, ACK), sequence numbers, ACKs, retransmission, flow and congestion control.
- UDP: no connection, no guarantees, low overhead; ideal for real-time media, DNS, DHCP, games, QUIC.
- Ports 0–65535: well-known (0–1023), registered, ephemeral; memorise the common ones.
- A connection = source IP + port + destination IP + port; NAT and firewalls work with ports.

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
Q: Which port does Windows Remote Desktop (RDP) use?
A: 3389
```
