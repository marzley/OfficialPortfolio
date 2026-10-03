---
slug: merge-conflicts
title: Merging, merge conflicts and rebasing
after: branches
---
# Merging, merge conflicts and rebasing

Branches let you work on features separately. Sooner or later you bring them back together. Usually Git merges automatically; sometimes two changes touch the same lines and Git asks you to decide. That's a **merge conflict**, and it's normal, not scary.

## A normal merge

```bash
git switch main
git merge feature/contact-form
```

Two kinds of result:

- **Fast-forward**: `main` hadn't changed, so Git simply moves `main` forward. No new commit.
- **Merge commit**: both branches had new commits, so Git creates a commit that joins them.

```
          A---B  feature
         /     \
    C---D---E---M  main    (M = merge commit)
```

## When a conflict happens

You and a teammate both changed the same line of `index.html`:

```bash
git merge feature/new-prices
# Auto-merging index.html
# CONFLICT (content): Merge conflict in index.html
# Automatic merge failed; fix conflicts and then commit the result.
```

Open the file. Git has marked the conflict:

```
<p class="price">
<<<<<<< HEAD
  Starting from KSh 15,000
=======
  Starting from KSh 18,000
>>>>>>> feature/new-prices
</p>
```

| Marker | Means |
|---|---|
| `<<<<<<< HEAD` | Start of **your** current branch's version |
| `=======` | Divider |
| `>>>>>>> feature/new-prices` | End of the **incoming** branch's version |

## Resolving it

1. Decide what the final content should be: yours, theirs, or a mix.
2. **Delete all three marker lines.**
3. Save, then stage and commit:

```
<p class="price">
  Starting from KSh 18,000
</p>
```

```bash
git add index.html
git commit          # Git suggests a message like "Merge branch 'feature/new-prices'"
```

VS Code makes this easy: above each conflict it shows **Accept Current**, **Accept Incoming**, **Accept Both** and **Compare**.

Changed your mind mid-merge?

```bash
git merge --abort      # go back to before the merge
```

## Avoiding painful conflicts

- **Pull often**: `git pull` at the start of each day.
- Keep branches **short-lived**: merge within days, not months.
- Make **small, focused commits**.
- Talk to your team about who's editing which file.
- Don't reformat a whole file (e.g. changing indentation) in the same commit as real changes.

## Rebasing (an alternative to merging)

`rebase` replays your branch's commits on top of the latest `main`, giving a straight history without merge commits:

```bash
git switch feature/receipts
git rebase main
# fix any conflicts, then:  git add <file>  and  git rebase --continue
```

```
Before:    C---D---E  main          After:   C---D---E  main
                \                                       \
                 A---B  feature                          A'---B'  feature
```

**The golden rule:** never rebase commits you've already pushed and others are using. Rebasing rewrites history; it's for tidying your **own local** work. When in doubt, merge.

## Useful commands

```bash
git branch --merged            # branches already merged into this one (safe to delete)
git branch -d feature/old      # delete a merged branch
git log --oneline --graph      # see how branches joined
git cherry-pick a1b2c3d        # copy one commit onto this branch
git stash                      # park uncommitted changes to switch branches quickly
git stash pop                  # bring them back
```

## Why branching and merging matter

Branches let several people (or several features) move forward at the same time without stepping on each other: one developer builds M-Pesa payments, another fixes the login page, and the live site keeps running on `main`. Merging brings the work back together. Conflicts are a normal part of teamwork, not a disaster; knowing how to resolve them calmly is a key skill for any developer working in a team or contributing to open source.

## Branch basics in practice

```bash
git switch -c feature/mpesa-checkout     # create and switch to a new branch
# ...edit files, commit...
git switch main                          # back to main
git branch                               # list local branches (* marks the current one)
git branch -a                            # include remote branches
git branch -d feature/mpesa-checkout     # delete after merging
git push origin --delete feature/old     # delete a remote branch
```

Use descriptive names: `feature/booking-form`, `fix/vat-rounding`, `docs/readme-setup`.

## Keeping your branch up to date

While you work on a feature, `main` moves forward with other people's work. Bring those changes into your branch regularly to keep conflicts small:

```bash
git switch main
git pull                                 # get the latest main
git switch feature/booking-form
git merge main                           # bring main's changes into your branch
# or, if your team prefers a linear history and the branch is only yours:
git rebase main
```

The longer a branch lives without syncing, the bigger and harder the eventual conflicts.

## Resolving a conflict step by step

Suppose both you and a teammate changed the same line in `pricing.html`:

