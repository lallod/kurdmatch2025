

# Implementation Roadmap: Next Features for KurdMatch

## Overview

This plan outlines the next set of features to implement, prioritized by user value and competitive parity with Tinder/Muzmatch. All five phases of the original modernization plan are complete, so we're now expanding functionality.

---

## Phase 6: Premium Feature Completion (Priority: High)

### 6.1 Rewind/Undo Last Swipe

**Current State**: Button shows "Rewind is a premium feature" toast but does nothing.

**Implementation**:
- Store last swiped profile in state/database before moving to next
- Create `swipe_history` table to track recent swipes
- On rewind: restore previous profile, delete the like/pass action
- Respect daily limits (3 for Basic, 10 for Premium, unlimited for Gold)

**Files to Create/Modify**:
- `src/hooks/useSwipeHistory.ts` - Track and restore swipes
- `src/api/swipes.ts` - Database operations for swipe history
- `src/pages/Swipe.tsx` - Integrate rewind functionality

---

### 6.2 Travel Mode (Gold Feature)

**What It Does**: Users can set their location to a different city/country to see profiles from that area before traveling.

**Implementation**:
- Add `travel_location` and `travel_mode_active` columns to profiles
- UI in settings to enable travel mode and select destination
- Modify `getMatchRecommendations` to use travel location when active
- Show "Traveling to X" badge on profile

**Files to Create/Modify**:
- `src/components/settings/TravelModeSettings.tsx`
- `src/api/profiles.ts` - Add travel mode filter logic
- Database migration for travel columns

---

### 6.3 Read Receipts (Premium Feature)

**What It Does**: Show blue checkmarks when messages are read.

**Implementation**:
- Messages table already has `read` column
- Add UI indicator (double checkmark) for read status
- Real-time updates when recipient reads message
- Toggle in settings (Premium only)

**Files to Modify**:
- `src/pages/Messages.tsx` - Add read receipt indicators
- `src/components/settings/PrivacySettings.tsx` - Toggle

---

## Phase 7: Video & Voice Calls (Priority: High)

### 7.1 WebRTC Integration

**Why**: Major competitive feature missing vs Tinder/Muzmatch.

**Architecture**:
```text
+----------------+     +------------------+     +----------------+
|   User A       |<--->| Supabase Realtime|<--->|   User B       |
|   (Browser)    |     | (Signaling)      |     |   (Browser)    |
+----------------+     +------------------+     +----------------+
        |                                              |
        +---------- WebRTC Peer Connection ------------+
```

**Implementation**:
- Create `calls` table (caller_id, callee_id, status, type, started_at)
- Supabase Realtime for signaling (offer/answer/ICE candidates)
- STUN/TURN server configuration (can use free Google STUN)
- Call UI components (incoming call modal, active call overlay)

**Files to Create**:
- `src/hooks/useWebRTC.ts` - WebRTC connection management
- `src/hooks/useCallSignaling.ts` - Supabase realtime signaling
- `src/components/calls/IncomingCallModal.tsx`
- `src/components/calls/ActiveCallOverlay.tsx`
- `src/components/calls/CallButton.tsx` (add to Messages)

**Premium Gating**: Free users get 5 min/day, Premium unlimited.

---

## Phase 8: Cultural Features (Priority: Medium)

### 8.1 Chaperone Mode (Muzmatch-Inspired)

**What It Does**: Allow a trusted third party (family member/friend) to observe chat conversations for cultural/religious reasons.

**Implementation**:
- Add `chaperone_id` column to profiles
- Invite system for chaperone (email/link)
- Chaperone gets read-only access to specified conversations
- UI toggle in privacy settings
- Badge showing "Chaperone Active" on profile

**Files to Create**:
- `src/pages/ChaperoneSettings.tsx`
- `src/components/chat/ChaperoneBadge.tsx`
- `src/api/chaperone.ts`

---

### 8.2 Marriage Intentions Tracker

**What It Does**: Detailed tracking of marriage timeline expectations (3-6 months, 1-2 years, etc.)

**Implementation**:
- Add `marriage_timeline` field to profiles
- Display prominently on profile cards
- Filter option in discovery

---

## Phase 9: Engagement Features (Priority: Medium)

### 9.1 Virtual Gifts System

**What It Does**: Send virtual gifts (roses, hearts, custom Kurdish symbols) to matches.

**Implementation**:
- `virtual_gifts` table (sender, recipient, gift_type, message)
- Gift shop UI with Kurdish-themed items
- Notification when gift received
- Premium users get free gifts, others purchase

**Files to Create**:
- `src/pages/GiftShop.tsx`
- `src/components/chat/SendGiftButton.tsx`
- `src/components/notifications/GiftNotification.tsx`

---

### 9.2 Date Scheduler

**What It Does**: Propose and manage date invitations within the app.

**Implementation**:
- `date_proposals` table (proposer, recipient, location, time, status)
- Integration with device calendar
- Location suggestions based on both users' areas
- Reminder notifications

---

## Phase 10: Admin & Analytics (Priority: Low)

### 10.1 Advanced User Analytics

**Current State**: Basic stats in admin dashboard.

**Enhancement**:
- User retention charts
- Match success rates by region/age
- Message response times
- Feature usage heatmaps

---

### 10.2 A/B Testing Framework

**What It Does**: Test different UI variations and features.

**Implementation**:
- Feature flags system
- User cohort assignment
- Metrics tracking per variation

---

## Summary Table

| Phase | Feature | Tier Gate | Effort |
|-------|---------|-----------|--------|
| 6.1 | Rewind/Undo Swipe | Basic+ | Medium |
| 6.2 | Travel Mode | Gold | Medium |
| 6.3 | Read Receipts | Premium+ | Low |
| 7.1 | Video/Voice Calls | Premium+ | High |
| 8.1 | Chaperone Mode | All | Medium |
| 8.2 | Marriage Timeline | All | Low |
| 9.1 | Virtual Gifts | All (paid) | Medium |
| 9.2 | Date Scheduler | Premium+ | Medium |
| 10.1 | Admin Analytics | Admin | Medium |
| 10.2 | A/B Testing | Admin | High |

---

## Recommended Implementation Order

1. **Rewind/Undo** - Quick win, already has UI
2. **Read Receipts** - Low effort, high perceived value
3. **Travel Mode** - Gold tier differentiator
4. **Video/Voice Calls** - Major competitive feature
5. **Chaperone Mode** - Cultural differentiator for Kurdish audience
6. **Virtual Gifts** - Monetization opportunity
7. **Date Scheduler** - Nice-to-have engagement feature
8. **Admin Analytics** - Internal improvement

