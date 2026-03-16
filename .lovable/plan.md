

# Full Application Audit: KurdMatch

## 1. Executive Summary

KurdMatch is a Kurdish dating/social platform with a surprisingly broad feature set: swipe matching, social feed (posts/stories), groups, events, gifts/coins, video calls, AI-powered compatibility, subscription tiers, and a comprehensive super admin panel. The codebase demonstrates significant architectural effort with proper auth patterns, RLS policies, input validation, and internationalization.

**However, the app is NOT launch-ready.** Several critical security findings remain unresolved, the codebase contains substantial dead code (ghost/demo data generators), 668+ console.log statements leak in production despite a logger utility being created, and key infrastructure items (leaked password protection, Postgres upgrade) remain undone. The security scanner still flags 2 errors and 4 warnings.

**Verdict: Partially launch ready — requires 2-3 focused days of fixes before publishing.**

---

## 2. Critical Issues

### C1. Phone numbers still exposed via RLS (CONFIRMED BY SCANNER)
- **Severity**: Critical
- **Area**: Security / DB
- **Problem**: Security scan STILL reports `EXPOSED_SENSITIVE_DATA` — "Every registered user can read other users' phone numbers." The column-level REVOKE migration was created but the scanner confirms it has not taken full effect or the RLS policy still returns the column.
- **File**: `supabase/migrations/20260313105158_*.sql`
- **Impact**: GDPR violation, user privacy breach, potential regulatory action.
- **Fix**: Verify the migration actually applied. If column-level grants failed, move `phone_number` to a separate `user_pii` table with owner-only RLS.
- **AI mistake**: Likely — migration was generated but never verified against live DB.

### C2. `calculate-compatibility` edge function uses `select('*')` on profiles
- **Severity**: Critical
- **Area**: Security / Backend
- **Problem**: Line 63 of `supabase/functions/calculate-compatibility/index.ts` does `select('*')` on profiles table, potentially exposing PII to the function logic and logs.
- **Fix**: Replace with explicit safe columns.

### C3. `changePassword` ignores current password
- **Severity**: Critical
- **Area**: Auth / Security
- **Problem**: `src/api/accountActions.ts:32` — the `_currentPassword` parameter is accepted but never verified. Any authenticated user (or XSS attacker with a session token) can change the password without proving they know the current one.
- **Fix**: Use Supabase's `signInWithPassword` to verify the current password before calling `updateUser`.

---

## 3. High Priority Issues

### H1. profile_details visibility settings not enforced at DB level
- **Severity**: High
- **Area**: Security / Privacy
- **Problem**: Scanner confirms `profile_visibility_settings` table exists but is never referenced in RLS policies for `profile_details`. Users who configure fields as hidden still have them exposed.
- **Fix**: Update RLS policy on `profile_details` to join against visibility settings.

