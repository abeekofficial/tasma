import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/settings") || pathname.startsWith("/projects") || pathname.startsWith("/editor");
  const isApiRoute = pathname.startsWith("/api");
  
  if (isApiRoute) return NextResponse.next();

  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
