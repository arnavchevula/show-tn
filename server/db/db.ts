
import { createClient } from '@supabase/supabase-js'
const config = useRuntimeConfig()

export class DBConnection {
    private supabaseUrl = 'https://zylpuvjzvdyzfedpqqqh.supabase.co'
    private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bHB1dmp6dmR5emZlZHBxcXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODc3OTgsImV4cCI6MjA3ODQ2Mzc5OH0.C0vSNceaiUKdASequxfd4olYkXrIWx0FOTnURjUUDIM'

    

    connect() {
        const supabase = createClient(this.supabaseUrl, this.supabaseKey)
        return supabase;
    }

}