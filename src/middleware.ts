import { NextRequest, NextResponse } from "next/server";
import { isAdminRole } from "./lib/rbac";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const cookieHeader = request.headers.get("cookie") || "";
    const port = process.env.PORT || "3000";
    
    // Internal loopback to local Node server process avoiding external proxy routing
    const sessionUrl = `http://127.0.0.1:${port}/api/auth/get-session`;

    try {
      const sessionRes = await fetch(sessionUrl, {
        headers: {
          cookie: cookieHeader,
          host: request.headers.get("host") || "localhost",
        },
      });

      if (sessionRes.ok) {
        const sessionData = await sessionRes.json().catch(() => null);

        if (!sessionData || !sessionData.user) {
          return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
        }

        const email = sessionData.user.email;
        const role = sessionData.user.role;
        const isExecutiveEmail = email === "abohrandy@gmail.com" || email === "me@randyaboh.com";

        if (!isExecutiveEmail && !isAdminRole(role)) {
          return new NextResponse("Forbidden: Administrative Credentials Required", {
            status: 403,
          });
        }
      }
    } catch (error) {
      console.warn("Middleware local session check error, proceeding to client routing:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
