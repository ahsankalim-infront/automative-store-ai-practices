-- Website activity / audit logs (runtime uses collections/activity-logs.json via MysqlStore)
USE autozone_store;

CREATE TABLE IF NOT EXISTS activity_logs (
  id           VARCHAR(36)   NOT NULL PRIMARY KEY,
  action       VARCHAR(128)  NOT NULL,
  category     VARCHAR(32)   NOT NULL,
  status       VARCHAR(16)   NOT NULL DEFAULT 'success',
  message      TEXT          NOT NULL,
  actor_id     VARCHAR(36)   NULL,
  actor_email  VARCHAR(255)  NULL,
  actor_name   VARCHAR(255)  NULL,
  actor_role   VARCHAR(32)   NULL,
  entity_type  VARCHAR(64)   NULL,
  entity_id    VARCHAR(64)   NULL,
  ip           VARCHAR(64)   NULL,
  user_agent   VARCHAR(512)  NULL,
  path         VARCHAR(512)  NULL,
  metadata     JSON          NULL,
  data         JSON          NOT NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activity_category (category, created_at),
  INDEX idx_activity_status (status, created_at),
  INDEX idx_activity_actor (actor_email, created_at),
  INDEX idx_activity_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
