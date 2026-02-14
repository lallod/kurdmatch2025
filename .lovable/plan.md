

# Native Mobile Redesign: Home + Profile + Global Polish

## Overview

Complete visual overhaul of the Home (DiscoveryFeed) and Profile (MyProfile) pages to feel like a native iOS/Android dating app. Move "Complete Profile" functionality into Settings. Apply global mobile-native optimizations across all pages.

---

## 1. Home Page (DiscoveryFeed.tsx) -- Full Redesign

### Header
- Replace flat sticky header with a translucent frosted-glass header: `bg-background/80 backdrop-blur-xl`
- "KurdMatch" in a bold serif/display font weight, slightly larger (text-2xl)
- Icons (notification bell, create) as 40x40 touch targets with subtle circular backgrounds

### Stories Row (StoryBubbles.tsx)
- Increase story bubble size from 64px to 72px
- Add gradient ring animation for unseen stories
- "Your Story" bubble with profile image + small "+" overlay (not a plain gradient circle)
- Add 16px horizontal padding, 12px vertical breathing room
- Remove bottom border -- use spacing instead

### Tab Bar (Posts | Events)
- Replace underline tabs with pill-style segmented control: `rounded-full bg-card p-1`
- Active pill: `bg-primary text-white rounded-full`
- Inactive: transparent, `text-muted-foreground`
- Centered, with 16px horizontal margin

### Filter Row
- "Following" chip + hashtag/group filters: slightly larger touch targets (36px height), `rounded-full`
- Remove border-bottom, use 8px spacing gap instead

### Post Cards (PostCard.tsx)
- Add 12px vertical spacing between posts (instead of thin border dividers)
- Wrap each post in a `bg-card rounded-3xl mx-4 mb-3 overflow-hidden shadow-lg` floating card
- Avatar row inside card: 12px padding
- Media: edge-to-edge within card (no page-edge bleed)
- Action icons: increase to 28px, 48px touch target areas
- Double-tap to like animation hint

### Event Cards (EventCard.tsx)
- Replace `bg-white/10 border border-white/20` with `bg-card rounded-3xl shadow-lg border-0`
- Cover image: `rounded-t-3xl`
- Content padding: 16px
- Join button: full-width at bottom of card, `rounded-2xl`

### Bottom Padding
- Increase `pb-24` to `pb-28` for comfortable scroll-past of floating nav

---

## 2. Profile Page (MyProfile.tsx) -- Full Redesign

### Hero Section (top of page)
- Large profile image: 96px (from 80px), centered above name
- Subtle purple gradient header background behind the image area (`h-32 bg-gradient-to-b from-primary/20 to-background`)
- Name, age, verified badge centered below photo
- Occupation + location as secondary text, centered
- Remove the left-aligned Instagram-style avatar+stats row

### Stats Row
- Horizontal row of 3 stats (Views, Likes, Matches) in floating card: `bg-card rounded-2xl mx-4 p-4 shadow-md`
- Each stat as bold number + label, evenly spaced
- Subtle divider lines between stats

### Bio Section
- Floating card: `bg-card rounded-2xl mx-4 p-4`
- "About" header + bio text
- Edit pencil icon inline

### Quick Info Cards
- Replace the ComprehensiveProfileEditor inline tabs with visual card sections
- Each category (Basic Info, Lifestyle, Interests, Relationship) as a tappable floating card
- Card shows: icon + title + completion badge + chevron-right
- Tapping opens a bottom sheet (Sheet component) for editing that section
- Cards stacked vertically with 12px spacing

### Photo Grid
- 3-column grid of rounded-2xl photos inside a floating card
- "+" placeholder for empty slots
- Primary photo has a small star badge

### Action Buttons
- "Edit Profile" and "Share Profile" as full-width stacked buttons inside a card
- Primary: filled pink, Secondary: outlined

### Remove Inline Settings Tab
- Remove the Settings tab from the profile tabs
- Settings is already accessible via the gear icon in the header
- Profile page becomes view-focused with edit sheets

---

## 3. Complete Profile Page -- Move to Settings

### Remove standalone /complete-profile page redirect
- Keep the route and guard logic (ProfileCompletionGuard) but redirect to MyProfile instead of a separate page
- On MyProfile, show a prominent completion banner at top when profile < 100%

### Completion Banner (MyProfile)
- Floating card at top: `bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl mx-4 p-4`
- Circular progress ring (not a bar) showing percentage
- "Complete your profile" text + "Continue" button
- Tapping opens the first incomplete section as a bottom sheet

### Settings Page
- Move the detailed requirements checklist into Settings > "Profile Completion" section
- Shows which fields are missing with check/warning icons

---

## 4. Bottom Navigation (BottomNavigation.tsx)

- Add safe area padding: `pb-[env(safe-area-inset-bottom)]`
- Increase icon size to 24px, label to 11px
- Active tab: filled icon style + pink dot indicator above icon (instead of just color change)
- Background: `bg-card/95 backdrop-blur-xl` for depth
- Subtle top shadow instead of border: `shadow-[0_-2px_20px_rgba(0,0,0,0.15)]`
- Height: increase to 56px content area + safe area

---

## 5. Global Mobile Optimizations

### All Pages
- Ensure `pb-28` on all pages with bottom nav (consistent scroll clearance)
- All headers: `h-12` with `pt-[env(safe-area-inset-top)]` for notch safety
- Replace all `max-w-lg mx-auto` containers with `max-w-md mx-auto` for tighter mobile feel

### Card System
- All cards: `rounded-2xl` or `rounded-3xl`, no visible borders, `shadow-md`
- Card internal padding: 16px consistently
- Card spacing: 12px between cards

### Touch Targets
- All interactive elements: minimum 44px height
- All icon buttons: 40x40 minimum
- Chips/badges: 36px height, `rounded-full`

### Typography
- Headers: `text-lg font-bold` (not oversized)
- Body: `text-sm` or `text-base`
- Captions: `text-xs text-muted-foreground`

### Modals and Sheets
- All edit dialogs become bottom sheets (Sheet component with `side="bottom"`)
- Sheet content: `rounded-t-3xl` with drag handle indicator
- No desktop-style centered modals on mobile

---

## Technical: Files Modified

| File | Changes |
|------|---------|
| `src/pages/DiscoveryFeed.tsx` | Header, tab bar, spacing, card wrapping |
| `src/components/discovery/PostCard.tsx` | Card wrapper, icon sizes, spacing |
| `src/components/discovery/StoryBubbles.tsx` | Bubble size, "Your Story" style |
| `src/components/discovery/EventCard.tsx` | Card style, border removal |
| `src/pages/MyProfile.tsx` | Full layout restructure -- hero, stats card, section cards |
| `src/components/my-profile/sections/ComprehensiveProfileEditor.tsx` | Convert to card-list with sheet editors |
| `src/components/my-profile/sections/EditableAboutMeSection.tsx` | Floating card style |
| `src/components/my-profile/PhotoManagement.tsx` | 3-col grid in card |
| `src/components/BottomNavigation.tsx` | Safe area, sizing, active indicator |
| `src/pages/CompleteProfile.tsx` | Redirect to /my-profile instead of standalone page |
| `src/components/app/ProfileCompletionGuard.tsx` | Update redirect target |
| `src/components/my-profile/AccountSettings.tsx` | Add profile completion section |

No functionality removed. All editing, stories, events, filters, save/bookmark, report/block, comments preserved.

