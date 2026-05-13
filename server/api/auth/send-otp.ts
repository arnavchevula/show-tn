import { DBConnection } from "../../db/db";

export default defineEventHandler(async(event) => {
    try {
        const body = await readBody(event);
        const db = new DBConnection().connect();
        const digits = body.phone.replace(/\D/g, '')
        const phone = '+1' + (digits.startsWith('1') ? digits.slice(1) : digits)
        const { data, error } = await db.auth.signInWithOtp({ phone })
        return data;
    }
    catch (error) {
        return {
            content: null,
            status: `error`,
            message: error instanceof Error ? error.message : 'Unknown error'
        }
    }
});
