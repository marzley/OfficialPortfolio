---
slug: media-embeds
title: "Audio, video, YouTube and maps: media and embeds in HTML"
after: KEEP
---
# Audio, video, YouTube and maps: media and embeds in HTML

Video and audio explain products, teach lessons and build trust faster than text. Maps help customers find your shop. HTML can play media files directly and **embed** content from other services such as YouTube and Google Maps. This unit covers how media works on the web, the `<video>`, `<audio>` and `<iframe>` elements in depth, and how to use media without making pages slow or inaccessible.

:::note What you will learn
- Why and where websites use media, and the cost of media on mobile data
- Video and audio file formats (containers and codecs) in plain language
- `<video>` and `<audio>` and all their important attributes
- Captions and subtitles with `<track>`
- Embedding YouTube videos and Google Maps with `<iframe>`
- Performance, privacy, accessibility and copyright
:::

## Why media matters, and its cost

| Media | Common uses |
|---|---|
| Video | Product demos, property tours, school and church sermons, tutorials, adverts, testimonials |
| Audio | Podcasts, radio streams, music samples, language lessons, sermons |
| Maps | "Find us" sections for shops, clinics, schools and hotels |

But media is **heavy**. One minute of HD video can be 20–50 MB. Many Kenyans buy data in small bundles, so a page that automatically downloads a big video can annoy visitors and cost them money. Good developers make media **optional and efficient**.

:::kenya
A practical approach many Kenyan businesses use: host videos on **YouTube** (free storage, automatic quality adjustment for slow connections) and **embed** them, and keep self-hosted videos short (under 30 seconds) for things like hero backgrounds, compressed well.
:::

## Media formats in plain language

A video file has a **container** (the file type, like `.mp4`) holding streams encoded with a **codec** (a compression method, like H.264).

| Format | Container | Notes |
|---|---|---|
| **MP4 (H.264 + AAC)** | `.mp4` | Plays almost everywhere. The safest choice. |
| **WebM (VP9 / AV1)** | `.webm` | Smaller files; supported by modern browsers |
| **MP3** | `.mp3` | Audio: universal |
| **AAC / M4A** | `.m4a` | Audio: good quality, small |
| **Ogg / Opus** | `.ogg`, `.opus` | Audio: efficient; not in very old Safari |

Tools like **HandBrake** (free) convert and compress videos to MP4.

## The `<video>` element

```try-html
<video controls width="320" poster="https://picsum.photos/320/180" preload="metadata">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
  Your browser does not support video. <a href="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4">Download the video</a>.
</video>
```

### Attributes

| Attribute | What it does |
|---|---|
| `controls` | Shows play, pause, volume, full screen. **Always** include for videos users should control. |
| `width`, `height` | Display size (reserve space; CSS can make it responsive) |
| `poster` | Image shown before the video plays (choose an attractive frame) |
| `preload` | How much to download before play: `none` (nothing, saves data), `metadata` (just length and size), `auto` (browser decides) |
| `autoplay` | Starts automatically. Browsers only allow this if the video is **muted**. |
| `muted` | No sound |
| `loop` | Restarts at the end |
| `playsinline` | On iPhones, plays inside the page instead of going full screen |

### `<source>`: offering several formats

Inside `<video>`, list one or more `<source>` elements. The browser plays the **first one it supports**:

```
<video controls>
  <source src="tour.webm" type="video/webm">
  <source src="tour.mp4" type="video/mp4">
  <p>Your browser can't play this video. <a href="tour.mp4">Download it</a>.</p>
</video>
```

The text inside is **fallback** content for very old browsers.

### Background videos

A silent looping hero video:

```
<video autoplay muted loop playsinline poster="hero.jpg" preload="metadata">
  <source src="hero.mp4" type="video/mp4">
</video>
```

Rules: keep it short and small (aim for under about 3 MB), never rely on it for important information, and consider showing only the poster image on phones (with CSS media queries) to save data. Respect users who prefer reduced motion (CSS `prefers-reduced-motion`).

:::think Why do browsers block autoplaying videos that have sound?
Unexpected sound is annoying and embarrassing (imagine a page blaring audio in a quiet office or matatu), and it wastes data. So browsers only allow autoplay when the video is muted, or after the user has interacted with the site. That protects users while still allowing silent background videos.
:::

## Captions and subtitles: `<track>`

Captions help deaf and hard-of-hearing users, people watching without sound (very common on phones in public), and viewers who understand the language better when reading. Captions use **WebVTT** (`.vtt`) text files:

```
WEBVTT

00:00:00.000 --> 00:00:04.000
Karibu! Welcome to our shop in Nakuru.

00:00:04.000 --> 00:00:09.000
Today we'll show you our new solar panels.
```

```
<video controls>
  <source src="shop-tour.mp4" type="video/mp4">
  <track kind="captions" src="shop-tour.en.vtt" srclang="en" label="English" default>
  <track kind="subtitles" src="shop-tour.sw.vtt" srclang="sw" label="Kiswahili">
</video>
```

- `kind="captions"`: same language, includes sounds ("[music]").
- `kind="subtitles"`: translations.
- YouTube can auto-generate captions you then correct.

## The `<audio>` element

Works like `<video>` without the picture:

```try-html
<audio controls preload="none">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" type="audio/mpeg">
  Your browser does not support audio.
</audio>
<p>Podcast episode 12: Starting an online business in Kenya (24 minutes, 18 MB).</p>
```

Tell users the length and size of audio files. Provide a **transcript** (the words in text) for podcasts and speeches: it helps deaf users and SEO.

## Embedding with `<iframe>`

An `<iframe>` (inline frame) shows **another web page inside your page**. It's how you embed YouTube videos, Google Maps, forms (Google Forms), social posts and payment widgets.

