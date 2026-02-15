

# KurdMatch - Complete Remaining Work Plan

This plan covers everything that remains to bring KurdMatch to full production readiness, organized by priority.

---

## Phase 1: Premium Feature Enforcement (High Priority)

The subscription system (Stripe checkout, plans, portal) is wired up, but premium features lack server-side enforcement.

### 1.1 Server-Side Daily Usage Limits
- Create an edge function `enforce-daily-limits` that validates swipe/superlike/boost counts before allowing actions
- Currently `can_perform_action` RPC exists but isn't consistently called -- wire it into all swipe, superlike, and boost flows

### 1.2 Subscription-Gated Feature Checks
- The `hasFeature()` helper in `useSubscription` exists but is underused
- Wire `hasFeature('basic')` checks into: advanced filters, "See Who Liked Me", rewind (already done), ad hiding
- Wire `hasFeature('gold')` into: boost activation, super likes (5/day), travel mode

### 1.3 Travel Mode
- A `travel_locations` table exists in the schema but has zero frontend usage
- Build a Travel Mode settings panel (select city, set duration)
- Modify discovery queries to use the travel location instead of the user's home location when active
- Gate behind Gold tier

---

## Phase 2: Real Matching Algorithm (High Priority)

Currently the compatibility score is computed via an edge function `calculate-compatibility`, but it may not be used consistently.

### 2.1 Verify and integrate `calculate-compatibility`
- Audit the edge function to ensure it scores based on: shared interests, location proximity, age compatibility, religion/values
- Ensure the Swipe page calls it for each candidate and displays the real score
- Remove any remaining `Math.random()` mock scores (audit found none currently, but verify)

### 2.2 Priority Matching for Premium
- Premium/Gold users should appear higher in discovery feeds
- When a user has an active boost, their profile should rank higher in other users' discovery queries

---

## Phase 3: Video/Voice Calls (Medium Priority)

No WebRTC or call infrastructure exists yet.

### 3.1 Signaling Server
- Create an edge function `call-signal` to relay WebRTC offer/answer/ICE candidates via Supabase Realtime channels
- Create a `calls` table to log call history (caller_id, callee_id, type, started_at, ended_at, status)

### 3.2 Call UI
- Build `VideoCallScreen.tsx` with camera/mic controls, timer, and end-call button
- Build `IncomingCallSheet.tsx` as a bottom sheet with accept/decline
- Add call buttons to the conversation header in Messages
- Gate behind matched users only (must have an existing match)

### 3.3 TURN/STUN Configuration
- Use free STUN servers (Google) and optionally configure a TURN server secret for NAT traversal

---

## Phase 4: Push Notification Improvements (Medium Priority)

Backend is 80% done. Frontend registration works via service worker.

### 4.1 VAPID Key Configuration
- Ensure VAPID keys are set as edge function secrets (check via API Keys admin page)
- Test end-to-end: subscribe -> trigger notification -> receive on device

### 4.2 Notification Preferences Sync
- The `PushNotificationPreferences` component exists but needs to save to a database table so the edge function can respect them (e.g., mute match notifications but keep messages)

### 4.3 Inactive Subscription Cleanup
- Add a scheduled Postgres job or edge function cron to delete push subscriptions older than 30 days without activity

---

## Phase 5: Media & Upload Hardening (Medium Priority)

### 5.1 Image Compression
- `browser-image-compression` is already installed but not used in chat image uploads
- Wire it into `Messages.tsx` `handleSendImage` before uploading to storage

### 5.2 Voice Message Duration Limit
- Add a 5-minute max recording duration in `useVoiceRecorder`
- Show a countdown timer during recording

### 5.3 File Size Validation
- Enforce max 10MB for images, 5MB for voice messages at the client level before upload
- Show clear error toasts when exceeded

---

## Phase 6: Production Cleanup (Before Launch)

### 6.1 Console.log Removal
- 720+ `console.log` statements found across 39 files
- Replace with conditional logging: `if (import.meta.env.DEV) console.log(...)`
- Focus on the 39 files identified in the audit

### 6.2 Boost Stats - Remove Mock Data
- `ProfileBoostCard.tsx` uses `Math.random()` to simulate view/like/match increases
- Replace with real queries against `profile_views` and `likes` tables filtered to the boost window

### 6.3 Typing Status Cleanup
- Add a database trigger or cron to delete `typing_status` records older than 1 hour

### 6.4 Storage Bucket RLS Verification
- Test that `chat-images` and `voice-messages` buckets correctly restrict access to conversation participants only

---

## Phase 7: Accessibility & Cross-Browser (Post-Launch)

### 7.1 Accessibility Pass
- Add `aria-label` to icon-only buttons across the app
- Add descriptive `alt` text to all images
- Test keyboard navigation on core flows (swipe, chat, profile)

### 7.2 Cross-Browser Testing
- Safari voice recording (mime type fallback already implemented)
- Firefox WebRTC compatibility (for video calls)
- Mobile viewport testing on iOS Safari and Android Chrome

---

## Implementation Order

```text
Week 1:
  - Phase 1 (Premium enforcement) 
  - Phase 2 (Real matching)
  - Phase 5 (Media hardening)

Week 2:
  - Phase 3 (Video/Voice calls)
  - Phase 4 (Push notifications)

Week 3:
  - Phase 6 (Production cleanup)
  - Phase 7 (Accessibility)
```

---

## Technical Details

### New Database Tables Needed
- `calls` (id, caller_id, callee_id, call_type, status, started_at, ended_at)

### New Edge Functions Needed
- `call-signal` -- WebRTC signaling relay
- `enforce-daily-limits` -- server-side usage validation (or enhance existing RPC)

### Files with Most Changes
- `src/pages/Swipe.tsx` -- premium gates, real compatibility scores
- `src/pages/Messages.tsx` -- call buttons, image compression
- `src/components/boost/ProfileBoostCard.tsx` -- real stats
- `src/hooks/useSubscription.ts` -- expanded feature checks
- New: `src/pages/VideoCall.tsx`, `src/components/calls/IncomingCallSheet.tsx`

