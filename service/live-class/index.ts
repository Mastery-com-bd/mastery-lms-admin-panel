"use server"


import { config } from "@/config";
import { buildParams } from "@/utills/paramsBuilder";
import { cache } from "react";
import { TQuery } from "../category";
import { getValidToken } from "../auth/validToken";
import { revalidatePath, revalidateTag } from "next/cache";

export const getAllLiveClasses = cache(async (query?: TQuery) => {
  try {
    const token = await getValidToken();
    const res = await fetch(
      `${config.next_public_base_url}/live-class?${buildParams(query)}`,
      {
        method: "GET",
        next: {
          tags: ["LiveClass"],
          revalidate: 30,
        },
        headers: {
          Authorization: token,
        },
      },
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
});

export const updateLiveClass = async (
  id: string,
  data: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    meetingUrl: string;
    meetingId: string;
    meetingPassword: string;
  },
) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/live-class/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidateTag("LiveClass", "default");
    revalidatePath("/dashboard/live-class");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const createLiveClass = async (data: {
  courseId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string | undefined;

  meetingUrl: string | undefined;
  meetingId: string | undefined;
  meetingPassword: string | undefined;
}) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/live-class`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidateTag("LiveClass", "default");
    revalidatePath("/dashboard/live-class");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getLiveClassById = cache(async (id: string) => {
  try {
    const token = await getValidToken();
    const res = await fetch(
      `${config.next_public_base_url}/live-class/${id}`,
      {
        method: "GET",
        next: {
          tags: ["LiveClass"],
          revalidate: 30,
        },
        headers: {
          Authorization: token,
        },
      },
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
});