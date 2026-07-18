import mysql from "mysql2/promise";
import type { IJsonStore } from "../types";
import {
  COLLECTION_TABLE,
  ORDER_BY,
  asBool,
  asJson,
  asNum,
  asStr,
  buildInsert,
  buildUpdate,
  ensureId,
  parseData,
  rowToEntity,
  type Row,
} from "./entity-tables";

const POOL_CONFIG = {
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "autozone_store",
  waitForConnections: true,
  connectionLimit: 10,
};

let pool: mysql.Pool | null = null;

/** SQL statements executed by MysqlStore — used by verify script / tests. */
export const lastSqlLog: string[] = [];
const SQL_LOG_MAX = 200;

function logSql(sql: string) {
  lastSqlLog.push(sql);
  if (lastSqlLog.length > SQL_LOG_MAX) lastSqlLog.shift();
}

function getPool(): mysql.Pool {
  if (!pool) pool = mysql.createPool(POOL_CONFIG);
  return pool;
}

async function exec(
  target: mysql.Pool | mysql.PoolConnection,
  sql: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
) {
  logSql(sql);
  return target.execute(sql, params);
}

function resolveTable(collection: string): string {
  const table = COLLECTION_TABLE[collection];
  if (!table) {
    throw new Error(`Unknown MySQL collection "${collection}" — no entity table mapping`);
  }
  return table;
}

