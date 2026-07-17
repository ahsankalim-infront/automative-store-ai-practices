-- Bundle offers + section header config; runtime uses collections/bundle-offers.json via MysqlStore
USE autozone_store;

CREATE TABLE IF NOT EXISTS bundle_offers (
  id            VARCHAR(36)   NOT NULL PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  price         DECIMAL(12,2) NOT NULL DEFAULT 0,
  original_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  sort_order    INT           NOT NULL DEFAULT 0,
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  data          JSON          NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_bundle_active (is_active),
  INDEX idx_bundle_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bundle_offers_section (
  id          VARCHAR(36)  NOT NULL PRIMARY KEY,
  data        JSON         NOT NULL,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
