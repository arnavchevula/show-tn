# Bulk Flyer Upload — Implementation Plan

## Overview

Support uploading multiple flyers at once. Each flyer is parsed by Gemini individually, then the user reviews/edits all parsed events in a list before submitting them all.

---

## Steps

1. **Add `BatchEvent` type** — fields mirror the single-event form state, plus a `status` field (`pending | submitting | submitted | error`) and `error` string for per-row feedback.

2. **Extract a shared `fetchParsed(file)` helper** — pulls the fetch logic out of `processImage` so both the single and batch flows can call it without duplication.

3. **Refactor `processImage` → `processSingleImage(file)`** — same behavior as today, just accepts the file as a parameter and uses `fetchParsed` internally.

4. **Add `processBatch(files[])`** — calls `fetchParsed` for all files in parallel (`Promise.all`), maps results into `BatchEvent` objects including venue matching, populates a `batchEvents` ref.

5. **Update `watch(files)`** — if 1 file, run `processSingleImage`; if multiple, run `processBatch`.

6. **Add `submitBatch()`** — loops through `batchEvents` sequentially, submits each to `/api/create-event` with `forceSubmit: true` (skip duplicate check), updates per-row status as it goes.

7. **Update `resetForm()`** — also clears `batchEvents`.

8. **Template: add `multiple` to `UFileUpload`**

9. **Template: batch review UI** — shown when `batchEvents.length > 0` instead of the single form. A card per event with editable fields, per-row status badge, remove button, and a "Submit All" / "Cancel" at the bottom.

---

## Key decisions

- **`forceSubmit: true` for batch** — interrupting mid-batch for each duplicate would be bad UX; duplicates get caught at admin review instead.
- **Parallel Gemini, sequential inserts** — parse all flyers at once to minimize wait, but insert one at a time to track per-row status accurately.
- **Single file flow unchanged** — uploading one file behaves exactly as it does today.
