---
slug: wifi
title: "Wi-Fi: standards, bands and channels, planning coverage, security, guest networks and fixing slow Wi-Fi"
after: KEEP
---
# Wi-Fi: standards, bands and channels, planning coverage, security, guest networks and fixing slow Wi-Fi

Most people connect to networks through **Wi-Fi**: phones, laptops, smart TVs, POS machines and CCTV cameras. Wi-Fi is also the most complained-about part of most networks ("the Wi-Fi is slow!"). Radio waves are affected by walls, distance, interference and how many people share them, so good Wi-Fi needs planning. This unit covers the standards, frequencies, channels, coverage planning, security settings and a practical method to fix slow or dropping Wi-Fi.

:::note What you will learn
- How Wi-Fi works (radio, SSIDs, access points, clients)
- Wi-Fi generations: 802.11n/ac/ax/be (Wi-Fi 4, 5, 6/6E, 7)
- 2.4 GHz vs 5 GHz vs 6 GHz bands
- Channels, channel width and interference
- Planning coverage: placement, number of APs, site surveys
- Home routers vs mesh vs enterprise controller-based systems
- Security: WPA2, WPA3, Enterprise (802.1X), WPS, guest networks and captive portals
- Troubleshooting slow and dropping Wi-Fi
:::

## How Wi-Fi works

- An **access point (AP)** sends and receives radio signals and bridges wireless clients onto the wired network.
- The **SSID** is the network name you see ("Office-Staff", "Cafe-Guest"). One AP can broadcast several SSIDs, each mapped to a different VLAN.
- Clients and the AP **share the radio channel**: only one device transmits at a time on a channel, so more devices means less airtime each. Wi-Fi is "half duplex" shared media, unlike a switch port.
- Speeds advertised on boxes ("AX3000") are theoretical maximums across all bands combined; real throughput per device is much lower.

## Wi-Fi generations

| Name | IEEE standard | Bands | Notes |
|---|---|---|---|
| Wi-Fi 4 | 802.11n | 2.4 & 5 GHz | Older; still common in cheap devices |
| Wi-Fi 5 | 802.11ac | 5 GHz | Much faster on 5 GHz |
| Wi-Fi 6 | 802.11ax | 2.4 & 5 GHz | Better in crowded places (OFDMA), better battery life |
| Wi-Fi 6E | 802.11ax | adds 6 GHz | Clean new spectrum where regulators allow it |
| Wi-Fi 7 | 802.11be | 2.4, 5, 6 GHz | Very wide channels, multi-link operation |

Devices fall back to the best standard **both** sides support: a Wi-Fi 6 router doesn't make an old Wi-Fi 4 phone faster.

## Bands: 2.4 vs 5 vs 6 GHz

| | 2.4 GHz | 5 GHz | 6 GHz |
|---|---|---|---|
| Range and wall penetration | Best | Medium | Shortest |
| Speed | Lowest | High | Highest |
| Non-overlapping channels | Only 3 (1, 6, 11) | Many | Many |
| Interference | Crowded: neighbours, Bluetooth, microwaves | Less | Least (newest) |
| Best for | Distance, IoT devices, old devices | Most laptops and phones | New devices, dense areas |

Many routers use **band steering**: one SSID for both bands, nudging capable devices to 5 GHz.

## Channels and channel width

### 2.4 GHz
Channels are 5 MHz apart but each signal is about 20 MHz wide, so neighbouring channels overlap. Use only **1, 6 or 11**, with 20 MHz width. Using channel 3 or 9 interferes with two others.

### 5 GHz
Many more non-overlapping channels. Wider channels (40/80/160 MHz) are faster but use more spectrum and are more likely to clash with neighbours. In busy offices, 20 or 40 MHz often gives better overall results than 80 MHz. Some 5 GHz channels (DFS) must give way to radar.

**Co-channel interference**: two APs on the same channel within range take turns, halving each other's capacity. **Adjacent-channel interference** (overlapping channels) is worse: they corrupt each other's signals.

## Planning coverage

1. **Know the requirements**: how many users and devices, what they do (video calls need more than email), which areas (offices, halls, outdoors).
2. **Place APs well**:
   - Central and high (ceiling mounted is best), not inside cabinets or behind TVs.
   - Avoid thick concrete walls, metal, water tanks and mirrors between AP and users.
   - One AP per few rooms in concrete buildings; one per classroom in dense schools.
