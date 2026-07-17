-- Landing page promotion popups (runtime uses collections/promotion-popups.json via MysqlStore)
USE autozone_store;

CREATE TABLE IF NOT EXISTS promotion_popups (
  id              VARCHAR(36)   NOT NULL PRIMARY KEY,
  title           VARCHAR(255)  NOT NULL,
  subtitle        VARCHAR(255)  NULL,
  description     TEXT          NULL,
  badge_text      VARCHAR(128)  NULL,
  coupon_code     VARCHAR(64)   NULL,
  image           VARCHAR(512)  NOT NULL,
  mobile_image    VARCHAR(512)  NULL,
  cta_label       VARCHAR(128)  NOT NULL DEFAULT 'Shop Now',
  cta_href        VARCHAR(512)  NOT NULL DEFAULT '/products',
  secondary_label VARCHAR(128)  NULL,
  secondary_href  VARCHAR(512)  NULL,
  accent_color    VARCHAR(16)   NULL DEFAULT '#D50000',
  is_active       TINYINT(1)    NOT NULL DEFAULT 1,
  sort_order      INT           NOT NULL DEFAULT 0,
  show_delay_ms   INT           NOT NULL DEFAULT 1200,
  dismiss_days    INT           NOT NULL DEFAULT 3,
  valid_from      DATETIME      NULL,
  valid_to        DATETIME      NULL,
  data            JSON          NOT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_promotion_active (is_active, sort_order),
  INDEX idx_promotion_valid (valid_from, valid_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
