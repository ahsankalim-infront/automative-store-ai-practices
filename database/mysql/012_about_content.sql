-- About page content (MysqlStore maps about-* collections to these tables)
USE autozone_store;

CREATE TABLE IF NOT EXISTS about_journey_section (
  id          VARCHAR(36)   NOT NULL PRIMARY KEY,
  eyebrow     VARCHAR(128)  NOT NULL,
  title       VARCHAR(255)  NOT NULL,
  subtitle    TEXT          NOT NULL,
  is_enabled  TINYINT(1)    NOT NULL DEFAULT 1,
  data        JSON          NOT NULL,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS about_leadership_section (
  id          VARCHAR(36)   NOT NULL PRIMARY KEY,
  eyebrow     VARCHAR(128)  NOT NULL,
  title       VARCHAR(255)  NOT NULL,
  subtitle    TEXT          NOT NULL,
  is_enabled  TINYINT(1)    NOT NULL DEFAULT 1,
  data        JSON          NOT NULL,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS about_team (
  id          VARCHAR(36)   NOT NULL PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  role        VARCHAR(255)  NOT NULL,
  bio         VARCHAR(512)  NOT NULL DEFAULT '',
  image       VARCHAR(512)  NOT NULL,
  sort_order  INT           NOT NULL DEFAULT 0,
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  data        JSON          NOT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_about_team_sort (sort_order, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS about_milestones (
  id          VARCHAR(36)   NOT NULL PRIMARY KEY,
  year        VARCHAR(16)   NOT NULL,
  title       VARCHAR(255)  NOT NULL,
  description TEXT          NOT NULL,
  sort_order  INT           NOT NULL DEFAULT 0,
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  data        JSON          NOT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_about_milestones_sort (sort_order, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
