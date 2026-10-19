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

function require_fields(array $values, array $required): void {
    foreach ($required as $k) if (($values[$k] ?? '') === '') respond(422, ['ok' => false, 'error' => 'missing:' . $k]);
    if (isset($values['email']) && !filter_var($values['email'], FILTER_VALIDATE_EMAIL)) respond(422, ['ok' => false, 'error' => 'email']);
    if (isset($values['url']) && $values['url'] !== '' && !preg_match('#^https?://#i', $values['url'])) respond(422, ['ok' => false, 'error' => 'url']);
    if (($_POST['consent'] ?? '') !== '1') respond(422, ['ok' => false, 'error' => 'consent']);
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
 * Notify the studio (Reply-To = visitor) and send a plain auto-reply.
 * Nothing is stored beyond the mail itself.
 */
function notify(string $subject, array $fields, string $replyName, string $replyEmail, array $autoReply): void {
    $body = '';
    foreach ($fields as $label => $value) if ($value !== '') $body .= $label . ': ' . $value . "\n";
    $body .= "\nLang: " . lang() . "\nRef: " . line('ref', 50) . "\n";
    try {
        $m = mailer();
        $m->addAddress(config()['to']);
        $m->addReplyTo($replyEmail, $replyName);
        $m->Subject = $subject;
        $m->Body = $body;
        $m->send();

        $r = mailer();
        $r->addAddress($replyEmail, $replyName);
        $r->Subject = $autoReply['subject'];
        $r->Body = $autoReply['body'];
        $r->addCustomHeader('Auto-Submitted', 'auto-replied');
        $r->send();
    } catch (MailException $e) {
        error_log('fluxmedia mail error: ' . $e->getMessage());
        respond(500, ['ok' => false, 'error' => 'mail']);
    }
}

function auto_reply(string $name, string $kind): array {
    $de = lang() === 'de';
    $hours = $kind === 'analysis' ? ($de ? 'innerhalb von 48 Stunden (2 Werktagen)' : 'within 48 hours (2 working days)') : ($de ? 'innerhalb eines Werktags' : 'within one working day');
    return $de
        ? ['subject' => 'Ihre Anfrage bei Fluxmedia', 'body' => "Guten Tag $name,\n\nvielen Dank für Ihre Anfrage. Wir melden uns $hours persönlich bei Ihnen.\n\nFreundliche Grüße\nFluxmedia\n"]
        : ['subject' => 'Your enquiry at Fluxmedia', 'body' => "Hello $name,\n\nThank you for your enquiry. We will get back to you personally $hours.\n\nKind regards\nFluxmedia\n"];
}
