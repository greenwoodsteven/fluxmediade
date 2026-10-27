<?php
declare(strict_types=1);
// Abuse protection for the free analysis: proof-of-work challenge, e-mail confirmation,
// one analysis per domain and a weekly cap. State is kept as small files in storage_dir().
// Stored: pending request (until confirmed, max. pending_hours), SHA-256 hash of the domain
// (domain_days) and empty marker files for the weekly cap. Nothing is sent to third parties.

const POW_BITS = 14;      // ~16k hashes on average, well under a second in a browser
const POW_TTL = 900;      // a challenge is valid for 15 minutes and only once

function audit_cfg(): array {
    return (config()['audit'] ?? []) + ['weekly_cap' => 10, 'domain_days' => 90, 'pending_hours' => 48];
}

function secret(): string { return (string) (config()['secret'] ?? config()['smtp']['password'] ?? ''); }

function pow_issue(): array {
    $salt = time() . '.' . bin2hex(random_bytes(8));
    return ['salt' => $salt, 'sig' => hash_hmac('sha256', $salt, secret()), 'bits' => POW_BITS];
}

function leading_zero_bits(string $bin): int {
    $n = 0;
    foreach (str_split($bin) as $ch) {
        $b = ord($ch);
        if ($b === 0) { $n += 8; continue; }
        return $n + (int) (8 - strlen(decbin($b)));
    }
    return $n;
}

/** True when the browser solved a challenge that we issued, that is fresh and has not been used. */
function pow_verify(): bool {
    $salt = (string) ($_POST['pow_salt'] ?? '');
    $sig = (string) ($_POST['pow_sig'] ?? '');
    $nonce = (string) ($_POST['pow_nonce'] ?? '');
    if ($salt === '' || $nonce === '' || !ctype_digit($nonce) || strlen($nonce) > 12) return false;
    if (!hash_equals(hash_hmac('sha256', $salt, secret()), $sig)) return false;
    $issued = (int) explode('.', $salt)[0];
    if ($issued > time() + 5 || $issued < time() - POW_TTL) return false;
    if (leading_zero_bits(hash('sha256', $salt . ':' . $nonce, true)) < POW_BITS) return false;
    $dir = storage('pow');
    $mark = $dir . '/' . hash('sha256', $salt);
    if (is_file($mark)) return false;
    touch($mark);
    if (random_int(1, 20) === 1) prune($dir, 3600);
    return true;
}

/** Registrable-looking host without "www.", or null (no IPs, no localhost, no single-label names). */
function audit_domain(string $url): ?string {
    $host = strtolower((string) parse_url($url, PHP_URL_HOST));
    $host = preg_replace('/^www\./', '', rtrim($host, '.')) ?? '';
    if ($host === '' || !preg_match('/^[a-z0-9.-]+\.[a-z]{2,}$/', $host) || filter_var($host, FILTER_VALIDATE_IP)) return null;
    return $host;
}

function domain_recent(string $host): bool {
    $f = storage('domains') . '/' . hash('sha256', $host);
    return is_file($f) && filemtime($f) > time() - audit_cfg()['domain_days'] * 86400;
}

function domain_register(string $host): void {
    prune(storage('domains'), audit_cfg()['domain_days'] * 86400);
    touch(storage('domains') . '/' . hash('sha256', $host));
}

/** The same limit per email address (stored only as a hash, case-insensitive). */
function email_key(string $email): string { return hash('sha256', mb_strtolower(trim($email))); }

function email_recent(string $email): bool {
    $f = storage('emails') . '/' . email_key($email);
    return is_file($f) && filemtime($f) > time() - audit_cfg()['domain_days'] * 86400;
}

function email_register(string $email): void {
    prune(storage('emails'), audit_cfg()['domain_days'] * 86400);
    touch(storage('emails') . '/' . email_key($email));
}

function capacity_full(): bool {
    $dir = storage('confirmed');
    prune($dir, 7 * 86400);
    return count(glob($dir . '/*') ?: []) >= audit_cfg()['weekly_cap'];
}

function capacity_take(): void { touch(storage('confirmed') . '/' . date('YmdHis') . '-' . bin2hex(random_bytes(4))); }

function pending_path(string $token): string { return storage('pending') . '/' . hash('sha256', $token); }

function pending_save(array $data): string {
    $token = bin2hex(random_bytes(24));
    prune(storage('pending'), audit_cfg()['pending_hours'] * 3600);
    file_put_contents(pending_path($token), json_encode($data, JSON_UNESCAPED_UNICODE), LOCK_EX);
    return $token;
}

function pending_load(string $token): ?array {
    if (!preg_match('/^[a-f0-9]{48}$/', $token)) return null;
    $f = pending_path($token);
    if (!is_file($f)) return null;
    if (filemtime($f) < time() - audit_cfg()['pending_hours'] * 3600) { @unlink($f); return null; }
    return json_decode((string) file_get_contents($f), true) ?: null;
}

function pending_delete(string $token): void { @unlink(pending_path($token)); }

function confirm_mail(string $name, string $email, string $link, string $lang, string $url, string $terms): void {
    $hours = audit_cfg()['pending_hours'];
    $de = $lang === 'de';
    try {
        $m = mailer();
        $m->addAddress($email, $name);
        $m->Subject = $de ? 'Bitte bestätigen Sie Ihre Analyse-Anfrage' : 'Please confirm your analysis request';
        $m->Body = $de
            ? "Guten Tag $name,\n\nbitte bestätigen Sie Ihre E-Mail-Adresse, damit wir Ihre Anfrage für die kostenlose Analyse bearbeiten können:\n\nWebsite: $url\nSuchbegriffe: $terms\n\n$link\n\nDer Link ist $hours Stunden gültig. Wenn Sie die Analyse nicht angefragt haben, ignorieren Sie diese E-Mail einfach.\n\nFreundliche Grüße\n" . signature() . "\n"
            : "Hello $name,\n\nplease confirm your email address so we can process your request for the free analysis:\n\nWebsite: $url\nSearch terms: $terms\n\n$link\n\nThe link is valid for $hours hours. If you did not request the analysis, simply ignore this email.\n\nKind regards\n" . signature() . "\n";
        set_html_body($m, $m->Body, $lang);
        $m->addCustomHeader('Auto-Submitted', 'auto-generated');
        $t = microtime(true);
        send_mail($m);
        log_timing(sprintf('confirmation %.2fs', microtime(true) - $t));
    } catch (\Throwable $e) {
        error_log('fluxmedia mail error: ' . $e->getMessage());
        respond(500, ['ok' => false, 'error' => 'mail']);
    }
}

/** Delete everything that is past its retention period. Called by api/cleanup.php (daily cron) and opportunistically. */
function audit_cleanup(): void {
    $c = audit_cfg();
    prune(storage('pending'), $c['pending_hours'] * 3600);
    prune(storage('domains'), $c['domain_days'] * 86400);
    prune(storage('emails'), $c['domain_days'] * 86400);
    prune(storage('confirmed'), 7 * 86400);
    prune(storage('pow'), 3600);
    prune(storage('ratelimit'), (int) ((config()['rate_limit']['window'] ?? 3600)));
}
