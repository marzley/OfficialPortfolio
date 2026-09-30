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
```
