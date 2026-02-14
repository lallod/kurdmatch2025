import React from 'react';
import { Routes } from 'react-router-dom';
import AppLayout from './AppLayout';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { getPublicRoutes } from './routes/publicRoutes';
import { protectedRoutes } from './routes/protectedRoutes';
import { settingsRoutes } from './routes/settingsRoutes';
import { groupRoutes } from './routes/groupRoutes';
import { getAdminRoutes } from './routes/adminRoutes';

export const AppRoutes: React.FC = () => {
  const { user, loading } = useSupabaseAuth();

  return (
    <AppLayout>
      <Routes>
        {getPublicRoutes(user)}
        {protectedRoutes}
        {settingsRoutes}
        {groupRoutes}
        {getAdminRoutes(loading)}
      </Routes>
    </AppLayout>
  );
};
