

# Plan: Full Admin Control for Categories, Registration Questions, and Multilingual Support

## Summary

This plan adds full multilingual editing capability to the admin panel for categories and registration questions, so admins can manage all content in all 5 languages (EN, NO, Kurdish Sorani, Kurdish Kurmanci, DE) -- including what users see during registration.

---

## Step 1: Database -- Add Translation Columns

Add multilingual name/text columns to the existing tables so each question and category can have translations stored directly.

### Migration 1: `registration_questions` -- add translation columns

Add these columns:
- `text_en`, `text_no`, `text_ku_sorani`, `text_ku_kurmanci`, `text_de` (question text per language)
- `placeholder_en`, `placeholder_no`, `placeholder_ku_sorani`, `placeholder_ku_kurmanci`, `placeholder_de`
- `field_options_en`, `field_options_no`, `field_options_ku_sorani`, `field_options_ku_kurmanci`, `field_options_de` (ARRAY columns for translated options)

Default: copy existing `text` into `text_en`, `placeholder` into `placeholder_en`, `field_options` into `field_options_en`.

### Migration 2: `content_categories` and `category_items` -- add translation columns

- `content_categories`: add `name_en`, `name_no`, `name_ku_sorani`, `name_ku_kurmanci`, `name_de`, `description_en`, `description_no`, etc.
- `category_items`: add `name_en`, `name_no`, `name_ku_sorani`, `name_ku_kurmanci`, `name_de`, `description_en` through `description_de`

---

## Step 2: Upgrade Registration Questions Admin Page

### 2A. Connect `useQuestions` to Database

Replace the current in-memory mock approach (`initialQuestions` + `systemQuestions`) with real Supabase queries:
- Fetch from `registration_questions` table on mount
- All CRUD operations (add, edit, delete, reorder, toggle) write to the database via `executeAdminAction`

**Files modified:**
- `src/pages/SuperAdmin/components/registration-questions/useQuestions.ts`

### 2B. Add Multilingual Editing to Question Dialogs

Update `EditQuestionDialog` and `AddQuestionDialog` to include tabs for each language:
- A language tab bar (EN | NO | Sorani | Kurmanci | DE)
- Under each tab: editable question text, placeholder, and field options for that language
- Visual indicator showing which languages are filled vs. empty

**Files modified:**
- `src/pages/SuperAdmin/components/registration-questions/EditQuestionDialog.tsx`
- `src/pages/SuperAdmin/components/registration-questions/AddQuestionDialog.tsx`
- `src/pages/SuperAdmin/components/registration-questions/types.ts` (add translation fields to `QuestionItem`)

### 2C. Update Registration Form to Use Translated Questions

The `EnhancedDynamicRegistrationForm` and its renderer will read the user's current language and display the corresponding `text_XX`, `placeholder_XX`, and `field_options_XX` values.

**Files modified:**
- `src/components/auth/hooks/useDynamicRegistrationForm.ts` (fetch translated fields)
- `src/components/auth/components/EnhancedStepRenderer.tsx` (use translated text)

---

## Step 3: Upgrade Categories Admin Page

### 3A. Replace Mock Data with Real DB Operations

The `CategoriesPage` currently initializes with hardcoded mock categories/items. Replace with the existing `useAdminCategories` hook data (already partially wired) and fix field name mismatches (`order` vs `display_order`, `itemCount` vs `item_count`).

**Files modified:**
- `src/pages/SuperAdmin/pages/CategoriesPage.tsx` (remove mock data, fix field mapping)

### 3B. Add Multilingual Editing to Category/Item Dialogs

Update the Add/Edit dialogs for categories and items to include language tabs, similar to Step 2B.

**Files modified:**
- `src/pages/SuperAdmin/pages/CategoriesPage.tsx` (update dialog forms to include language tabs)

### 3C. Route Category Mutations Through Audit Logger

All create/update/delete operations will use `executeAdminAction` for audit trail.

**Files modified:**
- `src/pages/SuperAdmin/hooks/useAdminCategories.ts`

---

## Step 4: User Access Management Improvements

Ensure the existing Users Management page has clear access to:
- View all users with search/filter
- Edit any user's profile (already done via AdminProfileEditor)
- Delete/block/unblock users (already wired via admin-actions)
- View roles and assign roles

No new pages needed -- verify existing wiring works end-to-end.

---

## Technical Details

### Database Column Strategy

Instead of a separate translations table (which adds JOIN complexity), translation columns are added directly to the source tables. This keeps queries simple and fast. 5 languages x 3 fields = 15 new columns per table, which is manageable.

```text
registration_questions
  text          -- default/fallback (English)
  text_en       -- English
  text_no       -- Norwegian
  text_ku_sorani    -- Kurdish Sorani
  text_ku_kurmanci  -- Kurdish Kurmanci
  text_de       -- German
  placeholder_en ... placeholder_de
  field_options_en ... field_options_de (ARRAY)
```

### Language Tab UI Pattern (reused in both pages)

```text
+----+----+--------+----------+----+
| EN | NO | Sorani | Kurmanci | DE |
+----+----+--------+----------+----+
| Question Text: [________________]  |
| Placeholder:   [________________]  |
| Options:  [tag1] [tag2] [+Add]     |
+------------------------------------+
```

### Files Summary

| Action | File |
|--------|------|
| Migration | Add ~30 translation columns across 3 tables |
| Modify | `useQuestions.ts` -- DB-driven CRUD |
| Modify | `EditQuestionDialog.tsx` -- language tabs |
| Modify | `AddQuestionDialog.tsx` -- language tabs |
| Modify | `types.ts` -- translation fields |
| Modify | `CategoriesPage.tsx` -- remove mocks, add language tabs |
| Modify | `useAdminCategories.ts` -- audit logging |
| Modify | `useDynamicRegistrationForm.ts` -- read translated fields |
| Modify | `EnhancedStepRenderer.tsx` -- display translated text |

### Estimated scope
- 1 database migration (add columns + backfill)
- ~9 files modified
- No new pages needed

