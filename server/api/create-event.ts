import { DBConnection } from "../db/db";
export default defineEventHandler(async(event) => {
    const body = await readBody(event);
    const {title, parsedDate, venue, doorsTime, url, source } = body.state;
    console.log(title, parsedDate, venue, doorsTime, url, source)
    try {
        const db = new DBConnection().connect();
        const eventsTableName = process.env.DB_Name || 'events-qa';
        const { data } = await db
            .from(eventsTableName)
            .select('id, title')
            .eq('venue', venue)
            .eq('date', parsedDate)
        if (data && data.length > 0) {
            return data
        } 
        else {
            const tableName = process.env.PENDING_DB_NAME || 'pending-events-qa';
            const {error} = await db.from(tableName).insert({
                'title':title,
                'parsedDate':parsedDate,
                'venue':venue,
                'doorsTime':doorsTime,
                'url':url,
                'source':source,
            });
            if (error){
                console.log(error)
            }
        }
        return {
            message: 'Sucess! Your event has been created'
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
