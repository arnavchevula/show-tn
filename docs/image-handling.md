# Image Handling

## Current Approach (one-off)

Place the image in `/public` and store the filename (e.g. `rnbnites.jpeg`) in the `image` field in the DB. `NuxtImg` resolves bare filenames as relative to `/public` automatically.

Avoid this long-term — it bloats the repo.

## Recommended Approach: Supabase Storage

Since the app already uses Supabase, use Supabase Storage for all event images going forward.

1. Upload the image to a Supabase Storage bucket (via the dashboard or API)
2. Copy the generated public URL (e.g. `https://xxx.supabase.co/storage/v1/object/public/event-images/rnbnites.jpeg`)
3. Store that URL in the `image` field in the DB

No code changes needed — the existing `NuxtImg` in `chicago/[id].vue` already handles full URLs from scraped sources.

## Future: Artist/Venue Self-Upload

When ready to let artists or venues upload their own flyers through the app, add a file input to the create-event form and POST to the Supabase Storage API. Store the returned URL in `image` as above.
