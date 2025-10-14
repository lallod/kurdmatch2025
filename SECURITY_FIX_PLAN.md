# Complete Security Fix Plan - KurdMatch Platform
**Created:** October 14, 2025  
**Estimated Total Time:** 14-21 hours  
**Priority:** BLOCKING PRODUCTION LAUNCH

---

## 🎯 EXECUTION STRATEGY

### Why This Order?
1. **Critical database security first** - Prevents data leaks
2. **Fix blocking errors** - Enables testing of other features
3. **High priority issues** - Strengthens overall security
4. **Testing & validation** - Ensures everything works
5. **Documentation & deployment** - Final preparation

### Deadlock Prevention
- Run migrations in small batches
- Test after each migration
- Don't combine DROP and CREATE in same transaction
- Allow time between migrations for locks to release

---

## PHASE 1: CRITICAL DATABASE SECURITY (2-3 hours)

### Step 1.1: Fix Profiles Table RLS (30 mins)
**Issue:** All user data publicly accessible to anyone  
**Impact:** Prevents data scraping and unauthorized access

**Migration SQL:**
```sql
-- Step 1.1a: Remove public access policies
DROP POLICY IF EXISTS "Anyone can select profiles" ON public.profiles;

-- Step 1.1b: Add authenticated-only viewing
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Step 1.1c: Verify RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add security comments
COMMENT ON POLICY "Authenticated users can view profiles" ON public.profiles IS 
'Restricts profile viewing to authenticated users only. Prevents public scraping of user data.';
```

**Testing:**
- [ ] Log out and try to access `/discovery` - should redirect to `/auth`
- [ ] Log in and verify profiles load correctly
- [ ] Verify profile search works
- [ ] Check advanced search functionality

**Success Criteria:**
✅ Unauthenticated users cannot access profile data  
✅ Authenticated users can view all profiles  
✅ No errors in console

---

### Step 1.2: Fix Reports Table - Protect Reporter Identity (30 mins)
**Issue:** Users can see who reported them  
**Impact:** Prevents retaliation against reporters

**Migration SQL:**
```sql
-- Step 1.2a: Remove user access to view reports
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;

-- Step 1.2b: Keep anonymous reporting ability
-- (Policy already exists: "Users can create reports")

-- Step 1.2c: Ensure only admins can view reports
-- (Policy already exists: "Super admins can view all reports")

-- Step 1.2d: Verify RLS enabled
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Add security comment
COMMENT ON POLICY "Users can create reports" ON public.reports IS 
'Allows users to create reports anonymously. Users cannot view reports after submission, protecting reporter identity.';
```

**Code Changes Required:**
Update any frontend code that tries to fetch user's own reports:
- Remove "My Reports" section from user profile/settings
- Update report submission to show success message without report details
- Remove any queries like `supabase.from('reports').select('*').eq('reporter_user_id', userId)`

**Files to Check:**
- `src/pages/Profile.tsx`
- `src/pages/Settings.tsx`
- Any report-related components

**Testing:**
- [ ] Submit a report - should succeed
- [ ] Try to view own reports - should fail/not show
- [ ] Login as super admin - should see all reports
- [ ] Verify report submission shows success message

**Success Criteria:**
✅ Users can create reports  
✅ Users cannot view their submitted reports  
✅ Super admins can see all reports  
✅ No reporter identity exposed in UI

---

### Step 1.3: Enable RLS on All Tables (45 mins)
**Issue:** Some tables lack RLS protection  
**Impact:** Ensures all data has access control

**Migration SQL:**
```sql
-- Step 1.3: Enable RLS on all critical tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muted_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversation_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_details ENABLE ROW LEVEL SECURITY;

-- Admin-only tables
ALTER TABLE public.admin_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;

-- Public content tables (already have RLS, just verify)
ALTER TABLE public.landing_page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_v2_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
```

**Testing:**
- [ ] Run database linter: Check for "RLS Disabled" errors
- [ ] Verify no tables show RLS disabled warning
- [ ] Test key user flows (registration, login, messaging, profile viewing)

**Success Criteria:**
✅ All tables have RLS enabled  
✅ No RLS disabled errors in linter  
✅ User functionality still works

---

