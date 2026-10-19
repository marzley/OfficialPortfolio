-- Learning hub upgrade (v10): learner points, recently opened lessons and profile photos.
--
-- You don't have to run this: the portal adds these tables by itself the first time
-- anyone opens it after you upload the new files. Use this file only if you prefer to
-- do it by hand: cPanel > phpMyAdmin > your database > Import (or paste it into SQL).
-- It is safe to run more than once, except the ALTER TABLE line, which shows a
-- "Duplicate column" error if the column is already there. That error is harmless.

-- Every action that earns points (each one pays once)
CREATE TABLE IF NOT EXISTS learn_points (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    learner_id INT UNSIGNED NOT NULL,
    kind VARCHAR(20) NOT NULL,              -- signup, understood, complete, video, comment, reply, like, code, notes
    ref VARCHAR(80) NOT NULL,               -- what it was for (lesson, section, video, comment, payment)
    points INT UNSIGNED NOT NULL,
    detail VARCHAR(200) NOT NULL DEFAULT '',
    link VARCHAR(200) NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL,
    UNIQUE KEY learn_points_once (learner_id, kind, ref),
    KEY learn_points_learner (learner_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The lessons each learner opened most recently ("Continue learning")
CREATE TABLE IF NOT EXISTS learn_visits (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    learner_id INT UNSIGNED NOT NULL,
    lesson_id INT UNSIGNED NOT NULL,
    visited_at DATETIME NOT NULL,
    UNIQUE KEY learn_visits_once (learner_id, lesson_id),
    KEY learn_visits_learner (learner_id, visited_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Profile photo (shared by the client portal and the learning hub)
ALTER TABLE learners ADD COLUMN avatar VARCHAR(80) NOT NULL DEFAULT '';

-- v11: optional passwords (username or email + password). Passwords are stored hashed (bcrypt), never as plain text.
CREATE TABLE IF NOT EXISTS passwords (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    username VARCHAR(40) NULL UNIQUE,
    hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- v12: a certificate for each subject a learner finishes (every published lesson completed)
CREATE TABLE IF NOT EXISTS learn_certificates (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    learner_id INT UNSIGNED NOT NULL,
    track_id INT UNSIGNED NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,       -- MLC-XXXXX-XXXXX, checked at /portal/verify.php
    lessons INT UNSIGNED NOT NULL DEFAULT 0,
    issued_at DATETIME NOT NULL,
    UNIQUE KEY learn_certificates_once (learner_id, track_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- v13: final tests (10 questions from a subject's lesson quizzes; 70% to pass before the certificate)
CREATE TABLE IF NOT EXISTS learn_final_tests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    learner_id INT UNSIGNED NOT NULL,
    track_id INT UNSIGNED NOT NULL,
    score INT UNSIGNED NOT NULL,
    total INT UNSIGNED NOT NULL,
    passed INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    KEY learn_final_learner (learner_id, track_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- v14: leaderboard (opt-in) and the weekly progress email (one-click off). Each line may say "Duplicate column" if already added: harmless.
ALTER TABLE learners ADD COLUMN leaderboard INT UNSIGNED NOT NULL DEFAULT 0;
ALTER TABLE learners ADD COLUMN weekly_email INT UNSIGNED NOT NULL DEFAULT 1;
ALTER TABLE learners ADD COLUMN mail_token VARCHAR(48) NOT NULL DEFAULT '';
-- v14: monthly notes pass rows (track_id 0 = every subject for pass_days days)
ALTER TABLE learn_note_payments ADD COLUMN pass_days INT UNSIGNED NOT NULL DEFAULT 0;

-- v15: classes for schools and trainers (join link; the tutor sees members' progress and certificates)
CREATE TABLE IF NOT EXISTS learn_classes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_id INT UNSIGNED NOT NULL,
    name VARCHAR(120) NOT NULL,
    code VARCHAR(12) NOT NULL UNIQUE,
    track_id INT UNSIGNED NULL,
    created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS learn_class_members (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    class_id INT UNSIGNED NOT NULL,
    learner_id INT UNSIGNED NOT NULL,
    joined_at DATETIME NOT NULL,
    UNIQUE KEY learn_class_once (class_id, learner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
