

# Pre-Publishing Checklist for KurdMatch

Here's everything you should check and fix before hitting "Publish."

---

## 1. Critical Security Issues (Must Fix)

These are flagged as errors in your security scans and **block a safe launch**:

| Issue | What It Means | How to Fix |
|-------|--------------|------------|
| **Phone verifications table exposed** | Attackers could steal phone numbers and verification codes | Tighten RLS policies so only the owner can access their record |
| **Payments table exposure** | Financial data (Stripe IDs, amounts) could be accessed | Ensure RLS restricts access to the payment owner + super admins only |
| **Scheduled content table too open** | The `USING(true)` policy lets anyone with the anon key read/write | Replace with `is_super_admin(auth.uid())` check |

---

## 2. Important Warnings (Should Fix)

| Issue | How to Fix |
|-------|------------|
| **Leaked password protection disabled** | Enable in your Supabase dashboard: Authentication > Settings > turn on leaked password protection |
| **Postgres version outdated** | Upgrade in Supabase dashboard: Settings > Infrastructure > Upgrade Postgres |
| **Extensions in public schema** | Move PostGIS to a dedicated schema (low risk, can do post-launch) |
| **Function search path mutable** | Add `SET search_path = public` to remaining functions |
| **Usage tracking functions accept user-supplied IDs** | Modify `can_perform_action` and `increment_usage_count` to use `auth.uid()` internally |

---

## 3. Manual Checks in Supabase Dashboard

These can't be done through code -- you need to do them in the Supabase dashboard:

- **Enable leaked password protection**: Auth > Settings
- **Upgrade Postgres version**: Settings > Infrastructure
- **Review all RLS policies**: Table Editor > Policies (spot-check that no table has `USING(true)` without role gating)

---

## 4. App Functionality Checks

Before publishing, manually test these flows:

- **Registration**: Create a new account, complete all steps, upload a photo
- **Login/Logout**: Email login, session persistence, logout
- **Discovery**: Browse profiles, like/dislike, match creation
- **Messaging**: Send and receive messages, real-time updates
- **Stories**: Create, view, react, delete
- **Groups**: Create, join, post
- **Settings**: Edit profile, change preferences, delete account
- **Admin**: Access super admin dashboard (if applicable)
- **Mobile**: Test on a phone-sized screen -- navigation, forms, swipe actions

---

## 5. Environment and Data

- **Check Live database for existing data**: If you've previously published, make sure schema changes won't destroy existing user data. Run destructive migrations in Cloud View > Run SQL (with Live selected) first.
- **Environment variables**: Confirm `VITE_SUPABASE_URL` and keys are correct for production.
- **Edge functions**: All 20+ edge functions are deployed and configured in `supabase/config.toml`.

---

## Priority Order

1. Fix the 3 critical security errors (phone verifications, payments, scheduled content RLS)
2. Enable leaked password protection in dashboard
3. Upgrade Postgres in dashboard
4. Test the main user flows listed above
5. Publish

Would you like me to fix the 3 critical security issues now?

