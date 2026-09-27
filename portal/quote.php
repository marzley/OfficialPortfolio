<?php
// Online quote: the client opens the private link, reads the quote and accepts it by typing
// their name. Accepting sets up their portal account, project and deposit invoice.
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
require __DIR__ . '/lib.php';
install_error_alerts('online quote');

$token = preg_replace('/[^a-f0-9]/', '', (string)($_GET['t'] ?? $_POST['t'] ?? ''));
$qt = strlen($token) === 48 ? q('SELECT * FROM quotes WHERE token = ?', [$token])->fetch() : null;
if (!$qt) {
    http_response_code(404);
    page_message('Quote not found', 'fa-file-circle-question', 'We couldn’t find this quote',
        '<p>The link may be incomplete. Please use the full link from your email, or <a href="https://wa.me/254745789590">message us on WhatsApp</a>.</p>');
}
$expired = $qt['valid_until'] && $qt['valid_until'] < date('Y-m-d') && $qt['status'] !== 'accepted';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && in_array($qt['status'], ['draft', 'sent'], true) && !$expired) {
    $typed = trim(preg_replace('/\s+/u', ' ', (string)($_POST['accept_name'] ?? '')));
    if (!rate_ok('quote', 10, 3600)) $error = 'Too many attempts. Please try again later.';
    elseif (mb_strlen($typed) < 3 || mb_strlen($typed) > 120) $error = 'Please type your full name to accept.';
    elseif (empty($_POST['agree'])) $error = 'Please tick the box to confirm you agree to the quote and our terms.';
    else {
        // Only one acceptance can win, even if the button is pressed twice
        $claimed = q("UPDATE quotes SET status = 'accepted', accepted_name = ?, accepted_at = ?, accepted_ip = ? WHERE id = ? AND status IN ('draft', 'sent')",
            [$typed, now(), substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45), $qt['id']])->rowCount();
        if ($claimed) {
            $items = json_decode($qt['items'], true) ?: [];
            $summary = "Accepted quote: " . implode('; ', array_map(fn($i) => $i['desc'] . ($i['qty'] > 1 ? " × {$i['qty']}" : ''), $items)) . '. Total KSh ' . number_format((int)$qt['total']) . '.';
            try {
                [$clientId, $projectId, $number, $deposit] = setup_client_project($qt['client_name'], $qt['client_email'], $qt['client_phone'], $qt['title'],
                    (int)$qt['total'], (int)$qt['deposit_percent'], 7, mb_substr($summary, 0, 2000));
            } catch (Throwable $e) {
                q("UPDATE quotes SET status = 'sent', accepted_name = NULL, accepted_at = NULL, accepted_ip = NULL WHERE id = ?", [$qt['id']]);
                throw $e;
            }
            q('UPDATE quotes SET client_id = ?, project_id = ? WHERE id = ?', [$clientId, $projectId, $qt['id']]);
            if ($qt['lead_id']) q("UPDATE leads SET status = 'won', client_id = ?, value = ?, updated_at = ? WHERE id = ?", [$clientId, $qt['total'], now(), $qt['lead_id']]);
            audit('quote_accepted', "{$qt['title']} KSh {$qt['total']} by $typed", $qt['client_email']);
            notify_admins("Quote accepted: {$qt['title']}", "{$qt['client_name']} accepted the quote “{$qt['title']}” for KSh " . number_format((int)$qt['total']) .
                ".\nTyped name: $typed\n" . ($number ? "Deposit invoice $number (KSh " . number_format($deposit) . ") was sent automatically.\n" : '') . "The client and project are in the portal.");
        }
        header('Location: quote.php?t=' . $token . '&accepted=1', true, 303);
        exit;
    }
}