### Step 1.4: Fix Infinite Recursion in group_members (1 hour)
**Issue:** RLS policy causes infinite loop  
**Impact:** Group features completely broken

**Problem Analysis:**
The policy likely references the `group_members` table within its own policy, causing recursion.

**Migration SQL:**
```sql
-- Step 1.4a: Create security definer function to check group membership
CREATE OR REPLACE FUNCTION public.is_group_member(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = group_uuid
      AND user_id = user_uuid
      AND status = 'active'
  )
$$;

-- Step 1.4b: Create function to check if user is group admin
CREATE OR REPLACE FUNCTION public.is_group_admin(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = group_uuid
      AND user_id = user_uuid
      AND role = 'admin'
      AND status = 'active'
  )
$$;

-- Step 1.4c: Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their group memberships" ON public.group_members;
DROP POLICY IF EXISTS "Group members can view other members" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Group admins can manage members" ON public.group_members;

-- Step 1.4d: Create new policies using security definer functions
CREATE POLICY "Users can view their own memberships"
ON public.group_members
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Members can view group member list"
ON public.group_members
FOR SELECT
TO authenticated
USING (
  -- Can view if you're a member of the same group
  EXISTS (
    SELECT 1 FROM groups g
    WHERE g.id = group_members.group_id
    AND (
      g.privacy = 'public'
      OR is_group_member(g.id, auth.uid())
    )
  )
);

CREATE POLICY "Users can request to join groups"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
);

CREATE POLICY "Group admins can manage members"
ON public.group_members
FOR ALL
TO authenticated
USING (
  is_group_admin(group_id, auth.uid())
)
WITH CHECK (
  is_group_admin(group_id, auth.uid())
);
```

**Testing:**
- [ ] View group list - should load
- [ ] Join a group - should work
- [ ] View group members - should show list
- [ ] Admin: approve/reject members - should work
- [ ] Check for infinite recursion errors in logs

**Success Criteria:**
✅ No infinite recursion errors  
✅ Group viewing works  
✅ Joining groups works  
✅ Member management works

---

## PHASE 2: HIGH PRIORITY SECURITY (4-6 hours)

### Step 2.1: Fix Function Search Paths (1 hour)
**Issue:** 2 functions without search_path set  
**Impact:** Potential security vulnerability

**Migration SQL:**
```sql
-- Find all security definer functions without search_path
SELECT 
  n.nspname AS schema,
  p.proname AS function_name,
  pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.prosecdef = true  -- Security definer functions
  AND n.nspname = 'public'
  AND pg_get_functiondef(p.oid) NOT LIKE '%search_path%';

-- Update each function to add SET search_path = public
-- Example for common functions:

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public  -- ADD THIS LINE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text = 'super_admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public  -- ADD THIS LINE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text = _role
  )
$$;

-- Repeat for all security definer functions
```

**Process:**
1. List all security definer functions
2. For each function, add `SET search_path = public`
3. Test admin access after changes
4. Re-run linter to verify

**Testing:**
- [ ] Login as super admin - should work
- [ ] Access admin dashboard - should load
- [ ] Regular user cannot access admin features
- [ ] Re-run database linter - no search_path warnings

**Success Criteria:**
✅ All security definer functions have search_path set  
✅ No linter warnings about search_path  
✅ Admin access still works

---

### Step 2.2: Enable Leaked Password Protection (30 mins)
**Issue:** Users can set compromised passwords  
**Impact:** Account security vulnerability

**Steps:**
1. Go to Supabase Dashboard: `https://supabase.com/dashboard/project/bqgjfxilcpqosmccextj/auth/providers`
2. Navigate to: Authentication → Policies → Password
3. Enable "Leaked Password Protection"
4. Set minimum password strength requirements:
   - Minimum length: 8 characters
   - Require uppercase: Yes
   - Require lowercase: Yes
   - Require numbers: Yes
   - Require symbols: Optional

**Frontend Updates:**
Update password validation in registration/login forms to match:

```typescript
// src/components/auth/utils/registrationSchema.ts
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number");
```

**Files to Update:**
- `src/components/auth/utils/registrationSchema.ts`
- `src/pages/Auth.tsx` (login page)
- `src/pages/Register.tsx`
- Any password reset forms

