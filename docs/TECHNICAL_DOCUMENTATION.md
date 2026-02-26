# Complete Technical & Design Documentation

**App Name:** Kurdish Dating & Social Platform  
**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase  
**Last Updated:** 2026-02-26

---

## 1. App Overview

A culturally-focused dating and social networking platform designed for the Kurdish diaspora and homeland communities. Combines Tinder-style swipe matching with Instagram-style social feeds, group communities, events, stories, and real-time messaging. Supports 5 languages (EN, NO, Kurdish Sorani, Kurdish Kurmanji, DE) with full RTL support.

**Published URL:** `https://dating-profile-creator-45.lovable.app`  
**Supabase Project:** `bqgjfxilcpqosmccextj`

---

## 2. Target Users

| Segment | Description |
|---------|-------------|
| **Primary** | Kurdish singles (18-45) in diaspora (Norway, Germany, Sweden) seeking culturally compatible partners |
| **Secondary** | Kurds in homeland (South/North/East/West Kurdistan regions) |
| **Tertiary** | Non-Kurdish individuals interested in Kurdish culture |
| **Admin** | Platform operators managing content, users, and moderation |

---

## 3. Full Feature List

### Core Dating
- Tinder-style swipe cards (like/dislike/super-like/rewind/boost)
- AI-powered compatibility scoring (`calculate_compatibility` DB function)
- Match system with mutual-like detection
- Advanced search with filters (age, location, ethnicity, religion, body type, smoking, drinking, education)
- "Liked Me" and "Viewed Me" feeds
- Daily usage limits (likes, super-likes, boosts, rewinds) tied to subscription tier

### Social Layer
- Instagram-style discovery feed with posts (text + media)
- Post reactions (like, love, fire, haha, wow, sad, thoughtful, applause)
- Nested comments with mentions and comment likes
- Hashtag system with trending hashtags
- Stories (24h ephemeral content) with reactions and views
- User following/followers system
- Saved/bookmarked posts

### Groups & Events
- Community groups (public/private) with categories
- Group posts and membership management
- Events with RSVP/attendance tracking
- Event categories and max-attendee limits

### Communication
- Real-time 1:1 messaging (text + media + voice)
- Typing indicators (`typing_status` table + Supabase Realtime)
- Voice messages with duration tracking
- Read receipts
- Message moderation (AI-powered via `moderate-message` edge function)
- Muted conversations
- GIF search integration (`search-gifs` edge function)
- AI conversation insights (shared interests, suggested topics)
- Message translation (`translate-message` edge function)

### Audio/Video Calls
- WebRTC-based calls (`useWebRTC` hook)
- Call history tracking (`calls` table: voice/video, duration, status)

### Verification & Trust
- Phone verification via SMS (`send-sms-verification`, `verify-phone-code`)
- Video selfie verification (`VideoVerificationDialog`, `video_verifications` table)
- Document-based verification (`verification_requests`)
- Trust score system (`get_user_trust_score` DB function)
- Safety flags on messages (`message_safety_flags`)

### Subscription & Monetization
- Tiered subscriptions (free/premium) via Stripe
- Stripe Checkout (`create-checkout` edge function)
- Stripe Webhooks (`stripe-webhook` edge function)
- Customer portal (`customer-portal` edge function)
- Virtual gifts/coins economy (`user_coins`, `virtual_gifts` tables)
- Date proposals feature

### AI Features
- Bio generation (`generate-bio` edge function)
- AI Wingman chat assistant (`ai-wingman` edge function)
- Icebreaker suggestions (`generate-icebreakers`)
- Compatibility insights (`generate-insights`)
- Photo moderation (`moderate-photo`)

### Internationalization
- 5 languages: English, Norwegian, Kurdish Sorani (RTL), Kurdish Kurmanji, German
- `useTranslations` hook with `t(key, fallback)` pattern
- RTL layout support via `dir="rtl"` and CSS overrides
- DB-level translations: `app_translations`, `landing_page_v2_translations`, `registration_questions` (with `_en`, `_no`, `_ku_sorani`, `_ku_kurmanci`, `_de` columns)

### Cultural Features
- Kurdistan region selector (South/West/East/North Kurdistan)
- Chaperone mode (`chaperone_settings` table) for conservative users
- Marriage intentions declaration (`marriage_intentions` table)
- Religion and political views fields

---

## 4. Screen-by-Screen Breakdown

### 4.1 Public Screens (No Auth Required)

#### `/` — Landing Page (LandingV2)
- **Purpose:** Marketing/conversion page
- **Components:** Hero section, features grid, how-it-works steps, community section, gallery, CTA, footer
- **Backend:** `landing_page_v2_translations` table for CMS content
- **Navigation:** → `/auth`, → `/register`
- **Behavior:** Redirects to `/discovery` if authenticated

#### `/auth` — Login
- **Purpose:** Email/password authentication
- **Components:** Auth form, social login buttons, forgot password link
- **Backend:** `supabase.auth.signInWithPassword()`, `supabase.auth.signInWithOAuth()`
- **Navigation:** → `/discovery` (on success), → `/register`, → `/reset-password`

#### `/register` — Registration
- **Purpose:** Multi-step registration wizard
- **Components:** `WizardManager` with 7+ steps
- **Steps:** Step1AboutYou, Step2Lifestyle, Step3Values, Step4Relationships, Step7Favorites, photo upload, occupation selection
- **Backend:** `supabase.auth.signUp()`, then profile creation in `profiles` table
- **Validation:** Required fields (name, age, location, occupation, bio ≥20 chars, height, body type, ethnicity, religion, values ≥3, interests ≥3, hobbies ≥2, languages ≥1, education, relationship goals, want children, exercise habits, profile image)

