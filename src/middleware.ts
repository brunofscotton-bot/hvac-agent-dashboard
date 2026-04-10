import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/terms", "/privacy", "/quote", "/approve-quote", "/review"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Auth is managed client-side via localStorage (not accessible in middleware).
  // The middleware checks for the token cookie as a secondary guard.
  // The primary auth check remains in the AuthProvider context.
  const token = request.cookies.get("hvac_token")?.value;

  const isPublicPath = pathname === "/" || PUBLIC_PATHS.some((p) => p !== "/" && pathname.startsWith(p));

  if (!token && !isPublicPath) {
    // No token and trying to access protected page — redirect to login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
