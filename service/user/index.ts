/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildParams } from "@/utills/paramsBuilder";
import { TQuery } from "../category";
import { cookies } from "next/headers";
import { config } from "@/config";

export const getAllUsers = async (query?: TQuery) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) {
      throw new Error("you are not authorized");
    }
    const res = await fetch(
      `${config.next_public_base_url}/user?${buildParams(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
        next: {
          tags: ["Users"],
          revalidate: 30,
        },
      },
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
