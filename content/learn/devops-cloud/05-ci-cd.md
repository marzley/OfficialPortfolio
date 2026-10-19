---
slug: ci-cd-pipelines
title: "Git workflows and CI/CD pipelines: automatic testing and deployment with GitHub Actions"
after: cloud-networking
---
# Git workflows and CI/CD pipelines: automatic testing and deployment with GitHub Actions

**CI/CD** is the heart of DevOps. Every time someone pushes code, a pipeline automatically builds it, tests it and (if everything passes) deploys it. Teams that do this release small changes often, with fewer disasters. You met GitHub Actions in the [Git subject](./?track=git&lesson=github-actions-ci); here we build full pipelines.

## A team Git workflow

1. `main` always holds working, deployable code.
2. For each change, create a **branch**: `git switch -c feature/mpesa-receipts`.
3. Commit small, clear changes; push the branch.
4. Open a **pull request (PR)**; CI runs automatically.
5. A teammate **reviews**; fix comments.
6. **Merge** when tests pass and the review is approved.
7. CD deploys `main` automatically (or after approval).

Protect `main` in your repository settings: require PRs, passing checks and at least one review.

## CI, continuous delivery and continuous deployment

| Term | Meaning |
|---|---|
| **Continuous integration (CI)** | Every change is built and tested automatically |
| **Continuous delivery** | Every passing change is ready to deploy; a person clicks "deploy" |
| **Continuous deployment** | Every passing change is deployed automatically |

## A CI pipeline (GitHub Actions)

Save as `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

- **on:** when the workflow runs (every PR and every push to main).
- **jobs → steps:** commands that run on a fresh Ubuntu machine.
- If any step fails, the PR shows a red cross and shouldn't be merged.

## Adding deployment (CD)

A common pattern: when `main` changes and tests pass, deploy to the server over SSH.

```yaml
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy over SSH
        env:
          SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          HOST: ${{ secrets.DEPLOY_HOST }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_KEY" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -H "$HOST" >> ~/.ssh/known_hosts
          rsync -az --delete --exclude ".git" ./ deploy@"$HOST":/var/www/myapp/
          ssh deploy@"$HOST" "sudo systemctl restart myapp"
```

- **needs: test** means deploy only runs if tests passed.
- **Secrets** (SSH key, host) are stored in repository settings, never in the code.
- **environment: production** can require a manual approval before deploying.

Other popular CI/CD tools: GitLab CI/CD, Jenkins, Azure Pipelines, CircleCI, and the deploy pipelines built into platforms.

## Deployment strategies

| Strategy | How | Benefit |
|---|---|---|
| **Rolling** | Update servers one by one | No downtime |
| **Blue-green** | Run the new version beside the old; switch traffic over | Instant rollback |
| **Canary** | Send a small % of users to the new version first | Catch problems early |
| **Feature flags** | Ship code switched off; turn it on gradually | Separate deploys from releases |

Always have a **rollback plan**: redeploy the previous version quickly.

## What a good pipeline checks

1. Code formatting and linting
2. Unit tests
3. Security checks (dependency vulnerabilities, secret scanning)
4. Build (and build a Docker image, lesson 6)
5. Deploy to a **staging** environment, run smoke tests
6. Deploy to **production**, with monitoring

:::warning Secrets in pipelines
Never print secrets in logs, never commit `.env` files, and give pipeline credentials the least access they need. Rotate keys if they leak. M-Pesa and payment keys belong in secret stores, not in code.
:::

:::think Tests pass on a developer's laptop but fail in CI. Why might that happen, and why is that actually useful?
Differences in environment: missing dependencies not listed in package files, different versions, environment variables only set locally, files not committed, or tests depending on local data or time zones. CI's clean machine exposes these hidden assumptions before they break production.
:::

## Summary

- Work in branches and pull requests; protect `main`.
- CI builds and tests every change; CD deploys passing changes (with or without a manual click).
- GitHub Actions workflows live in `.github/workflows/*.yml`; store credentials in secrets.
- Use safe deployment strategies (rolling, blue-green, canary) and always plan a rollback.

```quiz
Q: In which folder do GitHub Actions workflow files live? (write it like .github/workflows)
A: .github/workflows | github/workflows
Q: Which deployment strategy sends a small share of users to the new version first? (one word)
A: canary
Q: Should secrets be written directly in workflow files? (yes or no)
A: no
```
