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
```
