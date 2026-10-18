<?php
// Copy to api/config.php on the server (git-ignored) or point FLUX_CONFIG at a file OUTSIDE the webroot.
// Never commit real credentials.
return [
    'allowed_origins' => ['https://www.fluxmedia.de', 'https://fluxmedia.de'],
    'to'        => 'greenwood@fluxmedia.de',
    'smtp' => [
        'host'       => 'mxe824.netcup.net',
        'port'       => 465,
        'encryption' => 'ssl',            // 'ssl' | 'tls'
        'username'   => 'support@fluxmedia.de',
        'password'   => 'CHANGE_ME',
        'from_email' => 'support@fluxmedia.de',
        'from_name'  => 'Fluxmedia',
    ],
    'rate_limit' => ['max' => 5, 'window' => 3600],   // per IP hash
    // Persistent state of the free analysis (pending confirmations, domain history, weekly cap) and the
    // rate limiter. Use a folder OUTSIDE the release folder, e.g. /path/to/fluxmedia/shared/storage,
    // otherwise every deploy resets the limits. null = api/storage (denied by .htaccess, reset by deploys).
    'storage_dir' => null,
    'base_url'    => 'https://www.fluxmedia.de',      // used in the confirmation link
    'secret'      => 'CHANGE_ME_LONG_RANDOM',         // signs proof-of-work challenges (openssl rand -hex 32)
    'audit'       => ['weekly_cap' => 10, 'domain_days' => 90, 'pending_hours' => 48],
    // 'mail_dump' => '/tmp/mails',                   // testing only: write mails to files instead of sending
];
