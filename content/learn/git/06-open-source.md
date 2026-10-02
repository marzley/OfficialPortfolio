---
slug: issues-open-source
title: "Issues, project boards and contributing to open source: your first real contribution"
after: github-actions-ci
---
# Issues, project boards and contributing to open source: your first real contribution

Writing code is only part of software work. Teams also plan tasks, report bugs, discuss ideas and review each other's work, and on GitHub much of that happens in **Issues**, **Projects** and **Discussions**. **Open source** projects use the same tools in public, so anyone in the world (including you, from Kenya) can contribute. A merged contribution to a real project is one of the strongest items on a junior developer's CV.

:::note What you will learn
- GitHub Issues: writing good bug reports and feature requests
- Labels, assignees, milestones and linking issues to pull requests
- GitHub Projects boards for planning
- What open source is and how licences work
- Finding beginner-friendly projects
- The fork → branch → PR contribution workflow, step by step
- Etiquette, code of conduct and handling review feedback
:::

## Issues

An **issue** is a ticket: a bug, a task, a question or an idea. Each has a number (#42), a discussion thread, labels and an assignee.

### A good bug report

```markdown
**Title:** Checkout button does nothing on mobile Safari

**Steps to reproduce**
1. Open the shop on iPhone (Safari 17)
2. Add any product to the cart
3. Tap "Pay with M-Pesa"

**Expected:** The phone number form opens
**Actual:** Nothing happens; no error shown

**Screenshots:** (attach)
**Environment:** iOS 17.5, Safari; works on Chrome Android
```

A clear report gets fixed much faster than "checkout broken!!".

### A good feature request

Describe the **problem** first, then your proposed solution and alternatives: "Customers can't find products by price. Proposal: add a price filter (min/max) on the category page."

### Organising issues

| Tool | Use |
|---|---|
| **Labels** | `bug`, `enhancement`, `documentation`, `good first issue`, `help wanted` |
| **Assignees** | Who's working on it |
| **Milestones** | Group issues for a release or deadline ("Version 1.2", "Launch – Oct") |
| **Templates** | `.github/ISSUE_TEMPLATE/` files that pre-fill the right questions |

### Linking issues and pull requests

Write `Fixes #42` (or `Closes #42`) in a pull request description. When the PR is merged into the default branch, issue #42 closes automatically, and everyone can trace why the change was made.

## GitHub Projects

**Projects** are boards and tables for planning, like Trello but connected to your issues and PRs:
- Columns such as **Todo → In progress → In review → Done**
- Custom fields: priority, estimate, sprint
- Automatic movement when a PR is opened or merged

Even solo developers benefit: put every idea and bug for your portfolio project on a board.

## What is open source?

**Open-source software** publishes its source code under a licence that lets anyone use, study, change and share it. Examples you use daily: Linux, Android's core, Firefox, Python, WordPress, VS Code's base, and thousands of libraries.

| Licence | In short |
|---|---|
| **MIT / BSD** | Do almost anything; keep the copyright notice |
| **Apache 2.0** | Like MIT, plus patent protection terms |
| **GPL** | If you distribute modified versions, you must share the source under GPL too |

Code on GitHub with **no licence** isn't automatically free to reuse: by default the author keeps all rights.

## Why contribute?

- Real-world experience with professional codebases, reviews and CI
- Public proof of your skills for employers
- Mentorship and networking with developers worldwide
- Giving back to tools you use

You don't need to be an expert: documentation, translations (including Swahili), tests, bug reports and small fixes are valuable contributions.

## Finding a first project

- Search GitHub for issues labelled `good first issue` or `help wanted` in a language you know.
- Sites such as goodfirstissue.dev and up-for-grabs.net list beginner-friendly issues.
- Start with tools you use: a VS Code extension, a Python library, a documentation site.
- Join communities: local developer meetups, Python/JavaScript communities in Kenya, and events like Hacktoberfest (held each October).

Read the project's **README**, **CONTRIBUTING.md** and **CODE_OF_CONDUCT.md** first; they explain setup, style and how to submit changes.

## The contribution workflow

```bash
# 1. Fork the project on GitHub (Fork button), then clone YOUR fork
git clone https://github.com/you/awesome-project.git
cd awesome-project

# 2. Add the original project as "upstream" to stay up to date
git remote add upstream https://github.com/original-owner/awesome-project.git
git fetch upstream

# 3. Create a branch for your change from the latest upstream main
git switch -c fix/typo-in-install-docs upstream/main

# 4. Make the change, run the project's tests/linters, commit
git commit -am "Fix typo in installation guide"

# 5. Push to YOUR fork
git push -u origin fix/typo-in-install-docs
```

6. On GitHub, open a **pull request** from your branch to the original repository's main branch. Fill in the template: what you changed, why, and `Fixes #123` if it addresses an issue.
7. Respond to review comments by pushing more commits to the same branch; the PR updates automatically.

Keep your fork current later:

```bash
git switch main
git fetch upstream
git merge upstream/main
git push origin main
```

## Etiquette

- Comment on an issue before starting ("I'd like to work on this; is it still available?") to avoid duplicate work.
- Keep pull requests **small and focused**: one fix per PR.
- Follow the project's style and run its tests.
- Be patient: maintainers are often volunteers; a polite follow-up after a week or two is fine.
- Treat review feedback as learning, not criticism. Thank reviewers.
- Never submit AI-generated or copied code you don't understand, and never spam low-effort PRs (projects ban accounts for this).

:::think You found a typo in a popular library's documentation. You don't have write access to the repository. Describe the steps to get your fix merged.
Fork the repo, clone your fork, create a branch, fix the typo, commit with a clear message, push to your fork, then open a pull request to the original repository explaining the fix. Respond to any review feedback by pushing to the same branch.
:::

## Summary

- Issues track bugs, tasks and ideas; write clear reproduction steps and use labels, assignees and milestones.
- `Fixes #42` in a PR closes the issue on merge; Projects boards plan work.
- Open source shares code under licences like MIT, Apache and GPL; no licence means no reuse rights.
- Find `good first issue` tasks, read CONTRIBUTING.md, then fork → branch → commit → push → pull request.
- Keep PRs small, follow project style, respond kindly to reviews.

```quiz
Q: What phrase in a pull request closes issue 42 automatically when merged? (two words)
A: Fixes #42 | Closes #42 | Resolves #42
Q: Which label marks issues suited to newcomers? (three words)
A: good first issue
Q: What remote name is commonly used for the original project you forked?
A: upstream
Q: Is code on GitHub with no licence free for anyone to reuse? (yes/no)
A: no
Q: Which file usually explains how to contribute to a project?
A: CONTRIBUTING.md | CONTRIBUTING | contributing
```
