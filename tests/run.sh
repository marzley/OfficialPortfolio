#!/bin/sh
# Runs the portal test suite against a throwaway SQLite database.
#   sh tests/run.sh
# Needs PHP 8.1+ (pdo_sqlite, curl) and Node 18+.
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)
WORK=$(mktemp -d)
cd "$ROOT"
for port in 8898 8899; do
  if curl -s -o /dev/null "http://127.0.0.1:$port/"; then echo "Port $port is already in use; stop that server first."; exit 1; fi
done
php tests/make-db.php "$WORK/portal.db" > /dev/null
mkdir -p "$WORK/files" "$WORK/backups" "$WORK/private" "$WORK/fake"
cat > "$WORK/portal-config.php" <<CFG
<?php return [
  'db_dsn' => 'sqlite:$WORK/portal.db',
  'google_client_id' => 'test-client.apps.googleusercontent.com',
  'admin_emails' => ['Admin@Example.com'],
  'storage_dir' => '$WORK/files',
  'backup_dir' => '$WORK/backups',
  'dev_login' => true,
  'mail_from' => 'portal@marzleytechsolutions.co.ke',
  'kra_pin' => 'P051234567X',
  'paystack' => ['secret_key' => 'sk_test_fake', 'base' => 'http://127.0.0.1:8898/paystack'],
  'chat' => ['api_key' => 'sk-ant-test', 'base_url' => 'http://127.0.0.1:8898', 'per_visitor_hour' => 5],
  'offsite_backup' => ['endpoint' => 'http://127.0.0.1:8898', 'region' => 'us-east-1', 'bucket' => 'test-bucket', 'key' => 'TESTKEY', 'secret' => 'TESTSECRET', 'prefix' => 'portal'],
];
CFG
cat > "$WORK/mpesa-config.php" <<CFG
<?php return ['consumer_key' => 'k', 'consumer_secret' => 's', 'shortcode' => '174379', 'till_number' => '6095737', 'passkey' => 'p',
  'callback_secret' => 'testsecret', 'callback_url' => 'https://example.com/callback.php?key=testsecret', 'skip_confirm' => true];
CFG
export PORTAL_CONFIG="$WORK/portal-config.php" MPESA_CONFIG="$WORK/mpesa-config.php" PORTAL_PRIVATE_DIR="$WORK/private" FAKE_DIR="$WORK/fake"
php -S 127.0.0.1:8898 tests/fake-services.php > "$WORK/fake.log" 2>&1 &
FAKE=$!
php -d "sendmail_path=tee -a $WORK/mail.txt" -S 127.0.0.1:8899 -t "$ROOT" tests/router.php > "$WORK/server.log" 2>&1 &
SERVER=$!
trap 'kill $FAKE $SERVER 2>/dev/null; rm -rf "$WORK"' EXIT
for i in 1 2 3 4 5 6 7 8 9 10; do curl -s -o /dev/null http://127.0.0.1:8899/portal/up.php && break; sleep 0.3; done
node tests/chat-match.test.js
if ! node tests/portal.test.js "$WORK"; then
  echo "--- server errors ---"
  grep -iE "error|warning|fatal|exception" "$WORK/server.log" "$WORK/fake.log" | tail -30 || true
  exit 1
fi
