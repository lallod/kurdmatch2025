
# Swipe-skjerm: Fullskjerm profilkort-optimalisering

## Problem
Fra skjermbildene ser vi:
1. **Logo/tittel ("KurdMatch") tar opp plass** i toppen -- kortet starter for langt ned
2. **Brukerinformasjon kuttes av** nederst (navn, alder, lokasjon delvis skjult bak action-knappene)
3. **Action-knappene overlapper** med profil-info og bottom navigation
4. Kortet bruker ikke hele tilgjengelig hoyde mellom header-ikoner og action-knapper

## Losning

### 1. Fjern Logo/tittel fra Swipe-siden
- Fjern `Logo`-komponenten fra headeren i `Swipe.tsx`
- Behold kun de 3 action-ikonene (Boost, Notifications, Filter) i en kompakt, transparent header som flyter over kortet

### 2. Gjor kortet fullskjerm
- Kortet skal fylle hele skjermen fra topp til bunn, kun med plass til action-knapper og bottom nav
- Oppdater `SwipeCard.tsx` dimensjoner: fjern `maxWidth`-begrensninger pa mobil, bruk `w-full` og dynamisk hoyde
- Kortet skal dekke fra top av skjermen til rett over action-knappene

### 3. Flytt profil-info innenfor kortet
- Profil-overlay (navn, alder, lokasjon, region, hoyde) skal alltid vaere synlig nederst i kortet
- Gi nok padding sa info ikke overlapper med action-knappene
- Gjor overlay-omradet litt hoyere for a vise all informasjon

### 4. Action-knapper riktig plassert
- Fest action-knappene rett over bottom navigation (56px + safe-area)
- Fjern overlapping med profil-info

## Tekniske detaljer

### Filer som endres:

**`src/pages/Swipe.tsx`**
- Fjern `import Logo` og `<Logo>` fra header
- Header blir bare 3 ikoner (Boost, Bell, Filter) floatende over kortet med transparent bakgrunn
- Juster `pb-24` til riktig verdi basert pa action-knapper + bottom nav
- Kort-container bruker full tilgjengelig hoyde

**`src/components/swipe/SwipeCard.tsx`**
- Fjern max-width begrensninger pa mobil (bruk `w-full` i stedet for `w-[96vw]`)
- Juster hoyde til a bruke dynamisk `calc()` basert pa viewport minus bottom-bar og action-knapper
- Ok profil-overlay hoyde for a vise all info uten a bli kuttet

**`src/config/swipe.ts`**
- Oppdater `card.maxWidth.mobile` til `w-full`
- Oppdater `card.height.mobile` til `h-[calc(100vh-140px)]` (plass til actions + bottom nav)
- Oppdater `info.overlay.height` til storre verdi for a vise all brukerinfo
