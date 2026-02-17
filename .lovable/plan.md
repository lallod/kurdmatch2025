
# Full Internationalization (i18n) Audit and Fix Plan

## Problem Summary
Many pages and components contain hardcoded English strings that are NOT wrapped in the `t()` translation function. When a user switches to Norwegian, Kurdish, or German, these strings remain in English -- breaking the multilingual experience.

## Audit Findings

### Category A: Entire Pages With ZERO Translation Support
These pages have NO `useTranslations()` hook at all -- every single string is hardcoded in English:

| Page | Hardcoded Strings Count |
|------|------------------------|
| `CookiePolicy.tsx` | ~20 (all section titles + content + button) |
| `PrivacyPolicy.tsx` | ~25 (all section headings + paragraphs) |
| `TermsOfService.tsx` | ~20 (all terms sections) |
| `CommunityGuidelines.tsx` | ~40 (guidelines, rules, violations, reporting) |
| `AboutUs.tsx` | ~30 (values, stats, mission, features, CTA) |
| `ContactUs.tsx` | ~20 (labels, placeholders, options, toast messages) |
| `VerificationForm.tsx` | ~25 (titles, guidelines, buttons, toast messages) |
| `CookieConsentBanner.tsx` | ~5 (banner title, description, buttons) |
| `MatchPopup.tsx` | ~5 ("It's a Match!", buttons) |
| `ErrorBoundary.tsx` | ~3 ("Something went wrong", "Refresh Page") |
| `PhotoTips.tsx` | ~8 (safety alert, tips list) |

### Category B: Pages WITH `useTranslations()` but Containing Missed Hardcoded Strings

| File | Missed Strings |
|------|---------------|
| `LandingV2.tsx` | "Home", "About", "Features", "Contact", "Login", "REGISTER", "What You Can Find", "Connect with Kurdish community worldwide", "All Kurdish Dialects Welcome", "Three simple steps...", footer labels ("Company", "Legal", "Get Started", "About Us", etc.), "All rights reserved" |
| `MobileSidebar.tsx` | "Login", "Registration", "About Us", "Contact Us", "Language", "Kurdish Hearts" |
| `Subscription.tsx` | "Current Plan", "Refresh", "Manage", subscription details bullets |
| `BlockedUsers.tsx` | "Blocked", "Unblock", "Unblock User?", "Are you sure...", "Cancel" (dialog strings) |
| `Matches.tsx` | "New" badge, "Just now", "h ago", "Yesterday", "d ago", "Loading matches..." |
| `Notifications.tsx` | "New Like", "New Comment", "Profile View", "All notifications marked as read", "Notification removed" |
| `HelpSupport.tsx` | ALL FAQ content (~100+ strings: questions, answers, category titles), "Search for help...", "Contact Us", "Send a message", "Guidelines", "Community rules", "My Support Tickets", "Search Results", "Clear", "Popular Questions", "All Topics", "No results found", "Contact support instead" |
| `fieldLabels.ts` | All field labels and requirement messages (this is acceptable -- used internally for form validation, not displayed in multi-language context) |

### Category C: Components With Scattered Hardcoded Strings

| Component | Missed Strings |
|-----------|---------------|
| `PostCard.tsx` | Various action labels |
| `ConversationList` | Header text |
| `StoryBubbles` | "Your Story" label |

## Implementation Plan

### Step 1: Add Translation Keys to Database
Insert approximately **200+ new translation keys** across all 5 main languages (english, kurdish_sorani, kurdish_kurmanci, norwegian, german) via a SQL migration. Keys will follow existing naming conventions (e.g., `cookie.title`, `privacy.section_1_title`, `landing.nav.home`, etc.).

### Step 2: Update Category A Files (Zero Translation Support)
For each file listed in Category A:
1. Import `useTranslations` hook (or for class component `ErrorBoundary`, use fallback approach)
2. Wrap every user-facing string with `t('key', 'English fallback')`

Files to modify:
- `src/pages/CookiePolicy.tsx`
- `src/pages/PrivacyPolicy.tsx`
- `src/pages/TermsOfService.tsx`
- `src/pages/CommunityGuidelines.tsx`
- `src/pages/AboutUs.tsx`
- `src/pages/ContactUs.tsx`
- `src/components/verification/VerificationForm.tsx`
- `src/components/CookieConsentBanner.tsx`
- `src/components/MatchPopup.tsx`
- `src/components/ErrorBoundary.tsx`
- `src/components/auth/components/photo-upload/PhotoTips.tsx`

### Step 3: Fix Category B Files (Partially Translated)
For each file listed in Category B, wrap the remaining hardcoded strings:
- `src/pages/LandingV2.tsx` (~30 strings)
- `src/components/landing/MobileSidebar.tsx` (~6 strings)
- `src/pages/Subscription.tsx` (~8 strings)
- `src/pages/BlockedUsers.tsx` (~6 strings)
- `src/pages/Matches.tsx` (~6 strings)
- `src/pages/Notifications.tsx` (~5 strings)
- `src/pages/HelpSupport.tsx` (~100+ FAQ strings)

### Step 4: Insert All Translations for All Languages
A single large SQL migration will insert rows for each new key across all 5 primary languages with proper translations:
- **English**: Original text
- **Kurdish Sorani**: Full Kurdish translation
- **Kurdish Kurmanci**: Full Kurmanci translation
- **Norwegian**: Full Norwegian translation
- **German**: Full German translation

### Technical Details

**Translation key naming convention** (matching existing patterns):
```
cookie.title, cookie.what_are_cookies, cookie.types_title, ...
privacy.title, privacy.introduction, privacy.info_collect, ...
terms.title, terms.acceptance, terms.eligibility, ...
guidelines.title, guidelines.be_respectful, ...
about.title, about.mission, about.values_title, ...
contact.title, contact.full_name, contact.email, ...
landing.nav.home, landing.nav.about, landing.nav.login, ...
match_popup.title, match_popup.send_message, ...
verification.selfie, verification.id_document, ...
```

**Estimated scope**:
- ~200 new translation keys
- ~1000 new rows in app_translations (200 keys x 5 languages)
- ~18 files to modify
- 1 SQL migration for all translation data

**Note on legal pages**: CookiePolicy, PrivacyPolicy, TermsOfService, and CommunityGuidelines contain long legal text. These will use translation keys for each section title and content block, allowing proper localization of legal documents.
