
# Languages Expansion + Instagram-style Discovery Feed

## Overview
Two changes: (1) expand the language list to 50+ languages most used by Kurds worldwide, and (2) redesign the Discovery Feed to be image-first like Instagram — showing post images/videos prominently with text as captions below.

## Part 1: Expand Languages

### Current State
The language list in `src/data/languages.ts` has ~85 languages but is missing several commonly spoken by Kurdish diaspora communities.

### Changes to `src/data/languages.ts`
Add languages frequently used by Kurds (diaspora + regional), ensuring at least 50 of the most relevant are present. Key additions:
- **Kurdish dialects**: Keep all 5 existing (Sorani, Kurmanji, Zazaki, Gorani, Hawrami)
- **Diaspora languages** (commonly spoken by Kurdish communities abroad): Add or confirm: Swedish, Norwegian, Danish, Dutch, German, French, English, Finnish, Italian, Greek, Russian, Austrian German
- **Regional neighbors**: Add or confirm: Arabic, Turkish, Persian, Azerbaijani, Armenian, Georgian, Assyrian/Syriac, Turkmen, Uzbek
- **South Asian**: Add Dari (Afghan Persian)
- Trim rarely-used-by-Kurds languages (Berber, Zulu, Sinhala, etc.) to keep the list focused

The final list will be reorganized with "Most Popular" at top (Kurdish dialects + top diaspora languages) for easy selection.

### Also update `src/components/DetailEditor/constants.ts`
Sync the `OPTIONS.languages` array to match the expanded list from `languages.ts` so the profile editor shows all options.

## Part 2: Instagram-style Discovery Feed

### Current Problem
`PostCard` only renders text content via `PostContent`. The `media_url` field on posts is completely ignored in the feed — no images or videos are shown, making the feed text-heavy instead of visual.

### Changes to `src/components/discovery/PostCard.tsx`
Add media rendering between the header and action bar:
- If `post.media_url` exists and `media_type === 'image'`: render a full-width image (aspect-ratio auto, max-height capped)
- If `post.media_url` exists and `media_type === 'video'`: render a video element with controls
- Move text content (`PostContent`) below the media as a caption (smaller text, 2-line clamp with "more" expand)
- Double-tap to like on image (Instagram gesture)

### Changes to `src/pages/DiscoveryFeed.tsx`
- Reduce spacing between posts (tight feed like Instagram)
- Remove the gap/padding between cards for edge-to-edge media
- Keep stories row and tabs as-is

### Visual Layout per Post (Instagram-style)

```text
+----------------------------------+
| [Avatar] Username   ...  [time]  |  <- header (existing, keep)
+----------------------------------+
|                                  |
|     [  FULL WIDTH IMAGE  ]       |  <- NEW: media_url rendered
|                                  |
+----------------------------------+
| [Heart] [Comment] [Share]  [Save]|  <- actions (existing, keep)
+----------------------------------+
| Username: caption text...  more  |  <- text as caption, not main
+----------------------------------+
```

### No New Dependencies
All changes use existing components and native HTML elements (img, video).
