import { generateDescription } from "./utils/gemini";
import { DBConnection } from "../db/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'No event data found' });
  }
  try {
    const parsed = await generateDescription(body);
    if (parsed && body.id) {
      const db = new DBConnection().connect();
      const tableName = process.env.DB_NAME || 'events-qa';
      await db.from(tableName).update({ description: parsed }).eq('id', body.id);
    }
    return { parsed };
  } catch (error) {
    return {
      content: null,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});
