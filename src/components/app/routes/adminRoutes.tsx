import React, { Suspense, lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import SharedPageLoader from '@/components/app/SharedPageLoader';
import SuperAdminGuard from '@/components/app/SuperAdminGuard';

const SuperAdmin = lazy(() => import('@/pages/SuperAdmin'));

export const getAdminRoutes = (loading: boolean) => (
  <>
    <Route path="/admin" element={<Navigate to="/super-admin" replace />} />
    <Route path="/admin/*" element={<Navigate to="/super-admin" replace />} />
    <Route
      path="/super-admin/*"
      element={
        loading ? (
          <SharedPageLoader />
        ) : (
          <SuperAdminGuard>
            <Suspense fallback={<SharedPageLoader />}>
              <SuperAdmin />
            </Suspense>
          </SuperAdminGuard>
        )
      }
    />
  </>
);
