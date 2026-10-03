---
slug: gitignore-good-commits
title: .gitignore, good commit messages and viewing history
after: first-repo
---
# .gitignore, good commit messages and viewing history

A clean repository is easy to understand, safe to share and simple to fix. Three habits get you there.

## 1. Keep things out with .gitignore

Some files should **never** be committed:

- **Secrets**: passwords, API keys, M-Pesa credentials, `.env` files, config files with database passwords.
- **Generated files**: `node_modules/`, build folders, `__pycache__/`.
- **Personal/system files**: `.DS_Store`, `Thumbs.db`, editor settings.
- **Big files**: videos, database dumps, logs.

Create a file called `.gitignore` in the project's root folder:

```
# Secrets: never commit these
.env
config.php
mpesa-config.php
*.key

# Dependencies and builds
node_modules/
vendor/
dist/
__pycache__/

# Logs and system files
*.log
.DS_Store
Thumbs.db
.vscode/
```

| Pattern | Matches |
|---|---|
| `config.php` | That file anywhere |
| `/config.php` | Only in the root folder |
| `logs/` | Any folder called logs |
| `*.log` | Every file ending in .log |
| `!keep.log` | Exception: do include this one |

> Tip: commit a safe example instead, like `config.example.php` with empty values, so others know what to fill in.

### Oops, I already committed a secret

`.gitignore` only affects **untracked** files. If a file is already committed:

```bash
git rm --cached config.php       # stop tracking it (keeps your local copy)
echo "config.php" >> .gitignore
git commit -m "Stop tracking config.php"
```

The secret is **still in the history**, and if you pushed to GitHub, assume it's been seen. **Change the password or key immediately.** That's the only real fix.

## 2. Write good commit messages

A commit message explains **why** a change was made, for your future self and your team.

**Bad:** `update`, `fix`, `changes`, `asdf`

**Good:**

```
Add M-Pesa STK push to the checkout page

Customers can now pay from their phone without leaving the site.
The callback saves the receipt code on the order.
```

Rules that work:

1. A short **summary line** (about 50 characters), in the imperative: "Add", "Fix", "Remove" (as if giving an order: "this commit will... *Add* M-Pesa").
2. A blank line, then more detail if needed.
3. **One logical change per commit.** Don't mix "fix login bug" with "redesign footer".
4. Commit often: small commits are easier to review and undo.

Many teams use prefixes: `feat: add receipts page`, `fix: phone validation`, `docs: update README`.

## 3. Explore history

```bash
git log                           # full history
git log --oneline --graph --all   # compact, with branches drawn
git log -p index.html             # every change to one file
git log --author="Amina"
git log --since="2 weeks ago"
git show a1b2c3d                  # one commit in detail
git diff                          # unstaged changes
git diff --staged                 # what you're about to commit
git blame index.html              # who last changed each line, and when
```

## Tag releases

```bash
git tag -a v1.0 -m "First launch"
git push origin v1.0
```

Tags mark important points (a launch, a client handover) you can return to.

## A good README

Every repository should have a `README.md` explaining what the project is, how to run it and how to configure it (without real secrets). GitHub shows it on the repo's front page. See the Markdown example in our practice editor.

## Why commit habits matter

Your Git history is a diary of the project. Good commits make it easy to find when a bug appeared, understand why a change was made, undo one feature without losing others, and review a teammate's work. A clean history full of clear messages also impresses employers who look at your GitHub. A messy one ("update", "fix", "asdf") makes debugging and teamwork much harder. And a single committed password or API key can lead to a hacked server or a drained payment account.

## .gitignore for common project types

```gitignore
# Node.js / React / Vite
node_modules/
dist/
build/
.env
.env.*
!.env.example
npm-debug.log*

# Python
__pycache__/
*.pyc
.venv/
venv/

# PHP / Laravel
/vendor/
/storage/*.key
.env

# Flutter / Android
.dart_tool/
build/
*.jks
key.properties
local.properties

# Editors and OS
.vscode/
.idea/
.DS_Store
Thumbs.db
```

Patterns: `folder/` ignores a folder, `*.log` ignores by extension, `!file` makes an exception, and a leading `/` anchors to the repository root. GitHub's gitignore templates (github.com/github/gitignore) have ready lists for most languages.

Commit an `.env.example` with variable **names** but no real values, so teammates know which settings they need:

```
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
DATABASE_URL=
```

## Checking why a file is ignored (or not)

```bash
git check-ignore -v config/secret.php     # shows which .gitignore rule matches
git status --ignored                       # list ignored files
git rm --cached .env                       # stop tracking a file that was committed before being ignored
```

Adding a file to `.gitignore` doesn't remove it from Git if it was already committed; `git rm --cached` does (and the old version stays in history).

## Committed a secret? Act in this order

