---
slug: booking-system
title: "Project 8: Booking system with staff, durations, deposits and reminders"
after: mpesa-payment-system
---
# Project 8: Booking system with staff, durations, deposits and reminders

Salons, barbershops, clinics, dentists, physiotherapists, car washes, driving schools, photographers, tutors, event venues and Airbnb hosts all need bookings. The [PHP booking lesson](./?track=php&lesson=project-booking-system) builds a simple version with fixed 30-minute slots and one person. This project goes further, the way real businesses work:

- **Several staff members**, each with their own working hours and days off
- **Services of different lengths** (a haircut is 30 minutes, braids are 3 hours)
- **No overlaps**, not just no identical start times
- A **deposit** paid with M-Pesa to reduce no-shows
- **Reminders**, cancellations and rescheduling
- An owner **calendar** view

**Lessons you need:** [project booking system (PHP)](./?track=php&lesson=project-booking-system), [M-Pesa payment project](./?track=projects&lesson=mpesa-payment-system), [indexes and transactions](./?track=sql&lesson=indexes-transactions), [dates in JavaScript](./?track=javascript&lesson=math-dates-numbers), [sessions and login](./?track=php&lesson=sessions-login).

## Step 1: User stories

**Customer:** choose a service → choose a staff member (or "anyone") → choose a date → see only times that actually fit → enter name and phone → pay a deposit → get a confirmation with a booking code → can cancel or reschedule using the code.

**Staff:** see their own schedule for today and this week; block off time (lunch, leave).

**Owner:** calendar of everyone's bookings; mark bookings done, no-show or cancelled; manage services, prices, staff and hours; see deposits received.

## Step 2: Database design

```sql
CREATE TABLE staff (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(80) NOT NULL, phone VARCHAR(15), active TINYINT NOT NULL DEFAULT 1);
CREATE TABLE services (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(80) NOT NULL, minutes INT NOT NULL, price INT NOT NULL, deposit INT NOT NULL DEFAULT 0);
CREATE TABLE staff_services (staff_id INT, service_id INT, PRIMARY KEY (staff_id, service_id));   -- who can do what
CREATE TABLE working_hours (staff_id INT, weekday TINYINT, opens TIME, closes TIME, PRIMARY KEY (staff_id, weekday));  -- 1 = Monday
CREATE TABLE time_off (id INT AUTO_INCREMENT PRIMARY KEY, staff_id INT, starts_at DATETIME, ends_at DATETIME, reason VARCHAR(100));
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code CHAR(6) NOT NULL UNIQUE,
  staff_id INT NOT NULL, service_id INT NOT NULL,
  customer VARCHAR(100) NOT NULL, phone VARCHAR(15) NOT NULL,
  starts_at DATETIME NOT NULL, ends_at DATETIME NOT NULL,
  status ENUM('awaiting_deposit','confirmed','done','no_show','cancelled') NOT NULL DEFAULT 'awaiting_deposit',
  deposit_receipt VARCHAR(20) NULL UNIQUE,
  reminder_sent TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  INDEX (staff_id, starts_at)
);
```

Storing `ends_at` (start + service minutes) makes overlap checks simple and fast.

## Step 3: The core algorithm: free times that fit

Two time ranges overlap when **each starts before the other ends**:

> `newStart < existingEnd AND existingStart < newEnd`

This one rule handles every case (inside, around, overlapping the start, overlapping the end). Here's the full availability calculation for one staff member on one day. Run it, then try changing the service length to 120 minutes:

```try-javascript
function toMin(hhmm) { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; }
function toHHMM(min) { return String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0"); }
function overlaps(aStart, aEnd, bStart, bEnd) { return aStart < bEnd && bStart < aEnd; }

function freeStarts(opens, closes, busy, serviceMinutes, step = 15) {
  const out = [];
  const busyMin = busy.map(b => [toMin(b[0]), toMin(b[1])]);
  for (let start = toMin(opens); start + serviceMinutes <= toMin(closes); start += step) {
    const end = start + serviceMinutes;
    if (!busyMin.some(([bs, be]) => overlaps(start, end, bs, be))) out.push(toHHMM(start));
  }
  return out;
}

// Wanjiru works 08:00-17:00. Existing bookings and her lunch break:
const busy = [["09:00", "12:00"], ["13:00", "13:45"], ["15:30", "16:00"]];
console.log("30-min haircut:", freeStarts("08:00", "17:00", busy, 30).join(" "));
console.log("3-hour braids: ", freeStarts("08:00", "17:00", busy, 180).join(" ") || "no free time today");
```

Notice how a 3-hour service can't start at 12:00 (it would clash with 13:00) even though 12:00 is free. That's the bug simple slot systems have.

In PHP the logic is identical. Load `busy` from the database:

```sql
SELECT TIME(starts_at), TIME(ends_at) FROM bookings
WHERE staff_id = ? AND DATE(starts_at) = ? AND status IN ('awaiting_deposit','confirmed')
UNION ALL
SELECT TIME(starts_at), TIME(ends_at) FROM time_off WHERE staff_id = ? AND DATE(starts_at) = ?;
```

