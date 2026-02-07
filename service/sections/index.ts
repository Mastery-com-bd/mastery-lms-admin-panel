import { config } from "@/config";
import { buildParams } from "@/utills/paramsBuilder";
import { cache } from "react";
import { TQuery } from "../category";
import { getValidToken } from "../auth/validToken";



export const getAllSections = cache(async (query?: TQuery) => {
    try {
        const res = await fetch(
            `${config.next_public_base_url}/section?${buildParams(query)}`,
            {
                method: "GET",
                next: {
                    tags: ["Section"],
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

export const deleteSection = async ({ sectionId }: { sectionId: string }) => {
    const token = await getValidToken();
    try {
        const res = await fetch(
            `${config.next_public_base_url}/section/${sectionId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
            }
        );
        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};


export const createSection = async ({ payload }: {
    payload: {
        courseId: string;
        title: string;
        description: string;
        order?: number | undefined;
    }
}) => {
    const token = await getValidToken();
    try {
        const res = await fetch(
            `${config.next_public_base_url}/section`,
            {
                method: "POST",
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );
        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

export const updateSection = async ({ payload, sectionId }: {
    payload: {
        courseId: string;
        title: string;
        description: string;
        order?: number | undefined;
    };
    sectionId: string;
}) => {
    const token = await getValidToken();
    try {
        const res = await fetch(
            `${config.next_public_base_url}/section/${sectionId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );
        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};
