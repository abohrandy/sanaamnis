import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";

export interface AdminSession {
  userId: string;
  name: string;
  email: string;
  role: string;
}

interface RequireAdminResult {
  /** Set when the request is authorized; null otherwise. */
  session: AdminSession | null;
  /** Set when the request must be rejected — return this directly from the route. */
  deny: NextResponse | null;
}

/**
 * The real security boundary for every /api/admin/* route.
 *
 * src/middleware.ts only gates reaching /admin at all (coarse: any admin-tier
 * role passes). This checks the specific permission a route needs, using the
 * per-role matrix in src/lib/rbac.ts that was fully defined but never actually
 * called anywhere before this — an "editor" (role permission: edit:blog only)
 * could previously load every admin screen and nothing stopped them from hitting
 * a catalog or settings endpoint directly.
 *
 * Usage:
 *   const { session, deny } = await requireAdmin("edit:catalog");
 *   if (deny) return deny;
 *   // session.userId, session.role, ... are available here
 *
 * Pass an array when a route legitimately serves more than one section (media
 * is used from both the catalog and content editors) — any one matching
 * permission is enough.
 */
export async function requireAdmin(permission: string | string[]): Promise<RequireAdminResult> {
  const permissions = Array.isArray(permission) ? permission : [permission];

  try {
    const result = await auth.api.getSession({ headers: await headers() });
    const user = result?.user;

    if (!user || !permissions.some((p) => hasPermission(user.role, p))) {
      return {
        session: null,
        deny: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }

    return {
      session: { userId: user.id, name: user.name, email: user.email, role: user.role ?? "" },
      deny: null,
    };
  } catch (error) {
    console.error("[admin-auth] session lookup failed:", error);
    return {
      session: null,
      deny: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
}
