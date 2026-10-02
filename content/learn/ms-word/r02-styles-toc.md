---
slug: styles-toc
title: "Styles, headings and an automatic table of contents: the secret to long documents"
after: KEEP
---
# Styles, headings and an automatic table of contents: the secret to long documents

Reports, projects, proposals, theses, policies and manuals can run to dozens or hundreds of pages. Formatting each heading by hand and typing a table of contents manually wastes hours and creates errors whenever pages change. **Styles** solve this: you tag text as "Heading 1", "Heading 2" or "Normal", and Word handles consistent formatting, navigation, numbering and an automatic **table of contents**. This is the single most valuable Word skill for students and professionals.

:::note What you will learn
- What styles are and why they matter
- Applying built-in styles (Heading 1–3, Title, Normal)
- Modifying styles so the whole document updates at once
- The Navigation Pane for moving and reorganising sections
- Creating and updating an automatic table of contents
- Numbered headings, captions, and tables of figures
- Section breaks for different page numbering (roman numerals, then 1, 2, 3)
- Equivalent steps in Google Docs
:::

## What are styles?

:::define Style
A saved set of formatting (font, size, colour, spacing, indentation, numbering) with a name, such as "Heading 1" or "Normal". Applying a style applies all of that formatting at once, and marks the text's role in the document.
:::

Benefits:
1. **Consistency:** every Heading 1 looks identical.
2. **Speed:** one click instead of five formatting steps.
3. **Global changes:** change the Heading 1 style once, and every Heading 1 in a 100-page document updates.
4. **Navigation:** the Navigation Pane lists headings so you can jump to and drag sections.
5. **Automatic table of contents**, numbering and cross-references.
6. **Accessibility:** screen readers use heading styles to navigate (and exported PDFs keep headings as bookmarks).

## Applying styles

**Word:** Home → **Styles** gallery. Click in a paragraph (no need to select it all) and click a style.

| Style | Use | Shortcut (Word) |
|---|---|---|
| **Title** | The document's title (cover) | |
| **Heading 1** | Chapters / main sections | `Ctrl+Alt+1` |
| **Heading 2** | Sub-sections | `Ctrl+Alt+2` |
| **Heading 3** | Sub-sub-sections | `Ctrl+Alt+3` |
| **Normal** | Body text | `Ctrl+Shift+N` |
| **List Paragraph, Quote, Caption** | Lists, quotations, figure captions | |

**Google Docs:** the dropdown next to the font (Normal text, Title, Heading 1, 2, 3), or `Ctrl+Alt+1/2/3`.

### Heading hierarchy

Use headings in order, like an outline:

```
Heading 1: Chapter 1 Introduction
  Heading 2: 1.1 Background
  Heading 2: 1.2 Problem statement
    Heading 3: 1.2.1 Specific objectives
Heading 1: Chapter 2 Literature review
```

Don't skip levels (Heading 1 straight to Heading 3), and don't use headings just to make text big.

## Modifying a style

Want all Heading 1s in Times New Roman 16, bold, navy, with 12 pt space before?

1. Right-click **Heading 1** in the Styles gallery → **Modify**.
2. Set font, size, colour, bold.
3. **Format → Paragraph** for spacing (e.g. 12 pt before, 6 pt after) and "Keep with next" (keeps the heading on the same page as the following text).
4. Choose **New documents based on this template** if you want it as your default (optional).
5. Click OK: every Heading 1 updates instantly.

Alternative: format one heading the way you want, then right-click the style → **Update Heading 1 to Match Selection**.

**Google Docs:** format a heading, then Format → Paragraph styles → Heading 1 → **Update 'Heading 1' to match**.

### Setting the Normal style

Modify **Normal** to set the default body font, size and spacing (e.g. Calibri 11, 1.15 line spacing, 8 pt after). Most other styles are based on Normal, so this sets the overall look.

## The Navigation Pane

**View → Navigation Pane** (`Ctrl+F` and click "Headings"): shows all headings as a clickable outline.

- Click a heading to jump there.
- **Drag headings** to move whole sections (with all their text) up or down.
- Right-click to promote/demote or delete sections.
- Collapse levels to see the big picture.

Google Docs shows a similar **document outline** (View → Show outline).

## Automatic table of contents

1. Apply heading styles throughout the document.
2. Place the cursor where the table of contents should go (usually after the title page; insert a page break first).
3. **References → Table of Contents** → choose an automatic style.
4. Word lists headings with page numbers and clickable links.

