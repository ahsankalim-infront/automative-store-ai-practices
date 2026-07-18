/**
 * Admin CRUD smoke test — run with dev server: node scripts/admin-crud-audit.mjs
 */
const BASE = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@autozone.pk";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

const RESOURCES = [
  "categories", "brands", "products", "orders", "customers", "reviews",
  "services", "bookings", "contactMessages", "coupons", "banners", "bundleOffers",
  "aboutTeam", "aboutMilestones", "heroSlides", "promotionPopups", "blogs", "vehicles", "stores", "users",
];

const NO_CREATE = new Set(["orders", "customers", "contactMessages", "users"]);
const NO_DELETE = new Set(["customers", "users"]);

const CUSTOM_ROUTES = [
  ["GET", "/api/admin/stats"],
  ["GET", "/api/admin/nav-counts"],
  ["GET", "/api/admin/settings"],
  ["GET", "/api/admin/seo"],
  ["GET", "/api/admin/home-layout"],
  ["GET", "/api/admin/bundle-offers/section"],
  ["GET", "/api/admin/about-content/journey-section"],
  ["GET", "/api/admin/about-content/leadership-section"],
  ["GET", "/api/admin/files"],
  ["GET", "/api/admin/activity-logs"],
  ["GET", "/api/admin/cache"],
  ["GET", "/api/admin/reports?type=orders"],
  ["GET", "/api/admin/notifications/list"],
];

let cookie = "";

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.getSetCookie?.() ?? [];
  for (const c of setCookie) {
    const part = c.split(";")[0];
    if (part.startsWith("auth_token=")) cookie = part;
  }
  let json;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, json, ok: res.ok };
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  console.log(`  ✗ ${msg}`);
}

