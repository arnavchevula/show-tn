import { uploadImage, getImage } from "./utils/image"

export default defineEventHandler(async(event) => {
    const formData = await readMultipartFormData(event);
    if (!formData) {
        throw createError({ statusCode: 400, statusMessage: 'No image data found' });
      }
    const fileField = formData.find(f => f.name === 'file');
    try {
        const image = await uploadImage(fileField);
        const imageUrl = await getImage(image?.path)
        return {
            imageUrl
        }
    }
    catch (error) {
        return {
            content: null,
            status: `error`,
            message: error instanceof Error ? error.message : 'Unknown error'
        }
    }
})