### Updating it

When headings or page numbers change: click the table → **Update Table** (or right-click → Update Field, or `F9`) → **Update entire table**. Always update before printing or exporting to PDF.

### Customising

References → Table of Contents → **Custom Table of Contents**: choose how many levels to show (e.g. 3), tab leaders (dots), and formats. Modify the "TOC 1", "TOC 2" styles to change how entries look.

**Google Docs:** Insert → Table of contents (with page numbers or with blue links); click the refresh icon to update.

:::think A student types their table of contents by hand. Two days before submission, their supervisor asks them to add a new section in Chapter 2. What problems will they face, and how would styles have helped?
Adding a section shifts many page numbers, so the manual table becomes wrong and must be retyped and checked line by line (and mistakes are likely). With heading styles and an automatic table, they'd add the heading, click **Update Table**, and every entry and page number would be correct in seconds.
:::

## Numbered headings

For reports that need "1, 1.1, 1.1.1" numbering:
1. Click in a Heading 1.
2. Home → **Multilevel List** → choose the style showing "1 Heading 1, 1.1 Heading 2, 1.1.1 Heading 3".
3. All headings number automatically and renumber when you move sections.

## Captions, figures and tables

- Right-click an image or table → **Insert Caption** → "Figure 1: Map of Nakuru County" or "Table 1: Survey results". Numbers update automatically.
- **References → Insert Table of Figures** creates a list of figures/tables (common in projects and theses).
- **Cross-references** (References → Cross-reference) let you write "see Figure 3" that updates if numbering changes.

## Sections: different page numbering in one document

Academic documents often need: **no number** on the cover, **roman numerals** (i, ii, iii) for preliminary pages (declaration, abstract, table of contents), then **1, 2, 3** from Chapter 1.

1. Put the cursor at the end of the cover page → **Layout → Breaks → Section Break (Next Page)**.
2. Do the same after the preliminary pages, before Chapter 1.
3. Double-click the footer in section 2 → turn off **Link to Previous** (Header & Footer tab).
4. Insert → Page Number → Bottom of Page; then **Format Page Numbers** → choose i, ii, iii and **Start at i**.
5. In section 3's footer, turn off Link to Previous again, insert page numbers, format as 1, 2, 3 and **Start at 1**.
6. In section 1 (cover), delete the page number (or tick **Different First Page**).

Section breaks also allow **landscape pages** in a portrait document (for a wide table): add section breaks before and after, then set that section's orientation to landscape.

## Templates and the Styles Pane

- **Styles Pane** (`Ctrl+Alt+Shift+S` or the small arrow in the Styles group) lists all styles and lets you create new ones (e.g. "Code", "Kiswahili quote").
- Save a document with your styles as a **template** (`.dotx`) for future reports: File → Save As → Word Template.
- Design → **Themes** and **Style Sets** change the look of all styles at once.

## Practice tasks

1. Open a long document (or create one with 3 chapters and subsections) and apply Title, Heading 1–3 and Normal styles.
2. Modify Heading 1 and Normal; watch the whole document update.
3. Insert an automatic table of contents; add a new section and update the table.
4. Add numbered headings with a multilevel list.
5. Set up a project with no number on the cover, roman numerals for preliminary pages and arabic numbers from Chapter 1.

## Summary

- Styles store formatting and meaning; use Title, Heading 1–3 and Normal consistently.
- Modify a style once to update the whole document; set Normal for the base look.
- The Navigation Pane lets you jump to and drag sections.
- Insert an automatic table of contents (References → Table of Contents) and update it before printing.
- Add numbered headings, captions, tables of figures and cross-references.
- Use section breaks for different page numbering and landscape pages; save templates for reuse.

```quiz
Q: Which style should chapter titles use?
A: Heading 1 | heading 1
Q: Which tab in Word has the Table of Contents command?
A: References
Q: Which key updates fields like the table of contents?
A: F9
Q: Which pane lists headings so you can drag sections around? (two words)
A: Navigation Pane | navigation
Q: Which break lets you change page numbering style in one document? (two words)
A: section break | Section Break (Next Page)
Q: Which footer option must you turn off to number sections differently? (three words)
A: Link to Previous | link to previous
Q: What numbering style is usually used for preliminary pages? (two words)
A: roman numerals | roman | i ii iii
```
