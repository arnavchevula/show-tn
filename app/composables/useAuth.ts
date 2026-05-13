import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

const getClient = () => {
    if (!client) {
        const { public: { supabaseUrl, supabaseApiKeyBrowser } } = useRuntimeConfig()
        client = createClient(supabaseUrl, supabaseApiKeyBrowser)
    }
    return client
}

export const useSupabase = () => getClient()

export const useAuth = () => {
    const supabase = getClient()
    const user = useState('auth-user', () => null)


    const init = () => {                                                        
        supabase.auth.getSession().then(({ data }) => {                           
          user.value = data.session?.user ?? null                                 
        })
        supabase.auth.onAuthStateChange((_event, session) => {                    
          user.value = session?.user ?? null                                      
        })
      }    

      const setSession = (session) => supabase.auth.setSession(session)           
   
      const signOut = () => supabase.auth.signOut()                               
                    
      const getAccessToken = async () => {
        const { data } = await supabase.auth.getSession()
        return data.session?.access_token ?? null                                 
      }
                                                                                  
      return { user, init, setSession, signOut, getAccessToken }
}