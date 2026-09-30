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
```
