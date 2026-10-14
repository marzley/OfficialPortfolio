<?php
declare(strict_types=1);
// Global template helpers.
use Akiba\Core\{Clock, Money, Session};

function e(mixed $v): string { return htmlspecialchars((string)$v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function csrf_field(): string { return '<input type="hidden" name="_csrf" value="' . e(Session::csrf()) . '">'; }
function money(int $minor, string $cur = 'KES'): string { return Money::fmt($minor, $cur); }
function dt(?string $utc, string $tz = 'Africa/Nairobi', string $fmt = 'd M Y, H:i'): string { return Clock::localDateTime($utc, $tz, $fmt); }
function d(?string $date, string $fmt = 'D, d M Y'): string { return $date ? (new DateTimeImmutable($date))->format($fmt) : '—'; }
function old(string $k, string $default = ''): string { return e($_POST[$k] ?? $default); }
function err(array $errors, string $k): string { return isset($errors[$k]) ? '<p class="field-error" role="alert">' . e($errors[$k]) . '</p>' : ''; }

function status_label(string $s): string
{
    return ['upcoming' => 'Upcoming', 'due' => 'Due', 'partially_paid' => 'Partially paid', 'overdue' => 'Overdue', 'paid' => 'Paid', 'waived' => 'Waived', 'cancelled' => 'Cancelled',
        'pending' => 'Awaiting confirmation', 'succeeded' => 'Successful', 'failed' => 'Failed', 'unknown' => 'Needs reconciliation', 'created' => 'Starting', 'posted' => 'Posted', 'reversed' => 'Reversed',
        'proposed' => 'Proposed', 'approved' => 'Approved', 'rejected' => 'Rejected'][$s] ?? ucfirst(str_replace('_', ' ', $s));
}
function badge(string $s): string
{
    $cls = match ($s) { 'paid', 'succeeded', 'posted', 'approved', 'active' => 'ok', 'overdue', 'failed', 'rejected', 'reversed', 'suspended' => 'bad',
        'due', 'partially_paid', 'pending', 'created', 'unknown', 'proposed' => 'warn', default => 'neutral' };
    $icon = match ($cls) { 'ok' => '✓', 'bad' => '!', 'warn' => '●', default => '○' };
    return '<span class="badge badge-' . $cls . '"><span aria-hidden="true">' . $icon . '</span> ' . e(status_label($s)) . '</span>';
}
function roleLabel(string $r): string { return ['chairperson' => 'Chairperson', 'treasurer' => 'Treasurer', 'secretary' => 'Secretary', 'member' => 'Member', 'auditor' => 'Auditor'][$r] ?? $r; }
