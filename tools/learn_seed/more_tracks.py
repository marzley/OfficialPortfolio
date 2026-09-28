from common import track, lesson

# ---------------- PHP ----------------
p = track("php", "PHP & MySQL", "none", "Build dynamic websites: forms, databases, logins and M-Pesa-ready back ends with PHP and MySQL.")

lesson(p, "introduction", "PHP introduction", """
# PHP introduction

**PHP** runs on the **server** and builds the HTML that the browser receives. It powers WordPress (over 40% of websites), most cPanel hosting, and countless Kenyan school, SACCO and shop systems.

How it works:

1. The browser asks for `contact.php`.
2. The server runs the PHP code (reads a database, checks a login, sends an email).
3. The server sends back plain HTML. Visitors never see your PHP code.

## Your first PHP page

```
<!DOCTYPE html>
<html>
<body>
  <h1><?php echo "Habari, Kenya!"; ?></h1>
  <p>Today is <?= date("l, j F Y") ?></p>
</body>
</html>
```

- PHP code goes between `<?php` and `?>`. `<?= ... ?>` is a shortcut for `echo`.
- Statements end with `;`.

## Running PHP on your computer

- Install **XAMPP** (Windows/macOS/Linux) and put files in `htdocs`, then open `http://localhost/yourfile.php`.
- Or, with PHP installed, run `php -S localhost:8000` in your project folder.
- Or upload to any cPanel hosting.

> The code boxes in this track are for reading and copying: run them with XAMPP or on your hosting.

```quiz
Q: Does PHP run in the browser or on the server?
A: server | on the server | the server
Q: What tag opens a block of PHP code?
A: <?php
Q: Which popular website system is written in PHP?
A: WordPress
Q: Which free package gives you Apache, PHP and MySQL on Windows? (starts with X)
A: XAMPP
```
""")

lesson(p, "variables-strings", "Variables, strings and numbers", """
# Variables, strings and numbers

Variables start with `$`:

```
<?php
$name = "Achieng";           // string
$age = 21;                   // integer
$price = 1499.50;            // float
$isMember = true;            // boolean

echo "Hello $name";          // double quotes insert variables
echo 'Hello $name';          // single quotes don't: prints $name literally
echo "Total: KSh " . number_format($price * 3, 2);   // . joins strings
```

## Useful string functions

```
strlen("Marzley")                 // 7
strtoupper("nairobi")             // NAIROBI
ucwords("mama mboga shop")        // Mama Mboga Shop
str_replace("mama", "baba", $s)   // replace text
trim("  hello  ")                 // remove spaces at the ends
substr("0712345678", 1)           // 712345678
explode(",", "a,b,c")             // ["a","b","c"]
implode(", ", $list)              // join an array into a string
```

## Numbers and maths

```
$vat = 1000 * 0.16;              // 160
$rounded = round(10 / 3, 2);     // 3.33
$whole = intdiv(10, 3);          // 3
$left = 10 % 3;                  // 1
```

## Phone numbers: a real example

```
<?php
// Turn 0712 345 678 or +254712345678 into 254712345678 for M-Pesa
function mpesaNumber(string $raw): ?string {
    $digits = preg_replace('/\\D/', '', $raw);
    if (preg_match('/^0?(7|1)\\d{8}$/', $digits)) return '254' . substr($digits, -9);
    if (preg_match('/^254(7|1)\\d{8}$/', $digits)) return $digits;
    return null;
}
echo mpesaNumber("0712 345 678");   // 254712345678
```

```quiz
Q: What symbol do PHP variables start with?
A: $
Q: What does strlen("Nairobi") return?
A: 7
Q: Which operator joins two strings in PHP?
A: . | dot | a dot
Q: Do single quotes insert variable values into a string? (yes/no)
A: no
```
""")

lesson(p, "arrays-loops", "Arrays, conditions and loops", """
# Arrays, conditions and loops

## Arrays

```
<?php
$towns = ["Nairobi", "Mombasa", "Kisumu"];       // indexed
echo $towns[0];                                   // Nairobi
$towns[] = "Nakuru";                              // add
echo count($towns);                               // 4

$product = ["name" => "Mouse", "price" => 1200]; // associative
echo $product["name"];
```

## Conditions

```
$total = 1800;
if ($total >= 2000) {
    $delivery = 0;
} elseif ($total >= 1000) {
    $delivery = 100;
} else {
    $delivery = 200;
}
echo $total >= 2000 ? "Free delivery" : "Delivery KSh $delivery";
```

Use `===` for comparisons (value and type).

## Loops

```
foreach ($towns as $town) {
    echo "<li>$town</li>";
}

$cart = [
    ["name" => "Mouse", "price" => 1200, "qty" => 2],
    ["name" => "Charger", "price" => 800, "qty" => 1],
];
$sum = 0;
foreach ($cart as $item) {
    $sum += $item["price"] * $item["qty"];
}
echo "Total: KSh $sum";      // 3200

for ($i = 1; $i <= 5; $i++) echo $i;
```

## Useful array functions

`in_array`, `array_sum`, `array_map`, `array_filter`, `sort`, `usort`, `array_keys`, `json_encode` (array → JSON) and `json_decode` (JSON → array).

```quiz
Q: Which loop is best for going through every item in an array?
A: foreach
Q: Which function counts items in an array?
A: count
Q: Which function turns an array into JSON?
A: json_encode
Q: Which comparison operator checks value and type?
A: ===
```
""")

lesson(p, "forms-security", "Forms and security", """
# Handling forms safely

```
<form method="post" action="contact.php">
  <input name="name" required>
  <input name="phone" type="tel">
  <textarea name="message"></textarea>
  <button>Send</button>
</form>
```

```
<?php
// contact.php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { exit('Use the form.'); }

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $message === '') {
    exit('Please fill in your name and message.');
}
// ... save to the database or email it ...
echo 'Thank you, ' . htmlspecialchars($name) . '!';
```

## The security rules every PHP developer must follow

1. **Never trust input.** Everything in `$_GET`, `$_POST`, `$_COOKIE` and uploaded files can be anything.
2. **Escape output** with `htmlspecialchars()` whenever you show user input in HTML. This stops **XSS** (attackers injecting JavaScript).
3. **Use prepared statements** for databases (next lesson). Never put `$_POST` directly into SQL; that's **SQL injection**.
4. **Hash passwords** with `password_hash()` and check them with `password_verify()`. Never store plain passwords.
5. **CSRF tokens** on forms that change data, so other sites can't submit them for your logged-in users.
6. **File uploads**: check size and type, rename files, store them outside the public folder or block PHP execution in the upload folder.
7. **Keep secrets out of code**: database passwords and API keys in a config file outside `public_html`, never on GitHub.
8. **HTTPS everywhere** and keep PHP updated (8.2+).

```quiz
Q: Which function should you use when printing user input into HTML?
A: htmlspecialchars
Q: What attack happens when user input goes straight into SQL?
A: SQL injection | sql injection attack
Q: Which function hashes a password in PHP?
A: password_hash
Q: Which array holds data from a form sent with method="post"?
A: $_POST | _POST
```
""")