async function upsertSeo(
  conn: mysql.Pool | mysql.PoolConnection,
  item: Row
): Promise<Row> {
  const id = ensureId(item, "seo-1");
  const data: Row = { ...item, id };
  const global = (data.global as Row | undefined) ?? {};

  await exec(
    conn,
    `INSERT INTO seo_global (id, site_name, site_title, title_template, default_description, default_keywords, default_og_image, twitter_handle, google_verification, bing_verification, robots_allow, organization_name, organization_logo, locale, robots_extra, data)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE site_name=VALUES(site_name), site_title=VALUES(site_title), title_template=VALUES(title_template),
     default_description=VALUES(default_description), default_keywords=VALUES(default_keywords), default_og_image=VALUES(default_og_image),
     twitter_handle=VALUES(twitter_handle), google_verification=VALUES(google_verification), bing_verification=VALUES(bing_verification),
     robots_allow=VALUES(robots_allow), organization_name=VALUES(organization_name), organization_logo=VALUES(organization_logo),
     locale=VALUES(locale), robots_extra=VALUES(robots_extra), data=VALUES(data)`,
    [
      id,
      asStr(global.siteName),
      asStr(global.siteTitle),
      asStr(global.titleTemplate, "%s | Site"),
      asStr(global.defaultDescription),
      global.defaultKeywords ? asJson(global.defaultKeywords) : null,
      global.defaultOgImage ?? null,
      global.twitterHandle ?? null,
      global.googleSiteVerification ?? null,
      global.bingSiteVerification ?? null,
      asBool(global.robotsAllow, true),
      global.organizationName ?? null,
      global.organizationLogo ?? null,
      asStr(global.locale, "en_PK"),
      global.robotsExtra ?? null,
      asJson(data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any
  );

  await exec(conn, "DELETE FROM seo_pages");
  const pages = data.pages as Record<string, Row> | undefined;
  if (pages) {
    for (const [pageKey, page] of Object.entries(pages)) {
      const pageId =
        typeof page.id === "string" && page.id ? page.id : `${id}-page-${pageKey}`;
      await exec(
        conn,
        `INSERT INTO seo_pages (id, page_key, path, title, description, keywords, og_image, canonical, noindex, sitemap, priority, changefreq, data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [
          pageId,
          pageKey,
          asStr(page.path, `/${pageKey}`),
          page.title ?? null,
          page.description ?? null,
          page.keywords ? asJson(page.keywords) : null,
          page.ogImage ?? null,
          page.canonical ?? null,
          asBool(page.noindex),
          asBool(page.sitemap, true),
          asNum(page.priority, 0.5),
          asStr(page.changefreq, "weekly"),
          asJson(page),
        ] as any
      );
    }
  }

  return data;
}

async function readSeo(p: mysql.Pool): Promise<Row[]> {
  const [rows] = (await exec(
    p,
    "SELECT data FROM seo_global ORDER BY updated_at ASC LIMIT 1"
  )) as [mysql.RowDataPacket[], unknown];
  if (!rows.length) return [];
  return [parseData<Row>(rows[0].data)];
}

/**
 * MySQL adapter — same interface as JsonStore.
 * Each logical collection maps to its own entity table (categories → categories, etc.).
 * Never reads/writes the legacy `collections` table.
 */
export class MysqlStore implements IJsonStore {
  async read<T>(collection: string): Promise<T[]> {
    const p = getPool();

    if (collection === "seo") {
      return (await readSeo(p)) as T[];
    }

    if (collection === "analytics") {
      const [rows] = (await exec(p, "SELECT * FROM analytics LIMIT 1")) as [
        mysql.RowDataPacket[],
        unknown,
      ];
      if (!rows.length) return [];
      const entity = rowToEntity(collection, rows[0] as Row);
      if (!entity.id) entity.id = asStr(rows[0].id, "analytics-1");
      return [entity as T];
    }

    const table = resolveTable(collection);
    const orderBy = ORDER_BY[collection] ? ` ORDER BY ${ORDER_BY[collection]}` : "";
    const [rows] = (await exec(p, `SELECT * FROM \`${table}\`${orderBy}`)) as [
      mysql.RowDataPacket[],
      unknown,
    ];
    return rows.map((r) => rowToEntity(collection, r as Row) as T);
  }

  async write<T>(collection: string, data: T[]): Promise<void> {
    const p = getPool();
    const conn = await p.getConnection();
    try {
      await conn.beginTransaction();

      if (collection === "seo") {
        await exec(conn, "DELETE FROM seo_pages");
        await exec(conn, "DELETE FROM seo_global");
        for (const item of data) {
          await upsertSeo(conn, item as Row);
        }
      } else {
        const table = resolveTable(collection);
        await exec(conn, `DELETE FROM \`${table}\``);
        for (const item of data) {
          const row = item as Row;
          if (collection === "analytics" && !row.id) {
            row.id = "analytics-1";
          }
          const plan = buildInsert(collection, row);
          await exec(conn, plan.sql, plan.params);
        }
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  async readOne<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
    const p = getPool();

    if (collection === "seo") {
      const items = await readSeo(p);
      const match = items.find((i) => i.id === id);
      return (match as T) ?? null;
    }

    const table = resolveTable(collection);
    const [rows] = (await exec(p, `SELECT * FROM \`${table}\` WHERE id = ? LIMIT 1`, [id])) as [
      mysql.RowDataPacket[],
      unknown,
    ];
    if (!rows.length) return null;
    return rowToEntity(collection, rows[0] as Row) as T;
  }

  async create<T extends { id: string }>(collection: string, item: T): Promise<T> {
    const p = getPool();
    const row = { ...(item as Row) };

    if (collection === "analytics" && !row.id) {
      row.id = "analytics-1";
    }

    if (collection === "seo") {
      const saved = await upsertSeo(p, row);
      return saved as T;
    }

    const plan = buildInsert(collection, row);
    await exec(p, plan.sql, plan.params);
    return { ...item, id: ensureId(row) } as T;
  }

  async update<T extends { id: string }>(
    collection: string,
    id: string,
    partial: Partial<T>
  ): Promise<T | null> {
    const existing = await this.readOne<T>(collection, id);
    if (!existing) return null;
    const updated = { ...existing, ...partial, id } as T & Row;

    if (collection === "seo") {
      await upsertSeo(getPool(), updated);
      return updated;
    }

    const plan = buildUpdate(collection, updated);
    await exec(getPool(), plan.sql, plan.params);
    return updated;
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const p = getPool();

    if (collection === "seo") {
      const [result] = (await exec(p, "DELETE FROM seo_global WHERE id = ?", [id])) as [
        mysql.ResultSetHeader,
        unknown,
      ];
      await exec(p, "DELETE FROM seo_pages");
      return result.affectedRows > 0;
    }

    const table = resolveTable(collection);
    const [result] = (await exec(p, `DELETE FROM \`${table}\` WHERE id = ?`, [id])) as [
      mysql.ResultSetHeader,
      unknown,
    ];
    return result.affectedRows > 0;
  }
}

let mysqlStore: MysqlStore | null = null;

export function getMysqlStore(): MysqlStore {
  if (!mysqlStore) mysqlStore = new MysqlStore();
  return mysqlStore;
}

/** Reset singleton (tests / verify scripts). */
export function resetMysqlStore() {
  mysqlStore = null;
  lastSqlLog.length = 0;
}

export async function testMysqlConnection(): Promise<boolean> {
  try {
    const conn = await getPool().getConnection();
    conn.release();
    return true;
  } catch {
    return false;
  }
}

/** True if any logged SQL touched the legacy collections table. */
export function sqlTouchedCollectionsTable(): boolean {
  return lastSqlLog.some((s) => /\bcollections\b/i.test(s) && !/seo_pages/i.test(s));
}
