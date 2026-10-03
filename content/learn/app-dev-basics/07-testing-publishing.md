---
slug: testing-and-publishing
title: Testing apps and publishing on Google Play and the App Store
after: mpesa-in-apps
---
# Testing apps and publishing on Google Play and the App Store

An app that crashes on a customer's phone loses that customer, and bad reviews scare away the next ones. This lesson covers how professionals test apps, then the steps to publish on **Google Play** (and an overview of Apple's **App Store**).

## Kinds of testing

| Type | Checks | Who/what does it |
|---|---|---|
| **Unit tests** | One function or class (price calculation, phone validation) | Automatic, runs in seconds |
| **Widget/UI tests** | A screen responds correctly to taps and input | Automatic |
| **Integration / end-to-end tests** | Whole journeys (sign up → buy → pay) | Automatic on an emulator, or manual |
| **Manual exploratory testing** | Real use, trying to break things | You and testers |
| **Device testing** | Different phones, screen sizes, Android versions | Real devices |
| **Beta testing** | Real users before full launch | Play Console testing tracks |

## The device test matrix

Before each release, test at least:

- A **cheap, older Android** (2 GB RAM, Android 8 to 10): what many of your users own.
- A **recent mid-range** phone.
- A **small screen** and a **large screen**.
- **Dark mode**, **large font size**, **Kiswahili** (if supported).
- **No internet**, **slow internet**, switching between Wi-Fi and data mid-request.
- Rotating the phone; leaving the app and coming back; a phone call during a payment.

## Bug reports that get fixed

| Field | Example |
|---|---|
| Title | App crashes when adding a product without a price |
| Steps | 1. Stock → Add 2. Enter name, leave price empty 3. Tap Save |
| Expected | "Enter a price" message |
| Actual | App closes |
| Device | Samsung A03, Android 12, app v1.0.3 |
| Evidence | Screen recording + crash log |

## Crash reporting and analytics

Add **Firebase Crashlytics** (or Sentry) so crashes on users' phones are reported with the exact line of code. Add simple analytics to learn which features people actually use. Mention both in your privacy policy.

## Publishing on Google Play: step by step

1. **Developer account**: create a Google Play Console account (one-time US$25 fee; a debit card works). Organisations need a D-U-N-S number.
2. **Prepare the app**:
   - A unique **application ID** (like `ke.co.dukaconnect.app`), which can never change.
   - **Version code** (increases every upload) and version name (1.0.0).
   - **Signing**: create an upload key and keep it safe (back it up!). Use **Play App Signing**.
   - Build an **Android App Bundle (.aab)**.
   - Target the **API level Google currently requires** (it rises every year).
3. **Store listing**: app name, short description (80 characters), full description, icon (512×512), feature graphic (1024×500), at least 2 screenshots.
4. **App content**: privacy policy URL (required), **Data safety** form, content rating questionnaire, target audience, ads declaration, and any permissions declarations.
5. **Testing tracks**: internal → closed → open testing. **New personal accounts must run a closed test with at least 12 testers for 14 days** before production access (check the current rule in Play Console).
6. **Production release**: upload the AAB, write release notes, choose countries, roll out (consider a **staged rollout**, e.g. 10% first).
7. **Review**: usually hours to a few days. Fix any policy issues Google reports.

## Common reasons apps get rejected

- Missing or vague privacy policy; Data safety form doesn't match what the app does.
- Asking for sensitive permissions (SMS, call log, background location) without a strong, approved reason.
- Broken login or a test account not provided to reviewers.
- Copying another brand's name or logo.
- Loan apps: Google has strict extra requirements for personal loan apps in Kenya; read the Financial Services policy carefully.

## The Apple App Store (overview)

- Requires a **Mac with Xcode** to build and an **Apple Developer Program** membership (US$99 per year).
- Stricter review and design guidelines.
- Flutter and React Native build iPhone apps from the same code, but you still need a Mac (or a cloud build service like Codemagic or EAS Build) and an iPhone for testing.

## After launch

- Watch crash reports and **reviews**; reply politely to every review.
- Release small updates often.
- Keep up with the yearly Android target API requirement, or your app stops being offered to new users.

## Why testing and release discipline matter

An app that crashes on the first day gets one-star reviews that are hard to recover from. Users in Kenya often have older Android versions, budget phones and unstable networks, so problems invisible on a developer's phone appear quickly in the real world. Systematic testing and careful releases protect your reputation, your client's business and your users' money.

## Writing test cases

A **test case** describes exactly what to do and what should happen:

