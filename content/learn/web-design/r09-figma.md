---
slug: design-tools-figma
title: "Design tools: Figma step by step, frames, auto layout, components, prototypes, handoff and alternatives"
after: KEEP
---
# Design tools: Figma step by step, frames, auto layout, components, prototypes, handoff and alternatives

Before writing code, professional teams design screens in a **design tool**: they can try ideas quickly, get client feedback, and give developers exact measurements. **Figma** is the industry-standard tool for website and app design: it runs in the browser (or desktop app), works on modest computers, has a free plan, and lets teams collaborate live like Google Docs. Learning Figma opens doors to UI/UX design work, freelance website projects and better communication with developers.

:::note What you will learn
- Design tools compared: Figma, Penpot, Adobe XD, Canva, Framer, Sketch
- The Figma interface and file structure
- Frames, shapes, text, images and layers
- Auto layout for responsive components
- Styles and variables (colours, text, spacing)
- Components and variants for reusable buttons and cards
- Designing a mobile and desktop screen step by step
- Prototyping clickable flows
- Sharing, comments and developer handoff (Dev Mode, export)
- Plugins, community files and good file habits
:::

## Design tools compared

| Tool | Best for | Cost |
|---|---|---|
| **Figma** | UI/UX design, prototyping, collaboration; industry standard | Free plan; paid team plans; education plans |
| **Penpot** | Open-source Figma alternative; self-hostable | Free |
| **Canva** | Social media graphics, simple flyers, quick mock-ups | Free/Pro |
| **Framer** | Designing and publishing interactive websites | Free/paid |
| **Sketch** | UI design (macOS only) | Paid |
| **Adobe XD** | Older UI tool, no longer actively developed by Adobe | — |

## The Figma interface

| Area | What it does |
|---|---|
| **Toolbar** (top) | Move, frame, shape, pen, text, comment tools |
| **Layers panel** (left) | All elements in the page, grouped and named |
| **Canvas** (centre) | Where you design |
| **Design panel** (right) | Position, size, auto layout, fill, stroke, effects, typography |
| **Prototype panel** (right) | Interactions and transitions |
| **Pages** (left top) | Organise a file: Wireframes, Designs, Components |

Useful shortcuts: `F` frame, `R` rectangle, `T` text, `Shift+A` auto layout, `Ctrl/Cmd+D` duplicate, `Ctrl/Cmd+G` group, `Ctrl/Cmd+Alt+K` create component, hold `Alt` to measure distances.

## Frames, shapes, text and images

- **Frames** are screens or containers. Choose presets: iPhone (390×844), Android (360×800), Desktop (1440×1024).
- **Shapes** for backgrounds, cards and dividers; set **corner radius** for rounded cards and buttons.
- **Text** with your chosen fonts (Google Fonts are built in).
- **Images**: drag in photos or use fill images in shapes.
- Name layers clearly ("Hero / CTA button") so others understand the file.

## Auto layout: designs that behave like CSS

**Auto layout** (Shift+A) makes frames grow and shrink with their content, like Flexbox:
- **Direction**: horizontal or vertical.
- **Spacing** between items (gap) and **padding** inside.
- **Alignment** and **resizing**: hug contents, fill container, fixed.

Example: a button with auto layout grows automatically when you change "Pay" to "Pay with M-Pesa". A card list with vertical auto layout reflows when you add a card. Developers can translate auto layout directly into Flexbox (`display:flex; gap; padding`).

## Styles and variables

Create reusable **colour styles/variables** (brand, accent, text, background), **text styles** (H1, H2, body, caption) and **number variables** for spacing and radius. Changing a style updates every element using it. This is how design systems stay consistent (see the design systems lesson). Variables can also define light and dark **modes**.

## Components and variants

- Turn a button into a **component** (main component). Copies are **instances**; editing the main component updates all instances.
- **Variants** group versions: Button with properties *Type* (primary, secondary), *State* (default, hover, disabled), *Size* (small, large).
- Build components for buttons, inputs, cards, navigation bars, icons.

## Designing a screen step by step (mobile first)

1. **Wireframe**: grey boxes for hero, services, testimonials, contact (see the wireframes lesson). Get client approval on structure first.
2. Create a 390px **mobile frame** with a 4-column layout grid and 16px margins.
3. Set up **styles**: colours, text styles, spacing.
4. Build the **hero**: auto layout frame with headline, subheadline, CTA component, image.
5. Add **sections** using components (service cards, testimonials).
6. Check hierarchy, spacing consistency, contrast (plugins like Stark or built-in checks).
7. Create the **desktop** version (1440px frame, 12-column grid) by rearranging the same components.
8. Name layers, organise pages.

## Prototyping

Prototypes make designs clickable without code:
1. Switch to the **Prototype** tab.
2. Select a button, drag the connection to the destination frame (e.g. "Checkout").
3. Choose the trigger (On tap), action (Navigate to), and animation (Smart animate, Slide).
4. Press **Present** (play icon) to test, or share the prototype link.

Use prototypes for **usability testing**: watch 3–5 users try a task ("Book a haircut for Saturday") and note where they hesitate.

## Sharing, feedback and handoff

- **Share** with view or edit access; clients can leave **comments** pinned to elements.
- **Dev Mode** (or inspect panel) shows developers measurements, colours, fonts, spacing and CSS snippets.
- **Export** images and icons (PNG, JPG, SVG, PDF) at the right sizes (1x, 2x).
- Document interactions and edge cases: empty states, error messages, loading states.

## Plugins and community

The Figma Community has free UI kits, icon sets, wireframe kits and plugins: icon libraries (e.g. Iconify), Unsplash images, content generators, accessibility checkers, and tools to export to code. Use community files to learn how professionals structure designs, but create your own original work for portfolios.

## Good file habits

- Pages: Cover, Wireframes, Designs, Components, Archive.
- Consistent naming and auto layout everywhere.
- Use styles/variables rather than random hex values.
- Version history: name important versions ("Client approved v2").
- Keep client files in the client's or your team's workspace with clear access control.

## Practice project

Design a 3-screen mobile app or site flow for a local business (e.g. a salon): Home → Services & prices → Booking confirmation. Use auto layout, a button component with variants, text and colour styles, and link the screens into a prototype. Then design the desktop home page. Share it in your portfolio with a short write-up of decisions.

:::think A developer complains that your Figma design has 14 slightly different greys, buttons of different heights, and elements placed by eye with no consistent spacing. How would you fix the file?
Create colour variables/styles (a small neutral scale) and replace the random greys; build a button component with variants (and fixed padding via auto layout) and swap all buttons for instances; apply auto layout with spacing from a 4/8px scale; define text styles; then use Dev Mode so the developer sees consistent values.
:::

## Summary

- Figma is the standard collaborative UI/UX tool; Penpot is an open-source alternative; Canva suits simple graphics.
- Use frames, layers, text and images with clear naming; auto layout makes components behave like Flexbox.
- Styles/variables and components with variants keep designs consistent and fast to update.
- Design mobile first, then desktop; prototype flows and test with real users.
- Share for comments, hand off with Dev Mode and exports, and keep files organised.

```quiz
Q: Which Figma feature makes frames grow with content like Flexbox? (two words)
A: auto layout
Q: What are copies of a main component called?
A: instances | instance
Q: What do you call different versions of a component (e.g. primary/secondary, hover)?
A: variants
Q: Which Figma mode shows developers measurements and CSS?
A: Dev Mode | dev mode | inspect
Q: Name a free open-source alternative to Figma.
A: Penpot
```
