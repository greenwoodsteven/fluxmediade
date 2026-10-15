<?php
require __DIR__ . '/lib/bootstrap.php';
guard();
$f = ['name' => line('name', 100), 'email' => line('email', 200), 'url' => line('url', 300)];
require_fields($f, ['name', 'email']);
notify('Angebotsanfrage von ' . $f['name'], [
    'Name' => $f['name'], 'E-Mail' => $f['email'], 'URL' => $f['url'], 'Bedarf' => line('need'), 'Plattform' => line('platform'),
    'Umfang' => line('scope'), 'Nachricht' => text('message', 2000),
], $f['name'], $f['email'], auto_reply($f['name'], 'quote'));
respond(200, ['ok' => true]);
