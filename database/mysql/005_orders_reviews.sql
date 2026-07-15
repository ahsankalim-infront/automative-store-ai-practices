USE autozone_store;

CREATE TABLE IF NOT EXISTS orders (
  id              VARCHAR(36)  PRIMARY KEY,
  order_number    VARCHAR(50)  NOT NULL UNIQUE,
  user_id         VARCHAR(36)  NOT NULL,
  subtotal        DECIMAL(12,2) NOT NULL,
  shipping_cost   DECIMAL(12,2) DEFAULT 0,
  discount        DECIMAL(12,2) DEFAULT 0,
  tax             DECIMAL(12,2) DEFAULT 0,
  total           DECIMAL(12,2) NOT NULL,
  status          ENUM('pending','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','returned','refunded') DEFAULT 'pending',
  payment_method  ENUM('cod','card','bank_transfer','wallet') DEFAULT 'cod',
  payment_status  ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  coupon_code     VARCHAR(50),
  tracking_number VARCHAR(100),
  data            JSON NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id                  VARCHAR(36) PRIMARY KEY,
  product_id          VARCHAR(36) NOT NULL,
  user_id             VARCHAR(36) NOT NULL,
  rating              TINYINT NOT NULL,
  title               VARCHAR(255),
  body                TEXT,
  is_verified_purchase TINYINT(1) DEFAULT 0,
  data                JSON NOT NULL,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product (product_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