lesson(p, "mysql-pdo", "MySQL with PDO", """
# Databases with PDO

**PDO** is PHP's safe way to talk to MySQL/MariaDB.

## Connect

```
<?php
$pdo = new PDO(
    'mysql:host=localhost;dbname=shop;charset=utf8mb4',
    'shop_user',
    'secret-password',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
);
```

## Read with a prepared statement

```
$stmt = $pdo->prepare('SELECT id, name, price FROM products WHERE category = ? AND price <= ?');
$stmt->execute([$_GET['cat'] ?? 'Electronics', 5000]);
foreach ($stmt->fetchAll() as $row) {
    echo htmlspecialchars($row['name']) . ' – KSh ' . $row['price'] . '<br>';
}
```

The `?` placeholders are filled **safely**: even if someone types `'; DROP TABLE products; --` it's treated as plain text.

## Insert, update, delete

```
$pdo->prepare('INSERT INTO orders (customer, phone, total, created_at) VALUES (?, ?, ?, NOW())')
    ->execute([$name, $phone, $total]);
$newId = $pdo->lastInsertId();

$pdo->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute(['paid', $newId]);
```

## Transactions (all or nothing)

```
$pdo->beginTransaction();
try {
    $pdo->prepare('UPDATE stock SET qty = qty - ? WHERE product_id = ?')->execute([2, 5]);
    $pdo->prepare('INSERT INTO sales (product_id, qty) VALUES (?, ?)')->execute([5, 2]);
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
}
```

Practise your SQL in the **SQL track** of this hub; the queries are the same.

```quiz
Q: What placeholder symbol do simple PDO prepared statements use?
A: ? | question mark
Q: Which PDO method gets the ID of the row you just inserted?
A: lastInsertId
Q: What do you call "all or nothing" database changes?
A: transaction | transactions
```
""")

lesson(p, "sessions-login", "Sessions and a login system", """
# Sessions and logins

HTTP forgets you between pages. **Sessions** remember a visitor using a cookie with a random ID.

## Register

```
<?php
$hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
$pdo->prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
    ->execute([strtolower(trim($_POST['email'])), $hash]);
```

## Log in

```
<?php
session_start();
$stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE email = ?');
$stmt->execute([strtolower(trim($_POST['email']))]);
$user = $stmt->fetch();

if ($user && password_verify($_POST['password'], $user['password_hash'])) {
    session_regenerate_id(true);          // prevents session fixation
    $_SESSION['user_id'] = $user['id'];
    header('Location: dashboard.php');
    exit;
}
echo 'Wrong email or password.';          // same message for both: don't reveal which
```

## Protect pages

```
<?php
session_start();
if (empty($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
```

## Log out

```
session_start();
$_SESSION = [];
session_destroy();
```

## Make it stronger

- Limit login attempts (lock for a few minutes after 5 failures).
- Offer sign-in with Google or one-time codes by email/SMS.
- Set cookie options: `httponly`, `secure`, `samesite=Lax`.

```quiz
Q: Which function checks a password against a stored hash?
A: password_verify
Q: Which function must be called before using $_SESSION?
A: session_start
Q: Which function should you call right after a successful login to prevent session fixation?
A: session_regenerate_id
```
""")

lesson(p, "mpesa-integration", "M-Pesa STK push with PHP (overview)", """
# M-Pesa integration overview

Safaricom's **Daraja API** lets your website send an **STK push** (the PIN prompt) to a customer's phone.

## The flow

1. Create an app on the [Daraja portal](https://developer.safaricom.co.ke/) → get a **consumer key and secret**; test in the **sandbox** first.
2. Your server gets an **OAuth access token**.
3. Your server calls **STK Push** with: business short code, password (base64 of shortcode + passkey + timestamp), amount, phone (2547…), a **callback URL** and an account reference.
4. The customer enters their PIN.
5. Safaricom calls your **callback URL** with the result (paid or failed, receipt number, amount).
6. You **verify** the result (amount matches, receipt not used before; optionally query the transaction status) and mark the order paid.

## Getting the token (sketch)

```
<?php
$ch = curl_init('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials');
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_USERPWD => $key . ':' . $secret]);
$token = json_decode(curl_exec($ch), true)['access_token'] ?? null;
```

## Rules for a safe integration

- Keep keys and the passkey **outside public_html** and out of Git.
- The callback URL must be **HTTPS** and publicly reachable; add a secret in the URL to reject fakes.
- **Never trust the browser** to say "paid"; trust only the verified callback or status query.
- Record every checkout request ID; ignore duplicates.
- Show the customer a clear "waiting for payment" screen and a fallback (pay to Till + send the code).

This website's own deposit and invoice payments work exactly this way. It's a very sellable skill for freelancers.

```quiz
Q: What is Safaricom's developer API platform called?
A: Daraja | daraja api
Q: Should you trust the browser to tell you a payment succeeded? (yes/no)
A: no
Q: In which environment should you test first?
A: sandbox | the sandbox
```

**Learn more:** [PHP: The Right Way](https://phptherightway.com/) · [Laracasts PHP for beginners (free)](https://laracasts.com/series/php-for-beginners-2023-edition) · [W3Schools PHP](https://www.w3schools.com/php/)
""")

# ---------------- Cybersecurity ----------------
c = track("cybersecurity", "Cybersecurity", "none", "Protect yourself, your business and your websites: passwords, phishing, M-Pesa fraud, malware, web security and careers.")

