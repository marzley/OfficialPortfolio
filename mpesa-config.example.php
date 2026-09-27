<?php
// M-Pesa (Safaricom Daraja) settings for stkpush.php.
// 1. Copy this file to mpesa-config.php
// 2. Fill in your values from https://developer.safaricom.co.ke (Go Live app)
// 3. Upload it ONE FOLDER ABOVE public_html so it can never be downloaded.
// Never commit mpesa-config.php to git.
return [
    'consumer_key'    => 'YOUR_CONSUMER_KEY',
    'consumer_secret' => 'YOUR_CONSUMER_SECRET',
    'shortcode'       => 'YOUR_BUSINESS_SHORTCODE',
    'till_number'     => 'YOUR_TILL_NUMBER',
    'passkey'         => 'YOUR_PASSKEY',
    'callback_url'    => 'https://pixel.gatangatvc.ac.ke/callback.php', // your current callback
];
