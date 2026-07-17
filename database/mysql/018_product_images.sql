-- Product gallery images (multiple images per product)
-- Run after 007_product_specs_fitment.sql
-- Seed rows: npm run mysql:seed-sql (included in 016_seed_from_json.sql product_images section)
-- Or apply this file then import product_images inserts from 016.

USE autozone_store;

CREATE TABLE IF NOT EXISTS product_images (
  id          VARCHAR(36)  NOT NULL PRIMARY KEY,
  product_id  VARCHAR(36)  NOT NULL,
  url         TEXT         NOT NULL,
  alt         VARCHAR(500) NOT NULL DEFAULT '',
  is_primary  TINYINT(1)   NOT NULL DEFAULT 0,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_images_product (product_id),
  INDEX idx_product_images_primary (product_id, is_primary),
  INDEX idx_product_images_sort (product_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Example: Custom Seat Covers product (p-004) — two gallery images
DELETE FROM product_images WHERE product_id = 'p-004';

INSERT INTO product_images (id, product_id, url, alt, is_primary, sort_order) VALUES
('i1', 'p-004', 'https://images.unsplash.com/photo-1760161339261-56487b766a17?auto=format&fit=crop&w=600&h=600&q=80', 'Premium quilted leather car seat covers', 1, 0),
('i2', 'p-004', 'https://images.unsplash.com/photo-1605437241278-c806d14a4d9?auto=format&fit=crop&w=600&h=600&q=80', 'Luxury car interior leather seats', 0, 1);
