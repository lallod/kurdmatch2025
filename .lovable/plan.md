
# Show All Profile Data on Instagram Profile and Swipe Page

## Problem

The **swipe page** (`ProfileDetails.tsx`) already displays all profile fields across 8 accordion sections -- this is complete.

The **Instagram profile** (`ProfileAbout.tsx`) only shows 5 sections with limited fields. It is missing:

**Missing sections entirely:**
- Interests & Hobbies (only shows values/interests/hobbies -- missing creative pursuits, weekend activities, music instruments, tech skills)
- Favorites (books, movies, music, foods, games, podcasts, quote, memory, season)
- Personal Growth (growth goals, morning/evening routine, stress relievers, financial habits, friendship style, decision making, charity involvement, hidden talents, pet peeves, dream vacation, ideal date, dream home, ideal weather)

**Missing fields from existing sections:**
- Basic Info: missing Gender, Kurdistan Region
- Career: missing nothing major
- Lifestyle: missing Travel Frequency, Transportation Preference
- Relationships: missing Children Status

## Solution

Update `ProfileAbout.tsx` to include all the same fields as the swipe page's `ProfileDetails.tsx`, organized into matching sections. This ensures users see the same comprehensive profile data regardless of where they view a profile.

## Technical Details

### File: `src/components/instagram/ProfileAbout.tsx`

Add the following to existing sections:
- **Basic Info**: Add Gender, Kurdistan Region
- **Lifestyle**: Add Travel Frequency, Transportation Preference
- **Relationships**: Add Children Status

Add new sections:
- **Interests & Hobbies** (separate from Values -- add Creative Pursuits, Weekend Activities, Music Instruments, Tech Skills, Hobbies as array badges)
- **Favorites** (Books, Movies, Music, Foods, Games, Podcasts, Quote, Memory, Season)
- **Personal Growth** (Growth Goals, Morning Routine, Evening Routine, Stress Relievers, Financial Habits, Friendship Style, Decision Making, Charity Involvement, Hidden Talents, Pet Peeves, Dream Vacation, Ideal Date, Dream Home, Ideal Weather)

New icons needed: `Globe`, `Trophy`, `Palette` (from lucide-react, matching swipe page).

Each new section follows the existing card pattern with icon header, key-value rows for string fields, and badge arrays for list fields. Gated sections (all except Values & Interests) remain behind the `canSeeDatingDetails` check.

### No changes needed for swipe page
The swipe page `ProfileDetails.tsx` already shows all fields comprehensively.
