import mysql from "mysql2/promise";
import { getDataSource } from "../config";
import type { Product, ProductImage, ProductSpecification, VehicleCompatibility } from "@/types";

let pool: mysql.Pool | null = null;

function poolOrNull(): mysql.Pool | null {
  if (getDataSource() !== "mysql") return null;
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "autozone_store",
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

export async function syncProductRelations(product: Product): Promise<void> {
  const p = poolOrNull();
  if (!p) return;

  const conn = await p.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute("DELETE FROM product_specifications WHERE product_id = ?", [product.id]);
    await conn.execute("DELETE FROM product_vehicle_fit WHERE product_id = ?", [product.id]);
    await conn.execute("DELETE FROM product_images WHERE product_id = ?", [product.id]);

    for (let i = 0; i < (product.images?.length ?? 0); i++) {
      const img = product.images[i];
      await conn.execute(
        `INSERT INTO product_images (id, product_id, url, alt, is_primary, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          img.id ?? crypto.randomUUID(),
          product.id,
          img.url,
          img.alt ?? "",
          img.isPrimary ? 1 : 0,
          i,
        ]
      );
    }

    for (let i = 0; i < (product.specifications?.length ?? 0); i++) {
      const spec = product.specifications[i];
      await conn.execute(
        `INSERT INTO product_specifications (id, product_id, label, value, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [spec.id ?? crypto.randomUUID(), product.id, spec.label, spec.value, i]
      );
    }

    for (let i = 0; i < (product.vehicleCompatibility?.length ?? 0); i++) {
      const fit = product.vehicleCompatibility![i];
      await conn.execute(
        `INSERT INTO product_vehicle_fit
         (id, product_id, vehicle_make_id, vehicle_model_id, brand, model, year_from, year_to, variants, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fit.id ?? crypto.randomUUID(),
          product.id,
          fit.vehicleMakeId ?? fit.makeSlug ?? null,
          fit.vehicleModelId ?? fit.modelSlug ?? null,
          fit.brand,
          fit.model,
          fit.yearFrom,
          fit.yearTo,
          fit.variants?.length ? JSON.stringify(fit.variants) : null,
          i,
        ]
      );
    }

    await conn.commit();
  } catch (e) {
    await conn.rollback();
    console.error("[mysql] syncProductRelations failed:", e);
  } finally {
    conn.release();
  }
}

export async function deleteProductRelations(productId: string): Promise<void> {
  const p = poolOrNull();
  if (!p) return;
  await p.execute("DELETE FROM product_specifications WHERE product_id = ?", [productId]);
  await p.execute("DELETE FROM product_vehicle_fit WHERE product_id = ?", [productId]);
  await p.execute("DELETE FROM product_images WHERE product_id = ?", [productId]);
}

export async function loadProductSpecifications(productId: string): Promise<ProductSpecification[]> {
  const p = poolOrNull();
  if (!p) return [];
  const [rows] = await p.execute<mysql.RowDataPacket[]>(
    `SELECT id, label, value FROM product_specifications
     WHERE product_id = ? ORDER BY sort_order ASC`,
    [productId]
  );
  return rows.map((r) => ({
    id: String(r.id),
    label: String(r.label),
    value: String(r.value),
  }));
}

export async function loadProductVehicleFit(productId: string): Promise<VehicleCompatibility[]> {
  const p = poolOrNull();
  if (!p) return [];
  const [rows] = await p.execute<mysql.RowDataPacket[]>(
    `SELECT id, vehicle_make_id, vehicle_model_id, brand, model, year_from, year_to, variants
     FROM product_vehicle_fit WHERE product_id = ? ORDER BY sort_order ASC`,
    [productId]
  );
  return rows.map((r) => ({
    id: String(r.id),
    vehicleMakeId: r.vehicle_make_id ? String(r.vehicle_make_id) : undefined,
    vehicleModelId: r.vehicle_model_id ? String(r.vehicle_model_id) : undefined,
    makeSlug: r.vehicle_make_id ? String(r.vehicle_make_id) : undefined,
    modelSlug: r.vehicle_model_id ? String(r.vehicle_model_id) : undefined,
    brand: String(r.brand),
    model: String(r.model),
    yearFrom: Number(r.year_from),
    yearTo: Number(r.year_to),
    variants: r.variants
      ? typeof r.variants === "string"
        ? JSON.parse(r.variants)
        : (r.variants as string[])
      : undefined,
  }));
}

export async function loadProductImages(productId: string): Promise<ProductImage[]> {
  const p = poolOrNull();
  if (!p) return [];
  const [rows] = await p.execute<mysql.RowDataPacket[]>(
    `SELECT id, url, alt, is_primary FROM product_images
     WHERE product_id = ? ORDER BY sort_order ASC`,
    [productId]
  );
  return rows.map((r) => ({
    id: String(r.id),
    url: String(r.url),
    alt: String(r.alt ?? ""),
    isPrimary: Boolean(r.is_primary),
  }));
}

export async function mergeProductRelations(product: Product): Promise<Product> {
  if (getDataSource() !== "mysql") return product;

  const [specs, fit, images] = await Promise.all([
    loadProductSpecifications(product.id),
    loadProductVehicleFit(product.id),
    loadProductImages(product.id),
  ]);

  return {
    ...product,
    images: images.length ? images : product.images ?? [],
    specifications: product.specifications?.length ? product.specifications : specs,
    vehicleCompatibility: product.vehicleCompatibility?.length
      ? product.vehicleCompatibility
      : fit.length
        ? fit
        : product.vehicleCompatibility,
  };
}
