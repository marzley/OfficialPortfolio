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
```
