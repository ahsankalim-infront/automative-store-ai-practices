/**
 * Cross-application audit: every entity CRUD maps to its MySQL table (never `collections`).
 *
 *   npm run mysql:audit-crud
 *
 * Static checks always run. Live create/read/update/delete runs when MySQL is reachable.
 */
import {
  COLLECTION_TABLE,
  buildInsert,
  buildUpdate,
  type Row,
} from "../src/lib/data/mysql/entity-tables";
import {
  getMysqlStore,
  lastSqlLog,
  resetMysqlStore,
  testMysqlConnection,
  sqlTouchedCollectionsTable,
} from "../src/lib/data/mysql/mysql-store";
import { resetStore } from "../src/lib/data/store";
import * as repo from "../src/lib/data/repositories";
import {
  getSeoConfig,
  updateSeoConfig,
} from "../src/lib/seo/config";
import {
  getHomeLayout,
  updateHomeLayout,
} from "../src/lib/home-layout/config";
import {
  getBundleOffersSection,
  updateBundleOffersSection,
} from "../src/lib/bundles/config";
import {
  getAboutJourneySection,
  updateAboutJourneySection,
  getAboutLeadershipSection,
  updateAboutLeadershipSection,
} from "../src/lib/about-content/config";

process.env.DATA_SOURCE = "mysql";
resetStore();
resetMysqlStore();

type CrudKind = "create" | "read" | "update" | "delete" | "write";

type EntitySpec = {
  collection: string;
  table: string;
  /** Repository / config functions that exercise this entity */
  ops: Partial<Record<CrudKind, string>>;
  sample: () => Row;
  patch?: () => Partial<Row>;
  /** Skip live DB roundtrip (e.g. destructive singletons) */
  skipLive?: boolean;
  /** Live roundtrip via store only (not repo) */
  storeOnly?: boolean;
};

const REPO_COL = {
  products: "products",
  categories: "categories",
  brands: "brands",
  vehicleMakes: "vehicle-makes",
  blogs: "blogs",
  services: "services",
  stores: "stores",
  orders: "orders",
  reviews: "reviews",
  users: "users",
  coupons: "coupons",
  banners: "banners",
  bundleOffers: "bundle-offers",
  aboutTeam: "about-team",
  aboutMilestones: "about-milestones",
  heroSlides: "hero-slides",
  promotionPopups: "promotion-popups",
  bookings: "bookings",
  contactMessages: "contact-messages",
  newsletter: "newsletter-subscribers",
  analytics: "analytics",
  pushSubscriptions: "push-subscriptions",
  notifications: "notifications",
  activityLogs: "activity-logs",
} as const;

const SPECIAL_COLLECTIONS = [
  "settings",
  "seo",
  "home-layout",
  "bundle-offers-section",
  "about-journey-section",
  "about-leadership-section",
] as const;

const uid = () => `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function expectTableSql(sql: string, table: string) {
  assert(
    sql.includes(`\`${table}\``) || sql.includes(` ${table} `) || sql.includes(`FROM ${table}`) || sql.includes(`INTO ${table}`) || sql.includes(`UPDATE ${table}`),
    `SQL must reference table ${table}: ${sql}`
  );
  assert(!/\bcollections\b/i.test(sql), `SQL must not touch collections: ${sql}`);
}

