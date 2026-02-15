import React, { Suspense, lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const SuperAdmin = lazy(() => import('@/pages/SuperAdmin'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-muted">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

export const getAdminRoutes = (loading: boolean) => (
  <>
    <Route path="/admin" element={<Navigate to="/super-admin" replace />} />
    <Route path="/admin/*" element={<Navigate to="/super-admin" replace />} />
    <Route
      path="/super-admin/*"
      element={
        loading ? (
          <PageLoader />
        ) : (
          <Suspense fallback={<PageLoader />}>
            <SuperAdmin />
          </Suspense>
        )
      }
    />
  </>
);
