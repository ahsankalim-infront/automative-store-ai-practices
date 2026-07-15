import { readFile, writeFile, mkdir, unlink, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

export const UPLOADS_PUBLIC_DIR = path.join(process.cwd(), "public", "uploads");
export const UPLOADS_MANIFEST_PATH = path.join(process.cwd(), "data", "uploads", "manifest.json");

export interface UploadedFileRecord {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  uploadedAt: string;
}

const RESIZABLE_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const ALLOWED_MIMES = new Set([
  ...RESIZABLE_IMAGE_MIMES,
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

const MAX_BYTES = 10 * 1024 * 1024;

function slugify(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 80);
}

async function ensureDirs() {
  if (!existsSync(UPLOADS_PUBLIC_DIR)) await mkdir(UPLOADS_PUBLIC_DIR, { recursive: true });
  const manifestDir = path.dirname(UPLOADS_MANIFEST_PATH);
  if (!existsSync(manifestDir)) await mkdir(manifestDir, { recursive: true });
}

async function readManifest(): Promise<UploadedFileRecord[]> {
  await ensureDirs();
  if (!existsSync(UPLOADS_MANIFEST_PATH)) return [];
  const raw = await readFile(UPLOADS_MANIFEST_PATH, "utf-8");
  return JSON.parse(raw) as UploadedFileRecord[];
}

async function writeManifest(records: UploadedFileRecord[]) {
  await ensureDirs();
  await writeFile(UPLOADS_MANIFEST_PATH, JSON.stringify(records, null, 2), "utf-8");
}

export interface UploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  resize?: boolean;
}

export async function listUploadedFiles(): Promise<UploadedFileRecord[]> {
  const records = await readManifest();
  return records.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadedFileRecord> {
  if (file.size > MAX_BYTES) {
    throw new Error(`File exceeds ${MAX_BYTES / 1024 / 1024}MB limit`);
  }
  if (!ALLOWED_MIMES.has(file.type)) {
    throw new Error("File type not allowed. Use JPG, PNG, WebP, GIF, SVG, or PDF.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();

  let outputBuffer = buffer;
  let mimeType = file.type;
  let ext = path.extname(file.name) || ".bin";
  let width: number | undefined;
  let height: number | undefined;

  const canResize = RESIZABLE_IMAGE_MIMES.has(file.type);
  const shouldResize =
    canResize &&
    options.resize === true &&
    Boolean(options.maxWidth || options.maxHeight);

  if (shouldResize) {
    const quality = Math.min(100, Math.max(1, options.quality ?? 85));
    let pipeline = sharp(buffer);

    pipeline = pipeline.resize({
      width: options.maxWidth,
      height: options.maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });

    const result = await pipeline.webp({ quality }).toBuffer({ resolveWithObject: true });
    outputBuffer = result.data;
    width = result.info.width;
    height = result.info.height;
    mimeType = "image/webp";
    ext = ".webp";
  } else if (canResize || file.type === "image/gif") {
    try {
      const meta = await sharp(buffer, { animated: file.type === "image/gif" }).metadata();
      width = meta.width;
      height = meta.height;
    } catch {
      // Non-fatal for metadata
    }
  }

  const baseName = slugify(path.basename(file.name, path.extname(file.name))) || "file";
  const filename = `${baseName}-${id.slice(0, 8)}${ext}`;
  const diskPath = path.join(UPLOADS_PUBLIC_DIR, filename);

  if (!path.resolve(diskPath).startsWith(path.resolve(UPLOADS_PUBLIC_DIR))) {
    throw new Error("Invalid file path");
  }

  await writeFile(diskPath, outputBuffer);
  const fileStat = await stat(diskPath);

  const record: UploadedFileRecord = {
    id,
    filename,
    originalName: file.name,
    url: `/uploads/${filename}`,
    mimeType,
    size: fileStat.size,
    width,
    height,
    uploadedAt: new Date().toISOString(),
  };

  const records = await readManifest();
  records.push(record);
  await writeManifest(records);
  return record;
}

export async function deleteUploadedFile(id: string): Promise<boolean> {
  const records = await readManifest();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return false;

  const [removed] = records.splice(idx, 1);
  const diskPath = path.join(UPLOADS_PUBLIC_DIR, removed.filename);
  if (existsSync(diskPath)) await unlink(diskPath);
  await writeManifest(records);
  return true;
}
