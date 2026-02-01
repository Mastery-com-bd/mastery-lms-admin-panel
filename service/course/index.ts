/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { getValidToken } from "../auth/validToken";
import { revalidatePath, revalidateTag } from "next/cache";
import { buildParams } from "@/utills/paramsBuilder";
import { TQuery } from "../category";
import { cache } from "react";

export const createCourse = async (data: FormData) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/course`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: data,
    });
    const result = await res.json();
    revalidateTag("Course", "default");
    revalidatePath("/dashboard/courses");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getAllCourseElement = async (query?: TQuery) => {
  // const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/course/course-with-subject-instructor-category?${buildParams(query)}`,
      {
        method: "GET",
        // headers: {
        //   Authorization: token,
        // },
        next: {
          tags: ["Category", "Course", "Subject", "Instructor"],
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

export const getAllCourses = cache(async (query?: TQuery) => {
  try {
    const res = await fetch(
      `${config.next_public_base_url}/course?${buildParams(query)}`,
      {
        method: "GET",
        next: {
          tags: ["Course"],
          revalidate: 30,
        },
      },
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
});
