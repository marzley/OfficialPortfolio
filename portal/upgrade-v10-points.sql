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
