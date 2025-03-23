
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const Admin = () => {
  const { user, loading, session } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      console.log('No session found, redirecting to auth');
      navigate('/auth');
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <AdminDashboard />;
};

export default Admin;