**Testing:**
- [ ] Try weak password - should reject
- [ ] Try common password (e.g., "password123") - should reject
- [ ] Try strong password - should accept
- [ ] Password validation shows clear error messages

**Success Criteria:**
✅ Leaked password protection enabled  
✅ Strong password requirements enforced  
✅ Clear user feedback on password requirements

---

### Step 2.3: Add Payment Data Encryption (2 hours)
**Issue:** Payment data not encrypted beyond RLS  
**Impact:** Financial data at risk if auth compromised

**Migration SQL:**
```sql
-- Step 2.3a: Add encryption for sensitive payment fields
-- First, enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Step 2.3b: Create encrypted columns for sensitive data
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS stripe_customer_id_encrypted bytea,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id_encrypted bytea;

-- Step 2.3c: Migrate existing data to encrypted columns
UPDATE public.payments
SET 
  stripe_customer_id_encrypted = pgp_sym_encrypt(stripe_customer_id, current_setting('app.settings.encryption_key')),
  stripe_payment_intent_id_encrypted = pgp_sym_encrypt(stripe_payment_intent_id, current_setting('app.settings.encryption_key'))
WHERE stripe_customer_id IS NOT NULL OR stripe_payment_intent_id IS NOT NULL;

-- Step 2.3d: Create views for decryption (for authorized access only)
CREATE OR REPLACE VIEW public.payments_decrypted AS
SELECT 
  id,
  user_id,
  amount,
  currency,
  status,
  payment_method,
  subscription_type,
  description,
  metadata,
  created_at,
  updated_at,
  pgp_sym_decrypt(stripe_customer_id_encrypted, current_setting('app.settings.encryption_key')) AS stripe_customer_id,
  pgp_sym_decrypt(stripe_payment_intent_id_encrypted, current_setting('app.settings.encryption_key')) AS stripe_payment_intent_id
FROM public.payments;

-- Step 2.3e: Grant access only to super admins
GRANT SELECT ON public.payments_decrypted TO authenticated;
CREATE POLICY "Only super admins can view decrypted payment data"
ON public.payments_decrypted
FOR SELECT
TO authenticated
USING (is_super_admin(auth.uid()));
```

**Environment Setup:**
Add encryption key to environment variables (in Supabase Dashboard → Settings → Secrets):
```
ENCRYPTION_KEY=<generate-strong-32-char-key>
```

**Code Updates:**
Update payment queries to use encrypted storage:
- When creating payments, encrypt sensitive fields
- When viewing payment history, decrypt only for display
- Never log decrypted payment data

**Testing:**
- [ ] Create test payment - data encrypted in database
- [ ] View payment as super admin - data decrypts correctly
- [ ] View payment as regular user - only sees own payments
- [ ] Verify encrypted data not visible in raw database

**Success Criteria:**
✅ Sensitive payment fields encrypted  
✅ Super admins can view decrypted data  
✅ Regular users see only necessary payment info  
✅ No payment data in logs

---

### Step 2.4: Enhance Message Security (2 hours)
**Issue:** Private messages could be exposed through policy gaps  
**Impact:** Privacy violation risk

**Migration SQL:**
```sql
-- Step 2.4a: Review existing message policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'messages';

-- Step 2.4b: Strengthen message access policies
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

-- Step 2.4c: Create stricter policies
CREATE POLICY "Users can only view messages they sent or received"
ON public.messages
FOR SELECT
TO authenticated
USING (
  auth.uid() = sender_id 
  OR auth.uid() = receiver_id
);

CREATE POLICY "Users can only send messages as themselves"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND auth.uid() != receiver_id  -- Prevent sending messages to self
  AND NOT is_user_blocked(receiver_id)  -- Prevent messaging blocked users
);

CREATE POLICY "Users can update only their own sent messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (
  auth.uid() = sender_id
  AND created_at > NOW() - INTERVAL '5 minutes'  -- Only within 5 mins of sending
)
WITH CHECK (
  auth.uid() = sender_id
);

CREATE POLICY "Users can delete their own messages"
ON public.messages
FOR DELETE
TO authenticated
USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- Step 2.4d: Add message encryption support (optional but recommended)
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS content_encrypted bytea;

-- Create function to encrypt messages
CREATE OR REPLACE FUNCTION public.encrypt_message_content()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.content IS NOT NULL THEN
    NEW.content_encrypted = pgp_sym_encrypt(
      NEW.content, 
      current_setting('app.settings.encryption_key')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Create trigger for automatic encryption
CREATE TRIGGER encrypt_message_before_insert
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION encrypt_message_content();
```

