
# KurdMatch Design & Consistency Audit -- Full Fix Plan

## Summary of Issues Found

After a deep scan of the entire codebase, I identified **6 major categories** of problems that need fixing.

---

## 1. CRITICAL: Two Competing Color Themes (23+ pages affected)

The app has a **Midnight Rose** theme defined in CSS variables (`--background`, `--foreground`, etc.) but **23 pages** still use the OLD hardcoded purple gradient:

```
bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900
```

These pages look completely different from the modern pages (Discovery, MyProfile, DiscoveryFeed, Matches, Notifications) that correctly use `bg-background`.

**Pages using the WRONG old theme:**
- Profile.tsx (dating profile)
- AdvancedSearch.tsx
- NotificationSettings.tsx
- PrivacySettings.tsx
- CompatibilityInsights.tsx
- PhoneVerification.tsx
- Subscription.tsx (partially)
- TermsOfService.tsx
- CommunityGuidelines.tsx (partially)
- Landing.tsx
- LandingV2.tsx
- CreateSuperAdmin.tsx
- Register.tsx
- Admin/UserManagement.tsx
- Admin/PlatformAnalytics.tsx
- Admin/SystemSettings.tsx
- All modals (LimitReachedModal, PremiumFeatureModal, MatchModal)
- MatchPopup.tsx
- AIWingmanPanel.tsx
- TrendingHashtags.tsx

**Fix:** Replace all hardcoded `from-purple-900 via-purple-800 to-pink-900` backgrounds with `bg-background` and replace `text-white` with `text-foreground`, `bg-black/20` headers with `bg-background/80 backdrop-blur-xl`, and `border-white/20` with `border-border/10`. This makes every page use the same Midnight Rose CSS variables.

---

## 2. Inconsistent Popups and Dialogs

The Dialog component (`dialog.tsx`) does NOT have mobile-optimized styling. It uses centered positioning which can look bad on small screens.

**Problems:**
- Dialogs use `max-w-lg` which is too wide for mobile
- No rounded corners matching the app theme (rounded-3xl)
- Modals use old purple gradients instead of `bg-card`
- MatchPopup uses its own custom Dialog styling separate from other modals
- The Boost modal in Swipe.tsx is a raw `div` overlay, not using any shared component

**Fix:**
- Update `DialogContent` base class to include `rounded-3xl max-w-[calc(100vw-2rem)] sm:max-w-lg` for mobile fit
- Convert all modal backgrounds from hardcoded purple gradients to `bg-card border-border`
- Standardize all popups to use the same component pattern

---

## 3. Inconsistent Bottom Padding (pb-XX values)

Different pages use different bottom padding to account for the BottomNavigation bar, making content get cut off on some pages:

| Page | Padding |
|------|---------|
| Discovery.tsx | pb-28 |
| DiscoveryFeed.tsx | pb-24 |
| InstagramProfile.tsx | pb-28 |
| MyProfile.tsx | pb-28 |
| Matches.tsx | pb-24 |
| Notifications.tsx | pb-24 |
| Events.tsx | pb-24 |
| GroupsList.tsx | pb-20 |
| DiscoveryNearby.tsx | pb-20 |

**Fix:** Standardize ALL pages to `pb-24` (96px) which cleanly clears the 56px nav bar plus comfortable spacing. Apply this consistently.

---

## 4. Inconsistent Header Styles

Headers across pages vary wildly:

| Page | Header Height | Blur | Border | Max Width |
|------|-------------|------|--------|-----------|
| DiscoveryFeed | h-12 | backdrop-blur-2xl | border-b border-border/10 | max-w-md |
| Discovery | h-14 | backdrop-blur-xl | none | max-w-md |
| Matches | h-11 | none | border-b border-border/30 | max-w-lg |
| Notifications | h-11 | none | border-b border-border/30 | max-w-lg |
| MyProfile | h-12 | backdrop-blur-xl | border-b border-border/10 | max-w-md |
| Old pages | py-4 | bg-black/20 | border-white/10 | max-w-4xl |

**Fix:** Standardize all headers to: `h-12 bg-background/80 backdrop-blur-xl border-b border-border/10` with `max-w-md mx-auto px-4`.

---

## 5. Mixed Toast Libraries

The app uses TWO toast systems simultaneously:
- `sonner` (used via `toast()` from `sonner` in Swipe.tsx, Matches.tsx, Discovery.tsx, etc.)
- `@/hooks/use-toast` (used via `useToast()` in Notifications.tsx, DiscoveryFeed.tsx, admin pages, etc.)

This means toasts appear in different positions and with different styling depending on which page you are on.

**Fix:** Standardize on `sonner` (the newer one) across all pages. Replace all `useToast()` imports with `toast` from `sonner`.

---

## 6. Image Display & Scrolling Issues

- The `Swipe.tsx` page uses `overflow-hidden` on the main container, which can prevent scrolling on desktop browsers
- Profile cards in Discovery use `aspect-[3/4]` which is good for mobile but images may appear cropped on wider screens
- No `object-position` is set on profile images, so faces can be cut off

**Fix:**
- Add `object-position: center top` to all profile images (faces are usually at the top)
- Ensure Swipe page allows vertical scroll on desktop while maintaining card behavior on mobile
- Add `will-change-transform` to card animations for smoother performance

---

## Technical Implementation

### Files to modify (theme fix -- largest batch):
All 23+ pages listed in section 1, converting from hardcoded purple gradients to theme variables.

### Files to modify (dialog/popup fix):
- `src/components/ui/dialog.tsx` -- mobile-friendly base styles
- `src/components/modals/LimitReachedModal.tsx` -- theme colors
- `src/components/modals/PremiumFeatureModal.tsx` -- theme colors
- `src/components/modals/MatchModal.tsx` -- theme colors
- `src/components/MatchPopup.tsx` -- theme colors

### Files to modify (consistency fixes):
- All page files for standardized `pb-24` and header styles
- Toast migration across ~15 files from `useToast` to `sonner`

### Estimated scope:
- ~40 files need color/theme corrections
- ~15 files need toast standardization
- ~10 files need header/padding normalization
- 4 modal/dialog files need mobile optimization
- 1 base UI component update (dialog.tsx)

This will make the entire app feel like one cohesive, native mobile experience with the Midnight Rose theme applied everywhere, minimal popups, and smooth scrolling on all devices.
