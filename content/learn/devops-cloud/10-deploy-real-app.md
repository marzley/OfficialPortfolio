---
slug: deploy-real-app
title: "Project: deploy a real web app with Docker, Nginx, HTTPS and automatic deploys"
after: core-cloud-services
---
# Project: deploy a real web app with Docker, Nginx, HTTPS and automatic deploys

Time to put it all together. In this project you deploy a small web app to a cloud server the way professionals do: containers, a reverse proxy, HTTPS, a CI/CD pipeline and backups. It's an excellent portfolio piece.

## What you'll build

```text
GitHub repo ──push──► GitHub Actions (test, build image) ──► registry
                                                            │
                                         server pulls new image and restarts
                                                            ▼
Users ──HTTPS──► Nginx (reverse proxy, Let's Encrypt) ──► app container ──► database container (volume)
                                                                            │
                                                                nightly backup → object storage
```

## What you need

- A small cloud server (VPS) with Ubuntu: from a big cloud's free tier or a VPS provider. Some Kenyan hosting companies also offer VPS plans billed in shillings.
- A domain name (see [domains](./?track=hosting&lesson=domains)).
- A GitHub account.
- An app: any small Node, Python or PHP app (or one from the [projects subject](./?track=projects&lesson=how-to-build-projects)).

## Step 1: prepare the server

Follow the checklist from [Linux servers for DevOps](./?track=devops-cloud&lesson=linux-servers-devops): SSH keys, a `deploy` user, updates, firewall (22, 80, 443). Then install Docker:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker deploy    # log out and in again
```

:::warning Read scripts before piping them to a shell
`curl ... | sh` runs a script from the internet with your permissions. Only do it from official sources you trust (here, Docker's own site), or download and read the script first.
:::

## Step 2: containerise the app

Write a `Dockerfile` and `compose.yaml` like in the [Docker lesson](./?track=devops-cloud&lesson=docker-containers). Test locally: `docker compose up -d`, open the app in your browser.

## Step 3: point the domain

Create an **A record** for `app.yourdomain.co.ke` pointing to the server's public IP. DNS changes can take minutes to hours.

## Step 4: Nginx as a reverse proxy with HTTPS

Install Nginx and Certbot on the server:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

```nginx
# /etc/nginx/sites-available/app
server {
    server_name app.yourdomain.co.ke;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d app.yourdomain.co.ke     # free HTTPS certificate, auto-renews
```

In `compose.yaml`, publish the app only on localhost (`"127.0.0.1:3000:3000"`) so it's reachable through Nginx, not directly from the internet.

## Step 5: automatic deploys

In GitHub Actions (see [CI/CD](./?track=devops-cloud&lesson=ci-cd-pipelines)):
1. On every push to `main`: run tests.
2. Build the image and push it to GitHub Container Registry, tagged with the commit ID.
3. SSH into the server and run:

```bash
cd /home/deploy/app
docker compose pull
docker compose up -d
docker image prune -f
```

Store the SSH key and server address as repository **secrets**.

## Step 6: backups

```bash
# /home/deploy/backup.sh (run nightly with cron)
docker compose exec -T db mysqldump -u root -p"$DB_ROOT_PASSWORD" shop | gzip > /home/deploy/backups/shop-$(date +%F).sql.gz
find /home/deploy/backups -name "*.sql.gz" -mtime +14 -delete
```

Copy backups off the server too (object storage or another location). **Test restoring** a backup at least once; a backup you can't restore isn't a backup.

## Step 7: monitoring

- An uptime monitor that alerts you when the site is down (many have free plans).
- Check `docker compose logs`, disk space and memory regularly (next lesson covers proper monitoring).

## Document it for your portfolio

Write a README with: the architecture diagram, what each part does, how to deploy, how backups work, and what you'd improve. Link it on your CV and LinkedIn.

:::think After deploying, the site works over HTTP but HTTPS fails. What would you check?
Check the DNS A record points to the server, port 443 is open in both UFW and the cloud firewall, Certbot completed without errors, the Nginx config passes nginx -t and was reloaded, and the server_name matches the domain exactly. Then check Nginx error logs.
:::

## Summary

- Prepare a hardened server, install Docker and containerise your app.
- Point a domain, put Nginx in front as a reverse proxy and add free HTTPS with Certbot.
- Automate deploys with GitHub Actions and a container registry.
- Back up nightly, store copies off the server, test restores and add uptime monitoring.

```quiz
Q: Which tool gets free Let's Encrypt HTTPS certificates for Nginx? (one word)
A: certbot
Q: Which Nginx command tests the configuration before reloading? (write like nginx -t)
A: nginx -t | sudo nginx -t
Q: Is a backup useful if you've never tested restoring it? (yes or no)
A: no
```
