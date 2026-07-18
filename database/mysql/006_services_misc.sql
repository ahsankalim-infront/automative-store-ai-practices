USE autozone_store;

CREATE TABLE IF NOT EXISTS services (
  id          VARCHAR(36) PRIMARY KEY,
  slug        VARCHAR(255) NOT NULL UNIQUE,
  type        ENUM('ppf','detailing','installation','ceramic','tint','inspection') NOT NULL,
  name        VARCHAR(255) NOT NULL,
  price_from  DECIMAL(12,2),
  data        JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS stores (
  id      VARCHAR(36) PRIMARY KEY,
  name    VARCHAR(255) NOT NULL,
  city    VARCHAR(100) NOT NULL,
  data    JSON NOT NULL,
  INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service_bookings (
  id          VARCHAR(36) PRIMARY KEY,
  service_id  VARCHAR(36) NOT NULL,
  user_id     VARCHAR(36) NOT NULL,
  branch_id   VARCHAR(36) NOT NULL,
  status      ENUM('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'pending',
  booking_date DATE NOT NULL,
  data        JSON NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coupons (
  id          VARCHAR(36) PRIMARY KEY,
  code        VARCHAR(50) NOT NULL UNIQUE,
  type        ENUM('percentage','fixed','free_shipping') NOT NULL,
  value       DECIMAL(12,2) NOT NULL,
  is_active   TINYINT(1) DEFAULT 1,
  data        JSON NOT NULL,
  valid_from  DATETIME,
  valid_to    DATETIME,
  INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS banners (
  id          VARCHAR(36) PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  position    ENUM('hero','middle','bottom','sidebar') NOT NULL,
  is_active   TINYINT(1) DEFAULT 1,
  sort_order  INT DEFAULT 0,
  data        JSON NOT NULL,
  INDEX idx_position (position, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
  id            VARCHAR(36) PRIMARY KEY,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  title         VARCHAR(500) NOT NULL,
  is_featured   TINYINT(1) DEFAULT 0,
  published_at  DATETIME,
  data          JSON NOT NULL,
  INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
  id          VARCHAR(36) PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(32),
  subject     VARCHAR(255),
  message     TEXT NOT NULL,
  data        JSON NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id              VARCHAR(36) PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  data            JSON NULL,
  subscribed_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
