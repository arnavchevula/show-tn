
import { createClient } from '@supabase/supabase-js'
const config = useRuntimeConfig()

export class DBConnection {

    connect() {
        const supabase = createClient(process.env.SUPABASE_URL || 'https://zylpuvjzvdyzfedpqqqh.supabase.co', process.env.SUPABASE_KEY || '')
        return supabase;
    }

}