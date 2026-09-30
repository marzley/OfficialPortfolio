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
```
