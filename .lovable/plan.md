# Complete Translation Audit and Fix Plan

## Current State Analysis

### Languages Supported

The app supports 5 languages in the UI switcher:

- English (294 translation keys)
- Kurdish Sorani (180 keys -- **114 missing**)
- Kurdish Kurmanci (180 keys -- **114 missing**)
- German (180 keys -- **114 missing**)
- Norwegian (180 keys -- **114 missing**)

Additionally, 4 languages exist in the database but are NOT in the app language switcher: Arabic (115), Persian (115), Turkish (115), and a generic "kurdish" (115).

### Problem 1: 114 Missing Translation Keys Per Language

The following categories of keys exist in English but are completely absent from the other 4 languages:

- `discovery.*` (20 keys) -- filter labels, search results, etc.
- `message.*` (20 keys) -- chat UI labels
- `notifications.*` (15 keys) -- notification strings
- `profile.*` (20 keys) -- profile section labels
- `settings.*` (18 keys) -- settings page labels
- `social.*` (14 keys) -- social feed labels
- `filters.*` (7 keys) -- filter options

### Problem 2: Untranslated Values (Still in English)

Some keys exist in other languages but their values are still in English:

**Kurdish Sorani (21 untranslated):**
`auth.password`, `auth.register`, `common.back`, `common.cancel`, `common.close`, `common.edit`, `common.error`, `common.loading`, `common.next`, `common.submit`, `common.success`, `nav.discover`, `nav.messages`, `nav.profile`, `nav.settings`, `nav.swipe`, `settings.account`, `settings.language`, `settings.notifications`, `settings.privacy`, `settings.title`

**Kurdish Kurmanci (27 untranslated):**
All of the above plus `auth.email`, `auth.forgot_password`, `auth.login`, `auth.sign_out`, `common.delete`, `common.save`

**German (8 untranslated):**
`common.info`, `common.ok`, `messages.status.offline`, `messages.status.online`, `profile.fields.religion`, `profile.stats.likes`, `profile.stats.matches`, `swipe.actions.super_like`

**Norwegian (6 untranslated):**
`common.info`, `common.ok`, `filters.religions.muslim`, `nav.filter`, `profile.fields.religion`, `swipe.actions.pass`

### Problem 3: Translation Hook Not Wired Up

`useTranslations` is imported in `BottomNavigation.tsx` but the `t()` function is never actually called -- nav items use hardcoded English strings. The rest of the app does not use translations at all.

---

## Implementation Plan

### Step 1: Fix Untranslated Values (62 keys)

Update existing rows in `app_translations` where the value is still in English. Correct translations:

**Kurdish Sorani (21 fixes):**

- `auth.password` = `وشەی نهێنی`
- `auth.register` = `خۆتۆمارکردن`
- `common.back` = `گەڕانەوە`
- `common.cancel` = `هەڵوەشاندنەوە`
- `common.close` = `داخستن`
- `common.edit` = `دەستکاری`
- `common.error` = `هەڵە`
- `common.loading` = `بارکردن...`
- `common.next` = `دواتر`
- `common.submit` = `ناردن`
- `common.success` = `سەرکەوتوو`
- `nav.discover` = `دۆزینەوە`
- `nav.messages` = `نامەکان`
- `nav.profile` = `پرۆفایل`
- `nav.settings` = `ڕێکخستنەکان`
- `nav.swipe` = `سوایپ`
- `settings.account` = `هەژمار`
- `settings.language` = `زمان`
- `settings.notifications` = `ئاگاداریەکان`
- `settings.privacy` = `تایبەتێتی`
- `settings.title` = `ڕێکخستنەکان`

**Kurdish Kurmanci (27 fixes):**

- `auth.email` = `E-peyam`
- `auth.forgot_password` = `Peyva niheni ji bir kir?`
- `auth.login` = `Tekevin`
- `auth.password` = `Peyva niheni`
- `auth.register` = `Tomarbun`
- `auth.sign_out` = `Derkeve`
- `common.back` = `Vegere`
- `common.cancel` = `Betal bike`
- `common.close` = `Bigire`
- `common.delete` = `Jebibe`
- `common.edit` = `Biguherîne`
- `common.error` = `Cewti`
- `common.loading` = `Tê barkirin...`
- `common.next` = `Pêsîve`
- `common.save` = `Tomar bike`
- `common.submit` = `Bîsîne`
- `common.success` = `Serkeftin`
- `nav.discover` = `Kesfkirin`
- `nav.messages` = `Peyam`
- `nav.profile` = `Profîl`
- `nav.settings` = `Mîheng`
- `nav.swipe` = `Swipe`
- `settings.account` = `Hesab`
- `settings.language` = `Ziman`
- `settings.notifications` = `Agahdarî`
- `settings.privacy` = `Niheniparêzî`
- `settings.title` = `Mîheng`

**German (8 fixes):**

- `common.info` = `Information`
- `common.ok` = `Okay`
- `messages.status.offline` = `Abwesend`
- `messages.status.online` = `Verfugbar`
- `profile.fields.religion` = `Glaube`
- `profile.stats.likes` = `Gefallt mir`
- `profile.stats.matches` = `Ubereinstimmungen`
- `swipe.actions.super_like` = `Super-Gefallt mir`

**Norwegian (6 fixes):**

- `common.info` = `Informasjon`
- `common.ok` = `Greit`
- `filters.religions.muslim` = `Muslimsk`
- `nav.filter` = `Filtrer`
- `profile.fields.religion` = `Religion/Tro`
- `swipe.actions.pass` = `Hopp over`

### Step 2: Insert 114 Missing Keys Per Language

Create an edge function `sync-translations` that inserts the 114 missing translation keys for each of the 4 non-English languages with proper translations. The keys fall into these categories:

- **discovery.*** -- Discovery page filters and labels
- **message.*** -- Messaging UI
- **notifications.*** -- Notification strings
- **profile.*** -- Profile sections
- **settings.*** -- Settings page
- **social.*** -- Social feed
- **filters.*** -- Filter options (body types, regions, religions)

Each key will get a proper human-quality translation for all 4 languages.

### Step 3: Wire Up BottomNavigation to Use Translations

Update `BottomNavigation.tsx` to actually use the `t()` function for nav item labels instead of hardcoded English strings.

### Step 4: Clean Up Orphan DB Languages

The `kurdish` language code (115 keys) is not used by the app -- the app uses `kurdish_sorani` and `kurdish_kurmanci`. The `arabic`, `persian`, and `turkish` codes also exist but are not in the language switcher. These will be left as-is (no harm) but documented.

---

## Technical Details

### Files to create:

- `supabase/functions/sync-translations/index.ts` -- Edge function with all 456+ translation inserts (114 keys x 4 languages)

### Files to modify:

- `src/components/BottomNavigation.tsx` -- Wire up `t()` for nav labels

### Database operations:

- UPDATE ~62 rows (fix untranslated values)
- INSERT ~456 rows (missing keys for 4 languages)

### Scope:

This plan achieves **100% database translation coverage** for all 294 keys across all 5 languages. Wiring up `t()` across every page in the app (beyond BottomNavigation) is a separate, much larger effort that would touch 30+ files.