**Code Updates:**
1. Update message sending to handle encryption
2. Update message display to decrypt content
3. Add rate limiting for message sending (prevent spam)
4. Implement message read receipts securely

**Files to Update:**
- `src/pages/Messages.tsx`
- `src/components/messages/MessageThread.tsx`
- Any message-related hooks/services

**Testing:**
- [ ] Send message - should succeed
- [ ] Receive message - should display correctly
- [ ] Cannot view others' conversations
- [ ] Cannot send as someone else
- [ ] Blocked users cannot message each other
- [ ] Message encryption working (if implemented)

**Success Criteria:**
✅ Users can only access their own messages  
✅ Cannot impersonate other users  
✅ Blocked user protection works  
✅ Message content secure

---

## PHASE 3: CODE QUALITY & VALIDATION (3-4 hours)

### Step 3.1: Add Input Validation (2 hours)
**Issue:** Need consistent validation across all forms  
**Impact:** Prevents injection attacks and data corruption

**Files to Update:**

1. **Registration Forms**
```typescript
// src/components/auth/utils/registrationSchema.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

export const registrationSchema = z.object({
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email too long")
    .transform(val => DOMPurify.sanitize(val)),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number"),
  
  name: z.string()
    .trim()
    .min(2, "Name too short")
    .max(100, "Name too long")
    .transform(val => DOMPurify.sanitize(val)),
  
  age: z.number()
    .int("Age must be a whole number")
    .min(18, "Must be 18 or older")
    .max(120, "Invalid age"),
  
  bio: z.string()
    .trim()
    .min(20, "Bio must be at least 20 characters")
    .max(1000, "Bio too long")
    .transform(val => DOMPurify.sanitize(val)),
  
  location: z.string()
    .trim()
    .min(2, "Location too short")
    .max(200, "Location too long")
    .transform(val => DOMPurify.sanitize(val)),
  
  // ... add validation for all other fields
});
```

2. **Message Sending**
```typescript
// src/components/messages/MessageInput.tsx
const messageSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(5000, "Message too long")
    .transform(val => DOMPurify.sanitize(val))
});
```

3. **Profile Updates**
```typescript
// src/pages/Profile/EditProfile.tsx
const profileUpdateSchema = z.object({
  // Similar validation as registration
  // Add specific validation for each editable field
});
```

4. **Report Submission**
```typescript
// src/components/reports/ReportForm.tsx
const reportSchema = z.object({
  reason: z.enum([
    'inappropriate_content',
    'harassment',
    'spam',
    'fake_profile',
    'other'
  ]),
  details: z.string()
    .trim()
    .min(10, "Please provide more details")
    .max(1000, "Details too long")
    .transform(val => DOMPurify.sanitize(val))
});
```

**Install Required Package:**
```bash
npm install isomorphic-dompurify
```

**Testing:**
- [ ] Try XSS attacks in forms (e.g., `<script>alert('xss')</script>`)
- [ ] Try SQL injection patterns
- [ ] Test length limits
- [ ] Verify sanitization doesn't break valid input

**Success Criteria:**
✅ All forms have input validation  
✅ XSS attacks blocked  
✅ SQL injection prevented  
✅ User-friendly error messages

---

### Step 3.2: Fix Multi-Select Default Values (1 hour)
**Issue:** Multi-select fields using empty strings instead of arrays  
**Impact:** Registration may fail

**File to Fix:**
```typescript
// src/components/auth/utils/formDefaultValues.ts
export const getFormDefaultValues = (enabledQuestions: QuestionItem[]) => {
  const defaults: Record<string, any> = {};
  
  // Always set photos as an empty array
  defaults['sys_6'] = [];
  defaults['photos'] = [];
  
  enabledQuestions.forEach(q => {
    if (q.profileField !== 'bio') {
      // FIX: Check for multi-select field types
      if (q.fieldType === 'multi-select' || q.fieldType === 'multi_select') {
        defaults[q.id] = [];  // ✅ Array for multi-select
      } else if (q.fieldType === 'checkbox') {
        defaults[q.id] = false;  // ✅ Boolean for checkbox
      } else if (q.profileField === 'photos') {
        defaults[q.id] = [];  // ✅ Array for photos
      } else {
        defaults[q.id] = '';  // String for other fields
      }
    }
  });
  
  return defaults;
};
```

