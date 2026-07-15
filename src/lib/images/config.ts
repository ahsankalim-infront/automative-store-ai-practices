import type { NextConfig } from "next";

/** Hostnames allowed for remote next/image optimization. */
export const REMOTE_IMAGE_HOSTS = [
  "placehold.co",
  "images.unsplash.com",
  "via.placeholder.com",
] as const;

/** Local public-folder path prefixes (informational; catch-all pattern covers these). */
export const LOCAL_IMAGE_PREFIXES = [
  "/uploads",
  "/images",
  "/assets",
  "/icons",
] as const;

/** Catch-all for any file served from /public. */
export const LOCAL_IMAGE_PATTERN = "/**";

export type ImageRemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

export function buildLocalPatterns(): NonNullable<NextConfig["images"]>["localPatterns"] {
  return [{ pathname: LOCAL_IMAGE_PATTERN, search: "" }];
}

export function buildRemotePatterns(): ImageRemotePattern[] {
  const patterns: ImageRemotePattern[] = REMOTE_IMAGE_HOSTS.map((hostname) => ({
    protocol: "https" as const,
    hostname,
  }));

  // placehold.co also serves over http in some fallbacks
  patterns.push({ protocol: "http", hostname: "placehold.co" });

  // Same-origin absolute URLs in dev (e.g. http://localhost:3000/uploads/...)
  for (const hostname of ["localhost", "127.0.0.1"]) {
    patterns.push({
      protocol: "http",
      hostname,
      pathname: "/**",
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      const { protocol, hostname, port } = new URL(appUrl);
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        patterns.push({
          protocol: protocol.replace(":", "") as "http" | "https",
          hostname,
          ...(port ? { port } : {}),
          pathname: "/**",
        });
      }
    } catch {
      // ignore invalid NEXT_PUBLIC_APP_URL
    }
  }

  return patterns;
}

export function buildNextImageConfig(): NonNullable<NextConfig["images"]> {
  return {
    formats: ["image/avif", "image/webp"],
    localPatterns: buildLocalPatterns(),
    remotePatterns: buildRemotePatterns(),
    dangerouslyAllowLocalIP: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  };
}
