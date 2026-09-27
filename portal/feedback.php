<?php
// After-launch feedback: 1–5 stars. Happy clients are invited to leave a Google review;
// anyone less happy is asked what went wrong, privately.
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
require __DIR__ . '/lib.php';
install_error_alerts('feedback page');

$token = preg_replace('/[^a-f0-9]/', '', (string)($_GET['t'] ?? $_POST['t'] ?? ''));
$fb = strlen($token) === 48 ? q('SELECT f.*, p.title, c.name FROM feedback f JOIN projects p ON p.id = f.project_id JOIN clients c ON c.id = f.client_id WHERE f.token = ?', [$token])->fetch() : null;
if (!$fb) {
    http_response_code(404);
    page_message('Feedback', 'fa-link-slash', 'This link doesn’t work', '<p>Please use the full link from your email or SMS.</p>');
}
$review = trim((string)(site_json()['googleReviewUrl'] ?? ''));
$reviewButton = preg_match('#^https://#', $review)
    ? '<p><a class="btn btn-solid" href="' . h($review) . '" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-google" aria-hidden="true"></i> Leave a Google review</a></p><p class="portal-meta">It takes a minute and helps other businesses find us.</p>'
    : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$fb['submitted_at']) {
    $rating = (int)($_POST['rating'] ?? 0);
    $comment = mb_substr(trim((string)($_POST['comment'] ?? '')), 0, 4000);
    if ($rating >= 1 && $rating <= 5 && rate_ok('feedback', 10, 3600)) {
        $ok = !empty($_POST['publish_ok']) ? 1 : 0;
        $saved = q('UPDATE feedback SET rating = ?, comment = ?, publish_ok = ?, submitted_at = ? WHERE id = ? AND submitted_at IS NULL', [$rating, $comment, $ok, now(), $fb['id']])->rowCount();
        if ($saved) {
            audit('feedback', "{$fb['title']}: $rating/5", 'client');
            notify_admins(($rating <= 3 ? 'Needs attention: ' : '') . "{$fb['name']} rated “{$fb['title']}” $rating/5",
                "{$fb['name']} rated their project “{$fb['title']}” $rating out of 5." . ($comment !== '' ? "\n\nComment: $comment" : '') . ($rating <= 3 ? "\n\nPlease call them today." : ''));
        }
        header('Location: feedback.php?t=' . $token, true, 303);
        exit;
    }
}

if ($fb['submitted_at']) {
    $r = (int)$fb['rating'];
    if ($r >= 4) page_message('Thank you', 'fa-heart', 'Thank you, ' . explode(' ', $fb['name'])[0] . '!',
        '<p>We’re so glad you’re happy with “' . h($fb['title']) . '”.</p>' . ($reviewButton ?: '<p>If you know anyone who needs a website or system, send them our way.</p>'));
    page_message('Thank you', 'fa-handshake', 'Thank you for telling us',
        '<p>We’re sorry it wasn’t better. Kelvin will personally call you to put things right.</p><p><a class="btn btn-solid" href="https://wa.me/254745789590">WhatsApp us now</a></p>');
}

page_open('How did we do?');
?>
<section class="public-card public-center">
    <span class="public-icon"><i class="fa-solid fa-rocket" aria-hidden="true"></i></span>
    <h1>“<?= h($fb['title']) ?>” is live!</h1>
    <p>How was working with Marzley Tech Solutions?</p>
    <form class="feedback-form" method="post" action="feedback.php" novalidate>
        <input type="hidden" name="t" value="<?= h($token) ?>" />
        <fieldset class="stars">
            <legend class="sr-only">Your rating out of 5</legend>
            <?php for ($i = 5; $i >= 1; $i--): ?>
                <input type="radio" id="star<?= $i ?>" name="rating" value="<?= $i ?>" required /><label for="star<?= $i ?>" title="<?= $i ?> star<?= $i > 1 ? 's' : '' ?>"><i class="fa-solid fa-star" aria-hidden="true"></i><span class="sr-only"><?= $i ?> star<?= $i > 1 ? 's' : '' ?></span></label>
            <?php endfor; ?>
        </fieldset>
        <div class="field"><label for="fb-comment">Anything you’d like to tell us? (optional)</label><textarea id="fb-comment" name="comment" rows="4" maxlength="4000"></textarea></div>
        <label class="check"><input type="checkbox" name="publish_ok" value="1" /> <span>You may show my comment and name (<?= h($fb['name']) ?>) on your website.</span></label>
        <button type="submit" class="btn btn-solid">Send</button>
    </form>
</section>
<?php
page_close();
