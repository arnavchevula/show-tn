import { DBConnection } from "~~/server/db/db"
import { randomUUID } from 'crypto'
const supabaseStorageBucket = useRuntimeConfig().supabaseStorageBucket;

export async function uploadImage(file: any) {
    const db = new DBConnection().connect();
    const ext = file.filename?.split('.').pop() ?? 'jpg'
    const safeName = `${randomUUID()}.${ext}`
    const { data, error } = await db.storage.from(supabaseStorageBucket).upload(safeName, file.data, {contentType: file.type})
    if (error) {
      // Handle error
      console.error("error", error)
    } else {
      // Handle success
      return data;
    }
  }

  export async function getImage(path: string) {
    const db = new DBConnection().connect();
    const { data } = await db.storage.from(supabaseStorageBucket).getPublicUrl(path)
    return data.publicUrl;
  }