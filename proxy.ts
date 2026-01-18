import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  /* const tokenCookie = req.cookies.get("accessToken"); // browser cookie name
  const token = tokenCookie?.value;
  const { pathname } = req.nextUrl;

  console.log("Request Path:", pathname);
  console.log("Authentication Token:", token);

  // Public routes (no auth needed)
  const publicRoutes = ["/auth/login", "/auth/signup"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
 */
  return NextResponse.next();
}

// Protect only specific routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
