<?php
// Copy to api/config.php on the server (git-ignored) or point FLUX_CONFIG at a file OUTSIDE the webroot.
// Never commit real credentials.
return [
    'allowed_origins' => ['https://www.fluxmedia.de', 'https://fluxmedia.de'],
    'to'        => 'info@fluxmedia.de',
    'owner'     => 'Steven Greenwood',   // shown in the signature and footer of automatic replies
    'owner_address_en' => 'Sandbühl 31, 88662 Überlingen, Germany',   // optional: postal address in the mail footer (as in the Impressum)
    'owner_address_de' => 'Sandbühl 31, 88662 Überlingen',   // optional: postal address in the mail footer (as in the Impressum)
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
    // rate limiter. Use an absolute path (as PHP sees it) to a folder that is not served and not replaced by a
    // deploy: release folders: <DEPLOY_PATH>/shared/storage; git pull + FTP: <repo>/fluxmedia-storage (git-ignored).
    // The path must be allowed by open_basedir. null = api/storage (denied by .htaccess, reset by deploys).
    'storage_dir' => null,
    'base_url'    => 'https://www.fluxmedia.de',      // used in the confirmation link
    'secret'      => 'CHANGE_ME_LONG_RANDOM',         // signs proof-of-work challenges (openssl rand -hex 32)
    'audit'       => ['weekly_cap' => 10, 'domain_days' => 90, 'pending_hours' => 48],
    // 'log_timing' => true,   // log how long each mail takes to the PHP error log (no personal data)
    // 'mail_dump' => '/tmp/mails',                   // testing only: write mails to files instead of sending
];
