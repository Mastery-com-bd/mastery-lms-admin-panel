/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { TQuery } from "../category";
import { buildParams } from "@/utills/paramsBuilder";
import { TCreateCourseLearning } from "../courseLearning";
import { getValidToken } from "../auth/validToken";
import { revalidateTag } from "next/cache";

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

export const createCourseRequirment = async (data: TCreateCourseLearning) => {
  console.log(data);
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/course-requirement`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await res.json();
    revalidateTag("Course-requirment", "default");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteCourseRequirment = async (id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/course-requirement/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      },
    );
    const result = await res.json();
    revalidateTag("Course-requirment", "default");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