#### `/reset-password` — Password Reset
- **Purpose:** Set new password after email link
- **Backend:** `supabase.auth.updateUser({ password })`

#### `/admin-login` — Super Admin Login
- **Purpose:** Separate admin authentication entry point

#### Static Pages: `/help`, `/community-guidelines`, `/privacy-policy`, `/terms`, `/about`, `/contact`, `/cookie-policy`

### 4.2 Protected Screens (Auth Required)

#### `/discovery` — Discovery Feed
- **Purpose:** Instagram-style social feed (primary home screen)
- **Components:** Post cards with reactions, comments, stories carousel, trending hashtags, groups sidebar
- **Backend:** `posts` table with realtime subscription (`useRealtimePosts`), `post_likes`, `post_reactions`, `post_comments`
- **Actions:** Like, react, comment, share, save post, create post
- **Navigation:** → `/post/:id`, → `/profile/:id`, → `/hashtag/:hashtag`, → `/create-post`

#### `/swipe` — Swipe Cards
- **Purpose:** Tinder-style dating card stack
- **Components:** Full-screen card stack, action buttons (dislike/like/super-like/rewind/boost), filter sidebar (`SwipeFilters`)
- **Backend:** `useDiscoveryProfiles`, `swipe_history`, `likes`, `matches`, `daily_usage`
- **Logic:** Excludes already-swiped profiles, blocked users; checks daily limits; creates match on mutual like
- **Animations:** `swipe-right`/`swipe-left` CSS keyframes, framer-motion transitions
- **Layout:** `fixed inset-0` with `overflow-hidden`, edge-to-edge cards

#### `/messages` — Messages/Chat
- **Purpose:** Conversation list + chat view
- **Components:** Conversation list, `ChatView` with message bubbles, typing indicator, voice recorder, media attachment
- **Backend:** `messages` table with Supabase Realtime, `conversation_metadata`, `muted_conversations`, `typing_status`
- **Features:** Online status badges, read receipts, message moderation, AI insights

#### `/my-profile` — Own Profile
- **Purpose:** View/edit own profile
- **Components:** Profile header, photo gallery, stats, edit sections
- **Backend:** `profiles`, `photos`, `profile_details`, `profile_preferences`

#### `/profile/:id` — User Profile (Instagram-style)
- **Purpose:** View another user's profile
- **Components:** `InstagramProfile` with dual-layer architecture (social vs dating profile)
- **Backend:** `useProfileAccess` hook checks subscription/match status
- **Access Control:** Free users see `BlurredProfileOverlay` on dating details; premium/matched users see full profile

#### `/discover` — Discover Hub
- **Purpose:** Aggregated discovery page
- **Components:** Trending hashtags, popular groups, nearby users, events
- **Navigation:** → `/search`, → `/groups`, → `/events`, → `/hashtag/:hashtag`

#### `/search` — Advanced Search
- **Purpose:** Filter and search profiles
- **Backend:** `search_profiles_fts` DB function (full-text search)

#### `/matches` — Matches
- **Purpose:** View mutual matches
- **Backend:** `matches` table

#### `/liked-me` — Who Liked Me
- **Backend:** `likes` table filtered by `likee_id = current_user`

#### `/viewed-me` — Who Viewed Me
- **Backend:** `profile_views` table, `useProfileViewTracking`

#### `/notifications` — Notifications
- **Backend:** `notifications` table with types: like, match, message, follow, comment, event, group

#### `/subscription` — Subscription Plans
- **Components:** Plan comparison cards, Stripe checkout integration
- **Backend:** `create-checkout` edge function, `user_subscriptions`

#### `/verification` — Identity Verification
- **Components:** Video verification dialog, document upload
- **Backend:** `submit-verification` edge function, `verification_requests`, `video_verifications`

#### `/compatibility/:userId` — Compatibility Insights
- **Backend:** `calculate-compatibility` edge function, `ai_conversation_insights`

#### `/gifts` — Gifts & Dates
- **Components:** Virtual gift shop, date proposals
- **Backend:** `virtual_gifts`, `user_coins`, `date_proposals`

#### `/create-post` — Create Post
- **Components:** Text editor, media upload, hashtag picker
- **Backend:** Insert into `posts`, auto-extract hashtags

#### `/create-event` — Create Event
- **Backend:** Insert into `events`

#### `/event/:id` — Event Detail
- **Backend:** `events`, `event_attendees`

#### `/post/:id` — Post Detail
- **Backend:** `posts`, `post_comments`, `post_likes`, `post_reactions`

#### `/saved` — Saved Posts
- **Backend:** `saved_posts` joined with `posts`

#### `/hashtag/:hashtag` — Hashtag Feed
- **Backend:** `posts` filtered by hashtags array, `hashtags` table

#### `/groups` — Groups List
- **Backend:** `groups`, `group_members`

#### `/groups/create` — Create Group
- **Backend:** Insert into `groups`

#### `/groups/:id` — Group Detail
- **Backend:** `groups`, `group_members`, `group_posts`

#### `/stories/create` — Create Story
- **Backend:** `stories` table

#### `/stories/:userId` — View Stories
- **Backend:** `stories`, `story_views`, `story_reactions`

