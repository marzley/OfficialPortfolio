---
slug: hardware-parts
title: "Inside the computer: every hardware component, how it works and how to identify it"
after: KEEP
---
# Inside the computer: every hardware component, how it works and how to identify it

To repair, upgrade or build computers (or simply buy the right one and explain problems to a technician), you need to know what's inside the box. This unit opens up a desktop and laptop, explaining each component's job, how it connects, how to identify it, the common specifications, and the failures technicians see most often. It's the foundation for the troubleshooting, upgrade and Windows installation lessons in this subject.

:::note What you will learn
- Safety before opening a computer (power and static electricity)
- Motherboard: form factors, sockets, slots, chipsets and BIOS/UEFI
- CPU, cooling and thermal paste
- RAM types (DDR4/DDR5, SO-DIMM) and capacity
- Storage: HDD, SATA SSD, NVMe SSD, interfaces
- Graphics cards, power supplies, cases and cables
- Laptop internals vs desktops
- Identifying components with software (Task Manager, System Information, CPU-Z)
- Common hardware failures and symptoms
:::

## Safety first

1. **Shut down and unplug** the power cable; for laptops, disconnect the charger and, if possible, the battery.
2. Press the power button for a few seconds after unplugging to drain residual power.
3. **Static electricity (ESD)** can damage components: touch a grounded metal object first, or use an **anti-static wrist strap**; work on a non-carpeted surface; handle cards by the edges.
4. **Never open the power supply unit (PSU)**: capacitors inside can hold dangerous charge even when unplugged.
5. Keep screws organised (a magnetic tray or labelled containers); take photos before disconnecting cables.
6. Laptops: some have warranty stickers; opening may void warranty.

## The motherboard

:::define Motherboard
The main circuit board connecting all components: CPU, memory, storage, expansion cards, ports and power. Also called the mainboard or system board.
:::

### Form factors (sizes)

| Form factor | Size | Use |
|---|---|---|
| **ATX** | Full size (about 30.5 × 24.4 cm) | Standard desktops, more slots |
| **Micro-ATX** | Smaller | Common office PCs |
| **Mini-ITX** | Very small | Compact PCs |
| Laptop boards | Custom shapes | Specific to each model |

### Key parts of the motherboard

| Part | Purpose |
|---|---|
| **CPU socket** | Holds the processor; must match the CPU (e.g. Intel LGA1700, AMD AM4/AM5) |
| **RAM slots (DIMM)** | Memory modules; dual-channel works best with matching pairs in the right slots |
| **PCIe slots** | Expansion cards: graphics, network, NVMe adapters (x16 for graphics, x1 for small cards) |
| **M.2 slots** | NVMe/SATA SSDs (and some Wi-Fi cards) |
| **SATA ports** | Hard drives, SATA SSDs, DVD drives |
| **Chipset** | Controls communication between CPU and devices; determines features |
| **Power connectors** | 24-pin main power, 4/8-pin CPU power |
| **Front panel headers** | Power button, LEDs, USB and audio from the case front |
| **CMOS battery** (CR2032 coin cell) | Keeps BIOS settings and the clock when unplugged |
| **Rear I/O panel** | USB, display outputs, Ethernet, audio |
| **VRMs** | Regulate power to the CPU |

### BIOS/UEFI

The **firmware** that runs first when you power on: checks hardware (POST), then starts the operating system from a boot drive. **UEFI** is the modern replacement for BIOS, with mouse support, secure boot and support for large drives. Enter setup by pressing a key at startup (often `F2`, `Del`, `F10`, `F12` for boot menu, or `Esc`, depending on the manufacturer).

Common settings: **boot order** (USB first to install Windows), date/time, **Secure Boot**, virtualization (needed for some software), enabling/disabling devices.

A dead CMOS battery causes symptoms like the clock resetting and "CMOS checksum error" messages.

## The CPU (processor)

