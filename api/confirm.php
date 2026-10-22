<?php
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/audit.php';

// The link in the mail only shows a button (GET); the confirmation itself is a POST, so mail
// scanners that pre-fetch links cannot confirm a request by accident.
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');

function page(string $lang, string $title, string $text, string $form = ''): never {
    http_response_code(200);
    header('Content-Type: text/html; charset=utf-8');
    $e = fn(string $s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
    echo '<!doctype html><html lang="' . $lang . '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<meta name="robots" content="noindex"><title>' . $e($title) . ' | Fluxmedia</title>'
        . '<style>body{font:1rem/1.7 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#444;margin:0;padding:2rem 1rem}'
        . 'main{max-width:36rem;margin:0 auto}h1{color:#222;line-height:1.2}a{color:#0b5f8a}'
        . 'button{font:inherit;font-weight:700;padding:.75rem 1.5rem;border:2px solid #0b5f8a;background:#0b5f8a;color:#fff;border-radius:2px;cursor:pointer}'
        . 'button:focus-visible,a:focus-visible{outline:3px solid #0b5f8a;outline-offset:2px}</style></head><body><main>'
        . '<h1>' . $e($title) . '</h1><p>' . $e($text) . '</p>' . $form
        . '<p><a href="/' . ($lang === 'en' ? 'en/' : '') . '">Fluxmedia</a></p></main></body></html>';
    exit;
}

$post = ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';
$token = (string) ($post ? ($_POST['t'] ?? '') : ($_GET['t'] ?? ''));
$data = pending_load($token);
if ($data === null) {
    $de = (($_GET['lang'] ?? $_POST['lang'] ?? 'de') !== 'en');
    page($de ? 'de' : 'en', $de ? 'Link ungültig oder abgelaufen' : 'Link invalid or expired',
        $de ? 'Dieser Bestätigungslink ist ungültig oder abgelaufen. Bitte senden Sie die Anfrage für die kostenlose Analyse erneut ab.'
            : 'This confirmation link is invalid or has expired. Please submit the request for the free analysis again.');
}
$lang = $data['lang'] === 'en' ? 'en' : 'de';
$de = $lang === 'de';

if (!$post) {
    $form = '<form method="post" action="/api/confirm.php"><input type="hidden" name="t" value="' . htmlspecialchars($token, ENT_QUOTES) . '">'
        . '<button type="submit">' . ($de ? 'Anfrage bestätigen' : 'Confirm request') . '</button></form>';
    page($lang, $de ? 'Anfrage bestätigen' : 'Confirm your request',
        ($de ? 'Bitte bestätigen Sie Ihre Anfrage für die kostenlose Analyse von ' : 'Please confirm your request for the free analysis of ') . $data['fields']['URL'] . '.', $form);
}

if (domain_recent($data['host'])) {
    pending_delete($token);
    page($lang, $de ? 'Bereits angefragt' : 'Already requested',
        $de ? 'Für diese Domain wurde bereits eine Analyse angefragt. Bei Fragen schreiben Sie uns gern.' : 'An analysis has already been requested for this domain. Feel free to write to us with any questions.');
}
if (capacity_full()) {
    pending_delete($token);
    page($lang, $de ? 'Aktuell ausgelastet' : 'Fully booked at the moment',
        $de ? 'Diese Woche sind alle Analyse-Plätze vergeben. Bitte versuchen Sie es in einigen Tagen erneut, Ihre Angaben wurden gelöscht.'
            : 'All analysis slots for this week are taken. Please try again in a few days; your details have been deleted.');
}

domain_register($data['host']);
capacity_take();
pending_delete($token);
$_POST['lang'] = $lang;
$_POST['ref'] = $data['ref'] ?? '';
$fields = ['E-Mail bestätigt' => 'ja'] + $data['fields'];
notify('[free-analysis] Analyse-Anfrage: ' . $data['fields']['URL'], $fields, $data['fields']['Name'], $data['fields']['E-Mail'], auto_reply($data['fields']['Name'], 'analysis'));
page($lang, $de ? 'Vielen Dank!' : 'Thank you!',
    $de ? 'Ihre E-Mail-Adresse ist bestätigt. Wir melden uns innerhalb von 48 Stunden (2 Werktagen) persönlich bei Ihnen.'
        : 'Your email address is confirmed. We will get back to you personally within 48 hours (2 working days).');
