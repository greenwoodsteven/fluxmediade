<?php
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/audit.php';
guard();
if (random_int(1, 10) === 1) audit_cleanup();
$f = ['name' => line('name', 100), 'email' => line('email', 200), 'url' => line('url', 300), 'terms' => line('terms', 200)];
require_fields($f, ['name', 'email', 'url', 'terms']);
if (!pow_verify()) respond(400, ['ok' => false, 'error' => 'pow']);
$host = audit_domain($f['url']);
if ($host === null) respond(422, ['ok' => false, 'error' => 'url']);
if (domain_recent($host)) respond(409, ['ok' => false, 'error' => 'domain']);
if (capacity_full()) respond(503, ['ok' => false, 'error' => 'capacity']);

// Nothing reaches the studio until the visitor has confirmed the e-mail address (see confirm.php).
$token = pending_save([
    'fields' => [
        'Name' => $f['name'], 'E-Mail' => $f['email'], 'URL' => $f['url'], 'Suchbegriffe' => $f['terms'],
        'Branche' => line('business', 100), 'Plattform' => line('platform', 100), 'Budget' => line('budget', 100), 'Quelle' => line('source', 100),
    ],
    'host' => $host, 'lang' => lang(), 'ref' => line('ref', 50),
]);
$base = rtrim(config()['base_url'] ?? 'https://www.fluxmedia.de', '/');
confirm_mail($f['name'], $f['email'], "$base/api/confirm.php?t=$token", lang(), $f['url'], $f['terms']);
respond(200, ['ok' => true]);
