# Security Implementation Guide

This directory contains comprehensive security utilities for protecting against XSS attacks, validating user input, and implementing secure forms.

## 📋 Table of Contents

1. [XSS Protection](#xss-protection)
2. [Input Validation](#input-validation)
3. [Secure Components](#secure-components)
4. [Best Practices](#best-practices)
5. [Examples](#examples)

---

## 🛡️ XSS Protection

### Overview
Cross-Site Scripting (XSS) attacks occur when malicious scripts are injected into trusted websites. Our XSS protection utilities provide defense against these attacks.

### Files
- `xss-protection.ts` - Core XSS sanitization functions

### Key Functions

#### `sanitizeInput(dirty, level)`
Sanitizes user input based on specified security level.

**Levels:**
- `strict` - Removes all HTML (safest for names, emails)
- `basic` - Allows simple formatting (bold, italic)
- `rich` - Allows paragraphs, links, lists (for bios, posts)

```typescript
import { sanitizeInput } from '@/utils/security/xss-protection';

// For user names (strict)
const cleanName = sanitizeInput(userName, 'strict');

// For user bios (rich)
const cleanBio = sanitizeInput(userBio, 'rich');
```

#### `sanitizeHTML(html)`
Prepares HTML for safe rendering with `dangerouslySetInnerHTML`.

```typescript
import { sanitizeHTML } from '@/utils/security/xss-protection';

<div dangerouslySetInnerHTML={sanitizeHTML(userContent)} />
```

#### `sanitizeURL(url)`
Validates URLs and blocks dangerous protocols (javascript:, data:, etc).

```typescript
import { sanitizeURL } from '@/utils/security/xss-protection';

const safeUrl = sanitizeURL(userProvidedUrl);
if (safeUrl) {
  window.open(safeUrl, '_blank');
}
```

---

## ✅ Input Validation

### Overview
Input validation ensures data quality and prevents injection attacks by enforcing strict rules on user inputs.

### Files
- `input-validation.ts` - Zod schemas and validation utilities

### Common Schemas

```typescript
import {
  nameSchema,
  emailSchema,
  bioSchema,
  messageSchema,
  postContentSchema,
  validateInput,
} from '@/utils/security/input-validation';

// Validate name
const result = validateInput(nameSchema, userName);
if (!result.success) {
  console.error(result.errors);
}
```

### Maximum Lengths

```typescript
export const MAX_LENGTHS = {
  NAME: 100,
  EMAIL: 255,
  BIO: 1000,
  MESSAGE: 2000,
  POST_CONTENT: 5000,
  COMMENT: 500,
  LOCATION: 200,
  OCCUPATION: 100,
  URL: 2000,
  PHONE: 20,
};
```

### Custom Validation

```typescript
import { sanitizeString } from '@/utils/security/input-validation';

// Validate with custom pattern
const cleanInput = sanitizeString(
  userInput,
  100, // max length
  /^[a-zA-Z0-9\s]+$/ // pattern: alphanumeric only
);
```

---

## 🔒 Secure Components

### SecureInput Component
Input field with built-in validation and XSS protection.

```typescript
import { SecureInput } from '@/components/security/SecureInput';

<SecureInput
  label="Full Name"
  value={name}
  onChange={setName}
  maxLength={100}
  pattern={/^[a-zA-Z\s'-]+$/}
  required
  showValidation
  error={errors.name}
/>
```

**Props:**
- `maxLength` - Maximum character limit
- `pattern` - Regex for validation
- `sanitizationLevel` - XSS protection level
- `showValidation` - Show success/error indicators
- `required` - Mark as required field

### SecureTextArea Component
Textarea with character counting and XSS protection.

```typescript
import { SecureTextArea } from '@/components/security/SecureTextArea';

<SecureTextArea
  label="Bio"
  value={bio}
  onChange={setBio}
  maxLength={1000}
  minLength={20}
  sanitizationLevel="rich"
  showCharCount
  required
/>
```

### useSecureForm Hook
React hook for handling forms with built-in security.

```typescript
import { useSecureForm } from '@/hooks/useSecureForm';
import { bioSchema } from '@/utils/security/input-validation';

const {
  formData,
  errors,
  isSubmitting,
  setValue,
  handleSubmit,
} = useSecureForm({
  schema: bioSchema,
  onSubmit: async (data) => {
    await updateProfile(data);
  },
  rateLimitKey: `update-profile-${userId}`,
  rateLimitMax: 5,
  rateLimitWindowMs: 60000, // 1 minute
});

<form onSubmit={handleSubmit}>
  <SecureInput
    value={formData.name || ''}
    onChange={(val) => setValue('name', val)}
    error={errors.name}
  />
</form>
```

---

## ⚠️ Best Practices

### 1. Always Sanitize User Input

```typescript
// ❌ NEVER do this
<div>{userInput}</div>

// ✅ ALWAYS sanitize
<div>{sanitizeInput(userInput, 'strict')}</div>
```

### 2. Use Appropriate Sanitization Level

```typescript
// For names, emails, numbers → 'strict'
const cleanName = sanitizeInput(name, 'strict');

// For comments → 'basic'
const cleanComment = sanitizeInput(comment, 'basic');

// For bios, posts → 'rich'
const cleanBio = sanitizeInput(bio, 'rich');
```

### 3. Validate Before Storing

```typescript
// ❌ Don't store without validation
await supabase.from('profiles').update({ bio: userBio });

// ✅ Validate first
const result = validateInput(bioSchema, userBio);
if (result.success) {
  await supabase.from('profiles').update({ bio: result.data });
}
```

### 4. Never Trust Client-Side Validation Alone
Always validate on the server (edge functions) as well.

```typescript
// In edge function
import { bioSchema } from './schemas';

const { bio } = await req.json();
const result = bioSchema.safeParse(bio);

if (!result.success) {
  return new Response(
    JSON.stringify({ error: 'Invalid bio' }),
    { status: 400 }
  );
}
```

### 5. Rate Limit Form Submissions

```typescript
import { checkRateLimit } from '@/utils/security/input-validation';

const canSubmit = checkRateLimit(
  `submit-form-${userId}`,
  5, // max attempts
  60000 // per minute
);

if (!canSubmit) {
  toast({ title: 'Too many requests', variant: 'destructive' });
  return;
}
```

---

## 📝 Examples

### Example 1: Secure Bio Update

```typescript
import { SecureTextArea } from '@/components/security/SecureTextArea';
import { bioSchema } from '@/utils/security/input-validation';
import { validateInput } from '@/utils/security/input-validation';

function BioEditor() {
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    const result = validateInput(bioSchema, bio);
    
    if (!result.success) {
      setError(result.errors[0]);
      return;
    }
    
    await supabase
      .from('profiles')
      .update({ bio: result.data })
      .eq('id', userId);
  };

  return (
    <SecureTextArea
      label="Bio"
      value={bio}
      onChange={setBio}
      maxLength={1000}
      minLength={20}
      sanitizationLevel="rich"
      error={error}
      required
    />
  );
}
```

### Example 2: Secure Post Creation

```typescript
import { useSecureForm } from '@/hooks/useSecureForm';
import { createPostSchema } from '@/utils/security/input-validation';

function CreatePost() {
  const { formData, errors, handleSubmit, setValue } = useSecureForm({
    schema: createPostSchema,
    onSubmit: async (data) => {
      await supabase.from('posts').insert({
        content: data.content,
        user_id: userId,
      });
    },
    rateLimitKey: `create-post-${userId}`,
    rateLimitMax: 10,
    rateLimitWindowMs: 60000,
  });

  return (
    <form onSubmit={handleSubmit}>
      <SecureTextArea
        value={formData.content || ''}
        onChange={(val) => setValue('content', val)}
        maxLength={5000}
        error={errors.content}
      />
      <Button type="submit">Post</Button>
    </form>
  );
}
```

### Example 3: Displaying User Content Safely

```typescript
import { sanitizeHTML } from '@/utils/security/xss-protection';

function UserPost({ post }) {
  return (
    <div>
      {/* Safe way to display HTML content */}
      <div dangerouslySetInnerHTML={sanitizeHTML(post.content)} />
      
      {/* Or use the component */}
      <SafeHTML content={post.content} level="rich" />
    </div>
  );
}
```

---

## 🚨 Security Checklist

Before deploying, ensure:

- [ ] All user inputs are sanitized using appropriate level
- [ ] All form submissions are validated with Zod schemas
- [ ] Rate limiting is implemented on sensitive operations
- [ ] Server-side validation exists in edge functions
- [ ] URLs are validated before redirects
- [ ] Filenames are sanitized for uploads
- [ ] No direct use of `dangerouslySetInnerHTML` without sanitization
- [ ] RLS policies are enabled on all database tables
- [ ] Error messages don't reveal sensitive information

---

## 📚 Additional Resources

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Zod Documentation](https://zod.dev)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
