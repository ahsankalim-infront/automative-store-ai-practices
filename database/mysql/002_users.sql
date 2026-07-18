-- Entity tables used by MysqlStore when DATA_SOURCE=mysql.
-- Each entity has its own table (users, products, categories, …).

USE autozone_store;

CREATE TABLE IF NOT EXISTS users (
  id              VARCHAR(36)  PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  phone           VARCHAR(20),
  password_hash   VARCHAR(255) NOT NULL,
  role            ENUM('customer','admin','manager','staff') NOT NULL DEFAULT 'customer',
  avatar          VARCHAR(500),
  addresses       JSON,
  loyalty_points  INT DEFAULT 0,
  is_verified     TINYINT(1) DEFAULT 0,
  data            JSON NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_role (role),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
