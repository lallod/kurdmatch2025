

# Remove Duplicated Interests/Hobbies Badge Cloud

## Problem

The "Interests & Hobbies" section in `ProfileInterests.tsx` has two parts:
1. **Top badge cloud** (lines 35-55): Renders interests and hobbies as a mixed, unlabeled, non-editable blob of badges
2. **DetailItem list below**: Renders Weekend Activities, Music Instruments, Favorite Games with proper labels and editing

The top badge cloud is redundant -- interests and hobbies should be proper, labeled, editable fields like the rest.

## Fix

Replace the top uneditable badge cloud with two `DetailItem` components:
- **Interests** -- `multi-select` with options from the predefined interests list
- **Hobbies** -- `multi-select` with options from the predefined hobbies list

Both will use `fieldType="multi-select"` so users can toggle items on/off inline, consistent with all other array fields.

## Files Changed

| File | Change |
|------|--------|
| `src/components/profile/ProfileInterests.tsx` | Remove the top badge cloud (lines 35-55). Add two `DetailItem` components for Interests and Hobbies with `fieldType="multi-select"`, proper icons, labels, and predefined options. |

## Options

**Interests options**: Travel, Photography, Cooking, Hiking, Reading, Music, Dancing, Sports, Fitness, Art, Movies, Gaming, Technology, Fashion, Food, Nature, Animals, History, Science, Politics

**Hobbies options**: Drawing, Painting, Writing, Singing, Playing instruments, Gardening, Crafting, Collecting, Board games, Video games, Yoga, Meditation, Running, Cycling, Swimming, Rock climbing, Martial arts, Chess

