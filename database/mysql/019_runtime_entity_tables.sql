-- Runtime entity tables previously missing (vehicle_makes, notifications, etc.).
-- Also documents ALTER for older DBs that predate `data`/`phone` on users/contacts.
--
-- Fresh installs (002/006 already include data/phone): only CREATE TABLE statements needed.
-- Existing DBs created before those columns: run the ALTER block once (ignore duplicate-column errors).
USE autozone_store;

-- ─── Optional upgrades for older databases ──────────────────────────────────
-- Uncomment and run once if columns are missing:
--
-- ALTER TABLE users ADD COLUMN data JSON NULL AFTER is_verified;
-- ALTER TABLE contact_messages ADD COLUMN phone VARCHAR(32) NULL AFTER email;
-- ALTER TABLE contact_messages ADD COLUMN data JSON NULL AFTER message;
-- ALTER TABLE newsletter_subscribers ADD COLUMN data JSON NULL AFTER email;

-- ─── vehicle_makes ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vehicle_makes (
  id            VARCHAR(36)  PRIMARY KEY,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  name          VARCHAR(255) NOT NULL,
  logo          VARCHAR(500),
  country       VARCHAR(100),
  data          JSON NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vehicle_makes_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── notifications ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id            VARCHAR(36)  PRIMARY KEY,
  user_id       VARCHAR(36)  NOT NULL,
  audience      VARCHAR(32)  NOT NULL DEFAULT 'customer',
  type          VARCHAR(64)  NOT NULL,
  title         VARCHAR(255) NOT NULL,
  body          TEXT         NOT NULL,
  order_id      VARCHAR(36),
  order_number  VARCHAR(50),
  link          VARCHAR(512),
  is_read       TINYINT(1)   NOT NULL DEFAULT 0,
  email_sent    TINYINT(1)   NOT NULL DEFAULT 0,
  push_sent     TINYINT(1)   NOT NULL DEFAULT 0,
  data          JSON         NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notifications_user (user_id, created_at),
  INDEX idx_notifications_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── push_subscriptions ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id            VARCHAR(36)  PRIMARY KEY,
  user_id       VARCHAR(36)  NOT NULL,
  user_email    VARCHAR(255) NOT NULL,
  endpoint      TEXT         NOT NULL,
  keys_json     JSON         NOT NULL,
  user_agent    VARCHAR(512),
  device_label  VARCHAR(255),
  data          JSON         NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_push_user (user_id),
  INDEX idx_push_email (user_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── analytics (singleton document) ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics (
  id            VARCHAR(36)  PRIMARY KEY,
  data          JSON         NOT NULL,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
