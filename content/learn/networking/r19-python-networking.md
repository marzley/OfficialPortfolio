---
slug: python-networking
title: "Networking with Python: subnet calculators, IP plans, VLSM, summaries, port checks and automation basics"
after: KEEP
---
# Networking with Python: subnet calculators, IP plans, VLSM, summaries, port checks and automation basics

Modern network engineers don't configure 200 switches by hand or calculate every subnet on paper. They write small scripts. **Network automation** with Python is now part of the Cisco CCNA, and job adverts for network and cloud engineers increasingly ask for it. This unit starts with Python's built-in **ipaddress** module, which does subnetting perfectly (great for checking your homework and planning real networks), then builds small but useful tools: IP plan generators, address validators, a port checker and an introduction to automating devices.

Run every example and change the numbers. You don't need to be a programmer: basic Python from the Python subject is enough.

:::note What you will learn
- The ipaddress module: networks, interfaces and addresses
- Network, broadcast, mask, host ranges and private checks
- Splitting networks and generating a full IP plan
- VLSM planning in code
- Summarising and checking overlaps
- IPv6 with the same tools
- Validating addresses from a spreadsheet/CSV
- Sockets: checking whether a port is open
- Where automation goes next: Netmiko, NAPALM, Ansible, APIs
:::

## Look at a network

```try-python
import ipaddress

net = ipaddress.ip_network("192.168.10.0/26")
print("Network:  ", net.network_address)
print("Broadcast:", net.broadcast_address)
print("Mask:     ", net.netmask)
print("Wildcard: ", net.hostmask)
print("Prefix:   ", net.prefixlen)
print("Hosts:    ", net.num_addresses - 2)
hosts = list(net.hosts())
print("First host:", hosts[0], " Last host:", hosts[-1])
```

`ip_network` needs the real network address; for a host address use `ip_interface` (or `strict=False`).

## Which subnet is a host in?

```try-python
import ipaddress

for text in ["10.14.200.9/19", "192.168.37.150/28", "172.16.5.200/26"]:
    iface = ipaddress.ip_interface(text)
    print(f"{text:18} network {iface.network}  private={iface.ip.is_private}")

# Are two hosts in the same subnet?
a = ipaddress.ip_interface("192.168.1.20/26")
b = ipaddress.ip_address("192.168.1.70")
print("Same subnet?", b in a.network)
```

## Split a network into subnets

```try-python
import ipaddress

net = ipaddress.ip_network("192.168.50.0/24")
for i, sub in enumerate(net.subnets(new_prefix=27), start=1):
    hosts = list(sub.hosts())
    print(f"{i}. {sub}  hosts {hosts[0]} - {hosts[-1]}  broadcast {sub.broadcast_address}")
```

## Generate a full IP plan

This builds an addressing plan for a school, with gateway and DHCP ranges, the kind of table you'd hand to a client:

```try-python
import ipaddress

site = ipaddress.ip_network("10.20.0.0/16")
vlans = [(10, "LAB1"), (11, "LAB2"), (20, "STAFF"), (40, "CCTV"), (60, "GUEST")]

print(f"{'VLAN':5} {'Name':6} {'Network':16} {'Gateway':12} {'DHCP range'}")
for vid, name in vlans:
    net = ipaddress.ip_network(f"10.20.{vid}.0/24")
    assert net.subnet_of(site)
    gw = net[1]
    dhcp = f"{net[50]} - {net[250]}" if name != "CCTV" else "static only"
    print(f"{vid:<5} {name:6} {str(net):16} {str(gw):12} {dhcp}")
```

## Plan with VLSM

```try-python
import ipaddress, math

needs = {"Sales": 100, "Admin": 50, "IT": 20, "Guests": 10, "Link 1": 2, "Link 2": 2}
start = ipaddress.ip_address("192.168.10.0")
for name, hosts in sorted(needs.items(), key=lambda x: -x[1]):
    prefix = 32 - math.ceil(math.log2(hosts + 2))
    sub = ipaddress.ip_network(f"{start}/{prefix}")
    print(f"{name:7} needs {hosts:3} -> {sub}  usable {sub.num_addresses - 2}")
    start = sub.broadcast_address + 1
```

## Summarise networks and check overlaps

```try-python
import ipaddress

nets = [ipaddress.ip_network(f"192.168.{i}.0/24") for i in range(8, 12)]
print("Summary:", list(ipaddress.collapse_addresses(nets)))

plan = ["10.20.10.0/24", "10.20.32.0/22", "10.20.34.0/24", "10.20.60.0/24"]
nets = [ipaddress.ip_network(p) for p in plan]
for i, a in enumerate(nets):
    for b in nets[i + 1:]:
        if a.overlaps(b):
            print("OVERLAP:", a, "and", b)
```

