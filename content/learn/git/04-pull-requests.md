---
slug: pull-requests-teamwork
title: Pull requests, forks and working in a team
after: github
---
# Pull requests, forks and working in a team

On real projects nobody pushes straight to `main`. Changes go through a **pull request (PR)**: a proposal that teammates review before it's merged. It catches bugs, spreads knowledge and keeps the main branch working.

## The team workflow (GitHub Flow)

1. **Pull** the latest main: `git switch main && git pull`
2. **Branch** for your task: `git switch -c feature/receipt-pdf`
3. **Commit** small, clear changes.
4. **Push** the branch: `git push -u origin feature/receipt-pdf`
5. **Open a pull request** on GitHub (a yellow banner offers "Compare & pull request").
6. **Review**: teammates comment, you push fixes to the same branch (the PR updates itself).
7. **Checks pass** (tests, linting) and someone **approves**.
8. **Merge** the PR, then delete the branch.
9. Everyone pulls the new `main`.

## Writing a good pull request

**Title:** `Add PDF download for receipts`

**Description:**

```
## What
Adds a "Download PDF" button on each receipt in the client portal.

## Why
Clients asked for receipts they can forward to their accountant.

## How to test
1. Log in as a client with a paid invoice.
2. Open Payments → click "Download PDF".
3. The PDF shows the M-Pesa code, date and amount.

## Screenshots
(before / after)
```

Keep PRs **small** (under ~300 lines changed if possible). Big PRs get slow, shallow reviews.

## Reviewing someone else's PR

- Read the description first: what problem is it solving?
- Look at the **Files changed** tab; click a line to comment.
- Check: does it work? Is it readable? Any security problem (passwords in code, unchecked input)? Tests?
- Be kind and specific: "Could we name this `formatKsh` so it's clear it's for money?" beats "bad name".
- Finish with **Approve**, **Comment** or **Request changes**.

## Merge options on GitHub

| Option | Result |
|---|---|
| **Merge commit** | Keeps every commit plus a merge commit |
| **Squash and merge** | Combines the PR into **one** tidy commit on main (popular) |
| **Rebase and merge** | Replays the commits on top of main, no merge commit |

## Forks: contributing to other people's projects

You can't push to a repository you don't own. Instead:

1. Click **Fork** on GitHub: you get your own copy.
2. Clone **your fork**, branch, commit, push.
3. Open a PR from your fork to the original ("upstream") repository.

Keep your fork updated:

```bash
git remote add upstream https://github.com/original-owner/project.git
git fetch upstream
git switch main
git merge upstream/main
git push
```

This is how open-source works, and contributing (even documentation fixes) is a great way to build a portfolio employers trust.

## Issues and project boards

- **Issues** track bugs and tasks. Mention one in a commit or PR with `Fixes #12` and GitHub closes it automatically when merged.
- **Projects** boards (To do → In progress → Done) organise the team's work.
- **Protected branches** (Settings → Branches) can require reviews and passing checks before merging to main.

## GitHub Actions in one sentence

A file in `.github/workflows/` can run your tests automatically on every push and PR, so broken code is caught before merging.

```quiz
Q: What do you open on GitHub to ask for your branch to be reviewed and merged? (two words)
A: pull request | PR | a pull request
Q: What is your own copy of someone else's repository on GitHub called?
A: fork | a fork
Q: Which merge option combines a whole PR into one commit? (three words)
A: squash and merge | squash
Q: What words in a PR description close issue 12 automatically? (two words)
A: Fixes #12 | Closes #12 | Resolves #12
Q: What is the original repository you forked usually called as a remote?
A: upstream
```
