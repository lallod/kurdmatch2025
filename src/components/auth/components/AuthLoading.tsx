
import React from 'react';

const AuthLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary-dark/80 to-primary">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-foreground mx-auto"></div>
        <p className="mt-4 text-primary-foreground text-lg">Processing authentication...</p>
        <p className="mt-2 text-primary-foreground/80 text-sm">Please wait while we complete your login...</p>
      </div>
    </div>
  );
};

export default AuthLoading;
