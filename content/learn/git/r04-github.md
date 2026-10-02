---
slug: github
title: "GitHub: remotes, push, pull, clone, SSH keys, tokens and a profile that gets you hired"
after: KEEP
---
# GitHub: remotes, push, pull, clone, SSH keys, tokens and a profile that gets you hired

So far your repository lives only on your computer. **GitHub** puts it online: a backup if your laptop is stolen, a place to collaborate, and a public portfolio employers and clients can see. In this unit you'll connect a local repo to GitHub, push and pull changes, clone projects, set up secure authentication, and polish your GitHub profile.

:::note What you will learn
- Creating a repository on GitHub
- Remotes: `origin`, `git remote add`, `git remote -v`
- Pushing your work (`git push -u`)
- Cloning existing repositories
- Fetch vs pull, and keeping in sync with a team
- Authentication: HTTPS with personal access tokens, or SSH keys
- README files, licences and repository settings
- Building a profile that impresses employers
:::

## Step 1: Create a repository on GitHub

1. Sign in at github.com → **+** (top right) → **New repository**.
2. Name it (e.g. `my-website`), add a short description.
3. Choose **Public** (portfolio) or **Private**.
4. If you already have a local repo, **don't** tick "Add a README" (it avoids a first-push conflict).
5. Click **Create repository**. GitHub shows the commands to connect.

## Step 2: Connect your local repo (add a remote)

A **remote** is a named link to a copy of the repo elsewhere. The convention is to call your main one `origin`.

```bash
git remote add origin https://github.com/wanjiku-dev/my-website.git
git remote -v            # list remotes
```

## Step 3: Push

```bash
git push -u origin main
```

- `push` sends your commits to the remote.
- `-u` (upstream) remembers that local `main` tracks `origin/main`, so afterwards plain `git push` and `git pull` work.

Refresh the GitHub page: your files and commit history are online.

## Authentication

GitHub no longer accepts your account password for Git operations. Choose one:

### Option A: HTTPS with a personal access token (PAT)

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate.
2. Give it access to the repositories you need, with an expiry date.
3. When Git asks for a password, paste the token. A credential manager (installed with Git for Windows; `gh auth login` with GitHub CLI) stores it securely.

### Option B: SSH keys (popular with developers)

```bash
ssh-keygen -t ed25519 -C "wanjiku@example.com"   # press Enter for the default file; set a passphrase
cat ~/.ssh/id_ed25519.pub                        # copy this PUBLIC key
```

GitHub → Settings → SSH and GPG keys → New SSH key → paste. Test:

```bash
ssh -T git@github.com
```

Then use SSH URLs: `git@github.com:wanjiku-dev/my-website.git`. Change an existing remote with `git remote set-url origin git@github.com:wanjiku-dev/my-website.git`.

:::warning Keep secrets secret
Never share your **private** key (`id_ed25519` without `.pub`) or a token. Never commit passwords, API keys, M-Pesa credentials or `.env` files to a repository, even a private one. If you do by mistake, revoke the key immediately: removing it in a later commit isn't enough because it stays in history.
:::

## Cloning: downloading a repository

```bash
git clone https://github.com/wanjiku-dev/my-website.git
cd my-website
```

Clone gives you the files, the full history, and an `origin` remote already set up. Clone into a different folder name: `git clone URL new-folder`.

## Staying in sync: fetch and pull

| Command | What it does |
|---|---|
| `git fetch` | Downloads new commits from the remote but doesn't change your files |
| `git pull` | `fetch` + merge the remote branch into your current branch |
| `git pull --rebase` | `fetch` + replay your local commits on top (a straight history) |

A safe daily routine:

```bash
git switch main
git pull                     # get the latest
git switch -c feature/faq    # start new work from up-to-date main
```

### "Rejected" pushes

```
! [rejected]  main -> main (fetch first)
```

Someone pushed commits you don't have. Run `git pull` (resolve any conflicts), then `git push` again. **Never** "fix" this with `git push --force` on a shared branch: it deletes your teammates' commits from the remote.

## Pushing branches

```bash
git switch -c feature/faq
# commit work...
git push -u origin feature/faq
```

GitHub then offers a button to open a **pull request** (covered in the pull requests lesson).

## README, licence and settings

A **README.md** is the front page of your repository. A good one has:

```markdown
# Mama Mboga Online Shop

A responsive online grocery shop with M-Pesa checkout, built with HTML, CSS, JavaScript and PHP.

![Screenshot](screenshot.png)

## Features
- Product search and categories
- Cart and M-Pesa STK push checkout (sandbox)
- Admin dashboard for orders

## Run it locally
1. Clone the repo
2. Copy `config.sample.php` to `config.php` and add your sandbox keys
3. Open with PHP's built-in server: `php -S localhost:8000`

## Live demo
https://wanjiku-dev.github.io/mama-mboga

## Author
Wanjiku Kamau – [LinkedIn](https://linkedin.com/in/...)
```

- Add a **licence** (MIT is common for open projects) so others know how they may use the code.
- Add **topics** (tags) and a website link in the repo's About section.

## A GitHub profile that gets you hired

1. **Profile README**: create a public repo named exactly like your username; its README shows on your profile. Introduce yourself, your skills and links.
2. **Pin 4–6 best projects** with clear READMEs, screenshots and live demos.
3. **Commit regularly**: the contribution graph shows consistent activity (quality matters more than green squares).
4. **Real projects beat tutorials**: a school fees tracker, a chama app, a booking site for a local business.
5. **Contribute to open source**: documentation fixes and small issues labelled "good first issue".
6. Use a professional photo, name, location (Nairobi, Kenya) and a link to your portfolio/LinkedIn.

:::think You cloned a team project yesterday. Today you made two commits and try `git push`, but it's rejected. What happened and what should you do?
A teammate pushed new commits to the remote since you cloned. Run `git pull` to fetch and merge their work (fix any conflicts and commit), then `git push`. Don't force-push, which would erase their commits from the remote.
:::

## Summary

- Create a repo on GitHub, connect it with `git remote add origin URL`, and publish with `git push -u origin main`.
- Authenticate with a personal access token (HTTPS) or SSH keys; never commit or share secrets.
- `git clone` downloads a repo with history; `git fetch` downloads, `git pull` downloads and merges.
- Rejected push → pull first; never force-push shared branches.
- A strong README and a polished profile with pinned real projects help you get hired.

```quiz
Q: What is the conventional name of the main remote?
A: origin
Q: Which command downloads a repository from GitHub to your computer? (two words)
A: git clone
Q: Which command downloads new commits without changing your files? (two words)
A: git fetch
Q: What does git pull do in addition to fetch?
A: merge | merges | merges the changes | merge into current branch
Q: Can you use your GitHub account password for git push over HTTPS today? (yes/no)
A: no
Q: Which file is the front page of a repository?
A: README.md | README | readme
```
