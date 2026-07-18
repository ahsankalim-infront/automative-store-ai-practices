-- Homepage section layout (MysqlStore: home-layout → home_layout)
USE autozone_store;

CREATE TABLE IF NOT EXISTS home_layout (
  id          VARCHAR(36)   NOT NULL PRIMARY KEY,
  desktop     JSON          NOT NULL,
  mobile      JSON          NOT NULL,
  data        JSON          NOT NULL,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