lesson(c, "basics", "Cybersecurity basics: the CIA triad", """
# Cybersecurity basics

**Cybersecurity** protects systems and data from attack, damage and theft.

## The CIA triad

- **Confidentiality**: only the right people can see data (passwords, encryption, permissions).
- **Integrity**: data isn't changed without permission (hashes, backups, audit logs).
- **Availability**: systems work when needed (backups, redundancy, DDoS protection).

Every security decision protects one or more of these.

## Words to know

| Term | Meaning |
|---|---|
| **Threat** | Something that could cause harm (a hacker, a flood, a careless employee) |
| **Vulnerability** | A weakness (unpatched software, weak password) |
| **Risk** | Likelihood × impact of a threat using a vulnerability |
| **Exploit** | Code or a technique that uses a vulnerability |
| **Malware** | Malicious software: viruses, ransomware, spyware, trojans |
| **Phishing** | Tricking people into giving information or clicking something |
| **2FA/MFA** | A second proof besides the password (code, app, key) |
| **Encryption** | Scrambling data so only key holders can read it |
| **Patch** | A software update that fixes vulnerabilities |

## The truth about attacks

Most successful attacks use **people and weak basics**, not movie-style hacking: stolen passwords, phishing, unpatched software, no backups. Get the basics right and you stop the majority of attacks.

```quiz
Q: What do the letters CIA stand for in security? (three words)
A: confidentiality integrity availability | confidentiality, integrity, availability
Q: A weakness such as unpatched software is called a …?
A: vulnerability
Q: Tricking someone into revealing information is called …?
A: phishing | social engineering
```
""")

lesson(c, "passwords-2fa", "Passwords and two-factor authentication", """
# Passwords and 2FA

## Strong passwords

- **Length beats complexity**: a passphrase like `mango-matatu-river-42-sunset` is stronger and easier to remember than `P@ss1`.
- **Unique for every account**. When one site is breached, attackers try the same email and password everywhere ("credential stuffing").
- Use a **password manager** (Bitwarden is free, 1Password, or the one built into Google/Apple) to generate and remember them.
- Check if your email appeared in breaches at [haveibeenpwned.com](https://haveibeenpwned.com/).

## Turn on 2FA everywhere important

Email (the key to everything), WhatsApp (two-step PIN), banking, PayPal, social media, hosting/cPanel, domain registrar, GitHub.

Best to worst:

1. **Security keys / passkeys**
2. **Authenticator apps** (Google Authenticator, Microsoft Authenticator, Authy)
3. **SMS codes**: better than nothing, but vulnerable to SIM-swap fraud.

## M-Pesa and SIM safety

- Never share your **M-Pesa PIN** or any **OTP**. Safaricom will never ask.
- Set a **SIM PIN** so a stolen phone's SIM can't be used elsewhere.
- If your phone suddenly loses network for a long time, call Safaricom from another phone. It could be a **SIM swap**.

```quiz
Q: Which is stronger: a long passphrase or a short complex password?
A: passphrase | long passphrase | a long passphrase
Q: Name a free password manager.
A: Bitwarden | google password manager | keepass
Q: Which 2FA method is weakest because of SIM-swap fraud?
A: SMS | sms codes
Q: Which account is "the key to everything" and must have 2FA first?
A: email | your email
```
""")

lesson(c, "phishing-scams", "Phishing, social engineering and fraud", """
# Phishing and social engineering

**Phishing** messages pretend to be from someone you trust to make you click, pay, or share codes.

## Warning signs

- **Urgency or fear**: "Your account will be closed in 2 hours".
- **Rewards too good**: "You've won KSh 50,000; pay 1,500 to claim".
- **Requests for PINs, OTPs, passwords** or to install an app.
- **Odd links**: `safaricorn-promo.xyz`, shortened links, misspellings.
- **Unexpected attachments** (.zip, .exe, .apk, "invoice.pdf.exe").
- Sender's real address or number doesn't match the organisation.

## Common Kenyan examples

- Fake M-Pesa "sent by mistake" SMS followed by a call to "reverse".
- "Your KRA refund is ready, click here".
- Fake job offers asking for registration fees.
- WhatsApp hijack: "I sent you a code by mistake, please forward it".
- Fake online shops on Facebook/Instagram with prices far too low.
- CEO fraud: "This is the director, urgently pay this supplier" (email or WhatsApp from a new number).

## What to do

- **Stop and verify** using a number or website you already know, not the one in the message.
- Report SMS scams by forwarding to **333** (Safaricom).
- For businesses: always confirm payment instructions by phone with a known contact before paying.
- Train your staff; one click can lock your whole office (ransomware).

```quiz
Q: What number do you forward scam SMS to on Safaricom?
A: 333
Q: A message says "urgent, pay today or lose your account". Which warning sign is this?
A: urgency | urgency or fear | fear
Q: Someone asks you to forward a WhatsApp code sent "by mistake". Should you? (yes/no)
A: no
```
""")

lesson(c, "malware-devices", "Malware and protecting your devices", """
# Malware and device security

## Types of malware

- **Virus / worm**: spreads to other files or computers.
- **Trojan**: pretends to be useful (a "free" cracked program) but hides malware.
- **Ransomware**: encrypts your files and demands payment. Devastating for businesses without backups.
- **Spyware / stalkerware**: secretly records activity.
- **Adware**: floods you with ads.
- **Banking trojans** (on Android): steal logins and OTPs from fake apps.

## Protect your computer and phone

1. **Update** the operating system, browser and apps (turn on automatic updates).
2. Install apps only from **official stores**; avoid cracked software and "modded" APKs.
3. Keep **Microsoft Defender** on (it's good) or another reputable antivirus.
4. **Back up** using the **3-2-1 rule**: 3 copies, on 2 different types of storage, 1 off-site/cloud.
5. Use a standard (non-admin) account for daily work.
6. Lock screens with a PIN/biometrics; turn on **Find My Device**.
7. Encrypt laptops (BitLocker on Windows, FileVault on Mac).
8. Be careful with USB flash disks from cyber cafés; scan them.

```quiz
Q: Which malware encrypts your files and demands payment?
A: ransomware
Q: What is the backup rule with the numbers 3, 2 and 1 called?
A: 3-2-1 | 3-2-1 rule | 321
Q: Is it safe to install "modded" APKs from random websites? (yes/no)
A: no
```
""")

