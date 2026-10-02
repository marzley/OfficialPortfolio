---
slug: undo-and-rescue
title: "Undo mistakes safely: restore, amend, revert, reset, reflog and recovering lost work"
after: KEEP
---
# Undo mistakes safely: restore, amend, revert, reset, reflog and recovering lost work

Everyone makes mistakes with Git: committing to the wrong branch, a typo in a commit message, deleting a file, committing a password, or "breaking everything". The good news is that Git almost never loses committed work, and there's an undo for nearly every situation. The key is choosing the **right** undo: some are safe on shared branches, others rewrite history and can hurt your team.

This unit is a rescue guide: find your situation, apply the fix.

:::note What you will learn
- Discarding uncommitted changes (`git restore`)
- Unstaging files
- Fixing the last commit (`--amend`)
- Undoing a pushed commit safely (`git revert`)
- Moving a branch back (`git reset` soft, mixed, hard)
- Recovering "lost" commits with `git reflog`
- Moving commits to the right branch
- Removing secrets from a repository
- Golden rules for shared branches
:::

## Quick decision table

| Situation | Command |
|---|---|
| Throw away changes to a file (not committed) | `git restore file` |
| Unstage a file (keep changes) | `git restore --staged file` |
| Fix the last commit's message or add a forgotten file (not pushed) | `git commit --amend` |
| Undo a commit that's already pushed/shared | `git revert <hash>` |
| Undo local commits but keep the changes | `git reset --soft HEAD~1` or `git reset HEAD~1` |
| Completely discard local commits and changes | `git reset --hard <hash>` (careful!) |
| Find a commit you "lost" after a reset | `git reflog` |
| Get one file back from an old commit | `git restore --source <hash> file` |

`HEAD~1` means "one commit before HEAD"; `HEAD~3` is three back.

## 1. Discard uncommitted changes

You edited `index.html` and want the last committed version back:

```bash
git restore index.html
```

All files: `git restore .`

:::warning No undo for this one
Uncommitted changes discarded with `restore` (or `reset --hard`) are gone; Git never saved them. Commit or stash first if you might want them.
:::

Delete untracked files (new files never added): `git clean -n` to preview, `git clean -fd` to delete.

## 2. Unstage

```bash
git add .
# oops, I didn't want notes.txt in this commit
git restore --staged notes.txt
```

## 3. Fix the last commit (amend)

Typo in the message:

```bash
git commit --amend -m "Add contact form validation"
```

Forgot a file:

```bash
git add forgotten.css
git commit --amend --no-edit
```

`--amend` **replaces** the last commit with a new one (new hash). Only amend commits you haven't pushed; if you already pushed, prefer a new commit.

## 4. Undo a pushed commit: revert

`git revert` creates a **new commit** that does the opposite of an old one. History is kept, so it's safe on shared branches:

```bash
git log --oneline
# a1b2c3d Change prices (this broke the checkout)
git revert a1b2c3d
git push
```

To revert a merge commit you must say which parent to keep: `git revert -m 1 <merge-hash>`.

## 5. Reset: move the branch back

`git reset` moves the current branch label to an older commit. Three modes:

| Mode | Commits after the target | Changes in those commits |
|---|---|---|
| `--soft` | Removed from branch | Kept, **staged** |
| `--mixed` (default) | Removed from branch | Kept, **unstaged** in your files |
| `--hard` | Removed from branch | **Discarded** (files match the target) |

```bash
git reset --soft HEAD~1     # undo last commit, keep everything staged (re-commit differently)
git reset HEAD~2            # undo last 2 commits, keep changes in files
git reset --hard HEAD~1     # throw away the last commit and its changes
git reset --hard origin/main  # make local main exactly match GitHub
```

Use reset only on commits that **haven't been pushed** (or on your own branch nobody else uses).

## 6. The safety net: reflog

Git keeps a log of where HEAD has been, even after resets and branch deletions (for around 90 days by default):

```bash
git reflog
```

```
9c8d7e6 HEAD@{0}: reset: moving to HEAD~1
4f5e6d7 HEAD@{1}: commit: Add gallery page      <- the "lost" commit
9c8d7e6 HEAD@{2}: commit: Add intro paragraph
```

Recover it:

```bash
git reset --hard 4f5e6d7          # move back to it
# or keep current state and create a branch at the lost commit:
git branch rescue 4f5e6d7
```

The reflog is local only: it isn't on GitHub.

## 7. Committed to the wrong branch

You made two commits on `main` that belong on a feature branch (not pushed yet):

```bash
git branch feature/gallery       # new branch label at the current commit (keeps the commits)
git reset --hard HEAD~2          # move main back two commits
git switch feature/gallery       # your commits are here
```

To copy a single commit to another branch: `git cherry-pick <hash>` while on the target branch.

## 8. Get an old version of one file

```bash
git log --oneline -- index.html               # commits that changed it
git restore --source 3f2a1bc index.html       # bring back that version
git commit -am "Restore old home page layout"
```

Browse an old state without changing anything: `git switch --detach 3f2a1bc` (return with `git switch main`).

## 9. You committed a secret

Passwords, API keys, M-Pesa consumer secrets, `.env` files:

1. **Revoke/rotate the secret immediately** (generate a new key in the provider's dashboard). Assume it's compromised: bots scan GitHub for keys within minutes.
2. Remove the file and add it to `.gitignore`.
3. If it was pushed, removing it in a new commit doesn't erase it from history. Use a history-rewriting tool such as `git filter-repo` or BFG Repo-Cleaner, then force-push, and ask collaborators to re-clone. GitHub's documentation on removing sensitive data explains the steps.
4. Enable GitHub's **secret scanning** and **push protection** where available.

Prevention: keep secrets in environment variables or config files outside the repo, and add them to `.gitignore` before the first commit.

## Golden rules

1. **Don't rewrite shared history**: no `reset`, `--amend` or rebase on commits others have pulled. Use `revert` instead.
2. **Never `git push --force` to main**. If you must force-push your own branch, use `git push --force-with-lease`, which refuses if someone else pushed.
3. Commit often: committed work can almost always be recovered.
4. Before risky operations, create a backup branch: `git branch backup-before-reset`.
5. Read `git status` before and after every undo.

:::think You pushed a commit to main that broke the live website. A teammate has already pulled it. Should you use git reset --hard and force-push, or git revert? Why?
Use `git revert <hash>` and push. It adds a new commit undoing the change without rewriting history, so your teammate's copy stays consistent. Reset + force-push would rewrite shared history and cause confusion or lost work for them.
:::

## Summary

- `git restore` discards uncommitted changes; `--staged` unstages.
- `git commit --amend` fixes the last unpushed commit.
- `git revert` safely undoes pushed commits by adding an opposite commit.
- `git reset --soft/--mixed/--hard` moves the branch back; use it only on unpushed work.
- `git reflog` finds "lost" commits; `cherry-pick` copies commits; rotate any leaked secret immediately.

```quiz
Q: Which command safely undoes a commit that has already been pushed? (two words)
A: git revert
Q: Which command shows where HEAD has been, so you can find lost commits? (two words)
A: git reflog
Q: Which reset mode discards changes completely? (one word, without dashes)
A: hard | --hard
Q: Which reset mode keeps the changes staged?
A: soft | --soft
Q: You committed an API key and pushed it. What is the first thing to do?
A: revoke it | rotate it | revoke the key | rotate the key | revoke | rotate
Q: Which safer force-push option refuses if someone else has pushed?
A: --force-with-lease | force-with-lease
```
