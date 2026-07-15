import mysql from "mysql2/promise";
import type { IJsonStore } from "../types";

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

function getPool(): mysql.Pool {
  if (!pool) pool = mysql.createPool(POOL_CONFIG);
  return pool;
}

/** MySQL adapter — same interface as JsonStore, stores entities in `collections` table */
export class MysqlStore implements IJsonStore {
  async read<T>(collection: string): Promise<T[]> {
    const [rows] = await getPool().execute<mysql.RowDataPacket[]>(
      "SELECT data FROM collections WHERE collection_name = ? ORDER BY created_at ASC",
      [collection]
    );
    return rows.map((r) => (typeof r.data === "string" ? JSON.parse(r.data) : r.data) as T);
  }

  async write<T>(collection: string, data: T[]): Promise<void> {
    const conn = await getPool().getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute("DELETE FROM collections WHERE collection_name = ?", [collection]);
      for (const item of data) {
        const id = (item as { id?: string }).id || crypto.randomUUID();
        await conn.execute(
          "INSERT INTO collections (id, collection_name, data, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
          [id, collection, JSON.stringify(item)]
        );
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
    const [rows] = await getPool().execute<mysql.RowDataPacket[]>(
      "SELECT data FROM collections WHERE collection_name = ? AND id = ? LIMIT 1",
      [collection, id]
    );
    if (!rows.length) return null;
    const raw = rows[0].data;
    return (typeof raw === "string" ? JSON.parse(raw) : raw) as T;
  }

  async create<T extends { id: string }>(collection: string, item: T): Promise<T> {
    await getPool().execute(
      "INSERT INTO collections (id, collection_name, data, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [item.id, collection, JSON.stringify(item)]
    );
    return item;
  }

  async update<T extends { id: string }>(collection: string, id: string, partial: Partial<T>): Promise<T | null> {
    const existing = await this.readOne<T>(collection, id);
    if (!existing) return null;
    const updated = { ...existing, ...partial };
    await getPool().execute(
      "UPDATE collections SET data = ?, updated_at = NOW() WHERE collection_name = ? AND id = ?",
      [JSON.stringify(updated), collection, id]
    );
    return updated;
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const [result] = await getPool().execute<mysql.ResultSetHeader>(
      "DELETE FROM collections WHERE collection_name = ? AND id = ?",
      [collection, id]
    );
    return result.affectedRows > 0;
  }
}

let mysqlStore: MysqlStore | null = null;

export function getMysqlStore(): MysqlStore {
  if (!mysqlStore) mysqlStore = new MysqlStore();
  return mysqlStore;
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
