-- Store settings / business profile (normalized; runtime uses collections/settings.json via MysqlStore)
USE autozone_store;

CREATE TABLE IF NOT EXISTS store_settings (
  id                      VARCHAR(36)   NOT NULL PRIMARY KEY,
  store_name              VARCHAR(255)  NOT NULL,
  short_name              VARCHAR(32)   NOT NULL DEFAULT 'SPH',
  tagline                 VARCHAR(255)  NOT NULL DEFAULT '',
  description             TEXT          NOT NULL,
  support_email           VARCHAR(255)  NOT NULL,
  support_phone           VARCHAR(32)   NOT NULL,
  whatsapp                VARCHAR(32)   NOT NULL DEFAULT '',
  order_prefix            VARCHAR(16)   NOT NULL DEFAULT 'SHP',
  business_hours          VARCHAR(255)  NOT NULL DEFAULT '',
  announcement_text       VARCHAR(255)  NOT NULL DEFAULT '',
  address                 TEXT          NOT NULL,
  address_city            VARCHAR(64)   NOT NULL DEFAULT 'Lahore',
  address_province        VARCHAR(64)   NOT NULL DEFAULT 'Punjab',
  address_country         VARCHAR(64)   NOT NULL DEFAULT 'Pakistan',
  contact_persons         JSON          NOT NULL,
  standard_shipping       DECIMAL(10,2) NOT NULL DEFAULT 100,
  express_shipping        DECIMAL(10,2) NOT NULL DEFAULT 250,
  free_shipping_threshold DECIMAL(10,2) NOT NULL DEFAULT 1500,
  currency                VARCHAR(8)    NOT NULL DEFAULT 'PKR',
  cms_pages               JSON          NULL,
  data                    JSON          NOT NULL,
  updated_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
