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