async function login() {
  const res = await req("POST", "/api/auth/admin/login", {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (!res.ok || !res.json?.success) {
    throw new Error(`Login failed: ${res.json?.error || res.status}`);
  }
  pass(`Logged in as ${ADMIN_EMAIL}`);
}

async function testList(resource) {
  const res = await req("GET", `/api/admin/resources/${resource}`);
  if (!res.ok || !res.json?.success) {
    fail(`${resource} LIST → ${res.status} ${res.json?.error || ""}`);
    return null;
  }
  const count = Array.isArray(res.json.data) ? res.json.data.length : 0;
  pass(`${resource} LIST (${count} rows)`);
  return res.json.data;
}

async function testCrudCycle(resource, createBody, updateBody) {
  const created = await req("POST", `/api/admin/resources/${resource}`, createBody);
  if (!created.ok || !created.json?.success) {
    fail(`${resource} CREATE → ${created.status} ${created.json?.error || ""}`);
    return;
  }
  const id = created.json.data?.id;
  pass(`${resource} CREATE (id=${id})`);

  const got = await req("GET", `/api/admin/resources/${resource}/${id}`);
  if (!got.ok || !got.json?.success) {
    fail(`${resource} GET → ${got.status}`);
  } else {
    pass(`${resource} GET`);
  }

  const updated = await req("PUT", `/api/admin/resources/${resource}/${id}`, updateBody);
  if (!updated.ok || !updated.json?.success) {
    fail(`${resource} UPDATE → ${updated.status} ${updated.json?.error || ""}`);
  } else {
    pass(`${resource} UPDATE`);
  }

  if (!NO_DELETE.has(resource)) {
    const del = await req("DELETE", `/api/admin/resources/${resource}/${id}`);
    if (!del.ok || !del.json?.success) {
      fail(`${resource} DELETE → ${del.status} ${del.json?.error || ""}`);
    } else {
      pass(`${resource} DELETE`);
    }
  }
}

async function testUpdateExisting(resource, list) {
  if (!list?.length) return;
  const item = list[0];
  const patch =
    resource === "orders"
      ? { status: item.status || "pending" }
      : resource === "customers" || resource === "users"
        ? { name: item.name, phone: item.phone || "" }
        : { name: item.name || item.title || item.storeName || "Updated" };
  const res = await req("PUT", `/api/admin/resources/${resource}/${item.id}`, patch);
  if (!res.ok || !res.json?.success) {
    fail(`${resource} UPDATE existing → ${res.status} ${res.json?.error || ""}`);
  } else {
    pass(`${resource} UPDATE existing`);
  }
}

const CREATE_PAYLOADS = {
  categories: [
    { name: "Audit Test Cat", icon: "Package", sortOrder: 99, isActive: true },
    { name: "Audit Test Cat Updated", sortOrder: 100 },
  ],
  brands: [
    { name: "Audit Brand", country: "PK" },
    { name: "Audit Brand Updated" },
  ],
  products: [
    {
      name: "Audit Product",
      sku: `AUD-${Date.now()}`,
      brand: "Maximus",
      brandSlug: "maximus",
      category: "LED & Lighting",
      categorySlug: "led-lighting",
      price: 999,
      stock: 5,
      inStock: true,
      description: "Audit test",
      shortDescription: "Audit",
      images: [{ id: "img-1", url: "https://placehold.co/400", alt: "test", isPrimary: true, sortOrder: 0 }],
    },
    { shortDescription: "Audit updated", stock: 6 },
  ],
  reviews: [
    {
      productId: "p-001",
      userId: "u-001",
      userName: "Audit User",
      rating: 5,
      title: "Audit review",
      body: "Test review body",
    },
    { title: "Audit review updated" },
  ],
  services: [
    {
      type: "installation",
      name: "Audit Service",
      description: "Test",
      image: "https://placehold.co/400",
      priceFrom: 500,
      duration: "1h",
      features: ["A"],
    },
    { description: "Updated audit service" },
  ],
  bookings: [
    {
      serviceId: "svc-001",
      userId: "u-001",
      branchId: "store-001",
      customerName: "Audit",
      customerPhone: "03001234567",
      scheduledDate: "2026-12-01",
      scheduledTime: "10:00",
      status: "pending",
    },
    { status: "confirmed" },
  ],
  coupons: [
    {
      code: `AUD${Date.now().toString().slice(-6)}`,
      type: "percentage",
      value: 10,
      minOrder: 0,
      isActive: true,
    },
    { value: 15 },
  ],
  banners: [
    {
      title: "Audit Banner",
      subtitle: "Test",
      image: "https://placehold.co/800x200",
      href: "/products",
      sortOrder: 99,
      isActive: true,
    },
    { subtitle: "Updated" },
  ],
  bundleOffers: [
    {
      title: "Audit Bundle",
      description: "Test bundle",
      image: "https://placehold.co/400",
      price: 1000,
      originalPrice: 1500,
      productIds: [],
      isActive: true,
    },
    { description: "Updated bundle" },
  ],
  aboutTeam: [
    {
      name: "Audit Member",
      role: "Tester",
      image: "https://placehold.co/200",
      sortOrder: 99,
    },
    { role: "Lead Tester" },
  ],
  aboutMilestones: [
    { year: "2026", title: "Audit Milestone", description: "Test" },
    { title: "Audit Milestone Updated" },
  ],
  heroSlides: [
    {
      tag: "Audit",
      title: "Audit Slide",
      description: "Test slide",
      ctaLabel: "Shop",
      ctaHref: "/products",
      sortOrder: 99,
      isActive: true,
    },
    { tag: "Audit Updated" },
  ],
  promotionPopups: [
    {
      title: "Audit Popup",
      body: "Test popup",
      ctaLabel: "Go",
      ctaHref: "/products",
      isActive: false,
      sortOrder: 99,
    },
    { body: "Updated popup" },
  ],
  blogs: [
    {
      title: "Audit Blog Post",
      slug: `audit-blog-${Date.now()}`,
      excerpt: "Test",
      content: "Body",
      author: "Admin",
      image: "https://placehold.co/400",
      isPublished: false,
    },
    { excerpt: "Updated excerpt" },
  ],
  vehicles: [
    { name: "Audit Make", models: ["Model A", "Model B"] },
    { models: ["Model A", "Model B", "Model C"] },
  ],
  stores: [
    {
      name: "Audit Store",
      address: "Test Address",
      city: "Lahore",
      phone: "03001234567",
      lat: 31.5,
      lng: 74.3,
      isActive: true,
    },
    { city: "Karachi" },
  ],
};

async function main() {
  console.log(`\nAdmin CRUD Audit — ${BASE}\n`);
  let issues = 0;

  try {
    await login();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  console.log("\n— Generic resource LIST —");
  for (const resource of RESOURCES) {
    const list = await testList(resource);
    if (!list) issues++;
  }

  console.log("\n— CREATE / UPDATE / DELETE cycles —");
  for (const resource of RESOURCES) {
    if (NO_CREATE.has(resource)) continue;
    const payloads = CREATE_PAYLOADS[resource];
    if (!payloads) {
      fail(`${resource} — no test payload defined`);
      issues++;
      continue;
    }
    try {
      await testCrudCycle(resource, payloads[0], payloads[1]);
    } catch (e) {
      fail(`${resource} cycle error: ${e.message}`);
      issues++;
    }
  }

  console.log("\n— UPDATE on existing records (read-only resources) —");
  for (const resource of ["orders", "customers", "users"]) {
    const list = await req("GET", `/api/admin/resources/${resource}`);
    if (list.ok && list.json?.success) {
      await testUpdateExisting(resource, list.json.data);
    }
  }

  console.log("\n— Custom admin API routes —");
  for (const [method, path] of CUSTOM_ROUTES) {
    const res = await req(method, path);
    if (!res.ok || !res.json?.success) {
      fail(`${method} ${path} → ${res.status} ${res.json?.error || ""}`);
      issues++;
    } else {
      pass(`${method} ${path}`);
    }
  }

  console.log("\n— Auth guard —");
  const saved = cookie;
  cookie = "";
  const blocked = await req("GET", "/api/admin/resources/products");
  cookie = saved;
  if (blocked.status === 401 || blocked.status === 403) {
    pass("Unauthenticated access blocked");
  } else {
    fail(`Unauthenticated access should be blocked, got ${blocked.status}`);
    issues++;
  }

  console.log(`\nDone. Issues: ${issues}\n`);
  process.exit(issues > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
