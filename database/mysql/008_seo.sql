-- SEO configuration tables (normalized; runtime uses collections/seo.json via MysqlStore)
USE autozone_store;

CREATE TABLE IF NOT EXISTS seo_global (
  id                      VARCHAR(36)   NOT NULL PRIMARY KEY,
  site_name               VARCHAR(255)  NOT NULL,
  site_title              VARCHAR(255)  NOT NULL,
  title_template          VARCHAR(255)  NOT NULL DEFAULT '%s | Site',
  default_description     TEXT          NOT NULL,
  default_keywords        JSON          NULL,
  default_og_image        VARCHAR(512)  NULL,
  twitter_handle          VARCHAR(64)   NULL,
  google_verification     VARCHAR(128)  NULL,
  bing_verification       VARCHAR(128)  NULL,
  robots_allow            TINYINT(1)    NOT NULL DEFAULT 1,
  organization_name       VARCHAR(255)  NULL,
  organization_logo       VARCHAR(512)  NULL,
  locale                  VARCHAR(16)   NOT NULL DEFAULT 'en_PK',
  robots_extra            TEXT          NULL,
  data                    JSON          NOT NULL,
  updated_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS seo_pages (
  id            VARCHAR(36)   NOT NULL PRIMARY KEY,
  page_key      VARCHAR(64)   NOT NULL,
  path          VARCHAR(255)  NOT NULL,
  title         VARCHAR(255)  NULL,
  description   TEXT          NULL,
  keywords      JSON          NULL,
  og_image      VARCHAR(512)  NULL,
  canonical     VARCHAR(512)  NULL,
  noindex       TINYINT(1)    NOT NULL DEFAULT 0,
  sitemap       TINYINT(1)    NOT NULL DEFAULT 1,
  priority      DECIMAL(2,1)  NOT NULL DEFAULT 0.5,
  changefreq    VARCHAR(16)   NOT NULL DEFAULT 'weekly',
  data          JSON          NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_seo_page_key (page_key),
  INDEX idx_seo_path (path),
  INDEX idx_seo_sitemap (sitemap, noindex)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS seo_entity (
  id              VARCHAR(36)   NOT NULL PRIMARY KEY,
  entity_type     VARCHAR(32)   NOT NULL,
  entity_id       VARCHAR(36)   NOT NULL,
  meta_title      VARCHAR(255)  NULL,
  meta_description TEXT         NULL,
  og_image        VARCHAR(512)  NULL,
  keywords        JSON          NULL,
  noindex         TINYINT(1)    NOT NULL DEFAULT 0,
  data            JSON          NOT NULL,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_seo_entity (entity_type, entity_id),
  INDEX idx_seo_entity_type (entity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
