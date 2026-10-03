---
slug: printers-peripherals
title: Printers, scanners and peripherals: setup and common fixes
after: malware-cleanup
---
# Printers, scanners and peripherals: setup and common fixes

Offices, schools and cyber cafés depend on printers, scanners, projectors and other devices, and they cause a large share of support calls. These are the fixes that solve most problems.

## Types of printers

| Type | Good for | Running cost |
|---|---|---|
| **Inkjet** | Occasional colour and photos | Cartridges can be expensive per page |
| **Ink tank** (EcoTank, Smart Tank, Ink Tank series) | High-volume colour at low cost: popular in cyber cafés | Very low per page |
| **Laser (mono)** | Fast black-and-white documents | Low per page; toner lasts long |
| **Colour laser** | Offices printing colour documents | Medium |
| **Multifunction (MFP)** | Print + scan + copy (+ fax) | Depends on type |

## Connecting and installing a printer

1. Connect by **USB**, **Ethernet** (network) or **Wi-Fi** (use the printer's menu or WPS button).
2. Windows usually installs a basic driver automatically: **Settings → Bluetooth & devices → Printers & scanners → Add device**.
3. For full features (scanning, maintenance tools, ink levels), install the maker's software from the **official website** (HP, Epson, Canon, Brother) using the exact model number.
4. Print a **test page** (printer properties).
5. For a shared office printer, give it a **fixed IP address** (DHCP reservation on the router) so computers don't lose it.

## Common problems and fixes

| Problem | Try this |
|---|---|
| **Printer "offline"** | Check power, cable/Wi-Fi; restart printer and PC; in Printers & scanners, open the printer → untick **Use Printer Offline**; check it's on the same Wi-Fi network |
| **Jobs stuck in the queue** | Open the queue → Cancel all. If stuck, restart the **Print Spooler** service (Win + R → `services.msc` → Print Spooler → Restart) |
| **Paper jam** | Turn off, open all access doors, pull paper **gently in the direction it travels**; remove torn bits; don't overfill the tray; fan the paper |
| **Faded or streaky prints** | Check ink/toner level; run **head cleaning** (inkjet) and **nozzle check**; shake toner gently (laser) |
| **Blank pages** | Remove cartridge tape on new cartridges; head cleaning; check cartridge seating |
| **Wrong paper size** | Set A4 in both the document and printer preferences |
| **Prints very slowly** | Use "Draft" or normal quality; print PDFs instead of image-heavy files |

> Head cleaning uses ink. Run it one to three times, print a nozzle check, and stop if it doesn't improve: the problem may be dried ink or a faulty head.

## Scanning

- Use the printer's software, **Windows Scan** app, or the scanner button.
- Documents: **300 DPI**, greyscale or colour, save as **PDF**. Photos: 300–600 DPI, JPG.
- For multi-page documents, use the **ADF** (automatic document feeder) if available.
- Phones work well for quick scans (Google Drive → Scan, Microsoft Lens).

## Projectors and external displays

- Connect with **HDMI** (or VGA on older equipment); use adapters for USB-C laptops.
- **Win + P** chooses: PC screen only, Duplicate, Extend, Second screen only.
- No picture? Check the projector's **input source**, try another cable, and restart with the cable already connected.
- Set the resolution to the projector's native resolution for sharp text.

## Other peripherals

| Device | Common fix |
|---|---|
| USB devices not recognised | Try another port/cable; Device Manager → uninstall device and re-plug; avoid unpowered hubs |
| Keyboard typing wrong symbols | Check the input language (Win + Space) |
| Mouse/keyboard wireless lag | Replace batteries; move the receiver closer (use a USB extension) |
| No sound | Check the output device (speaker icon), volume mixer, mute buttons, driver |
| Webcam not working | Privacy switch/shutter; Settings → Privacy → Camera permissions |

## Device Manager: the key troubleshooting tool

**Win + X → Device Manager**. A yellow warning icon means a driver problem. Right-click → **Update driver**, **Roll back driver** (if a recent update broke it), or **Uninstall device** and restart to reinstall.

## Care and maintenance

- Use good quality paper and store it dry (humidity causes jams).
- Print a page every week on inkjets so the ink doesn't dry.
- Keep equipment on a **UPS or surge protector**: power fluctuations damage electronics.
- Clean with a soft, dry cloth; never spray liquids inside devices.

## Why peripherals keep technicians busy

Printers, scanners, projectors, webcams and external displays cause a large share of everyday IT support calls in offices, schools, churches and cyber cafés. Problems are usually fixable with systematic troubleshooting: connection, drivers, settings, consumables or simple mechanical issues. Technicians who solve them quickly, and teach users how to avoid them, become indispensable.

## Choosing the right printer for a customer

| Need | Recommendation | Why |
|---|---|---|
| High-volume black-and-white documents (offices, schools) | Mono laser printer | Low cost per page, fast |
| Occasional colour printing at home | Ink tank (refillable) inkjet | Much cheaper ink than cartridge inkjets |
| Photos and colour marketing materials | Colour inkjet or colour laser | Better colour quality |
| Cyber café | Multifunction laser (print, scan, copy) with network/Wi-Fi + a colour ink tank | Covers most customer needs |
| Receipts (shops, restaurants) | Thermal receipt printer | No ink; fast; works with POS systems |

Compare **cost per page** (toner/ink price ÷ page yield), not just the printer's purchase price.

## Network printer setup

1. Connect the printer to the network (Ethernet or Wi-Fi via its control panel or WPS).
2. Give it a **fixed IP address** (DHCP reservation on the router), so computers don't lose it when its address changes.
3. On each computer: Settings → Bluetooth & devices → Printers & scanners → Add device (or add by IP address).
4. Install the manufacturer's full driver package if advanced features (duplex, scanning) are needed.
5. Print a test page from each computer.
6. Label the printer with its IP address and name for future support.

## Systematic printer troubleshooting

| Symptom | Checks in order |
|---|---|
| Nothing prints | Power and errors on the printer panel → correct printer selected → print queue stuck (restart Print Spooler) → cable/Wi-Fi → reinstall driver |
| Prints blank pages | Ink/toner empty or not installed correctly → protective tape on new cartridges → run cleaning cycle |
| Faded or streaky prints | Low toner/ink → clogged heads (cleaning cycle, alignment) → dirty drum or rollers |
| Paper jams | Wrong paper type or damp paper → overfilled tray → worn pickup rollers → foreign objects |
| "Offline" status | Printer asleep or IP changed → reconnect Wi-Fi → set fixed IP → remove and re-add |
| Garbled text/symbols | Wrong driver → corrupted job → restart spooler and printer |

```text
Restart the Print Spooler (Windows):
  Win + R → services.msc → Print Spooler → Restart
  If jobs are still stuck: stop the spooler, delete files in C:\Windows\System32\spool\PRINTERS, start the spooler
```

## Scanning efficiently

- Scan documents at 200–300 DPI; use greyscale or black-and-white for text (smaller files).
- Save multi-page documents as a single PDF.
- Use "scan to folder" or "scan to email" on network multifunction printers for offices.
- For phone scanning, Google Drive scan or Microsoft Lens produce clean PDFs.
- Name files clearly: `2026-03-15 Invoice Kamau Hardware.pdf`.

## Projectors and external displays

| Problem | Fix |
|---|---|
| No signal | Correct input source on the projector (HDMI 1/2, VGA); press Windows + P and choose Duplicate or Extend |
| Wrong resolution or cut-off edges | Display settings → set the projector's native resolution; adjust scaling |
| No sound through HDMI | Change the sound output device in Windows sound settings |
| Laptop has USB-C only | Use a USB-C to HDMI adapter that supports video (DisplayPort Alt Mode) |
| Flickering image | Try another cable, check the adapter, lower the refresh rate |

Carry a small kit for presentations: HDMI cable, VGA adapter, USB-C adapter, extension cable and a clicker.

## Other peripherals: quick fixes

| Device | Common issue | Fix |
|---|---|---|
| Webcam | Not detected in meetings | Check privacy settings (Settings → Privacy → Camera), physical shutter, app permissions |
| Microphone | Others can't hear you | Select the right input device; check mute; privacy settings |
| Wireless mouse/keyboard | Lagging or not working | Replace batteries; move receiver closer or to a front USB port; re-pair |
| USB devices | "Device not recognized" | Try another port/cable; Device Manager → uninstall and rescan |
| UPS | Beeping | On battery power or overloaded; test battery; don't plug printers (lasers) into small UPS units |

## Preventive maintenance schedule

| Task | Frequency |
|---|---|
| Clean printer paper path and rollers | Monthly (busy printers) |
| Print a test page on inkjets to prevent drying | Weekly if rarely used |
| Clean projector filters | Every few months (dusty rooms more often) |
| Dust keyboards, mice and vents | Monthly |
| Check UPS battery health | Every 6 months |
| Update printer firmware and drivers | When updates are available |

Keep a log of maintenance and consumable replacements to predict costs.

## Practice

1. Set up a printer by IP address and give it a fixed IP via the router.
2. Simulate a stuck print queue and clear it by restarting the Print Spooler.
3. Calculate cost per page for two printers using toner prices and page yields.
4. Connect a laptop to a projector or TV and practise Duplicate and Extend modes.
5. Create a preventive maintenance checklist for a school's computer lab.

:::think An office printer keeps going "offline" every few days and needs to be re-added on everyone's computer. What's the likely cause and the lasting fix?
The printer probably gets a new IP address from DHCP after restarts, so computers lose track of it. Reserve a fixed IP for the printer in the router (DHCP reservation) or set a static IP outside the DHCP range, then add the printer using that address on each computer.
:::

```quiz
Q: Which Windows service do you restart when print jobs are stuck?
A: Print Spooler | spooler
Q: In which direction should you pull jammed paper?
A: the direction it travels | direction of travel | forward
Q: Which shortcut chooses how a projector displays your screen?
A: Win + P | win+p | windows + p
Q: What DPI is usually right for scanning documents?
A: 300 | 300 dpi
Q: What does a yellow warning icon in Device Manager usually mean? (two words)
A: driver problem | driver issue | driver
Q: Which Windows key combination switches display modes like Duplicate and Extend?
A: Windows + P | Win+P | windows p
Q: What should a network printer have so computers don't lose it? (two words)
A: fixed IP | static IP | IP reservation
Q: Which printer type is best for low-cost, high-volume black-and-white printing?
A: laser | mono laser | laser printer
```
