-- Product specifications & vehicle fitment (linked to product id from collections/JSON)
USE autozone_store;

CREATE TABLE IF NOT EXISTS product_specifications (
  id          VARCHAR(36)  NOT NULL PRIMARY KEY,
  product_id  VARCHAR(36)  NOT NULL,
  label       VARCHAR(255) NOT NULL,
  value       TEXT         NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_specs_product (product_id),
  INDEX idx_product_specs_label (label)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_vehicle_fit (
  id                VARCHAR(36)  NOT NULL PRIMARY KEY,
  product_id        VARCHAR(36)  NOT NULL,
  vehicle_make_id   VARCHAR(64)  NULL,
  vehicle_model_id  VARCHAR(64)  NULL,
  brand             VARCHAR(100) NOT NULL,
  model             VARCHAR(100) NOT NULL,
  year_from         INT          NOT NULL,
  year_to           INT          NOT NULL,
  variants          JSON         NULL,
  sort_order        INT          NOT NULL DEFAULT 0,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_fit_product (product_id),
  INDEX idx_fit_vehicle (brand, model),
  INDEX idx_fit_years (year_from, year_to),
  INDEX idx_fit_make_model_ids (vehicle_make_id, vehicle_model_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
