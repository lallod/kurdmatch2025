

# Fix Slow Comment Section Loading

## Problem
When tapping the comment icon, there's a long loading delay before the comment input appears because:

1. `loading` starts as `true`, showing a full-screen spinner that blocks the entire comment section (including the input box)
2. `getComments` makes 2-3 sequential network calls: `auth.getUser()`, then the comments query, then a separate `comment_likes` query
3. Every realtime event (INSERT/UPDATE/DELETE) sets `loading=true` again, causing the spinner to flash repeatedly

## Fixes

### 1. Show comment input immediately (`CommentSection.tsx`)
- Change `loading` initial state from `true` to `false`
- Move the loading spinner below the comment input instead of replacing the entire section
- This way the user sees the text input instantly and can start typing while comments load in the background

### 2. Skip re-showing spinner on subsequent loads (`CommentSection.tsx`)
- Only show the loading spinner on the very first load (use a separate `initialLoading` flag)
- On realtime updates and refreshes, load silently in the background without any spinner

### 3. Parallelize API calls (`src/api/comments.ts`)
- Run `supabase.auth.getUser()` and the comments query in parallel using `Promise.all` instead of sequentially
- This cuts the loading time roughly in half

### 4. Remove redundant realtime refetch on own comment (`CommentSection.tsx`)
- After `createComment` succeeds, `loadComments()` is called AND the realtime INSERT listener also triggers `loadComments()` -- that's a double fetch
- After submitting a comment, skip the manual `loadComments()` call since the realtime subscription will handle it automatically

## Files Changed

| File | Change |
|------|--------|
| `src/components/discovery/CommentSection.tsx` | Show input immediately, spinner only below input on first load, remove double-fetch after submit |
| `src/api/comments.ts` | Parallelize `getUser` + comments query with `Promise.all` |