**Testing:**
- [ ] Start registration - no console errors
- [ ] Fill multi-select fields (languages, interests, hobbies, values)
- [ ] Complete registration - should succeed
- [ ] Verify data saved correctly in database

**Success Criteria:**
✅ Multi-select fields default to arrays  
✅ No type errors in console  
✅ Registration completes successfully

---

### Step 3.3: Remove Console.log Statements (30 mins)
**Issue:** Sensitive data may be logged  
**Impact:** Security risk in production

**Process:**
1. Search codebase for `console.log`
2. Remove or replace with proper logging
3. Especially in:
   - Authentication flows
   - Payment processing
   - Message handling
   - Admin operations

**Files to Review:**
- `src/components/auth/**`
- `src/pages/Auth.tsx`
- `src/pages/Register.tsx`
- `src/pages/Messages.tsx`
- `src/pages/SuperAdmin/**`

**Keep Only:**
- Error logging (console.error)
- Development-only logs (wrapped in `if (import.meta.env.DEV)`)

**Testing:**
- [ ] Search for `console.log` - minimal results
- [ ] Check browser console in production mode - no sensitive data
- [ ] Error logging still works

**Success Criteria:**
✅ No sensitive data logged  
✅ Production console clean  
✅ Error tracking still functional

---

## PHASE 4: COMPREHENSIVE TESTING (6-8 hours)

### Step 4.1: User Journey Testing (3-4 hours)

#### Test 1: New User Registration & Onboarding
**Time:** 30 minutes

1. **Registration Flow**
   - [ ] Navigate to `/register`
   - [ ] Complete Step 1: Account Creation
     - [ ] Email validation works
     - [ ] Password strength indicator shows
     - [ ] Confirm password matching works
     - [ ] Social login buttons present (Google, Facebook)
   - [ ] Complete Step 2: Basic Info
     - [ ] All fields validate correctly
     - [ ] Age validation (must be 18+)
     - [ ] Gender dropdown populated
   - [ ] Complete Step 3: Location
     - [ ] Auto-location detection works
     - [ ] Can manually enter location
     - [ ] Location saved
   - [ ] Complete Step 4: Photo Upload
     - [ ] Can upload multiple photos
     - [ ] Can set primary photo
     - [ ] Preview shows correctly
     - [ ] File size/type validation works
   - [ ] Submit registration
     - [ ] Success message appears
     - [ ] Profile created in database
     - [ ] Photos uploaded to storage
     - [ ] Redirected to appropriate page

2. **First Login**
   - [ ] Logout
   - [ ] Login with new credentials
   - [ ] Session persists on refresh
   - [ ] Profile completeness checked

#### Test 2: Discovery & Matching (45 mins)
1. **Browse Profiles**
   - [ ] Navigate to `/discovery` or `/swipe`
   - [ ] Profile cards load
   - [ ] Can swipe right (like)
   - [ ] Can swipe left (pass)
   - [ ] Can super like
   - [ ] Image carousel works
   - [ ] Profile details expand

2. **Matching**
   - [ ] Create mutual like
   - [ ] Match notification appears
   - [ ] Match appears in matches list
   - [ ] Can message match

3. **Filtering**
   - [ ] Open filters
   - [ ] Set age range
   - [ ] Set distance
   - [ ] Set preferences
   - [ ] Results update
   - [ ] Reset filters works

#### Test 3: Messaging (45 mins)
1. **Send Messages**
   - [ ] Navigate to `/messages`
   - [ ] Select conversation
   - [ ] Send text message
   - [ ] Message appears immediately
   - [ ] Timestamp shows correctly
   - [ ] Read receipts work (if implemented)

2. **Receive Messages**
   - [ ] Real-time message arrival (use second device/incognito)
   - [ ] Unread count updates
   - [ ] Notification appears

3. **Message Features**
   - [ ] Can send images (if implemented)
   - [ ] Can delete message
   - [ ] Can block user
   - [ ] Can report user
   - [ ] Blocked user cannot send messages

