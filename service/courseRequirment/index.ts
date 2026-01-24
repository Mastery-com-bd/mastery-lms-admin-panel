/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { TQuery } from "../category";
import { buildParams } from "@/utills/paramsBuilder";
import { TCreateCourseLearning } from "../courseLearning";
import { getValidToken } from "../auth/validToken";
import { revalidatePath, revalidateTag } from "next/cache";

export const getAllCourseRequirment = async (query?: TQuery) => {
  try {
    const res = await fetch(
      `${config.next_public_base_url}/course-requirement/course-requirement-with-courses?${buildParams(query)}`,
      {
        method: "GET",

        next: {
          tags: ["Course-requirment"],
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

export const getASingleCourseRequirment = async (id: string) => {
  try {
    const res = await fetch(
      `${config.next_public_base_url}/course-requirement/${id}`,
      {
        method: "GET",

        next: {
          tags: ["Course-requirment"],
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
    revalidatePath("/dashboard/course-requirment");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const updateCourseRequirment = async (
  data: TCreateCourseLearning,
  id: string,
) => {
  console.log(data);
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/course-requirement/${id}`,
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
    revalidateTag("Course-requirment", "default");
    revalidatePath("/dashboard/course-requirment");
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
    revalidatePath("/dashboard/course-requirment");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
