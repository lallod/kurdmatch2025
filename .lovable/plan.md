

# Midnight Rose Theme: Dark Purple x Pink

## Overview

A comprehensive visual refresh applying the "Midnight Rose" design system across the entire app. No functionality changes -- only colors, surfaces, spacing, elevation, and component styling.

---

## 1. Core CSS Variables (src/index.css)

Replace the existing `:root` and `.dark` CSS variable blocks with the Midnight Rose palette:

| Token | Current | New (Midnight Rose) |
|-------|---------|-------------------|
| `--background` | white / dark gray | `#140F1F` (271 33% 9%) |
| `--card` | white / dark gray | `#281C3D` (268 37% 17%) |
| `--popover` | white / dark gray | `#1E1630` (265 35% 14%) |
| `--primary` | 346 82% 66% | `#F43F8E` (336 90% 60%) |
| `--primary-foreground` | white | white |
| `--secondary` | light gray | `#1E1630` surface |
| `--muted` | light gray | `#1E1630` surface |
| `--muted-foreground` | gray | lavender `#9B8BB4` |
| `--accent` | pink 85% | `#FB6FA9` soft pink |
| `--border` | gray | `#3A2D52` subtle purple |
| `--input` | gray | `#3A2D52` |
| `--ring` | pink | `#F43F8E` |

Dark mode becomes the **default** (move dark values to `:root`). Light mode kept as secondary in `.light` class.

Add new custom properties:
```
--surface: 268 37% 17%;
--surface-secondary: 265 35% 14%;
--gradient-brand: linear-gradient(135deg, #2A1E45, #F43F8E);
```

---

## 2. Tailwind Config (tailwind.config.ts)

- Add `surface` and `surface-secondary` color tokens
- Update tinder color palette to use Midnight Rose pinks (`#F43F8E`, `#FB6FA9`)
- Update gradient utilities to use brand gradient
- Set default dark mode

---

## 3. Bottom Tab Bar (src/components/BottomNavigation.tsx)

Current: `bg-black/[0.17] backdrop-blur-md border-t border-white/20`

New:
- Floating bar with `rounded-[28px]` corners, `mx-4 mb-4`
- Background: `bg-[#1E1630]/80 backdrop-blur-xl`
- No top border line
- Active icon: pink glow (`text-[#F43F8E]` + `drop-shadow`)
- Inactive icon: muted lavender (`text-[#9B8BB4]`)

---

## 4. Card System (src/components/ui/card.tsx)

Current: `rounded-lg border bg-card shadow-sm`

New:
- `rounded-3xl` (24px corners)
- No visible border
- Background: `bg-[#281C3D]`
- Soft shadow: `shadow-[0_4px_24px_rgba(0,0,0,0.3)]`
- Floating visual separation from background

---

## 5. Button System (src/components/ui/button.tsx)

Update variants:
- **default (primary)**: `bg-[#F43F8E]` white text, `rounded-3xl`, subtle outer glow `shadow-[0_0_20px_rgba(244,63,142,0.3)]`
- **secondary**: `bg-[#281C3D]` pink text, no heavy border
- **ghost/outline**: updated to purple surface tones
- Add `active:scale-95` tap animation to all variants

---

## 6. Swipe Screen (src/pages/Swipe.tsx, src/components/swipe/*)

- Page background: deep purple gradient `bg-gradient-to-b from-[#140F1F] to-[#1E1630]`
- Card bottom overlay: `from-[#140F1F]/90` instead of `from-black/80`
- Intent badges: pink pill style
- SwipeActions buttons:
  - Like (Heart): `bg-[#F43F8E]` with pink glow
  - Pass (X): `bg-[#281C3D]` muted purple
  - Super Like: keep blue but soften
  - Rewind/Boost: muted purple surface with pink accents
  - All buttons: circular, soft shadow, even horizontal spacing

---

## 7. Messages Screen (src/pages/Messages.tsx)

- Background: `bg-[#140F1F]`
- Sent bubbles: `bg-[#F43F8E]` pink
- Received bubbles: `bg-[#281C3D]` muted purple
- Large bubble radius (`rounded-2xl`)
- Input field: pill shape, `bg-[#1E1630]` surface, pink send icon
- Conversation list cards: `bg-[#281C3D]` with no borders

---

## 8. Profile Screen (src/pages/MyProfile.tsx)

- Top header: subtle purple gradient overlay
- Photo grid: `rounded-2xl` corners
- Section containers: floating cards with `bg-[#281C3D]`, `rounded-3xl`
- Chips: `rounded-full`, default `bg-[#1E1630]`, active `bg-[#F43F8E]`
- Compatibility circle: purple base ring, pink animated progress

---

## 9. Match Popup (src/components/MatchPopup.tsx)

- Dialog background: brand gradient `from-[#2A1E45] to-[#F43F8E]`
- CTA button: gradient pink
- Keep existing animations

---

## 10. Subscription / Premium Screen (src/pages/Subscription.tsx)

- Background: darker purple `bg-[#0E0A17]`
- Centered layout
- CTA: pink gradient button with outer glow
- Subtle animated pink glow in background (CSS keyframe)
- "Exclusive" premium feel

---

## 11. Discovery Feed (src/pages/Discovery.tsx, DiscoveryFeed.tsx)

- Stories row: maintain horizontal scroll, update card backgrounds to `#281C3D`
- Post cards: large rounded (`rounded-3xl`), image top, text below
- Cards separated by 24px vertical spacing, no divider lines

---

## 12. Global Utility Classes (src/index.css)

Update existing utilities:
- `.glass` / `.glass-dark`: use `bg-[#1E1630]/60 backdrop-blur-xl`
- `.neo-card`: update to purple surface
- `.tinder-gradient`: `from-[#F43F8E] to-[#FB6FA9]`
- `.premium-card`: purple glass effect
- Add `.midnight-glow`: `shadow-[0_0_30px_rgba(244,63,142,0.15)]`

---

## 13. Swipe Config (src/config/swipe.ts)

- Update border radius to `rounded-3xl`
- Ensure card sizing stays the same (no layout changes)

---

## Files Modified (no new files created)

| File | Change Type |
|------|------------|
| `src/index.css` | CSS variables + utility classes |
| `tailwind.config.ts` | Color tokens + gradient |
| `src/components/ui/card.tsx` | Card styling |
| `src/components/ui/button.tsx` | Button variants |
| `src/components/BottomNavigation.tsx` | Floating tab bar |
| `src/components/swipe/SwipeActions.tsx` | Action button colors |
| `src/components/swipe/SwipeCard.tsx` | Card overlay gradient |
| `src/components/swipe/ProfileInfo.tsx` | Badge/text colors |
| `src/pages/Swipe.tsx` | Page background |
| `src/pages/Messages.tsx` | Bubble colors, input, background |
| `src/pages/MyProfile.tsx` | Section cards, chips |
| `src/pages/Subscription.tsx` | Premium dark purple bg |
| `src/pages/Discovery.tsx` | Post card styling |
| `src/pages/DiscoveryFeed.tsx` | Feed card styling |
| `src/components/MatchPopup.tsx` | Gradient background |
| `src/components/LoadingState.tsx` | Background gradient |
| `src/config/swipe.ts` | Border radius update |

---

## Design Principles Followed

- Spacious, soft, layered, floating
- No pure black or pure white in dark mode
- Gradient used sparingly (CTAs, match popup, premium, compatibility ring only)
- Depth via shadow instead of divider lines
- Dark mode is the primary experience

