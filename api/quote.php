<?php
require __DIR__ . '/lib/bootstrap.php';
guard();
$f = ['name' => line('name', 100), 'email' => line('email', 200), 'url' => line('url', 300)];
require_fields($f, ['name', 'email']);
$de = lang() === 'de';
// Only the non-personal answers go back to the visitor (no name, address, URL or free text)
$recap = [
    ($de ? 'Bedarf' : 'Need') => line('need'), ($de ? 'Website vorhanden' : 'Has a website') => line('site'),
    ($de ? 'Plattform' : 'Platform') => line('platform_existing') ?: line('platform') ?: line('platform_other'),
    ($de ? 'Zugang' : 'Access') => line('access'), ($de ? 'Umfang' : 'Scope') => line('scope'),
];
notify('[quote] Angebotsanfrage von ' . $f['name'], [
    'Name' => $f['name'], 'E-Mail' => $f['email'], 'URL' => $f['url'], 'Bedarf' => line('need'), 'Website vorhanden' => line('site'), 'Plattform (vorhanden)' => line('platform_existing'), 'Zugang' => line('access'),
    'Plattform (gewünscht)' => line('platform'), 'Plattform (andere)' => line('platform_other'),
    'Umfang' => line('scope'), 'Nachricht' => text('message', 2000),
], $f['name'], $f['email'], auto_reply($f['name'], 'quote', $recap));
respond(200, ['ok' => true]);
