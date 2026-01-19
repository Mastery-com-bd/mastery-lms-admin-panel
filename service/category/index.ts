/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { getValidToken } from "../auth/validToken";
import { buildParams } from "@/utills/paramsBuilder";
import { revalidateTag } from "next/cache";
type TQuery = {
  [key: string]: string | string[] | number | undefined;
};

export const getAllCategories = async (query?: TQuery) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/category?${buildParams(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
        next: {
          tags: ["Category"],
        },
      },
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteCategory = async (id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
    const result = await res.json();
    revalidateTag("Category", "default");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