| ID | Steps | Expected result |
|---|---|---|
| PAY-01 | Add 2 items, checkout, enter 0712345678, confirm | STK prompt appears; after PIN, order shows "Paid" with receipt |
| PAY-02 | Checkout, cancel the STK prompt | App shows "Payment cancelled" and a Try again button; order not paid |
| PAY-03 | Checkout with airplane mode on | Clear "No internet" message; nothing charged |
| LOGIN-04 | Enter a wrong OTP 5 times | Account temporarily locked with a clear message |
| CART-05 | Add an item, close the app, reopen | Cart still contains the item |

Write test cases for the most important flows (sign-up, login, payment, core features) and run them before every release.

## Automated tests: what to automate first

| Layer | Example | Why automate |
|---|---|---|
| Business logic | Price calculations, phone validation, discount rules | Fast and catches regressions |
| API / back end | Order creation, payment callback handling | Protects money-related code |
| UI flows | Login and checkout | Catches broken screens before users do |

Run tests automatically on every push with **continuous integration** (GitHub Actions, Codemagic, Bitrise). A red test should block the release.

## Beta testing with real users

- Recruit 10–20 testers who match your audience (different phones, networks, ages).
- Use Google Play's internal/closed testing tracks or TestFlight for iOS.
- Give testers specific tasks ("Order two items and pay with M-Pesa sandbox") plus free exploration.
- Collect feedback with a simple form: what were you doing, what happened, screenshot, phone model.
- Fix the most serious issues before production.

## Release checklist

1. All critical test cases pass on at least one budget phone and one recent phone.
2. Release build tested (not just debug): shrinking, signing and API endpoints point to production.
3. Version code increased, release notes written.
4. Crash reporting and analytics enabled (with a privacy policy that mentions them).
5. Store listing complete: screenshots, descriptions, privacy policy, data safety, content rating.
6. Back end ready: production keys configured on the server, backups running, monitoring on.
7. Support channel ready (email/WhatsApp) and FAQ for common questions.
8. Rollback plan: how to pause a rollout and restore the previous version of the back end.

## Staged rollouts and monitoring

```text
Day 1: release to 10% of users → watch crash-free rate, ANRs, reviews, payment success rate
Day 2–3: if healthy, increase to 50%
Day 4+: 100%
If problems: halt the rollout, fix, release a new version code
```

Key metrics to watch:

| Metric | Healthy target (guide) |
|---|---|
| Crash-free users | As close to 100% as possible (aim above 99%) |
| ANR rate | Very low; Play Console flags "bad behaviour" thresholds |
| Payment success rate | Compare with historical rates; investigate sudden drops |
| App rating and new reviews | Respond quickly to problems reported |

## Handling reviews

- Reply politely and quickly, especially to negative reviews.
- Thank users for reports, explain fixes ("Fixed in version 1.2.1, please update").
- Never argue publicly; move detailed support to email/WhatsApp.
- Use reviews to prioritise fixes and features.

## Maintenance after launch

| Task | Frequency |
|---|---|
| Fix crashes and critical bugs | As soon as found |
| Update libraries and SDKs (security) | Monthly or quarterly |
| Meet Google Play target API requirements | At least yearly |
| Test on new Android/iOS versions | When betas and releases come out |
| Review analytics and user feedback | Monthly |
| Renew certificates, domains and developer accounts | Track renewal dates |

Include maintenance in client contracts (a monthly or yearly support plan), since apps that aren't updated eventually break or get removed from stores.

## Practice

1. Write 10 test cases for a food-ordering app's checkout flow.
2. Write unit tests for price and discount calculations.
3. Set up a GitHub Actions workflow that runs your tests on every push.
4. Recruit three friends as beta testers and collect feedback with a form.
5. Write release notes and a staged rollout plan for version 1.0.1.

:::think A new version passes all tests, but after release the crash rate jumps on Android 9 phones. What should the team do immediately, and what should change afterwards?
Halt the staged rollout to stop more users getting the bad version, investigate the crash reports for Android 9 (Crashlytics stack traces), fix and release a new version code. Afterwards, add an older-Android device or emulator to the test matrix, add a test for the cause, and keep using staged rollouts so problems affect fewer users.
:::

```quiz
Q: How much is the one-time Google Play developer fee, in US dollars?
A: 25 | $25 | US$25
Q: Which file format do you upload to Google Play?
A: AAB | .aab | app bundle
Q: How many testers must new personal accounts have in a closed test?
A: 12 | twelve
Q: For how many days must that closed test run?
A: 14 | fourteen
Q: What can never change once an app is published on Google Play?
A: application ID | the application id | app id | package name
Q: Which tool reports crashes from users' phones?
A: Crashlytics | Firebase Crashlytics | Sentry
Q: What practice runs tests automatically on every push? (two words)
A: continuous integration | CI
Q: What should you do first if a new release causes many crashes? (halt the ...)
A: rollout | halt the rollout | pause the rollout | staged rollout
Q: What describes exact steps and the expected result for one check? (two words)
A: test case
```
