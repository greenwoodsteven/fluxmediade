<?php
require __DIR__ . '/lib/bootstrap.php';
guard();
$f = ['name' => line('name', 100), 'email' => line('email', 200), 'url' => line('url', 300)];
require_fields($f, ['name', 'email']);
$de = lang() === 'de';
// AI visibility orders: announce the short questionnaire that follows the quote (the question set for the test comes from it)
$geo = str_contains(line('need'), 'KI-Sichtbarkeit') || str_contains(line('need'), 'AI visibility');
$extra = !$geo ? '' : ($de
    ? "\n\nFür die KI-Sichtbarkeit schicken wir Ihnen zusammen mit dem Angebot einen kurzen Fragebogen zu Ihrem Geschäft und den Fragen Ihrer Kunden."
    : "\n\nFor AI visibility we will send a short questionnaire about your business and your customers' questions together with the quote.");
// Only the non-personal answers go back to the visitor (no name, address, URL or free text)
$recap = [
    ($de ? 'Bedarf' : 'Need') => line('need'), ($de ? 'Website vorhanden' : 'Has a website') => line('site'),
    ($de ? 'Plattform' : 'Platform') => line('platform_existing') ?: line('platform') ?: line('platform_other'),
    ($de ? 'Zugang' : 'Access') => line('access'), ($de ? 'Umfang' : 'Scope') => line('scope'),
];
notify('[quote] Angebotsanfrage von ' . $f['name'], [
    'Name' => $f['name'], 'E-Mail' => $f['email'], 'URL' => $f['url'], 'Bedarf' => line('need'), 'Website vorhanden' => line('site'), 'Plattform (vorhanden)' => line('platform_existing'), 'Zugang' => line('access'),
    'Plattform (gewünscht)' => line('platform'), 'Plattform (andere)' => line('platform_other'),
    'Umfang' => line('scope'),
    'Frage 1 (KI-Test)' => line('geo_q1', 300), 'Frage 2 (KI-Test)' => line('geo_q2', 300), 'Frage 3 (KI-Test)' => line('geo_q3', 300),
    'Nachricht' => text('message', 2000),
], $f['name'], $f['email'], auto_reply($f['name'], 'quote', $recap, $extra));
respond(200, ['ok' => true]);
