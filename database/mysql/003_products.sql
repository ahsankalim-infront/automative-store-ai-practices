USE autozone_store;

CREATE TABLE IF NOT EXISTS products (
  id              VARCHAR(36)  PRIMARY KEY,
  slug            VARCHAR(255) NOT NULL UNIQUE,
  sku             VARCHAR(100),
  name            VARCHAR(500) NOT NULL,
  brand_slug      VARCHAR(100),
  category_slug   VARCHAR(100),
  price           DECIMAL(12,2) NOT NULL DEFAULT 0,
  original_price  DECIMAL(12,2),
  stock           INT NOT NULL DEFAULT 0,
  in_stock        TINYINT(1) DEFAULT 1,
  rating          DECIMAL(3,2) DEFAULT 0,
  review_count    INT DEFAULT 0,
  is_featured     TINYINT(1) DEFAULT 0,
  is_new          TINYINT(1) DEFAULT 0,
  is_best_seller  TINYINT(1) DEFAULT 0,
  is_flash_sale   TINYINT(1) DEFAULT 0,
  data            JSON NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category_slug),
  INDEX idx_brand (brand_slug),
  INDEX idx_featured (is_featured),
  INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
