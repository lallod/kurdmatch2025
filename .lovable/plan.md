

# Bug Fixes and Production Hardening Plan

## Overview

This plan addresses the remaining bugs and issues identified in the System Audit Report. These are practical fixes that make the app production-ready.

---

## Fix 1: Register Service Worker on App Startup

**Problem**: The service worker file exists at `public/service-worker.js` but is never registered on app load. Push notifications only work if the user manually enables them in settings (which triggers registration), but the SW should be pre-registered so push events are always handled.

**Change**: Add service worker registration in `src/main.tsx` after the app renders:
```
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

**File**: `src/main.tsx`

---

## Fix 2: Voice Recorder Safari Compatibility

**Problem**: The voice recorder hardcodes `audio/webm` as the MIME type, which Safari does not support. Recording silently fails on iOS/macOS Safari.

**Change**: In `src/hooks/useVoiceRecorder.ts`, detect the best supported MIME type before creating the MediaRecorder:

```
const mimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg'];
const mimeType = mimeTypes.find(t => MediaRecorder.isTypeSupported(t)) || '';
```

Use the detected type for both the MediaRecorder options and the resulting Blob. If no type is supported, fall back to the browser default (no mimeType option).

**File**: `src/hooks/useVoiceRecorder.ts`

---

## Fix 3: GIF Picker -- Wire Up Giphy API via Edge Function

**Problem**: The GIF picker shows 6 hardcoded sample GIFs. Search does nothing.

**Approach**: Create a proxy edge function `search-gifs` that calls the Giphy API server-side (keeps the API key secret). The frontend GifPicker calls this function instead of Giphy directly.

**Files**:
- Create `supabase/functions/search-gifs/index.ts` -- accepts `?q=term` query param, calls Giphy search (or trending if no query), returns array of GIF URLs
- Update `supabase/config.toml` -- add the new function
- Rewrite `src/components/chat/GifPicker.tsx` -- call the edge function, add debounced search, show loading skeletons
- A `GIPHY_API_KEY` secret will need to be configured (the user will be prompted)

---

## Fix 4: Add Error Boundaries Around Critical Pages

**Problem**: Only the registration form and the top-level App have error boundaries. If Messages, Swipe, or Profile crash, the entire app goes blank.

**Change**: Wrap the route components for Messages, Swipe, and Profile in the existing `ErrorBoundary` component inside `src/components/app/AppRoutes.tsx` (or at the page level).

**File**: `src/components/app/AppRoutes.tsx` (or individual page wrappers)

---

## Summary of Files

| Action | File |
|--------|------|
| Edit | `src/main.tsx` -- service worker registration |
| Edit | `src/hooks/useVoiceRecorder.ts` -- Safari MIME type detection |
| Create | `supabase/functions/search-gifs/index.ts` -- Giphy proxy |
| Edit | `supabase/config.toml` -- register new function |
| Edit | `src/components/chat/GifPicker.tsx` -- live GIF search |
| Edit | `src/components/app/AppRoutes.tsx` -- error boundary wrapping |

Total: 4 edits, 1 new file, 1 config update.

