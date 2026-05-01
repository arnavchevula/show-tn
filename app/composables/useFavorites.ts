export const useFavorites = () => {
  const favorites = useState<string[]>('favorites', () => [])

  const load = () => {
    favorites.value = JSON.parse(localStorage.getItem('favorites') ?? '[]')
  }

  const toggleFavorite = (id: string) => {
    if (favorites.value.includes(id)) {
      favorites.value = favorites.value.filter(f => f !== id)
    } else {
      favorites.value = [...favorites.value, id]
    }
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  const isFavorited = (id: string) => favorites.value.includes(id)

  return { favorites, toggleFavorite, isFavorited, load }
}
