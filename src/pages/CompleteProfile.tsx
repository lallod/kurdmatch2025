import React from 'react';
import { Navigate } from 'react-router-dom';

// Complete Profile is now handled inline on MyProfile page
export const CompleteProfile: React.FC = () => {
  return <Navigate to="/my-profile" replace />;
};
