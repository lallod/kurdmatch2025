

# P2 Security Hardening & Code Quality

## Audit of Remaining Issues

### Remaining `getSession()` (6 files)
| File | Verdict |
|------|---------|
| `src/integrations/supabase/auth.tsx` | **OK** - Initial session bootstrap, legitimate use |
| `src/components/auth/hooks/useOAuthCallback.ts` | **OK** - OAuth flow, needs session check |
| `src/components/auth/hooks/useRegistrationForm.tsx` | **OK** - OAuth registration detection |
| `src/pages/ResetPassword.tsx` | **OK** - Recovery flow session check |
| `src/utils/auth/adminManager.ts` | **FIX** - Line 86 verifies session after login, should use `getUser()` |
| `src/hooks/usePhoneVerification.ts` | **FIX** - Two calls (lines 17, 43) should use `getUser()` |

### Remaining `select('*')` on `profiles` (4 locations)
| File | Context | Risk |
|------|---------|------|
| `src/utils/demoDataGenerator.ts` | Admin tool | Medium - admin-only but still leaks pattern |
| `src/utils/realUserEnhancement.ts` | Admin enhancement tool | Medium |
| `src/utils/profileGenerator/generators/generators/profileDetails.ts` | Admin profile generator | Medium |
| `src/pages/SuperAdmin/components/users/AdminProfileEditor.tsx` | Admin panel editing own users | Low - admin needs full data, but should still use explicit columns |

### Console.log Cleanup
610 `console.log` calls in 34 files. These leak internal logic to browser DevTools in production. Rather than removing them all, we should **replace them with a logger utility** that is silent in production.

### `any` Type Usage
825 instances in 104 files. Too large for one pass. Will skip for now - this is a long-term refactor task.

## Implementation Plan

### Step 1: Fix remaining `getSession()` (2 files)
- `usePhoneVerification.ts`: Replace both `getSession()` with `getUser()`
- `adminManager.ts`: Replace session verification at line 86 with `getUser()`

### Step 2: Fix remaining `select('*')` on profiles (4 files)
- Replace with `SAFE_PROFILE_COLUMNS` or `ALL_OWN_PROFILE_COLUMNS` depending on context
- Admin tools that need full data can use `ALL_OWN_PROFILE_COLUMNS`

### Step 3: Create production logger utility
Create `src/utils/logger.ts` that wraps `console.log/warn/error` and is silent in production (`import.meta.env.PROD`). Then replace the most security-sensitive `console.log` calls (auth flows, admin manager, API layer) - approximately 15-20 files.

### Step 4: Remove sensitive console.log in auth flows
Priority files: `adminManager.ts`, `assignAdminRole.ts`, `useOAuthCallback.ts`, `useRegistrationForm.tsx` - these log credentials, user IDs, and session data.

**Estimated files to modify**: ~10 files

