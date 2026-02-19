import React, { Suspense, lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import SharedPageLoader from '@/components/app/SharedPageLoader';
import SuperAdminGuard from '@/components/app/SuperAdminGuard';

const SuperAdmin = lazy(() => import('@/pages/SuperAdmin'));
const SuperAdminSetup = lazy(() => import('@/components/auth/SuperAdminSetup'));
const CreateSuperAdmin = lazy(() => import('@/pages/CreateSuperAdmin'));

const L: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<SharedPageLoader />}>{children}</Suspense>
);

export const getAdminRoutes = (loading: boolean) => (
  <>
    <Route path="/admin" element={<Navigate to="/super-admin" replace />} />
    <Route path="/admin/*" element={<Navigate to="/super-admin" replace />} />
    <Route
      path="/admin-setup"
      element={
        loading ? (
          <SharedPageLoader />
        ) : (
          <SuperAdminGuard>
            <L><SuperAdminSetup /></L>
          </SuperAdminGuard>
        )
      }
    />
    <Route
      path="/create-admin"
      element={
        loading ? (
          <SharedPageLoader />
        ) : (
          <SuperAdminGuard>
            <L><CreateSuperAdmin /></L>
          </SuperAdminGuard>
        )
      }
    />
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
