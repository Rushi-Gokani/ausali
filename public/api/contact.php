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

    $name = cleanString($payload['name'] ?? '');
    $email = cleanString($payload['email'] ?? '');
    $phone = cleanString($payload['phone'] ?? '');
    $suburb = cleanString($payload['suburb'] ?? '');
    $service = cleanString($payload['service'] ?? '');
    $budget = cleanString($payload['budget'] ?? '');
    $message = cleanString($payload['message'] ?? '');

    if ($name === '' || $email === '' || $phone === '' || $service === '' || $message === '') {
        respond(422, ['ok' => false, 'message' => 'Please complete the required contact fields.']);
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

    ensureContactTable($pdo);

    $submissionUid = cleanSubmissionUid($payload['submissionUid'] ?? '');
    $existingMessage = $submissionUid !== '' ? findContactBySubmissionUid($pdo, $submissionUid) : null;

    if ($existingMessage !== null) {
        respond(200, [
            'ok' => true,
            'message' => 'Contact message already saved.',
            'id' => (int) $existingMessage['id'],
            'referenceCode' => $existingMessage['reference_code'],
            'duplicate' => true,
        ]);
    }

    $referenceCode = createReferenceCode();
    $stmt = $pdo->prepare(
        'INSERT INTO contact_messages (
            reference_code,
            submission_uid,
            customer_name,
            customer_email,
            customer_phone,
            suburb,
            service,
            budget,
            message,
            payload_json
        ) VALUES (
            :reference_code,
            :submission_uid,
            :customer_name,
            :customer_email,
            :customer_phone,
            :suburb,
            :service,
            :budget,
            :message,
            :payload_json
        )'
    );

    try {
        $stmt->execute([
            ':reference_code' => $referenceCode,
            ':submission_uid' => $submissionUid !== '' ? $submissionUid : null,
            ':customer_name' => $name,
            ':customer_email' => $email,
            ':customer_phone' => $phone,
            ':suburb' => $suburb,
            ':service' => $service,
            ':budget' => $budget,
            ':message' => $message,
            ':payload_json' => encodeJson($payload),
        ]);
    } catch (PDOException $error) {
        if ($submissionUid !== '' && $error->getCode() === '23000') {
            $existingMessage = findContactBySubmissionUid($pdo, $submissionUid);

            if ($existingMessage !== null) {
                respond(200, [
                    'ok' => true,
                    'message' => 'Contact message already saved.',
                    'id' => (int) $existingMessage['id'],
                    'referenceCode' => $existingMessage['reference_code'],
                    'duplicate' => true,
                ]);
            }
        }

        throw $error;
    }

    respond(201, [
        'ok' => true,
        'message' => 'Contact message saved.',
        'id' => (int) $pdo->lastInsertId(),
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
    respond(500, ['ok' => false, 'message' => 'Something went wrong while saving the contact message.']);
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

function createReferenceCode(): string
{
    return 'CON-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(3)));
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

function findContactBySubmissionUid(PDO $pdo, string $submissionUid): ?array
{
    $stmt = $pdo->prepare(
        'SELECT id, reference_code
        FROM contact_messages
        WHERE submission_uid = :submission_uid
        LIMIT 1'
    );
    $stmt->execute([':submission_uid' => $submissionUid]);
    $message = $stmt->fetch();

    return $message ?: null;
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
