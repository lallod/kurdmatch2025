

# Audit: Remaining Hardcoded Strings Not Yet Covered by i18n

After a comprehensive search of the entire codebase, here is everything that still has hardcoded English strings needing localization. These were **not included** in any of the 21 completed batches.

---

## Summary

There are approximately **~120 hardcoded strings** remaining across **~25 files**, split into two main areas:

1. **SuperAdmin leftovers** (~15 strings across 3 files)
2. **User-facing components and hooks** (~105 strings across ~22 files)

---

## Area 1: SuperAdmin Leftovers (3 files)

### 1. `GenerateProfilesForm.tsx`
- No `useTranslations` at all
- Hardcoded: "Feature Disabled", "Information", "Real Users Only", "How to Add Users", "Processing...", "Close"

### 2. `UpdateProfilesForm.tsx`
- No `useTranslations` at all
- Hardcoded: "Real Data Mode", "User Profile Management", toast messages, "Close"

### 3. `NewRoleDialog.tsx`
- Already has `useTranslations`, but still has hardcoded placeholders:
  - `placeholder="e.g., Content Manager"`
  - `placeholder="Describe the purpose of this role"`
  - `<option>Support Agent</option>`, `<option>Marketing</option>`

---

## Area 2: User-Facing Pages (8 files)

### 4. `CreatePost.tsx`
- 3 toast messages: "File is too large", "Failed to upload image", "Please enter some content"

### 5. `EventDetail.tsx`
- 4 toast messages: "Failed to load event details", "You are no longer attending...", "You are now attending...", "Failed to update attendance"

### 6. `GroupDetail.tsx`
- 2 toast messages: "Failed to load group", "Failed to update membership"

### 7. `AdvancedSearch.tsx`
- 1 toast: "Failed to search profiles"

### 8. `LikedMe.tsx`
- 1 toast: "Profile passed"

### 9. `CreateSuperAdmin.tsx`
- 1 toast: "Email and password are required"

### 10. `AddUserDialog.tsx` (SuperAdmin)
- Already has `useTranslations` but 3 `toast.success`/`toast.error` calls still hardcoded

---

## Area 3: User-Facing Components (~12 files)

### 11. `CommentSection.tsx` (discovery)
- 3 toasts: "Failed to load comments", "Comment posted", "Failed to post comment"

### 12. `CommentThread.tsx` (discovery)
- 3 toasts: "Failed to update like", "Comment deleted", "Failed to delete comment"

### 13. `ReportDialog.tsx` (discovery)
- 2 toasts: "Report Submitted", "Failed to submit report"

### 14. `BlockUserDialog.tsx` (discovery)
- 2 toasts: "User Blocked", "Failed to block user"

### 15. `ContactSupportDialog.tsx` (support)
- 3 toasts: "Validation Error", "Message Sent", "Failed to send message"

### 16. `MyTickets.tsx` (support)
- 2 toasts: "Thank you!", "Failed to submit feedback"

### 17. `ProfileActionButtons.tsx` (profile)
- 2 toasts: "Unfollowed/Following", "Failed to start checkout"

### 18. `MessageTranslation.tsx` (chat)
- 4 toasts: "Rate limit reached", "Service unavailable", "Translation complete", "Translation failed"

### 19. `AIPhotoStudioDialog.tsx` (shared)
- 4 toasts: "Feature Migration in Progress", "AI Photo Enhancement", "Photo Enhanced!", "Enhancement Failed"

### 20. `VerificationForm.tsx`
- Toast `title:` fields ("Error", "Success") are still hardcoded even though descriptions use `t()`

---

## Area 4: Hooks (~6 files)

### 21. `usePhoneVerification.ts`
- 4 toasts: "Code Sent", "Verified!", error messages

### 22. `useSubscription.ts`
- 3 toasts: "Failed to check subscription", "Failed to start checkout", "Failed to open subscription management"

### 23. `useSecureForm.ts`
- 4 toasts: "Too Many Attempts", "Success", "Validation Error", "Submission Error"

### 24. `usePushNotifications.ts`
- 6 toasts: "Not Supported", "Permission Denied", "Success" (enabled/disabled), error messages

### 25. `useLocationManager.ts` + location files
- ~7 toasts: "Geolocation not supported", "Location updated", "Location error", "Search error", "Passport location removed"

### 26. `useConversationInsights.ts`
- 2 toasts: "Insights generated", "Failed to generate insights"

### 27. `useVerificationData.ts`
- 3 toasts: "Error" (load), "Success" (verify/reject), "Error" (action)

### 28. `useNearbyUsers.ts`
- 1 toast: "Failed to load nearby users"

---

## Area 5: Auth / Registration (~4 files)

### 29. `useDynamicRegistrationForm.ts`
- ~9 toasts: "Error", "Incomplete Fields", "Validation Error", "Registration Failed", "Registration Successful!", "Photo Upload Warning"

### 30. `RegistrationForm.tsx`
- Step titles: "Account", "Personal", "Profile"
- 2 toasts: "Success!", "Error"

### 31. `EnhancedDynamicRegistrationForm.tsx`
- 2 toasts: "Incomplete Registration", "Validation Error"

### 32. `useRegistrationForm.tsx`
- 4 toasts: "Photo Upload Warning", "Profile Complete!", "Success!", "Error"

### 33. `ProfileCompletionWizard.tsx`
- Step titles: "About You", "Your Lifestyle", "Values & Beliefs", etc. (8 steps)
- 2 toasts: "Profile completed!", "Error"

### 34. `SuperAdminSetupForm.tsx`
- 3 toasts: "Strong password generated", "Copied to clipboard", "Copy failed"

---

## Area 6: Landing Page Defaults

### 35. `KurdistanSection.tsx`, `FeaturesSection.tsx`, `useLandingV2Content.ts`
- These contain hardcoded default/fallback content in English. These are used as fallback when database content is not loaded, so they are somewhat acceptable, but ideally should use `t()`.

---

## Recommended Batches

| Batch | Scope | Files | Strings |
|-------|-------|-------|---------|
| Batch 22 | SuperAdmin leftovers + AddUserDialog fix | 3 files | ~15 |
| Batch 23 | User-facing pages (CreatePost, EventDetail, GroupDetail, etc.) | 6 files | ~12 |
| Batch 24 | Discovery + Support + Profile components | 7 files | ~20 |
| Batch 25 | Chat, Shared, Verification component toast titles | 3 files | ~12 |
| Batch 26 | Hooks (phone, subscription, secure form, push, location, etc.) | 8 files | ~30 |
| Batch 27 | Auth/Registration (forms, wizard, setup) | 6 files | ~30 |

Total: **6 more batches** covering ~25 files and ~120 strings.

---

## Notes

- `ErrorBoundary.tsx` is intentionally excluded (class component, per project memory).
- `fieldLabels.ts` internal validation labels are intentionally English-only.
- Landing page default/fallback content (KurdistanSection, FeaturesSection, useLandingV2Content) could be deferred since the real content comes from the database.
- The `SocialLoginPage.tsx` toast messages (lines 34, 39) still use template literals without `t()` -- e.g., `` `${provider.id} provider updated` ``. This was missed in Batch 18.

