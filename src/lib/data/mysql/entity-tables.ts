/**
 * Maps logical collection names (same as JSON filenames) to MySQL entity tables.
 * Full camelCase documents stay in each table's `data` JSON column; indexed columns
 * are synced on write for reporting / direct SQL.
 */

export type Row = Record<string, unknown>;

export function parseData<T>(raw: unknown): T {
  if (raw == null) throw new Error("Missing row data");
  if (typeof raw === "string") return JSON.parse(raw) as T;
  return raw as T;
}

export function asStr(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v);
}

export function asNum(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function asBool(v: unknown, fallback = false): number {
  if (v == null) return fallback ? 1 : 0;
  return v === true || v === 1 || v === "1" ? 1 : 0;
}

export function asJson(v: unknown): string {
  return JSON.stringify(v ?? null);
}

export function asDateTime(iso?: unknown): string | null {
  if (typeof iso !== "string" || !iso) return null;
  return iso.replace("T", " ").replace("Z", "").slice(0, 19);
}

export function ensureId(item: Row, fallback?: string): string {
  if (typeof item.id === "string" && item.id) return item.id;
  return fallback || crypto.randomUUID();
}

/** Collection name → physical MySQL table (most entities). */
export const COLLECTION_TABLE: Record<string, string> = {
  products: "products",
  categories: "categories",
  brands: "brands",
  "vehicle-makes": "vehicle_makes",
  blogs: "blog_posts",
  services: "services",
  stores: "stores",
  orders: "orders",
  reviews: "reviews",
  users: "users",
  coupons: "coupons",
  banners: "banners",
  "bundle-offers": "bundle_offers",
  "about-team": "about_team",
  "about-milestones": "about_milestones",
  "hero-slides": "hero_slides",
  "promotion-popups": "promotion_popups",
  bookings: "service_bookings",
  "contact-messages": "contact_messages",
  "newsletter-subscribers": "newsletter_subscribers",
  analytics: "analytics",
  "push-subscriptions": "push_subscriptions",
  notifications: "notifications",
  "activity-logs": "activity_logs",
  settings: "store_settings",
  "home-layout": "home_layout",
  "bundle-offers-section": "bundle_offers_section",
  "about-journey-section": "about_journey_section",
  "about-leadership-section": "about_leadership_section",
};

export const ORDER_BY: Record<string, string> = {
  products: "created_at ASC",
  categories: "sort_order ASC, name ASC",
  brands: "name ASC",
  "vehicle-makes": "name ASC",
  blogs: "published_at ASC",
  orders: "created_at ASC",
  reviews: "created_at ASC",
  users: "created_at ASC",
  banners: "sort_order ASC",
  "bundle-offers": "sort_order ASC",
  "about-team": "sort_order ASC",
  "about-milestones": "sort_order ASC",
  "hero-slides": "sort_order ASC",
  "promotion-popups": "sort_order ASC",
  bookings: "created_at ASC",
  "contact-messages": "created_at ASC",
  "newsletter-subscribers": "subscribed_at ASC",
  "activity-logs": "created_at ASC",
  notifications: "created_at ASC",
  "push-subscriptions": "created_at ASC",
};

export type SqlPlan = {
  sql: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[];
};

type ColMap = Record<string, unknown>;

function assertTable(collection: string): string {
  const table = COLLECTION_TABLE[collection];
  if (!table) throw new Error(`No MySQL entity table mapping for collection "${collection}"`);
  return table;
}

/** Column map for a collection document (excludes computed-only fields). */
function columnMap(collection: string, item: Row): { id: string; table: string; cols: ColMap } {
  const id = ensureId(item);
  const data: Row = { ...item, id };
  const json = asJson(data);
  const table = assertTable(collection);

  switch (collection) {
    case "categories":
      return {
        id,
        table,
        cols: {
          id,
          slug: asStr(data.slug),
          name: asStr(data.name),
          parent_id: data.parentId ?? null,
          product_count: asNum(data.productCount),
          sort_order: asNum(data.sortOrder),
          is_active: asBool(data.isActive, true),
          data: json,
        },
      };
    case "brands":
      return {
        id,
        table,
        cols: {
          id,
          slug: asStr(data.slug),
          name: asStr(data.name),
          product_count: asNum(data.productCount),
          is_private_label: asBool(data.isPrivateLabel),
          data: json,
        },
      };
    case "products":
      return {
        id,
        table,
        cols: {
          id,
          slug: asStr(data.slug),
          sku: data.sku ?? null,
          name: asStr(data.name),
          brand_slug: data.brandSlug ?? null,
          category_slug: data.categorySlug ?? null,
          price: asNum(data.price),
          original_price: data.originalPrice ?? null,
          stock: asNum(data.stock),
          in_stock: asBool(data.inStock, true),
          rating: asNum(data.rating),
          review_count: asNum(data.reviewCount),
          is_featured: asBool(data.isFeatured),
          is_new: asBool(data.isNew),
          is_best_seller: asBool(data.isBestSeller),
          is_flash_sale: asBool(data.isFlashSale),
          data: json,
          created_at: asDateTime(data.createdAt) ?? undefined,
          updated_at: asDateTime(data.updatedAt) ?? undefined,
        },
      };
    case "orders":
      return {
        id,
        table,
        cols: {
          id,
          order_number: asStr(data.orderNumber),
          user_id: asStr(data.userId),
          subtotal: asNum(data.subtotal),
          shipping_cost: asNum(data.shippingCost),
          discount: asNum(data.discount),
          tax: asNum(data.tax),
          total: asNum(data.total),
          status: asStr(data.status, "pending"),
          payment_method: asStr(data.paymentMethod, "cod"),
          payment_status: asStr(data.paymentStatus, "pending"),
          coupon_code: data.couponCode ?? null,
          tracking_number: data.trackingNumber ?? null,
          data: json,
          created_at: asDateTime(data.createdAt) ?? undefined,
          updated_at: asDateTime(data.updatedAt) ?? undefined,
        },
      };
    case "reviews":
      return {
        id,
        table,
        cols: {
          id,
          product_id: asStr(data.productId),
          user_id: asStr(data.userId),
          rating: asNum(data.rating, 5),
          title: data.title ?? null,
          body: data.body ?? data.comment ?? null,
          is_verified_purchase: asBool(data.isVerifiedPurchase),
          data: json,
          created_at: asDateTime(data.createdAt) ?? undefined,
        },
      };
    case "users":
      return {
        id,
        table,
        cols: {
          id,
          name: asStr(data.name),
          email: asStr(data.email),
          phone: data.phone ?? null,
          password_hash: asStr(data.passwordHash),
          role: asStr(data.role, "customer"),
          avatar: data.avatar ?? null,
          addresses: asJson(data.addresses ?? []),
          loyalty_points: asNum(data.loyaltyPoints),
          is_verified: asBool(data.isVerified),
          data: json,
          created_at: asDateTime(data.createdAt) ?? undefined,
        },
      };
    case "services":
      return {
        id,
        table,
        cols: {
          id,
          slug: asStr(data.slug),
          type: asStr(data.type, "installation"),
          name: asStr(data.name),
          price_from: data.priceFrom ?? null,
          data: json,
        },
      };
    case "stores":
      return {
        id,
        table,
        cols: {
          id,
          name: asStr(data.name),
          city: asStr(data.city ?? data.addressCity, ""),
          data: json,
        },
      };
    case "bookings":
      return {
        id,
        table,
        cols: {
          id,
          service_id: asStr(data.serviceId),
          user_id: asStr(data.userId),
          branch_id: asStr(data.branchId),
          status: asStr(data.status, "pending"),
          booking_date: asStr(data.date ?? data.bookingDate, "2026-01-01").slice(0, 10),
          data: json,
          created_at: asDateTime(data.createdAt) ?? undefined,
        },
      };
    case "coupons":
      return {
        id,
        table,
        cols: {
          id,
          code: asStr(data.code),
          type: asStr(data.type, "fixed"),
          value: asNum(data.value),
          is_active: asBool(data.isActive, true),
          data: json,
          valid_from: asDateTime(data.validFrom),
          valid_to: asDateTime(data.validTo),
        },
      };
    case "banners":
      return {
        id,
        table,
        cols: {
          id,
          title: asStr(data.title ?? data.name),
          position: asStr(data.position, "middle"),
          is_active: asBool(data.isActive, true),
          sort_order: asNum(data.sortOrder),
          data: json,
        },
      };
    case "blogs":
      return {
        id,
        table,
        cols: {
          id,
          slug: asStr(data.slug),
          title: asStr(data.title),
          is_featured: asBool(data.isFeatured),
          published_at: asDateTime(data.publishedAt ?? data.createdAt),
          data: json,
        },
      };
    case "contact-messages":
      return {
        id,
        table,
        cols: {
          id,
          name: asStr(data.name),
          email: asStr(data.email),
          phone: data.phone ?? null,
          subject: data.subject ?? null,
          message: asStr(data.message),
          data: json,
          created_at: asDateTime(data.createdAt) ?? undefined,
        },
      };
    case "newsletter-subscribers":
      return {
        id,
        table,
        cols: {
          id,
          email: asStr(data.email),
          data: json,
          subscribed_at: asDateTime(data.subscribedAt ?? data.createdAt) ?? undefined,
        },
      };
    case "settings":
      return {
        id,
        table,
        cols: {
          id,
          store_name: asStr(data.storeName ?? data.name),
          short_name: asStr(data.shortName, "SPH"),
          tagline: asStr(data.tagline),
          description: asStr(data.description),
          support_email: asStr(data.supportEmail ?? data.email),
          support_phone: asStr(data.supportPhone),
          whatsapp: asStr(data.whatsapp),
          order_prefix: asStr(data.orderPrefix, "SHP"),
          business_hours: asStr(data.businessHours),
          announcement_text: asStr(data.announcementText),
          address: asStr(data.address),
          address_city: asStr(data.addressCity, "Lahore"),
          address_province: asStr(data.addressProvince, "Punjab"),
          address_country: asStr(data.addressCountry, "Pakistan"),
          contact_persons: asJson(data.contactPersons ?? []),
          standard_shipping: asNum(data.standardShipping, 100),
          express_shipping: asNum(data.expressShipping, 250),
          free_shipping_threshold: asNum(data.freeShippingThreshold, 1500),
          currency: asStr(data.currency, "PKR"),
          cms_pages: data.cmsPages ? asJson(data.cmsPages) : null,
          data: json,
        },
      };
    case "home-layout":
      return {
        id,
        table,
        cols: {
          id,
          desktop: asJson(data.desktop ?? []),
          mobile: asJson(data.mobile ?? []),
          data: json,
        },
      };
    case "bundle-offers":
      return {
        id,
        table,
        cols: {
          id,
          title: asStr(data.title),
          price: asNum(data.price),
          original_price: asNum(data.originalPrice),
          sort_order: asNum(data.sortOrder),
          is_active: asBool(data.isActive, true),
          data: json,
        },
      };
    case "bundle-offers-section":
      return { id, table, cols: { id, data: json } };
    case "about-journey-section":
    case "about-leadership-section":
      return {
        id,
        table,
        cols: {
          id,
          eyebrow: asStr(data.eyebrow),
          title: asStr(data.title),
          subtitle: asStr(data.subtitle),
          is_enabled: asBool(data.isEnabled, true),
          data: json,
        },
      };
    case "about-team":
      return {
        id,
        table,
        cols: {
          id,
          name: asStr(data.name),
          role: asStr(data.role),
          bio: asStr(data.bio),
          image: asStr(data.image),
          sort_order: asNum(data.sortOrder),
          is_active: asBool(data.isActive, true),
          data: json,
        },
      };
    case "about-milestones":
      return {
        id,
        table,
        cols: {
          id,
          year: asStr(data.year),
          title: asStr(data.title),
          description: asStr(data.description),
          sort_order: asNum(data.sortOrder),
          is_active: asBool(data.isActive, true),
          data: json,
        },
      };
    case "hero-slides":
      return {
        id,
        table,
        cols: {
          id,
          tag: asStr(data.tag),
          title: asStr(data.title),
          mobile_title: asStr(data.mobileTitle),
          highlight: asStr(data.highlight),
          mobile_cta: asStr(data.mobileCta),
          description: asStr(data.description),
          cta_label: asStr(data.ctaLabel),
          cta_href: asStr(data.ctaHref, "/products"),
          secondary_label: asStr(data.secondaryLabel),
          secondary_href: asStr(data.secondaryHref, "/about"),
          product_image: asStr(data.productImage),
          product_label: asStr(data.productLabel),
          product_price: asStr(data.productPrice),
          badge_icon: asStr(data.badgeIcon, "Star"),
          badge_text: asStr(data.badgeText),
          stat1_value: asStr(data.stat1Value),
          stat1_label: asStr(data.stat1Label),
          stat2_value: asStr(data.stat2Value),
          stat2_label: asStr(data.stat2Label),
          stat3_value: asStr(data.stat3Value),
          stat3_label: asStr(data.stat3Label),
          left_bg: asStr(data.leftBg),
          right_bg: asStr(data.rightBg),
          accent: asStr(data.accent, "#D50000"),
          accent_light: asStr(data.accentLight, "#ff5252"),
          sort_order: asNum(data.sortOrder),
          is_active: asBool(data.isActive, true),
          data: json,
        },
      };
    case "promotion-popups":
      return {
        id,
        table,
        cols: {
          id,
          title: asStr(data.title),
          subtitle: asStr(data.subtitle),
          description: asStr(data.description),
          badge_text: asStr(data.badgeText),
          coupon_code: asStr(data.couponCode),
          image: asStr(data.image),
          mobile_image: asStr(data.mobileImage),
          cta_label: asStr(data.ctaLabel, "Shop Now"),
          cta_href: asStr(data.ctaHref, "/products"),
          secondary_label: asStr(data.secondaryLabel),
          secondary_href: asStr(data.secondaryHref),
          accent_color: asStr(data.accentColor, "#D50000"),
          show_delay_ms: asNum(data.showDelayMs, 1200),
          dismiss_days: asNum(data.dismissDays, 3),
          valid_from: asDateTime(data.validFrom),
          valid_to: asDateTime(data.validTo),
          sort_order: asNum(data.sortOrder),
          is_active: asBool(data.isActive, true),
          data: json,
        },
      };
    case "activity-logs":
      return {
        id,
        table,
        cols: {
          id,
          action: asStr(data.action),
          category: asStr(data.category),
          status: asStr(data.status, "success"),
          message: asStr(data.message),
          actor_id: data.actorId ?? null,
          actor_email: data.actorEmail ?? null,
          actor_name: data.actorName ?? null,
          actor_role: data.actorRole ?? null,
          entity_type: data.entityType ?? null,
          entity_id: data.entityId ?? null,
          ip: data.ip ?? null,
          user_agent: data.userAgent ?? null,
          path: data.path ?? null,
          metadata: data.metadata ? asJson(data.metadata) : null,
          data: json,
          created_at: asDateTime(data.createdAt) ?? undefined,
        },
      };
    case "vehicle-makes":
      return {
        id,
        table,
        cols: {
          id,
          slug: asStr(data.slug),
          name: asStr(data.name),
          logo: data.logo ?? null,
          country: data.country ?? null,
          data: json,
        },
      };
    case "notifications":
      return {
        id,
        table,
        cols: {
          id,
          user_id: asStr(data.userId),
          audience: asStr(data.audience, "customer"),
          type: asStr(data.type),
          title: asStr(data.title),
          body: asStr(data.body),
          order_id: data.orderId ?? null,
          order_number: data.orderNumber ?? null,
          link: data.link ?? null,
          is_read: asBool(data.read),
          email_sent: asBool(data.emailSent),
          push_sent: asBool(data.pushSent),
          data: json,
          created_at: asDateTime(data.createdAt) ?? undefined,
        },
      };
    case "push-subscriptions":
      return {
        id,
        table,
        cols: {
          id,
          user_id: asStr(data.userId),
          user_email: asStr(data.userEmail),
          endpoint: asStr(data.endpoint),
          keys_json: asJson(data.keys ?? {}),
          user_agent: data.userAgent ?? null,
          device_label: data.deviceLabel ?? null,
          data: json,
          created_at: asDateTime(data.createdAt) ?? undefined,
        },
      };
    case "analytics":
      return { id, table, cols: { id, data: json } };
    default:
      throw new Error(`No MySQL entity table mapping for collection "${collection}"`);
  }
}

function entriesForInsert(cols: ColMap): { names: string[]; values: unknown[] } {
  const names: string[] = [];
  const values: unknown[] = [];
  for (const [k, v] of Object.entries(cols)) {
    if (v === undefined) continue;
    names.push(k);
    values.push(v);
  }
  return { names, values };
}

/** Plain INSERT into the entity table (no ON DUPLICATE — avoids unique-key collisions). */
export function buildInsert(collection: string, item: Row): SqlPlan {
  const { table, cols } = columnMap(collection, item);
  const { names, values } = entriesForInsert(cols);
  const placeholders = names.map(() => "?").join(", ");
  return {
    sql: `INSERT INTO \`${table}\` (${names.map((n) => `\`${n}\``).join(", ")}) VALUES (${placeholders})`,
    params: values,
  };
}

/** UPDATE entity row by primary key id. */
export function buildUpdate(collection: string, item: Row): SqlPlan {
  const { id, table, cols } = columnMap(collection, item);
  const sets: string[] = [];
  const values: unknown[] = [];
  for (const [k, v] of Object.entries(cols)) {
    if (k === "id" || v === undefined) continue;
    // Let MySQL maintain updated_at via ON UPDATE CURRENT_TIMESTAMP where present
    if (k === "updated_at") continue;
    sets.push(`\`${k}\` = ?`);
    values.push(v);
  }
  if (collection === "products" || collection === "orders") {
    sets.push("`updated_at` = NOW()");
  }
  values.push(id);
  return {
    sql: `UPDATE \`${table}\` SET ${sets.join(", ")} WHERE id = ?`,
    params: values,
  };
}