1. **Revoke/rotate the secret immediately**: generate a new API key, change the password, regenerate the M-Pesa Daraja credentials. Assume the old one is compromised the moment it was pushed (bots scan GitHub for keys within minutes).
2. Remove it from the code and move it to environment variables or a config file outside the repository.
3. Optionally clean history with tools like `git filter-repo` or BFG, then force-push and ask collaborators to re-clone. Cleaning history alone isn't enough; rotation is the real fix.
4. Turn on **secret scanning** and push protection in GitHub settings where available.

## Small, focused commits

| One big commit | Several small commits |
|---|---|
| "Update website" (40 files: header, payments, typo fixes, new page) | "Add M-Pesa payment button to checkout" |
| | "Fix typo on About page" |
| | "Add Services page with pricing table" |

Small commits are easier to review, revert and understand. Use `git add -p` to stage only some changes in a file:

```bash
git add -p index.html     # Git shows each change ("hunk") and asks: stage this? y/n/s(plit)
```

## Commit message format

```
Add M-Pesa STK push to checkout          ← summary: imperative, about 50 characters

Customers can now pay with an STK push instead of typing the till
number. The callback updates the order status to "paid".

Closes #42                               ← links and closes an issue
```

Many teams use **Conventional Commits** prefixes:

| Prefix | Use | Example |
|---|---|---|
| `feat:` | New feature | `feat: add booking calendar` |
| `fix:` | Bug fix | `fix: correct VAT rounding on invoices` |
| `docs:` | Documentation | `docs: add setup steps to README` |
| `style:` | Formatting only | `style: format CSS with Prettier` |
| `refactor:` | Code change without new behaviour | `refactor: split cart logic into module` |
| `test:` | Tests | `test: add tests for phone validation` |
| `chore:` | Maintenance | `chore: update dependencies` |

## Searching history like a detective

```bash
git log --oneline --graph --all          # visual history
git log -p index.html                    # every change to one file
git log --author="Wanjiru" --since="2 weeks ago"
git log -S "calculateVat"                # commits that added or removed this text
git log --grep="payment"                 # commits whose message mentions "payment"
git show a1b2c3d                         # what one commit changed
git blame checkout.js                    # who last changed each line, and in which commit
git bisect start                         # binary search for the commit that introduced a bug
```

`git bisect` asks you to mark commits as good or bad and finds the exact commit that broke something, even among hundreds.

## Tags and releases

```bash
git tag -a v1.0.0 -m "First public release"
git push origin v1.0.0
git tag                                  # list tags
```

**Semantic versioning** (`MAJOR.MINOR.PATCH`): increase PATCH for bug fixes (1.0.1), MINOR for new features (1.1.0), MAJOR for breaking changes (2.0.0). On GitHub, create a Release from a tag with notes describing changes.

## Writing a strong README

```markdown
# Duka Bora Online Shop

A mobile-friendly shop for a Nakuru grocery with WhatsApp ordering and M-Pesa payments.

![Screenshot](docs/screenshot.png)

## Features
- Product catalogue with search
- Cart and WhatsApp checkout
- Admin page to update prices

## Run locally
1. `git clone https://github.com/you/duka-bora.git`
2. `cp .env.example .env` and fill in the values
3. `npm install && npm run dev`

## Live demo
https://duka-bora.example.com

## Tech
HTML, CSS, JavaScript, PHP, MySQL
```

## Practice

1. Create a `.gitignore` for a Node project and check that `node_modules` and `.env` are ignored.
2. Make three small commits using Conventional Commit prefixes.
3. Use `git add -p` to commit only part of a file's changes.
4. Use `git log -S` to find when a function name first appeared.
5. Tag a release `v1.0.0` and push the tag.

:::think A developer pushes a Daraja consumer secret to a public repository, then deletes it in the next commit. Is the problem solved?
No. The secret remains in the Git history and may already have been copied by bots that scan GitHub. The developer must revoke and regenerate the credentials immediately, store the new ones outside the repository (environment variables), and optionally scrub the history. Deleting it in a later commit doesn't remove it from earlier commits.
:::

```quiz
Q: What is the name of the file that lists files Git should ignore?
A: .gitignore | gitignore
Q: Which pattern ignores every file ending in .log?
A: *.log
Q: A password was committed and pushed. What is the only real fix?
A: change the password | change it | rotate it | change the key | rotate the key
Q: Which command stops tracking a file but keeps your local copy?
A: git rm --cached | git rm --cached config.php
Q: Should a commit summary say "Added feature" or "Add feature"?
A: Add feature | add
Q: Which command shows who last changed each line of a file?
A: git blame | blame
Q: Which command binary-searches history to find the commit that introduced a bug?
A: git bisect | bisect
Q: In semantic versioning, which number increases for a bug fix: major, minor or patch?
A: patch
Q: Which Conventional Commit prefix marks a new feature?
A: feat | feat:
```
