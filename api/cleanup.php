<?php
// Retention clean-up for the free analysis and the rate limiter. Command line only, e.g. daily by cron:
//   php /full/path/to/api/cleanup.php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/audit.php';
audit_cleanup();
echo "cleanup done\n";
