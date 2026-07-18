-- Legacy generic JSON collection store (optional backup / migration only).
-- App runtime uses entity tables (categories, products, …) via MysqlStore.

USE autozone_store;

CREATE TABLE IF NOT EXISTS collections (
  id            VARCHAR(36)  NOT NULL,
  collection_name VARCHAR(64) NOT NULL,
  data          JSON         NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id, collection_name),
  INDEX idx_collection (collection_name),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
