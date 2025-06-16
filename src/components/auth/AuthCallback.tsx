
import React from 'react';
import { useOAuthCallback } from './hooks/useOAuthCallback';
import AuthError from './components/AuthError';
import AuthLoading from './components/AuthLoading';

const AuthCallback = () => {
  const { isProcessing, error } = useOAuthCallback();

  if (error) {
    return <AuthError error={error} />;
  }

  return <AuthLoading />;
};

export default AuthCallback;
