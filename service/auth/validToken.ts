/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { getNewToken } from ".";

export const isTokenExpired = async (token: string): Promise<boolean> => {
  if (!token) return true;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (err: any) {
    console.error(err);
    return true;
  }
};

export const getValidToken = async (): Promise<string> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("accessToken");
  let token = tokenCookie?.value as string;
  console.log(token);
  if (!token || (await isTokenExpired(token))) {
    const data = await getNewToken();
    token = data?.accessToken as string;
    cookieStore.set("accessToken", token, {
      maxAge: 60 * 60 * 24 * 1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  }

  return token as string;
};
