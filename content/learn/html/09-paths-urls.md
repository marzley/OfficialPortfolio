---
slug: file-paths-folders
title: "File paths and website folders: absolute, relative and root-relative links"
after: links-images
---
# File paths and website folders: absolute, relative and root-relative links

"My image doesn't show!" and "the link opens a 404!" are the two complaints every beginner has, and almost always the cause is a wrong **file path**. Once you understand paths, these problems disappear. This unit explains how websites are organised in folders and how to point links, images, CSS and scripts at the right file every time.

:::note What you will learn
- How to organise a website's files and folders
- Absolute URLs, relative paths and root-relative paths
- Moving into folders (`folder/file`) and out of them (`../`)
- Why the same path works on your laptop but breaks online (and the opposite)
- Case sensitivity, spaces and other path traps
- A method to fix any broken link or image
:::

## Why paths matter

Every link (`href`), image (`src`), stylesheet (`<link href>`), script (`<script src>`) and video points to a file using a path. If the path is wrong by even one letter or folder, the browser can't find the file: images show as broken icons, styles don't apply, and links give **404 Not Found**.

## Organising a website's files

A typical small site:

```
my-website/                 ← the site's root folder (public_html on a server)
├── index.html              ← home page
├── about.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   ├── logo.png
│   └── team/
│       └── wanjiku.jpg
└── services/
    ├── index.html          ← opens at /services/
    └── web-design.html
```

Good habits:

- Keep `index.html` in the root.
- Put files of the same kind in folders: `css/`, `js/`, `images/`.
- Use **lowercase**, **no spaces**, words joined with **hyphens**: `web-design.html`, `wanjiku-kamau.jpg`.
- Descriptive names (`shop-front.jpg`, not `IMG_20260214_103522.jpg`): they're easier to manage and help image SEO.

## Three kinds of paths

### 1. Absolute URLs

The **full address** including `https://` and the domain. Use for **other websites** (and in places that need full URLs, like Open Graph images and sitemaps).

```
<a href="https://www.kra.go.ke">KRA</a>
<img src="https://example.co.ke/images/logo.png" alt="Example logo">
```

### 2. Relative paths

A path **relative to the current file's folder**. Use for your own files. The site keeps working if you move the whole folder or change domains.

| Path | Meaning |
|---|---|
| `about.html` | A file in the **same folder** |
| `images/logo.png` | Go **into** the `images` folder, then the file |
| `images/team/wanjiku.jpg` | Into `images`, into `team`, then the file |
| `../index.html` | Go **up one folder** (`..` = parent folder), then the file |
| `../../css/style.css` | Up two folders, into `css` |
| `./about.html` | `./` means "this folder"; same as `about.html` |

### 3. Root-relative paths

Start with a single `/`: the path from the **root of the website**, wherever the current page is.

```
<img src="/images/logo.png" alt="Logo">
<link rel="stylesheet" href="/css/style.css">
```