#### `/discovery-nearby` — Nearby Users (Map)
- **Components:** Leaflet map integration
- **Backend:** `nearby_users` DB function (PostGIS `ST_DWithin`)

### 4.3 Settings Screens

| Route | Purpose |
|-------|---------|
| `/settings` | Main settings hub |
| `/settings/privacy` | Privacy controls (visibility, online status, read receipts, etc.) |
| `/settings/blocked` | Blocked users management |
| `/settings/phone-verification` | Phone number verification |
| `/settings/relationship` | Relationship preferences |
| `/notifications/settings` | Notification preferences |

**Backend:** `user_settings` table with granular `notifications_*` and `privacy_*` boolean/string fields

### 4.4 Super Admin Panel (`/super-admin/*`)

Protected by `SuperAdminGuard` component. 48 sub-pages:

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Dashboard | KPIs, charts, recent activity |
| `/users` | Users | CRUD user management, profile editor |
| `/verification` | Verification | Review verification requests |
| `/moderation` | Moderation | Content moderation queue |
| `/analytics` | Analytics | User engagement charts |
| `/ab-testing` | A/B Testing | Experiment management |
| `/system-health` | System Health | API performance, incidents |
| `/email-campaigns` | Email Campaigns | Marketing emails |
| `/exports` | Exports | Data export management |
| `/audit-logs` | Audit Logs | Admin action history |
| `/roles` | Roles | Role/permission management |
| `/bulk-actions` | Bulk Actions | Mass operations |
| `/categories` | Categories | Content categories |
| `/registration-questions` | Reg. Questions | Onboarding form config |
| `/messages` | Messages | Message oversight |
| `/photos` | Photos | Photo moderation |
| `/settings` | Settings | App-wide settings |
| `/subscribers` | Subscribers | Subscription management |
| `/payments` | Payments | Payment history |
| `/social-login` | Social Login | OAuth provider config |
| `/landing-page` | Landing Editor | CMS for landing page |
| `/translations` | Translations | i18n string management |
| `/likes` | Likes | Like analytics |
| `/matches` | Matches | Match management |
| `/comments` | Comments | Comment moderation |
| `/groups` | Groups | Group management |
| `/events` | Events | Event management |
| `/followers` | Followers | Follow analytics |
| `/notifications` | Notifications | Push notification management |
| `/hashtags` | Hashtags | Hashtag management |
| `/blocked-users` | Blocked Users | Block analytics |
| `/conversations` | Conversations | Conversation oversight |
| `/rate-limits` | Rate Limits | Usage limit config |
| `/daily-usage` | Daily Usage | Usage analytics |
| `/ai-insights` | AI Insights | AI feature analytics |
| `/interests` | Interests | Interest category management |
| `/support-tickets` | Support Tickets | User support queue |
| `/api-keys` | API Keys | External API key management |
| `/virtual-gifts` | Virtual Gifts | Gift catalog management |
| `/ghost-users` | Ghost Users | Inactive user detection |
| `/stories` | Stories | Story moderation |
| `/calls` | Calls | Call analytics |
| `/date-proposals` | Date Proposals | Date proposal oversight |
| `/marriage-intentions` | Marriage | Marriage intention analytics |
| `/safety-flags` | Safety Flags | Safety flag review |
| `/scheduled-content` | Scheduled Content | Content scheduling |
| `/profile-views` | Profile Views | View analytics |

---

## 5. Navigation Map

```
Landing (/) ─────────────────────────────────────────────────────┐
  ├── /auth (Login) ──────────────────────────────────────────┐  │
  ├── /register (Multi-step wizard) ──────────────────────────┤  │
  │                                                           │  │
  │  [Authenticated User]                                     ▼  │
  │  ┌─────────────────────────────────────────────────────────┐ │
  │  │                   BOTTOM NAVIGATION                     │ │
  │  │  Home(/discovery) | Swipe | Chat | Discover | Profile   │ │
  │  └─────────┬──────────┬───────┬────────┬──────────┬────────┘ │
  │            │          │       │        │          │           │
  │   Discovery Feed   Swipe   Messages  Discover   My Profile  │
  │     ├─ /post/:id   Cards    ├─ Chat    Hub       ├─ Edit     │
  │     ├─ /create-post         │         ├─ /search  ├─ Photos  │
  │     ├─ /hashtag/:tag        │         ├─ /groups  ├─ Settings │
  │     ├─ /profile/:id         │         ├─ /events  │           │
  │     └─ /stories/:uid        │         ├─ /matches │           │
  │                              │         ├─ /liked-me│          │
  │                              │         └─ /viewed-me          │
  │                                                               │
  │  [Admin users: bottom nav shows Admin instead of Profile]     │
  │  /super-admin/* ── 48 admin sub-pages                         │
  └───────────────────────────────────────────────────────────────┘
```

**Route Protection:**
- `ProtectedRoute` wrapper checks `supabase.auth` session
- `SuperAdminGuard` checks `user_roles` table for `super_admin` role
- Public routes redirect authenticated users to `/discovery`
- Bottom nav hidden on: `/`, `/auth`, `/register`, `/auth/callback`, `/admin-login`, `/admin-setup`, `/create-admin`, `/complete-profile`, `/super-admin/*`

---

## 6. Design System

### 6.1 Theme: "Midnight Rose"

Dark mode is the **default and primary** theme.

#### Primary Colors (HSL → HEX approximations)

