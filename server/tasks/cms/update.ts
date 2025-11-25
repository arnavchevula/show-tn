import { DBConnection } from "~~/server/db/db";
export default defineTask({
    meta: {
      name: "cms:update",
      description: "Scrape venue websites in background",
    },
    async run({ payload, context }) {
            const db = new DBConnection().connect();
            const {data:deleteTable, error} = await db.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            if (error) {
                console.error("Error deleting events:", error);
            } else {
                console.log("Successfully deleted events:", deleteTable);
            }
            const { data } = await Promise.all([
                $fetch('/api/beat-kitchen'),
                $fetch('/api/subt'),
                $fetch('/api/lh-st'),
                $fetch('/api/jam-productions'),
                $fetch('/api/empty-bottle') 
            ])
        console.log("data", data);
      console.log("Scraping venues...");
      return { result: "Success" };
    },
  });