import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/auth/login" || path === "/auth/signup" || path === "/";

  const token = request.cookies.get("accessToken")?.value || "";

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/product", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/auth/login", "/auth/signup"],
};
