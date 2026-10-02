---
slug: project-web-server
title: "Project: set up a Linux web server from scratch (Nginx, PHP, MySQL, HTTPS, backups)"
after: bash-scripts
---
# Project: set up a Linux web server from scratch (Nginx, PHP, MySQL, HTTPS, backups)

This capstone project puts every Linux skill together. You'll take a fresh Ubuntu server (a cloud VPS, a virtual machine or WSL for practice) and turn it into a secure, production-style web server hosting a PHP website with a MySQL database and free HTTPS, with automatic backups and monitoring. This is real work that hosting companies, agencies and freelancers get paid for, and a great portfolio piece if you document it.

:::note What you will build
- A hardened Ubuntu server with a sudo user, SSH keys and a firewall
- Nginx serving a website
- PHP-FPM running PHP code
- MySQL/MariaDB with a dedicated database user
- A domain with free Let's Encrypt HTTPS
- Automatic daily backups and a disk-space alert
- A short write-up for your portfolio
:::

## What you need

| Item | Options |
|---|---|
| Server | A small cloud VPS (1 vCPU, 1–2 GB RAM is plenty), or a local VM for practice |
| OS | Ubuntu Server LTS (24.04 or the current LTS) |
| Domain (optional for practice) | Any domain or subdomain you control, e.g. `demo.yourname.co.ke` |
| Your computer | A terminal with SSH (Windows Terminal, macOS/Linux Terminal) |

Commands below assume Ubuntu 24.04; package names (e.g. `php8.3-fpm`) change between versions, so use Tab completion or `apt search` to find yours.

## Stage 1: Secure the server (30 minutes)

Follow the SSH lesson's hardening steps:

```bash
ssh root@SERVER_IP
apt update && apt upgrade -y
adduser deploy && usermod -aG sudo deploy
timedatectl set-timezone Africa/Nairobi
```

From your computer: `ssh-copy-id deploy@SERVER_IP`, then test login in a new terminal. Then:

```bash
sudo nano /etc/ssh/sshd_config        # PermitRootLogin no, PasswordAuthentication no
sudo sshd -t && sudo systemctl restart ssh
sudo ufw allow OpenSSH && sudo ufw enable
sudo apt install -y fail2ban unattended-upgrades
```

**Checkpoint**: you can log in as deploy with your key; root and password logins are refused.

## Stage 2: Nginx

```bash
sudo apt install -y nginx
sudo ufw allow 'Nginx Full'          # ports 80 and 443
systemctl status nginx
curl -I http://localhost
```

Visit `http://SERVER_IP` in a browser: you should see "Welcome to nginx!".

Create your site folder:

```bash
sudo mkdir -p /var/www/demo
sudo chown -R deploy:www-data /var/www/demo
echo '<h1>It works!</h1>' > /var/www/demo/index.html
```

## Stage 3: PHP

```bash
sudo apt install -y php-fpm php-mysql php-mbstring php-xml php-curl
php -v
systemctl status php8.3-fpm          # use your version number
```

Create the Nginx site configuration:

```bash
sudo nano /etc/nginx/sites-available/demo
```

```nginx
server {
    listen 80;
    server_name demo.yourname.co.ke;     # or the server IP for practice
    root /var/www/demo;
    index index.php index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    }

    location ~ /\.(?!well-known) {
        deny all;                         # hide .env, .git and other dot files
    }
}
```

Enable it and test:

```bash
sudo ln -s /etc/nginx/sites-available/demo /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t                        # always test before reloading
sudo systemctl reload nginx
```

Test PHP with a small page:

```bash
cat > /var/www/demo/index.php <<'EOF'
<?php
echo "<h1>Hello from PHP " . PHP_VERSION . "</h1>";
echo "<p>Server time: " . date('Y-m-d H:i') . "</p>";
EOF
```

**Checkpoint**: the browser shows "Hello from PHP 8.x" and the time.

## Stage 4: Database

```bash
sudo apt install -y mysql-server     # or mariadb-server
sudo mysql_secure_installation
sudo mysql
```

Inside MySQL, create a database and a user with access only to it:

```sql
CREATE DATABASE demo_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'demo_app'@'localhost' IDENTIFIED BY 'a-long-random-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON demo_shop.* TO 'demo_app'@'localhost';
FLUSH PRIVILEGES;
USE demo_shop;
CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), price INT);
INSERT INTO products (name, price) VALUES ('Laptop bag', 2500), ('Wireless mouse', 1200);
EXIT;
```

Store the credentials **outside** the web root:

```bash
sudo mkdir -p /etc/demo
sudo nano /etc/demo/config.php
```

```php
<?php
return ['dsn' => 'mysql:host=localhost;dbname=demo_shop;charset=utf8mb4',
        'user' => 'demo_app', 'pass' => 'a-long-random-password'];
```

```bash
sudo chown root:www-data /etc/demo/config.php
sudo chmod 640 /etc/demo/config.php
```

Use it from PHP with a prepared statement:

