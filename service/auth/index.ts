"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

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