page_open('Quote: ' . $qt['title']);
$items = json_decode($qt['items'], true) ?: [];
$deposit = (int)round($qt['total'] * $qt['deposit_percent'] / 100);
$org = config();
?>
<article class="public-card quote-doc">
    <header class="quote-head">
        <div>
            <p class="label">Quote</p>
            <h1><?= h($qt['title']) ?></h1>
            <p class="portal-meta">Prepared for <strong><?= h($qt['client_name']) ?></strong> · <?= h(date('j F Y', strtotime($qt['created_at']))) ?>
                <?= $qt['valid_until'] ? ' · Valid until ' . h(date('j F Y', strtotime($qt['valid_until']))) : '' ?></p>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-print hidden><i class="fa-solid fa-print" aria-hidden="true"></i> Save as PDF</button>
    </header>
    <div class="table-wrap">
        <table class="portal-table">
            <thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Amount</th></tr></thead>
            <tbody>
            <?php foreach ($items as $it): ?>
                <tr><td data-label="Item"><?= h($it['desc']) ?></td><td data-label="Qty" class="r"><?= (int)$it['qty'] ?></td>
                    <td data-label="Price" class="r">KSh <?= number_format((int)$it['price']) ?></td><td data-label="Amount" class="r">KSh <?= number_format($it['qty'] * $it['price']) ?></td></tr>
            <?php endforeach; ?>
            </tbody>
            <tfoot>
                <tr><th scope="row" colspan="3">Total</th><td class="r"><strong>KSh <?= number_format((int)$qt['total']) ?></strong></td></tr>
                <?php if ($deposit > 0): ?><tr><th scope="row" colspan="3">Deposit to start (<?= (int)$qt['deposit_percent'] ?>%)</th><td class="r">KSh <?= number_format($deposit) ?></td></tr><?php endif; ?>
            </tfoot>
        </table>
    </div>
    <?php if (trim($qt['notes']) !== ''): ?><div class="quote-notes"><h2>Notes</h2><p><?= nl2br(h($qt['notes'])) ?></p></div><?php endif; ?>
    <p class="portal-meta">The deposit counts toward the total. The balance is paid in stages as the project progresses. See our <a href="../terms">terms of service</a>.
        <?= $org['kra_pin'] ? 'KRA PIN ' . h($org['kra_pin']) . '.' : '' ?></p>

    <?php if ($qt['status'] === 'accepted'): ?>
        <div class="quote-accepted" role="status">
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <div><strong>Accepted by <?= h($qt['accepted_name']) ?> on <?= h(date('j F Y, H:i', strtotime($qt['accepted_at']))) ?> EAT.</strong>
                <p>Thank you! Your client portal is ready: sign in with Google using <strong><?= h($qt['client_email']) ?></strong> to follow your project<?= $deposit > 0 ? ' and pay the deposit by M-Pesa or card' : '' ?>.</p>
                <a class="btn btn-solid" href="./">Open the client portal</a></div>
        </div>
    <?php elseif ($qt['status'] === 'declined'): ?>
        <p class="portal-error">This quote was declined. <a href="https://wa.me/254745789590">Message us</a> if you’d like a new one.</p>
    <?php elseif ($expired): ?>
        <p class="portal-error">This quote expired on <?= h(date('j F Y', strtotime($qt['valid_until']))) ?>. <a href="https://wa.me/254745789590">Message us on WhatsApp</a> for an updated quote.</p>
    <?php else: ?>
        <form class="form quote-accept" method="post" action="quote.php" novalidate>
            <input type="hidden" name="t" value="<?= h($token) ?>" />
            <h2 class="full">Accept this quote</h2>
            <?php if ($error): ?><p class="portal-error full" role="alert"><?= h($error) ?></p><?php endif; ?>
            <div class="field full"><label for="accept-name">Type your full name to sign</label>
                <input id="accept-name" name="accept_name" maxlength="120" autocomplete="name" required value="<?= h($_POST['accept_name'] ?? '') ?>" /></div>
            <label class="check full"><input type="checkbox" name="agree" value="1" required /> <span>I accept this quote and the <a href="../terms">terms of service</a> on behalf of <?= h($qt['client_name']) ?>.</span></label>
            <div class="form-foot"><button type="submit" class="btn btn-solid"><i class="fa-solid fa-signature" aria-hidden="true"></i> Accept quote</button>
                <a class="btn btn-ghost" href="https://wa.me/254745789590?text=<?= rawurlencode('Hello Marzley, I have a question about the quote: ' . $qt['title']) ?>">Ask a question</a></div>
        </form>
    <?php endif; ?>
</article>
<?php
page_close();
