/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { TQuery } from "../category";
import { buildParams } from "@/utills/paramsBuilder";

export const getAllCourseRequirment = async (query?: TQuery) => {
  try {
    const res = await fetch(
      `${config.next_public_base_url}/course-requirement/course-requirement-with-courses?${buildParams(query)}`,
      {
        method: "GET",

        next: {
          tags: ["Course-requirment"],
        },
      },
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
