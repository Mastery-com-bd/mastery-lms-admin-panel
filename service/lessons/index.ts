"use server"


import { config } from "@/config";
import { buildParams } from "@/utills/paramsBuilder";
import { cache } from "react";
import { TQuery } from "../category";
import { getValidToken } from "../auth/validToken";
import { revalidatePath, revalidateTag } from "next/cache";

export const getAllLessons = cache(async (query?: TQuery) => {
    try {
        const res = await fetch(
            `${config.next_public_base_url}/lesson?${buildParams(query)}`,
            {
                method: "GET",
                next: {
                    tags: ["Lesson"],
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



export const deleteLesson = async (lessonId: string) => {
    const token = await getValidToken();
    try {
        const res = await fetch(`${config.next_public_base_url}/lesson/${lessonId}`, {
            method: "DELETE",
            headers: {
                Authorization: token,
            },
        });
        const result = await res.json();
        revalidateTag("Lesson", "default");
        revalidatePath("/dashboard/lessons");
        return result;
    } catch (error: any) {
        return Error(error);
    }
}