```php
<?php
$cfg = require '/etc/demo/config.php';
$pdo = new PDO($cfg['dsn'], $cfg['user'], $cfg['pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$stmt = $pdo->prepare('SELECT name, price FROM products WHERE price < ?');
$stmt->execute([5000]);
foreach ($stmt as $row) {
    echo htmlspecialchars($row['name']) . ' – KSh ' . number_format($row['price']) . '<br>';
}
```

**Checkpoint**: the page lists the products from the database. `ss -tulpn` shows MySQL on 127.0.0.1 only.

## Stage 5: Domain and HTTPS

1. At your DNS provider, create an **A record**: `demo.yourname.co.ke → SERVER_IP`. Check with `dig demo.yourname.co.ke +short`.
2. Install Certbot and get a free Let's Encrypt certificate:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d demo.yourname.co.ke
sudo certbot renew --dry-run          # confirm automatic renewal works
```

Certbot edits the Nginx config to serve HTTPS and redirect HTTP to HTTPS. Certificates renew automatically.

**Checkpoint**: `https://demo.yourname.co.ke` shows a padlock; `curl -I http://...` returns a 301 redirect to https.

## Stage 6: Backups and monitoring

Database credentials for backups go in `/home/deploy/.my.cnf` (chmod 600):

```
[mysqldump]
user=backup_user
password=another-long-password
```

(Create `backup_user` in MySQL with `SELECT, LOCK TABLES, SHOW VIEW, TRIGGER` on `demo_shop`.)

Backup script `/home/deploy/backup.sh`:

```bash
#!/bin/bash
set -euo pipefail
DATE=$(date +%F)
DEST=/home/deploy/backups
mkdir -p "$DEST"
tar -czf "$DEST/site-$DATE.tar.gz" -C /var/www demo
mysqldump --single-transaction demo_shop | gzip > "$DEST/db-$DATE.sql.gz"
find "$DEST" -type f -mtime +14 -delete
```

Disk alert script `/home/deploy/disk-check.sh`:

```bash
#!/bin/bash
USAGE=$(df / --output=pcent | tail -1 | tr -dc '0-9')
if [ "$USAGE" -ge 85 ]; then
  echo "$(date '+%F %T') Disk at ${USAGE}% on $(hostname)" >> /home/deploy/alerts.log
fi
```

Schedule both:

```bash
chmod +x ~/backup.sh ~/disk-check.sh
crontab -e
```

```
15 2 * * * /home/deploy/backup.sh >> /home/deploy/backup.log 2>&1
*/30 * * * * /home/deploy/disk-check.sh
```

Copy backups off the server regularly (e.g. `rsync` to another machine, or your provider's object storage), and enable the provider's snapshot feature if available.

**Checkpoint**: run `~/backup.sh` manually, then restore the database into a test database to prove the backup works.

## Stage 7: Verify and document

Final checks:

```bash
sudo ufw status                    # only SSH, 80, 443
sudo ss -tulpn                     # MySQL on 127.0.0.1 only
sudo nginx -t                      # config OK
systemctl --failed                 # no failed services
sudo tail /var/log/nginx/error.log
```

Write a short README for your portfolio (no passwords or IP addresses!):
- What you built and why
- Architecture: Ubuntu + Nginx + PHP-FPM + MySQL + Let's Encrypt
- Security measures: keys only, firewall, Fail2ban, least-privilege DB user, secrets outside web root, automatic updates
- Backups and monitoring
- Screenshots and what you learned

## Going further

- Add a second site with its own server block and database.
- Install a real app (WordPress, Laravel or your own project) and deploy with Git and rsync.
- Add uptime monitoring with a free external service, and email alerts.
- Containerise the stack with Docker Compose (see the DevOps topics).

:::think After Stage 3 your PHP page downloads as a file instead of running. What are the likely causes?
Nginx isn't passing `.php` files to PHP-FPM: the `location ~ \.php$` block is missing or wrong, the `fastcgi_pass` socket path doesn't match your PHP version (check `ls /run/php/`), PHP-FPM isn't running, or Nginx wasn't reloaded after the change. Run `sudo nginx -t`, check `systemctl status php8.3-fpm`, and reload.
:::

## Summary

- Harden first: sudo user, SSH keys, no root/password logins, UFW, Fail2ban, automatic updates.
- Nginx serves files; PHP-FPM runs PHP through a socket configured in the server block; always `nginx -t` before reloading.
- MySQL gets a dedicated least-privilege user; credentials live outside the web root with 640 permissions; PHP uses prepared statements.
- Point an A record at the server and use Certbot for free, auto-renewing HTTPS.
- Automate backups and disk checks with scripts and cron, test restores, and document the project for your portfolio.

```quiz
Q: Which command tests the Nginx configuration for errors? (two words)
A: nginx -t | sudo nginx -t
Q: Which tool gets free HTTPS certificates from Let's Encrypt?
A: Certbot | certbot
Q: Which DNS record type points a domain name to an IPv4 address?
A: A | A record
Q: Should the database config file be inside /var/www? (yes/no)
A: no
Q: Which PHP feature protects queries from SQL injection? (two words)
A: prepared statements | prepared statement
```
