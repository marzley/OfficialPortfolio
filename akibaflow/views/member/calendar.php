<div class="page-head"><h1>Contribution calendar</h1></div>
<div class="card" id="calendar" data-gid="<?= (int)$g['group_id'] ?>" data-month="<?= e($month) ?>">
  <div class="cal-head"><button class="btn small ghost" id="cal-prev" type="button" aria-label="Previous month">←</button><strong id="cal-title" aria-live="polite"></strong><button class="btn small ghost" id="cal-next" type="button" aria-label="Next month">→</button></div>
  <div class="cal" id="cal-grid"></div>
  <div class="legend"><?php foreach (['paid', 'due', 'overdue', 'partially_paid', 'upcoming', 'waived'] as $s): ?><span><?= badge($s) ?></span><?php endforeach; ?></div>
  <div id="cal-detail" class="mt muted" aria-live="polite">Loading…</div>
</div>
<noscript><div class="alert warn">The calendar needs JavaScript. Your full list is under <a href="/g/<?= (int)$g['group_id'] ?>/history">Contribution history</a>.</div></noscript>
