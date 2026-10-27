<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

require_once __DIR__ . '/../PHPMailer/src/Exception.php';
require_once __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer/src/SMTP.php';

function config(): array {
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $path = getenv('FLUX_CONFIG') ?: __DIR__ . '/../config.php';
    if (!is_file($path)) respond(500, ['ok' => false, 'error' => 'config']);
    return $cfg = require $path;
}

function respond(int $status, array $body): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body);
    exit;
}

/** Same-origin POST only. No wildcard CORS: the form is served from the same host. */
function guard(): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        respond(405, ['ok' => false, 'error' => 'method']);
    }
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && !in_array($origin, config()['allowed_origins'], true)) {
        respond(403, ['ok' => false, 'error' => 'origin']);
    }
    // Honeypot: real visitors never see this field. Pretend success so bots learn nothing.
    if (!empty($_POST['company'])) respond(200, ['ok' => true]);
    rate_limit();
}

/** Persistent state folder. Set `storage_dir` outside the release folder, otherwise a deploy resets it. */
function storage(string $sub = ''): string {
    $base = (config()['storage_dir'] ?? null) ?: __DIR__ . '/../storage';
    $dir = $sub === '' ? $base : $base . '/' . $sub;
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    if (!is_file($base . '/.htaccess')) @file_put_contents($base . '/.htaccess', "Require all denied\n");
    return $dir;
}

function prune(string $dir, int $maxAge): void {
    foreach (glob($dir . '/*') ?: [] as $f) if (is_file($f) && filemtime($f) < time() - $maxAge) @unlink($f);
}

function rate_limit(): void {
    $cfg = config();
    $max = $cfg['rate_limit']['max'] ?? 5;
    $window = $cfg['rate_limit']['window'] ?? 3600;
    $dir = storage('ratelimit');
    if (random_int(1, 20) === 1) prune($dir, $window);
    // Only a salted hash of the IP is stored, and only for the length of the window.
    $file = $dir . '/' . hash('sha256', ($cfg['smtp']['password'] ?? '') . ($_SERVER['REMOTE_ADDR'] ?? ''));
    $now = time();
    $hits = is_file($file) ? array_filter(array_map('intval', explode("\n", (string) file_get_contents($file))), fn($t) => $t > $now - $window) : [];
    if (count($hits) >= $max) respond(429, ['ok' => false, 'error' => 'rate']);
    $hits[] = $now;
    file_put_contents($file, implode("\n", $hits), LOCK_EX);
}

