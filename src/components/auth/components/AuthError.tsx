
import React from 'react';

interface AuthErrorProps {
  error: string;
}

const AuthError: React.FC<AuthErrorProps> = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="text-red-500 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
        <p className="text-gray-300 mb-4">{error}</p>
        <p className="text-gray-400 text-sm">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default AuthError;
