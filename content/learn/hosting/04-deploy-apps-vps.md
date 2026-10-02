---
slug: deploy-node-python-apps
title: "Deploying Node.js and Python apps: VPS with Nginx, PM2, Gunicorn, Docker and platform-as-a-service options"
after: website-speed
---
# Deploying Node.js and Python apps: VPS with Nginx, PM2, Gunicorn, Docker and platform-as-a-service options

Shared cPanel hosting is built for PHP. When you build with **Node.js** (Express, Next.js) or **Python** (Flask, Django, FastAPI), or need background workers and WebSockets, you'll usually deploy to a **VPS**, a container platform, or a **PaaS** (platform as a service) that runs the app for you. This unit explains the options and walks through a production-style deployment: the app runs as a service, **Nginx** sits in front as a reverse proxy with HTTPS, and updates are repeatable.

:::note What you will learn
- How app hosting differs from static and PHP hosting
- Options: PaaS (Render, Railway, Fly.io, Heroku), containers, VPS
- Preparing an app for production: environment variables, ports, logging
- Deploying Node.js with PM2 behind Nginx
- Deploying Python with Gunicorn/Uvicorn and systemd behind Nginx
- HTTPS with Certbot
- Docker and Docker Compose basics
- Zero-downtime updates, monitoring and rollbacks
:::

## How it differs

| | Static site | PHP on shared hosting | Node/Python app |
|---|---|---|---|
| Runs | Files served as-is | PHP runs per request via the web server | A long-running **process** listening on a port |
| Needs | Any web server/CDN | cPanel host | Process manager + reverse proxy, or a PaaS |
| Examples | Portfolio | WordPress, Laravel | Express API, Django site, Next.js app, chat server |

## Options

| Option | Pros | Cons |
|---|---|---|
| **PaaS** (Render, Railway, Fly.io, Heroku, Google Cloud Run, Azure App Service) | Push code from Git, they build and run it; HTTPS included | Costs grow with usage; less control; free tiers change often |
| **Containers** (Docker on a VPS, or managed container services) | Same environment everywhere | Learning curve |
| **VPS** (DigitalOcean, Hetzner, Linode, local VPS providers) | Full control, predictable price, run several apps | You manage security, updates and uptime |

For learning and portfolios, a PaaS free tier or a small VPS (1–2 GB RAM) is enough.

## Prepare the app for production

1. **Configuration from environment variables**, never hard-coded secrets: database URLs, API keys, M-Pesa credentials.
2. **Listen on a configurable port**, bound to `127.0.0.1` when behind Nginx:

```js
// Express (Node.js)
const express = require("express");
const app = express();
app.get("/health", (req, res) => res.json({ ok: true }));
const port = process.env.PORT || 3000;
app.listen(port, "127.0.0.1", () => console.log("Listening on " + port));
```

3. **Production mode**: `NODE_ENV=production`; Django `DEBUG=False` with `ALLOWED_HOSTS` set.
4. **Logging** to stdout/files; never print secrets.
5. **Dependencies pinned**: `package-lock.json`, `requirements.txt`.
6. A **health check** endpoint (`/health`) for monitoring.

## Deploying Node.js with PM2 and Nginx (Ubuntu VPS)

Assumes a hardened server (see the Linux SSH lesson): a sudo user, SSH keys, UFW allowing OpenSSH and Nginx.

```bash
# 1. Install Node.js (LTS) from the official NodeSource or nvm instructions, then:
node -v && npm -v

# 2. Get the code
cd /var/www && sudo mkdir myapp && sudo chown $USER:$USER myapp
git clone https://github.com/you/myapp.git myapp && cd myapp
npm ci --omit=dev

# 3. Environment variables in a protected file
nano .env            # PORT=3000, DATABASE_URL=..., chmod 600 .env

# 4. Run with PM2 (restarts on crash and on reboot)
sudo npm install -g pm2
pm2 start server.js --name myapp
pm2 save
pm2 startup          # run the command it prints to enable start on boot
pm2 logs myapp       # view logs
```

