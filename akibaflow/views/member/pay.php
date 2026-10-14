<?php $cur = $q['currency']; $bal = $q['balance']; $gid = (int)$g['group_id']; ?>
<div class="page-head"><h1>Contribute now</h1></div>
<div class="grid cols-2">
<div class="card">
  <h2><?= e($g['group_name']) ?></h2>
  <dl class="kv">
    <dt>Unpaid contributions</dt><dd><?= $bal['unpaid_count'] ?></dd>
    <dt>Outstanding contributions</dt><dd><?= money($bal['outstanding_contrib'], $cur) ?></dd>
    <?php if ($bal['outstanding_penalty']): ?><dt>Approved late fees</dt><dd><?= money($bal['outstanding_penalty'], $cur) ?></dd><?php endif; ?>
    <dt>Due today</dt><dd><?= money($bal['due_today'], $cur) ?></dd>
    <dt>Credit held</dt><dd><?= money($bal['credit'], $cur) ?></dd>
    <dt>Total to clear all dues</dt><dd><?= money($q['clear_all'], $cur) ?></dd>
  </dl>
  <p class="small muted mt">Amounts are calculated by AkibaFlow from your actual obligations. Payments are applied to your oldest dues first.</p>
</div>
<form class="card" method="post" action="/g/<?= $gid ?>/pay" id="pay-form">
  <?= csrf_field() ?><input type="hidden" name="idem" value="<?= e($idem) ?>">
  <fieldset><legend>Choose what to pay</legend>
    <div class="pay-options">
      <?php if ($q['pay_today'] > 0): ?><label class="pay-option"><input type="radio" name="option" value="today" required> <strong>PAY TODAY — <?= money($q['pay_today'], $cur) ?></strong></label><?php endif; ?>
      <?php if ($q['clear_all'] > 0): ?><label class="pay-option"><input type="radio" name="option" value="clear_all" <?= $q['pay_today'] <= 0 ? 'required checked' : '' ?>> <strong>CLEAR ALL DUES — <?= money($q['clear_all'], $cur) ?></strong></label><?php endif; ?>
      <?php if ($q['advance']): ?><label class="pay-option"><input type="radio" name="option" value="advance" <?= $q['clear_all'] <= 0 ? 'required' : '' ?>> Pay in advance — <strong><?= money($q['advance']['amount'], $cur) ?></strong> <span class="muted small">(contribution due <?= e(d($q['advance']['due_date'], 'D d M')) ?>)</span></label><?php endif; ?>
      <?php if ($q['max_custom'] > 0): ?><label class="pay-option"><input type="radio" name="option" value="custom"> Enter another amount <span class="muted small">(up to <?= money($q['max_custom'], $cur) ?><?= $q['allow_partial'] ? '' : '; whole contributions only' ?>)</span></label>
        <div id="custom-wrap" hidden><label for="ca">Amount (<?= e($cur) ?>)</label><input id="ca" name="custom_amount" inputmode="decimal" placeholder="e.g. 250"><p class="help">M-PESA accepts whole shillings.</p></div><?php endif; ?>
    </div>
    <?php if ($q['pay_today'] <= 0 && $q['clear_all'] <= 0 && !$q['advance'] && $q['max_custom'] <= 0): ?><p class="empty">You have nothing to pay right now. 🎉</p><?php endif; ?>
  </fieldset>
  <div class="field"><label for="phone">M-PESA phone number</label><input id="phone" name="phone" type="tel" inputmode="tel" required placeholder="0712 345 678" value="<?= e($phone) ?>"><p class="help">You'll get a prompt on this phone to enter your M-PESA PIN. This phone number does not need to be registered with AkibaFlow.</p></div>
  <?php if ($q['pay_today'] > 0 || $q['clear_all'] > 0 || $q['advance'] || $q['max_custom'] > 0): ?><button class="btn primary block" type="submit" data-busy-text="Sending prompt…">Pay with M-PESA</button><?php endif; ?>
  <?php if ($sandbox): ?><p class="alert warn mt">Development mode: payments go to the built-in <a href="/sandbox/phone">sandbox phone simulator</a>, not to Safaricom.</p><?php endif; ?>
</form>
</div>
