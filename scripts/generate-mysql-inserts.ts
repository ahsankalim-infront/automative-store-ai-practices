/**
 * Generates database/mysql/016_seed_from_json.sql from data/json/*.json
 *
 * Run: npm run mysql:seed-sql
 *
 * Import after schema migrations (001–015):
 *   mysql -u root -p autozone_store < database/mysql/016_seed_from_json.sql
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data", "json");
const OUT_FILE = join(process.cwd(), "database", "mysql", "016_seed_from_json.sql");

function sqlStr(v: string | null | undefined): string {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "''")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")}'`;
}

function sqlNum(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return "NULL";
  return String(v);
}

function sqlBool(v: boolean | null | undefined, defaultVal = 0): string {
  if (v === null || v === undefined) return String(defaultVal);
  return v ? "1" : "0";
}

function sqlJson(v: unknown): string {
  return sqlStr(JSON.stringify(v));
}

function sqlDateTime(iso?: string | null): string {
  if (!iso) return "NOW()";
  const normalized = iso.replace("T", " ").replace("Z", "").slice(0, 19);
  return sqlStr(normalized);
}

function pickId(item: Record<string, unknown>, fallback: string): string {
  return typeof item.id === "string" && item.id ? item.id : fallback;
}

type Row = Record<string, unknown>;

function loadCollectionItems(filename: string): { collection: string; id: string; data: Row }[] {
  const filePath = join(DATA_DIR, `${filename}.json`);
  if (!existsSync(filePath)) return [];

  const raw = JSON.parse(readFileSync(filePath, "utf-8")) as unknown;
  const collection = filename;

  if (Array.isArray(raw)) {
    return raw.map((item, index) => {
      const row = item as Row;
      return {
        collection,
        id: pickId(row, `${filename}-${index + 1}`),
        data: row,
      };
    });
  }

  if (raw && typeof raw === "object") {
    const row = raw as Row;
    return [
      {
        collection,
        id: pickId(row, `${filename}-1`),
        data: row,
      },
    ];
  }

  return [];
}

function sectionHeader(title: string): string {
  return `\n-- ─── ${title} ${"─".repeat(Math.max(0, 60 - title.length))}\n`;
}

function buildCollectionsSql(allItems: { collection: string; id: string; data: Row }[]): string {
  let sql = sectionHeader("collections (app runtime — MysqlStore)");
  sql += "DELETE FROM collections;\n";

  if (allItems.length === 0) {
    sql += "-- (no JSON data found)\n";
    return sql;
  }

  for (const { collection, id, data } of allItems) {
    const createdAt =
      typeof data.createdAt === "string"
        ? data.createdAt
        : typeof data.subscribedAt === "string"
          ? data.subscribedAt
          : typeof data.updatedAt === "string"
            ? data.updatedAt
            : null;

    sql += `INSERT INTO collections (id, collection_name, data, created_at, updated_at) VALUES (${sqlStr(id)}, ${sqlStr(collection)}, ${sqlJson(data)}, ${sqlDateTime(createdAt)}, ${sqlDateTime(createdAt)});\n`;
  }

  return sql;
}

function buildNormalizedSql(): string {
  let sql = "";

  // users
  const users = loadCollectionItems("users");
  if (users.length) {
    sql += sectionHeader("users");
    sql += "DELETE FROM users;\n";
    for (const { data } of users) {
      sql += `INSERT INTO users (id, name, email, phone, password_hash, role, avatar, addresses, loyalty_points, is_verified, created_at) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.name))}, ${sqlStr(String(data.email))}, ${sqlStr(data.phone as string | undefined)}, ${sqlStr(String(data.passwordHash))}, ${sqlStr(String(data.role ?? "customer"))}, ${sqlStr(data.avatar as string | undefined)}, ${sqlJson(data.addresses ?? [])}, ${sqlNum(Number(data.loyaltyPoints ?? 0))}, ${sqlBool(data.isVerified as boolean | undefined)}, ${sqlDateTime(data.createdAt as string | undefined)});\n`;
    }
  }

  // categories
  const categories = loadCollectionItems("categories");
  if (categories.length) {
    sql += sectionHeader("categories");
    sql += "DELETE FROM categories;\n";
    for (const { data } of categories) {
      sql += `INSERT INTO categories (id, slug, name, parent_id, product_count, sort_order, is_active, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.slug))}, ${sqlStr(String(data.name))}, ${sqlStr(data.parentId as string | undefined)}, ${sqlNum(Number(data.productCount ?? 0))}, ${sqlNum(Number(data.sortOrder ?? 0))}, ${sqlBool(data.isActive as boolean | undefined, 1)}, ${sqlJson(data)});\n`;
    }
  }

  // brands
  const brands = loadCollectionItems("brands");
  if (brands.length) {
    sql += sectionHeader("brands");
    sql += "DELETE FROM brands;\n";
    for (const { data } of brands) {
      sql += `INSERT INTO brands (id, slug, name, product_count, is_private_label, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.slug))}, ${sqlStr(String(data.name))}, ${sqlNum(Number(data.productCount ?? 0))}, ${sqlBool(data.isPrivateLabel as boolean | undefined)}, ${sqlJson(data)});\n`;
    }
  }

  // products + specs + fitment
  const products = loadCollectionItems("products");
  if (products.length) {
    sql += sectionHeader("products");
    sql += "DELETE FROM products;\n";
    for (const { data } of products) {
      sql += `INSERT INTO products (id, slug, sku, name, brand_slug, category_slug, price, original_price, stock, in_stock, rating, review_count, is_featured, is_new, is_best_seller, is_flash_sale, data, created_at, updated_at) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.slug))}, ${sqlStr(data.sku as string | undefined)}, ${sqlStr(String(data.name))}, ${sqlStr(data.brandSlug as string | undefined)}, ${sqlStr(data.categorySlug as string | undefined)}, ${sqlNum(Number(data.price ?? 0))}, ${sqlNum(data.originalPrice as number | undefined)}, ${sqlNum(Number(data.stock ?? 0))}, ${sqlBool(data.inStock as boolean | undefined, 1)}, ${sqlNum(Number(data.rating ?? 0))}, ${sqlNum(Number(data.reviewCount ?? 0))}, ${sqlBool(data.isFeatured as boolean | undefined)}, ${sqlBool(data.isNew as boolean | undefined)}, ${sqlBool(data.isBestSeller as boolean | undefined)}, ${sqlBool(data.isFlashSale as boolean | undefined)}, ${sqlJson(data)}, ${sqlDateTime(data.createdAt as string | undefined)}, ${sqlDateTime(data.updatedAt as string | undefined)});\n`;
    }

    sql += sectionHeader("product_specifications");
    sql += "DELETE FROM product_specifications;\n";
    for (const { data } of products) {
      const specs = (data.specifications as Row[] | undefined) ?? [];
      specs.forEach((spec, index) => {
        const specId = pickId(spec, `${String(data.id)}-spec-${index + 1}`);
        sql += `INSERT INTO product_specifications (id, product_id, label, value, sort_order) VALUES (${sqlStr(specId)}, ${sqlStr(String(data.id))}, ${sqlStr(String(spec.label ?? spec.name ?? ""))}, ${sqlStr(String(spec.value ?? ""))}, ${sqlNum(Number(spec.sortOrder ?? index))});\n`;
      });
    }

    sql += sectionHeader("product_vehicle_fit");
    sql += "DELETE FROM product_vehicle_fit;\n";
    for (const { data } of products) {
      const fits = (data.vehicleCompatibility as Row[] | undefined) ?? [];
      fits.forEach((fit, index) => {
        const fitId = pickId(fit, `${String(data.id)}-fit-${index + 1}`);
        sql += `INSERT INTO product_vehicle_fit (id, product_id, vehicle_make_id, vehicle_model_id, brand, model, year_from, year_to, variants, sort_order) VALUES (${sqlStr(fitId)}, ${sqlStr(String(data.id))}, ${sqlStr(fit.vehicleMakeId as string | undefined)}, ${sqlStr(fit.vehicleModelId as string | undefined)}, ${sqlStr(String(fit.brand ?? fit.make ?? ""))}, ${sqlStr(String(fit.model ?? ""))}, ${sqlNum(Number(fit.yearFrom ?? fit.year ?? 2000))}, ${sqlNum(Number(fit.yearTo ?? fit.year ?? 2026))}, ${fit.variants ? sqlJson(fit.variants) : "NULL"}, ${sqlNum(Number(fit.sortOrder ?? index))});\n`;
      });
    }
  }

  // orders
  const orders = loadCollectionItems("orders");
  if (orders.length) {
    sql += sectionHeader("orders");
    sql += "DELETE FROM orders;\n";
    for (const { data } of orders) {
      sql += `INSERT INTO orders (id, order_number, user_id, subtotal, shipping_cost, discount, tax, total, status, payment_method, payment_status, coupon_code, tracking_number, data, created_at, updated_at) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.orderNumber))}, ${sqlStr(String(data.userId))}, ${sqlNum(Number(data.subtotal ?? 0))}, ${sqlNum(Number(data.shippingCost ?? 0))}, ${sqlNum(Number(data.discount ?? 0))}, ${sqlNum(Number(data.tax ?? 0))}, ${sqlNum(Number(data.total ?? 0))}, ${sqlStr(String(data.status ?? "pending"))}, ${sqlStr(String(data.paymentMethod ?? "cod"))}, ${sqlStr(String(data.paymentStatus ?? "pending"))}, ${sqlStr(data.couponCode as string | undefined)}, ${sqlStr(data.trackingNumber as string | undefined)}, ${sqlJson(data)}, ${sqlDateTime(data.createdAt as string | undefined)}, ${sqlDateTime(data.updatedAt as string | undefined)});\n`;
    }
  }

  // reviews
  const reviews = loadCollectionItems("reviews");
  if (reviews.length) {
    sql += sectionHeader("reviews");
    sql += "DELETE FROM reviews;\n";
    for (const { data } of reviews) {
      sql += `INSERT INTO reviews (id, product_id, user_id, rating, title, body, is_verified_purchase, data, created_at) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.productId))}, ${sqlStr(String(data.userId))}, ${sqlNum(Number(data.rating ?? 5))}, ${sqlStr(data.title as string | undefined)}, ${sqlStr((data.body ?? data.comment) as string | undefined)}, ${sqlBool(data.isVerifiedPurchase as boolean | undefined)}, ${sqlJson(data)}, ${sqlDateTime(data.createdAt as string | undefined)});\n`;
    }
  }

  // services
  const services = loadCollectionItems("services");
  if (services.length) {
    sql += sectionHeader("services");
    sql += "DELETE FROM services;\n";
    for (const { data } of services) {
      sql += `INSERT INTO services (id, slug, type, name, price_from, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.slug))}, ${sqlStr(String(data.type ?? "installation"))}, ${sqlStr(String(data.name))}, ${sqlNum(data.priceFrom as number | undefined)}, ${sqlJson(data)});\n`;
    }
  }

  // stores
  const stores = loadCollectionItems("stores");
  if (stores.length) {
    sql += sectionHeader("stores");
    sql += "DELETE FROM stores;\n";
    for (const { data } of stores) {
      sql += `INSERT INTO stores (id, name, city, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.name))}, ${sqlStr(String(data.city ?? data.addressCity ?? ""))}, ${sqlJson(data)});\n`;
    }
  }

  // bookings
  const bookings = loadCollectionItems("bookings");
  if (bookings.length) {
    sql += sectionHeader("service_bookings");
    sql += "DELETE FROM service_bookings;\n";
    for (const { data } of bookings) {
      const bookingDate = String(data.date ?? data.bookingDate ?? "2026-01-01").slice(0, 10);
      sql += `INSERT INTO service_bookings (id, service_id, user_id, branch_id, status, booking_date, data, created_at) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.serviceId))}, ${sqlStr(String(data.userId))}, ${sqlStr(String(data.branchId))}, ${sqlStr(String(data.status ?? "pending"))}, ${sqlStr(bookingDate)}, ${sqlJson(data)}, ${sqlDateTime(data.createdAt as string | undefined)});\n`;
    }
  }

  // coupons
  const coupons = loadCollectionItems("coupons");
  if (coupons.length) {
    sql += sectionHeader("coupons");
    sql += "DELETE FROM coupons;\n";
    for (const { data } of coupons) {
      sql += `INSERT INTO coupons (id, code, type, value, is_active, data, valid_from, valid_to) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.code))}, ${sqlStr(String(data.type ?? "fixed"))}, ${sqlNum(Number(data.value ?? 0))}, ${sqlBool(data.isActive as boolean | undefined, 1)}, ${sqlJson(data)}, ${sqlDateTime(data.validFrom as string | undefined)}, ${sqlDateTime(data.validTo as string | undefined)});\n`;
    }
  }

  // banners
  const banners = loadCollectionItems("banners");
  if (banners.length) {
    sql += sectionHeader("banners");
    sql += "DELETE FROM banners;\n";
    for (const { data } of banners) {
      sql += `INSERT INTO banners (id, title, position, is_active, sort_order, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.title ?? data.name ?? ""))}, ${sqlStr(String(data.position ?? "middle"))}, ${sqlBool(data.isActive as boolean | undefined, 1)}, ${sqlNum(Number(data.sortOrder ?? 0))}, ${sqlJson(data)});\n`;
    }
  }

  // blogs
  const blogs = loadCollectionItems("blogs");
  if (blogs.length) {
    sql += sectionHeader("blog_posts");
    sql += "DELETE FROM blog_posts;\n";
    for (const { data } of blogs) {
      sql += `INSERT INTO blog_posts (id, slug, title, is_featured, published_at, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.slug))}, ${sqlStr(String(data.title))}, ${sqlBool(data.isFeatured as boolean | undefined)}, ${sqlDateTime((data.publishedAt ?? data.createdAt) as string | undefined)}, ${sqlJson(data)});\n`;
    }
  }

  // contact messages
  const contacts = loadCollectionItems("contact-messages");
  if (contacts.length) {
    sql += sectionHeader("contact_messages");
    sql += "DELETE FROM contact_messages;\n";
    for (const { data } of contacts) {
      sql += `INSERT INTO contact_messages (id, name, email, subject, message, created_at) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.name))}, ${sqlStr(String(data.email ?? ""))}, ${sqlStr(String(data.subject ?? ""))}, ${sqlStr(String(data.message))}, ${sqlDateTime(data.createdAt as string | undefined)});\n`;
    }
  }

  // newsletter
  const subs = loadCollectionItems("newsletter-subscribers");
  if (subs.length) {
    sql += sectionHeader("newsletter_subscribers");
    sql += "DELETE FROM newsletter_subscribers;\n";
    for (const { data } of subs) {
      sql += `INSERT INTO newsletter_subscribers (id, email, subscribed_at) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.email))}, ${sqlDateTime((data.subscribedAt ?? data.createdAt) as string | undefined)});\n`;
    }
  }

  // store settings
  const settings = loadCollectionItems("settings");
  if (settings.length) {
    sql += sectionHeader("store_settings");
    sql += "DELETE FROM store_settings;\n";
    for (const { data } of settings) {
      sql += `INSERT INTO store_settings (id, store_name, short_name, tagline, description, support_email, support_phone, whatsapp, order_prefix, business_hours, announcement_text, address, address_city, address_province, address_country, contact_persons, standard_shipping, express_shipping, free_shipping_threshold, currency, cms_pages, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.storeName ?? data.name ?? ""))}, ${sqlStr(String(data.shortName ?? "SPH"))}, ${sqlStr(String(data.tagline ?? ""))}, ${sqlStr(String(data.description ?? ""))}, ${sqlStr(String(data.supportEmail ?? data.email ?? ""))}, ${sqlStr(String(data.supportPhone ?? ""))}, ${sqlStr(String(data.whatsapp ?? ""))}, ${sqlStr(String(data.orderPrefix ?? "SHP"))}, ${sqlStr(String(data.businessHours ?? ""))}, ${sqlStr(String(data.announcementText ?? ""))}, ${sqlStr(String(data.address ?? ""))}, ${sqlStr(String(data.addressCity ?? "Lahore"))}, ${sqlStr(String(data.addressProvince ?? "Punjab"))}, ${sqlStr(String(data.addressCountry ?? "Pakistan"))}, ${sqlJson(data.contactPersons ?? [])}, ${sqlNum(Number(data.standardShipping ?? 100))}, ${sqlNum(Number(data.expressShipping ?? 250))}, ${sqlNum(Number(data.freeShippingThreshold ?? 1500))}, ${sqlStr(String(data.currency ?? "PKR"))}, ${data.cmsPages ? sqlJson(data.cmsPages) : "NULL"}, ${sqlJson(data)});\n`;
    }
  }

  // seo
  const seoItems = loadCollectionItems("seo");
  if (seoItems.length) {
    sql += sectionHeader("seo_global + seo_pages");
    sql += "DELETE FROM seo_pages;\nDELETE FROM seo_global;\n";
    for (const { data } of seoItems) {
      const global = (data.global as Row | undefined) ?? {};
      sql += `INSERT INTO seo_global (id, site_name, site_title, title_template, default_description, default_keywords, default_og_image, twitter_handle, google_verification, bing_verification, robots_allow, organization_name, organization_logo, locale, robots_extra, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(global.siteName ?? ""))}, ${sqlStr(String(global.siteTitle ?? ""))}, ${sqlStr(String(global.titleTemplate ?? "%s | Site"))}, ${sqlStr(String(global.defaultDescription ?? ""))}, ${global.defaultKeywords ? sqlJson(global.defaultKeywords) : "NULL"}, ${sqlStr(global.defaultOgImage as string | undefined)}, ${sqlStr(global.twitterHandle as string | undefined)}, ${sqlStr(global.googleSiteVerification as string | undefined)}, ${sqlStr(global.bingSiteVerification as string | undefined)}, ${sqlBool(global.robotsAllow as boolean | undefined, 1)}, ${sqlStr(global.organizationName as string | undefined)}, ${sqlStr(global.organizationLogo as string | undefined)}, ${sqlStr(String(global.locale ?? "en_PK"))}, ${sqlStr(global.robotsExtra as string | undefined)}, ${sqlJson(data)});\n`;

      const pages = data.pages as Record<string, Row> | undefined;
      if (pages) {
        for (const [pageKey, page] of Object.entries(pages)) {
          const pageId = pickId(page, `${String(data.id)}-page-${pageKey}`);
          sql += `INSERT INTO seo_pages (id, page_key, path, title, description, keywords, og_image, canonical, noindex, sitemap, priority, changefreq, data) VALUES (${sqlStr(pageId)}, ${sqlStr(pageKey)}, ${sqlStr(String(page.path ?? `/${pageKey}`))}, ${sqlStr(page.title as string | undefined)}, ${sqlStr(page.description as string | undefined)}, ${page.keywords ? sqlJson(page.keywords) : "NULL"}, ${sqlStr(page.ogImage as string | undefined)}, ${sqlStr(page.canonical as string | undefined)}, ${sqlBool(page.noindex as boolean | undefined)}, ${sqlBool(page.sitemap as boolean | undefined, 1)}, ${sqlNum(Number(page.priority ?? 0.5))}, ${sqlStr(String(page.changefreq ?? "weekly"))}, ${sqlJson(page)});\n`;
        }
      }
    }
  }

  // home layout
  const layouts = loadCollectionItems("home-layout");
  if (layouts.length) {
    sql += sectionHeader("home_layout");
    sql += "DELETE FROM home_layout;\n";
    for (const { data } of layouts) {
      sql += `INSERT INTO home_layout (id, desktop, mobile, data) VALUES (${sqlStr(String(data.id))}, ${sqlJson(data.desktop ?? [])}, ${sqlJson(data.mobile ?? [])}, ${sqlJson(data)});\n`;
    }
  }

  // bundle offers
  const bundles = loadCollectionItems("bundle-offers");
  if (bundles.length) {
    sql += sectionHeader("bundle_offers");
    sql += "DELETE FROM bundle_offers;\n";
    for (const { data } of bundles) {
      sql += `INSERT INTO bundle_offers (id, title, price, original_price, sort_order, is_active, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.title ?? ""))}, ${sqlNum(Number(data.price ?? 0))}, ${sqlNum(Number(data.originalPrice ?? 0))}, ${sqlNum(Number(data.sortOrder ?? 0))}, ${sqlBool(data.isActive as boolean | undefined, 1)}, ${sqlJson(data)});\n`;
    }
  }

  const bundleSection = loadCollectionItems("bundle-offers-section");
  if (bundleSection.length) {
    sql += sectionHeader("bundle_offers_section");
    sql += "DELETE FROM bundle_offers_section;\n";
    for (const { data } of bundleSection) {
      sql += `INSERT INTO bundle_offers_section (id, data) VALUES (${sqlStr(String(data.id))}, ${sqlJson(data)});\n`;
    }
  }

  // about content
  const journey = loadCollectionItems("about-journey-section");
  if (journey.length) {
    sql += sectionHeader("about_journey_section");
    sql += "DELETE FROM about_journey_section;\n";
    for (const { data } of journey) {
      sql += `INSERT INTO about_journey_section (id, eyebrow, title, subtitle, is_enabled, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.eyebrow ?? ""))}, ${sqlStr(String(data.title ?? ""))}, ${sqlStr(String(data.subtitle ?? ""))}, ${sqlBool(data.isEnabled as boolean | undefined, 1)}, ${sqlJson(data)});\n`;
    }
  }

  const leadership = loadCollectionItems("about-leadership-section");
  if (leadership.length) {
    sql += sectionHeader("about_leadership_section");
    sql += "DELETE FROM about_leadership_section;\n";
    for (const { data } of leadership) {
      sql += `INSERT INTO about_leadership_section (id, eyebrow, title, subtitle, is_enabled, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.eyebrow ?? ""))}, ${sqlStr(String(data.title ?? ""))}, ${sqlStr(String(data.subtitle ?? ""))}, ${sqlBool(data.isEnabled as boolean | undefined, 1)}, ${sqlJson(data)});\n`;
    }
  }

  const team = loadCollectionItems("about-team");
  if (team.length) {
    sql += sectionHeader("about_team");
    sql += "DELETE FROM about_team;\n";
    for (const { data } of team) {
      sql += `INSERT INTO about_team (id, name, role, bio, image, sort_order, is_active, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.name))}, ${sqlStr(String(data.role ?? ""))}, ${sqlStr(String(data.bio ?? ""))}, ${sqlStr(String(data.image ?? ""))}, ${sqlNum(Number(data.sortOrder ?? 0))}, ${sqlBool(data.isActive as boolean | undefined, 1)}, ${sqlJson(data)});\n`;
    }
  }

  const milestones = loadCollectionItems("about-milestones");
  if (milestones.length) {
    sql += sectionHeader("about_milestones");
    sql += "DELETE FROM about_milestones;\n";
    for (const { data } of milestones) {
      sql += `INSERT INTO about_milestones (id, year, title, description, sort_order, is_active, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.year ?? ""))}, ${sqlStr(String(data.title ?? ""))}, ${sqlStr(String(data.description ?? ""))}, ${sqlNum(Number(data.sortOrder ?? 0))}, ${sqlBool(data.isActive as boolean | undefined, 1)}, ${sqlJson(data)});\n`;
    }
  }

  // hero slides
  const slides = loadCollectionItems("hero-slides");
  if (slides.length) {
    sql += sectionHeader("hero_slides");
    sql += "DELETE FROM hero_slides;\n";
    for (const { data } of slides) {
      sql += `INSERT INTO hero_slides (id, tag, title, mobile_title, highlight, mobile_cta, description, cta_label, cta_href, secondary_label, secondary_href, product_image, product_label, product_price, badge_icon, badge_text, stat1_value, stat1_label, stat2_value, stat2_label, stat3_value, stat3_label, left_bg, right_bg, accent, accent_light, sort_order, is_active, data) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.tag ?? ""))}, ${sqlStr(String(data.title ?? ""))}, ${sqlStr(String(data.mobileTitle ?? ""))}, ${sqlStr(String(data.highlight ?? ""))}, ${sqlStr(String(data.mobileCta ?? ""))}, ${sqlStr(String(data.description ?? ""))}, ${sqlStr(String(data.ctaLabel ?? ""))}, ${sqlStr(String(data.ctaHref ?? "/products"))}, ${sqlStr(String(data.secondaryLabel ?? ""))}, ${sqlStr(String(data.secondaryHref ?? "/about"))}, ${sqlStr(String(data.productImage ?? ""))}, ${sqlStr(String(data.productLabel ?? ""))}, ${sqlStr(String(data.productPrice ?? ""))}, ${sqlStr(String(data.badgeIcon ?? "Star"))}, ${sqlStr(String(data.badgeText ?? ""))}, ${sqlStr(String(data.stat1Value ?? ""))}, ${sqlStr(String(data.stat1Label ?? ""))}, ${sqlStr(String(data.stat2Value ?? ""))}, ${sqlStr(String(data.stat2Label ?? ""))}, ${sqlStr(String(data.stat3Value ?? ""))}, ${sqlStr(String(data.stat3Label ?? ""))}, ${sqlStr(String(data.leftBg ?? ""))}, ${sqlStr(String(data.rightBg ?? ""))}, ${sqlStr(String(data.accent ?? "#D50000"))}, ${sqlStr(String(data.accentLight ?? "#ff5252"))}, ${sqlNum(Number(data.sortOrder ?? 0))}, ${sqlBool(data.isActive as boolean | undefined, 1)}, ${sqlJson(data)});\n`;
    }
  }

  // activity logs
  const logs = loadCollectionItems("activity-logs");
  if (logs.length) {
    sql += sectionHeader("activity_logs");
    sql += "DELETE FROM activity_logs;\n";
    for (const { data } of logs) {
      sql += `INSERT INTO activity_logs (id, action, category, status, message, actor_id, actor_email, actor_name, actor_role, entity_type, entity_id, ip, user_agent, path, metadata, data, created_at) VALUES (${sqlStr(String(data.id))}, ${sqlStr(String(data.action))}, ${sqlStr(String(data.category))}, ${sqlStr(String(data.status ?? "success"))}, ${sqlStr(String(data.message))}, ${sqlStr(data.actorId as string | undefined)}, ${sqlStr(data.actorEmail as string | undefined)}, ${sqlStr(data.actorName as string | undefined)}, ${sqlStr(data.actorRole as string | undefined)}, ${sqlStr(data.entityType as string | undefined)}, ${sqlStr(data.entityId as string | undefined)}, ${sqlStr(data.ip as string | undefined)}, ${sqlStr(data.userAgent as string | undefined)}, ${sqlStr(data.path as string | undefined)}, ${data.metadata ? sqlJson(data.metadata) : "NULL"}, ${sqlJson(data)}, ${sqlDateTime(data.createdAt as string | undefined)});\n`;
    }
  }

  return sql;
}

function main() {
  const jsonFiles = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const allCollectionItems: { collection: string; id: string; data: Row }[] = [];

  for (const file of jsonFiles.sort()) {
    const name = file.replace(/\.json$/, "");
    allCollectionItems.push(...loadCollectionItems(name));
  }

  const header = `-- =============================================================================
-- Seed data generated from data/json/*.json
-- Generated: ${new Date().toISOString()}
-- Regenerate: npm run mysql:seed-sql
--
-- Run AFTER schema migrations (000–015):
--   mysql -u root -p autozone_store < database/mysql/016_seed_from_json.sql
-- =============================================================================

USE autozone_store;

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;
`;

  const footer = `
SET FOREIGN_KEY_CHECKS = 1;

-- Done. Collections table powers the app (DATA_SOURCE=mysql + MysqlStore).
-- Normalized tables are populated for reporting / direct SQL queries.
`;

  const body = buildCollectionsSql(allCollectionItems) + buildNormalizedSql();
  writeFileSync(OUT_FILE, header + body + footer, "utf-8");

  const lines = (header + body + footer).split("\n").length;
  const inserts = (header + body + footer).split("INSERT INTO").length - 1;
  console.log(`✓ Wrote ${OUT_FILE}`);
  console.log(`  ${jsonFiles.length} JSON files → ${allCollectionItems.length} collection rows`);
  console.log(`  ${inserts} INSERT statements, ${lines} lines`);
}

main();
