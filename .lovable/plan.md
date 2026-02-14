

# Separating Social Profile from Dating Profile -- Architecture Plan

## The Problem

Right now, KurdMatch has two profile views that share the same data:
1. **Instagram-style profile** (`/profile/:id`) -- social feed with posts, stories, fans
2. **Dating profile** (`/profile` via Swipe) -- detailed dating card with compatibility scores

Both pull from the same `profiles` table, and both are equally accessible. There is no distinction between "social browsing" and "dating discovery," making it too easy for free users to find and browse people without going through the dating/matching flow.

## Proposed Solution

Introduce a **dual-layer visibility system** where the social profile is the public-facing "Instagram" layer, and the dating profile details are gated behind the Swipe/Discovery matching flow with premium filters.

### How It Works

**Layer 1 -- Social Profile (public to all logged-in users)**
- Visible at `/profile/:id`
- Shows: name, avatar, posts, stories, fans, basic bio
- Does NOT show: age, location, occupation, religion, body type, compatibility score, relationship goals
- Accessible via feed interactions (liking posts, following, stories)

**Layer 2 -- Dating Profile (gated)**
- Only accessible through the Swipe page or Discovery "People" tab
- Shows full dating details: age, location, compatibility %, relationship goals, lifestyle, values
- Free users: can only find people via random Swipe cards (no search by name, no filters)
- Premium users: unlock advanced filters (age, region, religion, body type) on both Swipe and Discovery People tab

### Key Rules
- The Discovery Feed (`/discovery`) shows posts/stories only -- no ability to search for people by name or browse profiles directly
- The Discovery People tab (`/discovery-old`) and Swipe page are the only ways to discover new dating profiles
- Free users get randomized profiles with no filters
- Premium users get filters + ability to see who liked/viewed them

## Technical Changes

### 1. Create a `profile_visibility` settings column
Add a `dating_profile_visible` boolean to the `profiles` table (default `true`). This lets users opt out of appearing in dating discovery while keeping their social profile active.

### 2. Modify InstagramProfile (Social Profile)
- Hide sensitive dating fields (age, exact location, relationship goals, compatibility) from the public social view
- Show only: name, bio, posts, stories, photos, fans count
- Add a "See Dating Profile" button that only appears when viewing through Swipe/Discovery context (via navigation state)

### 3. Gate Discovery People Tab
- Remove name/text search from the People tab for free users
- Free users see a randomized grid with no filter controls
- Premium users see the full filter panel (SmartFilters)
- When a free user taps a profile card in Discovery, show a blurred preview with a "Subscribe to see more" prompt instead of full details

### 4. Modify Profile Navigation Flow
- From Swipe card tap: navigate to full dating profile (`/profile` with `profileId` state) -- shows everything
- From feed/post/story tap: navigate to social profile (`/profile/:id`) -- shows limited info
- From Discovery People grid: navigate based on subscription tier

### 5. Subscription Gating Logic
Create a `useProfileAccess` hook that checks:
- Is the viewer a premium subscriber?
- Did they arrive from the Swipe/matching flow?
- Are they already matched with this person?

Based on this, return which fields to show/hide.

## Technical Details

### Files to Create
- `src/hooks/useProfileAccess.ts` -- centralized access control hook
- `src/components/profile/BlurredProfileOverlay.tsx` -- premium upsell overlay for locked profiles

### Files to Modify
- `src/pages/InstagramProfile.tsx` -- hide dating-specific fields, add conditional rendering
- `src/pages/Discovery.tsx` -- gate filters behind premium, disable name search for free users
- `src/pages/DiscoveryFeed.tsx` -- ensure no people-search capability, feed-only
- `src/components/instagram/ProfileHeader.tsx` -- conditionally show/hide age, location
- `src/components/instagram/ProfileAbout.tsx` -- conditionally show/hide dating details
- `src/pages/Profile.tsx` -- keep as full dating profile, only accessible via swipe context
- `src/hooks/useDiscoveryProfiles.ts` -- add subscription-based query limits (free = 10 profiles, premium = unlimited)

### Database Migration
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dating_profile_visible boolean DEFAULT true;
```

### Access Control Matrix

| Feature | Free | Basic | Premium | Gold |
|---|---|---|---|---|
| View social profiles | Yes | Yes | Yes | Yes |
| See posts/stories in feed | Yes | Yes | Yes | Yes |
| Swipe (random, no filters) | Yes | Yes | Yes | Yes |
| Discovery People grid | Limited (10) | Unlimited | Unlimited | Unlimited |
| Search by name | No | No | No | No |
| Advanced filters | No | Yes | Yes | Yes |
| See who liked/viewed you | No | Yes | Yes | Yes |
| View full dating profile from Discovery | No | Blurred | Full | Full |
| Compatibility scores | No | Basic | Full | Full |

This approach keeps both profiles useful but makes the dating side the premium experience, encouraging subscriptions while the social side drives engagement and retention.