The overlap check catches a classic planning error: 10.20.34.0/24 sits inside 10.20.32.0/22.

## IPv6 too

```try-python
import ipaddress

a = ipaddress.ip_address("2001:0db8:0000:0000:0000:0000:0000:0001")
print("Short form:", a.compressed)
print("Long form: ", a.exploded)

site = ipaddress.ip_network("2001:db8:5a00::/48")
for sub in list(site.subnets(new_prefix=64))[:4]:
    print(sub)
```

## Validate addresses from a spreadsheet

Real data is messy. This checks a device list (as it might come from a CSV export) for invalid addresses, wrong subnets and duplicates:

```try-python
import csv, io, ipaddress

data = """name,ip
Reception PC,10.20.20.15
Printer,10.20.20.300
Camera 1,10.20.40.11
Camera 2,10.20.40.11
Bursar PC,10.20.21.9
"""
staff = ipaddress.ip_network("10.20.20.0/24")
cctv = ipaddress.ip_network("10.20.40.0/24")
seen = {}
for row in csv.DictReader(io.StringIO(data)):
    try:
        ip = ipaddress.ip_address(row["ip"])
    except ValueError:
        print("INVALID:", row["name"], row["ip"])
        continue
    if ip in seen:
        print("DUPLICATE:", row["name"], "and", seen[ip], "use", ip)
    seen[ip] = row["name"]
    if ip not in staff and ip not in cctv:
        print("OUTSIDE PLAN:", row["name"], ip)
```

## Checking whether a port is open (sockets)

Python's `socket` module can test TCP connections, like a tiny `Test-NetConnection`. (This runs on your own computer; the browser runner here can't make network connections, so try it locally.)

```python
import socket

def port_open(host, port, timeout=2):
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except OSError:
        return False

for port in [22, 80, 443, 3306]:
    print(port, "open" if port_open("example.com", port) else "closed/filtered")
```

Only scan systems you own or have permission to test: unauthorised scanning can break laws and policies.

## Where automation goes next

| Tool | What it does |
|---|---|
| **Netmiko** | Python library that logs in to routers/switches over SSH and runs commands (Cisco, MikroTik, Huawei, Juniper...) |
| **NAPALM** | A common Python interface to get facts and push configs to many vendors |
| **Ansible** | Automation tool using YAML "playbooks" to configure hundreds of devices at once |
| **REST APIs** | Modern devices, controllers and cloud platforms (Meraki, cloud VPCs) are configured over HTTPS APIs with JSON |
| **Jinja2 templates** | Generate device configs from a template and a spreadsheet of values |

A taste of Netmiko (run locally against a lab device):

```python
from netmiko import ConnectHandler

device = {"device_type": "cisco_ios", "host": "10.20.99.2",
          "username": "admin", "password": "use-a-secret-store"}
with ConnectHandler(**device) as conn:
    print(conn.send_command("show ip interface brief"))
```

Practise automation safely with Cisco's free DevNet sandboxes or lab routers in GNS3/EVE-NG, never first on production networks.

:::think Your manager gives you a spreadsheet of 300 devices and asks you to find any with IPs outside the official plan or duplicates. How would Python help, and which module/functions would you use?
Read the CSV with the csv module, parse each address with `ipaddress.ip_address` (catching ValueError for invalid entries), check membership with `ip in network` for each planned subnet, and track seen addresses in a dictionary to find duplicates. It takes seconds instead of hours and is repeatable.
:::

## Summary

- `ipaddress` handles networks (`ip_network`), host+prefix (`ip_interface`) and addresses (`ip_address`) for IPv4 and IPv6.
- It gives network, broadcast, mask, wildcard, hosts, private checks, subnets, summaries and overlap checks.
- Scripts generate IP plans and VLSM allocations, and validate device lists.
- `socket` can test ports locally (only with permission).
- Next steps: Netmiko, NAPALM, Ansible, REST APIs and templates in safe labs.

```quiz
Q: Which built-in Python module does subnetting?
A: ipaddress
Q: Which function returns the subnets of a network? (method name)
A: subnets | .subnets()
Q: Which function combines networks into summaries?
A: collapse_addresses | ipaddress.collapse_addresses
Q: Which method checks whether two networks overlap?
A: overlaps | .overlaps()
Q: Which Python library logs in to network devices over SSH to run commands?
A: Netmiko
```

**Learn more:** [Python ipaddress documentation](https://docs.python.org/3/library/ipaddress.html) · [Cisco DevNet (free labs and sandboxes)](https://developer.cisco.com/)
