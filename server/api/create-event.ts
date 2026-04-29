import { DBConnection } from "../db/db";

export default defineEventHandler(async(event) => {
    const body = await readBody(event);
    const {title, parsedDate, venue, doorsTime, url, source, header,age, forceSubmit, honeypot, image } = body.state;
    if (honeypot) {
        return { message: 'Success' }
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0 || title.length > 200) {
        throw createError({ statusCode: 400, message: 'Invalid title' })
    }
    if (!parsedDate || !/^\d{4}-\d{2}-\d{2}$/.test(parsedDate)) {
        throw createError({ statusCode: 400, message: 'Invalid date' })
    }
    if (!venue || typeof venue !== 'string' || venue.trim().length === 0) {
        throw createError({ statusCode: 400, message: 'Invalid venue' })
    }
    if (doorsTime && !/^\d{2}:\d{2}$/.test(doorsTime)) {
        throw createError({ statusCode: 400, message: 'Invalid doors time' })
    }
    if (url && typeof url === 'string') {
        try { new URL(url) } catch { throw createError({ statusCode: 400, message: 'Invalid URL' }) }
    }

    try {
        const db = new DBConnection().connect();

        if (!forceSubmit) {
            const eventsTableName = process.env.DB_NAME || 'events-qa';
            const { data, error } = await db
                .from(eventsTableName)
                .select('id, title, parsedDate, venue, doorsTime, showTime, support, age, header')
                .eq('venue', venue)
                .eq('parsedDate', parsedDate)
            if (data && data.length > 0) {
                return data
            }
        }

        const tableName = process.env.PENDING_DB_NAME || 'pending-events-qa';
        const {data,error} = await db.from(tableName).insert({
            'title':title,
            'parsedDate':parsedDate,
            'venue':venue,
            'doorsTime':doorsTime,
            'url':url,
            'header':header,
            'age':age,
            'source':source,
            'image':image
        });
        if (error){
            console.log(error)
        }
        return {
            message: 'Sucess! Your event has been created', 
            event: data
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
