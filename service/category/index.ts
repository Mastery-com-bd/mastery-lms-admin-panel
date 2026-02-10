/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { buildParams } from "@/utills/paramsBuilder";
import { revalidatePath, revalidateTag } from "next/cache";
import { getValidToken } from "../auth/validToken";
import { TCreateCategory } from "@/components/dashboard/category/all/CreateCategory";
// import { fetchToken } from "../auth/validToken";

export type TQuery = {
  [key: string]: string | string[] | number | undefined;
};

export const createCategory = async (data: TCreateCategory) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/category`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidateTag("Category", "default");
    revalidatePath("/dashboard/categories");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const res = await fetch(`${config.next_public_base_url}/category/${id}`, {
      method: "GET",
      // headers: {
      //   Authorization: token,
      // },
      next: {
        tags: ["SingleCategory"],
        revalidate: 30,
      },
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getAllCategories = async (query?: TQuery) => {

  try {
    const res = await fetch(
      `${config.next_public_base_url}/category?${buildParams(query)}`,
      {
        method: "GET",
        // headers: {
        //   Authorization: token,
        // },
        next: {
          tags: ["Category"],
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


export const updateCategory = async (data: TCreateCategory, id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/category/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidateTag("Category", "default");
    revalidatePath("/dashboard/categories");
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
    revalidatePath("/dashboard/categories");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
