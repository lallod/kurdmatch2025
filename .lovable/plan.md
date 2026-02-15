

# Information Display Strategy: Swipe Page vs Instagram Profile

## Current State

Both pages currently show nearly identical data (~60+ fields each), which creates two problems:
1. **Information overload on swipe** -- users are swiping quickly and don't need 60+ fields buried in 8 accordion sections
2. **No differentiation** -- there's no reason to visit someone's Instagram profile if you already saw everything on swipe

## Recommended Strategy

The core idea: **Swipe = quick decision-making snapshot. Instagram Profile = full deep-dive.**

---

### SWIPE PAGE -- Show only "Deal-Breaker" Fields (~20 fields)

These are the fields someone needs to make a quick yes/no decision:

**Always visible on card (no accordion):**
- Name, Age, Location, Distance, Photos
- Bio (first 2 lines, truncatable)
- Quick badges: Religion, Occupation, Height

**In a single expandable section (simplified, no 8 accordions):**

| Category | Fields to KEEP | Fields to REMOVE |
|----------|---------------|-----------------|
| Basics | Gender, Ethnicity, Kurdistan Region, Languages | Body Type, Zodiac, Personality Type |
| Lifestyle | Smoking, Drinking, Exercise | Diet, Sleep, Pets, Travel Freq, Transportation |
| Values | Religion, Values (badges) | Political Views |
| Relationships | Relationship Goals, Want Children, Love Language | Children Status, Family Closeness, Communication Style |
| Career | Education, Occupation | Company, Career Ambitions, Work Environment, Work-Life Balance |
| Interests | Interests + Hobbies (badges only) | Creative Pursuits, Weekend Activities, Music Instruments, Tech Skills |
| Favorites | REMOVE ENTIRE SECTION | All favorites |
| Personal Growth | REMOVE ENTIRE SECTION | All growth fields |

**Total on swipe: ~20 fields** (down from ~60)

---

### INSTAGRAM PROFILE -- Show Everything (~65 fields)

Keep exactly as-is. This is the "deep dive" destination. The gating system (free vs premium) already handles access control. No changes needed here.

---

## Technical Implementation

### Step 1: Simplify `ProfileDetails.tsx` (Swipe Page)

Replace the 8 accordion sections with a cleaner 2-section layout:
- **Section 1: "About"** -- Bio, Gender, Ethnicity, Kurdistan Region, Languages, Religion, Education, Occupation
- **Section 2: "Compatibility"** -- Relationship Goals, Want Children, Smoking, Drinking, Exercise, Love Language, Values + Interests as badges

Remove all Favorites, Personal Growth, and lower-priority detail fields from the swipe view entirely.

### Step 2: Update `ProfileQuickBadges.tsx`

Ensure the quick badges shown on the swipe card surface the most decision-relevant info: Religion, Height, Occupation, Relationship Goals.

### Step 3: No changes to `ProfileAbout.tsx` (Instagram page)

The Instagram profile already has proper gating and complete sections -- it stays as the comprehensive view.

### Step 4: Add "View Full Profile" link on swipe

Add a small link/button on the swipe card that navigates to the user's Instagram profile page for those who want the deep dive. This creates a natural funnel from swipe (snapshot) to profile (full details).

---

## Summary

| Aspect | Swipe Page | Instagram Profile |
|--------|-----------|-------------------|
| Purpose | Quick decision | Deep exploration |
| Fields shown | ~20 (deal-breakers) | ~65 (everything) |
| Layout | 2 clean sections | 8 gated sections |
| Favorites | Hidden | Shown |
| Personal Growth | Hidden | Shown |
| Career details | Basic only | Full |
| Change needed | Simplify significantly | None |

