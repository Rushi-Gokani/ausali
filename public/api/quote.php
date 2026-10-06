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

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Only POST requests are allowed.']);
}

$dbHost = 'localhost';
$dbName = 'ausali';
$dbUser = 'root';
$dbPass = '';
$dbCharset = 'utf8mb4';

try {
    $rawBody = file_get_contents('php://input') ?: '';
    $payload = json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR);

    if (!is_array($payload)) {
        respond(400, ['ok' => false, 'message' => 'Invalid request payload.']);
    }

    $pathway = cleanString($payload['pathway'] ?? '');
    $contact = is_array($payload['contact'] ?? null) ? $payload['contact'] : [];
    $site = is_array($payload['site'] ?? null) ? $payload['site'] : [];

    $customerName = cleanString($contact['name'] ?? '');
    $customerEmail = cleanString($contact['email'] ?? '');
    $customerPhone = cleanString($contact['phone'] ?? '');

    if ($pathway === '') {
        respond(422, ['ok' => false, 'message' => 'Please select a pathway.']);
    }

    if (pathwayTableName($pathway) === null) {
        respond(422, ['ok' => false, 'message' => 'Please select a valid pathway.']);
    }

    if ($customerName === '' && $customerEmail === '' && $customerPhone === '') {
        respond(422, ['ok' => false, 'message' => 'Please provide at least one contact detail.']);
    }

    if ($customerEmail !== '' && !filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        respond(422, ['ok' => false, 'message' => 'Please provide a valid email address.']);
    }

    $validationMessage = validateQuotePayload($pathway, $payload, $site, $contact);

    if ($validationMessage !== '') {
        respond(422, ['ok' => false, 'message' => $validationMessage]);
    }

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

    $submissionUid = cleanSubmissionUid($payload['submissionUid'] ?? '');
    $existingQuote = $submissionUid !== '' ? findQuoteBySubmissionUid($pdo, $submissionUid) : null;

    if ($existingQuote !== null) {
        respond(200, [
            'ok' => true,
            'message' => 'Quote request already saved.',
            'id' => (int) $existingQuote['id'],
            'referenceCode' => $existingQuote['reference_code'],
            'duplicate' => true,
        ]);
    }

    $referenceCode = createReferenceCode();
    $projectType = cleanString($payload['projectType'] ?? '');
    $suburb = cleanString($site['suburb'] ?? '');
    $postcode = cleanString($site['postcode'] ?? '');

    $stmt = $pdo->prepare(
        'INSERT INTO quote_requests (
            reference_code,
            submission_uid,
            pathway,
            project_type,
            customer_name,
            customer_email,
            customer_phone,
            suburb,
            postcode,
            products_json,
            styles_json,
            details_json,
            inspiration_json,
            site_json,
            contact_json,
            payload_json
        ) VALUES (
            :reference_code,
            :submission_uid,
            :pathway,
            :project_type,
            :customer_name,
            :customer_email,
            :customer_phone,
            :suburb,
            :postcode,
            :products_json,
            :styles_json,
            :details_json,
            :inspiration_json,
            :site_json,
            :contact_json,
            :payload_json
        )'
    );

    try {
        $pdo->beginTransaction();
        $stmt->execute([
            ':reference_code' => $referenceCode,
            ':submission_uid' => $submissionUid !== '' ? $submissionUid : null,
            ':pathway' => $pathway,
            ':project_type' => $projectType,
            ':customer_name' => $customerName,
            ':customer_email' => $customerEmail,
            ':customer_phone' => $customerPhone,
            ':suburb' => $suburb,
            ':postcode' => $postcode,
            ':products_json' => null,
            ':styles_json' => null,
            ':details_json' => null,
            ':inspiration_json' => null,
            ':site_json' => null,
            ':contact_json' => null,
            ':payload_json' => encodeJson([
                'pathway' => $pathway,
                'formTable' => pathwayTableName($pathway),
            ]),
        ]);

        $quoteRequestId = (int) $pdo->lastInsertId();
        insertPathwayDetails($pdo, $quoteRequestId, $pathway, $payload, $site, $contact);
        $pdo->commit();
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        if ($error instanceof PDOException && $submissionUid !== '' && $error->getCode() === '23000') {
            $existingQuote = findQuoteBySubmissionUid($pdo, $submissionUid);

            if ($existingQuote !== null) {
                respond(200, [
                    'ok' => true,
                    'message' => 'Quote request already saved.',
                    'id' => (int) $existingQuote['id'],
                    'referenceCode' => $existingQuote['reference_code'],
                    'duplicate' => true,
                ]);
            }
        }

        throw $error;
    }

    respond(201, [
        'ok' => true,
        'message' => 'Quote request saved.',
        'id' => $quoteRequestId,
        'referenceCode' => $referenceCode,
    ]);
} catch (JsonException $error) {
    respond(400, ['ok' => false, 'message' => 'The request body must be valid JSON.']);
} catch (PDOException $error) {
    respond(500, [
        'ok' => false,
        'message' => 'Database error. Please check the database name, user, password and that MySQL is running.',
    ]);
} catch (Throwable $error) {
    respond(500, ['ok' => false, 'message' => 'Something went wrong while saving the quote request.']);
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

function insertPathwayDetails(PDO $pdo, int $quoteRequestId, string $pathway, array $payload, array $site, array $contact): void
{
    $tableName = pathwayTableName($pathway);

    if ($tableName === null) {
        throw new RuntimeException('Unsupported quote pathway.');
    }

    $stmt = $pdo->prepare(
        "INSERT INTO {$tableName} (
            quote_request_id,
            project_type,
            products_json,
            styles_json,
            details_json,
            inspiration_json,
            site_json,
            contact_json,
            payload_json
        ) VALUES (
            :quote_request_id,
            :project_type,
            :products_json,
            :styles_json,
            :details_json,
            :inspiration_json,
            :site_json,
            :contact_json,
            :payload_json
        )"
    );

    $stmt->execute([
        ':quote_request_id' => $quoteRequestId,
        ':project_type' => cleanString($payload['projectType'] ?? ''),
        ':products_json' => encodeJson($payload['products'] ?? []),
        ':styles_json' => encodeJson($payload['styles'] ?? new stdClass()),
        ':details_json' => encodeJson($payload['details'] ?? new stdClass()),
        ':inspiration_json' => encodeJson($payload['inspiration'] ?? []),
        ':site_json' => encodeJson($site),
        ':contact_json' => encodeJson($contact),
        ':payload_json' => encodeJson($payload),
    ]);
}