| Token | HSL | HEX | Usage |
|-------|-----|-----|-------|
| `--background` | `271 33% 9%` | `#170F21` | App background |
| `--foreground` | `0 0% 95%` | `#F2F2F2` | Primary text |
| `--card` | `268 37% 17%` | `#2A1E3D` | Card surfaces |
| `--primary` | `336 90% 60%` | `#F43F8E` | CTAs, active states, brand accent |
| `--primary-light` | `336 80% 70%` | `#F77BAE` | Hover states |
| `--primary-dark` | `268 37% 17%` | `#2A1E3D` | Deep accent |
| `--accent` | `340 95% 71%` | `#FB6FA9` | Secondary accent |
| `--secondary` | `265 35% 14%` | `#1F1533` | Secondary surfaces |
| `--muted` | `265 35% 14%` | `#1F1533` | Muted backgrounds |
| `--muted-foreground` | `270 20% 63%` | `#9E8AB3` | Secondary text |
| `--border` | `268 25% 25%` | `#3D2E52` | Borders |
| `--destructive` | `0 84% 60%` | `#EF4444` | Delete/error |
| `--success` | `142 76% 36%` | `#16A34A` | Success states |
| `--warning` | `38 92% 50%` | `#F59E0B` | Warning states |
| `--info` | `217 91% 60%` | `#3B82F6` | Info states |
| `--ring` | `336 90% 60%` | `#F43F8E` | Focus rings |

#### Tinder Legacy Colors (hardcoded in tailwind.config)
```
tinder-rose: #F43F8E
tinder-orange: #FB6FA9
tinder-dark: #140F1F
```

#### Gradients
| Name | Value |
|------|-------|
| `--gradient-primary` | `linear-gradient(135deg, hsl(268 37% 17%), hsl(336 90% 60%))` |
| `--gradient-bg` | `linear-gradient(135deg, hsl(271 33% 9%), hsl(265 35% 14%) 50%, hsl(268 37% 17%))` |
| `gradient-tinder` | `linear-gradient(to right, #F43F8E, #FB6FA9)` |
| `gradient-brand` | `linear-gradient(135deg, #2A1E45, #F43F8E)` |

#### Light Mode
Overrides via `.light` class. White background (`0 0% 100%`), dark foreground (`240 10% 3.9%`). Primary colors remain the same rose/pink.

### 6.2 Typography

| Element | Font | Weight | Notes |
|---------|------|--------|-------|
| **Body** | Quicksand, Poppins, Inter | 400 | `font-feature-settings: "rlig" 1, "calt" 1` |
| **Headings** | Quicksand | 500 (medium) | `tracking-tight` |
| **Kurdish Sorani** | Noto Sans Arabic | 300-900 | RTL, `direction: rtl` |
| **Kurdish Bold** | Noto Sans Arabic | 700 | `.font-kurdistan` class |

**Font Scale:** Uses Tailwind defaults (`text-xs` through `text-9xl`). Bottom nav labels: `text-[11px]`.

### 6.3 Spacing & Layout

| Token | Value |
|-------|-------|
| `--radius` | `1rem` (16px) |
| Border radius lg | `var(--radius)` = 16px |
| Border radius md | `calc(var(--radius) - 2px)` = 14px |
| Border radius sm | `calc(var(--radius) - 4px)` = 12px |
| Container max-width | `1400px` (2xl) |
| Container padding | `2rem` |
| Bottom nav height | `56px` |
| Action button | `48px` (sm: `64px`) |
| Action button big | `64px` (sm: `80px`) |

**Breakpoints:**
```
xs: 475px | sm: 640px | md: 768px | lg: 1024px | xl: 1280px | 2xl: 1536px
```

**Safe Area:** `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` for iOS notch support.

### 6.4 Component Styles

**Glass Effect:**
```css
.glass { background: hsla(265, 35%, 14%, 0.6); backdrop-filter: blur(24px); border: 1px solid hsla(268, 25%, 25%, 0.3); }
```

**Neo Card:**
```css
.neo-card { backdrop-filter: blur(4px); background: hsl(265 35% 14% / 0.6); border: 1px solid hsl(268 25% 25% / 0.4); border-radius: 12px; }
```

**Swipe Card:** `rounded-3xl`, height `clamp(400px, 85vh, 800px)`, gradient overlay bottom 2/3.

**Bottom Navigation:** `bg-card/95 backdrop-blur-xl`, fixed bottom, `z-[100]`, active dot indicator (1.5x6px primary circle).

### 6.5 Animations

| Name | Duration | Easing | Description |
|------|----------|--------|-------------|
| `fade-in` | 0.4s | ease-out | Opacity 0→1 |
| `fade-up` | 0.5s | ease-out | Opacity + translateY(10px→0) |
| `scale-in` | 0.3s | ease-out | Scale 0.95→1 |
| `swipe-right` | 0.5s | ease-out | translateX(0→150%) rotate(0→30deg) |
| `swipe-left` | 0.5s | ease-out | translateX(0→-150%) rotate(0→-30deg) |
| `bounce-in` | 0.5s | ease-out | Scale 0.8→1.1→1 |
| `pulse-heart` | 1.5s | infinite | Scale 1→1.25→1 |
| `midnight-pulse` | 4s | ease-in-out infinite | Opacity 0.3→0.6→0.3 |
| `ai-pulse` | 3s | infinite | Box-shadow pulse with primary color |
| `shimmer` | 2s | infinite | Horizontal shine sweep |
| `shine` | 3s | infinite | Wider fancy shine sweep |