lesson(c, "web-security", "Web application security (OWASP)", """
# Web application security

If you build websites, you're responsible for your users' data. The **OWASP Top 10** lists the most critical web risks.

## Key risks and how to prevent them

| Risk | Example | Prevention |
|---|---|---|
| **Injection** (SQL, command) | `' OR 1=1 --` in a login form | Prepared statements, never build SQL with user input |
| **Broken access control** | Changing `?invoice=12` to `13` shows someone else's invoice | Check permissions on **every** request on the server |
| **XSS** | A comment containing `<script>` runs in other users' browsers | Escape output, Content-Security-Policy |
| **Authentication failures** | Weak passwords, no rate limiting | Hash passwords, 2FA, lock after failed tries |
| **Security misconfiguration** | Debug errors shown, default passwords, open folders | Turn off errors in production, update, least privilege |
| **Vulnerable components** | Old WordPress plugins | Update regularly, remove unused plugins |
| **Cryptographic failures** | Site without HTTPS, plain-text passwords | HTTPS everywhere, strong hashing |
| **SSRF / CSRF** | A malicious site submits a form as your logged-in user | CSRF tokens, SameSite cookies |

## A quick checklist for every website you deliver

- HTTPS with automatic redirect.
- Admin login with a strong, unique password and 2FA if possible.
- Prepared statements, escaped output, CSRF tokens.
- File uploads restricted and stored safely.
- Security headers (CSP, X-Frame-Options/frame-ancestors, X-Content-Type-Options).
- Daily backups kept off the server.
- Updates for CMS, plugins and PHP.

```quiz
Q: What list of the ten most critical web risks is published by OWASP?
A: OWASP Top 10 | top 10 | owasp top ten
Q: Changing an ID in the URL shows another user's data. Which risk is this?
A: broken access control | access control
Q: What stops SQL injection?
A: prepared statements | parameterized queries | prepared statement
```

**Learn more:** [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [PortSwigger Web Security Academy (free labs)](https://portswigger.net/web-security)
""")

lesson(c, "careers", "Cybersecurity careers and practice", """
# Cybersecurity careers

## Roles

- **SOC analyst** (Security Operations Centre): watches alerts, investigates incidents. Common entry role.
- **Penetration tester / ethical hacker**: tests systems with permission.
- **Security engineer**: builds secure networks and systems.
- **GRC** (governance, risk, compliance): policies, audits, data protection (Kenya's **Data Protection Act 2019** creates demand).
- **Digital forensics**: investigates what happened after an attack.

Employers in Kenya: banks, telcos, fintechs, audit firms, government agencies (e.g. the National KE-CIRT/CC under the Communications Authority), security consultancies.

## Learning path

1. Foundations: networking (the **Networking** track here), Linux (**Linux** track), and one programming language (Python).
2. Security basics: **CompTIA Security+** or Google Cybersecurity Certificate.
3. Hands-on: **TryHackMe**, **Hack The Box**, **PortSwigger Academy**, **OverTheWire**.
4. Specialise: SOC (Blue team) or pentesting (Red team) certs later.

## Ethics and the law

Only test systems you **own or have written permission** to test. Unauthorised access is a crime under Kenya's **Computer Misuse and Cybercrimes Act, 2018**.

```quiz
Q: Which Kenyan act makes unauthorised computer access a crime? (year)
A: 2018 | computer misuse and cybercrimes act 2018
Q: What must you have before testing someone's system?
A: permission | written permission
Q: Name a hands-on practice platform starting with "Try".
A: TryHackMe
```

**Learn more:** [TryHackMe](https://tryhackme.com/) · [Google Cybersecurity Certificate](https://www.coursera.org/professional-certificates/google-cybersecurity) · [Professor Messer Security+ (free)](https://www.professormesser.com/)
""")

# ---------------- Web hosting ----------------
w = track("hosting", "Web hosting & deployment", "none", "Put websites online: domains (.co.ke), hosting, DNS, cPanel, SSL, email, uploads and backups.")

lesson(w, "domains", "Domain names", """
# Domain names

A **domain** is your address on the internet: `marzleytechsolutions.co.ke`.

## Parts of a domain

`shop.example.co.ke`

- `.ke`: country code top-level domain (Kenya), managed by **KeNIC**.
- `.co.ke`: second level for companies (also `.or.ke` for organisations, `.ac.ke` for colleges, `.go.ke` for government, `.sc.ke` for schools, `.me.ke` personal, `.info.ke`, `.mobi.ke`).
- `example`: your name.
- `shop`: a **subdomain** you create yourself (free).

## Buying a domain

- Buy from an accredited **registrar** (many Kenyan hosting companies sell .co.ke domains; international ones sell .com).
- Renew **every year**; set auto-renew and keep your registrar login safe. Expired domains can be taken by others.
- Choose short, easy to spell, no hyphens if possible. Check it's not a trademark.
- Register it in **the client's name** when you build for clients, and give them the login.

## Domain vs hosting

- **Domain** = the name (like a business name/signboard).
- **Hosting** = the computer where the website's files live (like the shop premises).
- **DNS** connects them.

```quiz
Q: Which organisation manages the .ke domain?
A: KeNIC | kenic
Q: Which second-level domain is for Kenyan companies?
A: .co.ke | co.ke
Q: How often must you renew a domain? (usually)
A: every year | yearly | annually | 1 year
Q: In shop.example.co.ke, what is "shop"?
A: subdomain | a subdomain
```
""")

lesson(w, "hosting-types", "Types of hosting", """
# Types of hosting

| Type | What it is | Good for | Rough cost |
|---|---|---|---|
| **Shared (cPanel)** | Many sites share one server; easy control panel | Business sites, small shops, WordPress | KSh 2,000–10,000/year |
| **Static hosting** | Serves HTML/CSS/JS only | Portfolios, landing pages | Free (GitHub Pages, Netlify, Cloudflare Pages) |
| **VPS** | Your own virtual server with root access | Custom apps, many sites, control | $5–40/month |
| **Managed WordPress** | Hosting optimised and maintained for WordPress | Busy WordPress sites | Higher |
| **Cloud / PaaS** | AWS, Google Cloud, Azure, Render, Railway | Apps that must scale | Pay for use |

## Choosing for a client

- Needs **PHP + MySQL + email** and low cost? → Shared cPanel hosting (local or international provider).
- Just a portfolio? → Free static hosting.
- A system with background jobs, Node.js, or heavy traffic? → VPS or cloud.

## What to check in a hosting plan

- PHP version (8.2+), MySQL databases, SSL (free Let's Encrypt/AutoSSL), email accounts.
- **Backups** (how often, can you restore yourself?).
- Storage type (SSD/NVMe), bandwidth, number of sites.
- Support quality and uptime.
- Server location (Kenya/Europe/South Africa for speed to Kenyan visitors) and a CDN such as Cloudflare.

```quiz
Q: Which hosting type is cheapest and easiest for a small business PHP website?
A: shared | shared hosting | cpanel
Q: Which hosting type gives you your own virtual server with root access?
A: VPS
Q: Name a free host for static HTML/CSS/JS sites.
A: GitHub Pages | netlify | cloudflare pages
```
""")

