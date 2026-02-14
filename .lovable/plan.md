

# Swipe Screen: Design Audit and Cleanup

## Issues Found

### 1. Duplicate Boost Button
The Boost (Zap) icon appears in TWO places on the same screen:
- **Header**: Zap button opens `ProfileBoostCard` as a raw overlay
- **Action bar**: Zap button triggers `PremiumFeatureModal` or a toast

Both do "boost" but behave differently. This confuses users.

**Fix**: Remove the Boost button from the header. Keep it only in the action bar (where Tinder places it). When the action bar boost is tapped, open the `ProfileBoostCard` as a Sheet (slider) instead of the current premium modal or toast.

### 2. Inconsistent Popup Patterns
Currently 3 different popup styles on the same page:
- `ProfileBoostCard` = custom `div` overlay (crude, no animation)
- `SmartNotificationCenter` = Sheet (slider from right)
- `PremiumFeatureModal` / `LimitReachedModal` = Dialog (centered popup)

**Fix**: Convert `ProfileBoostCard` from custom overlay to a proper bottom Sheet (slider from bottom), matching Tinder's style. Keep notifications as a right Sheet. Keep premium/limit modals as Dialogs since they are blocking confirmations.

### 3. Duplicate Premium Benefits Lists
`PremiumFeatureModal` and `LimitReachedModal` both contain the exact same hardcoded "Premium Benefits" list (unlimited likes, 10 super likes, 5 rewinds, 3 boosts, see who liked you).

**Fix**: Extract the shared premium benefits list into a reusable `PremiumBenefitsList` component used by both modals.

### 4. Header Cleanup
With Boost removed from the header, only Notifications (Bell) and Filters (SlidersHorizontal) remain -- cleaner and more focused.

---

## Technical Details

### Files to change:

**`src/pages/Swipe.tsx`**
- Remove the Boost (Zap) button from the header -- only Bell and Filter remain
- Remove the custom `boostOpen` overlay `div` entirely
- Remove `boostOpen` state
- Change the `onBoost` callback in `SwipeActions` to open ProfileBoostCard as a Sheet

**`src/components/swipe/SwipeActions.tsx`**
- Update the boost action to open a Sheet with `ProfileBoostCard` instead of triggering `PremiumFeatureModal` or toast
- The boost button in the action bar becomes the single entry point for boost

**`src/components/boost/ProfileBoostCard.tsx`**
- Wrap content in a Sheet (bottom drawer) instead of a plain Card
- Make it responsive and compact so it never requires scrolling on mobile

**`src/components/shared/PremiumBenefitsList.tsx`** (new file)
- Extract the shared premium benefits list used by both `PremiumFeatureModal` and `LimitReachedModal`

**`src/components/modals/PremiumFeatureModal.tsx`**
- Import and use `PremiumBenefitsList` instead of inline list

**`src/components/modals/LimitReachedModal.tsx`**
- Import and use `PremiumBenefitsList` instead of inline list

### Summary of changes:
- 1 duplicate button removed (header Boost)
- 1 custom overlay converted to proper Sheet
- 1 shared component extracted (PremiumBenefitsList)
- Consistent popup patterns across the page

