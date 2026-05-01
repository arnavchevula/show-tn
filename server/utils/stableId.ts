import { v5 as uuidv5 } from 'uuid';

const NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export function generateStableId(venue: string, parsedDate: Date | string, title: string): string {
    const dateStr = parsedDate instanceof Date
        ? parsedDate.toISOString().split('T')[0]
        : String(parsedDate).split('T')[0];
    const key = `${venue.toLowerCase().trim()}::${dateStr}::${title.toLowerCase().trim()}`;
    return uuidv5(key, NAMESPACE);
}
