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
];
