/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { TQuery } from "../category";
import { buildParams } from "@/utills/paramsBuilder";
import { getValidToken } from "../auth/validToken";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllCertificates = async (query?: TQuery) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) {
      throw new Error("you are not authorized");
    }
    const res = await fetch(
      `${config.next_public_base_url}/certificate?${buildParams(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
        next: {
          tags: ["Certificate"],
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

export const getASingleCertificate = async (id: string) => {
  try {
    const res = await fetch(
      `${config.next_public_base_url}/certificate/${id}`,
      {
        method: "GET",
        // headers: {
        //   Authorization: token,
        // },
        next: {
          tags: ["Certificate"],
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

export const createCertificate = async (data: FormData) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_url}/certificate`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: data,
    });
    const result = await res.json();
    revalidateTag("Certificate", "default");
    revalidatePath("/dashboard/certificates");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const VerifyCertificate = async (id: string) => {
  try {
    const res = await fetch(
      `${config.next_public_base_url}/certificate/verify/${id}`,
      {
        method: "GET",
        // headers: {
        //   Authorization: token,
        // },
        next: {
          tags: ["Certificate"],
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

export const deleteCertificate = async (id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${config.next_public_base_url}/certificate/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      },
    );
    const result = await res.json();
    revalidateTag("Certificate", "default");
    revalidatePath("/dashboard/certificates");
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
