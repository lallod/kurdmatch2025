

# Full Translation Wiring Plan -- 100% App Coverage

## The Problem

The database has **294 translation keys** perfectly synchronized across all 5 languages (English, Kurdish Sorani, Kurdish Kurmanci, German, Norwegian). However, **only `BottomNavigation.tsx`** actually uses the `t()` function. Every other page renders hardcoded English text that ignores the user's language setting.

**Bottom line**: Changing the language in the app settings does nothing except change the bottom nav labels.

---

## Scope of Work

### Pages to Wire Up (30+ files)

Every file below contains hardcoded English strings that need to be replaced with `t('key', 'Fallback')` calls:

**Authentication (3 files)**
- `Auth.tsx` -- "Welcome Back", "Log in to continue", "Email", "Password", "Log In", "Logging In...", "Don't have an account? Sign up", "Back to Landing Page"
- `Register.tsx` -- "Join Our Community", "Create your account in just a few simple steps", "Back to Home", "Already have an account? Sign in here"
- `CompleteProfile.tsx` -- onboarding step labels

**Core User Pages (8 files)**
- `DiscoveryFeed.tsx` -- "For You", "Following", "Search", "No posts yet", "No posts from people you follow", "Follow people to see their posts here"
- `Swipe.tsx` -- "Loading profiles...", "Finding your perfect matches", "No more profiles", "Check back later!", "Profile passed", "It's a match!", "Profile liked!", "Super like sent!"
- `Messages.tsx` -- "Messages", "New Matches", "Start chatting", "Type a message...", "Send", "No conversations yet" (~50+ strings)
- `Profile.tsx` -- "Loading profile...", "Profile not found", "Go back", "Basic Info", "Career & Education", "Lifestyle", "Beliefs & Values", "Relationships", field labels (Height, Body Type, Ethnicity, etc.)
- `MyProfile.tsx` -- "Profile", "Views", "Likes", "Matches", "Complete your profile", "Share Profile", "Edit Profile", "Profile Sections", section labels
- `Notifications.tsx` -- "Activity", "All", "Unread", "Mark all read", "No notifications yet", "New Like", "New Comment", "Profile View"
- `Settings.tsx` -- "Settings"
- `ViewedMe.tsx` -- page title and labels

**Social Features (8 files)**
- `HashtagFeed.tsx` -- heading, empty states
- `PostDetail.tsx` -- "Comments", "Write a comment...", "Post"
- `CreatePost.tsx` -- "Create Post", "What's on your mind?"
- `CreateStory.tsx` -- story creation labels
- `Events.tsx` -- "Events", "Create Event"
- `EventDetail.tsx` -- event detail labels
- `Groups.tsx` -- "Groups", "Create Group"
- `GroupDetail.tsx` -- group detail labels

**Other Pages (7 files)**
- `Matches.tsx` -- "Matches", empty states
- `LikedMe.tsx` -- "Who Liked Me"
- `BlockedUsers.tsx` -- "Blocked Users"
- `Subscription.tsx` -- plan names, pricing labels
- `HelpSupport.tsx` -- "Help & Support"
- `AdvancedSearch.tsx` -- search labels
- `Verification.tsx` -- verification labels

**Key Components (15+ files)**
- `BottomNavigation.tsx` -- already done
- `components/landing/Footer.tsx` -- footer links text
- `components/ErrorBoundary.tsx` -- error messages
- `components/LoadingState.tsx` -- loading text
- `components/EmptyState.tsx` -- empty state text
- `components/auth/components/SocialLogin.tsx` -- "Or continue with"
- `components/auth/components/basic-info/BasicInfoHeader.tsx` -- "Basic Info", "Tell us about yourself"
- `components/my-profile/AccountSettings.tsx` -- all settings labels
- `components/swipe/SwipeCard.tsx` -- card labels
- `components/chat/` -- all chat UI components
- `components/discovery/PostCard.tsx` -- post interaction labels
- `components/notifications/NotificationBell.tsx` -- notification labels

### New Translation Keys Needed

Approximately **200+ new translation keys** need to be added to the database across these categories:

| Category | Estimated New Keys | Examples |
|---|---|---|
| `auth.*` | ~15 | `auth.welcome_back`, `auth.back_to_landing`, `auth.logging_in` |
| `discovery.feed.*` | ~10 | `discovery.feed.for_you`, `discovery.feed.following`, `discovery.feed.no_posts` |
| `swipe.*` | ~15 | `swipe.loading`, `swipe.no_more`, `swipe.its_a_match`, `swipe.profile_liked` |
| `messages.*` | ~25 | `messages.type_message`, `messages.no_conversations`, `messages.new_matches` |
| `profile.*` | ~30 | `profile.loading`, `profile.not_found`, `profile.basic_info`, all field labels |
| `my_profile.*` | ~20 | `my_profile.views`, `my_profile.likes`, `my_profile.complete_profile` |
| `notifications.*` | ~15 | `notifications.activity`, `notifications.mark_all_read`, `notifications.no_notifications` |
| `social.*` | ~15 | `social.create_post`, `social.whats_on_mind`, `social.comments` |
| `settings.*` | ~10 | settings labels |
| `events.*` | ~10 | event labels |
| `groups.*` | ~10 | group labels |
| `subscription.*` | ~10 | plan/pricing labels |
| `misc.*` | ~15 | error boundary, loading states, empty states |

**Total: ~200 new keys x 5 languages = ~1000 new database rows**

---

## Implementation Plan

### Phase 1: Create New Translation Keys Edge Function
Create a new edge function `sync-all-translations` that inserts all ~200 new keys with proper translations for all 5 languages in one batch.

### Phase 2: Wire Up Core Pages (highest user impact)
Modify each page file to:
1. Import `useTranslations`
2. Destructure `const { t } = useTranslations()`
3. Replace every hardcoded English string with `t('key', 'Fallback')`

**Priority order:**
1. `Auth.tsx` + `Register.tsx` (first thing users see)
2. `DiscoveryFeed.tsx` (main page)
3. `Swipe.tsx` (core feature)
4. `Messages.tsx` (core feature)
5. `Profile.tsx` + `MyProfile.tsx` (user profiles)
6. `Notifications.tsx` (activity page)
7. `Settings.tsx` (where language is changed)

### Phase 3: Wire Up Secondary Pages
- Social features (Posts, Stories, Events, Groups)
- Utility pages (Subscription, Help, Verification, etc.)

### Phase 4: Wire Up Shared Components
- LoadingState, EmptyState, ErrorBoundary
- Auth sub-components (BasicInfoHeader, SocialLogin)
- Chat components
- Profile display components

---

## Technical Details

### Files to create (1):
- `supabase/functions/sync-all-translations/index.ts` -- Edge function with ~1000 INSERT statements

### Files to modify (~35):
Every page and key component listed above -- each gets `useTranslations` import and `t()` calls replacing hardcoded strings.

### Database operations:
- INSERT ~1000 rows (200 new keys x 5 languages)

### Important notes:
- All `t()` calls include English fallback text, so the app works even if translations fail to load
- The `useTranslations` hook already caches translations per language, so adding it to more components does not multiply API calls
- RTL support for Kurdish Sorani would be a separate future effort

### Estimated effort:
This is a very large change touching 35+ files with ~500+ string replacements. It will be done methodically, page by page, starting with the highest-traffic screens.

