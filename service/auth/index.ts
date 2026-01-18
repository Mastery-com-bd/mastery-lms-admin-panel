/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { config } from "@/config";

type TLogin = {
  email: string;
  password: string;
};

export const login = async (data: TLogin) => {
  try {
    const res = await fetch(`${config.next_public_base_url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (result?.success) {
      const cookieStore = await cookies();

      cookieStore.set("refreshToken", result.data.refreshToken, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });

      cookieStore.set("accessToken", result.data.accessToken, {
        maxAge: 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });
    }
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getCurrentUser = async () => {
  const refreshToken = (await cookies()).get("refreshToken")?.value;
  let decodedData = null;
  if (refreshToken) {
    decodedData = await jwtDecode(refreshToken);
    return decodedData;
  } else {
    return null;
  }
};

export const getNewToken = async () => {
  try {
    const res = await fetch(
      `${config.next_public_base_url}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("refreshToken")!.value,
        },
      },
    );
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const logout = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    (await cookies()).delete("refreshToken");
    (await cookies()).delete("accessToken");
    return { success: true, message: "Logout successful" };
  } catch (error: any) {
    // Still delete cookie even if backend call fails
    (await cookies()).delete("authToken");
    console.error("Logout error:", error);
    return { success: true, message: "Logged out" };
  }
};
