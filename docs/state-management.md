# State Management: useState vs Pinia

## How `useAggregatedShows` Works

The composable uses Nuxt's `useState("all-shows", ...)` to store fetched events. The state is global — any component calling `useAggregatedShows()` shares the same reactive `allShows` array. The computed properties (`venues`, `neighborhoods`, `genreTags`, etc.) derive from that shared state.

However, the **fetch itself (`fetchAllVenues`) is not automatic**. It must be explicitly called. This means:

- Navigate to `/chicago` first → `fetchAllVenues` is called → `allShows` is populated → `/create-event` dropdown works
- Navigate **directly** to `/create-event` → `allShows` is still `[]` → dropdown is empty

The fix is to call `fetchAllVenues()` in any page that needs the data before it renders.

## Would Pinia Solve This?

Yes, and it's a cleaner fit for this pattern. With Pinia you'd define the store once with a fetch action and call it in a plugin or `app.vue` so state is initialized at app startup regardless of entry point.

| | `useState` + composable | Pinia |
|---|---|---|
| State sharing | Global via key `"all-shows"` | Global via store ID |
| DevTools | No | Yes (Vue DevTools) |
| Auto-fetch on startup | Manual | Can wire to a plugin/`app.vue` |
| SSR | Built-in Nuxt support | Also supported |
| Boilerplate | Less | A bit more |

The current `useState` approach is essentially a lightweight manual store — it works fine. Pinia would give better DevTools integration and a more conventional structure, but won't meaningfully change runtime behavior. The real requirement either way is ensuring `fetchAllVenues` is called before any page that needs the data.