#### Test 4: Profile Management (30 mins)
1. **View Own Profile**
   - [ ] Navigate to `/profile`
   - [ ] All info displays correctly
   - [ ] Photos show in gallery
   - [ ] Stats display (views, likes, etc.)

2. **Edit Profile**
   - [ ] Click edit profile
   - [ ] Update bio
   - [ ] Update preferences
   - [ ] Upload new photo
   - [ ] Delete photo
   - [ ] Save changes
   - [ ] Changes reflected immediately

3. **Settings**
   - [ ] Access settings
   - [ ] Change email
   - [ ] Change password
   - [ ] Update privacy settings
   - [ ] Update notification preferences
   - [ ] Changes save correctly

#### Test 5: Advanced Search (20 mins)
- [ ] Navigate to `/advanced-search`
- [ ] Test all filter combinations:
  - [ ] Age range
  - [ ] Distance
  - [ ] Gender
  - [ ] Region (Kurdistan-specific)
  - [ ] Education
  - [ ] Height
  - [ ] Body type
  - [ ] Interests
- [ ] Results update correctly
- [ ] Can view profiles from results
- [ ] Reset filters works

#### Test 6: Admin Features (1 hour)
**Login as Super Admin**

1. **Dashboard**
   - [ ] Navigate to `/super-admin`
   - [ ] Stats cards show data
   - [ ] Charts render correctly
   - [ ] Data is current

2. **User Management**
   - [ ] View user list
   - [ ] Search users
   - [ ] Filter by role
   - [ ] Filter by status
   - [ ] View user details
   - [ ] Edit user profile
   - [ ] Ban user
   - [ ] Unban user
   - [ ] Delete user (test account only)

3. **Content Moderation**
   - [ ] View reported content
   - [ ] Filter by status
   - [ ] Review report details
   - [ ] Take action on report
   - [ ] Dismiss report
   - [ ] Verify reporter identity hidden

4. **Analytics**
   - [ ] View platform analytics
   - [ ] User growth chart
   - [ ] Engagement metrics
   - [ ] Export functionality

5. **System Settings**
   - [ ] Access system settings
   - [ ] Update settings
   - [ ] Feature toggles work
   - [ ] Changes save

---

### Step 4.2: Security Testing (1-2 hours)

#### Unauthorized Access Tests
- [ ] **Logged Out Tests**
  - [ ] Try accessing `/discovery` - should redirect to `/auth`
  - [ ] Try accessing `/messages` - should redirect to `/auth`
  - [ ] Try accessing `/profile` - should redirect to `/auth`
  - [ ] Try accessing `/super-admin` - should redirect to `/auth`

- [ ] **Non-Admin User Tests**
  - [ ] Login as regular user
  - [ ] Try accessing `/super-admin` - should deny access
  - [ ] Cannot edit other users' profiles
  - [ ] Cannot access admin API endpoints

- [ ] **RLS Policy Tests**
  - [ ] User A cannot view User B's private data
  - [ ] User cannot modify others' profiles
  - [ ] User cannot see who reported them
  - [ ] User can only see their own messages

#### Input Security Tests
- [ ] **XSS Attempts**
  - [ ] Try `<script>alert('XSS')</script>` in bio - should sanitize
  - [ ] Try `<img src=x onerror=alert('XSS')>` in name - should sanitize
  - [ ] Try JavaScript in profile fields - should sanitize

- [ ] **SQL Injection Attempts**
  - [ ] Try `' OR '1'='1` in search - should handle safely
  - [ ] Try `'; DROP TABLE users; --` - should handle safely

- [ ] **Path Traversal**
  - [ ] Try `../../../etc/passwd` in file upload - should block
  - [ ] Try relative paths in image URLs - should validate

#### Rate Limiting Tests
- [ ] **Message Spam**
  - [ ] Send 50+ messages rapidly - should rate limit
  - [ ] Error message should be user-friendly

- [ ] **Like Spam**
  - [ ] Like 100+ profiles rapidly - should hit daily limit
  - [ ] Clear error on limit reached

- [ ] **Registration Spam**
  - [ ] Try creating multiple accounts rapidly - should slow down

---

### Step 4.3: Performance Testing (1 hour)

