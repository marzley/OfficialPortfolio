---
slug: google-forms
title: Google Forms: surveys, registrations, quizzes and orders
after: google-docs-sheets-slides
---
# Google Forms: surveys, registrations, quizzes and orders

Google Forms collects information from many people through a simple link: event registrations, customer feedback, class quizzes, job applications, church or chama sign-ups, even simple order forms. Answers flow straight into a Google Sheet. It's free and works on any phone.

## Create a form

1. Go to **forms.google.com** → **Blank** (or a template).
2. Give it a clear **title** and a **description** (what it's for, deadline, contact).
3. Add questions with the **+** button.

## Question types

| Type | Use for |
|---|---|
| **Short answer** | Name, phone, admission number |
| **Paragraph** | Comments, explanations |
| **Multiple choice** | One answer (e.g. "Which town?") |
| **Checkboxes** | Several answers ("Which days can you attend?") |
| **Dropdown** | One answer from a long list |
| **Linear scale** | Rating 1–5 |
| **Multiple choice grid** | Rate several items at once |
| **Date / Time** | Delivery date, appointment time |
| **File upload** | CVs, certificates (respondents must sign in to Google) |

Turn on **Required** for questions that must be answered.

## Validation: stop wrong answers

Click ⋮ on a Short answer question → **Response validation**:

- **Number** → between 1 and 100
- **Length** → exactly 10 characters (phone numbers)
- **Regular expression** → matches `0[17][0-9]{8}` for Kenyan mobile numbers
- **Text** → email address

## Sections and logic

- Add **sections** to split long forms into pages.
- **Go to section based on answer** (⋮ on a multiple-choice question): e.g. "Are you a returning member?" → Yes skips the registration details.

## Settings that matter

⚙ **Settings**:

- **Collect email addresses** (verified if people sign in).
- **Limit to 1 response** (requires Google sign-in).
- Allow respondents to **edit after submit**.
- **Confirmation message**: "Thank you! We'll call you within 24 hours."
- **Accepting responses** toggle in the Responses tab: switch off after the deadline.

## Quizzes that mark themselves

Settings → **Make this a quiz**. For each question set the **answer key**, points and optional feedback. Choose to release marks immediately or later. Great for class tests and training assessments.

## Responses: summaries and a spreadsheet

- **Responses** tab: automatic charts and summaries.
- **Link to Sheets**: every new answer becomes a row, so you can sort, filter, use formulas and conditional formatting.
- Download all responses as CSV.

## Sharing the form

**Send** → copy the **link** (shorten it) for WhatsApp and SMS, generate a **QR code** for posters, or embed it on a website with the `< >` embed code.

## Example: a simple order form for a small business

1. Name (short answer, required)
2. Phone (validated with the regular expression)
3. Product (dropdown with prices in the text)
4. Quantity (short answer, number 1–20)
5. Delivery area (multiple choice)
6. Delivery date (date)
7. Payment (multiple choice: M-Pesa on delivery, M-Pesa now to Till ...)

Link it to a Sheet, add a Total column with a formula, and check new orders every morning.

## Privacy

Only collect what you need, explain how you'll use it in the description, and don't share the responses sheet publicly. Personal data is protected under the Kenya Data Protection Act.

## Who uses Google Forms

Google Forms is free and works on any phone, which makes it popular for: school registration and parent feedback, church and event sign-ups, chama meeting attendance, customer orders for small businesses, job applications, training evaluations, research surveys for university projects, and self-marking quizzes for teachers. Responses arrive in a spreadsheet automatically, saving hours of typing.

## Designing good questions

| Principle | Weak question | Better question |
|---|---|---|
| Ask one thing at a time | "Was the training useful and well organised?" | Two separate questions |
| Be neutral | "How much did you love our service?" | "How satisfied were you with our service?" |
| Give clear options | "Age?" (free text) | Age ranges: 18–24, 25–34, 35–44, 45+ |
| Include "Other" or "Prefer not to say" | Forced choices | Add an option for answers that don't fit |
| Keep it short | 40 questions | Only what you'll actually use |

Shorter forms get more responses: every extra question makes some people quit.

## Choosing question types well

| Need | Question type |
|---|---|
| Name, phone, ID | Short answer with response validation |
| Comments | Paragraph |
| One choice (gender, county) | Multiple choice or Dropdown (for long lists like 47 counties) |
| Several choices (services interested in) | Checkboxes |
| Rating (1 to 5 satisfaction) | Linear scale or Rating |
| Rating several items on the same scale | Multiple choice grid |
| Dates and times | Date / Time |
| Documents (CV, photos) | File upload (respondents need a Google account; files go to your Drive) |

## Response validation examples

```
Short answer → ⋮ → Response validation
   Number → Between 1 and 100                     (quantity, age)
   Text → Email                                   (email address)
   Length → Maximum character count 300           (short comments)
   Regular expression → Matches → ^0[17][0-9]{8}$  (Kenyan mobile number like 0712345678)
```

Add a custom error message such as "Enter a 10-digit number starting with 07 or 01".

## Branching: different questions for different people

Use **sections** and **Go to section based on answer**:

```
Section 1: "Are you a new or returning customer?"
   New        → Section 2 (How did you hear about us?)
   Returning  → Section 3 (How was your last order?)
Both then      → Section 4 (Contact details) → Submit
```

This keeps forms short for each person and gives you more relevant answers.

## Quizzes: more features

- **Settings → Make this a quiz**, then set the answer key and points for each question.
- Add **feedback** for correct and incorrect answers (with links to revision materials).
- Release marks immediately or after manual review (for paragraph answers).
- **Locked mode** (with managed Chromebooks in Google Workspace for Education) prevents students opening other tabs.
- Shuffle question order and answer order to reduce copying.
- View insights: most missed questions show topics that need re-teaching.

## Working with responses in Sheets

Link the form to a spreadsheet (Responses → Link to Sheets). Then:

```
=COUNTIF(C:C, "Nakuru")                       responses from Nakuru
=AVERAGE(E:E)                                  average satisfaction rating
=QUERY(A:F, "select C, count(A) group by C", 1)   count per county
```

- Don't edit or insert columns inside the Form Responses sheet; do analysis on a separate sheet referring to it.
- Use a pivot table or chart for a summary dashboard.
- Turn on email notifications for new responses (Responses → ⋮ → Get email notifications).

## Example: event registration with a confirmation

1. Questions: name, phone (validated), email, organisation, session choice (multiple choice), dietary needs.
2. Settings: collect email addresses, send respondents a copy of their responses.
3. Confirmation message: "Thank you for registering. Venue: ... Bring your ID. We'll send reminders by SMS."
4. Limit to one response per person if they sign in (optional).
5. Close the form when capacity is reached (Responses → Accepting responses off, or an add-on that limits responses).

## Branding and sharing

- Customise the theme: header image, colours and fonts (palette icon).
- Shorten the link (Send → link → Shorten URL), or create a QR code (Chrome: Share → Create QR code) for posters.
- Embed the form on your website (Send → `< >` embed HTML).
- Share via WhatsApp groups, SMS and email with a short explanation of why you're asking.

## Privacy and ethics

- Collect only what you need; avoid ID numbers unless necessary.
- Tell respondents why you're collecting data and how it will be used and stored (Kenya's Data Protection Act requires a lawful purpose and appropriate security).
- For research, get informed consent (a consent question at the start).
- Restrict who can see the response spreadsheet.
- Never use forms to collect passwords, M-Pesa PINs or card details. Scammers use fake Google Forms for phishing; your respondents should be able to trust your form.

