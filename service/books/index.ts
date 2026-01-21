/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildParams } from "@/utills/paramsBuilder";
import { TQuery } from "../category";
import { config } from "@/config";

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
        },
      },
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