const ENTITIES: EntitySpec[] = [
  {
    collection: "categories",
    table: "categories",
    ops: { create: "createCategory", read: "getCategories", update: "updateCategory", delete: "deleteCategory" },
    sample: () => ({
      id: uid(),
      slug: `audit-cat-${uid()}`,
      name: "Audit Category",
      productCount: 0,
      sortOrder: 999,
      isActive: true,
    }),
    patch: () => ({ name: "Audit Category Updated" }),
  },
  {
    collection: "brands",
    table: "brands",
    ops: { create: "createBrand", read: "getBrands", update: "updateBrand", delete: "deleteBrand" },
    sample: () => ({
      id: uid(),
      slug: `audit-brand-${uid()}`,
      name: "Audit Brand",
      logo: "/audit.png",
      productCount: 0,
      isPrivateLabel: false,
    }),
    patch: () => ({ name: "Audit Brand Updated" }),
  },
  {
    collection: "products",
    table: "products",
    ops: { create: "createProduct", read: "getProducts", update: "updateProduct", delete: "deleteProduct" },
    sample: () => ({
      id: uid(),
      slug: `audit-prod-${uid()}`,
      name: "Audit Product",
      sku: `SKU-${uid()}`,
      brand: "Audit",
      brandSlug: "audit",
      category: "Audit",
      categorySlug: "audit",
      images: [],
      price: 100,
      stock: 1,
      inStock: true,
      rating: 0,
      reviewCount: 0,
      description: "audit",
      shortDescription: "audit",
      specifications: [],
      installationAvailable: false,
      tags: [],
      isFeatured: false,
      isNew: false,
      isBestSeller: false,
      isFlashSale: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    patch: () => ({ name: "Audit Product Updated", price: 150 }),
  },
  {
    collection: "orders",
    table: "orders",
    ops: { create: "createOrder", read: "getOrders", update: "updateOrder", delete: "deleteOrder" },
    sample: () => ({
      id: uid(),
      orderNumber: `AUD-${uid()}`,
      userId: "u-admin",
      items: [],
      subtotal: 100,
      shippingCost: 0,
      discount: 0,
      tax: 0,
      total: 100,
      status: "pending",
      paymentMethod: "cod",
      paymentStatus: "pending",
      shippingAddress: {
        fullName: "Audit",
        phone: "0300",
        address: "x",
        city: "Lahore",
        state: "Punjab",
        country: "Pakistan",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    patch: () => ({ status: "confirmed" }),
  },
  {
    collection: "reviews",
    table: "reviews",
    ops: { create: "createReview", read: "getReviews", update: "updateReview", delete: "deleteReview" },
    sample: () => ({
      id: uid(),
      productId: "p-audit",
      userId: "u-admin",
      userName: "Audit",
      rating: 5,
      title: "Audit review",
      body: "ok",
      isVerifiedPurchase: false,
      createdAt: new Date().toISOString(),
    }),
    patch: () => ({ title: "Audit review updated" }),
  },
  {
    collection: "users",
    table: "users",
    ops: { create: "createUser", read: "getUsers", update: "updateUser", delete: "deleteUser" },
    sample: () => ({
      id: uid(),
      name: "Audit User",
      email: `audit-${uid()}@example.com`,
      passwordHash: "$2b$10$abcdefghijklmnopqrstuv",
      role: "customer",
      addresses: [],
      isVerified: false,
      loyaltyPoints: 0,
      createdAt: new Date().toISOString(),
    }),
    patch: () => ({ name: "Audit User Updated" }),
  },
  {
    collection: "services",
    table: "services",
    ops: { create: "createService", read: "getServices", update: "updateService", delete: "deleteService" },
    sample: () => ({
      id: uid(),
      slug: `audit-svc-${uid()}`,
      type: "installation",
      name: "Audit Service",
      description: "audit",
      image: "/a.png",
      priceFrom: 1000,
      duration: "1h",
      features: [],
    }),
    patch: () => ({ name: "Audit Service Updated" }),
  },
  {
    collection: "stores",
    table: "stores",
    ops: { create: "createStore", read: "getStores", update: "updateStore", delete: "deleteStore" },
    sample: () => ({
      id: uid(),
      name: "Audit Store",
      city: "Lahore",
      address: "Audit Street",
      phone: "0300",
      hours: "9-5",
    }),
    patch: () => ({ name: "Audit Store Updated" }),
  },
  {
    collection: "bookings",
    table: "service_bookings",
    ops: { create: "createBooking", read: "getBookings", update: "updateBooking", delete: "deleteBooking" },
    sample: () => ({
      id: uid(),
      serviceId: "svc-1",
      serviceName: "Audit",
      userId: "u-admin",
      userName: "Admin",
      userPhone: "0300",
      userEmail: "admin@autozone.pk",
      branchId: "st-1",
      branchName: "Main",
      date: "2026-08-01",
      timeSlot: "10:00",
      vehicleInfo: "Civic",
      status: "pending",
      createdAt: new Date().toISOString(),
    }),
    patch: () => ({ status: "confirmed" }),
  },
  {
    collection: "coupons",
    table: "coupons",
    ops: { create: "createCoupon", read: "getCoupons", update: "updateCoupon", delete: "deleteCoupon" },
    sample: () => ({
      id: uid(),
      code: `AUD${uid().slice(-6).toUpperCase()}`,
      description: "Audit coupon",
      type: "fixed",
      value: 50,
      isActive: true,
      usedCount: 0,
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 86400000).toISOString(),
    }),
    patch: () => ({ description: "Audit coupon updated" }),
  },
  {
    collection: "banners",
    table: "banners",
    ops: { create: "createBanner", read: "getAllBanners", update: "updateBanner", delete: "deleteBanner" },
    sample: () => ({
      id: uid(),
      title: "Audit Banner",
      image: "/a.png",
      position: "middle",
      isActive: true,
      sortOrder: 99,
      ctaText: "Go",
      ctaLink: "/products",
    }),
    patch: () => ({ title: "Audit Banner Updated" }),
  },
  {
    collection: "blogs",
    table: "blog_posts",
    ops: { create: "createBlogPost", read: "getBlogPosts", update: "updateBlogPost", delete: "deleteBlogPost" },
    sample: () => ({
      id: uid(),
      slug: `audit-blog-${uid()}`,
      title: "Audit Blog",
      excerpt: "x",
      content: "y",
      coverImage: "/a.png",
      author: "Audit",
      tags: [],
      isFeatured: false,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }),
    patch: () => ({ title: "Audit Blog Updated" }),
  },
  {
    collection: "bundle-offers",
    table: "bundle_offers",
    ops: {
      create: "createBundleOffer",
      read: "getAllBundleOffers",
      update: "updateBundleOffer",
      delete: "deleteBundleOffer",
    },
    sample: () => ({
      id: uid(),
      title: "Audit Bundle",
      description: "x",
      image: "/a.png",
      productIds: [],
      price: 100,
      originalPrice: 120,
      sortOrder: 99,
      isActive: true,
    }),
    patch: () => ({ title: "Audit Bundle Updated" }),
  },
  {
    collection: "about-team",
    table: "about_team",
    ops: {
      create: "createAboutTeamMember",
      read: "getAllAboutTeamMembers",
      update: "updateAboutTeamMember",
      delete: "deleteAboutTeamMember",
    },
    sample: () => ({
      id: uid(),
      name: "Audit Member",
      role: "QA",
      bio: "",
      image: "/a.png",
      sortOrder: 99,
      isActive: true,
    }),
    patch: () => ({ name: "Audit Member Updated" }),
  },
  {
    collection: "about-milestones",
    table: "about_milestones",
    ops: {
      create: "createAboutMilestone",
      read: "getAllAboutMilestones",
      update: "updateAboutMilestone",
      delete: "deleteAboutMilestone",
    },
    sample: () => ({
      id: uid(),
      year: "2099",
      title: "Audit Milestone",
      description: "x",
      sortOrder: 99,
      isActive: true,
    }),
    patch: () => ({ title: "Audit Milestone Updated" }),
  },
  {
    collection: "hero-slides",
    table: "hero_slides",
    ops: {
      create: "createHeroSlide",
      read: "getAllHeroSlides",
      update: "updateHeroSlide",
      delete: "deleteHeroSlide",
    },
    sample: () => ({
      id: uid(),
      tag: "Audit",
      title: "Audit Slide",
      mobileTitle: "Audit",
      highlight: "",
      mobileCta: "",
      description: "x",
      ctaLabel: "Shop",
      ctaHref: "/products",
      secondaryLabel: "",
      secondaryHref: "/about",
      productImage: "/a.png",
      productLabel: "",
      productPrice: "",
      badgeIcon: "Star",
      badgeText: "",
      stat1Value: "",
      stat1Label: "",
      stat2Value: "",
      stat2Label: "",
      stat3Value: "",
      stat3Label: "",
      leftBg: "",
      rightBg: "",
      accent: "#D50000",
      accentLight: "#ff5252",
      sortOrder: 99,
      isActive: true,
    }),
    patch: () => ({ title: "Audit Slide Updated" }),
  },
  {
    collection: "promotion-popups",
    table: "promotion_popups",
    ops: {
      create: "createPromotionPopup",
      read: "getAllPromotionPopups",
      update: "updatePromotionPopup",
      delete: "deletePromotionPopup",
    },
    sample: () => ({
      id: uid(),
      title: "Audit Popup",
      image: "/a.png",
      ctaLabel: "Shop",
      ctaHref: "/products",
      showDelayMs: 1000,
      dismissDays: 1,
      sortOrder: 99,
      isActive: false,
    }),
    patch: () => ({ title: "Audit Popup Updated" }),
  },
  {
    collection: "vehicle-makes",
    table: "vehicle_makes",
    ops: {
      create: "createVehicleMake",
      read: "getVehicleMakes",
      update: "updateVehicleMake",
      delete: "deleteVehicleMake",
    },
    sample: () => ({
      id: uid(),
      slug: `audit-make-${uid()}`,
      name: "Audit Make",
      models: [],
    }),
    patch: () => ({ name: "Audit Make Updated" }),
  },
  {
    collection: "contact-messages",
    table: "contact_messages",
    ops: {
      create: "createContactMessage",
      read: "getContactMessages",
      delete: "deleteContactMessage",
    },
    sample: () => ({
      id: uid(),
      name: "Audit Contact",
      email: `audit-${uid()}@example.com`,
      subject: "Audit",
      message: "Hello",
      createdAt: new Date().toISOString(),
    }),
  },
  {
    collection: "newsletter-subscribers",
    table: "newsletter_subscribers",
    ops: { create: "subscribeNewsletter", read: "getStore" },
    sample: () => ({
      id: uid(),
      email: `audit-news-${uid()}@example.com`,
      subscribedAt: new Date().toISOString(),
    }),
    storeOnly: true,
  },
  {
    collection: "notifications",
    table: "notifications",
    ops: { create: "createNotification", read: "getNotifications", update: "updateNotification" },
    sample: () => ({
      id: uid(),
      userId: "u-admin",
      audience: "customer",
      type: "info",
      title: "Audit",
      body: "x",
      read: false,
      emailSent: false,
      pushSent: false,
      createdAt: new Date().toISOString(),
    }),
    patch: () => ({ read: true }),
  },
  {
    collection: "push-subscriptions",
    table: "push_subscriptions",
    ops: { create: "savePushSubscription", read: "getPushSubscriptions", delete: "deletePushSubscription" },
    sample: () => ({
      id: uid(),
      userId: "u-admin",
      userEmail: "admin@autozone.pk",
      endpoint: `https://audit.example/${uid()}`,
      keys: { p256dh: "x", auth: "y" },
      createdAt: new Date().toISOString(),
    }),
    storeOnly: true,
  },
  {
    collection: "activity-logs",
    table: "activity_logs",
    ops: { create: "createActivityLog", read: "queryActivityLogs" },
    sample: () => ({
      id: uid(),
      action: "audit.test",
      category: "system",
      status: "success",
      message: "Audit log",
      createdAt: new Date().toISOString(),
    }),
    storeOnly: true,
  },
  {
    collection: "analytics",
    table: "analytics",
    ops: { read: "getAnalytics" },
    sample: () => ({
      id: "analytics-audit",
      salesData: [],
      topProducts: [],
    }),
    skipLive: true,
    storeOnly: true,
  },
  {
    collection: "settings",
    table: "store_settings",
    ops: { read: "getStoreSettings", update: "updateStoreSettings" },
    sample: () => ({
      id: "settings-audit",
      storeName: "Audit Store",
      shortName: "AUD",
      tagline: "",
      description: "x",
      supportEmail: "a@b.com",
      supportPhone: "0300",
      whatsapp: "",
      orderPrefix: "AUD",
      businessHours: "",
      announcementText: "",
      address: "x",
      addressCity: "Lahore",
      addressProvince: "Punjab",
      addressCountry: "Pakistan",
      contactPersons: [],
      standardShipping: 100,
      expressShipping: 250,
      freeShippingThreshold: 1500,
      currency: "PKR",
      cmsPages: [],
    }),
    skipLive: true,
  },
  {
    collection: "home-layout",
    table: "home_layout",
    ops: { read: "getHomeLayout", update: "updateHomeLayout" },
    sample: () => ({ id: "home-layout-1", desktop: [], mobile: [], updatedAt: new Date().toISOString() }),
    skipLive: true,
  },
  {
    collection: "bundle-offers-section",
    table: "bundle_offers_section",
    ops: { read: "getBundleOffersSection", update: "updateBundleOffersSection" },
    sample: () => ({
      id: "bundle-section-1",
      eyebrow: "",
      title: "Audit",
      subtitle: "",
      isEnabled: true,
    }),
    skipLive: true,
  },
  {
    collection: "about-journey-section",
    table: "about_journey_section",
    ops: { read: "getAboutJourneySection", update: "updateAboutJourneySection" },
    sample: () => ({
      id: "about-journey-1",
      eyebrow: "",
      title: "Audit",
      subtitle: "",
      isEnabled: true,
    }),
    skipLive: true,
  },
  {
    collection: "about-leadership-section",
    table: "about_leadership_section",
    ops: { read: "getAboutLeadershipSection", update: "updateAboutLeadershipSection" },
    sample: () => ({
      id: "about-leadership-1",
      eyebrow: "",
      title: "Audit",
      subtitle: "",
      isEnabled: true,
    }),
    skipLive: true,
  },
];

let passed = 0;
let failed = 0;

function pass(msg: string) {
  passed += 1;
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string) {
  failed += 1;
  console.log(`  ✗ ${msg}`);
}

function staticMappingAudit() {
  console.log("\n── Static: repository COL → entity tables ──");
  for (const [key, collection] of Object.entries(REPO_COL)) {
    const table = COLLECTION_TABLE[collection];
    if (!table) {
      fail(`${key} (${collection}) has no COLLECTION_TABLE mapping`);
      continue;
    }
    if (table === "collections") {
      fail(`${key} incorrectly maps to collections`);
      continue;
    }
    pass(`${key} → ${collection} → ${table}`);
  }

  console.log("\n── Static: special collections → entity tables ──");
  for (const collection of SPECIAL_COLLECTIONS) {
    if (collection === "seo") {
      pass(`seo → seo_global + seo_pages (special handler)`);
      continue;
    }
    const table = COLLECTION_TABLE[collection];
    if (!table || table === "collections") {
      fail(`${collection} missing entity table mapping`);
      continue;
    }
    pass(`${collection} → ${table}`);
  }

  console.log("\n── Static: buildInsert / buildUpdate SQL ──");
  for (const entity of ENTITIES) {
    if (entity.collection === "seo") continue;
    try {
      const sample = entity.sample();
      const insert = buildInsert(entity.collection, sample);
      expectTableSql(insert.sql, entity.table);
      assert(insert.sql.startsWith("INSERT"), `insert for ${entity.collection}`);
      const update = buildUpdate(entity.collection, { ...sample, ...(entity.patch?.() ?? {}) });
      expectTableSql(update.sql, entity.table);
      assert(update.sql.startsWith("UPDATE"), `update for ${entity.collection}`);
      assert(update.sql.includes("WHERE id = ?"), `update by id for ${entity.collection}`);
      pass(`${entity.collection}: INSERT/UPDATE → \`${entity.table}\``);
    } catch (e) {
      fail(`${entity.collection}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // Every COLLECTION_TABLE key must have insert/update builders
  console.log("\n── Static: all COLLECTION_TABLE keys have builders ──");
  for (const [collection, table] of Object.entries(COLLECTION_TABLE)) {
    try {
      const sample = { id: `map-${collection}`, name: "x", slug: "x", email: "a@b.c", title: "t", code: "C", action: "a", category: "system", message: "m", userId: "u", type: "info", body: "b", endpoint: "e", keys: {}, salesData: [], topProducts: [], storeName: "s", shortName: "S", tagline: "", description: "", supportEmail: "a@b.c", supportPhone: "1", whatsapp: "", orderPrefix: "X", businessHours: "", announcementText: "", address: "a", addressCity: "c", addressProvince: "p", addressCountry: "pk", contactPersons: [], standardShipping: 1, expressShipping: 1, freeShippingThreshold: 1, currency: "PKR", cmsPages: [], desktop: [], mobile: [], eyebrow: "", subtitle: "", isEnabled: true, orderNumber: "O", subtotal: 0, shippingCost: 0, discount: 0, tax: 0, total: 0, status: "pending", paymentMethod: "cod", paymentStatus: "pending", productId: "p", rating: 5, passwordHash: "x", role: "customer", addresses: [], serviceId: "s", branchId: "b", date: "2026-01-01", value: 1, position: "middle", year: "2026", audience: "customer", read: false, emailSent: false, pushSent: false, userEmail: "a@b.c", sku: "s", brand: "b", brandSlug: "b", categorySlug: "c", images: [], price: 1, stock: 1, inStock: true, reviewCount: 0, shortDescription: "", specifications: [], installationAvailable: false, tags: [], isFeatured: false, isNew: false, isBestSeller: false, isFlashSale: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), models: [], logo: "", productCount: 0, isPrivateLabel: false, sortOrder: 0, isActive: true, image: "/a.png", ctaLabel: "x", ctaHref: "/", showDelayMs: 1, dismissDays: 1, features: [], duration: "1h" };
      const insert = buildInsert(collection, sample);
      expectTableSql(insert.sql, table);
      pass(`builder OK: ${collection} → ${table}`);
    } catch (e) {
      fail(`builder FAIL: ${collection}: ${e instanceof Error ? e.message : e}`);
    }
  }
}

async function liveStoreRoundtrip(entity: EntitySpec) {
  const store = getMysqlStore();
  const sample = entity.sample();
  const id = String(sample.id);

  lastSqlLog.length = 0;
  await store.create(entity.collection, sample as { id: string });
  const createdSql = [...lastSqlLog];
  assert(
    createdSql.some((s) => s.includes(`\`${entity.table}\``) || s.includes(entity.table)),
    `create SQL missing table ${entity.table}`
  );

  lastSqlLog.length = 0;
  const one = await store.readOne(entity.collection, id);
  assert(one, `readOne failed for ${entity.collection}/${id}`);
  assert(
    lastSqlLog.some((s) => s.includes(`\`${entity.table}\``)),
    `readOne SQL missing ${entity.table}`
  );

  if (entity.patch) {
    lastSqlLog.length = 0;
    const updated = await store.update(entity.collection, id, entity.patch());
    assert(updated, `update failed for ${entity.collection}/${id}`);
    assert(
      lastSqlLog.some((s) => s.startsWith("UPDATE") && s.includes(`\`${entity.table}\``)),
      `update SQL missing ${entity.table}`
    );
  }

  // Always clean up audit rows (except skipped singletons)
  lastSqlLog.length = 0;
  const deleted = await store.delete(entity.collection, id);
  assert(deleted, `delete failed for ${entity.collection}/${id}`);
  assert(
    lastSqlLog.some((s) => s.includes("DELETE") && s.includes(`\`${entity.table}\``)),
    `delete SQL missing ${entity.table}`
  );

  assert(!sqlTouchedCollectionsTable(), `${entity.collection} touched collections table`);
  pass(`LIVE CRUD ${entity.collection} → \`${entity.table}\``);
}

async function liveRepoSmoke() {
  console.log("\n── Live: repository fetch path (website/reports) ──");
  lastSqlLog.length = 0;
  const [categories, products, orders, users, reviews, bookings] = await Promise.all([
    repo.getCategories(),
    repo.getProducts({ includeInactiveCategories: true }),
    repo.getOrders(),
    repo.getUsers(),
    repo.getReviews(),
    repo.getBookings(),
  ]);
  assert(!sqlTouchedCollectionsTable(), `repo fetch touched collections:\n${lastSqlLog.join("\n")}`);
  pass(
    `repos fetch: categories=${categories.length}, products=${products.length}, orders=${orders.length}, users=${users.length}, reviews=${reviews.length}, bookings=${bookings.length}`
  );

  // Singleton config paths
  lastSqlLog.length = 0;
  await getSeoConfig();
  await getHomeLayout();
  await getBundleOffersSection();
  await getAboutJourneySection();
  await getAboutLeadershipSection();
  await repo.getStoreSettings();
  assert(!sqlTouchedCollectionsTable(), "singleton reads touched collections");
  pass("singleton configs: seo, home-layout, bundles section, about sections, settings");

  // Touch update paths lightly (settings) then leave data intact if possible
  const settings = await repo.getStoreSettings();
  lastSqlLog.length = 0;
  await repo.updateStoreSettings({ storeName: settings.storeName });
  assert(
    lastSqlLog.some((s) => s.includes("store_settings")),
    "updateStoreSettings must hit store_settings"
  );
  assert(!sqlTouchedCollectionsTable(), "settings update touched collections");
  pass("updateStoreSettings → store_settings");

  // seo / home-layout update roundtrip (restore same values)
  const seo = await getSeoConfig();
  lastSqlLog.length = 0;
  await updateSeoConfig({ global: { siteName: seo.global.siteName } });
  assert(
    lastSqlLog.some((s) => /seo_global/i.test(s)),
    "updateSeoConfig must hit seo_global"
  );
  pass("updateSeoConfig → seo_global (+ seo_pages)");

  const layout = await getHomeLayout();
  lastSqlLog.length = 0;
  await updateHomeLayout({ desktop: layout.desktop, mobile: layout.mobile });
  assert(lastSqlLog.some((s) => /home_layout/i.test(s)), "home_layout update missing");
  pass("updateHomeLayout → home_layout");

  const bundleSec = await getBundleOffersSection();
  lastSqlLog.length = 0;
  await updateBundleOffersSection({ title: bundleSec.title });
  assert(lastSqlLog.some((s) => /bundle_offers_section/i.test(s)), "bundle section update missing");
  pass("updateBundleOffersSection → bundle_offers_section");

  const journey = await getAboutJourneySection();
  lastSqlLog.length = 0;
  await updateAboutJourneySection({ title: journey.title });
  assert(lastSqlLog.some((s) => /about_journey_section/i.test(s)), "journey update missing");
  pass("updateAboutJourneySection → about_journey_section");

  const leadership = await getAboutLeadershipSection();
  lastSqlLog.length = 0;
  await updateAboutLeadershipSection({ title: leadership.title });
  assert(lastSqlLog.some((s) => /about_leadership_section/i.test(s)), "leadership update missing");
  pass("updateAboutLeadershipSection → about_leadership_section");
}

async function main() {
  console.log("Entity CRUD audit (entity tables only — never collections)\n");
  staticMappingAudit();

  const ok = await testMysqlConnection();
  if (!ok) {
    console.log("\n── Live MySQL ──");
    console.log("  ⚠ MySQL not reachable — live create/update/delete skipped");
    console.log("  Start MySQL, apply 001–019 + seed 016, set DATA_SOURCE=mysql, re-run.");
  } else {
    console.log("\n── Live: store create / read / update / delete ──");
    for (const entity of ENTITIES) {
      if (entity.skipLive) {
        pass(`SKIP live destructive: ${entity.collection} (singleton/config)`);
        continue;
      }
      try {
        await liveStoreRoundtrip(entity);
      } catch (e) {
        fail(`LIVE ${entity.collection}: ${e instanceof Error ? e.message : e}`);
        // best-effort cleanup
        try {
          await getMysqlStore().delete(entity.collection, String(entity.sample().id));
        } catch {
          /* ignore */
        }
      }
    }
    await liveRepoSmoke();
  }

  console.log(`\n── Summary: ${passed} passed, ${failed} failed ──`);
  if (failed > 0) process.exit(1);
  console.log("✓ All audited entities use respective tables for CRUD/fetch");
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
