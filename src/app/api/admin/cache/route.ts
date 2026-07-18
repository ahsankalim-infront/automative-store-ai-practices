import { ok, fail, requireAdmin } from "@/lib/api/helpers";
import {
  CACHE_GROUPS,
  clearAllApplicationCache,
  clearCacheGroup,
  type CacheGroupId,
} from "@/lib/cache/admin-cache";
import { logActivityFromRequest } from "@/lib/activity-log/service";
import { actorFromJwt } from "@/lib/activity-log/request";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  return ok(
    {
      groups: CACHE_GROUPS.map(({ id, label, description, tags }) => ({
        id,
        label,
        description,
        tags,
      })),
    },
    200,
    0
  );
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      scope?: "all" | CacheGroupId;
    };
    const scope = body.scope || "all";

    if (scope === "all") {
      const result = clearAllApplicationCache();
      await logActivityFromRequest(request, {
        action: "cache.clear_all",
        category: "admin",
        status: "success",
        message: `Cleared all application cache (${result.tags.length} tags)`,
        ...actorFromJwt(auth),
        entityType: "cache",
        metadata: { tags: result.tags, paths: result.paths },
      });
      return ok(
        {
          scope: "all" as const,
          clearedTags: result.tags,
          revalidatedPaths: result.paths,
        },
        200,
        0
      );
    }

    const groupIds = CACHE_GROUPS.map((g) => g.id);
    if (!groupIds.includes(scope as CacheGroupId)) {
      return fail(`Unknown cache scope. Use "all" or one of: ${groupIds.join(", ")}`, 400);
    }

    const result = clearCacheGroup(scope as CacheGroupId);
    await logActivityFromRequest(request, {
      action: "cache.clear_group",
      category: "admin",
      status: "success",
      message: `Cleared cache group: ${result.groupId}`,
      ...actorFromJwt(auth),
      entityType: "cache",
      entityId: result.groupId,
      metadata: { tags: result.tags },
    });

    return ok(
      {
        scope: result.groupId,
        clearedTags: result.tags,
      },
      200,
      0
    );
  } catch (e) {
    await logActivityFromRequest(request, {
      action: "cache.clear",
      category: "admin",
      status: "failure",
      message: e instanceof Error ? e.message : "Cache clear failed",
      ...actorFromJwt(auth),
      entityType: "cache",
    });
    return fail(e instanceof Error ? e.message : "Cache clear failed", 400);
  }
}
