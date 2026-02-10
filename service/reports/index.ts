"use server";

import { config } from "@/config";
import { getValidToken } from "../auth/validToken";
import { cache } from "react";

export const getAdminReport = cache(async () => {
  try {
    const token = await getValidToken();
    const res = await fetch(`${config.next_public_base_url}/reports/admin`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
      next: {
        tags: ["Reports"],
        revalidate: 300, // 5 minutes cache for reports
      },
    });
    const result = await res.json();
    return result;
  } catch (error: unknown) {
    return error instanceof Error ? error : new Error(String(error));
  }
});
