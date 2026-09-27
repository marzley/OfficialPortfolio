-- Client portal tables. Import once in cPanel > phpMyAdmin > your database > Import.
CREATE TABLE clients (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE projects (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_id INT UNSIGNED NOT NULL,
    title VARCHAR(160) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'planning',
    progress TINYINT UNSIGNED NOT NULL DEFAULT 0,
    due_date DATE NULL,
    summary TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX (client_id),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE updates (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX (project_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE invoices (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_id INT UNSIGNED NOT NULL,
    project_id INT UNSIGNED NULL,
    number VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(300) NOT NULL,
    amount INT UNSIGNED NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unpaid',
    due_date DATE NULL,
    paid_at DATETIME NULL,
    mpesa_receipt VARCHAR(30) NULL,
    created_at DATETIME NOT NULL,
    INDEX (client_id),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE invoice_payments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT UNSIGNED NOT NULL,
    checkout_id VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL,
    INDEX (invoice_id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE files (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT UNSIGNED NOT NULL,
    original_name VARCHAR(190) NOT NULL,
    stored_name VARCHAR(64) NOT NULL,
    size INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX (project_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