```
<<<<<<< HEAD
<p>Starter website: KSh 15,000</p>
=======
<p>Starter website: KSh 18,000 (includes hosting)</p>
>>>>>>> feature/new-prices
```

1. Run `git status` to see which files have conflicts ("both modified").
2. Open each file; find the markers `<<<<<<<`, `=======`, `>>>>>>>`.
3. Decide the correct final content. Sometimes it's one side, sometimes a combination. Talk to your teammate if unsure.
4. Delete the markers so only the final content remains.
5. `git add pricing.html`, then `git commit` (for a merge) or `git rebase --continue` (for a rebase).
6. Run the site or tests to make sure everything still works.

VS Code highlights conflicts with buttons: **Accept Current**, **Accept Incoming**, **Accept Both**, and a merge editor that shows both versions side by side.

## Useful conflict tools

```bash
git diff --name-only --diff-filter=U     # list files still in conflict
git checkout --ours pricing.html         # take your version of the whole file (during a merge)
git checkout --theirs pricing.html       # take the other branch's version
git merge --abort                        # give up and return to before the merge
git rebase --abort                       # give up a rebase
git log --merge -p pricing.html          # commits on both sides touching the file
```

Note: during a rebase, "ours" and "theirs" are swapped compared with a merge, which confuses many people. When unsure, edit the file manually.

## Merge vs rebase vs squash

| Method | History looks like | Good for | Caution |
|---|---|---|---|
| Merge commit | Branch lines join with a merge commit | Shared branches; keeps full history | Busier history |
| Rebase | Straight line, as if work happened in order | Cleaning up your own branch before a PR | Never rebase commits others already have |
| Squash merge | One commit per feature on main | Tidy main branch on GitHub PRs | Individual commits of the branch are combined |

Follow your team's convention; consistency matters more than the choice.

## Interactive rebase: tidy your own commits

Before opening a pull request, you can combine "WIP" and "fix typo" commits:

```bash
git rebase -i HEAD~4       # edit the last 4 commits
# in the editor: change "pick" to "squash" (or "s") for commits to combine, "reword" to edit messages
```

Only do this on commits that haven't been shared, or on your own feature branch when your team allows force-pushing it (`git push --force-with-lease`, which refuses to overwrite others' new work).

## Stash: put work aside temporarily

```bash
git stash push -m "half-done header"     # save uncommitted changes and clean the working folder
git switch main                          # handle an urgent fix
git switch feature/header
git stash list
git stash pop                            # bring the changes back
```

## Cherry-pick: copy one commit to another branch

```bash
git switch main
git cherry-pick a1b2c3d       # apply that single commit (e.g. an urgent fix) onto main
```

## Preventing conflicts in teams

- Pull/sync often; keep branches short-lived (days, not weeks).
- Make small pull requests focused on one change.
- Agree on code formatting (Prettier, Black) so formatting differences don't create conflicts.
- Split big files into smaller modules so people work in different files.
- Communicate: tell teammates when you're about to change a shared file heavily.

## Practice

1. Create two branches from main that change the same line of a file differently, merge one, then merge the other and resolve the conflict.
2. Repeat using rebase instead, and notice the different history in `git log --graph`.
3. Use `git stash` to switch branches with uncommitted work.
4. Squash three small commits into one with interactive rebase on a practice branch.
5. Cherry-pick a fix commit from a feature branch onto main.

:::think Your teammate rebased a shared branch and force-pushed. Now your `git pull` shows strange conflicts with commits you already have. What happened, and how could the team avoid it?
The rebase rewrote commits that you already had, creating new commit IDs, so your copy and the remote have different histories for the same work. Teams avoid this by never rebasing shared branches (only private feature branches), using `--force-with-lease`, or using merge commits for shared work.
:::

```quiz
Q: Which marker starts your own version in a conflict?
A: <<<<<<< HEAD | <<<<<<< | HEAD
Q: After fixing a conflict in index.html, which command stages it?
A: git add index.html | git add
Q: Which command cancels a merge in progress?
A: git merge --abort
Q: What kind of merge just moves the branch pointer forward with no new commit? (two words, hyphen allowed)
A: fast-forward | fast forward
Q: Should you rebase commits that others are already using? (yes or no)
A: no
Q: Which command temporarily saves uncommitted changes so you can switch branches?
A: git stash | stash
Q: Which command copies one specific commit onto the current branch?
A: git cherry-pick | cherry-pick
Q: Which safer force-push option refuses to overwrite others' new commits?
A: --force-with-lease | force-with-lease
Q: Which command creates and switches to a new branch? (git switch ...)
A: git switch -c | switch -c
```
