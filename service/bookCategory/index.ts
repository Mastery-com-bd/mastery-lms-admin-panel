/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TCreateCategory } from "@/components/dashboard/category/create-category";
import { getValidToken } from "../auth/validToken";
import { config } from "@/config";
import { revalidateTag } from "next/cache";
import { buildParams } from "@/utills/paramsBuilder";
import { TQuery } from "../category";

export const getAllBookCategories = async (query?: TQuery) => {
  // const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/product-category?${buildParams(query)}`,
      {
        method: "GET",
        // headers: {
        //   Authorization: token,
        // },
        next: {
          tags: ["Product-category"],
        },
      },
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const createBookCategory = async (data: TCreateCategory) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/product-category`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidateTag("Product-category", "default");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