**Framer Motion:** Used extensively for page transitions (`PageTransition` component), card animations, and micro-interactions.

---

## 7. Database Architecture

### 7.1 Tables (48 tables)

#### Core User Data

| Table | Purpose | Key Fields | Relationships |
|-------|---------|------------|---------------|
| `profiles` | Main user profile | `id` (FK→auth.users), `name`, `age`, `location`, `gender`, `bio`, `occupation`, `profile_image`, `kurdistan_region`, `ethnicity`, `religion`, `height`, `body_type`, `education`, `relationship_goals`, `want_children`, `exercise_habits`, `interests[]`, `values[]`, `hobbies[]`, `languages[]`, `verified`, `video_verified`, `phone_number`, `phone_verified`, `latitude`/`longitude`, `geo_location` (PostGIS geometry), `travel_mode_active`, `travel_location`, `dating_profile_visible`, `blur_photos`, `notification_preferences`, `last_active`, `is_generated` | Central table; most tables FK to this |
| `profile_details` | Extended profile (1:1) | `profile_id` (FK→profiles), `body_type`, `ethnicity`, `religion`, `education`, `height`, `zodiac_sign`, `personality_type`, `smoking`, `drinking`, 30+ lifestyle fields | 1:1 with profiles |
| `profile_preferences` | Dating preferences | `profile_id` (FK→profiles), filter preferences | 1:1 with profiles |
| `profile_interests` | Interest tags (M:M) | `profile_id`, `interest_id` | FK→profiles, FK→interests |
| `photos` | User photos | `profile_id`, `url`, `is_primary` | FK→profiles |
| `user_roles` | Role assignments | `user_id` (FK→profiles), `role` (enum: super_admin, admin, moderator, user) | Separate from profiles for security |
| `user_settings` | Per-user preferences | `user_id`, `notifications_*` (12 boolean fields), `privacy_*` (12 fields) | |
| `user_subscriptions` | Subscription state | `user_id`, `subscription_type`, `expires_at` | FK→profiles |
| `user_coins` | Virtual currency balance | `user_id`, `balance`, `total_earned`, `total_spent` | 1:1 with profiles |

#### Social Features

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `posts` | Social feed posts | `user_id`, `content`, `media_url`, `media_type`, `hashtags[]`, `likes_count`, `comments_count`, reaction counts (love, fire, haha, wow, sad, thoughtful, applause, `total_reactions`) |
| `post_comments` | Nested comments | `post_id`, `user_id`, `content`, `parent_comment_id`, `depth`, `likes_count`, `mentions[]` |
| `post_likes` | Post likes | `post_id`, `user_id` |
| `post_reactions` | Emoji reactions | `post_id`, `user_id`, `reaction_type` |
| `comment_likes` | Comment likes | `comment_id`, `user_id` |
| `saved_posts` | Bookmarks | `post_id`, `user_id` |
| `hashtags` | Hashtag registry | `name`, `usage_count`, `last_used_at` |
| `followers` | Follow relationships | `follower_id`, `following_id` |
| `stories` | Ephemeral stories | `user_id`, `media_url`, `media_type`, `expires_at`, `view_count` |
| `story_views` | Story view tracking | `story_id`, `viewer_id` |

#### Dating Features

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `likes` | Profile likes | `liker_id`, `likee_id` |
| `matches` | Mutual matches | `user1_id`, `user2_id`, `matched_at` |
| `swipe_history` | Swipe log | `user_id`, `swiped_profile_id`, `action` (like/dislike/super_like), `rewound` |
| `daily_usage` | Daily action limits | `user_id`, `date`, `likes_count`, `super_likes_count`, `boosts_count`, `rewinds_count` |
| `date_proposals` | Date invitations | `proposer_id`, `recipient_id`, `activity`, `proposed_date`, `location`, `status` |
| `marriage_intentions` | Marriage goals | `user_id`, `intention`, `timeline`, `family_plans`, `visible_on_profile` |
| `compatibility_scores` | Cached scores | |

#### Communication

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `messages` | Chat messages | `sender_id`, `recipient_id`, `text`, `media_url`, `media_type`, `media_duration`, `read` |
| `conversation_metadata` | Conversation state | `user1_id`, `user2_id`, `last_message_at`, `is_archived` |
| `typing_status` | Typing indicators | `conversation_id`, `user_id`, `is_typing` |
| `muted_conversations` | Muted chats | `user_id`, `muted_user_id`, `muted_until` |
| `calls` | Call history | `caller_id`, `callee_id`, `call_type` (voice/video), `status`, `duration_seconds`, `started_at`, `ended_at` |
| `ai_conversation_insights` | AI analysis | `user_id`, `conversation_partner_id`, `shared_interests`, `suggested_topics`, `communication_style` |

#### Safety & Moderation

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `blocked_users` | Block list | `blocker_id`, `blocked_id`, `reason` |
| `reports` | Content reports | `reporter_user_id`, `reported_user_id`, `content_type`, `content_id`, `reason`, `status`, `admin_notes` |
| `reported_messages` | Message reports | `reporter_id`, `reported_user_id`, `message_id`, `reason`, `status` |
| `moderation_actions` | Admin actions log | `admin_id`, `content_id`, `content_type`, `action_type`, `duration_hours` |
| `message_safety_flags` | AI-detected flags | `sender_id`, `recipient_id`, `message_id`, `flag_type`, `severity`, `ai_detected` |
| `message_rate_limits` | Rate limiting | `user_id`, `message_count`, `window_start` |

