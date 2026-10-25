<?php
// Online withdrawal (§ 356a BGB). Sends the declaration to the studio and a confirmation of receipt, with date and
// time, to the consumer on a durable medium (e-mail). No consent checkbox: the declaration needs no consent.
require __DIR__ . '/lib/bootstrap.php';
guard();
$f = ['name' => line('name', 100), 'email' => line('email', 200), 'contract' => line('contract', 300), 'message' => text('message', 2000)];
require_fields($f, ['name', 'email', 'contract'], false);

$when = (new DateTimeImmutable('now', new DateTimeZone('Europe/Berlin')))->format('d.m.Y H:i:s T');
$de = lang() === 'de';
$summary = ($de ? "Vertrag: " : "Contract: ") . $f['contract'] . "\n" . ($de ? "Eingang: " : "Received: ") . $when
    . ($f['message'] !== '' ? "\n" . ($de ? "Hinweis: " : "Note: ") . $f['message'] : '');
$reply = $de
    ? ['subject' => 'Eingangsbestätigung Ihres Widerrufs', 'body' => "Guten Tag {$f['name']},\n\nwir bestätigen den Eingang Ihres Widerrufs.\n\n$summary\n\nWir melden uns bei Ihnen zur weiteren Abwicklung.\n\nFreundliche Grüße\n" . signature() . "\n"]
    : ['subject' => 'Confirmation of receipt of your withdrawal', 'body' => "Hello {$f['name']},\n\nwe confirm that we have received your withdrawal.\n\n$summary\n\nWe will contact you about the next steps.\n\nKind regards\n" . signature() . "\n"];

notify('[widerruf] Widerruf von ' . $f['name'], ['Name' => $f['name'], 'E-Mail' => $f['email'], 'Vertrag' => $f['contract'],
    'Eingang' => $when, 'Hinweis' => $f['message']], $f['name'], $f['email'], $reply);
respond(200, ['ok' => true]);
