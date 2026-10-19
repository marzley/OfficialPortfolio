---
slug: docker-containers
title: "Docker and containers: images, Dockerfiles, volumes and Docker Compose"
after: ci-cd-pipelines
---
# Docker and containers: images, Dockerfiles, volumes and Docker Compose

"It works on my machine" is the oldest excuse in software. **Containers** fix it: they package an app with everything it needs (runtime, libraries, settings) so it runs the same on your laptop, a test server and the cloud. **Docker** is the most popular container tool.

## Containers vs virtual machines

| | Virtual machine | Container |
|---|---|---|
| Includes | A full operating system | Just the app and its dependencies (shares the host's kernel) |
| Size | Gigabytes | Often tens or hundreds of megabytes |
| Start time | Minutes | Seconds |
| Use | Full isolation, different OSes | Packaging and running apps consistently |

## Key words

- **Image:** a read-only template (like a recipe) for a container, e.g. `nginx`, `node:20`, `mysql:8`.
- **Container:** a running instance of an image (the meal cooked from the recipe).
- **Dockerfile:** instructions to build your own image.
- **Registry:** where images are stored and shared (Docker Hub, GitHub Container Registry, cloud registries).
- **Volume:** storage that survives when a container is deleted (for databases and uploads).

## First commands

```bash
docker run -d -p 8080:80 --name web nginx    # run Nginx; open http://localhost:8080
docker ps                                     # running containers
docker logs web                               # its logs
docker exec -it web sh                        # a shell inside the container
docker stop web && docker rm web              # stop and remove
docker images                                 # images on your machine
```

`-p 8080:80` maps port 8080 on your computer to port 80 inside the container.

## Write a Dockerfile

For a small Node.js app:

```dockerfile
# Start from an official, small base image
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the code
COPY . .

# Don't run as root
USER node

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t mpesa-receipts:1.0 .
docker run -d -p 3000:3000 --env-file .env mpesa-receipts:1.0
```

Add a `.dockerignore` file (like `.gitignore`) listing `node_modules`, `.git` and `.env` so they aren't copied into the image.

## Docker Compose: several containers together

Most apps need more than one service: the app, a database, maybe a cache. **Docker Compose** describes them in one file:

```yaml
# compose.yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_NAME: shop
      DB_USER: shop
      DB_PASSWORD: ${DB_PASSWORD}
    depends_on:
      - db
  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: shop
      MYSQL_USER: shop
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
volumes:
  db_data:
```

```bash
docker compose up -d        # start everything
docker compose logs -f app  # follow logs
docker compose down         # stop (the volume keeps your data)
```

The app reaches the database at the hostname `db`: Compose creates a private network where services find each other by name. Passwords come from a `.env` file that isn't committed to Git.

## Good practices

1. Use **official, small** base images (alpine or slim variants) and pin versions (`node:20-alpine`, not `latest`).
2. **One process per container** (app, database and cache in separate containers).
3. **Never put secrets in images**; pass them as environment variables or secrets at runtime.
4. Run as a **non-root user**.
5. Store data in **volumes** (containers are disposable).
6. **Scan images** for vulnerabilities (e.g. `docker scout`, Trivy) in CI.
7. Tag images with versions or Git commit IDs so you can roll back.

## Containers in CI/CD

A typical pipeline: run tests → `docker build` → push the image to a registry → deploy that exact image to staging, then production. The same image runs everywhere, so what you tested is what goes live.

:::tip Practise for free
Play with Docker (labs.play-with-docker.com) gives temporary Docker playgrounds in the browser. Docker Desktop runs on Windows and Mac; on Linux, install Docker Engine. GitHub Codespaces also includes Docker.
:::

:::think You delete and recreate your database container, and all the shop's orders are gone. What went wrong and how do you prevent it?
The data was stored inside the container's own filesystem, which is deleted with the container. Store database data in a named volume (or a managed database service), and take regular backups that are tested by restoring them.
:::

## Summary

- Containers package apps with their dependencies so they run the same everywhere.
- Images are templates; containers are running instances; Dockerfiles build images; registries store them.
- Docker Compose runs multi-container apps from one file; services reach each other by name.
- Use small official images, no secrets in images, non-root users, volumes for data and version tags.

```quiz
Q: What is a running instance of an image called? (one word)
A: container
Q: Which file contains instructions to build a Docker image? (one word)
A: dockerfile
Q: Where should database data be stored so it survives deleting the container? (one word)
A: volume | volumes | a volume
```