#### Verification

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `verification_requests` | ID verification | `user_id`, `verification_type`, `document_url`, `selfie_url`, `status`, `rejection_reason` |
| `video_verifications` | Video selfie | `user_id`, `video_url`, `thumbnail_url`, `confidence_score`, `status`, `verified_at` |
| `phone_verifications` | Phone OTP | `user_id`, `phone_number`, `verification_code`, `expires_at`, `attempts`, `verified` |

#### Groups & Events

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `groups` | Community groups | `name`, `description`, `category`, `privacy`, `created_by`, `member_count`, `post_count`, `cover_image` |
| `group_members` | Membership | `group_id`, `user_id`, `role` (admin/member) |
| `group_posts` | Group-post mapping | `group_id`, `post_id` |
| `events` | Events | `user_id`, `title`, `description`, `event_date`, `location`, `category`, `max_attendees`, `attendees_count`, `image_url` |
| `event_attendees` | RSVPs | `event_id`, `user_id` |

#### Notifications & Push

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `notifications` | In-app notifications | `user_id`, `type`, `title`, `message`, `link`, `read`, `actor_id`, `post_id`, `group_id` |
| `push_subscriptions` | Web push endpoints | `user_id`, `endpoint`, `p256dh`, `auth`, `is_active` |

#### Admin & System

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `admin_activities` | Admin activity log | `user_id`, `activity_type`, `description` |
| `admin_audit_log` | Detailed audit trail | `user_id`, `action_type`, `table_name`, `record_id`, `changes` (JSON) |
| `app_settings` | Key-value config | `key`, `value` |
| `system_settings` | Categorized settings | `setting_key`, `setting_value` (JSON), `category` |
| `system_metrics` | Health metrics | `metric_type`, `metric_data` (JSON), `severity`, `timestamp` |
| `dashboard_stats` | Dashboard KPIs | `stat_name`, `stat_value`, `change_percentage`, `trend`, `icon` |
| `user_engagement` | Engagement analytics | `date`, `users`, `views`, `likes`, `matches`, `conversations` |

#### Content Management

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `content_categories` | Category system | `name`, `slug`, `description`, multilingual name/desc fields |
| `category_items` | Items in categories | `category_id`, `name`, `item_type`, multilingual fields |
| `registration_questions` | Dynamic reg form | `text`, `field_type`, `profile_field`, `registration_step`, `required`, multilingual fields |
| `interests` | Interest master list | `name`, `category` |

#### Translations & Landing

| Table | Purpose |
|-------|---------|
| `app_translations` | i18n string table (`translation_key`, `translation_value`, `language_code`, `category`) |
| `landing_page_content` | Legacy landing content |
| `landing_page_sections` | Section-based CMS |
| `landing_page_translations` | Landing i18n |
| `landing_page_v2_translations` | V2 landing CMS (hero, features, community, CTA, footer per language) |
| `landing_page_snapshots` | Version history |

#### Payments

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `payments` | Payment records | `user_id`, `amount`, `currency`, `status`, `subscription_type`, `stripe_payment_intent_id_encrypted`, `stripe_customer_id_encrypted` |
| `data_exports` | Data export jobs | `export_type`, `format`, `status`, `file_url`, `row_count` |

#### Miscellaneous

| Table | Purpose |
|-------|---------|
| `ab_tests` | A/B test configuration |
| `email_campaigns` | Email marketing |
| `chaperone_settings` | Conservative mode (chaperone can view messages/photos) |
| `support_tickets` | User support system |
| `virtual_gifts` | Gift catalog |
| `scheduled_content` | Scheduled publishing |

### 7.2 Database Views

| View | Purpose |
|------|---------|
| `user_public_profile` | Public-safe profile projection |
| `user_public_view` | Another public projection |

### 7.3 Key Database Functions

| Function | Purpose |
|----------|---------|
| `calculate_compatibility(user1, user2)` | Returns compatibility score (0-100) |
| `nearby_users(lat, long, radius_km, max_results)` | PostGIS proximity search |
| `search_profiles_fts(query)` | Full-text search across profiles |
| `get_notification_counts(user_id)` | Returns unread counts by type |
| `get_or_create_daily_usage(user_id)` | Upserts daily usage record |
| `get_user_trust_score(user_id)` | Calculates trust from verification + flags |
| `has_role(user_id, role)` | Security-definer role check |
| `is_super_admin(user_id)` | Admin check |
| `is_user_blocked(target_id)` | Block check |
| `is_group_admin(group_id, user_id)` | Group admin check |
| `is_group_member(group_id, user_id)` | Membership check |
| `is_profile_complete(profile_id)` | Completeness check |
| `can_perform_action(action_type)` | Daily limit check |
| `increment_usage_count(action_type)` | Increment daily counter |
| `publish_scheduled_content()` | Cron-triggered publisher |
| `add_story_reaction(story_id, user_id, emoji)` | Story reaction handler |
| `insert_encrypted_payment(...)` | Encrypted payment insert |
| `enrich_all_profiles_with_kurdish_data()` | Test data seeder |

### 7.4 Enums

```sql
app_role: 'super_admin' | 'admin' | 'moderator' | 'user'
```

---

## 8. User Flows

