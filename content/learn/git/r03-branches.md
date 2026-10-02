---
slug: branches
title: "Branches and merging: working on features safely, switching, fast-forward and merge commits"
after: KEEP
---
# Branches and merging: working on features safely, switching, fast-forward and merge commits

A **branch** is a separate line of work. Your `main` branch holds the working, stable version of the project. When you start something new (a login page, an M-Pesa integration, a redesign) you create a branch, make commits there, and only merge back into `main` when it works. If the experiment fails, you delete the branch and `main` was never touched.

Branches are cheap and fast in Git, so professionals create them for every task, even a 10-minute fix.

:::note What you will learn
- What a branch really is (a pointer to a commit)
- Creating, listing, switching and renaming branches
- Working on two branches and seeing them diverge
- Merging: fast-forward vs merge commit
- Deleting branches
- Branch naming conventions
- Popular branching workflows used by teams
- Stashing unfinished work
:::

## What is a branch, really?

A branch is just a **movable label pointing to a commit**. When you commit on a branch, the label moves forward to the new commit. `HEAD` points to the branch you're currently on.

```
          C---D   feature/contact  (HEAD)
         /
A---B---E         main
```

Here `main` and `feature/contact` share history up to B, then each has its own commits.

## Creating and switching

```bash
git branch                       # list branches; * marks the current one
git branch feature/contact       # create a branch (stay where you are)
git switch feature/contact       # move to it
git switch -c feature/gallery    # create AND switch in one step
git switch main                  # go back to main
```

Older tutorials use `git checkout feature/contact` and `git checkout -b feature/gallery`. Those still work; `switch` is the newer, clearer command.

When you switch branches, Git changes the files in your folder to match that branch. Commit (or stash) your changes before switching so nothing gets mixed up.

## A full example

```bash
git switch -c feature/contact
# create contact.html
git add contact.html
git commit -m "Add contact page"
# edit contact.html to add a form
git commit -am "Add contact form"     # -a stages modified tracked files automatically

git switch main
ls                                     # contact.html isn't here: it only exists on the branch
```

Meanwhile, someone fixes a typo on main:

```bash
git switch main
# fix the typo in index.html
git commit -am "Fix typo in heading"
git log --oneline --graph --all
```

```
* 7e1f2a0 (HEAD -> main) Fix typo in heading
| * 4b9c8d1 (feature/contact) Add contact form
| * 2a3b4c5 Add contact page
|/
* 9c8d7e6 Add intro paragraph and basic styles
```

## Merging

To bring the feature into main, switch to the branch that should **receive** the changes, then merge:

```bash
git switch main
git merge feature/contact
```

### Fast-forward merge

If main has **no new commits** since the branch was created, Git simply moves the main label forward. No new commit is made:

```
Before:  A---B (main)
              \
               C---D (feature)

After:   A---B---C---D (main, feature)
```

### Merge commit (three-way merge)

If both branches have new commits, Git combines them and creates a **merge commit** with two parents:

```
A---B---E-------M (main)
     \         /
      C-------D (feature)
```

Git opens an editor for the merge message (save and close to accept the default). If both branches changed the same lines, you get a **merge conflict**, covered in the next lesson.

To always create a merge commit (some teams like it for a clear history): `git merge --no-ff feature/contact`.

## Deleting branches

After merging, delete the branch label (the commits stay in main's history):

```bash
git branch -d feature/contact       # safe: refuses if not merged
git branch -D experiment            # force delete an unmerged branch (its commits are abandoned)
```

Rename a branch: `git branch -m old-name new-name`.

## Naming conventions

| Prefix | Use | Example |
|---|---|---|
| `feature/` | New functionality | `feature/mpesa-checkout` |
| `fix/` or `bugfix/` | Bug fixes | `fix/menu-overlap` |
| `hotfix/` | Urgent production fixes | `hotfix/payment-timeout` |
| `docs/` | Documentation | `docs/setup-guide` |
| `chore/` | Maintenance | `chore/update-dependencies` |

Use lowercase and hyphens; many teams include a ticket number: `feature/123-login-page`.

## Team workflows

| Workflow | How it works | Used by |
|---|---|---|
| **GitHub Flow** | `main` is always deployable; every change is a short branch + pull request | Most web teams and startups |
| **Trunk-based development** | Very short branches (hours), merged to main daily, features hidden behind flags | Fast-moving teams with good automated tests |
| **Git Flow** | `main` + `develop` + feature/release/hotfix branches | Software with scheduled releases |

Start with GitHub Flow: it's simple and widely used.

## Stashing unfinished work

You're halfway through a feature when an urgent bug comes in. Instead of committing half-done work:

```bash
git stash                 # save uncommitted changes and clean the folder
git switch main
git switch -c hotfix/login
# fix, commit, merge...
git switch feature/gallery
git stash pop             # bring the saved changes back
git stash list            # see saved stashes
```

## Practice task

1. In your practice repo, create `feature/about`, add `about.html`, commit twice.
2. Switch to main and make a different commit.
3. View `git log --oneline --graph --all`.
4. Merge the feature into main (you'll get a merge commit).
5. Delete the feature branch.

:::think You're on `main` and you run `git merge feature/x`. Which branch changes: main or feature/x?
`main` changes: it receives the commits from feature/x. You always switch to the branch that should receive the work, then merge the other branch into it. feature/x is unchanged.
:::

## Summary

- A branch is a movable pointer to a commit; HEAD marks where you are.
- `git switch -c name` creates and switches; `git branch` lists; commit or stash before switching.
- `git merge other` brings other's commits into the current branch: fast-forward if no divergence, otherwise a merge commit.
- Delete merged branches with `git branch -d`; name branches with prefixes like `feature/` and `fix/`.
- GitHub Flow (short branches + pull requests) is a simple team workflow; `git stash` saves unfinished work.

```quiz
Q: Which command creates a new branch and switches to it? (three words, e.g. git ... ...)
A: git switch -c | git checkout -b
Q: A merge where Git just moves the branch label forward is called what? (hyphenated)
A: fast-forward | fast forward
Q: Which command safely deletes a merged branch named old? (four words)
A: git branch -d old
Q: Which command temporarily saves uncommitted changes? (two words)
A: git stash
Q: To merge feature/x into main, which branch should you be on?
A: main
```