## Common mistakes

| Mistake | Fix |
|---|---|
| Free-text county answers ("Nrb", "nairobi", "NAIROBI") | Dropdown list |
| No validation on phone numbers | Regular expression validation |
| Editing the responses sheet directly | Analyse on another sheet |
| Forgetting to close the form after the deadline | Turn off "Accepting responses" or schedule closure with an add-on |
| Very long forms | Remove questions you won't use; use sections |

## Practice

1. Build a customer feedback form with a rating scale, a multiple-choice grid and branching for unhappy customers.
2. Validate a phone number field with a regular expression.
3. Create a 10-question self-marking quiz with feedback for wrong answers.
4. Link responses to Sheets and build a summary with COUNTIF and a chart.
5. Generate a QR code for the form and design a small poster with it.

:::think Why might a business get more accurate data from a dropdown "County" question than a short-answer question?
Short answers produce many spellings and abbreviations (Nairobi, Nrb, nairobi city), which makes counting and filtering unreliable. A dropdown gives everyone the same fixed options, so responses can be counted and charted directly without cleaning.
:::

```quiz
Q: Which question type lets people choose several answers?
A: Checkboxes | checkbox
Q: Which feature checks that a phone number has exactly 10 characters? (two words)
A: response validation | validation
Q: Which setting turns a form into a self-marking test? (four words)
A: Make this a quiz | make this a quiz
Q: Where do responses go when you link the form? (two words)
A: Google Sheets | a sheet | Sheets | google sheet
Q: Which tab lets you stop accepting responses after the deadline?
A: Responses
Q: Which Forms feature sends people to different sections depending on their answer? (four words starting "Go to")
A: Go to section based on answer | go to section
Q: Which question type is best for rating several items on the same scale? (three words)
A: multiple choice grid
Q: Should you ever collect passwords or M-Pesa PINs with a form? (yes or no)
A: no
```
