#  Batch 3: Toast-meldinger og gjenvaerende dialoger

## Oversikt

Det gjenstaar ca. 60+ brukerfacing filer med hardkodede engelske strenger -- hovedsakelig toast-meldinger (`toast.success/error/info`) og noen dialoger. Admin-sider (SuperAdmin) ekskluderes da de kun er for internt bruk.

## Prioritet 1: Profil-redigering og dialoger (~17 filer)

Disse er de mest synlige for brukerne:


| Fil                                                             | Hardkodede strenger                                                                                                               |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `my-profile/sections/editors/BasicInfoEditor.tsx`               | "Basic info updated successfully!"                                                                                                |
| `my-profile/sections/editors/CareerEducationEditor.tsx`         | "Career & education updated successfully!"                                                                                        |
| `my-profile/sections/editors/ValuesPersonalityEditor.tsx`       | "Values & personality updated!"                                                                                                   |
| `my-profile/sections/editors/InterestsHobbiesEditor.tsx`        | "Interests & hobbies updated!"                                                                                                    |
| `my-profile/sections/editors/FavoritesEditor.tsx`               | "Favorites updated successfully!"                                                                                                 |
| `my-profile/sections/editors/RelationshipPreferencesEditor.tsx` | "Relationship preferences updated!"                                                                                               |
| `my-profile/sections/EditableAboutMeSection.tsx`                | "Bio updated successfully!"                                                                                                       |
| `my-profile/PhotoManagement.tsx`                                | "Photo removed successfully", "Profile photo updated"                                                                             |
| `my-profile/PrivacySettings.tsx`                                | "Sharing removed", "Profile shared", "Failed to update sharing", "Field visibility is a Premium feature"                          |
| `my-profile/AIBioGeneratorDialog.tsx`                           | "AI is crafting 5 personalized bios...", "5 personalized bios generated!", "Failed to generate bios", "Bio updated successfully!" |
| `my-profile/dialogs/DownloadDataDialog.tsx`                     | "Download My Data", "What's Included", "Privacy & Security", all list items, buttons, progress text                               |
| `my-profile/dialogs/ChangePasswordDialog.tsx`                   | "Password changed successfully!"                                                                                                  |
| `my-profile/dialogs/ConnectedAccountsDialog.tsx`                | "Failed to load connected accounts", "Please enter a username", "Shareable link copied!"                                          |
| `my-profile/sections/LanguagesSection.tsx`                      | "Languages updated successfully!"                                                                                                 |


## Prioritet 2: Hooks (~6 filer)


| Fil                             | Hardkodede strenger                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `hooks/useUserSettings.ts`      | "Failed to load settings", "Settings updated successfully", "Failed to update settings"               |
| `hooks/useVideoVerification.ts` | "You must be logged in", "Video storage not configured", "Verification submitted!"                    |
| `hooks/useAIWingman.ts`         | "Too many requests", "AI credits exhausted", "Could not generate suggestions", "Something went wrong" |
| `hooks/useSwipeHistory.ts`      | "Rewind is a premium feature", "No swipe to undo", "Swipe undone!", "Failed to undo swipe"            |
| `hooks/useRealProfileData.ts`   | "Failed to load profile data", "Failed to update profile"                                             |
| `hooks/useAdminSettings.ts`     | "Setting updated", "Settings saved", "Settings reset to defaults"                                     |


## Prioritet 3: Bruker-sider (~15 filer)


