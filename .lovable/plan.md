

# Instagram-Style Redesign for All Pages

## Overview

Complete template/layout overhaul across all pages to match an Instagram 2026 aesthetic -- clean, minimal, content-first design. All existing functionality (events, groups, stories, filters, swipe actions, etc.) will be preserved. Only the visual template and layout structure changes. The Midnight Rose color palette stays.

---

## Design Philosophy Change

**Current**: Heavy headers with gradients, icon circles, subtitle text, large search bars, wrapped-in-card layouts with animated gradient backgrounds.

**New (Instagram-style)**: Clean top bar with logo/title left + action icons right. No decorative icon circles. No subtitle text. Content starts immediately. Full-bleed content. Minimal chrome. Stories row is top-level, not inside a card.

---

## 1. DiscoveryFeed.tsx (Main Social Feed -- Instagram Home equivalent)

This becomes the primary "Instagram Home" screen.

**Header**: Slim sticky bar -- "KurdMatch" text logo left, notification bell + create post icon right. No gradient background on header, just `bg-background` with subtle border.

**Stories Row**: Directly below header, no wrapping card. Horizontal scroll with ring-gradient around active stories.

**Tab Bar**: Subtle underline-style tabs (Posts | Events) instead of filled pill tabs. Inline below stories.

**Post Cards**: Remove outer `bg-white/10` wrapper. Each post is full-width with:
- Avatar + name + time at top (no card border)
- Full-bleed image/media
- Action row (heart, comment, share, bookmark) below media -- Instagram icon layout
- Likes count + caption below actions
- Divider line between posts (thin `border-border/10`)

**Events Tab**: Event cards as clean image-top cards with rounded corners, no heavy wrappers.

**Following Toggle**: Small text button or segmented control, not a gradient pill button.

---

## 2. Discovery.tsx (Explore/People Discovery)

Transform into an Instagram Explore-style grid.

**Header**: Slim bar -- search input taking most width, filter icon right. Remove the large decorative header with icon circle and subtitle.

**Content**: Remove the card wrapper with animated gradient background. Content flows directly.

**Profile Grid**: 2-column photo grid (like Instagram Explore). Each cell is the profile photo with name/age overlay at bottom. Tapping opens profile detail.

**Filters**: Collapsed into a sheet/bottom-sheet triggered by filter icon. Not inline dropdowns.

**Sections (Hashtags, Trending, Groups)**: Remove `CompactSection` rows. Move to a horizontal chip row below search (tappable filter chips).

---

## 3. Messages.tsx (Instagram DMs equivalent)

**Conversation List Header**: "Messages" title left, compose icon right. Clean, no decorative elements.

**New Matches Row**: Horizontal avatar scroll (Instagram "Notes" style) at top with name below each.

**Conversation List**: Clean list -- avatar, name, last message preview, time. No cards. Simple rows with dividers. Unread = bold text + blue dot.

**Chat View Header**: Back arrow, avatar, name, online status dot. Action icons right (call, video, more). Clean background.

**Chat Bubbles**: Already updated with Midnight Rose colors (pink sent, purple received). Keep as-is. Ensure large radius and comfortable padding.

**Input Bar**: Keep floating pill style. Already updated.

---

## 4. MyProfile.tsx (Instagram Profile equivalent)

Complete Instagram-profile-style layout.

**Header Area**: 
- No decorative icon/subtitle header
- Profile photo (large, centered or left-aligned), stats row (posts/matches/likes) as tap-able numbers
- Name + bio below photo
- "Edit Profile" and "Share Profile" buttons as outlined pills

**Remove**: The card wrapper with animated gradient. The `TabsList` with icon+text tabs.

**Tabs**: Underline-style tab strip (grid icon for profile sections, camera for photos, gear for settings) -- icons only, no text, Instagram-style.

**Content**: Each section (About, Photos, Settings) rendered directly, no wrapping card. Sections use subtle dividers.

**Profile Completion**: Move to a thin progress bar at the very top of the profile section, or as a subtle banner.

---

## 5. Matches.tsx

**Header**: "Matches" title + count badge, clean.

