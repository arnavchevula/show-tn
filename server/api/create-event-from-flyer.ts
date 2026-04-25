import { processImage } from "./utils/gemini";

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No form data found' });
  }

  const fileField = formData.find(f => f.name === 'file');
  if (!fileField) {
    throw createError({ statusCode: 400, statusMessage: 'No file field in form data' });
  } 

  try {
    const parsed = await processImage(fileField.data, fileField.type ?? 'image/jpeg');
    return {parsed}
  } catch (error) {
    return {
      content: null,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});
