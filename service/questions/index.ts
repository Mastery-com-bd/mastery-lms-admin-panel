"use server";


import { config } from "@/config";
import { buildParams } from "@/utills/paramsBuilder";
import { cache } from "react";
import { TQuery } from "../category";
import { getValidToken } from "../auth/validToken";
import { revalidatePath, revalidateTag } from "next/cache";



export const getAllQuestions = cache(async (query?: TQuery) => {
    try {
        const res = await fetch(
            `${config.next_public_base_url}/quiz-question?${buildParams(query)}`,
            {
                method: "GET",
                next: {
                    tags: ["getAllQuestions"],
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

export const createQuestion = async (payload: {
    quizId: string;
    question: string;
    questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
    explanation: string;
    points: number;
    order: number;
    options: string[];
    correctAnswer: number;
}) => {
    const token = await getValidToken();
    try {
        const res = await fetch(
            `${config.next_public_base_url}/quiz-question`,
            {
                method: "POST",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
                next: {
                    tags: ["createQuestion"],
                    revalidate: 30,
                },
            }
        );
        const result = await res.json();
        revalidateTag("Question", "default");
        revalidatePath("/dashboard/questions");
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

export const getQuestionDetailsById = cache(async (questionId: string) => {
    try {
        const res = await fetch(
            `${config.next_public_base_url}/quiz-question/${questionId}`,
            {
                method: "GET",
                next: {
                    tags: ["getQuestionDetailsById"],
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

export const updateQuestion = async ({ payload, questionId }: {
    payload: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
        points: number;
    }
    questionId: string;
}) => {
    const token = await getValidToken();
    try {
        const res = await fetch(
            `${config.next_public_base_url}/quiz-question/${questionId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            }
        );
        const result = await res.json();
        revalidateTag("getAllQuestions", "default");
        revalidatePath("/dashboard/questions");
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

export const deleteQuestionById = async ({ questionId }: { questionId: string }) => {
    const token = await getValidToken();
    try {
        const res = await fetch(
            `${config.next_public_base_url}/quiz-question/${questionId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        const result = await res.json();
        revalidateTag("getAllQuestions", "default");
        revalidatePath("/dashboard/questions");
        return result;
    } catch (error: any) {
        return Error(error);
    }
};