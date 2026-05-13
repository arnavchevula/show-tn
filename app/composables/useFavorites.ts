import { useAuth, useSupabase } from '~/composables/useAuth'
export const useFavorites = () => {
  const { user } = useAuth()
  const favorites = useState<string[]>('favorites', () => [])
  const { public: { userFavoritesDb } } = useRuntimeConfig();
  const supabase = useSupabase()
  
  const getLocalFavorites = (): string[] => {
    return JSON.parse(localStorage.getItem('favorites') || '[]')
  }

  async function loadFavorites() {
    if (user.value) {
      const { data } = await supabase.from(userFavoritesDb).select('event_id').eq('user_id', user.value.id)
      favorites.value = data?.map((r: { event_id: string }) => r.event_id) ?? []
    } else {
      favorites.value = getLocalFavorites()
    }
  }

  const toggleFavorite = async (id: string) => {
    if (favorites.value.includes(id)) {
      favorites.value = favorites.value.filter(f => f !== id)
      if (user.value) {
        await supabase.from(userFavoritesDb).delete().eq('user_id', user.value.id).eq('event_id', id)
      } else {
        localStorage.setItem('favorites', JSON.stringify(favorites.value))
      }
    } else {
      favorites.value = [...favorites.value, id]
      if (user.value) {
        await supabase.from(userFavoritesDb).insert({ user_id: user.value.id, event_id: id })
      } else {
        localStorage.setItem('favorites', JSON.stringify(favorites.value))
      }
    }
  }

  const isFavorited = (id: string) => favorites.value.includes(id)

  async function mergeAndMigrate() {
    const local = getLocalFavorites()
    if (local.length) {
      await supabase.from(userFavoritesDb).upsert(
        local.map((eventId: string) => ({ user_id: user.value?.id, event_id: eventId }))
      )
      localStorage.removeItem('favorites')
    }
    await loadFavorites()
  }

  return { favorites, toggleFavorite, isFavorited, loadFavorites, mergeAndMigrate }
}