/** @deprecated use buildInsert — kept name alias for clarity in call sites */
export function buildUpsert(collection: string, item: Row): SqlPlan {
  return buildInsert(collection, item);
}

/** Reconstruct entity from a row that may have null `data` (legacy seed). */
export function rowToEntity(collection: string, row: Row): Row {
  if (row.data != null) {
    return parseData<Row>(row.data);
  }

  switch (collection) {
    case "users":
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone ?? undefined,
        passwordHash: row.password_hash,
        role: row.role,
        avatar: row.avatar ?? undefined,
        addresses: parseData(row.addresses ?? []),
        loyaltyPoints: asNum(row.loyalty_points),
        isVerified: Boolean(row.is_verified),
        createdAt:
          row.created_at instanceof Date
            ? row.created_at.toISOString()
            : asStr(row.created_at),
      };
    case "contact-messages":
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone ?? undefined,
        subject: row.subject ?? "",
        message: row.message,
        createdAt:
          row.created_at instanceof Date
            ? row.created_at.toISOString()
            : asStr(row.created_at),
      };
    case "newsletter-subscribers":
      return {
        id: row.id,
        email: row.email,
        subscribedAt:
          row.subscribed_at instanceof Date
            ? row.subscribed_at.toISOString()
            : asStr(row.subscribed_at),
      };
    default:
      throw new Error(`Row in ${collection} has no data JSON and no column fallback`);
  }
}
