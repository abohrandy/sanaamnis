import { NextRequest, NextResponse } from "next/server";
import { isAdminRole } from "./lib/rbac";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const cookieHeader = request.headers.get("cookie") || "";

    try {
      const sessionRes = await fetch(
        new URL("/api/auth/get-session", request.nextUrl.origin),
        {
          headers: {
            cookie: cookieHeader,
          },
        }
      );

      if (!sessionRes.ok) {
        return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
      }

      const sessionData = await sessionRes.json().catch(() => null);

      if (!sessionData || !sessionData.user) {
        return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
      }

      const role = sessionData.user.role;

      if (!isAdminRole(role)) {
        return new NextResponse("Forbidden: Administrative Credentials Required", {
          status: 403,
        });
      }
    } catch (error) {
      console.error("Middleware session verification failed:", error);
      return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
