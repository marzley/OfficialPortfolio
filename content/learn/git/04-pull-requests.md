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

## Why pull requests matter

Pull requests (PRs) are how professional teams change code safely: someone proposes a change, others review it, automated tests run, and only then is it merged into the main branch. PRs catch bugs early, spread knowledge across the team, and keep a record of why each change was made. They're also how you contribute to open-source projects, which is a great way to build experience and a public track record when looking for your first developer job.

## The life of a pull request

```
1. Create a branch          git switch -c fix/phone-validation
2. Commit small changes     git commit -m "fix: accept 01 numbers in phone validation"
3. Push the branch          git push -u origin fix/phone-validation
4. Open a PR on GitHub      base: main  ←  compare: fix/phone-validation
5. Automated checks run     tests, linting (GitHub Actions)
6. Reviewers comment        questions, suggestions, approvals
7. You push fixes           the PR updates automatically
8. Merge                    squash, merge commit or rebase
9. Delete the branch        keep the repository tidy
```

## A PR description template

```markdown
## What
Phone validation now accepts numbers starting with 01 as well as 07.

## Why
Customers with newer Safaricom and Airtel numbers (01...) couldn't check out. Closes #57.

## How to test
1. Go to /checkout
2. Enter 0112345678 → should be accepted
3. Enter 0812345678 → should show an error

## Screenshots
(before / after)

## Notes
No database changes.
```

Teams often add this as `.github/pull_request_template.md` so every PR starts with the same headings.

## Draft PRs and early feedback

Open a **draft pull request** when work isn't finished but you want early feedback on the approach. Reviewers can comment before you invest more time. Mark it "Ready for review" when done.

## Reviewing code: what to look for

| Area | Questions |
|---|---|
| Correctness | Does it do what the PR says? Edge cases (empty input, 0, very large values)? |
| Security | User input validated? Secrets kept out of code? SQL queries parameterised? |
| Readability | Clear names, small functions, comments where logic is tricky? |
| Tests | Are there tests for the new behaviour? Do existing tests pass? |
| Performance | Any loops over large data, repeated database queries in a loop? |
| User experience | Error messages clear? Works on mobile? Accessible? |

## Giving and receiving feedback

| Unhelpful review comment | Helpful review comment |
|---|---|
| "This is wrong." | "If `amount` is a string here, `amount > 0` compares text. Could we convert with `Number()` first?" |
| "Bad naming." | "Maybe `calculateDeliveryFee` instead of `calc2`, so it's clear what it returns?" |
| "Why?" | "Could you explain why we retry 10 times? I worry about duplicate STK prompts." |

Use GitHub's **suggestion** feature to propose exact code changes the author can accept with one click. As an author, don't take comments personally: reviewers are improving the code, not judging you. Reply to every comment, push fixes, and thank reviewers.

## Protected branches and required checks

Repository settings → Branches → add a **branch protection rule** (or ruleset) for `main`:

- Require pull requests before merging (no direct pushes).
- Require at least one approval.
- Require status checks (tests) to pass.
- Require branches to be up to date before merging.
- Restrict who can push or bypass.

This prevents accidental breaking changes on the live branch.

## CODEOWNERS

A `.github/CODEOWNERS` file automatically requests reviews from the right people:

```
# Payments code must be reviewed by the payments team
/src/payments/  @yourorg/payments-team
*.sql           @db-lead
```

## Contributing to open source step by step

1. Find a project you use; look for issues labelled `good first issue` or `help wanted`.
2. Read `CONTRIBUTING.md` and the code of conduct.
3. Comment on the issue to say you'd like to work on it (avoid duplicate work).
4. Fork the repository, clone your fork, add the original as `upstream`:

```bash
git clone git@github.com:you/project.git
cd project
git remote add upstream https://github.com/original/project.git
git switch -c fix/typo-in-docs
# ...make changes, commit...
git push -u origin fix/typo-in-docs
```

5. Open a PR from your fork's branch to the original repository's main branch.
6. Keep your fork updated:

```bash
git fetch upstream
git switch main
git merge upstream/main
git push origin main
```

Documentation fixes, translations (including Kiswahili) and tests are great first contributions.

## Issues and project management

- Write issues with clear steps to reproduce bugs, expected vs actual behaviour, screenshots and environment details (browser, phone model).
- Use labels (`bug`, `enhancement`, `good first issue`), milestones and assignees.
- GitHub Projects boards (To do / In progress / Done) track work visually.
- Link PRs to issues with keywords like `Closes #57` so issues close automatically on merge.

## Practice

1. Create a repository, protect `main`, and practise merging only through PRs.
2. Add a pull request template and open a PR that follows it.
3. Review a friend's PR using at least one suggestion comment.
4. Fork an open-source project, fix a typo in its documentation and open a PR.
5. Keep your fork in sync with `upstream` after the original project gets new commits.

:::think A reviewer asks for many changes on your first PR to an open-source project. How should you respond?
Thank them, read each comment carefully, ask politely if something is unclear, make the requested changes in new commits on the same branch (the PR updates automatically), and reply to each comment saying what you changed. Detailed feedback means the maintainers are investing time in you; responding well builds your reputation in the community.
:::

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
Q: What kind of PR signals that work is unfinished but open for early feedback?
A: draft | draft pull request | draft PR
Q: Which file automatically requests reviews from specific people for certain paths?
A: CODEOWNERS
Q: Which GitHub label often marks issues suitable for newcomers? (three words)
A: good first issue
Q: Which repository setting stops direct pushes to main? (two words, e.g. branch ...)
A: branch protection | protected branch | protection rule
```
