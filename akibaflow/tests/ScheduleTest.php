<?php
use Akiba\Services\ScheduleEngine as S;

$v = fn(array $o) => $o + ['frequency' => 'daily', 'weekday' => null, 'month_day' => null, 'interval_days' => null, 'anchor_date' => null, 'effective_from' => '2026-01-01'];

test('schedule: daily yields every date inclusive', function () use ($v) {
    eq(['2026-01-05', '2026-01-06', '2026-01-07'], S::dueDates($v([]), '2026-01-05', '2026-01-07'));
    eq([], S::dueDates($v([]), '2026-01-08', '2026-01-07'));
});

test('schedule: weekly only on the configured weekday (Mondays)', function () use ($v) {
    $d = S::dueDates($v(['frequency' => 'weekly', 'weekday' => 1]), '2026-01-01', '2026-01-31');
    eq(['2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26'], $d);
});

test('schedule: biweekly keeps phase from anchor even when range starts later', function () use ($v) {
    $d = S::dueDates($v(['frequency' => 'biweekly', 'anchor_date' => '2026-01-05']), '2026-01-10', '2026-02-20');
    eq(['2026-01-19', '2026-02-02', '2026-02-16'], $d);
});

test('schedule: monthly day 5, and month-end clamping (31st → last valid day)', function () use ($v) {
    eq(['2026-01-05', '2026-02-05', '2026-03-05'], S::dueDates($v(['frequency' => 'monthly', 'month_day' => 5]), '2026-01-01', '2026-03-31'));
    eq(['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30'], S::dueDates($v(['frequency' => 'monthly', 'month_day' => 31]), '2026-01-01', '2026-04-30'));
    eq(['2028-02-29'], S::dueDates($v(['frequency' => 'monthly', 'month_day' => 30]), '2028-02-01', '2028-02-29'), 'leap year');
    eq(['2026-02-28', '2026-03-31'], S::dueDates($v(['frequency' => 'monthly', 'month_day' => 0]), '2026-02-01', '2026-03-31'), 'last day');
});

test('schedule: monthly respects range start (joined after the due day → next month)', function () use ($v) {
    eq(['2026-02-05'], S::dueDates($v(['frequency' => 'monthly', 'month_day' => 5]), '2026-01-20', '2026-02-10'));
});

test('schedule: custom interval and one-time', function () use ($v) {
    eq(['2026-01-01', '2026-01-11', '2026-01-21'], S::dueDates($v(['frequency' => 'custom_days', 'interval_days' => 10, 'anchor_date' => '2026-01-01']), '2026-01-01', '2026-01-25'));
    eq(['2026-03-01'], S::dueDates($v(['frequency' => 'one_time', 'anchor_date' => '2026-03-01']), '2026-01-01', '2026-12-31'));
    eq([], S::dueDates($v(['frequency' => 'one_time', 'anchor_date' => '2026-03-01']), '2026-03-02', '2026-12-31'));
});

test('schedule: time-zone boundary — 21:30 UTC is already tomorrow in Nairobi', function () {
    Akiba\Core\Clock::freeze('2026-01-05 21:30:00');
    eq('2026-01-05', Akiba\Core\Clock::today('UTC'));
    eq('2026-01-06', Akiba\Core\Clock::today('Africa/Nairobi'));
    Akiba\Core\Clock::freeze(null);
});

test('money: parse and format without floats', function () {
    eq(10050, Akiba\Core\Money::parse('100.50'));
    eq(100000, Akiba\Core\Money::parse('1,000'));
    eq(null, Akiba\Core\Money::parse('10.555'));
    eq(null, Akiba\Core\Money::parse('-5'));
    eq('KSh 1,250.50', Akiba\Core\Money::fmt(125050));
    eq('KSh 300', Akiba\Core\Money::fmt(30000));
    eq('+254712345678', Akiba\Core\Phone::normalize('0712 345 678'));
    eq('+254112345678', Akiba\Core\Phone::normalize('+254112345678'));
    eq(null, Akiba\Core\Phone::normalize('0912345678'));
});