3. **Capacity, not just coverage**: as a rough rule, plan for no more than about 25–50 active devices per AP radio for good performance (depends on the AP and usage).
4. **Channel plan**: neighbouring APs on different channels (1/6/11 for 2.4 GHz).
5. **Power**: don't set every AP to maximum; too much power causes interference and "sticky" clients that cling to a far AP.
6. **Site survey**: walk the building with a Wi-Fi analyser app (e.g. on Android) measuring signal strength and channels. Aim for about **−67 dBm or stronger** where people work (closer to 0 is stronger: −50 is excellent, −80 is poor).
7. **Wire the APs**: each AP connected by Ethernet (often PoE) is far better than wireless repeaters, which halve throughput.

## Home router, mesh or enterprise?

| Option | Best for | Notes |
|---|---|---|
| **ISP router alone** | Small flats | One device; coverage often weak in big houses |
| **Range extender/repeater** | A quick fix for one dead spot | Often halves speed; separate SSID confusion |
| **Mesh system** | Large homes, small offices | Several nodes, one SSID, seamless roaming; wired backhaul is best |
| **Enterprise APs + controller/cloud management** | Schools, hotels, offices | Central management, VLANs per SSID, roaming, monitoring, captive portals |

## Security

| Setting | Recommendation |
|---|---|
| **Encryption** | **WPA3** where all devices support it; otherwise **WPA2-AES** (or WPA2/WPA3 mixed mode). Never WEP or WPA/TKIP (broken) |
| **Password** | Long passphrase (12+ characters), not the router's default; change when staff leave |
| **WPS** | **Turn off**: the PIN method can be cracked |
| **Admin login** | Change the router's default admin password; disable remote admin from the internet |
| **Firmware** | Keep updated |
| **Enterprise (802.1X)** | Each user logs in with their own account (via a RADIUS server); removing one person's access doesn't require changing everyone's password. Best for organisations |
| **Guest network** | Separate SSID and VLAN, **client isolation** on, no access to internal devices, bandwidth limits |
| **Captive portal** | A login/terms page for guests (hotels, cafés), sometimes with vouchers or M-Pesa payment |

Hiding the SSID or MAC filtering adds little real security (both are easy to bypass) and causes support headaches.

## Troubleshooting slow or dropping Wi-Fi

| Symptom | Likely causes | Fixes |
|---|---|---|
| Slow far from the AP | Weak signal (−75 dBm or worse) | Move closer, add/relocate APs, use 2.4 GHz for range |
| Slow everywhere at busy times | Too many users per AP, internet line saturated | More APs, limit guest bandwidth, upgrade line, check for big downloads/updates |
| Drops every few minutes | Interference, overlapping channels, overheating router, power-saving | Change channels, update firmware, ventilate, check power |
| Good signal but no internet | Problem is beyond Wi-Fi: DHCP, DNS, ISP | Test wired; check IP settings; ping gateway and 8.8.8.8 |
| One device bad, others fine | Old Wi-Fi card, driver, power-saving setting | Update drivers, forget/rejoin network, check device |
| Can't see 5 GHz network | Device only supports 2.4 GHz, or channel not supported | Use 2.4 GHz SSID, change 5 GHz channel |

Test properly: run a speed test **wired** to the router and **on Wi-Fi** near the AP. If wired is also slow, the Wi-Fi isn't the problem.

```bash
netsh wlan show interfaces       # Windows: signal %, channel, radio type, speed
netsh wlan show networks mode=bssid   # nearby networks and channels
iw dev wlan0 link                # Linux: signal (dBm) and bitrate
```

:::think A café has one Wi-Fi router behind the counter. Customers at the back tables complain the Wi-Fi is slow, and staff POS tablets sometimes disconnect. Suggest an improvement plan.
Separate staff and guests: a staff SSID/VLAN (WPA2/WPA3) for POS, and a guest SSID with client isolation and bandwidth limits. Add a second access point (wired, ideally PoE) near the back tables, set non-overlapping channels (1/6/11 on 2.4 GHz, different 5 GHz channels), reduce power so clients roam properly, update firmware, and confirm the internet line itself is fast enough at busy times.
:::

## Summary

- APs bridge wireless clients to the wired network; clients share airtime on a channel.
- Generations: Wi-Fi 4 (n), 5 (ac), 6/6E (ax), 7 (be); both ends must support a standard to benefit.
- 2.4 GHz: range, only channels 1/6/11; 5 GHz: speed, many channels; 6 GHz: newest, shortest range.
- Plan placement, capacity, channels and power; survey for about −67 dBm; wire APs instead of using repeaters.
- Use WPA3/WPA2-AES, disable WPS, separate guests, consider 802.1X; troubleshoot by comparing wired vs wireless.

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
Q: Which is a stronger signal: -55 dBm or -80 dBm?
A: -55 | -55 dbm
Q: What guest network setting stops guests' devices from reaching each other? (two words)
A: client isolation | ap isolation
```