Nginx reverse proxy, `/etc/nginx/sites-available/myapp`:

```nginx
server {
    listen 80;
    server_name api.yourbusiness.co.ke;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;        # WebSockets
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## Deploying Python (Flask/Django/FastAPI)

```bash
sudo apt install -y python3-venv
cd /var/www/myapp
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn
# Django extras: python manage.py migrate && python manage.py collectstatic
```

Run it as a **systemd service**, `/etc/systemd/system/myapp.service`:

```ini
[Unit]
Description=My Python app
After=network.target

[Service]
User=deploy
WorkingDirectory=/var/www/myapp
EnvironmentFile=/var/www/myapp/.env
ExecStart=/var/www/myapp/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

For Django use `myproject.wsgi:application`; for FastAPI use Uvicorn workers (`gunicorn -k uvicorn.workers.UvicornWorker main:app`).

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp
sudo systemctl status myapp
journalctl -u myapp -f        # logs
```

Use the same Nginx config with `proxy_pass http://127.0.0.1:8000;`, and let Nginx serve static files directly:

```nginx
location /static/ { alias /var/www/myapp/static/; }
```

## HTTPS

Point an A record (e.g. `api.yourbusiness.co.ke`) at the server, then:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourbusiness.co.ke
sudo certbot renew --dry-run
```

## Docker and Compose basics

A `Dockerfile` packages the app and its runtime:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
```

`docker-compose.yml` runs the app with a database:

```yaml
services:
  app:
    build: .
    env_file: .env
    ports: ["127.0.0.1:3000:3000"]
    depends_on: [db]
    restart: unless-stopped
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes: [dbdata:/var/lib/postgresql/data]
    restart: unless-stopped
volumes:
  dbdata:
```

```bash
docker compose up -d --build
docker compose logs -f app
```

Binding to `127.0.0.1` keeps the container reachable only via Nginx; don't publish database ports to the internet.

## Updates, rollbacks and monitoring

A simple deploy script:

```bash
#!/bin/bash
set -euo pipefail
cd /var/www/myapp
git pull --ff-only
npm ci --omit=dev
pm2 reload myapp          # graceful reload with no downtime for clustered apps
curl -fsS http://127.0.0.1:3000/health
```

- **Rollback**: `git checkout <previous-tag>` and reload; tag releases (`v1.4.0`).
- **Automate** with GitHub Actions deploying over SSH after tests pass (see the Git Actions lesson).
- **Monitor**: uptime checks on `/health`, server metrics (CPU, RAM, disk), log alerts; back up databases off-server daily.

:::think Your Node app runs fine with `node server.js`, but after you close the SSH session the site stops, and after a reboot it never comes back. What's missing?
A process manager. Run it with PM2 (`pm2 start`, `pm2 save`, `pm2 startup`) or a systemd service with `Restart=always` and `WantedBy=multi-user.target`, so it keeps running after logout, restarts on crashes and starts on boot.
:::

## Summary

- Node/Python apps are long-running processes; deploy them on a PaaS, containers or a VPS.
- Prepare apps with environment variables, configurable ports bound to localhost, production mode, logging and a health check.
- On a VPS: PM2 (Node) or Gunicorn/Uvicorn with systemd (Python), behind an Nginx reverse proxy, with Certbot HTTPS.
- Docker and Compose package apps and databases consistently; keep internal ports private.
- Use repeatable deploy scripts, tagged releases for rollbacks, CI/CD, monitoring and off-server backups.

```quiz
Q: Which process manager keeps Node.js apps running and restarts them on crash?
A: PM2
Q: What role does Nginx play in front of a Node or Python app? (two words)
A: reverse proxy
Q: Which Python server commonly runs Flask/Django apps in production?
A: Gunicorn | gunicorn | uvicorn
Q: Which tool gets free HTTPS certificates on a VPS?
A: Certbot | certbot
Q: Should Django's DEBUG be True in production? (yes/no)
A: no
Q: Which file describes multi-container apps for Docker Compose?
A: docker-compose.yml | compose.yaml | docker-compose.yaml
```