#### Page Load Times
- [ ] Landing page < 3 seconds
- [ ] Login page < 2 seconds
- [ ] Registration page < 2 seconds
- [ ] Discovery page < 2 seconds
- [ ] Messages page < 2 seconds
- [ ] Profile page < 2 seconds
- [ ] Admin dashboard < 3 seconds

#### Database Performance
- [ ] Profile queries < 500ms
- [ ] Message queries < 300ms
- [ ] Search queries < 1 second
- [ ] Admin queries < 1 second

#### Image Loading
- [ ] Images lazy load
- [ ] Thumbnails load first
- [ ] Full images load on demand
- [ ] Loading indicators show

---

### Step 4.4: Cross-Browser Testing (1 hour)

**Test on each browser:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Per Browser, Verify:**
- [ ] Registration works
- [ ] Login works
- [ ] Profile images display
- [ ] Swipe gestures work (mobile)
- [ ] Messaging works
- [ ] File uploads work
- [ ] CSS renders correctly
- [ ] No console errors

---

### Step 4.5: Mobile Responsiveness (1 hour)

**Test Devices:**
- [ ] iPhone 12/13/14 (375x812)
- [ ] iPhone SE (375x667)
- [ ] Samsung Galaxy (360x740)
- [ ] iPad (768x1024)
- [ ] iPad Pro (1024x1366)

**Per Device:**
- [ ] Layout adapts correctly
- [ ] Navigation menu accessible
- [ ] Forms are usable
- [ ] Buttons are tappable (44px min)
- [ ] Text is readable (16px min)
- [ ] Images scale properly
- [ ] No horizontal scroll
- [ ] Swipe gestures work
- [ ] Modals fit screen

---

## PHASE 5: FINAL VERIFICATION (2 hours)

### Step 5.1: Security Scan (30 mins)
**Run final security scan:**
```bash
# In Lovable, use the security scan tool
# Or manually check:
```

- [ ] Run security scan
- [ ] Review all findings
- [ ] Verify all CRITICAL issues resolved
- [ ] Document any remaining warnings
- [ ] Create plan for remaining issues

**Expected Results:**
- ✅ 0 Critical issues
- ✅ 0 High priority issues
- ⚠️ Some warnings acceptable (document why)

---

### Step 5.2: Database Linter (15 mins)
- [ ] Run database linter
- [ ] Verify no RLS disabled errors
- [ ] Verify no search_path warnings
- [ ] Document any remaining warnings

---

### Step 5.3: Code Review Checklist (45 mins)

#### Security
- [ ] No hardcoded credentials
- [ ] No API keys in code
- [ ] All environment variables in Supabase secrets
- [ ] No sensitive data in console logs
- [ ] Input validation on all forms
- [ ] XSS protection implemented
- [ ] CSRF protection enabled
- [ ] RLS enabled on all tables
- [ ] Admin checks server-side only

#### Performance
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Database queries indexed
- [ ] No N+1 query problems
- [ ] Code splitting used
- [ ] Bundle size reasonable

#### Code Quality
- [ ] No unused imports
- [ ] No dead code
- [ ] Consistent naming conventions
- [ ] Comments on complex logic
- [ ] Error handling in place
- [ ] Loading states shown
- [ ] Error messages user-friendly

#### Accessibility
- [ ] Alt text on images
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Form labels associated

---

### Step 5.4: Documentation Review (30 mins)
- [ ] README.md complete and current
- [ ] DEPLOYMENT.md has all steps
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Security policies documented
- [ ] Admin features documented

---

## PHASE 6: PRE-LAUNCH CHECKLIST (1 hour)

### Infrastructure
- [ ] Supabase project configured correctly
- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Analytics configured
- [ ] Email service configured
- [ ] Storage buckets configured
- [ ] CDN configured (if applicable)

### Content
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Cookie Policy published (if EU users)
- [ ] GDPR compliance verified (if applicable)
- [ ] Contact information available
- [ ] Support email configured

### Settings
- [ ] Site URL set in Supabase Auth
- [ ] Redirect URLs configured
- [ ] Email templates customized
- [ ] Rate limits configured
- [ ] File upload limits set
- [ ] CORS settings verified

