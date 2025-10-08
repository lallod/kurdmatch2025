# Sentry Error Tracking Setup

Error tracking has been integrated into the app using Sentry. Follow these steps to complete the setup:

## 1. Create a Sentry Account

1. Go to [https://sentry.io/signup/](https://sentry.io/signup/)
2. Sign up for a free account
3. Create a new project and select "React" as your platform

## 2. Get Your DSN

After creating your project, Sentry will provide you with a DSN (Data Source Name). It looks like:
```
https://examplePublicKey@o0.ingest.sentry.io/0
```

## 3. Update Your Configuration

Open `src/main.tsx` and replace the placeholder DSN with your actual DSN:

```typescript
Sentry.init({
  dsn: "YOUR_ACTUAL_DSN_HERE", // Replace this
  // ... rest of configuration
});
```

## 4. Configure Environment-Specific Settings

For production, you may want to adjust these settings in `src/main.tsx`:

```typescript
Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.1, // Reduce to 10% in production to save quota
  replaysSessionSampleRate: 0.1, // Sample 10% of sessions
  replaysOnErrorSampleRate: 1.0, // Still capture 100% of error sessions
  environment: import.meta.env.MODE,
});
```

## 5. Test Error Tracking

To test if Sentry is working, you can temporarily add this code anywhere:

```typescript
throw new Error("Test Sentry integration");
```

Then check your Sentry dashboard to see if the error was captured.

## Features Included

- ✅ **Automatic Error Capture**: All uncaught errors are sent to Sentry
- ✅ **Performance Monitoring**: Track slow page loads and API calls
- ✅ **Session Replay**: See exactly what users did before an error occurred
- ✅ **Error Boundary**: Friendly error pages for users when something breaks
- ✅ **Production-Only**: Sentry only runs in production builds

## Error Boundary

The app includes a custom `ErrorBoundary` component that:
- Catches React component errors
- Sends them to Sentry with full context
- Shows users a friendly error message
- Provides a "Go to Discovery" button to recover

## Privacy Considerations

Session replay is configured to:
- Not mask text (for better debugging)
- Not block media
- Only sample 10% of normal sessions
- Capture 100% of sessions with errors

If you need more privacy, update the `replayIntegration` settings in `src/main.tsx`.

## Free Tier Limits

Sentry's free tier includes:
- 5,000 errors per month
- 10,000 performance units per month
- 50 replay sessions per month
- Unlimited team members

This should be enough for most small to medium apps. Monitor your usage in the Sentry dashboard.
