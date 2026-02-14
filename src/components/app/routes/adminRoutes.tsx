import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import SuperAdmin from '@/pages/SuperAdmin';

export const getAdminRoutes = (loading: boolean) => (
  <>
    <Route path="/admin" element={<Navigate to="/super-admin" replace />} />
    <Route path="/admin/*" element={<Navigate to="/super-admin" replace />} />
    <Route
      path="/super-admin/*"
      element={
        loading ? (
          <div className="min-h-screen flex items-center justify-center bg-muted">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Verifying admin access...</p>
            </div>
          </div>
        ) : (
          <SuperAdmin />
        )
      }
    />
  </>
);