- Executes instructions; speed affected by **cores/threads**, **clock speed (GHz)**, **cache**, and **generation/architecture**.
- **Intel:** Core i3/i5/i7/i9 and Core Ultra; suffixes matter (U = low-power laptop, H/HX = high-performance laptop, K = unlocked desktop, F = no integrated graphics).
- **AMD:** Ryzen 3/5/7/9; suffixes (U, H/HS, X, G = with graphics).
- Desktop CPUs can be replaced (matching socket/chipset); most laptop CPUs are **soldered**.

### Cooling

CPUs produce heat and need a **heat sink and fan** (or liquid cooler). **Thermal paste** fills tiny gaps between the CPU and cooler to transfer heat. Old dried paste plus dust causes overheating; technicians clean and re-apply paste during servicing.

Symptoms of overheating: loud fans, the PC slowing down (thermal throttling), sudden shutdowns.

## RAM (memory)

| Type | Used in |
|---|---|
| **DDR3** | Older PCs (around 2010–2015) |
| **DDR4** | Most PCs from about 2015–2022 |
| **DDR5** | Newer PCs |
| **DIMM** | Desktop modules (long) |
| **SO-DIMM** | Laptop modules (short) |
| **Soldered (LPDDR)** | Many thin laptops: can't be upgraded |

Types aren't interchangeable (different notches). Speed (e.g. 3200 MHz) and capacity (8 GB, 16 GB) matter. RAM problems cause random crashes, blue screens and failure to boot (often with beep codes).

## Storage

