

# Systemfiks: Mobil-UX og Oversettelser

## Hva fikses

8 filer oppdateres for a fikse to hovedproblemer: usynlige redigeringsknapper pa mobil og hardkodede engelske tekster.

---

## Del 1: Mobil-redigeringsknapper (P0 -- kritisk)

Pa mobil finnes ingen hover-effekt, sa alle knapper med `opacity-0 group-hover:opacity-100` er usynlige. Fiksen: `opacity-100 md:opacity-0 md:group-hover:opacity-100` (alltid synlig pa mobil, hover pa desktop).

### Filer som endres:

**1. `src/components/profile/DetailItem.tsx` (linje 180)**
- Redigeringsblyant for profilfelt
- Fra: `opacity-0 group-hover:opacity-100`
- Til: `opacity-100 md:opacity-0 md:group-hover:opacity-100`

**2. `src/components/profile/ProfileQuickStats.tsx` (linje 70)**
- Redigeringsknapp pa hurtigstatistikk-kort
- Samme endring

**3. `src/components/my-profile/InlineEditableField.tsx` (linje 123)**
- Inline-redigering for tekstfelt
- Endrer `opacity-0 group-hover/edit:opacity-100` til `opacity-100 md:opacity-0 md:group-hover/edit:opacity-100`

**4. `src/pages/MyProfile.tsx` (linje 467)**
- Fotogalleri-overlay med "sett som profilbilde" og "slett"
- Endrer hele overlay fra `opacity-0 group-hover:opacity-100` til `opacity-100 md:opacity-0 md:group-hover:opacity-100`

**5. `src/components/my-profile/PhotoManagement.tsx` (linje 110)**
- Samme fotooverlay-problem

**6. `src/components/instagram/PostsGrid.tsx` (linje 46)**
- Post-statistikk overlay (likes/kommentarer)

---

## Del 2: Oversettelser -- hardkodede engelske tekster (P1)

**7. `src/pages/Profile.tsx`** -- 18 hardkodede feltnavn:

| Linje | Fra | Til |
|-------|-----|-----|
| 131 | `Looking for:` | `t('profile.looking_for', 'Looking for'):` |
| 175 | `Occupation:` | `t('profile.occupation', 'Occupation'):` |
| 176 | `Education:` | `t('profile.education', 'Education'):` |
| 177 | `Company:` | `t('profile.company', 'Company'):` |
| 178 | `Goals:` | `t('profile.goals', 'Goals'):` |
| 179 | `Work Style:` | `t('profile.work_style', 'Work Style'):` |
| 190 | `Exercise:` | `t('profile.exercise', 'Exercise'):` |
| 191 | `Diet:` | `t('profile.diet', 'Diet'):` |
| 192 | `Smoking:` | `t('profile.smoking', 'Smoking'):` |
| 193 | `Drinking:` | `t('profile.drinking', 'Drinking'):` |
| 194 | `Sleep:` | `t('profile.sleep', 'Sleep'):` |
| 195 | `Pets:` | `t('profile.pets', 'Pets'):` |
| 198 | `Hobbies:` | `t('profile.hobbies', 'Hobbies'):` |
| 216 | `Political Views:` | `t('profile.political_views', 'Political Views'):` |
| 247 | `Looking for:` | `t('profile.looking_for', 'Looking for'):` |
| 248 | `Children:` | `t('profile.children', 'Children'):` |
| 249 | `Love Language:` | `t('profile.love_language', 'Love Language'):` |
| 250 | `Communication:` | `t('profile.communication', 'Communication'):` |
| 251 | `Ideal Date:` | `t('profile.ideal_date', 'Ideal Date'):` |
| 252 | `Family:` | `t('profile.family', 'Family'):` |
| 260 | `Kurdish` | `t('profile.kurdish', 'Kurdish')` |
| 270 | `Languages` | `t('profile.languages', 'Languages')` |

**MyProfile.tsx** -- seksjons-titler (linje 455, 516-558, 570):
- `"Photos"` -> `t('profile.photos', 'Photos')`
- `"Basics"`, `"Lifestyle"`, `"Interests & Hobbies"`, `"Communication"`, `"Personality & Growth"`, `"Creative & Lifestyle"`, `"Travel"` -- alle pakkes i `t()`
- `"Privacy & Visibility"` -> `t('profile.privacy_visibility', 'Privacy & Visibility')`

**8. `src/pages/InstagramProfile.tsx`** (linje 69-70):
- `"Profile not found"` -> `t('profile.not_found', 'Profile not found')`
- `"Go back"` -> `t('common.go_back', 'Go back')`

---

## Teknisk oppsummering

- **8 filer endres**
- **0 nye filer**
- **0 database-endringer**
- Alle endringer er CSS-klasser og tekst-wrapping -- ingen logikkendringer