### 8.1 Registration Flow
```
Landing → /register → Step1 (Name, Age, Gender, Location, Kurdistan Region)
→ Step2 (Height, Body Type, Exercise, Smoking, Drinking, Diet, Sleep, Pets)
→ Step3 (Religion, Political Views, Values ≥3, Ethnicity)
→ Step4 (Relationship Goals, Want Children, Love Language, Communication Style)
→ Step5 (Photo Upload, Profile Image)
→ Step6 (Occupation Selection)
→ Step7 (Interests ≥3, Hobbies ≥2, Favorites)
→ Bio Writing (≥20 chars, AI generation available)
→ Languages Selection (≥1)
→ Education Selection
→ Profile Created → /discovery
```

### 8.2 Swipe & Match Flow
```
/swipe → Load profile stack (excludes: already swiped, blocked, self)
→ User swipes right (like):
    → Check daily limit (can_perform_action)
    → Insert into swipe_history
    → Insert into likes
    → Check if target already liked current user
        → YES: Create match in matches table → Show MatchPopup → Enable messaging
        → NO: Continue
→ User swipes left (dislike):
    → Insert into swipe_history
→ Super Like: Same as like but with boost notification
→ Rewind: Mark last swipe as rewound, re-show card
→ Boost: Increase visibility for X minutes
```

### 8.3 Messaging Flow
```
Match created → Conversation appears in /messages
→ User opens conversation → Load messages (Supabase query + Realtime subscription)
→ Type message → typing_status updated via Realtime
→ Send message:
    → Insert into messages
    → moderate-message edge function (AI safety check)
    → If flagged → insert into message_safety_flags
    → Update conversation_metadata.last_message_at
    → Send push notification (send-push-notification edge function)
→ Recipient opens → Mark messages as read
```

### 8.4 Post Creation Flow
```
/create-post → Enter text content → Optionally attach media (image/video)
→ Auto-extract #hashtags from content
→ Insert into posts table
→ Upsert hashtags table (increment usage_count)
→ Notify followers
```

### 8.5 Verification Flow
```
/verification → Choose type (video selfie / document)
→ Video: Record selfie following prompts (turn head left, right, smile)
    → Upload to Supabase Storage
    → submit-verification edge function
    → Insert into video_verifications (status: pending)
    → Admin reviews in /super-admin/verification
    → Approved → profiles.video_verified = true
→ Document: Upload ID photo
    → Insert into verification_requests
    → Admin review → profiles.verified = true
```

### 8.6 Subscription Flow
```
/subscription → Select plan → create-checkout edge function
→ Redirect to Stripe Checkout
→ stripe-webhook receives payment confirmation
→ Insert/update user_subscriptions
→ Redirect back to app with success
```

---

## 9. Admin Capabilities

**Access Control:** `SuperAdminGuard` checks `user_roles` table for `super_admin` role via `useAdminRoleCheck` hook. All mutations go through `admin-actions` edge function with service-role key, logged in `admin_audit_log`.

**Key Capabilities:**
- Full user CRUD (view/edit/ban/delete profiles, profile_details, profile_preferences)
- Content moderation (posts, comments, photos, messages)
- Verification request review (approve/reject with reason)
- Safety flag review and action
- A/B test management
- Email campaign management
- App settings configuration
- Translation management
- Landing page CMS
- Registration form configuration
- Data export generation
- Role assignment (super_admin, admin, moderator)
- System health monitoring
- Bulk actions on users
- Support ticket management
- API key management

---

## 10. Notification System

### In-App Notifications
- Stored in `notifications` table
- Types: `like`, `match`, `message`, `follow`, `comment`, `mention`, `event`, `group`
- Read/unread tracking
- Badge counts on bottom nav (messages, discover hub aggregated)
- `useNotifications` hook polls `get_notification_counts` DB function

### Web Push Notifications
- Service Worker based (browser push API)
- `usePushNotifications` hook manages subscription
- `push_subscriptions` table stores endpoints (VAPID keys)
- `send-push-notification` edge function sends via Web Push Protocol
- `usePushNotificationTriggers` hook triggers on new matches/likes/messages
- Cleanup: `cleanup_dead_push_subscriptions`, `cleanup_inactive_push_subscriptions` DB functions

### Notification Settings
- 12 granular toggles in `user_settings`:
  - `notifications_messages`, `notifications_matches`, `notifications_likes`
  - `notifications_comments`, `notifications_follows`, `notifications_mentions`
  - `notifications_events`, `notifications_groups`, `notifications_profile_views`
  - `notifications_push`, `notifications_email`, `notifications_sms`, `notifications_marketing`

---

## 11. Security & Privacy Structure

### Authentication
- Supabase Auth (email/password + OAuth)
- JWT-based session with auto-refresh
- `onAuthStateChange` listener for session management

### Authorization
- Row-Level Security (RLS) on all tables
- `user_roles` table (separate from profiles) with `has_role()` security-definer function
- `SuperAdminGuard` component for admin routes
- `ProtectedRoute` component for authenticated routes
- `useProfileAccess` hook gates dating profile access by subscription tier + match status

### Data Privacy
- Privacy settings per user: profile visibility, online status, read receipts, last active, age, distance, discoverable, profile views
- Blocked users fully excluded from all queries
- Photo blur option (`blur_photos` field)
- Muted conversations
- Data export capability (`data_exports` table)
- Account deletion/deactivation flow (types in `src/types/account.ts`)

### Content Safety
- AI message moderation (`moderate-message` edge function)
- AI photo moderation (`moderate-photo` edge function)
- Message safety flags with severity levels
- Report system (users, messages, content)
- Message rate limiting (`message_rate_limits`)
- Admin audit log for all admin actions