| Type | Interface | Speed | Notes |
|---|---|---|---|
| **HDD** (3.5" desktop, 2.5" laptop) | SATA | Slow (spinning platters) | Cheap, large; vulnerable to drops; clicking noise = failing |
| **SATA SSD** (2.5") | SATA | Fast (several times faster than HDD in everyday use) | Easy upgrade for old laptops/desktops |
| **M.2 SATA SSD** | M.2 slot, SATA protocol | Same as SATA SSD | Check the slot supports SATA |
| **M.2 NVMe SSD** | M.2 slot, PCIe protocol | Fastest | Check slot type (M key, PCIe generation) |
| **eMMC** | Soldered | Slow-ish | Budget laptops/tablets; can't upgrade |

Identifying: an M.2 drive is a small stick; check the keying (notches) and the motherboard manual for NVMe vs SATA support.

## Graphics (GPU)

- **Integrated graphics** (in the CPU): fine for office, video and light editing.
- **Dedicated graphics cards** (NVIDIA GeForce/RTX, AMD Radeon): gaming, 3D, video editing, AI. Desktop cards use a PCIe x16 slot and often extra power cables from the PSU.

## Power supply unit (PSU)

Converts AC mains power to DC voltages (12V, 5V, 3.3V) for components.
- **Wattage:** enough for the system plus headroom (a basic office PC needs little; gaming PCs with graphics cards need more).
- **Efficiency ratings:** 80 PLUS Bronze/Gold etc.
- Cheap, poor-quality PSUs fail and can damage other parts; use reputable brands.
- Laptops use an external **adapter**: correct voltage/wattage and connector matter.

Use a **UPS** or surge protector where power is unstable; voltage surges and outages damage PSUs and drives.

## Cases, fans and cables

- **Case:** holds and cools components; airflow front-to-back/bottom-to-top; dust filters help.
- **Cables:** SATA data and power, 24-pin and 8-pin power, PCIe power, front panel.
- **Fans:** intake and exhaust; clean dust regularly (dusty environments clog them quickly).

## Laptop internals

Laptops pack components tightly:
- Bottom panel removal (screws, sometimes clips).
- Common **upgradeable** parts on many models: SSD/HDD, RAM (if not soldered), Wi-Fi card, battery.
- **Not usually upgradeable:** CPU, GPU, soldered RAM.
- Delicate ribbon cables (keyboard, display, touchpad): open connectors carefully.
- Keyboards, screens, hinges and charging ports are common repair parts.

Before buying parts, check the exact model's specifications (manufacturer's website, service manual, or tools like Crucial's System Scanner for RAM compatibility).

## Identifying components with software

| Tool | Shows |
|---|---|
| **Task Manager → Performance** (`Ctrl+Shift+Esc`) | CPU model, RAM amount/speed/slots used, disk type (SSD/HDD), GPU |
| **System Information** (`msinfo32`) | Detailed system summary, BIOS version, motherboard |
| **Settings → System → About** | CPU, RAM, Windows edition, device name |
| **Device Manager** | All devices and driver problems (yellow warnings) |
| **CPU-Z** (free) | CPU, motherboard, RAM type and timings |
| **CrystalDiskInfo** (free) | Drive health (SMART status) |
| **dxdiag** | Graphics and DirectX information |

:::think A customer wants more RAM for a laptop. What would you check before buying a RAM stick?
Whether the laptop's RAM is upgradeable or soldered, how many slots it has and how many are free, the RAM type (DDR4/DDR5, SO-DIMM), supported speed, and maximum supported capacity. Use Task Manager/CPU-Z and the manufacturer's specifications or a compatibility tool before buying.
:::

## Common hardware failures and symptoms

| Symptom | Possible cause |
|---|---|
| No power at all, no lights | PSU/adapter failure, power button, socket, motherboard |
| Fans spin but no display | RAM not seated, GPU/display issue, motherboard, CPU |
| Beeps at startup | POST error codes (RAM, GPU); check the manufacturer's beep code list |
| Clicking or grinding noise | Failing HDD: **back up immediately** |
| Random shutdowns | Overheating, failing PSU, battery |
| Blue screens | Faulty RAM, drivers, failing drive |
| Slow, freezing, files corrupt | Failing drive, malware, low RAM |
| Clock resets | Dead CMOS battery |
| Laptop won't charge | Adapter, charging port, battery, motherboard charging circuit |
| Swollen battery (case bulging, touchpad lifting) | **Stop using; replace safely** (fire risk) |

## Practice tasks

1. Open Task Manager → Performance and write down your CPU, RAM (amount, speed, slots) and disk type.
2. Run `msinfo32` and find your motherboard model and BIOS version.
3. Install CrystalDiskInfo (or check SMART status) and note your drive's health.
4. Find your laptop/desktop model's specifications online and list which parts are upgradeable.
5. With supervision and safety steps, open a desktop and identify the motherboard, CPU cooler, RAM, storage, PSU and cables.

## Summary

- Work safely: unplug, discharge, prevent static, never open PSUs.
- The motherboard connects everything (sockets, RAM slots, PCIe, M.2, SATA, chipset, BIOS/UEFI, CMOS battery).
- CPUs need proper cooling and thermal paste; RAM types (DDR4/DDR5, DIMM/SO-DIMM) aren't interchangeable.
- Storage ranges from HDD (slow) to SATA SSD and NVMe (fastest); check slot compatibility.
- GPUs, PSUs (quality and wattage), cases, fans and cables complete a desktop; laptops have fewer upgradeable parts.
- Identify parts with Task Manager, msinfo32, Device Manager, CPU-Z and CrystalDiskInfo; learn common failure symptoms.

```quiz
Q: What should you never open because of dangerous stored charge? (three letters)
A: PSU | power supply
Q: What small battery keeps BIOS settings and the clock? (one word)
A: CMOS | CMOS battery | CR2032
Q: What laptop RAM module type is shorter than desktop DIMMs?
A: SO-DIMM | sodimm
Q: Which SSD type is fastest: SATA or NVMe?
A: NVMe | nvme
Q: What material helps transfer heat between the CPU and cooler? (two words)
A: thermal paste
Q: What should you do immediately if a hard disk starts clicking? (two words)
A: back up | backup
Q: Which Windows command opens System Information?
A: msinfo32
```
