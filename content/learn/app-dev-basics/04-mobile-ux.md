---
slug: mobile-ui-ux
title: Mobile UI/UX design that people love
after: planning-an-app
---
# Mobile UI/UX design that people love

**UI** (user interface) is how the app looks. **UX** (user experience) is how it feels to use: is it quick, clear and stress-free? An app with great features but confusing screens gets uninstalled. These principles apply whether you build in Flutter, Kotlin, React Native or the web.

## Design for real Kenyan users

- **Cheap phones**: small screens (5 to 6 inches), slower processors, limited storage. Keep the app small and smooth.
- **Expensive, patchy data**: show cached content, compress images, never download what isn't needed.
- **Bright sunlight**: strong contrast; avoid light grey text on white.
- **One hand on a matatu**: important buttons within thumb reach.
- **Mixed languages and literacy levels**: plain words, icons with labels, Kiswahili option.

## The thumb zone

Most people hold phones in one hand and tap with the thumb. The **bottom and middle** of the screen are easy to reach; the **top corners** are hard. That's why modern apps put main navigation in a **bottom bar** and the main action in a floating button near the bottom.

## Touch targets

Make every tappable item at least **48 × 48 dp** (about 9 mm), with space between targets. Tiny buttons cause mis-taps and frustration. Material Design and Apple's guidelines both require this.

## Visual hierarchy

On every screen, decide **the one most important thing** and make it the most visible: biggest, boldest or the only coloured button. Example for a shop's home screen: today's sales total, big and at the top; then low-stock warnings; then secondary actions.

## Navigation patterns

| Pattern | Use for |
|---|---|
| **Bottom navigation bar** (3 to 5 items) | Main sections you switch between often |
| **Tabs** | Views of the same thing (New / Delivering / Done orders) |
| **Stack (push/back)** | Going deeper: list → details → edit |
| **Drawer (side menu)** | Rarely used sections, settings |
| **Bottom sheets** | Quick choices without leaving the screen |

Keep the **back button** working the way users expect on Android.

## Every screen has four states

| State | What to show |
|---|---|
| **Loading** | A skeleton or spinner, ideally with cached data already visible |
| **Empty** | A friendly message and the next action ("No products yet. Add your first product") |
| **Error** | What went wrong in plain words and a "Try again" button ("No internet connection") |
| **Success** | The content, and confirmation after actions ("Sale saved") |

Designers who forget empty and error states produce apps that look broken on day one.

## Forms that don't frustrate

- Ask only for what's needed. Every extra field loses users.
- Use the right keyboard (number pad for phone numbers and amounts).
- Accept phone numbers in any format (0712…, +254712…) and normalise them.
- Show errors **next to the field**, in plain language, as the user types or on submit.
- Disable the submit button while sending, to prevent double payments.

## Accessibility (apps for everyone)

- Text that scales with the phone's font size setting.
- Colour contrast of at least **4.5:1** for normal text.
- Never use colour alone to show meaning (add icons or text: "Paid ✓").
- Labels for screen readers on icon-only buttons.
- Support dark mode.

## Feedback and speed

- Respond to every tap instantly (a ripple, a pressed state).
- **Optimistic updates**: show the change immediately, sync in the background, and undo if it fails.
- Use short, meaningful animations (150 to 300 ms).
- Confirm destructive actions ("Delete product?") and offer **Undo**.

## Design tools and process

1. **Paper sketches**: fastest way to explore ideas.
2. **Wireframes** in Figma: boxes and labels, no colours yet.
3. **Clickable prototype** in Figma: test with 3 to 5 real users and watch where they hesitate.
4. **Visual design**: colours, fonts and components from a design system (Material 3 for Android/Flutter).
5. **Hand-off** to developers with sizes, colours and states documented.

Learn more design basics in the **Web design & UI/UX** subject.

```quiz
Q: What is the minimum recommended size for touch targets, in dp?
A: 48 | 48 x 48 | 48dp
Q: Which area of the screen is easiest to reach with the thumb: top corners or bottom?
A: bottom | the bottom
Q: Name the four states every screen needs: loading, empty, error and ...
A: success | content | data
Q: What minimum contrast ratio should normal text have?
A: 4.5:1 | 4.5
Q: Showing a change immediately and syncing in the background is called an ... update?
A: optimistic
Q: How many real users are usually enough to find most usability problems in a prototype test? Give a number from 3 to 5.
A: 3 | 4 | 5
```
