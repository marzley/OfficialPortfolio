---
slug: subnetting-step-by-step
title: "Subnetting step by step: the magic number method with worked examples, speed tricks and endless practice"
after: KEEP
---
# Subnetting step by step: the magic number method with worked examples, speed tricks and endless practice

**Subnetting** means dividing a network into smaller networks (subnets) and being able to work out, for any address, which subnet it belongs to. It's the single most important calculation in networking: every CCNA and Network+ exam tests it, interviewers ask it, and engineers use it daily when planning offices, configuring routers and firewalls, and troubleshooting "why can't these two devices talk?".

Given any host like `192.168.37.150/28`, by the end of this unit you should find these **in under a minute, without a calculator**:
- the **network address**
- the **broadcast address**
- the **first and last usable host**
- the **number of usable hosts**

:::note What you will learn
- Why we subnet: performance, security, organisation, address efficiency
- The magic number (block size) method in 7 steps
- Worked examples in the 4th, 3rd and 2nd octets
- Checking your answer in binary
- Speed tricks used in exams
- Common mistakes
- An endless practice tool that generates new questions
:::

## Why subnet?

| Reason | Example |
|---|---|
| **Smaller broadcast domains** | Broadcasts (ARP, DHCP) stay inside each subnet instead of flooding 1,000 devices |
| **Security** | Put CCTV, guests, staff and servers in different subnets and filter traffic between them |
| **Organisation** | 10.1.10.0/24 = Nairobi finance, 10.1.20.0/24 = Nairobi sales: easy to read and troubleshoot |
| **Address efficiency** | Give each link or department only the addresses it needs |
| **Routing** | Routers route between subnets; summarised routes keep routing tables small |

## The magic number method

1. **Find the interesting octet**: the octet where the prefix ends.
   - /1–/8 → 1st octet, /9–/16 → 2nd, /17–/24 → 3rd, /25–/32 → 4th.
2. **Find the mask value** in that octet: count the prefix bits that fall in it, then use 1→128, 2→192, 3→224, 4→240, 5→248, 6→252, 7→254, 8→255.
3. **Magic number (block size)** = 256 − mask value.
4. **List multiples** of the magic number in the interesting octet: 0, M, 2M, 3M...
5. The **network** starts at the multiple at or just below the host's value in that octet. Octets **after** it become **0**.
6. The **broadcast** is one less than the next multiple. Octets after it become **255**.
7. **First host** = network + 1; **last host** = broadcast − 1. **Usable hosts** = 2^(32 − prefix) − 2.

## Example A (4th octet): 192.168.37.150/28

1. /28 → 4th octet (28 − 24 = 4 bits).
2. Mask value: 4 bits → **240**.
3. Magic number: 256 − 240 = **16**.
4. Multiples: 0, 16, 32 ... 128, **144**, 160 ...
5. 150 is between 144 and 160 → network **192.168.37.144**.
6. Broadcast = 160 − 1 → **192.168.37.159**.
7. Hosts **.145 – .158**; usable = 2⁴ − 2 = **14**.

## Example B (3rd octet): 10.14.200.9/19

1. /19 → 3rd octet (19 − 16 = 3 bits).
2. Mask value: **224**. Magic number: **32**.
3. Multiples in the 3rd octet: 0, 32, 64, 96, 128, 160, **192**, 224.
4. 200 is between 192 and 224 → network **10.14.192.0** (4th octet → 0).
5. Broadcast: 224 − 1 = 223 in the 3rd octet, 255 after → **10.14.223.255**.
6. First host **10.14.192.1**, last **10.14.223.254**. Usable = 2¹³ − 2 = **8,190**.

## Example C (2nd octet): 172.29.4.1/14

1. /14 → 2nd octet (14 − 8 = 6 bits). Mask value **252**, magic number **4**.
2. Multiples: ... 24, **28**, 32. 29 is in the block at 28.
3. Network **172.28.0.0**, broadcast **172.31.255.255**. Usable 2¹⁸ − 2 = **262,142**.

## Example D (/25, the half split): 192.168.1.200/25

