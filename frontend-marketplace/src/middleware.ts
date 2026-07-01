import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register"];

const adminRoutes = ["/admin"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("marketplace_token")?.value;
  const pathname = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // CUSTOMER: puede acceder a "/" y "/products/[id]" sin autenticación
  if (!token && !isPublicRoute && pathname !== "/" && !pathname.startsWith("/products")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ADMIN: requiere token para acceder a "/admin"
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
