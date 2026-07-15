import { readFile, writeFile, mkdir, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { JSON_DATA_DIR } from "../config";
import type { IJsonStore } from "../types";

function filePath(collection: string) {
  return path.join(JSON_DATA_DIR, `${collection}.json`);
}

type CacheEntry = { mtimeMs: number; data: unknown[] };

export class JsonStore implements IJsonStore {
  private memoryCache = new Map<string, CacheEntry>();

  private async ensureDir() {
    if (!existsSync(JSON_DATA_DIR)) {
      await mkdir(JSON_DATA_DIR, { recursive: true });
    }
  }

  async read<T>(collection: string): Promise<T[]> {
    await this.ensureDir();
    const fp = filePath(collection);
    if (!existsSync(fp)) return [];

    const { mtimeMs } = await stat(fp);
    const cached = this.memoryCache.get(collection);
    if (cached && cached.mtimeMs === mtimeMs) {
      return cached.data as T[];
    }

    const raw = await readFile(fp, "utf-8");
    const data = JSON.parse(raw) as T[];
    this.memoryCache.set(collection, { mtimeMs, data });
    return data;
  }

  async write<T>(collection: string, data: T[]): Promise<void> {
    await this.ensureDir();
    await writeFile(filePath(collection), JSON.stringify(data, null, 2), "utf-8");
    this.memoryCache.set(collection, { mtimeMs: Date.now(), data });
  }

  async readOne<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
    const items = await this.read<T>(collection);
    return items.find((i) => i.id === id) ?? null;
  }

  async create<T extends { id: string }>(collection: string, item: T): Promise<T> {
    const items = await this.read<T>(collection);
    items.push(item);
    await this.write(collection, items);
    return item;
  }

  async update<T extends { id: string }>(collection: string, id: string, partial: Partial<T>): Promise<T | null> {
    const items = await this.read<T>(collection);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...partial };
    await this.write(collection, items);
    return items[idx];
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const items = await this.read<{ id: string }>(collection);
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length) return false;
    await this.write(collection, filtered);
    return true;
  }
}

let jsonStore: JsonStore | null = null;

export function getJsonStore(): JsonStore {
  if (!jsonStore) jsonStore = new JsonStore();
  return jsonStore;
}