function pathwayTableName(string $pathway): ?string
{
    return match ($pathway) {
        'full-package' => 'full_package_quote_details',
        'installation' => 'installation_quote_details',
        'supply-only' => 'supply_only_quote_details',
        'talk-to-team' => 'team_help_quote_details',
        default => null,
    };
}

function validateQuotePayload(string $pathway, array $payload, array $site, array $contact): string
{
    $projectType = cleanString($payload['projectType'] ?? '');
    $details = is_array($payload['details'] ?? null) ? $payload['details'] : [];
    $products = is_array($payload['products'] ?? null) ? $payload['products'] : [];

    if ($pathway !== 'talk-to-team' && $projectType === '') {
        return 'Please choose a project type.';
    }

    if (($pathway === 'full-package' || $pathway === 'supply-only') && count($products) === 0) {
        return 'Please select at least one product.';
    }

    if ($pathway === 'full-package' || $pathway === 'supply-only') {
        $hasDetails = cleanString($details['dimensions'] ?? '') !== ''
            || cleanString($details['access'] ?? '') !== ''
            || cleanString($details['notes'] ?? '') !== '';

        if (!$hasDetails) {
            return 'Please add dimensions, site notes, or project notes.';
        }
    }

    if ($pathway === 'installation' && cleanString($details['installDescription'] ?? '') === '') {
        return 'Please describe what needs installing.';
    }

    if (($pathway === 'full-package' || $pathway === 'installation')
        && (cleanString($site['suburb'] ?? '') === '' || cleanString($site['postcode'] ?? '') === '')) {
        return 'Please enter the suburb and postcode.';
    }

    if ($pathway === 'supply-only') {
        $fulfillmentMethod = cleanString($site['fulfillmentMethod'] ?? '');

        if ($fulfillmentMethod === '') {
            return 'Please choose delivery, pickup, or not sure.';
        }

        if ($fulfillmentMethod === 'Delivery'
            && (cleanString($site['suburb'] ?? '') === '' || cleanString($site['postcode'] ?? '') === '')) {
            return 'Please enter the delivery suburb and postcode.';
        }
    }

    if ($pathway === 'talk-to-team' && cleanString($contact['notes'] ?? '') === '') {
        return 'Please tell us what you need.';
    }

    return '';
}

function createReferenceCode(): string
{
    return 'AUS-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(3)));
}

function cleanString(mixed $value): string
{
    return trim((string) $value);
}

function cleanSubmissionUid(mixed $value): string
{
    $uid = trim((string) $value);

    if ($uid === '') {
        return '';
    }

    return substr(preg_replace('/[^a-zA-Z0-9._:-]/', '', $uid) ?? '', 0, 100);
}

function findQuoteBySubmissionUid(PDO $pdo, string $submissionUid): ?array
{
    $stmt = $pdo->prepare(
        'SELECT id, reference_code
        FROM quote_requests
        WHERE submission_uid = :submission_uid
        LIMIT 1'
    );
    $stmt->execute([':submission_uid' => $submissionUid]);
    $quote = $stmt->fetch();

    return $quote ?: null;
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

function encodeJson(mixed $value): string
{
    return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
}

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
