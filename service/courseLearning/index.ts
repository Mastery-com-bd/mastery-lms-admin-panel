/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { TQuery } from "../category";
import { buildParams } from "@/utills/paramsBuilder";
import { getValidToken } from "../auth/validToken";
import { revalidateTag } from "next/cache";

export const getAllCourseLearning = async (query?: TQuery) => {
  try {
    const res = await fetch(
      `${config.next_public_base_url}/course-learning/courselearning-with-courses?${buildParams(query)}`,
      {
        method: "GET",

        next: {
          tags: ["Course-learning"],
        },
      },
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export type TCreateCourseLearning = {
  courseId: string;
  content: string;
  order: number;
};

export const createCourseLearning = async (data: TCreateCourseLearning) => {
  console.log(data);
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/course-learning`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidateTag("Course-learning", "default");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteCourseLearning = async (id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/course-learning/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      },
    );
    const result = await res.json();
    revalidateTag("Course-learning", "default");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
