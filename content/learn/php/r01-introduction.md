---
slug: introduction
title: "PHP introduction: what PHP is, how server-side code works, who uses it and setting up your computer"
after: KEEP
---
# PHP introduction: what PHP is, how server-side code works, who uses it and setting up your computer

**PHP** is a programming language that runs on the **web server** and builds the pages your browser receives. When you log in to a school portal, submit a contact form, check out on a small online shop or read a WordPress blog, there's a good chance PHP did the work: it checked your password, saved the form to a database, calculated the total, or put the blog post into a page.

PHP powers **WordPress** (which runs a very large share of all websites), Laravel apps, Moodle (used by many universities for e-learning), and countless Kenyan school, SACCO, hospital and shop systems. It runs on almost every cheap shared hosting plan (cPanel), which makes it one of the most practical languages for freelancers building websites for local clients.

:::note What you will learn
- Client-side vs server-side code
- What happens when someone visits a PHP page
- Who uses PHP and what jobs need it
- Your first PHP code and the basic syntax rules
- Mixing PHP with HTML
- Comments, echo, print and errors
- Setting up PHP: XAMPP, the built-in server, VS Code, hosting
- How this subject is organised
:::

## Client-side vs server-side

| | Client-side (HTML, CSS, JavaScript) | Server-side (PHP, Python, Node.js...) |
|---|---|---|
| Runs on | The visitor's browser | The web server |
| Visitor can see the code? | Yes (View Source) | No: they only see the result |
| Can access the database directly? | No | Yes |
| Good for | Layout, animations, instant interactions | Logins, saving data, payments, emails, secret keys |

You need both: HTML/CSS/JavaScript for what users see and interact with, and a server-side language for anything that must be stored, secured or trusted.

## What happens when you visit a PHP page

1. The browser asks the server for `https://shop.example.co.ke/products.php?category=phones`.
2. The web server (Apache or Nginx) sees `.php` and hands the file to PHP.
3. PHP runs the code: reads the `category` value, queries the MySQL database for phones, builds an HTML list.
4. The server sends back **plain HTML**. The visitor never sees your PHP code, database password or business logic.
5. The browser displays the page.

Each request starts fresh: PHP runs, produces output, and finishes. Data that must survive between pages is kept in a **database**, **sessions** or **cookies** (later lessons).

## Who uses PHP

| Who | For what |
|---|---|
| Freelance web developers | Business websites, WordPress customisations, small shops, booking systems |
| Agencies | WordPress and WooCommerce sites, Laravel web apps |
| Companies and institutions | Internal systems: HR, inventory, school management, SACCO portals |
| Large platforms | Facebook was built on PHP (now its Hack variant); Wikipedia runs on PHP (MediaWiki) |
| E-learning | Moodle, used by universities and colleges |

Jobs: PHP developer, WordPress developer, Laravel developer, full-stack developer, back-end developer. Many freelance clients in Kenya want "a website with a system": PHP + MySQL is a direct path to that work.

## Your first PHP code

Press **Run** to execute PHP right here:

```try-php
<?php
echo "Habari, Kenya!\n";
echo "Today is " . date("l") . ".\n";
echo "2 + 3 = " . (2 + 3) . "\n";
```

