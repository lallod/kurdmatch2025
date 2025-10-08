# Test Suite Documentation

This directory contains automated tests for critical workflows in the application.

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Structure

### 1. Authentication Tests (`workflows/authentication.test.tsx`)
- User registration flow
- Email and password validation
- Step navigation
- Login functionality
- Logout functionality

### 2. Profile Management Tests (`workflows/profile-management.test.tsx`)
- Profile creation with required fields
- Profile updates
- Photo uploads
- Profile completeness validation

### 3. Matching Tests (`workflows/matching.test.tsx`)
- Like functionality
- Match creation on mutual likes
- Profile discovery with filters
- Daily usage limits

### 4. Messaging Tests (`workflows/messaging.test.tsx`)
- Send messages
- Message rate limiting
- Retrieve conversation messages
- Mark messages as read
- Block users
- Mute conversations

### 5. Admin Dashboard Tests (`workflows/admin-dashboard.test.tsx`)
- Admin role verification
- User management (CRUD operations)
- Content moderation
- Analytics and stats
- Bulk actions
- Data exports

## Test Coverage Goals

- **Authentication**: 80%+ coverage
- **Profile Management**: 75%+ coverage
- **Matching Logic**: 70%+ coverage
- **Messaging**: 75%+ coverage
- **Admin Dashboard**: 70%+ coverage

## Adding New Tests

1. Create test file in appropriate workflow directory
2. Import necessary utilities from `@testing-library/react`
3. Mock Supabase calls using vitest mocks
4. Write descriptive test cases
5. Ensure tests are isolated and don't depend on each other

## Best Practices

- Use descriptive test names
- Test one thing per test case
- Mock external dependencies
- Clean up after each test
- Use `waitFor` for async operations
- Avoid testing implementation details

## CI/CD Integration

These tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test:coverage
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Troubleshooting

### Tests failing due to Supabase mocks
- Check that mocks in `src/test/setup.ts` match your usage
- Ensure you're using `vi.mocked()` correctly

### Timeout errors
- Increase timeout in vitest config
- Check for unresolved promises

### Component rendering errors
- Ensure all providers are wrapped correctly
- Check for missing context providers
