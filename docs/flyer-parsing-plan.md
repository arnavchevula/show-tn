# Flyer Parsing Feature Plan

Allow users to upload a show flyer image on the create-event form and have Claude automatically extract the event fields.

## Steps

**Step 1 — Install the SDK**
```
npm install @anthropic-ai/sdk
```

**Step 2 — Add your API key**
Add `ANTHROPIC_API_KEY=sk-ant-...` to your `.env` file.

**Step 3 — Create `server/api/parse-flyer.ts`**
- Read `imageBase64` and `mimeType` from the request body
- Initialize `new Anthropic()` and call `messages.create` with `claude-sonnet-4-6`
- Pass the image as a base64 content block alongside a text prompt asking for title, date (YYYY-MM-DD), venue, doorsTime (HH:MM), and url
- Cache the system prompt with `cache_control: { type: "ephemeral" }` since it never changes
- Parse Claude's response as JSON and return it (with missing fields as `null`)

**Step 4 — Update `app/pages/create-event/index.vue`**
- Add a `UInput type="file" accept="image/*"` above the manual fields
- Add `isParsing = ref(false)` for loading state
- On file change: read the file as base64 using `FileReader`, POST to `/api/parse-flyer`, then patch whichever `state` fields came back non-null
- Show a spinner or disable the input while `isParsing` is true

**Step 5 — Test it**
Upload a real show flyer and verify the fields populate correctly. Claude handles most flyer formats well but dates and times are the most likely to need cleanup — keep the fields editable.

---

## API Costs

**Model:** `claude-sonnet-4-6` — $3.00 / 1M input tokens, $15.00 / 1M output tokens.

### Tokens per request

| Part | Tokens | Notes |
|---|---|---|
| System prompt | ~150 | Cached after first use — subsequent reads cost ~0.1x |
| Image | ~800–1,500 | Depends on image dimensions; images cannot be cached |
| User prompt text | ~50 | Fixed, small |
| Output JSON | ~75 | 5 fields, nulls for missing ones |
| **Total** | **~1,100–1,800** | |

### Cost per request

A typical parse costs roughly **$0.004–$0.006**.

- Input: ~1,500 tokens × $0.000003 = ~$0.0045
- Output: ~75 tokens × $0.000015 = ~$0.001

### What caching saves

The system prompt (~150 tokens) is cached with `cache_control: { type: "ephemeral" }`. After the first request, those tokens read at ~0.1x price. The saving is small (~$0.00004/request) because the image dominates the token count — the main reason to cache is latency, not cost.

### Scale estimate

| Monthly uploads | Estimated cost |
|---|---|
| 100 | ~$0.50 |
| 1,000 | ~$5.00 |
| 10,000 | ~$50.00 |

Cost is effectively negligible at early-stage volume. Image size is the biggest variable — consider resizing uploads client-side to a max of 1024px on the longest side before sending to the API.


### Create Event flows

1. User navigates to /create-event, creates an event manually using the form
    - User submits, this hits api/create-event -> backend sees that forceSubmit isn't set -> does a lookup in events table based on venue & date to see if there are any matching events. if there are events that day at that specific venue, we return the events to the FE. 
        - If the user see's their event already listed, they click yes my event is listed and no further action is necessary. The form clears and users can click and navigate to the show details page. 
        - if the user does not see their event listed as a potential match, they click no my event is different and then this resubmits the data to /create-event but with forceSubmit=true which bypasses the event lookup and directly inserts into pending-events for admin review. 
2. User can submit a flyer instead
        - Flyer gets parsed immediately by watcher which is listening to files ref to see if there is one or multiple files. If there is one file, parsing happens immediately -> hits api/create-event-from-flyer passing file as multipart formdata, backend sends file to Gemini with prompt info, returns single event json. This json hydrates the form, which now users can edit as they please & submit using /create-event. When the user actually submits, the image is also submitted to the /upload-image api which creates a public url from the Supabase storage bucket to be inserted into pending-events (and subsequently copied over to events). This should follow the same pattern as above ^^ so if there's events on the same day at the venue that whole feedback loop should happen again? I haven't quite tested that whole flow. 
3. User submits multiple flyers
        - Now the 'parse x flyers' button appears if the file array is longer than 1, which kicks off sequentially hitting /create-event-from-flyer, returns the corresponding jsons from gemini and now this hydrates the alternate batch events form (a tabular, row based version of the form). users can also edit the info here as they please since all the state is being indexed properly but validation is essentially null because zod can only handle the single event form out of the box. I'd have to implement some more custom validation to ensure everythings kosher but since its only going into a pending-events table for manual admin review it should be fine. In the future if the admin review gets automated further then this would have to be looked at again. Again once the user clicks submit, api/create-event is called in a loop with api/upload-image called before with the corresponding flyer, attaches the imageUrl to the create-event payload and everything gets submitted to pending-events.