1. /25 → 4th octet, 1 bit → 128, magic number **128**.
2. Multiples: 0, **128**. 200 ≥ 128 → network **192.168.1.128**.
3. Broadcast **192.168.1.255**; hosts **.129 – .254**; usable **126**.

## Example E (exact boundary): 10.0.0.64/26

1. Magic number 64; multiples 0, **64**, 128.
2. 64 is exactly a multiple → it **is** the network address: **10.0.0.64**.
3. Broadcast **10.0.0.127**. So `10.0.0.64/26` isn't a usable host address: it's the network itself. Spotting this is a common exam question ("Which of these is a valid host address?").

## Checking an answer in binary

For 192.168.37.150/28, write the last octet in binary and split it at the prefix:

```
150 = 1001 | 0110
       net   host
Network:   1001 0000 = 144
Broadcast: 1001 1111 = 159
```

Network = host bits all 0; broadcast = host bits all 1. Same answer as the magic number method.

```try-python
import ipaddress

def solve(cidr):
    iface = ipaddress.ip_interface(cidr)
    net = iface.network
    return (net.network_address, net.broadcast_address,
            net.network_address + 1, net.broadcast_address - 1, net.num_addresses - 2)

for q in ["192.168.37.150/28", "10.14.200.9/19", "172.29.4.1/14", "192.168.1.200/25", "10.0.0.64/26"]:
    n, b, f, l, h = solve(q)
    print(f"{q:18} net {n}  bcast {b}  hosts {f} - {l}  ({h} usable)")
```

## Speed tricks

- **Memorise** the mask values and block sizes: 128/128, 192/64, 224/32, 240/16, 248/8, 252/4, 254/2.
- **Divide instead of listing**: network value = (octet ÷ block, rounded down) × block. For 150 with block 16: 150 ÷ 16 = 9.375 → 9 × 16 = 144.
- **Broadcast** = network value + block − 1: 144 + 16 − 1 = 159.
- **Usable hosts** from host bits: /28 → 4 host bits → 16 − 2 = 14.
- In the 3rd octet, don't forget the 4th octet: **0** for the network, **255** for the broadcast.

```try-python
def network_value(octet, block):
    return octet // block * block

for octet, block in [(150, 16), (200, 32), (99, 8), (77, 4)]:
    n = network_value(octet, block)
    print(f"octet {octet}, block {block}: network {n}, broadcast {n + block - 1}")
```

## Common mistakes

| Mistake | Fix |
|---|---|
| Using the wrong octet for /17–/24 | Count: /19 means 3 bits into the **3rd** octet |
| Forgetting octets after the interesting one | Network → 0s, broadcast → 255s |
| Off-by-one on broadcast | Broadcast = next multiple **minus 1** |
| Counting usable hosts as 2ⁿ | Subtract 2 (except /31 and /32) |
| Treating the network address as a host | If the value is exactly a multiple, it's the network |

## Endless practice

Every question below is new. Work it out on paper, type the answers, then check. Your score is saved on this device. Aim for 10 correct in a row, then try to answer each in under 60 seconds.

```tool-subnet-practice
```

:::think Without a calculator: 172.16.99.66/29. What are the network, broadcast and usable range?
/29 → block 8. 66 ÷ 8 = 8.25 → 8 × 8 = 64. Network 172.16.99.64, broadcast 172.16.99.71, hosts .65 – .70 (6 usable).
:::

## Summary

- Subnetting splits networks for performance, security, organisation and efficiency.
- Method: interesting octet → mask value → block size (256 − value) → multiples → network and broadcast.
- Octets after the interesting one become 0 (network) or 255 (broadcast).
- First host = network + 1, last = broadcast − 1, usable = 2^(host bits) − 2.
- Practise until it takes under a minute; use binary to double-check.

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
Q: Is 10.0.0.64/26 a usable host address? (yes/no)
A: no
```

**Learn more:** [Practical Networking: subnetting cheat sheet](https://www.practicalnetworking.net/series/subnetting/subnetting/) · [Jeremy's IT Lab (free CCNA course on YouTube)](https://www.youtube.com/@JeremysITLab)
