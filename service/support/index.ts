/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { buildParams } from "@/utills/paramsBuilder";
import { revalidateTag } from "next/cache";
import { getValidToken } from "../auth/validToken";
import { TQuery } from "../category";
import { cache } from "react";

export const getAllSupportRequests = cache(async (query?: TQuery) => {
    try {
        const token = await getValidToken();
        if (!token) {
            throw new Error("you are not authorized");
        }
        const res = await fetch(
            `${config.next_public_base_url}/support?${buildParams(query)}`,
            {
                method: "GET",
                headers: {
                    Authorization: token,
                },
                next: {
                    tags: ["Support"],
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

export const getSupportRequestById = async (id: string) => {
    try {
        const token = await getValidToken();
        if (!token) {
            throw new Error("you are not authorized");
        }
        const res = await fetch(`${config.next_public_base_url}/support/${id}`, {
            method: "GET",
            headers: {
                Authorization: token,
            },
            next: {
                tags: [`Support-${id}`],
            },
        });
        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

export const updateSupportRequest = async (id: string, data: any) => {
    try {
        const token = await getValidToken();
        if (!token) {
            throw new Error("you are not authorized");
        }
        const res = await fetch(`${config.next_public_base_url}/support/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        revalidateTag("Support", `Support-${id}`);
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

export const deleteSupportRequest = async (id: string) => {
    try {
        const token = await getValidToken();
        if (!token) {
            throw new Error("you are not authorized");
        }
        const res = await fetch(`${config.next_public_base_url}/support/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: token,
            },
        });
        const result = await res.json();
        revalidateTag("Support", "default");
        return result;
    } catch (error: any) {
        return Error(error);
    }
};
