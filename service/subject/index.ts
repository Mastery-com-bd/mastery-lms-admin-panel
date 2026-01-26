/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { TQuery } from "../category";
import { buildParams } from "@/utills/paramsBuilder";
import { getValidToken } from "../auth/validToken";
import { revalidatePath, revalidateTag } from "next/cache";
import { TSubjectForm } from "@/components/dashboard/subject/allSubjects/CreateSubject";

export const getAllSubject = async (query?: TQuery) => {
  // const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/subject?${buildParams(query)}`,
      {
        method: "GET",
        // headers: {
        //   Authorization: token,
        // },
        next: {
          tags: ["Subject"],
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

export const getASingleSubject = async (id: string) => {
  try {
    const res = await fetch(`${config.next_public_base_url}/subject/${id}`, {
      method: "GET",

      next: {
        tags: ["Subject"],
        revalidate: 30,
      },
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const createSubject = async (data: TSubjectForm) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/subject`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidateTag("Subject", "default");
    revalidatePath("/dashboard/subjects");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const updateSubject = async (
  data: Partial<TSubjectForm>,
  id: string,
) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/subject/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidateTag("Subject", "default");
    revalidatePath("/dashboard/subjects");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteSubject = async (id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/subject/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
    const result = await res.json();
    revalidateTag("Subject", "default");
    revalidatePath("/dashboard/subjects");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
