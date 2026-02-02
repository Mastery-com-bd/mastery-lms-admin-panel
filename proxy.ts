import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getNewToken, logout } from "./service/auth";
import { isTokenExpired } from "./service/auth/validToken";

const authRoutes = ["/login"];

const rolebasedPrivateUser = {
  ADMIN: [/^\/$/, /^\/dashboard(\/.*)?$/],
};

type TRole = keyof typeof rolebasedPrivateUser;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let token = request.cookies.get("accessToken")?.value;

  // if token is missing or expired, call refresh API

  if (!token || (await isTokenExpired(token))) {
    try {
      const data = await getNewToken();
      token = data?.accessToken as string;
    } catch {
      token = "";
    }
  }

  const userInfo = await getCurrentUser();

  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      await logout();
      return NextResponse.next();
    } else {
      await logout();
      return NextResponse.redirect(
        new URL(`/login?redirectPath=${pathname}`, request.url),
      );
    }
  }
  const role = userInfo?.role as TRole;
  if (role && rolebasedPrivateUser[role]) {
    const allowedRoutes = rolebasedPrivateUser[role];
    const isAllowed = allowedRoutes.some((route) => {
      const match = pathname.match(route);
      return match !== null;
    });
    if (!isAllowed) {
      await logout();
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const response = NextResponse.next();
    if (token) {
      response.cookies.set("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    return response;
  } else {
    await logout();
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/(.*)"],
};
