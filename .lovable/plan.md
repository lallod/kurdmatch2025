

# Ghost Users System -- Auto-Generated Profiles for KurdMatch

Build a full "Ghost Users" management system in the Super Admin panel that lets admins generate realistic fake profiles that appear indistinguishable from real users, with scheduled future activity (posts, stories) to simulate ongoing engagement.

---

## Overview

Ghost users are profiles controlled entirely by the admin. They:
- Appear in discovery feeds, swipe queues, and social feeds like normal users
- Have scheduled posts and stories that auto-publish over time
- Are marked with a hidden `is_generated = true` flag in the database (invisible to regular users)
- Can be created, viewed, and bulk-deleted from a dedicated admin page

---

## 1. Database Changes

### 1.1 Add `is_generated` column to `profiles`

Add a boolean column `is_generated` (default `false`) to the `profiles` table. This flag is never exposed in any public API or frontend query -- only used in the admin panel.

### 1.2 Create `scheduled_content` table

A new table to hold future posts and stories that will be auto-published:

```text
scheduled_content
  id            UUID (PK)
  profile_id    UUID (FK -> profiles)
  content_type  TEXT ('post' | 'story')
  content       TEXT (post text / caption)
  media_url     TEXT (image URL)
  scheduled_for TIMESTAMPTZ
  published     BOOLEAN (default false)
  created_at    TIMESTAMPTZ
```

### 1.3 Database function: `publish_scheduled_content()`

A Postgres function that:
- Finds all rows in `scheduled_content` where `scheduled_for <= NOW()` and `published = false`
- Inserts them into the `posts` or `stories` table accordingly
- Marks them as `published = true`
- Can be called periodically (via a cron or manually from admin)

---

## 2. New Admin Page: Ghost Users

### 2.1 Route and Navigation

- Add `/super-admin/ghost-users` route
- Add a "Ghost Users" menu item with a Bot icon in the sidebar (placed near "Users Management")

### 2.2 Ghost Users Dashboard (`GhostUsersPage.tsx`)

A full management page with:

**Stats Banner**: Total ghost users, active posts count, scheduled content count

**Generation Form** (dialog):
- Count selector: 20, 50, 100 (or custom number)
- Gender selector: Male only, Female only, or Mixed
- Content options (checkboxes):
  - Generate profile posts (2-5 random posts per user)
  - Generate stories (1-3 stories with future scheduling)
  - Generate profile photos (2-4 Unsplash stock photos)
  - Set as verified profiles
- Kurdistan region filter (optional): target specific regions
- Progress bar showing generation status

**Ghost Users Table**:
- Shows all profiles where `is_generated = true`
- Columns: Name, Gender, Location, Posts count, Stories count, Created date, Status
- Actions: View profile, Delete single user

**Bulk Actions**:
- "Delete All Ghost Users" button (with confirmation dialog)
- "Regenerate Activity" to create new scheduled posts/stories for existing ghost users

### 2.3 Generation Logic (`src/utils/ghostUserGenerator.ts`)

The generator will:

1. Create a UUID for each ghost profile
2. Use the existing name/location/attribute data from `src/utils/profileGenerator/data/` 
3. Insert directly into `profiles` with `is_generated = true`
4. Optionally insert into `photos` with stock Unsplash URLs
5. Optionally insert into `posts` (some immediate, some scheduled via `scheduled_content`)
6. Optionally insert into `stories` (with `expires_at` set 24h from scheduled publish time)
7. Set `last_active` to a recent randomized timestamp
8. Schedule 1-3 future posts/stories per user spread over the next 7-30 days

### 2.4 Scheduled Content Publisher

A utility function `publishScheduledContent()` that:
- Calls the `publish_scheduled_content()` database function
- Can be triggered manually from the admin panel ("Publish Due Content" button)
- Also updates the ghost user's `last_active` timestamp when content is published

---

## 3. Visibility Rules

- The `is_generated` column is **never** shown to regular users
- Ghost users appear in discovery feeds, social feeds, and story rings like normal users
- The admin panel filters by `is_generated = true` to show only ghost users on the Ghost Users page
- The existing Users Management page can optionally filter out ghost users (add a toggle)

---

## 4. Post and Story Content

### Post content templates (randomized):
- Lifestyle captions: "Beautiful sunset in [location] today", "Coffee and good vibes"
- Kurdish culture references: "Newroz preparations", "Traditional Kurdish breakfast"
- Travel/activity posts with stock image URLs from Unsplash

### Story content:
- Text overlays on colored backgrounds (using existing story schema fields)
- Categories: daily_life, travel, food, culture, selfie

---

## 5. Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/pages/SuperAdmin/pages/GhostUsersPage.tsx` | Main admin page |
| Create | `src/components/admin/GhostUserGenerator.tsx` | Generation form dialog |
| Create | `src/components/admin/GhostUsersTable.tsx` | Table listing ghost users |
| Create | `src/utils/ghostUserGenerator.ts` | Core generation logic |
| Modify | `src/pages/SuperAdmin/SuperAdminLayout.tsx` | Add sidebar menu item |
| Modify | `src/pages/SuperAdmin/index.tsx` | Add route |
| Create | Migration SQL | Add `is_generated` column + `scheduled_content` table |

---

## 6. Implementation Order

1. Database migration (add `is_generated`, create `scheduled_content`, create publish function)
2. Ghost user generator utility (profiles, photos, posts, stories, scheduled content)
3. GhostUsersPage with stats, generation form, and user table
4. Wire into admin sidebar and routes
5. Add "Publish Due Content" manual trigger
6. Test end-to-end: generate 20 users, verify they appear in discovery feed