lesson(w, "dns-records", "Pointing a domain: DNS records", """
# Connecting a domain to hosting

Two ways:

1. **Change the name servers** (NS) at the registrar to the host's (e.g. `ns1.yourhost.com`, `ns2.yourhost.com`). The host then manages all DNS records. Easiest.
2. **Keep DNS at the registrar or Cloudflare** and add records pointing to the host.

## Records you'll set

| Record | Name | Value | Purpose |
|---|---|---|---|
| A | `@` | `102.x.x.x` | The main domain → server IP |
| A or CNAME | `www` | same IP, or `@`/domain | www version |
| MX | `@` | `mail.example.co.ke` (priority 10) | Where email goes |
| TXT | `@` | `v=spf1 +a +mx include:… ~all` | SPF: which servers may send your email |
| TXT | `default._domainkey` | `v=DKIM1; …` | DKIM: signs your emails |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:…` | DMARC: what to do with fakes |
| CNAME | `shop` | `shops.myshopify.com` | Point a subdomain to a service |

## Propagation

DNS changes can take from minutes to 24–48 hours (depending on **TTL**). Check with `nslookup example.co.ke` or online DNS checkers.

## Good email delivery

Without **SPF, DKIM and DMARC**, your invoices and contact-form emails land in spam. cPanel's "Email Deliverability" page shows the exact records to add.

```quiz
Q: Which record points the main domain to the server's IPv4 address?
A: A | A record
Q: Which three TXT-based records improve email delivery? (initials)
A: SPF DKIM DMARC | spf, dkim, dmarc | spf dkim dmarc
Q: What do you change at the registrar so the host manages all DNS?
A: name servers | nameservers | ns | ns records
Q: What setting controls how long DNS answers are cached? (initials)
A: TTL
```
""")

lesson(w, "cpanel-deploy", "Uploading a website with cPanel", """
# Deploying with cPanel

## Upload the files

1. Log in to cPanel (`yourdomain.co.ke/cpanel` or via the host's client area).
2. Open **File Manager** → `public_html` (the folder your domain shows).
3. **Upload** a `.zip` of your site, then right-click → **Extract**. (Much faster than uploading hundreds of files.)
4. Your home page must be `index.html` or `index.php` at the top of `public_html`.
5. Turn on **Show Hidden Files** to see `.htaccess`.

Alternatives: **FTP/SFTP** with FileZilla, or **Git Version Control** in cPanel.

## Create a database (for PHP apps)

1. **MySQL Databases** (or the Database Wizard): create a database and a user with a strong password.
2. **Add the user to the database** with **All privileges**.
3. Import tables with **phpMyAdmin → Import** (`.sql` file).
4. Put the database name, user and password in your app's config file (keep it **outside** `public_html` when possible).

Names get a prefix: `cpaneluser_shop`, `cpaneluser_shopuser`.

## Other cPanel tools you'll use

- **SSL/TLS Status / AutoSSL**: free HTTPS certificates.
- **Email Accounts**: create `info@yourdomain.co.ke`.
- **Cron Jobs**: scheduled tasks (backups, reminders).
- **Select PHP Version**: choose PHP 8.2+ and extensions.
- **Backup / JetBackup**: download or restore backups.
- **Metrics → Errors**: see PHP errors.

## Launch checklist

- [ ] HTTPS works and http redirects to https
- [ ] Forms send email / save data
- [ ] Mobile test, speed test (PageSpeed Insights)
- [ ] 404 page, favicon, Open Graph image
- [ ] Google Search Console + sitemap submitted
- [ ] Backups scheduled

```quiz
Q: Which folder does your main domain show in cPanel?
A: public_html
Q: What must the main page file be called? (one of them)
A: index.html | index.php
Q: Which cPanel tool imports .sql files into a database?
A: phpMyAdmin
Q: What must you do after creating a MySQL user in cPanel so it can use the database?
A: add the user to the database | add user to database | grant privileges | all privileges
```
""")

lesson(w, "ssl-email-backups", "SSL, business email and backups", """
# SSL, email and backups

## SSL (HTTPS)

- Shows the padlock, encrypts data, required for payments and good Google rankings.
- Most hosts give **free certificates** (Let's Encrypt / AutoSSL) that renew automatically.
- Force HTTPS with `.htaccess`:

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Business email

- Hosting email (cPanel) is included and fine for small businesses; use **SPF, DKIM, DMARC**.
- **Google Workspace** or **Microsoft 365** cost more but are more reliable, with better spam filtering and apps.
- Use SMTP (not PHP `mail()`) for website emails so they don't go to spam.

## Backups

- Keep **automatic daily backups** of files and the database.
- Store copies **off the server** (cloud storage or your computer). If the server is hacked or the host fails, on-server backups can be lost too.
- **Test a restore** now and then; an untested backup isn't a backup.

```quiz
Q: What gives a website the padlock and encryption?
A: SSL | ssl certificate | tls | https
Q: Name a free SSL certificate provider.
A: Let's Encrypt | lets encrypt | letsencrypt | autossl
Q: Where should copies of your backups be kept: on the same server or off the server?
A: off the server | off-site | offsite | off server
```

**Learn more:** [Google Search Console](https://search.google.com/search-console) · [PageSpeed Insights](https://pagespeed.web.dev/)
""")

# ---------------- Digital marketing ----------------
d = track("marketing", "Digital marketing & SEO", "none", "Get found and get customers online: SEO, Google Business Profile, social media, content, email, ads and analytics.")

