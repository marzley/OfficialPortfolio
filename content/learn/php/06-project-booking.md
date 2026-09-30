---
slug: project-booking-system
title: Project: an appointment booking system
---
# Project: an appointment booking system

Salons, clinics, garages and tutors all need the same thing: customers pick a service and a time, the business sees the bookings, and nobody gets double-booked. In this project you'll plan and build one, using everything from the PHP tutorial.

## 1. Plan the features

**Customers can:**

- See services with prices and durations.
- Pick a date and see only the free time slots.
- Book with their name and phone number and get a confirmation code.

**The owner can:**

- Log in, see today's bookings, mark them done or cancelled.

## 2. Design the database

```sql
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  minutes INT NOT NULL
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code CHAR(6) NOT NULL UNIQUE,
  service_id INT NOT NULL,
  customer VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  starts_at DATETIME NOT NULL,
  status ENUM('booked','done','cancelled') NOT NULL DEFAULT 'booked',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id),
  UNIQUE KEY one_booking_per_slot (starts_at)          -- the database itself prevents double booking
);

INSERT INTO services (name, price, minutes) VALUES
  ('Haircut', 300, 30), ('Braiding', 2500, 120), ('Manicure', 800, 60);
```

The `UNIQUE` key on `starts_at` means even if two people click "Book" at the same second, only one succeeds.

## 3. The logic: working out free slots

This part is pure PHP, so you can run it here. The shop opens 8:00–17:00 with 30-minute slots:

```try-php
<?php
function slots(string $date, string $open = '08:00', string $close = '17:00', int $step = 30): array {
    $out = [];
    $t = strtotime("$date $open");
    $end = strtotime("$date $close");
    while ($t < $end) {
        $out[] = date('H:i', $t);
        $t += $step * 60;
    }
    return $out;
}

function freeSlots(string $date, array $booked): array {
    $all = slots($date);
    return array_values(array_diff($all, $booked));
}

// pretend these came from: SELECT TIME_FORMAT(starts_at, '%H:%i') FROM bookings WHERE DATE(starts_at) = ? AND status = 'booked'
$booked = ['09:00', '09:30', '13:00'];
$free = freeSlots('2026-10-05', $booked);
echo count($free), " free slots on 5 Oct\n";
echo implode(' ', array_slice($free, 0, 6)), " ...\n";

function bookingCode(): string {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';     // no 0/O or 1/I to avoid confusion
    $code = '';
    for ($i = 0; $i < 6; $i++) $code .= $chars[random_int(0, strlen($chars) - 1)];
    return $code;
}
echo "Your booking code: ", bookingCode(), "\n";

function validPhone(string $p): ?string {
    $d = preg_replace('/\D/', '', $p);
    if (preg_match('/^254([17]\d{8})$/', $d, $m)) $d = '0' . $m[1];
    return preg_match('/^0[17]\d{8}$/', $d) ? $d : null;
}
var_dump(validPhone('+254 712 345 678'), validPhone('12345'));
```

## 4. Saving a booking safely

```php
<?php
require __DIR__ . '/db.php';
$phone = validPhone($_POST['phone'] ?? '');
$name = trim($_POST['name'] ?? '');
$serviceId = (int)($_POST['service_id'] ?? 0);
$start = ($_POST['date'] ?? '') . ' ' . ($_POST['time'] ?? '') . ':00';

if (!$phone || $name === '' || !strtotime($start) || strtotime($start) < time()) {
    exit('Please check your details and choose a future time.');
}
try {
    $code = bookingCode();
    $stmt = $pdo->prepare('INSERT INTO bookings (code, service_id, customer, phone, starts_at) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$code, $serviceId, $name, $phone, $start]);
    echo "Booked! Your code is $code. We'll see you on " . date('D d M, g:i a', strtotime($start));
} catch (PDOException $e) {
    if ($e->errorInfo[1] === 1062) {            // MySQL "duplicate key": slot just taken
        exit('Sorry, that time was just booked. Please choose another.');
    }
    throw $e;
}
```

## 5. The owner's dashboard

- Protect it with the login from the *Sessions and login* lesson.
- Show today's bookings: `SELECT b.*, s.name AS service FROM bookings b JOIN services s ON s.id = b.service_id WHERE DATE(starts_at) = CURDATE() ORDER BY starts_at`.
- Buttons (POST forms with a CSRF token) to mark **done** or **cancelled**.

## 6. Going further

| Feature | How |
|---|---|
| SMS confirmation | An SMS API (e.g. Africa's Talking) after saving |
| Deposit to secure the slot | M-Pesa STK Push (see the M-Pesa lesson), confirm on callback |
| Reminders | A cron job each morning sends SMS for tomorrow's bookings |
| Multiple staff | Add a `staff` table and make the unique key `(staff_id, starts_at)` |
| Calendar view | FullCalendar (JavaScript) fed by a JSON API |

```quiz
Q: What database feature prevents two bookings for the same time slot? (one word)
A: unique | UNIQUE key | unique key
Q: What MySQL error number means a duplicate key?
A: 1062
Q: Which PHP function returns the values in one array that are not in another?
A: array_diff | array_diff()
Q: Which function gives secure random numbers for codes?
A: random_int | random_int()
```
