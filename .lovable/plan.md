

# Remaining Internationalization Work

The previous batch successfully wrapped UI labels in `t()` for Category A and B files. However, significant hardcoded content remains across the app. Here is the next batch of work:

---

## Batch 2: Remaining Hardcoded Strings

### 1. HelpSupport.tsx -- FAQ Content (HIGH PRIORITY, ~100 strings)
The entire FAQ section (lines 23-84) is hardcoded English -- every question, answer, category title, and description. These need to be wrapped in `t()` with keys like:
- `help.faq.getting_started.title` / `.description`
- `help.faq.getting_started.q1` / `.a1`
- `help.faq.safety.title` / `.description`
- etc.

### 2. StoryBubbles.tsx -- "Your Story" label
Line 33: `"Your Story"` needs `t('stories.your_story', 'Your Story')`

### 3. PostCard.tsx -- Scattered strings
- Line 250: `'like'` / `'likes'` (needs pluralization via `t()`)
- Line 263: `'more'` button text
- Line 276: `'View all {n} comments'`

### 4. ConversationList.tsx -- Scattered strings
- Line 74: `'new'` badge text
- Line 114: `'New'` match label
- Line 133: `'Priority'` section header
- Line 174: `'unread'` badge text
- Line 224: `'typing...'` indicator

### 5. CreateStory.tsx -- Placeholder text
- `'Type your story...'` placeholder

### 6. Toast messages across ~113 files
Dozens of `toast.success(...)`, `toast.error(...)` calls with hardcoded English throughout the app. The most impactful are in user-facing components (not admin pages).

---

## Implementation Steps

### Step 1: SQL Migration
Insert ~150 new translation keys for:
- All FAQ content (5 categories x ~4 questions x 2 fields = ~40 keys for Q&A + 10 for titles/descriptions)
- Remaining UI strings from PostCard, ConversationList, StoryBubbles, CreateStory
- High-priority toast messages from user-facing components

Each key will have translations for all 5 languages (english, norwegian, kurdish_sorani, kurdish_kurmanci, german).

### Step 2: Update Components
Modify these files to wrap remaining hardcoded strings:
- `src/pages/HelpSupport.tsx` -- Wrap all FAQ data in `t()` calls
- `src/components/discovery/StoryBubbles.tsx` -- 1 string
- `src/components/discovery/PostCard.tsx` -- 3 strings
- `src/components/messages/ConversationList.tsx` -- 5 strings
- `src/pages/CreateStory.tsx` -- 1 string

### Step 3: Toast Messages (User-Facing Components)
Update toast messages in the most visible user-facing files:
- `src/pages/BlockedUsers.tsx` (already has `t()` hook, but some toasts still hardcoded)
- `src/components/my-profile/` dialogs
- `src/pages/CreateGroup.tsx`
- `src/components/stories/CreateStoryModal.tsx`
- Other high-traffic components

### Estimated Scope
- ~150 new translation keys
- ~750 new rows in `app_translations` (150 keys x 5 languages)
- ~10-15 files to modify
- 1 SQL migration

