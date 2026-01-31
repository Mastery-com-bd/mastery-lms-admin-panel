import { config } from "@/config";
import { buildParams } from "@/utills/paramsBuilder";
import { cache } from "react";
import { TQuery } from "../category";



export const getAllQuestions = cache(async (query?: TQuery) => {
    try {
        const res = await fetch(
            `${config.next_public_base_url}/quiz-question?${buildParams(query)}`,
            {
                method: "GET",
                next: {
                    tags: ["Question"],
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