Great for menus and templates used on pages at different folder depths. The catch: on your laptop, if you open files by double-clicking (`file:///C:/Users/...`), `/` means the root of your **drive**, so root-relative paths break locally. They work on a real server or a local development server (like VS Code's Live Server extension).

## Working through examples

Using the folder tree above:

**From `index.html` (root):**

```
<a href="about.html">About</a>
<a href="services/web-design.html">Web design</a>
<img src="images/logo.png" alt="Logo">
<img src="images/team/wanjiku.jpg" alt="Wanjiku, our designer">
<link rel="stylesheet" href="css/style.css">
```

**From `services/web-design.html` (one folder down):**

```
<a href="../index.html">Home</a>             ← up to the root
<a href="index.html">All services</a>        ← services/index.html, same folder
<img src="../images/logo.png" alt="Logo">    ← up, then into images
<link rel="stylesheet" href="../css/style.css">
```

**The same, root-relative (works from any folder on a server):**

```
<a href="/">Home</a>
<img src="/images/logo.png" alt="Logo">
<link rel="stylesheet" href="/css/style.css">
```

:::think You're in images/team/ and want to link to contact.html in the root. What relative path do you write?
`../../contact.html`. The first `../` goes from `team` up to `images`, the second from `images` up to the root, then `contact.html`. (A page usually isn't inside an images folder, but the counting method is the same for any depth.)
:::

## Folder URLs and index.html

When a URL ends in a folder (`https://example.co.ke/services/`), the server looks for `index.html` (or `index.php`) inside it. So you can link to `services/` instead of `services/index.html` for cleaner URLs. Many professional sites use one folder per page for this reason: `/about/index.html` is served at `/about/`.

## Path traps

| Trap | What happens | Fix |
|---|---|---|
| **Case sensitivity** | Works on Windows, breaks on Linux servers: `Logo.PNG` ≠ `logo.png` | Lowercase everything, match exactly |
| **Spaces** in names | `my photo.jpg` becomes `my%20photo.jpg`; easy to break | Use hyphens |
| **Backslashes** `\` | Windows-style paths don't work on the web | Always forward slashes `/` |
| **Local computer paths** | `C:\Users\Juma\Desktop\logo.png` only exists on your PC | Use relative paths |
| **Wrong extension** | `.jpeg` vs `.jpg`, `.PNG` vs `.png` | Check the real file name (turn on file extensions) |
| **Missing upload** | File exists locally but wasn't uploaded | Upload it to the matching folder |
| **Root-relative locally** | `/css/style.css` fails when double-clicking files | Use a local server, or relative paths |

:::warning The classic Windows trap
Windows doesn't care about capital letters, so `Images/Logo.png` works on your laptop even if the file is `images/logo.png`. Most web servers run **Linux**, which treats them as different files. The site works at home and breaks online. Using lowercase names from the start prevents this completely.
:::

## How to fix any broken path (a method)

1. **Find the failing request:** open DevTools (F12) → **Console** or **Network**. Red 404 entries show the exact URL the browser tried.
2. **Compare** that URL with where the file really is. Which folder or letter is different?
3. **Check spelling, capital letters and extensions** character by character.
4. **Count folder levels** from the current page: how many `../` do you need?
5. **Open the file URL directly** in the browser address bar. If it 404s, the file isn't where you think (or wasn't uploaded).
6. **Clear the cache** (Ctrl+Shift+R) after fixing, so you don't see an old cached error.

## Paths in CSS (preview)

Inside a CSS file, paths are relative to **the CSS file's location**, not the HTML page:

```
/* css/style.css */
body { background-image: url("../images/pattern.png"); }   /* up from css/, into images/ */
```

## Practice tasks

1. Create the folder tree above on your computer with empty files.
2. From `index.html`, write links to every page and an `<img>` for `wanjiku.jpg`.
3. From `services/web-design.html`, write relative links back to `index.html`, `contact.html` and the logo.
4. Rename `logo.png` to `Logo.png` and explain what would happen on a Linux server.
5. Use DevTools to find and fix a broken image path on a test page.

## Summary

- Organise sites in clear folders with lowercase, hyphenated names; `index.html` is the default page of a folder.
- **Absolute URLs** include `https://` and the domain (other sites, OG images, sitemaps).
- **Relative paths** start from the current file's folder: `folder/file`, `../` goes up one level.
- **Root-relative paths** start with `/` from the site root; they need a server.
- Most broken links/images come from wrong folders, capital letters, spaces, extensions or missing uploads; DevTools shows the exact failing URL.

```quiz
Q: What do the two dots in ../ mean?
A: up one folder | parent folder | go up one folder | the parent folder
Q: Which file does a server show for a folder URL like /services/?
A: index.html | index
Q: Does a path starting with / start from the current folder or the site root?
A: root | site root | the site root
Q: On Linux servers, are Logo.png and logo.png the same file? (yes or no)
A: no
Q: Which slash must web paths use: forward or backward?
A: forward | forward slash | /
Q: From services/page.html, what relative path reaches images/logo.png?
A: ../images/logo.png
Q: Inside a CSS file, are paths relative to the CSS file or the HTML page?
A: CSS file | the CSS file | css
```