For "anyone available", run the calculation for each staff member who offers the service and merge the results (remember which staff member each time belongs to).

Also hide times in the past, and times too soon to prepare (e.g. not within the next hour).

## Step 4: Preventing double bookings for real

Two customers can load the same free time and both click "Book". The availability check in the browser isn't enough. On the server, **inside a transaction**:

```php
$pdo->beginTransaction();
// Lock this staff member's row: other booking attempts for the same staff wait here
$pdo->prepare('SELECT id FROM staff WHERE id = ? FOR UPDATE')->execute([$staffId]);
$clash = $pdo->prepare("SELECT COUNT(*) FROM bookings WHERE staff_id = ? AND status IN ('awaiting_deposit','confirmed')
                        AND starts_at < ? AND ? < ends_at");
$clash->execute([$staffId, $endsAt, $startsAt]);
if ($clash->fetchColumn() > 0) { $pdo->rollBack(); exit('Sorry, that time was just taken. Please choose another.'); }
$pdo->prepare('INSERT INTO bookings (code, staff_id, service_id, customer, phone, starts_at, ends_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())')
    ->execute([$code, $staffId, $serviceId, $name, $phone, $startsAt, $endsAt]);
$pdo->commit();
```

Locking the staff row serialises bookings for that person, so the overlap check and the insert happen as one step.

## Step 5: Deposits with M-Pesa

No-shows cost small businesses real money. A deposit fixes most of it:

1. The booking is created as `awaiting_deposit` and holds the time for, say, **10 minutes**.
2. The customer gets an STK push for the deposit (reuse your [M-Pesa project](./?track=projects&lesson=mpesa-payment-system) code; the amount comes from `services.deposit`).
3. The callback marks the booking `confirmed` and stores the receipt.
4. A cron job every few minutes cancels `awaiting_deposit` bookings older than 10 minutes, freeing the time.

Write the cancellation and refund policy clearly on the booking page (for example: "Deposit refundable if you cancel at least 24 hours before"). Let the owner decide the rules.

## Step 6: Confirmation, reminders and self-service

- **Booking code**: 6 characters without confusing ones (no 0/O, 1/I). Show it on screen and send it.
- **Messages**: email is free; SMS costs a little through providers such as Africa's Talking; a WhatsApp click-to-chat link with a pre-filled message costs nothing. Send a confirmation immediately and a **reminder** the day before (a cron job finds tomorrow's confirmed bookings where `reminder_sent = 0`).
- **Manage booking page**: enter phone + code → see the booking → cancel or reschedule (rescheduling = check availability again, then update in a transaction).
- Add an **"Add to calendar"** link by generating a small `.ics` file.

## Step 7: Owner calendar

A day view with one column per staff member and a row per 15 minutes is the most useful screen for a busy salon. Build it with CSS Grid: each booking is a block placed with `grid-row: start / span length`. Colour by status. On phones, show a simple list per staff member instead.

```css
.day { display: grid; grid-template-columns: 60px repeat(var(--staff), 1fr); grid-auto-rows: 18px; }
.booking { grid-column: var(--col); grid-row: var(--row) / span var(--span); border-radius: 6px; padding: 2px 6px; font-size: .8rem; }
.booking.confirmed { background: #dcfce7; } .booking.awaiting_deposit { background: #fef9c3; }
```

## Step 8: Time zones and dates

Store all times in one time zone (Kenya: `Africa/Nairobi`, UTC+3, no daylight saving). Set it in PHP (`date_default_timezone_set`) and in MySQL (`SET time_zone = '+03:00'`), or store UTC and convert for display. Mixing them leads to bookings that appear three hours off.

## Step 9: Tests that matter

- 3-hour service near closing time: must not be offered if it would finish after closing.
- Staff on leave: no times offered.
- Two simultaneous bookings for the same time: one succeeds, one gets the friendly error.
- Deposit not paid within 10 minutes: time becomes free again.
- Cancel with the wrong code: refused.
- Booking in the past (by editing the form): refused on the server.

## Stretch goals

- Buffer time between appointments (e.g. 10 minutes to clean up).
- Recurring bookings (a weekly tutoring session).
- Packages and loyalty ("5th haircut free").
- Online reviews after the appointment.
- A **Google Calendar** sync for staff.

## Summary

- Store start **and** end; two ranges overlap when each starts before the other ends.
- Compute free start times per staff member from working hours, bookings and time off.
- Prevent double bookings on the server with a transaction and a row lock.
- Deposits via M-Pesa, automatic expiry, reminders and self-service cancellation reduce no-shows.

```quiz
Q: Complete the overlap rule: aStart < bEnd AND bStart < ___
A: aEnd
Q: Which booking status holds a time while the customer pays? (as in the table)
A: awaiting_deposit | awaiting deposit
Q: What is Kenya's UTC offset? (write like +3)
A: +3 | +03:00 | UTC+3 | 3 | +3:00
Q: Which tool runs the job that cancels unpaid bookings every few minutes? (one word)
A: cron | crontab | cron job
```
