<?php
require __DIR__ . '/lib/bootstrap.php';
guard();
$f = ['name' => line('name', 100), 'email' => line('email', 200), 'url' => line('url', 300), 'terms' => line('terms', 200)];
require_fields($f, ['name', 'email', 'url', 'terms']);
notify('Analyse-Anfrage: ' . $f['url'], [
    'Name' => $f['name'], 'E-Mail' => $f['email'], 'URL' => $f['url'], 'Suchbegriffe' => $f['terms'],
    'Branche' => line('business', 100), 'Plattform' => line('platform', 100), 'Budget' => line('budget', 100), 'Quelle' => line('source', 100),
], $f['name'], $f['email'], auto_reply($f['name'], 'analysis'));
respond(200, ['ok' => true]);
