/**
 * Runtime verification: MysqlStore SQL targets entity tables, never `collections`.
 * Run: npx tsx scripts/verify-mysql-store-runtime.ts
 */
import {
  getMysqlStore,
  lastSqlLog,
  resetMysqlStore,
  testMysqlConnection,
  sqlTouchedCollectionsTable,
} from "../src/lib/data/mysql/mysql-store";
import { COLLECTION_TABLE, buildInsert, buildUpdate } from "../src/lib/data/mysql/entity-tables";
import { getCategories, getProducts, getOrders, getUsers } from "../src/lib/data/repositories";
import { resetStore } from "../src/lib/data/store";

process.env.DATA_SOURCE = "mysql";
resetStore();
resetMysqlStore();

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function main() {
  // Static mapping checks
  for (const [col, table] of Object.entries(COLLECTION_TABLE)) {
    assert(table !== "collections", `${col} must not map to collections`);
  }

  const insert = buildInsert("categories", {
    id: "v-1",
    slug: "v",
    name: "V",
    productCount: 0,
    sortOrder: 0,
    isActive: true,
  });
  assert(insert.sql.includes("`categories`"), `bad insert: ${insert.sql}`);
  assert(!/collections/i.test(insert.sql), "insert mentions collections");

  const update = buildUpdate("categories", {
    id: "v-1",
    slug: "v",
    name: "V2",
    productCount: 0,
    sortOrder: 0,
    isActive: true,
  });
  assert(update.sql.includes("UPDATE `categories`"), `bad update: ${update.sql}`);
  assert(update.sql.includes("WHERE id = ?"), "update must filter by id");

  const ok = await testMysqlConnection();
  if (!ok) {
    console.log("⚠ MySQL not reachable — static checks passed; runtime skipped");
    console.log("✓ mapping: all collections → entity tables (not collections)");
    return;
  }

  lastSqlLog.length = 0;
  const store = getMysqlStore();

  const categories = await store.read("categories");
  const products = await store.read("products");
  const brands = await store.read("brands");
  const orders = await store.read("orders");
  const seo = await store.read("seo");
  const settings = await store.read("settings");

  assert(!sqlTouchedCollectionsTable(), `SQL touched collections:\n${lastSqlLog.join("\n")}`);

  for (const sql of lastSqlLog) {
    assert(!/\bcollections\b/i.test(sql), `Forbidden SQL: ${sql}`);
  }

  // Repository path (same as website / reports)
  lastSqlLog.length = 0;
  const [repoCats, repoProducts, repoOrders, repoUsers] = await Promise.all([
    getCategories(),
    getProducts({ includeInactiveCategories: true }),
    getOrders(),
    getUsers(),
  ]);

  assert(!sqlTouchedCollectionsTable(), `Repo SQL touched collections:\n${lastSqlLog.join("\n")}`);

  console.log("✓ MysqlStore SQL targets entity tables only");
  console.log(
    `  store.read: categories=${categories.length}, products=${products.length}, brands=${brands.length}, orders=${orders.length}, seo=${seo.length}, settings=${settings.length}`
  );
  console.log(
    `  repositories: categories=${repoCats.length}, products=${repoProducts.length}, orders=${repoOrders.length}, users=${repoUsers.length}`
  );
  console.log("✓ website/report fetch path uses respective entity tables");
}

main().catch((e) => {
  console.error("✗", e.message || e);
  process.exit(1);
});