lesson(d, "seo-basics", "SEO: how Google ranks websites", """
# SEO basics

**SEO** (Search Engine Optimisation) helps your pages appear in Google when people search.

## How Google works

1. **Crawling**: Googlebot follows links and sitemaps to find pages.
2. **Indexing**: it reads and stores what each page is about.
3. **Ranking**: for each search it orders pages by relevance and quality (hundreds of signals).

## The three parts of SEO

- **Technical**: fast, mobile-friendly, HTTPS, no broken links, a `sitemap.xml`, clean URLs, structured data.
- **On-page**: the content itself. Answer the searcher's question better than anyone, with the keyword in the **title**, **H1**, first paragraph, headings and image alt text. Good **meta description** to win clicks.
- **Off-page**: trust signals: **backlinks** from reputable sites, reviews, mentions, social sharing, Google Business Profile.

## A page title and description that win clicks

```
<title>Website Design in Nakuru | From KSh 15,000 | Marzley Tech</title>
<meta name="description" content="Mobile-friendly websites with M-Pesa payments for Nakuru businesses. Free quote in 24 hours. Call 0745 789 590.">
```

## Local SEO

For searches like "web designer near me" or "plumber in Kisumu", Google shows the **map pack**, powered by **Google Business Profile** (next lesson). Consistent name, address and phone everywhere matters.

```quiz
Q: What does SEO stand for?
A: search engine optimisation | search engine optimization
Q: Links from other websites to yours are called?
A: backlinks
Q: Which file lists your pages for search engines?
A: sitemap.xml | sitemap
Q: Which HTML tag's text appears as the blue headline in Google results?
A: title | <title>
```
""")

lesson(d, "google-business", "Google Business Profile", """
# Google Business Profile

Your free listing on Google Search and Maps: address, phone, hours, photos, reviews. For local businesses it often brings more customers than the website.

## Set it up

1. Go to [google.com/business](https://www.google.com/business/) and add your business.
2. Choose the right **category** ("Website designer", "Restaurant", "Hardware store").
3. Add address (or service area if you visit customers), phone, website, hours.
4. **Verify** (by video, phone, email or postcard, whichever Google offers).
5. Add **real photos**: storefront, inside, products, team, work done.
6. Write a clear description with what you do and the areas you serve.

## Rank higher in the map pack

- Get **reviews** regularly and **reply to every review** (good and bad, politely).
- Post updates and offers weekly.
- Keep hours correct (including holidays).
- Same name, address and phone on your website and directories.
- Add products/services with prices.

Clients love it when you set this up for them. It's a quick, valuable service to sell.

```quiz
Q: Is a Google Business Profile free? (yes/no)
A: yes
Q: Should you reply to negative reviews? (yes/no)
A: yes
Q: What must you do before your profile fully appears? (one word)
A: verify | verification
```
""")

lesson(d, "social-media-marketing", "Social media marketing", """
# Social media marketing

## Pick the right platforms

| Platform | Best for |
|---|---|
| **Facebook** | Local businesses, groups, adults 25+, Marketplace |
| **Instagram** | Visual products: fashion, food, beauty, décor, events |
| **TikTok** | Reaching new people fast with short entertaining videos |
| **WhatsApp Business** | Talking to customers, catalogues, status updates, channels |
| **LinkedIn** | B2B services, professionals, recruiting, freelancing |
| **X (Twitter)** | News, customer service, tech and public conversations |
| **YouTube** | Tutorials and long-form content that keeps working for years |

## Content that works

- **Educate**: tips, how-tos ("3 signs your website is losing you customers").
- **Show**: behind the scenes, process, before/after, customer results.
- **Prove**: testimonials, reviews, case studies.
- **Offer**: promotions, clear calls to action ("WhatsApp us on 07…").

A useful mix: **80% helpful/entertaining, 20% selling**.

## Consistency beats perfection

A simple **content calendar** (e.g. Mon tip, Wed product, Fri testimonial, plus 3 short videos a week) done for months beats bursts of activity. Batch-create content one day a week.

## Measure

Reach, engagement (comments, shares, saves), profile visits, **messages and sales**. Followers alone don't pay bills.

```quiz
Q: What share of content should be selling in the 80/20 mix?
A: 20 | 20%
Q: Which platform is best for B2B services and professionals?
A: LinkedIn
Q: Which metric matters most for a business: followers or messages and sales?
A: messages and sales | sales | messages
```
""")

lesson(d, "content-email", "Content and email marketing", """
# Content and email marketing

## Content marketing

Create useful content that attracts the customers you want:

- **Blog posts** answering questions customers ask ("How much does a website cost in Kenya?").
- **Videos** showing how to do something.
- **Guides and checklists** people can download in exchange for their email.

Each piece should lead to a next step: WhatsApp, a quote form, a product page.

## Email marketing

Email is the channel you **own**: no algorithm decides who sees it.

1. Collect emails with permission: website sign-up box, checkout, events. Offer something useful (a guide, a discount).
2. Use a tool: **Mailchimp**, **Brevo**, **MailerLite** (free plans), or the newsletter feature in your own system.
3. Send regularly (e.g. monthly): useful tips + one offer.
4. Always include an **unsubscribe** link; only email people who agreed (required under Kenya's **Data Protection Act 2019**).
5. Measure **open rate**, **click rate**, and sales.

## Writing that sells: AIDA

- **Attention**: a clear headline.
- **Interest**: show you understand the problem.
- **Desire**: benefits and proof.
- **Action**: one clear call to action.

```quiz
Q: What does AIDA stand for? (four words)
A: attention interest desire action | attention, interest, desire, action
Q: What must every marketing email include so people can stop receiving them?
A: unsubscribe link | unsubscribe | an unsubscribe link
Q: Which Kenyan law requires consent to use people's personal data? (year)
A: 2019 | data protection act 2019
```
""")

