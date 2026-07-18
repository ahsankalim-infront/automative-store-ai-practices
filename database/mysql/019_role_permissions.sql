-- Role → admin dashboard link permissions (MysqlStore: role-permissions → role_permissions)
USE autozone_store;

CREATE TABLE IF NOT EXISTS role_permissions (
  id          VARCHAR(36)   NOT NULL PRIMARY KEY,
  roles       JSON          NOT NULL,
  data        JSON          NOT NULL,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Defaults: admin/manager = all links; staff = Commerce + Marketing + Content
INSERT INTO role_permissions (id, roles, data)
VALUES (
  'role-permissions-1',
  '{"admin":["/admin","/admin/analytics","/admin/orders","/admin/products","/admin/categories","/admin/brands","/admin/inventory","/admin/customers","/admin/contact-messages","/admin/reviews","/admin/vehicles","/admin/services","/admin/stores","/admin/bookings","/admin/coupons","/admin/promotions","/admin/banners","/admin/hero-slides","/admin/bundle-offers","/admin/blogs","/admin/about-content","/admin/home-layout","/admin/seo","/admin/media","/admin/cms","/admin/activity-logs","/admin/cache","/admin/reports","/admin/notifications","/admin/roles","/admin/settings"],"manager":["/admin","/admin/analytics","/admin/orders","/admin/products","/admin/categories","/admin/brands","/admin/inventory","/admin/customers","/admin/contact-messages","/admin/reviews","/admin/vehicles","/admin/services","/admin/stores","/admin/bookings","/admin/coupons","/admin/promotions","/admin/banners","/admin/hero-slides","/admin/bundle-offers","/admin/blogs","/admin/about-content","/admin/home-layout","/admin/seo","/admin/media","/admin/cms","/admin/activity-logs","/admin/cache","/admin/reports","/admin/notifications","/admin/roles","/admin/settings"],"staff":["/admin/orders","/admin/products","/admin/categories","/admin/brands","/admin/inventory","/admin/coupons","/admin/promotions","/admin/banners","/admin/hero-slides","/admin/bundle-offers","/admin/blogs","/admin/about-content","/admin/home-layout","/admin/seo","/admin/media","/admin/cms"]}',
  '{"id":"role-permissions-1","roles":{"admin":["/admin","/admin/analytics","/admin/orders","/admin/products","/admin/categories","/admin/brands","/admin/inventory","/admin/customers","/admin/contact-messages","/admin/reviews","/admin/vehicles","/admin/services","/admin/stores","/admin/bookings","/admin/coupons","/admin/promotions","/admin/banners","/admin/hero-slides","/admin/bundle-offers","/admin/blogs","/admin/about-content","/admin/home-layout","/admin/seo","/admin/media","/admin/cms","/admin/activity-logs","/admin/cache","/admin/reports","/admin/notifications","/admin/roles","/admin/settings"],"manager":["/admin","/admin/analytics","/admin/orders","/admin/products","/admin/categories","/admin/brands","/admin/inventory","/admin/customers","/admin/contact-messages","/admin/reviews","/admin/vehicles","/admin/services","/admin/stores","/admin/bookings","/admin/coupons","/admin/promotions","/admin/banners","/admin/hero-slides","/admin/bundle-offers","/admin/blogs","/admin/about-content","/admin/home-layout","/admin/seo","/admin/media","/admin/cms","/admin/activity-logs","/admin/cache","/admin/reports","/admin/notifications","/admin/roles","/admin/settings"],"staff":["/admin/orders","/admin/products","/admin/categories","/admin/brands","/admin/inventory","/admin/coupons","/admin/promotions","/admin/banners","/admin/hero-slides","/admin/bundle-offers","/admin/blogs","/admin/about-content","/admin/home-layout","/admin/seo","/admin/media","/admin/cms"]},"updatedAt":"2026-07-18T00:00:00.000Z"}'
)
ON DUPLICATE KEY UPDATE id = id;
