-- Category active/inactive flag for storefront visibility
USE autozone_store;

ALTER TABLE categories
  ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER sort_order;

CREATE INDEX idx_categories_active ON categories (is_active, sort_order);
