import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';

// Pages where bottom nav should NOT appear
const HIDDEN_NAV_ROUTES = [
  '/',
  '/auth',
  '/register',
  '/auth/callback',
  '/admin-login',
  '/admin-setup',
  '/create-admin',
  '/complete-profile',
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const showNav = !HIDDEN_NAV_ROUTES.includes(location.pathname) &&
    !location.pathname.startsWith('/super-admin');

  return (
    <div style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      {children}
      {showNav && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
