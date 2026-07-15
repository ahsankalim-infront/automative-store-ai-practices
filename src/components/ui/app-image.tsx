import type { ImageProps } from "next/image";
import NextImage from "next/image";
import { normalizeImageSrcProp } from "@/lib/images/normalize";

function shouldSkipOptimization(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return false;
  return src.startsWith("data:") || src.includes("placehold.co");
}

/**
 * Drop-in replacement for next/image that normalizes local/upload URLs
 * and works with the shared images config in next.config.ts.
 */
export function AppImage({ src, unoptimized, ...props }: ImageProps) {
  const normalized = normalizeImageSrcProp(src);
  const skip = unoptimized ?? shouldSkipOptimization(normalized);

  return <NextImage src={normalized} unoptimized={skip} {...props} />;
}

export type { ImageProps as AppImageProps };
