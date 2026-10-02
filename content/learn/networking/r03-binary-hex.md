---
slug: binary-hex
title: "Binary and hexadecimal for networking: conversions by hand, mask values, powers of two and hex in MAC/IPv6"
after: KEEP
---
# Binary and hexadecimal for networking: conversions by hand, mask values, powers of two and hex in MAC/IPv6

Computers store everything as **bits**: 0 or 1. An IPv4 address like `192.168.1.10` is really 32 bits, and a subnet mask like `255.255.255.0` is 32 bits too. Subnetting, which is the skill every network engineer needs (and every networking exam tests), is just counting and switching bits. Once binary feels natural, subnetting becomes easy.

**Hexadecimal** (hex) is a shorter way to write binary. You'll see it in **MAC addresses** (`3C:52:82:1A:0F:9B`), **IPv6 addresses** (`2001:db8::1`), colour codes in web design (`#FF6600`) and error codes.

:::note What you will learn
- Why computers use binary, and bits vs bytes
- Place values in one octet (8 bits)
- Binary → decimal and decimal → binary by hand
- The mask values every engineer memorises
- Powers of two and what they tell you about hosts and subnets
- Hexadecimal: converting hex ↔ binary ↔ decimal
- Where hex appears: MAC addresses, IPv6
- An interactive converter and practice
:::

## Why binary?

Electronics are reliable at telling two states apart: voltage on/off, light on/off, magnetised one way or the other. So computers count in **base 2** (two digits: 0 and 1) instead of base 10.

| Term | Size |
|---|---|
| **Bit** | One 0 or 1 |
| **Nibble** | 4 bits (one hex digit) |
| **Byte / octet** | 8 bits |
| IPv4 address | 32 bits = 4 octets |
| MAC address | 48 bits = 6 bytes |
| IPv6 address | 128 bits |

Networking says **octet** for 8 bits because historically "byte" wasn't always 8 bits.

## Place values in one octet

In decimal, each position is worth 10× the one to its right (1, 10, 100...). In binary, each position is worth **2×**:

| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ |

All eight bits on = 128+64+32+16+8+4+2+1 = **255**, which is why each octet of an IP address goes from 0 to 255.

## Binary to decimal

**Add the place values wherever there's a 1.**

| Binary | Working | Decimal |
|---|---|---|
| `11000000` | 128 + 64 | **192** |
| `10101000` | 128 + 32 + 8 | **168** |
| `00001010` | 8 + 2 | **10** |
| `11111111` | all | **255** |
| `01111111` | 64+32+16+8+4+2+1 | **127** |

So `11000000.10101000.00000001.00001010` = `192.168.1.10`.

## Decimal to binary (subtraction method)

Go through the place values from 128 down. If the value fits into what's left, write **1** and subtract; otherwise write **0**.

Convert **200**:

| Place | Fits in remaining? | Bit | Remaining |
|---|---|---|---|
| 128 | 128 ≤ 200 yes | 1 | 72 |
| 64 | 64 ≤ 72 yes | 1 | 8 |
| 32 | no | 0 | 8 |
| 16 | no | 0 | 8 |
| 8 | 8 ≤ 8 yes | 1 | 0 |
| 4 | no | 0 | 0 |
| 2 | no | 0 | 0 |
| 1 | no | 0 | 0 |

200 = `11001000`.

Check yourself with Python:

```try-python
def to_binary(n):
    bits = ""
    for place in [128, 64, 32, 16, 8, 4, 2, 1]:
        if place <= n:
            bits += "1"
            n -= place
        else:
            bits += "0"
    return bits

for n in [200, 172, 10, 255, 99]:
    print(n, "=", to_binary(n), "| check:", format(n, "08b"))

ip = "192.168.1.10"
print(".".join(to_binary(int(o)) for o in ip.split(".")))
```

## Numbers to memorise: mask values

Subnet masks are made of 1s followed by 0s. These are the only values a mask octet can take:

| Binary | Decimal | Bits on | Block size (256 − value) |
|---|---|---|---|
| `00000000` | 0 | 0 | 256 |
| `10000000` | 128 | 1 | 128 |
| `11000000` | 192 | 2 | 64 |
| `11100000` | 224 | 3 | 32 |
| `11110000` | 240 | 4 | 16 |
| `11111000` | 248 | 5 | 8 |
| `11111100` | 252 | 6 | 4 |
| `11111110` | 254 | 7 | 2 |
| `11111111` | 255 | 8 | 1 |