lesson(d, "ads-analytics", "Online ads and analytics", """
# Online ads and analytics

## Ads

- **Meta Ads** (Facebook & Instagram): target by location, age and interests. Great for local businesses. Start with KSh 300–1,000 a day for a week and measure.
- **Google Ads**: show up when people are **searching** ("web design Nairobi"). High intent, often more expensive per click.
- **TikTok Ads**: cheap reach for younger audiences.

Rules for small budgets:

1. One clear goal (messages, calls, website sales).
2. A narrow audience (your town, the right age).
3. Test 2–3 images/videos and keep the winner.
4. Send people to WhatsApp or a fast landing page with one action.
5. Track **cost per message/lead/sale**, not likes.

## Analytics

- **Google Analytics 4**: visitors, where they came from, what they did (with cookie consent).
- **Google Search Console**: which searches show your site, clicks, indexing problems.
- **Meta Business Suite insights**, **TikTok analytics** for social.
- **UTM links** tag where a click came from: `?utm_source=facebook&utm_medium=post&utm_campaign=june_offer`.

## Key numbers

| Metric | Meaning |
|---|---|
| **CTR** | Click-through rate = clicks ÷ impressions |
| **CPC** | Cost per click |
| **Conversion rate** | Sales (or leads) ÷ visitors |
| **CPA** | Cost per acquisition (per sale or lead) |
| **ROAS** | Revenue ÷ ad spend |

Example: KSh 5,000 spent, 50 WhatsApp messages, 8 sales of KSh 3,000 → CPA = 5,000 ÷ 8 = **KSh 625**; ROAS = 24,000 ÷ 5,000 = **4.8**.

```quiz
Q: Which ad platform shows ads when people are actively searching?
A: Google Ads | google
Q: You spent KSh 2,000 and got 4 sales. What is the cost per acquisition (KSh)?
A: 500
Q: 1,000 people saw an ad and 20 clicked. What is the CTR (%)?
A: 2 | 2%
Q: What are the tags added to links to track where clicks came from? (4 letters)
A: UTM | utm parameters
```

**Learn more:** [Google Digital Skills for Africa](https://learndigital.withgoogle.com/digitalskills) · [Google Skillshop (Ads & Analytics)](https://skillshop.withgoogle.com/) · [Meta Blueprint](https://www.facebook.com/business/learn)
""")

# ---------------- Computer & IT basics ----------------
i = track("it-basics", "Computer & IT basics", "none", "Start here if you're new to computers: hardware, Windows, files, internet, typing, Office and Google tools, spreadsheets and fixing common problems.")

lesson(i, "computer-parts", "Parts of a computer", """
# Parts of a computer

## Hardware

| Part | What it does | What to look for |
|---|---|---|
| **CPU** (processor) | The "brain" that runs instructions | Intel Core i3/i5/i7 or AMD Ryzen 3/5/7; newer generation = faster |
| **RAM** (memory) | Short-term working space for open programs | 8 GB minimum for programming today; 16 GB is comfortable |
| **Storage** | Keeps files and programs permanently | **SSD** (much faster) over HDD; 256 GB+ |
| **Motherboard** | Connects everything | |
| **GPU** (graphics) | Draws the screen; needed for gaming, video editing, AI | Built-in is fine for coding and office work |
| **PSU / battery** | Power | Laptop battery health matters on second-hand machines |
| **Input devices** | Keyboard, mouse, touchpad, microphone, camera | |
| **Output devices** | Monitor, printer, speakers | |

## Software

- **Operating system (OS)**: Windows, macOS, Linux, Android, iOS. Manages hardware and runs apps.
- **Application software**: browsers, Word, Excel, VS Code, games.
- **Firmware/BIOS/UEFI**: low-level software that starts the computer.

## Units

1 byte = 8 bits · 1 KB ≈ 1,000 bytes · 1 MB ≈ 1,000 KB · 1 GB ≈ 1,000 MB · 1 TB ≈ 1,000 GB.

## Buying a second-hand laptop for learning

Aim for: Core i5 (8th gen or newer) or Ryzen 5, **8–16 GB RAM**, **SSD**, good battery, working keyboard and screen hinges. Test all ports, the Wi-Fi and the webcam before paying.

```quiz
Q: Which part is the "brain" of the computer?
A: CPU | processor
Q: Which is faster: SSD or HDD?
A: SSD
Q: How much RAM is the recommended minimum for programming today? (GB)
A: 8 | 8 gb | 8gb
Q: How many bits are in a byte?
A: 8
```
""")

lesson(i, "files-windows", "Files, folders and Windows skills", """
# Files, folders and Windows

## Files and folders

- A **file** holds data (a document, photo, program). Its **extension** tells its type: `.docx`, `.xlsx`, `.pdf`, `.jpg`, `.png`, `.mp4`, `.zip`, `.html`, `.exe`.
- A **folder** organises files. A good structure: `Documents/Clients/2026/Wanjiku Shop/`.
- Turn on **File name extensions** in File Explorer (View → Show) so you can spot fake files like `invoice.pdf.exe`.

## Keyboard shortcuts that save hours

| Shortcut | Action |
|---|---|
| Ctrl + C / X / V | Copy / cut / paste |
| Ctrl + Z / Y | Undo / redo |
| Ctrl + S | Save |
| Ctrl + F | Find |
| Ctrl + A | Select all |
| Alt + Tab | Switch windows |
| Windows + E | Open File Explorer |
| Windows + D | Show desktop |
| Windows + L | Lock the computer |
| Windows + Shift + S | Screenshot a part of the screen |
| Ctrl + Shift + Esc | Task Manager |
| Windows + V | Clipboard history |

## Compressing files

Right-click → **Compress to ZIP file** to send many files as one (e.g. uploading a website). Right-click a zip → **Extract All**.

## Cloud storage

**Google Drive** (15 GB free), **OneDrive**, **Dropbox**: your files are backed up and available on your phone.

```quiz
Q: Which shortcut undoes your last action?
A: Ctrl+Z | ctrl z | ctrl-z
Q: Which shortcut locks a Windows computer?
A: Windows+L | win+l | windows l | windows + l
Q: Which shortcut takes a screenshot of part of the screen on Windows?
A: Windows+Shift+S | win+shift+s | windows shift s
Q: What file extension does a compressed folder usually have?
A: .zip | zip
```
""")

lesson(i, "internet-email", "Internet, browsers and email", """
# The internet, browsers and email

## Browsers

Chrome, Edge, Firefox, Safari, Opera. Useful skills:

- Use the address bar to search.
- **Tabs**: Ctrl + T new, Ctrl + W close, Ctrl + Shift + T reopen closed tab.
- **Bookmarks** (Ctrl + D) for sites you use often.
- **Incognito/private** windows don't save history on that computer (you're still visible to websites and your network).
- Check the **padlock/https** before entering passwords or payment details.
- Keep the browser **updated**; remove extensions you don't need.

## Searching like a pro

- Use specific words: `KCSE chemistry past papers 2023 pdf`.
- Quotes for exact phrases: `"subnet mask" calculator`.
- `site:` to search one website: `site:kra.go.ke turnover tax`.
- `-word` to exclude: `jaguar -car`.
- Filter by time (Tools → Past year) for recent information.

## Email

- Professional address: `firstname.lastname@gmail.com` (not `sexyboy2005@...`).
- **To** = main recipient, **Cc** = keep informed, **Bcc** = hidden copy (use for group emails to protect privacy).
- Clear **subject** ("Quotation for shop website – Wanjiku Stores").
- Greeting, short paragraphs, clear ask, signature with phone number.
- Attachments: PDF for documents; zip large folders; check the file before sending.
- Don't click unexpected links or attachments (see the Cybersecurity track).

```quiz
Q: Which email field hides recipients from each other?
A: Bcc | bcc
Q: Which search operator limits results to one website?
A: site: | site
Q: Which shortcut reopens a tab you just closed?
A: Ctrl+Shift+T | ctrl shift t | ctrl-shift-t
```
""")

