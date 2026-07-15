import type { ImageProps } from "next/image";
import { LOCAL_IMAGE_PREFIXES } from "./config";

type ImageSrc = NonNullable<ImageProps["src"]>;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
const LOCAL_IMAGE_EXT = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

function isPublicAssetPath(pathname: string): boolean {
  if (!pathname.startsWith("/") || pathname.startsWith("/_next/")) return false;
  if (LOCAL_IMAGE_PREFIXES.some((prefix) => pathname.startsWith(`${prefix}/`))) {
    return true;
  }
  return LOCAL_IMAGE_EXT.test(pathname);
}

function getAppOrigin(): string | null {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return null;
  try {
    return new URL(appUrl).origin;
  } catch {
    return null;
  }
}

function isSameOrigin(url: URL): boolean {
  if (LOCAL_HOSTS.has(url.hostname)) return true;

  const appOrigin = getAppOrigin();
  if (appOrigin && url.origin === appOrigin) return true;

  if (typeof window !== "undefined" && url.origin === window.location.origin) {
    return true;
  }

  return false;
}

/**
 * Normalizes image src for next/image:
 * - Keeps relative /public paths as-is
 * - Strips same-origin host from absolute URLs (uploads, /images, etc.)
 * - Leaves external CDN URLs unchanged
 */
export function normalizeImageSrc(src: string): string {
  if (!src) return src;
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;

  // Relative public asset
  if (src.startsWith("/") && !src.startsWith("//")) return src;

  // Protocol-relative URL
  if (src.startsWith("//")) {
    try {
      const url = new URL(`https:${src}`);
      if (isPublicAssetPath(url.pathname) && isSameOrigin(url)) {
        return url.pathname + url.search;
      }
    } catch {
      return src;
    }
    return src;
  }

  try {
    const url = new URL(src);
    if (isPublicAssetPath(url.pathname) && isSameOrigin(url)) {
      return url.pathname + url.search;
    }
  } catch {
    // Not a valid absolute URL — return unchanged
  }

  return src;
}

export function normalizeImageSrcProp(src: ImageSrc): ImageSrc {
  if (typeof src === "string") return normalizeImageSrc(src);
  return src;
}
