

# Batch 18: i18n -- Registration Questions, Categories, Roles, API Keys, Email Campaigns, Social Login, Bulk User Operations

This batch covers the remaining hardcoded strings across SuperAdmin components that still lack `useTranslations` integration.

## Scope

### Group A: Registration Questions (7 files)
Files: `QuestionsToolbar.tsx`, `QuestionsTable.tsx`, `AddQuestionDialog.tsx`, `EditQuestionDialog.tsx`, `QuestionPreviewCard.tsx`, `BulkActions.tsx`, `useQuestions.ts`

Hardcoded strings include:
- Toolbar: "Registration Questions", "Configure questions users will answer...", "Search questions...", "Filter Questions", "Required/Optional/Enabled/Disabled Questions"
- Table headers: "Question", "Category", "Field Type", "Required", "Status", "Registration Step", "Actions", "No questions found", "System field - some operations are restricted", "Maps to:"
- Table badges: "Required", "Optional", "Enabled", "Disabled"
- Add dialog: "Add New Registration Question", "Create a new question...", labels (Question Text, Category, Field Type, Registration Step, Placeholder Text, Profile Field Mapping, Required, Enabled, Field Options), "Add a new option", "Cancel", "Add Question"
- Edit dialog: "Edit Registration Question", "Make changes to...", "Save Changes", same labels
- Preview card: "Preview", "Mobile", "Desktop", "Registration Preview", "Select a question to preview...", "Continue", "Unsupported field type", "Yes"
- BulkActions: "questions selected", "Enable", "Disable", "Delete"
- useQuestions.ts: 6 toast messages ("System fields cannot be modified...", "Question deleted successfully", etc.)

### Group B: Remaining Admin Pages (5 files)
Files: `CategoriesPage.tsx`, `RolesPage.tsx`, `ApiKeysPage.tsx`, `EmailCampaignsPage.tsx`, `SocialLoginPage.tsx`

Hardcoded strings:
- CategoriesPage: ~15 toast messages, table headers ("Name", "Description", "Order", etc.), filter buttons ("All", "Active", "Inactive"), card titles ("Profile Categories"), search placeholders
- RolesPage: 2 toast messages
- ApiKeysPage: ~6 toast messages, confirm dialog text
- EmailCampaignsPage: 3 toast messages ("Campaign started/paused/deleted")
- SocialLoginPage: 2 toast messages

### Group C: User Hooks (2 files)
Files: `useUserData.ts`, `useBulkUserDelete.ts`

Hardcoded strings:
- useUserData: 1 toast message
- useBulkUserDelete: ~6 toast/info messages

## Implementation Steps

1. **Database migration**: Insert ~80 new translation keys (400+ rows) across 5 languages covering all strings above.

2. **Update Group A files** (registration questions): Add `useTranslations` import and replace all hardcoded strings with `t()` calls. For `useQuestions.ts` (a hook, not a component), the `t` function will need to be passed as a parameter or the hook will need refactoring to accept translations.

3. **Update Group B files**: Add `useTranslations` where missing (RolesPage) and replace toast messages and remaining UI strings.

4. **Update Group C files**: Since these are hooks (not components), the `t` function will be passed from calling components, or we refactor the toast calls to use translation keys.

## Technical Details

- For non-component files (hooks like `useQuestions.ts`, `useBulkUserDelete.ts`, `useUserData.ts`), since React hooks can call other hooks, we can use `useTranslations()` directly inside these custom hooks.
- All translation keys will follow the existing `admin.*` namespace pattern.
- The SQL migration will include entries for: english, norwegian, german, kurdish_sorani, kurdish_kurmanji.

