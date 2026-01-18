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
      (await cookies()).set("refreshToken", result?.data?.refreshToken);
      (await cookies()).set("accessToken", result?.data?.accessToken);
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

export const logout = async () => {
  (await cookies()).delete("refreshToken");
  (await cookies()).delete("accessToken");
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
      }
    );
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
