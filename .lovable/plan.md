

# Make Discovery Page More Instagram-Like (No Color Changes)

## Current vs Instagram Differences

The feed already has Instagram-style post cards (media, action bar, caption). The remaining differences are in the page shell and spacing:

| Area | Current | Instagram |
|------|---------|-----------|
| Header | Heart icon + "KurdMatch" + search + bell | Script logo left, heart + messenger icons right |
| Tabs | "For You" / "Following" with underline indicator | No visible tabs (or very subtle) |
| Stories | 68px bubbles with gradient rings | 66px bubbles, gradient rings, thin border separator below |
| Post spacing | `border-b border-border/5` between posts | Clean thin divider, no extra padding |
| Search | Inline expandable input | Separate search page (not inline) |

## Changes

### 1. Header -- Instagram-style (`DiscoveryFeed.tsx`)
- Replace the heart-icon logo box with just the "KurdMatch" text in a serif/script style (already uses Georgia) -- remove the gradient square icon
- Move notification bell and search to the right, add spacing like Instagram's icon row
- Keep the same height (h-12) and backdrop blur

### 2. Simplify Feed Tabs (`DiscoveryFeed.tsx`)
- Keep For You / Following but make them more Instagram-like: full-width equal split, bolder active indicator (full-width underline instead of centered 50% width)

### 3. Stories Section (`DiscoveryFeed.tsx`)
- Add a thin `border-b border-border/10` below the stories row to separate from posts (Instagram-style)
- Remove extra padding

### 4. Tighter Post Spacing (`DiscoveryFeed.tsx` + `PostCard.tsx`)
- Remove the `border-b border-border/5` wrapper div around each PostCard
- Instead, add a subtle separator inside PostCard at the very bottom (8px spacing)
- Posts should feel edge-to-edge with minimal gaps between them

### 5. PostCard Action Bar Polish (`PostCard.tsx`)
- Remove the duplicate message icon (there are currently two MessageCircle icons -- one for comments and one for DM). Instagram has: Heart, Comment, Share (paper plane), then Bookmark on the right
- Reorder to: Heart, Comment, Share, then Bookmark on right
- Remove the inline DM button from the action bar (keep it in the dropdown menu or profile)

## Files Changed

| File | Change |
|------|--------|
| `src/pages/DiscoveryFeed.tsx` | Header simplification, tab underline full-width, stories border, post wrapper cleanup |
| `src/components/discovery/PostCard.tsx` | Action bar icon reorder (heart, comment, share ... bookmark), remove duplicate DM icon, bottom separator |