lesson(i, "office-docs", "Word processing and presentations", """
# Word, Google Docs and presentations

## Documents (Microsoft Word / Google Docs)

Skills employers expect:

- **Styles** (Heading 1, Heading 2, Normal) instead of manually making text bold and big. Then **Insert → Table of contents** builds itself.
- Page layout: margins, orientation, **page numbers**, headers and footers.
- **Tables** for neat information; **bullets and numbering** for lists.
- Insert images and **wrap text** around them.
- **Track changes** and **comments** when others review your work.
- **Save as PDF** before sending documents that shouldn't be edited (CVs, quotations, invoices).
- **Mail merge**: personalised letters or certificates from an Excel list.

## Presentations (PowerPoint / Google Slides / Canva)

- One idea per slide, **big text** (at least 24pt), few words.
- Use images and simple charts.
- Consistent theme and fonts.
- Practise; know your first and last sentence by heart.

## Google Workspace tip

Google Docs, Sheets and Slides are free, save automatically, and let several people edit at once. Share with **"Viewer"**, **"Commenter"** or **"Editor"** access.

```quiz
Q: What should you use to make headings so a table of contents can build itself?
A: styles | heading styles
Q: Which format should you send a CV or quotation in?
A: PDF | pdf
Q: Which Word feature creates personalised letters from a list?
A: mail merge
```
""")

lesson(i, "spreadsheets", "Spreadsheets: Excel and Google Sheets", """
# Spreadsheets

Spreadsheets (Excel, Google Sheets) are used by every business for money, stock, marks, reports. Strong spreadsheet skills get jobs and freelance work.

## Basics

- Cells are named by **column letter + row number**: `B3`.
- Formulas start with **=**: `=B2*C2`.
- **Fill handle**: drag the small square at a cell's corner to copy a formula down.
- **$ locks** a reference: `=B2*$F$1` keeps F1 fixed when copied (e.g. a VAT rate).

## Formulas you'll use every week

| Formula | Example | Result |
|---|---|---|
| `SUM` | `=SUM(B2:B20)` | Adds a range |
| `AVERAGE` | `=AVERAGE(C2:C40)` | Mean (class average) |
| `MIN` / `MAX` | `=MAX(D2:D40)` | Smallest / largest |
| `COUNT` / `COUNTA` | `=COUNTA(A2:A100)` | Count numbers / non-empty cells |
| `IF` | `=IF(C2>=50,"Pass","Fail")` | Decide |
| `COUNTIF` | `=COUNTIF(E2:E100,"Paid")` | Count matches |
| `SUMIF` | `=SUMIF(A2:A100,"Nairobi",D2:D100)` | Sum only matching rows |
| `XLOOKUP` / `VLOOKUP` | `=XLOOKUP(G2,A2:A50,C2:C50)` | Find a value in a table |
| `ROUND` | `=ROUND(B2*0.16,0)` | Round numbers |
| `TODAY` | `=TODAY()-D2` | Days since a date |
| `CONCAT` / `&` | `=A2&" "&B2` | Join text |

## Analysing data

- **Sort and filter** (Data → Filter).
- **Conditional formatting**: colour unpaid invoices red, top marks green.
- **Pivot tables**: summarise thousands of rows in seconds ("total sales per town per month").
- **Charts**: column charts for comparing, line charts for trends over time.

## Practise the calculations

```quiz
Q: What does =SUM(2,3,5) give?
A: 10
Q: Marks in C2 are 47. What does =IF(C2>=50,"Pass","Fail") show?
A: Fail
Q: Which symbol locks a cell reference so it doesn't change when copied?
A: $ | dollar | dollar sign
Q: B2 is 1000 and F1 is 0.16. What does =B2*$F$1 give?
A: 160
Q: Which feature summarises thousands of rows by category quickly?
A: pivot table | pivot tables | pivottable
Q: Which modern function replaces VLOOKUP for finding values?
A: XLOOKUP
```

**Learn more:** [Microsoft Excel training (free)](https://support.microsoft.com/en-us/excel) · [Google Sheets training](https://support.google.com/a/users/answer/9282959) · [GCFGlobal free computer lessons](https://edu.gcfglobal.org/en/)
""")

lesson(i, "maintenance", "Keeping a computer healthy and fixing common problems", """
# Keeping a computer healthy

## Routine care

- Install **updates** (Windows Update, apps, browser).
- Keep at least **15–20% of the disk free**; uninstall unused programs; empty Downloads.
- Use **Disk Cleanup / Storage Sense**.
- Restart at least once a week.
- Keep laptops ventilated (not on beds); clean dust from vents.
- Use a **surge protector or UPS**: power cuts and surges damage computers.
- **Back up** important files (cloud + external disk).

## Fixing common problems

| Problem | Try this |
|---|---|
| Computer very slow | Restart; Task Manager (Ctrl+Shift+Esc) → sort by CPU/Memory; disable startup apps; check disk space; scan for malware; upgrade to SSD/more RAM |
| Program frozen | Wait a bit, then Task Manager → End task |
| No internet | Check Wi-Fi/cable; restart router; run the network troubleshooter; `ipconfig /release` and `/renew`; see the Networking track |
| Printer not printing | Check it's on and connected; clear the print queue; restart print spooler; reinstall driver |
| No sound | Check output device and volume mixer; update driver |
| Blue screen (BSOD) | Note the error code; update drivers and Windows; test RAM; check recent changes |
| Full storage on phone | Clear WhatsApp media; move photos to Google Photos/computer |

## When to ask a technician

Burning smell, liquid damage, clicking hard disk, cracked screen, or anything involving opening a laptop if you're not trained. Back up data first.

```quiz
Q: Which shortcut opens Task Manager?
A: Ctrl+Shift+Esc | ctrl shift esc | ctrl-shift-esc
Q: What device protects a computer during power cuts? (3 letters)
A: UPS
Q: What single upgrade usually makes an old laptop feel much faster?
A: SSD | an ssd
```
""")
