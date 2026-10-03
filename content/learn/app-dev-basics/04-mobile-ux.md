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

## Why mobile UX decides an app's success

Users judge an app within seconds. If it's confusing, slow or hard to use with one hand, they uninstall it and leave bad reviews, no matter how good the code is. Good mobile UX is especially important in Kenya, where many users have budget phones, small screens, limited storage, expensive data and varied levels of digital experience. Designers and developers who understand these conditions build apps people actually use.

## Designing for low-end devices and networks

| Constraint | Design response |
|---|---|
| Small screens (5–6 inches) | One main action per screen; large readable text; no tiny icons |
| Limited RAM and storage | Light app size; avoid huge images and animations |
| Slow or expensive data | Compress images, cache data, show content progressively, offer "low data" mode |
| Intermittent connectivity | Offline-first: show saved data, queue actions and sync later |
| Shared phones | Easy logout, PIN or biometric lock for sensitive apps |
| Varied digital literacy | Plain language, icons with labels, clear confirmations |
| Multiple languages | Support English and Kiswahili where the audience needs it |

## Onboarding that doesn't lose users

- Let people see value before forcing sign-up where possible (browse products, then log in to order).
- Ask only for essential details; use phone number + OTP instead of long registration forms.
- Explain permissions at the moment they're needed ("Allow location to find shops near you").
- Keep intro slides short (or skip them) and let users skip.

## Lists, search and filters

- Use clear list items with the most important information first (name, price, status).
- Add search with instant results and forgiving matching (ignore case, handle small typos).
- Filters and sorting as bottom sheets or chips, easy to reach with the thumb.
- Use pull-to-refresh and infinite scrolling or "Load more" for long lists.

## Designing payment flows users trust

```text
Cart → Review order (items, delivery fee, total) → Enter/confirm M-Pesa number
     → "Check your phone and enter your M-Pesa PIN" (with a timer and instructions)
     → Success screen with receipt number and next steps
     ↘ Failed / timed out → clear reason + "Try again" + "Pay another way"
```

- Always show the exact amount and who is being paid before the STK prompt.
- Never ask for the M-Pesa PIN inside your app: the PIN is entered only on the official prompt.
- Show progress while waiting, and confirm success only after the server verifies the payment.
- Provide a receipt (in-app, SMS or email) and support contact.

## Error messages that help

| Unhelpful | Helpful |
|---|---|
| "Error 500" | "We couldn't load your orders. Check your connection and try again." |
| "Invalid input" | "Enter a phone number like 0712 345 678" |
| "Payment failed" | "The payment was cancelled on your phone. Tap Try again to send a new request." |

Errors should say what happened, why (if known) and what to do next, without blaming the user.

## Notifications: useful, not annoying

- Send notifications that matter to the user: payment received, order shipped, appointment tomorrow.
- Let users choose categories (orders vs promotions) and respect quiet hours.
- Avoid daily marketing pushes; they lead to uninstalls.
- On Android 13+, apps must ask permission to show notifications; explain why first.

## Accessibility checklist

- Touch targets at least 48 × 48 dp with space between them.
- Text contrast of at least 4.5:1; support the system font size setting.
- Content descriptions (labels) for icons and images for screen readers (TalkBack).
- Don't rely on colour alone (add icons/text for status).
- Support dark mode and test it.
- Test with TalkBack turned on for key flows.

## Measuring UX after launch

| Signal | Tool |
|---|---|
| Where users drop off (e.g. checkout) | Analytics funnels (Firebase, Mixpanel, PostHog) |
| Crashes and freezes | Crashlytics, Play Console vitals |
| What users say | Store reviews, in-app feedback, support messages |
| Task success | Usability tests with 5 real users |

Improve the biggest problem first, release, measure again.

## Practice

1. Redesign a checkout screen to be usable with one thumb on a 5-inch phone.
2. Write helpful error messages for: no internet, wrong phone number, payment timeout.
3. Design an offline state for a product list (cached items with "last updated" time).
4. Create an onboarding flow that asks for only phone number and name.
5. Run a 5-person usability test on a prototype and list the top three issues.

:::think An app shows a blank white screen for 6 seconds while loading products on a slow network. Users think it's broken and uninstall. What would you change?
Show something immediately: a skeleton screen or cached products from the last visit, then load fresh data in the background. Display a progress indicator with a message, handle timeouts with a clear "Try again" option, compress images and paginate results so the first screen loads faster.
:::

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
Q: What is the recommended minimum touch target size in dp?
A: 48 | 48dp | 48 x 48
Q: Should an app ever ask users to type their M-Pesa PIN inside the app? (yes or no)
A: no
Q: Which Android screen reader should you test key flows with?
A: TalkBack
```