Syntax rules:
- PHP code starts with `<?php`. In a file that's only PHP, leave out the closing `?>` (it avoids accidental whitespace being sent).
- Every statement ends with a semicolon `;`.
- `echo` outputs text; `.` joins strings (concatenation).
- `"\n"` is a new line in text output (in a web page you'd use `<br>` or HTML elements).
- Variable names start with `$`: `$name`.
- PHP keywords and function names aren't case-sensitive, but **variable names are**: `$Name` and `$name` are different.

## Mixing PHP with HTML

A `.php` file can contain HTML with PHP blocks inside:

```php
<!DOCTYPE html>
<html>
<body>
  <h1><?php echo "Habari, Kenya!"; ?></h1>
  <p>Today is <?= date("l, j F Y") ?></p>
  <?php $items = ["Laptop bag", "Wireless mouse", "Phone charger"]; ?>
  <ul>
    <?php foreach ($items as $item): ?>
      <li><?= htmlspecialchars($item) ?></li>
    <?php endforeach; ?>
  </ul>
</body>
</html>
```

- `<?= ... ?>` is a shortcut for `<?php echo ... ?>`.
- The `foreach (...): ... endforeach;` style is easier to read inside HTML.
- `htmlspecialchars()` makes text safe to put into HTML (the security lesson explains why this matters).

## Comments

```try-php
<?php
// A single-line comment
# Also a single-line comment
/* A multi-line
   comment */
echo "Comments are ignored by PHP\n";
```

## echo vs print, and printf

```try-php
<?php
$name = "Amina";
$balance = 15250.5;
echo "Hello, $name\n";                       // variables inside double quotes are replaced
print "print works too\n";
printf("Balance: KSh %s\n", number_format($balance, 2));
printf("%-10s|%5d|\n", "Chapati", 30);       // formatted columns
```

## Errors

PHP tells you what went wrong and on which line. Learn to read the messages:

```try-php
<?php
// fails on purpose: a missing semicolon on the next line
echo "Hello"
echo "World";
```

| Message | Meaning |
|---|---|
| `Parse error: syntax error, unexpected ...` | A typo: missing `;`, bracket or quote, usually on or just before that line |
| `Warning: Undefined variable $x` | You used a variable before giving it a value |
| `Fatal error: Uncaught Error: Call to undefined function` | Misspelt function name or missing include |

During development, show errors; on a live site, **log** them instead of showing them to visitors (they can reveal file paths and other details attackers use).

## Setting up PHP on your computer

| Option | How | Notes |
|---|---|---|
| **XAMPP** (Windows/macOS/Linux) | Install, start Apache and MySQL, put files in `htdocs`, open `http://localhost/yourfile.php` | Easiest all-in-one with MySQL and phpMyAdmin |
| **Built-in server** | With PHP installed, run `php -S localhost:8000` in your project folder | Quick testing |
| **Laragon** (Windows) | All-in-one like XAMPP, popular with Laravel developers | |
| **Linux** | `sudo apt install php php-mysql` | See the Linux web server project |
| **Hosting** | Upload files to `public_html` via cPanel File Manager or FTP | Real-world deployment |

Editor: **VS Code** with a PHP extension (e.g. PHP Intelephense) gives colour-coding, auto-complete and error hints.

## How this subject is organised

1. Language basics: variables, strings, numbers, arrays, conditions, loops, functions, OOP.
2. Web basics: forms, validation, security.
3. Databases: MySQL with PDO, a full CRUD app.
4. Real features: sessions and logins, file uploads, JSON APIs, M-Pesa payments.
5. A complete project: a booking system.

:::think A friend says: "I'll put the database password in my JavaScript file so the website can read products directly from MySQL." Why is this a bad idea, and what should they do instead?
JavaScript runs in the browser, so anyone can view the source and see the password, then access or delete the database. Database access must happen on the server: PHP reads the products and sends HTML or JSON to the browser. The password stays in a server-side config file outside the public folder.
:::

## Summary

- PHP is a server-side language: it runs on the server and sends HTML to the browser; visitors never see the code.
- It powers WordPress, Laravel apps, Moodle and many local business systems, and runs on almost all shared hosting.
- Code starts with `<?php`, statements end with `;`, variables start with `$`, `echo` outputs, `.` joins strings.
- PHP can be mixed with HTML using `<?php ?>` and `<?= ?>`; use `htmlspecialchars()` when printing text.
- Set up with XAMPP, Laragon or `php -S`; read error messages carefully and hide them on live sites.

```quiz
Q: Does PHP run in the browser or on the server?
A: server | on the server | the server
Q: What tag opens a block of PHP code?
A: <?php
Q: Which popular website system is written in PHP?
A: WordPress
Q: Which free package gives you Apache, PHP and MySQL on Windows? (starts with X)
A: XAMPP
Q: Which character joins (concatenates) strings in PHP?
A: . | dot | a dot
Q: Which symbol do all PHP variable names start with?
A: $
```

**Learn more:** [PHP: The Right Way](https://phptherightway.com/) · [Official PHP manual](https://www.php.net/manual/en/)