**New Matches**: Horizontal scroll avatars (like Stories) with ring gradient.

**All Matches Grid**: 2-column grid of photos with name/age overlay (like Instagram Explore), instead of list cards.

---

## 6. LikedMe.tsx & ViewedMe.tsx

**Layout**: Clean list view (like Instagram activity/notifications). Each row: avatar, name+age, action buttons (like back / view). No card wrappers. Divider between rows.

---

## 7. Notifications.tsx

**Layout**: Instagram Activity page style. Group by today/this week/earlier. Each notification: avatar + text + time. No card wrappers. Clean rows.

Update hardcoded `from-purple-900 via-purple-800 to-pink-900` to use `bg-background`.

---

## 8. Events.tsx

**Header**: Clean "Events" + create button.

**Tabs**: Underline-style (All Events | My Events).

**Event Cards**: Image-dominant cards (cover image full-width at top, title/details below). Remove old gradient backgrounds.

---

## 9. Groups.tsx

Already fairly clean. Update background to `bg-background`. Cards get the standardized floating card style.

---

## 10. Subscription.tsx

Keep the dark premium feel but clean up:
- Remove heavy header text, use cleaner type hierarchy
- Cards: Cleaner pricing cards with subtle borders
- CTA: Keep pink gradient button

---

## 11. Secondary Pages (Update bg/header patterns)

The following pages still use hardcoded `from-purple-900 via-purple-800 to-pink-900`:

| Page | Change |
|------|--------|
| InstagramProfile.tsx | `bg-background`, semantic token header |
| SavedPosts.tsx | `bg-background`, clean header |
| BlockedUsers.tsx | `bg-background`, clean header |
| CompatibilityInsights.tsx | `bg-background`, clean header |
| Notifications.tsx | `bg-background`, clean header |

Each gets the standard pattern: `bg-background` page, slim sticky header with back arrow + title.

---

## 12. Swipe.tsx

Minimal changes -- already works well. Just ensure header aligns with the new slim-header pattern. Keep full-screen card experience.

---

## 13. PostCard.tsx Component Updates

Transform from spacious card layout to Instagram post layout:
- Remove outer card wrapper styling (the `bg-white/10 rounded-2xl p-4` in DiscoveryFeed)
- Avatar + name inline at top with more menu right
- Full-width media (no rounded corners on media, edge-to-edge)
- Action icon row: Heart, Comment, Share, Bookmark (right-aligned bookmark)
- "Liked by X" text
- Caption with "more" truncation
- Thin bottom border separator

---

## Technical Approach

All changes are CSS/layout only. No logic, API, or functionality changes.

**Files to modify** (~18 files):

| File | Type of Change |
|------|---------------|
| `src/pages/DiscoveryFeed.tsx` | Full template overhaul |
| `src/pages/Discovery.tsx` | Explore-grid template |
| `src/pages/Messages.tsx` | Clean DM list layout |
| `src/pages/MyProfile.tsx` | Instagram profile layout |
| `src/pages/Matches.tsx` | Photo grid matches |
| `src/pages/LikedMe.tsx` | Clean activity list |
| `src/pages/ViewedMe.tsx` | Clean activity list |
| `src/pages/Notifications.tsx` | Activity page, semantic tokens |
| `src/pages/Events.tsx` | Clean event layout, semantic tokens |
| `src/pages/Groups.tsx` | Semantic tokens |
| `src/pages/Subscription.tsx` | Cleaner premium layout |
| `src/pages/InstagramProfile.tsx` | Semantic tokens |
| `src/pages/SavedPosts.tsx` | Semantic tokens |
| `src/pages/BlockedUsers.tsx` | Semantic tokens |
| `src/pages/CompatibilityInsights.tsx` | Semantic tokens |
| `src/components/discovery/PostCard.tsx` | Instagram post layout |
| `src/components/BottomNavigation.tsx` | Add labels below icons |
| `src/pages/Swipe.tsx` | Minor header alignment |

**No new files created. No functionality removed. All events, groups, stories, filters, swipe actions, hashtags, save/bookmark, report/block, comments, reactions preserved.**

