/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "../auth/validToken";
import { config } from "@/config";
import { revalidatePath, revalidateTag } from "next/cache";
import { buildParams } from "@/utills/paramsBuilder";
import { TQuery } from "../category";
import { TCreateCategory } from "@/components/dashboard/category/all/CreateCategory";

export const getAllBookCategories = async (query?: TQuery) => {
  // const token = await getValidToken();
  try {
    const params = new URLSearchParams();
    if (query?.searchTerm) {
      params.append("searchTerm", query?.searchTerm.toString());
    }
    const res = await fetch(
      `${config.next_public_base_url}/product-category?${params}`,
      {
        method: "GET",
        // headers: {
        //   Authorization: token,
        // },
        next: {
          tags: ["Product-category"],
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
    revalidatePath("/dashboard/books/categories");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const updateBookCategory = async (data: TCreateCategory, id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/product-category/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await res.json();
    revalidateTag("Product-category", "default");
    revalidatePath("/dashboard/books/categories");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteBookCategory = async (id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/product-category/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      },
    );
    const result = await res.json();
    revalidateTag("Product-category", "default");
    revalidatePath("/dashboard/books/categories");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
