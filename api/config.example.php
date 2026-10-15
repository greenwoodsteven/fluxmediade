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
    'storage_dir' => null,                            // null = system temp dir
];