/** Single-line, control-character-free value (prevents header injection). */
function line(string $key, int $max = 200): string {
    $v = (string) ($_POST[$key] ?? '');
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

function text(string $key, int $max = 4000): string {
    $v = str_replace("\0", '', (string) ($_POST[$key] ?? ''));
    return mb_substr(trim($v), 0, $max);
}

function require_fields(array $values, array $required, bool $consent = true): void {
    foreach ($required as $k) if (($values[$k] ?? '') === '') respond(422, ['ok' => false, 'error' => 'missing:' . $k]);
    if (isset($values['email']) && !filter_var($values['email'], FILTER_VALIDATE_EMAIL)) respond(422, ['ok' => false, 'error' => 'email']);
    if (isset($values['url']) && $values['url'] !== '' && !preg_match('#^https?://#i', $values['url'])) respond(422, ['ok' => false, 'error' => 'url']);
    if ($consent && ($_POST['consent'] ?? '') !== '1') respond(422, ['ok' => false, 'error' => 'consent']);
}

/** Mail signature: brand plus owner (config key 'owner', set in api/config.php) so the sender is identifiable. */
function signature(): string {
    $owner = config()['owner'] ?? '';
    return 'Fluxmedia' . ($owner !== '' ? (lang() === 'de' ? "\nInhaber: $owner" : "\nOwner: $owner") : '');
}

/**
 * HTML version of a plain-text mail body: blank-line separated paragraphs, a lone URL becomes a button.
 * The plain text stays the AltBody, so every mail is multipart/alternative.
 */
function mail_html(string $text, string $lang): string {
    $base = rtrim(config()['base_url'] ?? 'https://www.fluxmedia.de', '/');
    $p = 'margin:0 0 16px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#333333;';
    $out = '';
    foreach (preg_split('/\n{2,}/', trim($text)) as $para) {
        $para = trim($para);
        if (preg_match('#^https?://\S+$#', $para)) {
            $u = htmlspecialchars($para, ENT_QUOTES);
            $label = $lang === 'de' ? 'Anfrage bestätigen' : 'Confirm request';
            $out .= '<p style="margin:24px 0;"><a href="' . $u . '" style="display:inline-block;padding:12px 24px;background:#0b5f8a;color:#ffffff;font:bold 16px Arial,Helvetica,sans-serif;text-decoration:none;border-radius:4px;">' . $label . '</a></p>'
                . '<p style="margin:0 0 16px;font:13px/1.5 Arial,Helvetica,sans-serif;color:#666666;word-break:break-all;">' . $u . '</p>';
        } else {
            $out .= '<p style="' . $p . '">' . nl2br(htmlspecialchars($para, ENT_QUOTES), false) . '</p>';
        }
    }
    $c = config();
    $legal = ['Fluxmedia' . (($c['owner'] ?? '') !== '' ? ($lang === 'de' ? ' · Inhaber: ' : ' · Owner: ') . htmlspecialchars($c['owner'], ENT_QUOTES) : '')];
    $addr = $c['owner_address_' . $lang] ?? $c['owner_address'] ?? '';
    if ($addr !== '') $legal[] = htmlspecialchars($addr, ENT_QUOTES);
    $imprint = $lang === 'de' ? "$base/impressum/" : "$base/en/legal-notice/";
    $privacy = $lang === 'de' ? "$base/datenschutz/" : "$base/en/privacy/";
    $legal[] = '<a href="' . $imprint . '" style="color:#666666;">' . ($lang === 'de' ? 'Impressum' : 'Legal notice') . '</a> · <a href="' . $privacy . '" style="color:#666666;">' . ($lang === 'de' ? 'Datenschutz' : 'Privacy') . '</a>';
    return '<!doctype html><html lang="' . $lang . '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        . '<body style="margin:0;padding:0;background:#f4f4f4;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;"><tr><td align="center" style="padding:24px 12px;">'
        . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;">'
        . '<tr><td style="padding:24px 32px;border-bottom:1px solid #e5e5e5;"><img src="cid:fluxlogo" width="178" height="33" alt="Fluxmedia" style="display:block;border:0;width:178px;height:33px;"></td></tr>'
        . '<tr><td style="padding:32px 32px 16px;">' . $out . '</td></tr>'
        . '<tr><td style="padding:16px 32px 24px;border-top:1px solid #e5e5e5;font:12px/1.6 Arial,Helvetica,sans-serif;color:#666666;">' . implode('<br>', $legal) . '</td></tr>'
        . '</table></td></tr></table></body></html>';
}

/** Switch a mailer to HTML (logo embedded by CID, no remote image to block) with the plain text as AltBody. */
function set_html_body(PHPMailer $m, string $text, string $lang): void {
    $m->clearAttachments();
    $m->isHTML(true);
    $m->addEmbeddedImage(__DIR__ . '/logo-email.png', 'fluxlogo', 'fluxmedia.png', PHPMailer::ENCODING_BASE64, 'image/png');
    $m->Body = mail_html($text, $lang);
    $m->AltBody = $text;
}

function lang(): string { return ($_POST['lang'] ?? 'de') === 'en' ? 'en' : 'de'; }

/** Test helper: with config['mail_dump'] set, mails are written to that folder instead of being sent. */
class DumpMailer extends PHPMailer {
    public function postSend(): bool {
        $dir = config()['mail_dump'];
        if (!is_dir($dir)) @mkdir($dir, 0700, true);
        file_put_contents($dir . '/' . date('His') . '-' . bin2hex(random_bytes(3)) . '.eml', $this->getSentMIMEMessage());
        return true;
    }
}

function mailer(): PHPMailer {
    $s = config()['smtp'];
    $m = !empty(config()['mail_dump']) ? new DumpMailer(true) : new PHPMailer(true);
    $m->isSMTP();
    $m->Host = $s['host'];
    $m->Port = $s['port'];
    $m->SMTPAuth = true;
    $m->Username = $s['username'];
    $m->Password = $s['password'];
    $m->SMTPSecure = $s['encryption'] === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $m->CharSet = 'UTF-8';
    $m->setFrom($s['from_email'], $s['from_name']);
    return $m;
}

/**
 * Notify the studio (Reply-To = visitor, plain text) and send an HTML auto-reply.
 * Nothing is stored beyond the mail itself.
 */
function notify(string $subject, array $fields, string $replyName, string $replyEmail, array $autoReply): void {
    $body = '';
    foreach ($fields as $label => $value) if ($value !== '') $body .= $label . ': ' . $value . "\n";
    $body .= "\nLang: " . lang() . "\nRef: " . line('ref', 50) . "\n";
    try {
        // One SMTP connection for both messages (one TLS handshake and login instead of two)
        $m = mailer();
        $m->SMTPKeepAlive = true;
        $t = microtime(true);
        $m->addAddress(config()['to']);
        $m->addReplyTo($replyEmail, $replyName);
        $m->isHTML(false);
        $m->Subject = $subject;
        $m->Body = $body;
        // High priority for the studio notification (not for the visitor's auto-reply)
        $m->Priority = 1;                                  // X-Priority: 1 (Highest)
        $m->addCustomHeader('X-MSMail-Priority', 'High');
        $m->addCustomHeader('Importance', 'High');
        $m->send();
        $t1 = microtime(true) - $t;

        $m->clearAllRecipients();
        $m->clearReplyTos();
        $m->clearCustomHeaders();
        $m->Priority = null;
        $m->addAddress($replyEmail, $replyName);
        $m->Subject = $autoReply['subject'];
        set_html_body($m, $autoReply['body'], lang());
        $m->addCustomHeader('Auto-Submitted', 'auto-replied');
        $t = microtime(true);
        $m->send();
        $m->smtpClose();
        log_timing(sprintf('studio %.2fs, auto-reply %.2fs', $t1, microtime(true) - $t));
    } catch (MailException $e) {
        error_log('fluxmedia mail error: ' . $e->getMessage());
        respond(500, ['ok' => false, 'error' => 'mail']);
    }
}

/** With 'log_timing' => true in config.php, write mail durations (no personal data) to the PHP error log. */
function log_timing(string $what): void {
    if (!empty(config()['log_timing'])) error_log('fluxmedia mail timing: ' . $what);
}

function auto_reply(string $name, string $kind): array {
    $de = lang() === 'de';
    $hours = $kind === 'analysis' ? ($de ? 'innerhalb von 48 Stunden (2 Werktagen)' : 'within 48 hours (2 working days)') : ($de ? 'innerhalb eines Werktags' : 'within one working day');
    return $de
        ? ['subject' => 'Ihre Anfrage bei Fluxmedia', 'body' => "Guten Tag $name,\n\nvielen Dank für Ihre Anfrage. Wir melden uns $hours persönlich bei Ihnen."
            . ($kind === 'quote' ? "\n\nEin Vertrag kommt erst mit Ihrer Annahme unseres schriftlichen Angebots zustande. Vertragspartner ist die dort genannte Person: " . (config()['owner'] ?? 'Fluxmedia') . ', Inhaber Fluxmedia.' : '')
            . "\n\nFreundliche Grüße\n" . signature() . "\n"]
        : ['subject' => 'Your enquiry at Fluxmedia', 'body' => "Hello $name,\n\nThank you for your enquiry. We will get back to you personally $hours."
            . ($kind === 'quote' ? "\n\nA contract is only concluded when you accept our written quote. The contracting party is the one named there: " . (config()['owner'] ?? 'Fluxmedia') . ', owner of Fluxmedia.' : '')
            . "\n\nKind regards\n" . signature() . "\n"];
}