### Encryption
- Payment data stored encrypted (`*_encrypted` columns)
- `insert_encrypted_payment` DB function

### Input Validation
- `useSecureForm` hook
- `useEmailValidation` hook
- Zod schemas for form validation
- DOMPurify for HTML sanitization (`isomorphic-dompurify`)

---

## 12. Performance Considerations

### Code Splitting
- All pages lazy-loaded via `React.lazy()` + `Suspense`
- Shared loading component (`SharedPageLoader`)
- Route-level code splitting (5 route groups: public, protected, settings, groups, admin)

### Image Optimization
- `browser-image-compression` for client-side compression before upload
- `useImageCompression` hook
- Lazy loading with blur-up animation (`.image-blur-up` class)

### Data Fetching
- TanStack React Query for caching and deduplication
- Supabase Realtime for messages, typing indicators, posts
- `useThrottledAction` hook for rate-limited operations
- `useAutoSave` hook for form auto-persistence

### Rendering
- Overscroll behavior disabled (`overscroll-behavior: none`)
- Touch action manipulation for mobile performance
- Scrollbar hiding utilities
- `100dvh` for proper mobile viewport

### Database
- PostGIS extension for geospatial queries (proximity search)
- Full-text search function (`search_profiles_fts`)
- Indexed foreign keys on all relationship tables
- Daily usage upsert function to avoid race conditions
- 1000-row default query limit (Supabase)

---

## 13. Missing Improvements & Potential Optimizations

### Architecture
1. **No offline support** — No service worker caching strategy for offline access
2. **No virtual scrolling** — Long lists (messages, feeds) render all items; should use `react-window` or `tanstack-virtual`
3. **No image CDN** — Images served directly from Supabase Storage; should use Supabase Image Transformations or a CDN
4. **Profile data duplication** — `profiles` table has ~70 columns; `profile_details` duplicates some fields. Should consolidate or use JSONB for optional fields

### Performance
5. **No SSR/SSG** — Pure SPA; landing page would benefit from pre-rendering for SEO
6. **No skeleton loaders** — Uses spinner-based `SharedPageLoader` instead of content-aware skeletons
7. **Bundle size** — Leaflet, Recharts, and framer-motion are large; consider dynamic imports for map/chart pages only
8. **No query pagination** — Many queries fetch all results; should implement cursor-based pagination

### Security
9. **Admin role check on client** — `BottomNavigation` checks `user_roles` via client query (supplementary to server-side guard, but unnecessary exposure)
10. **No CSRF protection** — Relies on Supabase JWT; standard for SPAs but worth noting
11. **No content security policy headers** — Should add CSP headers

### Features
12. **No read receipt UI in conversations list** — Read status exists in DB but conversation list doesn't show it
13. **No message search** — No full-text search for chat messages
14. **No profile deduplication** — Generated profiles (`is_generated`) mixed with real ones; no clear separation in admin
15. **No automated test suite** — No unit/integration/e2e tests found
16. **Chaperone mode incomplete** — Table exists but full UX flow (chaperone invitation, dashboard) may not be fully implemented
17. **No WebSocket fallback** — Relies entirely on Supabase Realtime; no polling fallback
18. **No email verification enforcement** — Users can access app without verifying email

### i18n
19. **Translation coverage** — Active i18n effort (8 rounds completed) but some strings may still be hardcoded
20. **No pluralization rules** — `t(key, fallback)` pattern doesn't handle plural forms

### UX
21. **No dark/light mode toggle in UI** — Light mode CSS exists but no visible toggle for users
22. **No onboarding tour** — New users go straight to discovery with no guided introduction
23. **No PWA manifest** — Not installable as a Progressive Web App despite mobile-first design

---

## 14. Edge Functions (28 functions)

| Function | Purpose | Trigger |
|----------|---------|---------|
| `admin-actions` | Service-role admin mutations | Admin panel actions |
| `admin-delete-user` | User deletion | Admin action |
| `ai-wingman` | AI chat assistant | User request |
| `calculate-compatibility` | Compatibility scoring | Profile view / match |
| `calculate-match-score` | Match scoring | Swipe action |
| `check-subscription` | Subscription validation | Feature gating |
| `collect-system-metrics` | System health data | Scheduled/admin |
| `create-checkout` | Stripe checkout session | Subscription page |
| `create-super-admin` | First admin setup | Setup flow |
| `customer-portal` | Stripe customer portal | Settings |
| `extract-texts` | Text extraction | Translation tool |
| `generate-bio` | AI bio generation | Registration |
| `generate-icebreakers` | Conversation starters | Chat |
| `generate-insights` | AI conversation insights | Chat |
| `manage-api-keys` | API key CRUD | Admin |
| `moderate-message` | AI message moderation | Message send |
| `moderate-photo` | AI photo moderation | Photo upload |
| `search-gifs` | GIF search API | Chat |
| `send-push-notification` | Web push delivery | Various triggers |
| `send-sms-verification` | SMS OTP | Phone verification |
| `setup-admin` | Admin configuration | Setup |
| `stripe-webhook` | Stripe event handler | Stripe callbacks |
| `submit-verification` | Verification submission | Verification flow |
| `sync-all-translations` | Bulk translation sync | Admin |
| `sync-translations` | Translation sync | Admin |
| `translate-message` | Message translation | Chat |
| `verify-phone-code` | OTP validation | Phone verification |

---

*End of documentation.*
