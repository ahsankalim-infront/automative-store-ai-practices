import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.resolve(
  ROOT,
  "../.cursor/projects/d-LearningAI/assets/c__Users_ahsan.kalim_AppData_Roaming_Cursor_User_workspaceStorage_dd7acc1a19175b28ee702823df06d01a_images_image-4bb780bc-a537-4beb-9be2-bd0e64b2935e.png"
);
const FALLBACK_SRC = path.resolve(
  "C:/Users/ahsan.kalim/.cursor/projects/d-LearningAI/assets/c__Users_ahsan.kalim_AppData_Roaming_Cursor_User_workspaceStorage_dd7acc1a19175b28ee702823df06d01a_images_image-4bb780bc-a537-4beb-9be2-bd0e64b2935e.png"
);

const inputPath = fs.existsSync(SRC) ? SRC : FALLBACK_SRC;
const imagesDir = path.join(ROOT, "public", "images");
const appDir = path.join(ROOT, "src", "app");

function isBackgroundPixel(r, g, b, a) {
  if (a < 16) return true;
  return r > 232 && g > 232 && b > 232;
}

async function removeWhiteBackground(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = [];

  for (let x = 0; x < width; x++) {
    queue.push([x, 0], [x, height - 1]);
  }
  for (let y = 1; y < height - 1; y++) {
    queue.push([0, y], [width - 1, y]);
  }

  const pixelIndex = (x, y) => (y * width + x) * channels;
  const posIndex = (x, y) => y * width + x;

  while (queue.length) {
    const [x, y] = queue.pop();
    const pi = posIndex(x, y);
    if (visited[pi]) continue;
    visited[pi] = 1;

    const i = pixelIndex(x, y);
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (!isBackgroundPixel(r, g, b, a)) continue;

    data[i + 3] = 0;

    if (x > 0) queue.push([x - 1, y]);
    if (x < width - 1) queue.push([x + 1, y]);
    if (y > 0) queue.push([x, y - 1]);
    if (y < height - 1) queue.push([x, y + 1]);
  }

  return sharp(data, { raw: { width, height, channels } }).png();
}

async function main() {
  if (!fs.existsSync(inputPath)) {
    console.error("Source logo not found:", inputPath);
    process.exit(1);
  }

  fs.mkdirSync(imagesDir, { recursive: true });

  const transparent = await removeWhiteBackground(inputPath);
  const logoPath = path.join(imagesDir, "sph-logo-mark.png");
  await transparent.clone().toFile(logoPath);

  await transparent
    .clone()
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(appDir, "icon.png"));

  await transparent
    .clone()
    .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(appDir, "apple-icon.png"));

  console.log("Logo processed:");
  console.log(" -", logoPath);
  console.log(" -", path.join(appDir, "icon.png"));
  console.log(" -", path.join(appDir, "apple-icon.png"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