### H2. 668 console.log calls remain despite logger utility
- **Severity**: High
- **Area**: Security / DevOps
- **Problem**: A `logger.ts` utility was created but only ~10 files were migrated. 668 `console.log` calls remain across 44 files, including auth flows, profile generators, and value mappings that leak internal state.
- **Note**: `main.tsx` suppresses `console.log` in production, but `console.error` still passes through, and the suppression is fragile (library code can capture `console.log` before it's overridden).
- **Fix**: Batch-replace remaining `console.log` with `logger.log` across all src/ files.

### H3. Ghost/demo data generators in production bundle
- **Severity**: High
- **Area**: Code Quality / Security
- **Problem**: `src/utils/ghostUserGenerator.ts` (332 lines), `src/utils/demoDataGenerator.ts`, `src/utils/directProfileFiller.ts`, `src/utils/realUserEnhancement.ts` contain hardcoded fake bios, names, photo URLs, and can create fake profiles. These are accessible in the client bundle.
- **Fix**: Move to admin-only edge function or remove from client code entirely. Gate behind admin role check at minimum.
- **AI mistake**: Yes — AI generated demo data utilities and left them bundled in production.

### H4. WebRTC uses only STUN (no TURN servers)
- **Severity**: High
- **Area**: Feature Completeness
- **Problem**: `useWebRTC.ts` only configures Google STUN servers. Video/voice calls will fail for users behind symmetric NATs or corporate firewalls (30-40% of users).
- **Fix**: Add TURN server configuration (e.g., Twilio, Xirsys, or self-hosted coturn).

### H5. Leaked password protection still disabled
- **Severity**: High
- **Area**: Security / Infrastructure
- **Problem**: Scanner continues to flag this. Must be done in Supabase Dashboard.

### H6. Postgres version needs upgrade
- **Severity**: High
- **Area**: Infrastructure
- **Problem**: Scanner flags security patches available.

---

## 4. Medium / Low Issues

### M1. `select('*')` used in 41+ files
- **Severity**: Medium
- **Area**: Security / Performance
- **Problem**: 246 instances across admin dashboards, messages, groups, events, etc. While most are non-profile tables, this pattern fetches unnecessary data and risks future PII leaks if columns are added.
- **Key files**: `api/messages.ts`, `api/dashboard.ts`, `api/groups.ts`, `hooks/useConversationInsights.ts`

### M2. Event attendee count race condition
- **Severity**: Medium
- **Area**: Backend
- **Problem**: `api/events.ts` joinEvent does a capacity check then insert — not atomic. Two simultaneous joins could exceed `max_attendees`.
- **Fix**: Use a DB trigger or RPC with locking.

### M3. Match creation race condition
- **Severity**: Medium
- **Area**: Backend
- **Problem**: `api/likes.ts` checks for mutual like then creates match — two simultaneous likes could create duplicate match attempts. The `upsert` with `ignoreDuplicates` mitigates but doesn't guarantee exactly one match notification.

### M4. Missing type safety — 825+ `any` usages
- **Severity**: Medium
- **Area**: Code Quality
- **Problem**: `Messages.tsx` uses `any[]` for conversations/matches/stories state. `payments.ts` uses `as any`. Widespread across 104 files.

### M5. Service worker lacks proper cache/offline strategy
- **Severity**: Low
- **Area**: Mobile / PWA
- **Problem**: `public/service-worker.js` only handles push notifications — no caching, no offline support, no precaching of app shell.

### M6. Fake aggregateRating in structured data
- **Severity**: Medium
- **Area**: Publishing / SEO
- **Problem**: `index.html` line 42-44 claims "4.8 rating from 2400 reviews" in JSON-LD. This is fabricated data that violates Google's structured data guidelines and could result in search penalties.
- **AI mistake**: Yes — AI generated marketing-style structured data with fake numbers.

### M7. `next-themes` installed but no theme toggle visible
- **Severity**: Low
- **Area**: Code Quality
- **Problem**: Package installed but app appears to be dark-theme only. Dead dependency.

### M8. `leaflet` and `react-leaflet` installed
- **Severity**: Low
- **Area**: Bundle Size
- **Problem**: Map libraries installed (~40KB gzipped) but unclear if actively used on any visible page.

---

## 5. Missing / Incomplete Features

1. **No actual account deletion**: `requestAccountDeletion` sets a status flag and schedules deletion in 30 days, but there's no background job or cron to actually delete accounts. Deactivation doesn't hide the profile from discovery.

2. **No rate limiting on API calls**: Client-side throttling exists (`useThrottledAction`) but there's no server-side rate limiting on edge functions or direct Supabase queries.

3. **No email verification enforcement**: Users can sign up and use the app without verifying email. No gate on critical features.

4. **No offline/error recovery for realtime**: WebRTC calls, realtime posts, and message subscriptions don't handle connection drops gracefully.

5. **No data retention/GDPR compliance tooling**: The data export exists but there's no automated cleanup of orphaned data, no consent management beyond cookies, no data processing agreement reference.

6. **No App Store / Play Store assets**: No app icons (only favicon), no splash screens, no PWA manifest, no Capacitor config. The app is web-only despite mobile-first design.

7. **Photo moderation is AI-only with no human review queue**: `moderate-photo` edge function exists but unclear if results are actually enforced before photos are shown.

---

## 6. Design / UX Problems

1. **Bottom nav replaces Profile tab with Admin for admins** — admins lose quick access to their own profile. Should add admin as a separate indicator, not replace a core nav item.

2. **No empty state illustrations** — pages like Matches, Messages, Liked Me show loading spinners but likely show nothing meaningful for new users with no matches.

3. **Notification bell in Discover Hub badge math**: `counts.views + counts.likes + counts.matches` combines unrelated metrics into one badge — confusing for users.

4. **Register page has double-nested flex containers** creating redundant spacing (lines 23-29).

5. **No dark/light mode toggle** despite the design system supporting it — users have no choice.

---

## 7. Common AI Mistakes Detected

1. **Ghost/demo data generators bundled in production** — classic AI mistake of leaving test utilities in the final build.
2. **Fake structured data** (4.8 stars, 2400 reviews) in `index.html`.
3. **`_currentPassword` parameter ignored** in changePassword — AI generated the parameter signature but never implemented verification.
4. **console.log explosion** (668 calls) — AI generates logging for debugging but never cleans up.
5. **select('*') proliferation** — AI defaults to `select('*')` as the path of least resistance.
6. **Over-scoped Profile type** — the `Profile` interface in `api/profiles.ts` has 75+ fields, many optional, creating a god-object anti-pattern.
7. **Duplicate logic** — `getMatchRecommendations` just calls `getProfileSuggestions` with a slice. Multiple profile transformation functions exist across files.

---

## 8. Publishing Blockers

1. **No PWA manifest** — cannot be installed as a web app.
2. **No app icons** beyond favicon — no 192x192, no 512x512.
3. **Fake review data in JSON-LD** — Google will penalize or reject.
4. **Phone number PII exposure** — potential legal blocker in EU/MENA regions.
5. **No privacy policy link in signup flow** — App Store/Play Store requirement.
6. **Leaked password protection disabled** — Supabase Dashboard action required.
7. **Postgres version upgrade needed** — security patches.

---

## 9. Security / Privacy Risks

| Risk | Status |
|------|--------|
| Phone number exposure via RLS | **STILL OPEN** (scanner confirms) |
| Profile visibility settings bypassed | **OPEN** |
| Password change without verification | **OPEN** |
| `select('*')` in edge functions | **OPEN** |
| Demo data generators in client bundle | **OPEN** |
| Leaked password protection | **Requires Dashboard action** |
| Extensions in public schema | **Low risk, cosmetic** |

---

## 10. UX / Product Risks

1. New users with no matches/likes see empty screens with no guidance.
2. Video calls will fail for ~35% of users due to missing TURN servers.
3. Admin nav replacement removes profile access for admins.
4. No onboarding flow forces profile completion before swipe access.
5. Complex profile with 75+ fields may overwhelm users during editing.

---

## 11. Architecture / Scalability Risks

1. **Client-side conversation aggregation** — `getConversations()` fetches last 500 messages and aggregates client-side. Will break at scale.
2. **No pagination on matches** — `getMatches()` fetches all matches with no limit.
3. **Profile suggestions shuffle client-side** — `Math.random()` sort won't provide consistent pagination.
4. **No database indexes verified** — search queries use `ilike` patterns which won't use indexes.

---

## 12. File-by-File Risk Hotspots

| File | Risk |
|------|------|
| `src/api/accountActions.ts` | Password change bypass |
| `src/utils/ghostUserGenerator.ts` | Fake data in production |
| `src/utils/demoDataGenerator.ts` | Fake data in production |
| `supabase/functions/calculate-compatibility/index.ts` | `select('*')` on profiles |
| `src/api/messages.ts` | Client-side aggregation, `select('*')` |
| `src/hooks/useWebRTC.ts` | No TURN servers |
| `index.html` | Fake structured data |

---

## 13. Final Release Checklist

- [ ] Verify phone number column-level REVOKE actually applied in live DB
- [ ] Fix `changePassword` to verify current password
- [ ] Fix `calculate-compatibility` to use explicit columns
- [ ] Enforce `profile_visibility_settings` in `profile_details` RLS
- [ ] Remove or gate ghost/demo data generators from client bundle
- [ ] Remove fake aggregateRating from `index.html`
- [ ] Enable leaked password protection (Supabase Dashboard)
- [ ] Upgrade Postgres version (Supabase Dashboard)
- [ ] Add PWA manifest with proper app icons
- [ ] Add TURN server configuration for video calls
- [ ] Add privacy policy link to signup flow
- [ ] Create account deletion cron job
- [ ] Replace remaining `console.log` calls with logger
- [ ] Add server-side pagination for conversations and matches
- [ ] Test end-to-end: registration → profile → swipe → match → chat → call

---

## 14. Launch Readiness Score

**Score: 58/100**

The app has strong fundamentals — real auth, real RLS, real Stripe integration, comprehensive admin panel, internationalization. But the open security findings (PII exposure confirmed by scanner, password change bypass), demo data in production, and missing infrastructure (TURN servers, PWA, no account deletion execution) prevent launch. With focused fixes over 2-3 days, this could reach 80+.

---

## 15. Recommended Next Actions (Priority Order)

1. **Fix password change bypass** — verify current password before allowing change
2. **Verify PII column revoke** — check live DB, if not applied, move phone_number to separate table
3. **Fix `profile_details` visibility enforcement** — update RLS policy
4. **Fix `calculate-compatibility` select('*')** — use explicit columns
5. **Remove/gate demo data generators** from client bundle
6. **Remove fake structured data** from index.html
7. **Enable leaked password protection** (Dashboard)
8. **Upgrade Postgres** (Dashboard)
9. **Add TURN servers** for WebRTC calls
10. **Add PWA manifest and icons**
11. **Batch-replace console.log** with logger utility
12. **Add server-side pagination** for messages/matches
13. **End-to-end test** all critical flows