| Fil                              | Hardkodede strenger                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `pages/MyProfile.tsx`            | "Failed to upload photo", "Photo removed", "Profile updated successfully"                                              |
| `pages/DiscoveryFeed.tsx`        | "Failed to load feed", "Failed to like post"                                                                           |
| `pages/Swipe.tsx`                | "Failed to load profiles"                                                                                              |
| `pages/LikedMe.tsx`              | "It's a match!", "Liked back!", "Failed to like profile"                                                               |
| `pages/SavedPosts.tsx`           | "Failed to load saved posts", "Post unsaved"                                                                           |
| `pages/CreateEvent.tsx`          | "Image must be less than 5MB", "Please fill in all required fields", "Event created successfully!"                     |
| `pages/Groups.tsx`               | "Failed to load groups"                                                                                                |
| `pages/GiftsAndDates.tsx`        | "Date cancelled"                                                                                                       |
| `pages/Subscription.tsx`         | "Your subscription has been activated", "You can try again whenever you're ready", "Checking your subscription status" |
| `pages/NotificationSettings.tsx` | "All notifications have been deleted", "Failed to clear notifications"                                                 |
| `pages/Matches.tsx`              | "Failed to load matches"                                                                                               |


## Prioritet 4: Andre komponenter (~10 filer)


| Fil                                          | Hardkodede strenger                                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `components/ProfileHeader.tsx`               | "Profile background color updated!"                                                                      |
| `components/boost/ProfileBoostCard.tsx`      | "You have used all your boosts", "Profile Boost activated!", "Failed to activate boost"                  |
| `components/settings/TravelModeSettings.tsx` | "Gold feature", "Failed to save Travel Mode settings"                                                    |
| `components/settings/ChaperoneMode.tsx`      | "Please enter your chaperone's email", "Chaperone settings saved", "Failed to save settings"             |
| `components/discovery/SharePostDialog.tsx`   | "Link copied to clipboard"                                                                               |
| `components/discovery/EditPostDialog.tsx`    | "Post content cannot be empty", "Post is too long", "Post updated successfully", "Failed to update post" |
| `components/discovery/DeletePostDialog.tsx`  | "Post deleted successfully", "Failed to delete post"                                                     |
| `components/groups/GroupSettingsDialog.tsx`  | "Please enter a group name", "Group updated successfully!", "Group deleted successfully"                 |
| `components/instagram/ProfileHeader.tsx`     | "Unfollowed", "Following", "Failed to update follow status", "Failed to start checkout"                  |
| `components/profile/LanguageEditor.tsx`      | "This language is already selected"                                                                      |


## Implementeringssteg

### Steg 1: SQL-migrasjon

Sett inn ca. 120 nye oversettelsesnokler med oversettelser for alle 5 spraak (english, norwegian, kurdish_sorani, kurdish_kurmanci, german). Det gir ca. 600 nye rader i `app_translations`.

Nokkelkonvensjon:

```
toast.profile.basic_updated       -> "Basic info updated successfully!"
toast.profile.photo_removed       -> "Photo removed successfully"
toast.settings.saved              -> "Settings updated successfully"
toast.swipe.undone                -> "Swipe undone!"
toast.error.load_failed           -> "Failed to load data"
download_data.title               -> "Download My Data"
download_data.whats_included      -> "What's Included"
...
```

### Steg 2: Oppdater Prioritet 1-filer (profil-redigering)

- Importer `useTranslations` i filer som mangler det
- Wrap alle toast-strenger i `t('key', 'English fallback')`
- Wrap alle UI-strenger i dialoger (f.eks. DownloadDataDialog)

### Steg 3: Oppdater Prioritet 2-filer (hooks)

- For hooks som ikke er React-komponenter: bruk en hjelpefunksjon eller pass `t` som parameter
- Alternativt: importer `useTranslations` i hooks som allerede er custom hooks

### Steg 4: Oppdater Prioritet 3 og 4 (sider og komponenter)

- Wrap gjenvaerende toast-meldinger i `t()`

## Estimert omfang

- ~120 nye oversettelsesnokler
- ~600 nye rader i `app_translations` (120 x 5 spraak)
- ~48 filer aa modifisere
- 1 SQL-migrasjon

Arbeidet deles i 2 steg grunnet mengden filer:

1. SQL-migrasjon + Prioritet 1 og 2 (23 filer)
2. Prioritet 3 og 4 (25 filer)