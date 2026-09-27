<?php
// Client portal settings.
// 1. Copy this file to portal-config.php
// 2. Fill in your values (database from cPanel > MySQL Databases)
// 3. Upload it ONE FOLDER ABOVE public_html, next to mpesa-config.php. Never commit it.
return [
    // cPanel MySQL database, user and password
    'db_dsn'  => 'mysql:host=localhost;dbname=CPANELUSER_portal;charset=utf8mb4',
    'db_user' => 'CPANELUSER_portal',
    'db_pass' => 'DATABASE_PASSWORD',

    // Your Google OAuth client ID (public, the same one the contact form uses)
    'google_client_id' => '532239575183-c335bvpq88npc06qnc9e05srqlr96f71.apps.googleusercontent.com',

    // Google accounts that can manage everything in the portal
    'admin_emails' => ['marzleytechsolutionltd@gmail.com'],

    // Where uploaded files are kept: outside public_html so they are never public
    'storage_dir' => '/home/CPANELUSER/portal-files',

    // Email alerts (updates, invoices, approvals, support replies, certificates).
    // Use an address on your domain created in cPanel > Email Accounts. Leave empty to turn alerts off.
    'mail_from' => 'portal@marzleytechsolutions.co.ke',
    'site_url'  => 'https://marzleytechsolutions.co.ke',

    // Send email through your mailbox (recommended: far less spam than PHP mail()).
    // cPanel > Email Accounts > Connect Devices shows these values. Leave as null to use mail().
    'smtp' => [
        'host' => 'mail.marzleytechsolutions.co.ke',
        'port' => 465,                 // 465 = SSL, 587 = STARTTLS
        'user' => 'portal@marzleytechsolutions.co.ke',
        'pass' => 'MAILBOX_PASSWORD',
    ],

    // SMS through Africa's Talking (optional). Leave as null to send email only.
    // 'sms' => ['username' => 'YOUR_AT_USERNAME', 'api_key' => 'YOUR_AT_API_KEY', 'sender_id' => ''],
    'sms' => null,

    // Printed on invoices and receipts
    'business_name' => 'Marzley Tech Solutions',
    'kra_pin' => '',                   // e.g. P051234567X
    'etims' => false,                  // true once you issue eTIMS invoices

    // Sign out after this many idle minutes
    'admin_idle_minutes' => 30,
    'client_idle_minutes' => 240,

    // Nightly backups (cron.php backup): folder outside public_html, kept for 14 days
    'backup_dir' => '/home/CPANELUSER/portal-backups',
    'backup_keep_days' => 14,

    // 'production' on the live site, 'staging' on staging.marzleytechsolutions.co.ke
    'environment' => 'production',
];
