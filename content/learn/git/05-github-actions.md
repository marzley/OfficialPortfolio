---
slug: github-actions-ci
title: "GitHub Actions and CI: run tests automatically on every push"
after: pull-requests-teamwork
---
# GitHub Actions and CI: run tests automatically on every push

Imagine every time anyone pushes code, a robot checks it: runs the tests, checks formatting, builds the app, and puts a ✅ or ❌ on the pull request. That's **Continuous Integration (CI)**, and **GitHub Actions** is GitHub's built-in tool for it. Teams use CI so broken code never reaches `main`, and **Continuous Deployment (CD)** goes one step further by publishing the app automatically when tests pass.

Knowing the basics of CI is a big plus in developer and DevOps job interviews.

:::note What you will learn
- What CI/CD is and why teams use it
- How GitHub Actions works: workflows, events, jobs, steps, runners
- Writing your first workflow in YAML
- Testing Python and JavaScript projects automatically
- Status checks on pull requests and branch protection
- Secrets in Actions
- Deploying automatically, and free usage limits
:::

## Why CI?

| Without CI | With CI |
|---|---|
| "It works on my computer" | Tests run on a clean machine every time |
| Bugs found by customers | Bugs found minutes after the push |
| Reviewers check everything by hand | Robots check tests and style; humans review logic |
| Manual, error-prone deployments | One reliable, repeatable process |

## How GitHub Actions works

| Term | Meaning |
|---|---|
| **Workflow** | A YAML file in `.github/workflows/` describing automation |
| **Event (trigger)** | What starts it: `push`, `pull_request`, a schedule, a manual button |
| **Job** | A group of steps that runs on one machine |
| **Step** | A single command (`run:`) or a reusable action (`uses:`) |
| **Runner** | The virtual machine (Ubuntu, Windows or macOS) that runs the job |
| **Action** | A reusable building block, e.g. `actions/checkout` to download your code |

## YAML in 60 seconds

YAML uses **indentation with spaces** (never tabs) to show structure:

```yaml
name: My workflow      # key: value
on: [push]             # a list
jobs:                  # nested mapping
  test:
    runs-on: ubuntu-latest
```

Most Actions errors are indentation mistakes.

## Your first workflow

Create `.github/workflows/hello.yml`:

```yaml
name: Hello CI
on:
  push:
  pull_request:
jobs:
  say-hello:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Show files
        run: ls -la
      - name: Greet
        run: echo "Hello from GitHub Actions on commit ${{ github.sha }}"
```

Commit and push, then open the repository's **Actions** tab to watch it run and read the logs.

## Testing a Python project

Project layout:

```
calculator/
├── calc.py
├── test_calc.py
├── requirements.txt      # pytest
└── .github/workflows/tests.yml
```

`calc.py` and its test:

```try-python
def vat(amount, rate=0.16):
    return round(amount * rate, 2)

def test_vat():
    assert vat(1000) == 160.0
    assert vat(250, 0.08) == 20.0

test_vat()
print("tests passed")
```

The workflow:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: pip install -r requirements.txt
      - run: pytest -q
```

The **matrix** runs the tests on two Python versions in parallel.

## Testing a JavaScript project

```yaml
name: Node tests
on: [push, pull_request]
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

`npm ci` installs exactly what's in `package-lock.json`, which keeps builds repeatable.

## Status checks and branch protection

When a workflow runs on a pull request, GitHub shows ✅ or ❌ next to it. To **require** passing checks before merging:

Repository → **Settings → Branches (or Rules → Rulesets)** → add a rule for `main`:
- Require a pull request before merging (and optionally approvals)
- Require status checks to pass (select your workflow job)
- Block force pushes

Now nobody, including you, can merge broken code into `main` by accident.

## Secrets in Actions

Deployments need passwords or API keys. Never put them in the YAML. Add them in **Settings → Secrets and variables → Actions**, then use them:

```yaml
- name: Deploy over SSH
  run: ./deploy.sh
  env:
    SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
```

GitHub hides secret values in logs. Workflows triggered from forks don't get your secrets by default, which protects you from malicious pull requests.

## Scheduled and manual workflows

```yaml
on:
  schedule:
    - cron: "0 5 * * 1"     # every Monday 05:00 UTC (08:00 in Kenya)
  workflow_dispatch:         # adds a "Run workflow" button
```

Useful for nightly tests, checking for broken links, or generating reports.

## Continuous deployment

After tests pass, a job can deploy: to GitHub Pages (see the Pages lesson), to a server over SSH, or to Netlify/Vercel/Cloudflare. Use `needs:` so deploy runs only when tests succeed:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "deploying..."
```

## Costs and limits

- Public repositories get free standard runner minutes.
- Private repositories get a monthly allowance of free minutes on free plans, then paid usage (check GitHub's current pricing).
- Keep workflows fast: cache dependencies, run only what's needed, cancel outdated runs.

## Security tips

- Pin third-party actions to a version (`@v4`) or a full commit hash for sensitive workflows.
- Give workflows the minimum `permissions:` they need.
- Review workflows in pull requests from outsiders carefully.

:::think A teammate's pull request shows a red ❌ from the Tests workflow, but they say "the code works on my laptop". What should the team do?
Open the Actions log to see which test failed and why (often a missing dependency, an environment difference or a real bug). Fix the code or the test on the branch and push; the workflow re-runs automatically. Don't merge or disable the check until it's green.
:::

## Summary

- CI runs tests automatically on each push/PR; CD deploys automatically after tests pass.
- Workflows are YAML files in `.github/workflows/`, triggered by events, made of jobs and steps on runners.
- Use setup actions for Python/Node, matrices for multiple versions, and `npm ci`/`pip install -r` for repeatable installs.
- Protect `main` with required status checks; store credentials in Actions secrets.
- Use `needs:` and conditions to deploy only after tests pass on main.

```quiz
Q: In which folder do GitHub Actions workflow files live? (path)
A: .github/workflows | .github/workflows/
Q: What does CI stand for?
A: Continuous Integration
Q: Which key makes a job wait for another job to succeed?
A: needs | needs:
Q: Should you write API keys directly in the workflow YAML? (yes/no)
A: no
Q: Which action downloads your repository code into the runner? (e.g. actions/...)
A: actions/checkout | checkout | actions/checkout@v4
Q: YAML indentation must use spaces or tabs?
A: spaces
```
