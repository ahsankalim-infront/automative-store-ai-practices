USE autozone_store;

CREATE TABLE IF NOT EXISTS categories (
  id            VARCHAR(36)  PRIMARY KEY,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  name          VARCHAR(255) NOT NULL,
  parent_id     VARCHAR(36),
  product_count INT DEFAULT 0,
  sort_order    INT DEFAULT 0,
  data          JSON NOT NULL,
  INDEX idx_parent (parent_id),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS brands (
  id              VARCHAR(36)  PRIMARY KEY,
  slug            VARCHAR(255) NOT NULL UNIQUE,
  name            VARCHAR(255) NOT NULL,
  product_count   INT DEFAULT 0,
  is_private_label TINYINT(1) DEFAULT 0,
  data            JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
