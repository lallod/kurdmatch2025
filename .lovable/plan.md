
# KurdMatch UX & Design Audit -- Final Polish Plan

## Overview
After reviewing every page, component, and navigation path in the app, here are the improvements organized by priority. The goal: make the app feel like a polished native mobile app (like Tinder/Hinge/Instagram) that users can understand within 30 seconds.

---

## 1. Navigation & Discoverability Issues

### Problem: Key features are buried or unreachable
Users have no way to reach **Matches**, **Liked Me**, **Events**, **Groups**, **Gifts**, **Saved Posts**, or **Nearby** from the bottom navigation. These pages exist as routes but are disconnected from the main flow.

### Fix: Add a "Hub" page accessible from the bottom nav
- Replace the **Views** tab (Eye icon, `/viewed-me`) in the bottom nav with a **Discover** hub tab
- The hub page becomes a single scrollable menu with quick-access cards to:
  - Viewed Me
  - Liked Me  
  - Matches
  - Events
  - Groups
  - Nearby Users
  - Saved Posts
  - Gifts & Dates
- Each card shows a count badge (e.g., "3 new likes", "2 events nearby")
- This consolidates 8 hidden pages into one discoverable entry point

### Alternative: Add a top navigation bar on the Discovery page
- Add horizontal scrollable chips below the For You / Following tabs: **Nearby**, **Events**, **Groups**, **Matches**
- Keep Viewed Me and Liked Me accessible from the profile page

---

## 2. Settings Page Design Mismatch

### Problem
`AccountSettings.tsx` uses `bg-white/10`, `text-white`, `text-purple-200`, hardcoded colors like `bg-[#53073c]` -- these are **not** using the Midnight Rose CSS variables. This creates visual inconsistency, especially in light mode.

### Fix
- Replace all `text-white` with `text-foreground`
- Replace `text-purple-200` with `text-muted-foreground`
- Replace `bg-white/10` and `bg-white/20` with `bg-card` and `border-border`
- Remove hardcoded `bg-[#53073c]`
- Replace `from-tinder-rose to-tinder-orange` gradients with `from-primary to-accent`

---

## 3. CreatePost -- Missing Image Upload

### Problem
The Create Post page only accepts a **URL** for media. Users cannot upload images from their phone camera/gallery, which is the most basic expectation for a social app.

### Fix
- Add a file input button (camera/gallery icon) that uploads images to Supabase storage
- Remove the manual URL input approach
- Add a photo preview with remove button
- Keep the URL fallback as an advanced option

---

## 4. Saved Posts Page is Empty Shell

### Problem
`SavedPosts.tsx` only shows a count. It does not display the actual saved posts -- users see "X saved posts" but cannot view them.

### Fix
- Query `saved_posts` table joined with `posts` to fetch full post data
- Render actual post cards (reuse `PostCard` component)
- Add unsave functionality

---

## 5. Swipe Card -- Fake Distance Data

### Problem
In `Swipe.tsx` line 61: `distance: Math.floor(Math.random() * 20) + 1` -- distance is randomly generated, not real. Users see fake distances.

### Fix
- Remove the random distance generation
- Either use the real location-based distance from `useNearbyUsers` or hide the distance badge when no real data is available

---

## 6. ViewedMe & LikedMe -- Inconsistent Design

### Problem
Both pages have a different design language from the rest of the app:
- They use `bg-gradient-to-b from-background to-surface-secondary` while other pages use plain `bg-background`
- The header layout is different (icon + title vs slim header)
- LikedMe still uses the old `useToast` hook instead of `sonner`

### Fix
- Standardize both pages to use the same slim header pattern (`sticky top-0 z-10 bg-background border-b border-border/30`)
- Switch LikedMe from `useToast` to `sonner` (already used elsewhere)
- Remove gradient backgrounds, use plain `bg-background`

---

## 7. Messages Page -- Too Complex, No Back Navigation

### Problem
`Messages.tsx` is **1157 lines** in a single file. The conversation list and chat view are in the same component, making it hard to maintain and causing potential performance issues. There is also no clear "back to conversations" flow on mobile.

### Fix (Code Quality)
- Extract `ConversationList` into its own component
- Extract `ChatView` into its own component  
- Keep `Messages.tsx` as the orchestrator (~100 lines)

### Fix (UX)
- On mobile: show conversation list OR chat view (not both)
- Add clear back arrow from chat view to conversation list
- This matches WhatsApp/Telegram behavior

---

## 8. Profile Page -- No Quick Access to Key Features

### Problem
MyProfile has stats (views, likes, matches) but they are not tappable. Users see "12 views" but cannot tap to see who viewed them.

### Fix
- Make the stats cards clickable, navigating to `/viewed-me`, `/liked-me`, `/matches` respectively
- Add subtle chevron or tap hint

---

## 9. Matches Page -- Redundant SwipeActions

### Problem
When clicking a match on the Matches page, a modal appears with full Swipe actions (Rewind, Pass, Like, Super Like, Boost). This makes no sense -- these people are **already matched**. The appropriate actions are "Message" and "View Profile".

### Fix
- Replace the SwipeActions modal with two simple buttons: **Message** and **View Profile**
- Use a bottom sheet instead of a centered modal

---

## 10. Missing Onboarding Tour

### Problem
New users land on the Discovery feed with no guidance. There are 5+ navigation tabs and dozens of features but zero explanation.

### Fix
- Add a first-time user welcome overlay with 3-4 slides:
  1. "Swipe to find matches" (point to Swipe tab)
  2. "Discover people in your feed" (point to Home tab)
  3. "Chat with your matches" (point to Messages tab)
  4. "Complete your profile to get more matches" (point to Profile tab)
- Store `has_seen_onboarding` in localStorage

---

## Implementation Priority

| Priority | Change | Impact | Effort |
|----------|--------|--------|--------|
| 1 | Fix navigation -- add hub/discover page | Critical | Medium |
| 2 | Fix Settings hardcoded colors | High | Low |
| 3 | Fix CreatePost image upload | High | Medium |
| 4 | Fix Saved Posts to show actual posts | High | Low |
| 5 | Remove fake distance in Swipe | Medium | Low |
| 6 | Standardize ViewedMe/LikedMe design | Medium | Low |
| 7 | Fix Matches page actions | Medium | Low |
| 8 | Make MyProfile stats clickable | Medium | Low |
| 9 | Split Messages.tsx into components | Medium | High |
| 10 | Add onboarding tour | Medium | Medium |

---

## Technical Details

### Files to create:
- `src/pages/DiscoverHub.tsx` -- new hub page for all features
- `src/components/onboarding/WelcomeTour.tsx` -- first-time user guide

### Files to modify:
- `src/components/BottomNavigation.tsx` -- replace Views tab with Discover hub
- `src/components/my-profile/AccountSettings.tsx` -- fix ~30 hardcoded color values
- `src/pages/CreatePost.tsx` -- add image upload to Supabase storage
- `src/pages/SavedPosts.tsx` -- fetch and render actual saved posts
- `src/pages/Swipe.tsx` -- remove random distance (line 61)
- `src/pages/ViewedMe.tsx` -- standardize header design
- `src/pages/LikedMe.tsx` -- standardize header + switch to sonner
- `src/pages/Matches.tsx` -- replace SwipeActions with Message/View buttons
- `src/pages/MyProfile.tsx` -- make stat cards clickable/navigable
- `src/components/app/routes/protectedRoutes.tsx` -- add hub route
- `src/components/app/AppLayout.tsx` -- update hidden nav routes if needed
