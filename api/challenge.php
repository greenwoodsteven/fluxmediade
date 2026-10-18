<?php
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/audit.php';
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') { header('Allow: GET'); respond(405, ['ok' => false, 'error' => 'method']); }
respond(200, ['ok' => true] + pow_issue());
