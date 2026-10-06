<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Email, X-Admin-Password');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(405, ['ok' => false, 'message' => 'Only GET requests are allowed.']);
}

$requestEmail = trim((string) ($_SERVER['HTTP_X_ADMIN_EMAIL'] ?? ''));
$requestPassword = (string) ($_SERVER['HTTP_X_ADMIN_PASSWORD'] ?? '');

if ($requestEmail === '' || $requestPassword === '') {
    respond(401, ['ok' => false, 'message' => 'Invalid admin email or password.']);
}

$dbHost = 'localhost';
$dbName = 'ausali';
$dbUser = 'root';
$dbPass = '';
$dbCharset = 'utf8mb4';

try {
    $pdo = new PDO(
        "mysql:host={$dbHost};dbname={$dbName};charset={$dbCharset}",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    ensureQuoteTables($pdo);
    ensureContactTable($pdo);
    ensureAdminTable($pdo);
    seedDefaultAdmin($pdo);

    if (!authenticateAdmin($pdo, $requestEmail, $requestPassword)) {
        respond(401, ['ok' => false, 'message' => 'Invalid admin email or password.']);
    }

    $stmt = $pdo->query(
        'SELECT
            qr.id,
            qr.reference_code,
            qr.pathway,
            COALESCE(fp.project_type, iq.project_type, so.project_type, th.project_type, qr.project_type) AS project_type,
            qr.customer_name,
            qr.customer_email,
            qr.customer_phone,
            qr.suburb,
            qr.postcode,
            COALESCE(fp.products_json, iq.products_json, so.products_json, th.products_json, qr.products_json) AS products_json,
            COALESCE(fp.styles_json, iq.styles_json, so.styles_json, th.styles_json, qr.styles_json) AS styles_json,
            COALESCE(fp.details_json, iq.details_json, so.details_json, th.details_json, qr.details_json) AS details_json,
            COALESCE(fp.inspiration_json, iq.inspiration_json, so.inspiration_json, th.inspiration_json, qr.inspiration_json) AS inspiration_json,
            COALESCE(fp.site_json, iq.site_json, so.site_json, th.site_json, qr.site_json) AS site_json,
            COALESCE(fp.contact_json, iq.contact_json, so.contact_json, th.contact_json, qr.contact_json) AS contact_json,
            COALESCE(fp.payload_json, iq.payload_json, so.payload_json, th.payload_json, qr.payload_json) AS payload_json,
            CASE
                WHEN fp.id IS NOT NULL THEN \'full_package_quote_details\'
                WHEN iq.id IS NOT NULL THEN \'installation_quote_details\'
                WHEN so.id IS NOT NULL THEN \'supply_only_quote_details\'
                WHEN th.id IS NOT NULL THEN \'team_help_quote_details\'
                ELSE \'quote_requests\'
            END AS form_table,
            qr.created_at
        FROM quote_requests qr
        LEFT JOIN full_package_quote_details fp ON fp.quote_request_id = qr.id
        LEFT JOIN installation_quote_details iq ON iq.quote_request_id = qr.id
        LEFT JOIN supply_only_quote_details so ON so.quote_request_id = qr.id
        LEFT JOIN team_help_quote_details th ON th.quote_request_id = qr.id
        ORDER BY qr.created_at DESC, qr.id DESC'
    );

    $records = array_map('formatRecord', $stmt->fetchAll());

    $contactStmt = $pdo->query(
        'SELECT
            id,
            reference_code,
            customer_name,
            customer_email,
            customer_phone,
            suburb,
            service,
            budget,
            message,
            payload_json,
            created_at
        FROM contact_messages
        ORDER BY created_at DESC, id DESC'
    );

    $records = array_merge($records, array_map('formatContactRecord', $contactStmt->fetchAll()));
    usort($records, static fn (array $a, array $b): int => strcmp((string) $b['createdAt'], (string) $a['createdAt']));

    respond(200, [
        'ok' => true,
        'count' => count($records),
        'records' => $records,
    ]);
} catch (PDOException $error) {
    respond(500, [
        'ok' => false,
        'message' => 'Database error. Please check credentials and that MySQL is running.',
    ]);
} catch (Throwable $error) {
    respond(500, ['ok' => false, 'message' => 'Something went wrong while loading quote requests.']);
}

function formatRecord(array $row): array
{
    return [
        'uid' => 'quote-' . (int) $row['id'],
        'recordType' => 'quote',
        'id' => (int) $row['id'],
        'referenceCode' => $row['reference_code'],
        'pathway' => $row['pathway'],
        'projectType' => $row['project_type'],
        'customerName' => $row['customer_name'],
        'customerEmail' => $row['customer_email'],
        'customerPhone' => $row['customer_phone'],
        'suburb' => $row['suburb'],
        'postcode' => $row['postcode'],
        'products' => decodeJson($row['products_json'], []),
        'styles' => decodeJson($row['styles_json'], new stdClass()),
        'details' => decodeJson($row['details_json'], new stdClass()),
        'inspiration' => decodeJson($row['inspiration_json'], []),
        'site' => decodeJson($row['site_json'], new stdClass()),
        'contact' => decodeJson($row['contact_json'], new stdClass()),
        'payload' => decodeJson($row['payload_json'], new stdClass()),
        'formTable' => $row['form_table'],
        'createdAt' => $row['created_at'],
    ];
}

function formatContactRecord(array $row): array
{
    $payload = decodeJson($row['payload_json'], new stdClass());

    return [
        'uid' => 'contact-' . (int) $row['id'],
        'recordType' => 'contact',
        'id' => (int) $row['id'],
        'referenceCode' => $row['reference_code'],
        'pathway' => 'contact-us',
        'projectType' => 'Contact Form',
        'customerName' => $row['customer_name'],
        'customerEmail' => $row['customer_email'],
        'customerPhone' => $row['customer_phone'],
        'suburb' => $row['suburb'],
        'postcode' => '',
        'products' => [],
        'styles' => new stdClass(),
        'details' => [
            'service' => $row['service'],
            'budget' => $row['budget'],
            'message' => $row['message'],
        ],
        'inspiration' => [],
        'site' => [
            'suburb' => $row['suburb'],
        ],
        'contact' => [
            'name' => $row['customer_name'],
            'email' => $row['customer_email'],
            'phone' => $row['customer_phone'],
            'notes' => $row['message'],
        ],
        'payload' => $payload,
        'formTable' => 'contact_messages',
        'createdAt' => $row['created_at'],
    ];
}

function decodeJson(?string $json, mixed $fallback): mixed
{
    if ($json === null || $json === '') {
        return $fallback;
    }

    try {
        return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $error) {
        return $fallback;
    }
}

function ensureQuoteTables(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS quote_requests (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            reference_code VARCHAR(40) NOT NULL UNIQUE,
            submission_uid VARCHAR(100) NULL UNIQUE,
            pathway VARCHAR(80) NOT NULL,
            project_type VARCHAR(120) NULL,
            customer_name VARCHAR(190) NULL,
            customer_email VARCHAR(190) NULL,
            customer_phone VARCHAR(80) NULL,
            suburb VARCHAR(190) NULL,
            postcode VARCHAR(40) NULL,
            products_json LONGTEXT NULL,
            styles_json LONGTEXT NULL,
            details_json LONGTEXT NULL,
            inspiration_json LONGTEXT NULL,
            site_json LONGTEXT NULL,
            contact_json LONGTEXT NULL,
            payload_json LONGTEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_quote_requests_created_at (created_at),
            INDEX idx_quote_requests_pathway (pathway),
            INDEX idx_quote_requests_email (customer_email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    ensureColumn($pdo, 'quote_requests', 'submission_uid', 'ALTER TABLE quote_requests ADD COLUMN submission_uid VARCHAR(100) NULL UNIQUE AFTER reference_code');
    ensurePathwayTable($pdo, 'full_package_quote_details');
    ensurePathwayTable($pdo, 'installation_quote_details');
    ensurePathwayTable($pdo, 'supply_only_quote_details');
    ensurePathwayTable($pdo, 'team_help_quote_details');
}

function ensurePathwayTable(PDO $pdo, string $tableName): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS {$tableName} (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            quote_request_id INT UNSIGNED NOT NULL UNIQUE,
            project_type VARCHAR(120) NULL,
            products_json LONGTEXT NULL,
            styles_json LONGTEXT NULL,
            details_json LONGTEXT NULL,
            inspiration_json LONGTEXT NULL,
            site_json LONGTEXT NULL,
            contact_json LONGTEXT NULL,
            payload_json LONGTEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_{$tableName}_quote_request
                FOREIGN KEY (quote_request_id)
                REFERENCES quote_requests (id)
                ON DELETE CASCADE,
            INDEX idx_{$tableName}_quote_request (quote_request_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
}

function ensureAdminTable(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS admin_users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(190) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            display_name VARCHAR(190) NULL,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_admin_users_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
}

function ensureContactTable(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS contact_messages (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            reference_code VARCHAR(40) NOT NULL UNIQUE,
            submission_uid VARCHAR(100) NULL UNIQUE,
            customer_name VARCHAR(190) NOT NULL,
            customer_email VARCHAR(190) NOT NULL,
            customer_phone VARCHAR(80) NOT NULL,
            suburb VARCHAR(190) NULL,
            service VARCHAR(190) NOT NULL,
            budget VARCHAR(120) NULL,
            message LONGTEXT NOT NULL,
            payload_json LONGTEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_contact_messages_created_at (created_at),
            INDEX idx_contact_messages_email (customer_email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    ensureColumn($pdo, 'contact_messages', 'submission_uid', 'ALTER TABLE contact_messages ADD COLUMN submission_uid VARCHAR(100) NULL UNIQUE AFTER reference_code');
}

function ensureColumn(PDO $pdo, string $table, string $column, string $alterSql): void
{
    $stmt = $pdo->prepare(
        'SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = :table_name
            AND COLUMN_NAME = :column_name'
    );
    $stmt->execute([
        ':table_name' => $table,
        ':column_name' => $column,
    ]);

    if ((int) $stmt->fetchColumn() === 0) {
        $pdo->exec($alterSql);
    }
}

function seedDefaultAdmin(PDO $pdo): void
{
    $stmt = $pdo->prepare(
        'INSERT IGNORE INTO admin_users (email, password_hash, display_name)
        VALUES (:email, :password_hash, :display_name)'
    );

    $stmt->execute([
        ':email' => 'admin@ausali.com',
        ':password_hash' => '$2y$10$KF6l9iAoLue89yUjd0vXJ.o7qTaoTUU7QzPQBIODFHVK62LoSBgdC',
        ':display_name' => 'AUSALI Admin',
    ]);
}

function authenticateAdmin(PDO $pdo, string $email, string $password): bool
{
    $stmt = $pdo->prepare(
        'SELECT password_hash
        FROM admin_users
        WHERE email = :email AND is_active = 1
        LIMIT 1'
    );
    $stmt->execute([':email' => strtolower(trim($email))]);
    $admin = $stmt->fetch();

    if (!$admin || !isset($admin['password_hash'])) {
        return false;
    }

    return password_verify($password, (string) $admin['password_hash']);
}

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