Trick: each value is the previous one **plus half the remaining gap**: 128, +64 = 192, +32 = 224, +16 = 240, +8 = 248, +4 = 252, +2 = 254, +1 = 255.

## Powers of two

| n | 2ⁿ | n | 2ⁿ |
|---|---|---|---|
| 1 | 2 | 9 | 512 |
| 2 | 4 | 10 | 1,024 |
| 3 | 8 | 11 | 2,048 |
| 4 | 16 | 12 | 4,096 |
| 5 | 32 | 13 | 8,192 |
| 6 | 64 | 14 | 16,384 |
| 7 | 128 | 15 | 32,768 |
| 8 | 256 | 16 | 65,536 |

Why they matter:
- **Host bits** h give 2ʰ addresses, of which 2ʰ − 2 are usable hosts (one for the network, one for broadcast). 8 host bits → 256 addresses → 254 hosts.
- **Borrowed bits** b give 2ᵇ subnets. Borrow 3 bits → 8 subnets.

## Hexadecimal

Hex is **base 16**: digits 0–9, then **A=10, B=11, C=12, D=13, E=14, F=15**. One hex digit is exactly 4 bits, so one byte is two hex digits.

| Hex | Binary | Decimal | Hex | Binary | Decimal |
|---|---|---|---|---|---|
| 0 | 0000 | 0 | 8 | 1000 | 8 |
| 1 | 0001 | 1 | 9 | 1001 | 9 |
| 2 | 0010 | 2 | A | 1010 | 10 |
| 3 | 0011 | 3 | B | 1011 | 11 |
| 4 | 0100 | 4 | C | 1100 | 12 |
| 5 | 0101 | 5 | D | 1101 | 13 |
| 6 | 0110 | 6 | E | 1110 | 14 |
| 7 | 0111 | 7 | F | 1111 | 15 |

### Converting

- **Hex → binary**: replace each digit with its 4 bits. `C0` → `1100 0000`.
- **Binary → hex**: split into groups of 4 from the right. `1010 1000` → `A8`.
- **Hex → decimal**: first digit × 16 + second digit. `A8` = 10×16 + 8 = **168**. `FF` = 15×16 + 15 = **255**.
- **Decimal → hex**: divide by 16; the quotient is the first digit, the remainder the second. 192 ÷ 16 = 12 remainder 0 → `C0`.

```try-python
for n in [192, 168, 10, 255, 172]:
    print(n, "-> hex", format(n, "02X"), "-> binary", format(n, "08b"))
print("Hex A8 is", int("A8", 16), "in decimal")
```

## Where hex appears in networking

**MAC addresses**: 48 bits written as 6 pairs of hex digits: `3C:52:82:1A:0F:9B` (Windows shows `3C-52-82-1A-0F-9B`; Cisco shows `3c52.821a.0f9b`). The first 3 bytes (the **OUI**) identify the manufacturer.

**IPv6 addresses**: 128 bits written as 8 groups of 4 hex digits: `2001:0db8:0000:0000:0000:0000:0000:0001`, shortened to `2001:db8::1` (the IPv6 lesson explains the rules).

## Try the converter

Type in any box; the others update. The row shows which bits are on.

```tool-binary
```

## Practice

Convert without a calculator, then check with the converter:
1. `11110000` → decimal
2. 172 → binary
3. 100 → binary
4. `0x3F` → decimal
5. 224 → hex
6. `10111111` → decimal

:::think Answers to the practice questions above?
1) 240. 2) 10101100. 3) 01100100. 4) 3×16 + 15 = 63. 5) E0. 6) 128+32+16+8+4+2+1 = 191.
:::

## Summary

- Computers use binary because two states are reliable; an octet is 8 bits with place values 128, 64, 32, 16, 8, 4, 2, 1.
- Binary → decimal: add the places with 1s; decimal → binary: subtract from 128 down.
- Memorise mask values 128, 192, 224, 240, 248, 252, 254, 255 and powers of two.
- h host bits give 2ʰ − 2 usable hosts; b borrowed bits give 2ᵇ subnets.
- Hex digits are 4 bits each (A=10 ... F=15); hex appears in MAC and IPv6 addresses.

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
A: 1024 | 1,024
Q: How many usable hosts do 5 host bits give?
A: 30
H: 2^5 - 2
```

**Learn more:** [Khan Academy: binary numbers](https://www.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:digital-information/xcae6f4a7ff015e7d:binary-numbers/a/bits-and-binary) · [Cisco binary game](https://learningcontent.cisco.com/games/binary/index.html)
