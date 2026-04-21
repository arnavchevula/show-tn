import type { Config } from "@netlify/functions";
import { $fetch } from "ofetch";

export default async (req: Request) => {
  let next_run;
  try {
    const body = await req.json();
    next_run = body.next_run;
  } catch {
    next_run = "manual invocation";
  }

  console.log("Scheduled function triggered. Next run:", next_run);

  const baseUrl = process.env.URL || "http://localhost:3000";

  try {
    const response = await $fetch(`${baseUrl}/api/tunnel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NUXT_TASK_SECRET}`,
      },
    });
    if (!response.shows) {
      throw new Error("Task failed", { cause: response });
    }
    console.log("Task completed:", response.shows.length, "shows scraped");
  } catch (error) {
    console.error("Task failed:", {
      cause: error,
    });
  }
};

export const config: Config = {
  schedule: "@daily",
};
