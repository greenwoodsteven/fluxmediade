<?php
require __DIR__ . '/lib/bootstrap.php';
guard();
$f = ['name' => line('name', 100), 'email' => line('email', 200), 'message' => text('message')];
require_fields($f, ['name', 'email', 'message']);
notify('[contact] Kontaktanfrage von ' . $f['name'], ['Name' => $f['name'], 'E-Mail' => $f['email'], 'Nachricht' => $f['message']],
    $f['name'], $f['email'], auto_reply($f['name'], 'contact'));
respond(200, ['ok' => true]);
