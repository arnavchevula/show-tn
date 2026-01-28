import type { Config } from "@netlify/functions";
import { $fetch } from "ofetch";

export default async (req: Request) => {
  // Safely parse JSON body (may be empty when testing locally)
  let next_run;
  try {
    const body = await req.json();
    next_run = body.next_run;
  } catch {
    next_run = "manual invocation";
  }

  console.log("Scheduled function triggered. Next run:", next_run);

  // Use localhost for local dev, or the Netlify URL in production
  const baseUrl = process.env.URL || "http://localhost:3000";

  try {
    // Call your Nuxt API endpoint
    const response = await $fetch(`${baseUrl}/api/california-clipper`, {
      method: "POST",
      body: {
        secret: process.env.NUXT_TASK_SECRET,
      },
    });
    // The API returns { shows } on success, check for shows array
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

// Run every hour
export const config: Config = {
  schedule: "@daily",
};
