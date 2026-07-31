import { NextRequest, NextResponse } from "next/server";
import { isAdminRole } from "./lib/rbac";

/**
 * Gates /admin/*. Default-deny: any uncertainty (no session, an errored session
 * check, a non-OK response from the session endpoint) redirects to /login rather
 * than letting the request through.
 *
 * This previously had two ways to leak through as "allow":
 *  1. A hardcoded email bypass (`abohrandy@gmail.com` / `me@randyaboh.com` got in
 *     regardless of role) — removed. Access is strictly role-based now; those
 *     accounts get in because the seed promotes them to role "admin" in the
 *     database, same as any other admin.
 *  2. If the internal session-check fetch resolved but wasn't `.ok`, the code fell
 *     through the `if (sessionRes.ok)` block and reached `NextResponse.next()` at
 *     the bottom regardless — silently granting access on a 500 from the session
 *     endpoint. Both this and a thrown fetch now deny.
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  const loginRedirect = () => {
    const url = new URL("/login", request.nextUrl.origin);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  };

  const cookieHeader = request.headers.get("cookie") || "";
  const port = process.env.PORT || "3000";
  // Internal loopback to the local Node server process, avoiding external proxy routing.
  const sessionUrl = `http://127.0.0.1:${port}/api/auth/get-session`;

  try {
    const sessionRes = await fetch(sessionUrl, {
      headers: {
        cookie: cookieHeader,
        host: request.headers.get("host") || "localhost",
      },
    });

    if (!sessionRes.ok) {
      return loginRedirect();
    }

    const sessionData = await sessionRes.json().catch(() => null);
    if (!sessionData?.user) {
      return loginRedirect();
    }

    if (!isAdminRole(sessionData.user.role)) {
      return new NextResponse("Forbidden: administrative access required.", {
        status: 403,
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[middleware] session check failed, denying access:", error);
    return loginRedirect();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
