CREATE DATABASE IF NOT EXISTS ausali
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ausali;

-- quote_requests is the connected index table used by the admin panel.
-- Each pathway/form writes its full data into its own detail table below.
-- Default admin login after import:
--   Email: admin@ausali.com
--   Password: ausali-admin-2026
-- To change the password later, replace password_hash with a new PHP password_hash() value.

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(190) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admin_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO admin_users (email, password_hash, display_name)
VALUES (
  'admin@ausali.com',
  '$2y$10$KF6l9iAoLue89yUjd0vXJ.o7qTaoTUU7QzPQBIODFHVK62LoSBgdC',
  'AUSALI Admin'
);

CREATE TABLE IF NOT EXISTS quote_requests (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS full_package_quote_details (
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
  CONSTRAINT fk_full_package_quote_details_quote_request
    FOREIGN KEY (quote_request_id)
    REFERENCES quote_requests (id)
    ON DELETE CASCADE,
  INDEX idx_full_package_quote_details_quote_request (quote_request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS installation_quote_details (
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
  CONSTRAINT fk_installation_quote_details_quote_request
    FOREIGN KEY (quote_request_id)
    REFERENCES quote_requests (id)
    ON DELETE CASCADE,
  INDEX idx_installation_quote_details_quote_request (quote_request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS supply_only_quote_details (
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
  CONSTRAINT fk_supply_only_quote_details_quote_request
    FOREIGN KEY (quote_request_id)
    REFERENCES quote_requests (id)
    ON DELETE CASCADE,
  INDEX idx_supply_only_quote_details_quote_request (quote_request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS team_help_quote_details (
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
  CONSTRAINT fk_team_help_quote_details_quote_request
    FOREIGN KEY (quote_request_id)
    REFERENCES quote_requests (id)
    ON DELETE CASCADE,
  INDEX idx_team_help_quote_details_quote_request (quote_request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
