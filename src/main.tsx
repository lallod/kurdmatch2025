import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useSupabaseAuth } from '@/integrations/supabase/auth'
import * as Sentry from "@sentry/react";

// Initialize Sentry for error tracking
Sentry.init({
  dsn: "https://example@sentry.io/example", // Replace with your actual Sentry DSN
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions in dev, reduce in prod
  // Session Replay
  replaysSessionSampleRate: 0.1, // Sample 10% of sessions
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors
  enabled: import.meta.env.PROD, // Only enable in production
  environment: import.meta.env.MODE,
});

// Create a client
const queryClient = new QueryClient()

// Disable console logs in production
if (import.meta.env.PROD) {
  // Remove non-error logs in production (but keep errors for Sentry)
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.warn = () => {};
}

import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)