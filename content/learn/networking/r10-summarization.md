---
slug: summarization
title: "Route summarisation (supernetting): combining networks into one route, step by step"
after: KEEP
---
# Route summarisation (supernetting): combining networks into one route, step by step

**Summarisation** (also called supernetting or route aggregation) is the opposite of subnetting: combining several networks into **one bigger route**. Instead of telling the whole network about every small subnet at a branch, the branch router advertises a single summary. Routers then need fewer entries, use less memory and CPU, converge faster after changes, and a problem in one small subnet (a link flapping up and down) doesn't disturb routers far away.

The internet depends on it: ISPs receive large blocks and advertise one route for thousands of customers. Without summarisation, the global routing table would be unmanageable.

:::note What you will learn
- Why summarisation matters
- Finding a summary route using binary (step by step)
- A faster method using block sizes
- Checking a summary covers exactly what you intend
- Over-summarisation and black holes
- Designing addresses so they summarise well
- Where summaries are configured (static routes, OSPF, EIGRP, BGP)
:::

## A first example

A branch office uses:

```
192.168.8.0/24
192.168.9.0/24
192.168.10.0/24
192.168.11.0/24
```

Instead of four routes, the head office can use **one**: `192.168.8.0/22`.

## Method 1: binary

1. Write the **changing octet** of each network in binary (the octets before it are identical):

```
 8 = 000010 00
 9 = 000010 01
10 = 000010 10
11 = 000010 11
```

2. Count the **bits that are the same** from the left: the first 6 bits (`000010`) match.
3. Summary prefix = bits in the earlier octets + matching bits = 16 + 6 = **/22**.
4. Summary address = the matching bits followed by zeros: `00001000` = **8** → `192.168.8.0/22`.

## Method 2: block sizes (faster)

1. Count the networks: 4 consecutive /24s.
2. Is the count a power of 2? 4 = 2² → the summary is 2 bits shorter: /24 − 2 = **/22**.
3. Does the first network sit on a boundary of that size? A /22 has a block size of 4 in the third octet: valid starts are 0, 4, **8**, 12... 8 is a multiple of 4 ✓.
4. Summary: `192.168.8.0/22`.

If the first network isn't on the boundary, the summary must be bigger (and will include extra networks).

## More examples

| Networks | Summary | Why |
|---|---|---|
| 10.1.4.0/24 – 10.1.7.0/24 | 10.1.4.0/22 | 4 networks, start 4 is a multiple of 4 |
| 172.16.32.0/24 – 172.16.47.0/24 | 172.16.32.0/20 | 16 networks = 2⁴, 32 is a multiple of 16 |
| 192.168.0.0/24 + 192.168.1.0/24 | 192.168.0.0/23 | 2 networks |
| 10.0.0.0/16 – 10.7.0.0/16 | 10.0.0.0/13 | 8 networks in the 2nd octet |
| 192.168.10.0/26, .64/26, .128/26, .192/26 | 192.168.10.0/24 | Four /26s make a /24 |

```try-python
import ipaddress
groups = [
    ["192.168.8.0/24", "192.168.9.0/24", "192.168.10.0/24", "192.168.11.0/24"],
    ["172.16.32.0/24", "172.16.47.0/24"],     # endpoints only: the smallest supernet that holds both
    ["10.1.4.0/24", "10.1.7.0/24"],
]
for nets in groups:
    nets = [ipaddress.ip_network(n) for n in nets]
    summary = nets[0]
    while not all(n.subnet_of(summary) for n in nets):
        summary = summary.supernet()
    print(", ".join(map(str, nets)), "->", summary)
```

## Check the summary

A summary `/p` covers 2^(32 − p) addresses. For 192.168.8.0/22: 2¹⁰ = 1,024 = 4 × 256 → exactly 192.168.8.0 to 192.168.11.255 ✓.

## Careful: over-summarisation

Networks `172.16.4.0/24` and `172.16.7.0/24` share the first 6 bits of the third octet (`000001`), giving `172.16.4.0/22`. But that summary **also includes** 172.16.5.0 and 172.16.6.0. If those networks are at another site, routers will send their traffic to the wrong place.

Even worse, if the summarising router receives traffic for a network inside the summary that **doesn't exist**, it may drop it or bounce it around. Routers usually add a route to **Null0** (a "discard" route) for the summary to prevent loops; traffic for non-existent subnets is quietly dropped. That's the safe behaviour, but it means a misplaced summary can create a **black hole** for real networks elsewhere.

**Only summarise address space that really lives behind that router.**

## Non-contiguous networks

Networks 192.168.1.0/24 and 192.168.3.0/24 can't be summarised exactly: the smallest summary is 192.168.0.0/22, which also covers .0 and .2. Options: advertise them separately, or redesign addressing.

## Designing for summarisation

Good IP plans make summaries natural:
- Give each site or region a **contiguous, power-of-two block**: Nairobi 10.1.0.0/16, Mombasa 10.2.0.0/16, Kisumu 10.3.0.0/16.
- Inside each site, subnet from its block (10.1.10.0/24, 10.1.20.0/24...).
- The core then needs only one route per site: 10.1.0.0/16 via the Nairobi router.

## Where summaries are configured

| Method | Example |
|---|---|
| **Static route** | `ip route 10.2.0.0 255.255.0.0 172.16.2.226` (Cisco) |
| **OSPF** | Summaries at area border routers (`area 1 range 10.2.0.0 255.255.0.0`) |
| **EIGRP** | Summary on an interface (`ip summary-address eigrp ...`) |
| **BGP** | `aggregate-address` to advertise one prefix to other networks |

## Why providers love CIDR

Internet providers receive big blocks and advertise **one** route to the rest of the internet, while splitting it into thousands of customer subnets inside. The global IPv4 routing table has around a million routes instead of billions, because of aggregation.

:::think Head office routes need to reach a branch with 10.50.0.0/24, 10.50.1.0/24, 10.50.2.0/24 and 10.50.3.0/24, plus a second branch using 10.50.4.0/24. Can you summarise the first branch as 10.50.0.0/21? What should you use instead?
No: 10.50.0.0/21 covers 10.50.0.0–10.50.7.255, including the second branch's 10.50.4.0/24. Use 10.50.0.0/22 for the first branch (exactly .0–.3) and 10.50.4.0/24 for the second.
:::

## Summary

- Summarisation combines contiguous networks into one shorter-prefix route, shrinking routing tables and hiding instability.
- Binary method: count matching bits; block method: power-of-two count starting on a boundary.
- Verify the summary covers exactly the intended networks; over-summarising sends traffic to the wrong place.
- Design addressing per site in contiguous power-of-two blocks so summaries are clean.
- Configure summaries in static routes, OSPF, EIGRP and BGP.

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
Q: Four /26 subnets of 192.168.10.0 summarise to what?
A: 192.168.10.0/24
Q: What interface do routers point summary discard routes to? (Cisco)
A: Null0 | null 0 | null
```