### Final Tests
- [ ] Production environment tested
- [ ] SSL certificate valid
- [ ] Custom domain works (if applicable)
- [ ] Email delivery works
- [ ] Payment processing works (if implemented)
- [ ] All critical user flows work

---

## PHASE 7: LAUNCH (30 mins)

### Deployment
1. [ ] Deploy to production
2. [ ] Run smoke tests on production
3. [ ] Monitor error rates
4. [ ] Check performance metrics
5. [ ] Verify all integrations working

### Post-Launch Monitoring (First 24 Hours)
- [ ] Monitor error rates every hour
- [ ] Check user registration rate
- [ ] Verify email delivery
- [ ] Monitor database performance
- [ ] Check for security alerts
- [ ] Monitor user feedback
- [ ] Track key metrics:
  - [ ] New registrations
  - [ ] Active users
  - [ ] Messages sent
  - [ ] Matches created
  - [ ] Error rate
  - [ ] Page load times

---

## 📊 PROGRESS TRACKING

### Completion Checklist
- [ ] Phase 1: Critical Database Security (2-3 hours)
  - [ ] Step 1.1: Fix Profiles Table RLS
  - [ ] Step 1.2: Protect Reporter Identity
  - [ ] Step 1.3: Enable RLS on All Tables
  - [ ] Step 1.4: Fix Infinite Recursion

- [ ] Phase 2: High Priority Security (4-6 hours)
  - [ ] Step 2.1: Fix Function Search Paths
  - [ ] Step 2.2: Enable Leaked Password Protection
  - [ ] Step 2.3: Add Payment Data Encryption
  - [ ] Step 2.4: Enhance Message Security

- [ ] Phase 3: Code Quality & Validation (3-4 hours)
  - [ ] Step 3.1: Add Input Validation
  - [ ] Step 3.2: Fix Multi-Select Default Values
  - [ ] Step 3.3: Remove Console.log Statements

- [ ] Phase 4: Comprehensive Testing (6-8 hours)
  - [ ] Step 4.1: User Journey Testing
  - [ ] Step 4.2: Security Testing
  - [ ] Step 4.3: Performance Testing
  - [ ] Step 4.4: Cross-Browser Testing
  - [ ] Step 4.5: Mobile Responsiveness

- [ ] Phase 5: Final Verification (2 hours)
  - [ ] Step 5.1: Security Scan
  - [ ] Step 5.2: Database Linter
  - [ ] Step 5.3: Code Review Checklist
  - [ ] Step 5.4: Documentation Review

- [ ] Phase 6: Pre-Launch Checklist (1 hour)

- [ ] Phase 7: Launch & Monitor (30 mins + 24 hours)

---

## 🚨 ROLLBACK PLAN

If critical issues are discovered post-launch:

1. **Immediate Actions** (5 mins)
   - [ ] Put site in maintenance mode
   - [ ] Notify users via email/social media
   - [ ] Stop accepting new registrations

2. **Assess Damage** (15 mins)
   - [ ] Identify affected users
   - [ ] Check for data breaches
   - [ ] Review error logs
   - [ ] Determine scope of issue

3. **Rollback** (30 mins)
   - [ ] Revert to last known good version
   - [ ] Restore database backup if needed
   - [ ] Verify rollback successful
   - [ ] Re-run critical tests

4. **Communication** (1 hour)
   - [ ] Notify affected users
   - [ ] Post public statement (if needed)
   - [ ] Provide timeline for fix
   - [ ] Offer support contact

5. **Fix & Redeploy** (varies)
   - [ ] Fix critical issue
   - [ ] Test thoroughly
   - [ ] Deploy fix
   - [ ] Monitor closely

---

## 📝 NOTES

### Team Assignments (if applicable)
- **Security Lead:** _____________
- **Backend Developer:** _____________
- **Frontend Developer:** _____________
- **QA Tester:** _____________
- **DevOps:** _____________

### Sign-Off
- [ ] Security Lead: __________ Date: ______
- [ ] Technical Lead: __________ Date: ______
- [ ] Project Manager: __________ Date: ______

---

**Total Estimated Time:** 14-21 hours  
**Recommended Timeline:** 3-4 working days  
**Launch Readiness:** After all phases complete and signed off

**⚠️ DO NOT SKIP ANY STEPS - Each builds on the previous**
