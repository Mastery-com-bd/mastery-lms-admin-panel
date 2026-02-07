"use server"

import { config } from "@/config";
import { buildParams } from "@/utills/paramsBuilder";
import { cache } from "react";
import { TQuery } from "../category";
import { getValidToken } from "../auth/validToken";
import { revalidatePath, revalidateTag } from "next/cache";



export const getAllQuizzes = cache(async (query?: TQuery) => {
    try {
        const res = await fetch(
            `${config.next_public_base_url}/quiz?${buildParams(query)}`,
            {
                method: "GET",
                next: {
                    tags: ["Quiz"],
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


export const createQuiz = async (payload: {
    lessonId: string;
    courseId: string;
    title: string;
    description: string;
    type: "LESSON" | "COURSE";
    passingScore: number;
    timeLimit: number;
}) => {

    const token = await getValidToken();
    try {
        const res = await fetch(`${config.next_public_base_url}/quiz`, {
            method: "POST",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const result = await res.json();
        revalidateTag("Quiz", "default");
        revalidatePath("/dashboard/quizzes");
        return result;
    } catch (error: any) {
        return Error(error);
    }
}


export const updateQuiz = async (quizId: string, payload: {
    lessonId: string;
    courseId: string;
    title: string;
    description: string;
    type: "LESSON" | "COURSE";
    passingScore: number;
    timeLimit: number | null;
}) => {

    const token = await getValidToken();
    try {
        const res = await fetch(`${config.next_public_base_url}/quiz/${quizId}`, {
            method: "PATCH",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const result = await res.json();
        revalidateTag("Quiz", "default");
        revalidatePath("/dashboard/quizzes");
        return result;
    } catch (error: any) {
        return Error(error);
    }
}

export const deleteQuiz = async (quizId: string) => {

    const token = await getValidToken();
    try {
        const res = await fetch(`${config.next_public_base_url}/quiz/${quizId}`, {
            method: "DELETE",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });
        const result = await res.json();
        revalidateTag("Quiz", "default");
        revalidatePath("/dashboard/quizzes");
        return result;
    } catch (error: any) {
        return Error(error);
    }
}