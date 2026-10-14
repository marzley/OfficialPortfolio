<div class="page-head"><h1>Create a group</h1></div>
<form class="card" method="post" action="/groups/new" novalidate>
  <?= csrf_field() ?>
  <div class="form-grid">
    <div class="field"><label for="name">Group name</label><input id="name" name="name" required value="<?= old('name') ?>"><?= err($errors, 'name') ?></div>
    <div class="field"><label for="purpose">Purpose</label><input id="purpose" name="purpose" placeholder="e.g. Welfare, Land purchase" value="<?= old('purpose') ?>"></div>
    <div class="field"><label for="currency">Currency</label><input id="currency" name="currency" value="<?= old('currency', 'KES') ?>" maxlength="3"><?= err($errors, 'currency') ?></div>
    <div class="field"><label for="timezone">Time zone</label><input id="timezone" name="timezone" value="<?= old('timezone', 'Africa/Nairobi') ?>"><p class="help">Contribution days follow this time zone.</p><?= err($errors, 'timezone') ?></div>
    <div class="field"><label for="contact_email">Contact email</label><input id="contact_email" type="email" name="contact_email" value="<?= old('contact_email') ?>"><?= err($errors, 'contact_email') ?></div>
    <div class="field"><label for="contact_phone">Contact phone</label><input id="contact_phone" type="tel" name="contact_phone" value="<?= old('contact_phone') ?>"></div>
  </div>
  <div class="field"><label for="description">Description</label><textarea id="description" name="description"><?= old('description') ?></textarea></div>
  <div class="field"><label for="mm">Joining</label><select id="mm" name="membership_mode"><option value="invite_only">Invitation only</option><option value="request_to_join">Members may request to join (needs approval)</option></select></div>
  <button class="btn primary" type="submit" data-busy-text="Creating…">Create group</button>
</form>