### YouTube

On YouTube: **Share → Embed** gives you code. A clean version:

```
<iframe width="560" height="315"
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  title="Shop tour: Kamau Hardware, Ruiru"
  loading="lazy"
  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen></iframe>
```

- `youtube-nocookie.com` is YouTube's privacy-enhanced mode (fewer tracking cookies until the user plays).
- `title` is **required for accessibility**: screen readers announce it.
- `loading="lazy"` delays loading until the user scrolls near it: a single YouTube embed loads a lot of code, so this speeds up pages considerably.

### Google Maps

In Google Maps: search the place → **Share → Embed a map** → copy the HTML. A simple version using a search query:

```try-html
<iframe src="https://www.google.com/maps?q=Kenyatta+International+Convention+Centre&output=embed"
  width="320" height="240" style="border:0" loading="lazy"
  title="Map: Kenyatta International Convention Centre, Nairobi"></iframe>
<p><a href="https://maps.google.com/?q=Kenyatta+International+Convention+Centre" target="_blank" rel="noopener noreferrer">Open in Google Maps for directions</a></p>
```

Always add a normal **link** too: on phones it opens the Maps app for turn-by-turn directions.

:::tip Your Google Business Profile matters more than the embed
For local businesses, creating and verifying a free **Google Business Profile** (so you appear on Google Maps and in "near me" searches) does far more for customers finding you than an embedded map. Do both.
:::

### iframe security: `sandbox` and `allow`

Embedded pages run code from another website. Limit what they can do:

- `sandbox` applies strict restrictions (no scripts, forms or pop-ups) unless you allow specific ones, e.g. `sandbox="allow-scripts allow-same-origin"`. Use it for content you don't fully trust.
- `allow` lists features the embed may use (camera, full screen, autoplay).
- `referrerpolicy="no-referrer"` hides your page address from the embedded site.

Many sites **block** being embedded (banks, Google search, most big sites) using security headers, so not every page can go in an iframe. That protects users from "clickjacking" attacks.

## Making embeds responsive

Videos with fixed `width`/`height` overflow phones. Modern CSS fixes this simply (you'll learn CSS later):

```
<iframe style="width:100%; aspect-ratio:16/9; height:auto; border:0" ...></iframe>
```

## Performance checklist for media

- Don't autoplay videos with sound; use `preload="none"` or `"metadata"`.
- Compress videos (HandBrake) and keep self-hosted clips short.
- Use YouTube/Vimeo for long videos.
- `loading="lazy"` on iframes below the first screen.
- Consider a "click to load" thumbnail instead of loading the YouTube player immediately (this learning hub does that).
- Tell users file sizes before downloads.

## Accessibility checklist

- `controls` on user-facing media.
- Captions for videos with speech; transcripts for audio.
- `title` on every `<iframe>`.
- No important information only in a video; summarise it in text.
- No flashing content (more than three flashes per second can trigger seizures).
- Don't autoplay; if you must, keep it muted and allow pausing.

## Copyright and permission

Only use music, video and images you own, have licensed, or that are free to use (check the licence: Creative Commons, YouTube Audio Library, etc.). Using copyrighted music in a business video can get it removed or blocked, and can lead to legal claims. When embedding YouTube videos, the video owner controls whether embedding is allowed.

## Common mistakes

| Mistake | Fix |
|---|---|
| `<video>` with no `controls` | Add `controls` |
| Autoplay with sound | Remove autoplay or add `muted` |
| A 100 MB video on the home page | Compress, shorten or host on YouTube |
| `<iframe>` without `title` | Add a descriptive `title` |
| Map embed only (no link) | Add a link that opens Google Maps |
| Fixed 560px embeds overflowing phones | Responsive CSS (`width:100%`, `aspect-ratio`) |
| Videos with speech but no captions | Add a `.vtt` track or YouTube captions |

## Practice tasks

1. Add a `<video>` with `controls`, a `poster` and two `<source>` formats with fallback text.
2. Write a short WebVTT caption file (three captions) for an imaginary shop tour.
3. Embed a Google Map of your school or town with a proper `title`, plus a link to open it in Google Maps.
4. Embed a YouTube video using `youtube-nocookie.com`, `title` and `loading="lazy"`.
5. Write a 5-line transcript for a short audio clip you might put on a podcast page.

## Summary

- Media builds engagement but costs data: keep it optional, compressed and lazy-loaded.
- MP4 (H.264) is the safest video format; MP3 for audio. Use `<source>` to offer several formats.
- `<video>`/`<audio>` attributes: `controls`, `poster`, `preload`, `autoplay` (only with `muted`), `loop`, `playsinline`.
- `<track>` adds WebVTT captions and subtitles.
- `<iframe>` embeds YouTube, Google Maps and other pages; always add `title`, use `loading="lazy"`, and consider `sandbox`.
- Respect accessibility (captions, transcripts) and copyright.

```quiz
Q: Which attribute shows play and pause buttons on a video?
A: controls
Q: Which attribute sets the image shown before a video plays?
A: poster
Q: Browsers only allow autoplay when the video is ...?
A: muted
Q: Which element offers alternative video formats inside <video>?
A: source | <source>
Q: Which element adds captions to a video?
A: track | <track>
Q: What is the caption file format called? Write its short name.
A: WebVTT | vtt | webvtt
Q: Which element embeds another web page, like a YouTube video?
A: iframe | <iframe>
Q: Which iframe attribute is required for screen readers?
A: title
Q: Which video format plays almost everywhere?
A: MP4 | mp4
```
=== exercise ===
Add a `<video>` with the `controls` attribute and a `<source>` inside it.
=== starter ===

=== expected ===

=== must_contain ===
<video
controls
<source
