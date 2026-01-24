/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildParams } from "@/utills/paramsBuilder";
import { TQuery } from "../category";
import { config } from "@/config";
import { getValidToken } from "../auth/validToken";
import { revalidatePath, revalidateTag } from "next/cache";

export const getAllBooks = async (query?: TQuery) => {
  // const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/product/with-categories?${buildParams(query)}`,
      {
        method: "GET",
        // headers: {
        //   Authorization: token,
        // },
        next: {
          tags: ["Product"],
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

export const getASingleBook = async (id: string) => {
  try {
    const res = await fetch(`${config.next_public_base_url}/product/${id}`, {
      method: "GET",
      // headers: {
      //   Authorization: token,
      // },
      next: {
        tags: ["Product"],
        revalidate: 30,
      },
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const createBook = async (data: FormData) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/product`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: data,
    });
    const result = await res.json();
    revalidateTag("Product", "default");
    revalidatePath("/dashboard/books");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const updateBook = async (data: FormData, id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/product/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: token,
      },
      body: data,
    });
    const result = await res.json();
    revalidateTag("Product", "default");
    revalidatePath("/dashboard/books");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteBooks = async (id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
    const result = await res.json();
    revalidateTag("Product", "default");
    revalidatePath("/dashboard/books");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
