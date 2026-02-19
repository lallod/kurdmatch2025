
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSetupManager } from './hooks/useSetupManager';
import { useAdminAuth } from './hooks/useAdminAuth';
import SetupStatus from './components/SetupStatus';
import AdminLoginForm from './components/AdminLoginForm';
import { useTranslations } from '@/hooks/useTranslations';

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  
  const {
    isSettingUp,
    setupComplete,
    setupMessage,
    retryAfter,
    countdown,
    handleRetrySetup,
    handleForceClearCache
  } = useSetupManager();

  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleSubmit
  } = useAdminAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            {t('admin.super_admin_access', 'Super Admin Access')}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {t('admin.restricted_area', 'Restricted area - Authorized personnel only')}
          </p>
        </div>
        
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-400 hover:text-white"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('auth.back_to_landing', 'Back to Landing Page')}
          </Button>
        </div>

        <SetupStatus
          isSettingUp={isSettingUp}
          setupComplete={setupComplete}
          setupMessage={setupMessage}
          retryAfter={retryAfter}
          countdown={countdown}
          onRetrySetup={handleRetrySetup}
          onForceClearCache={handleForceClearCache}
        />
        
        <AdminLoginForm
          email={email}
          password={password}
          isLoading={isLoading}
          errorMessage={errorMessage}
          isSetupComplete={setupComplete}
          isSettingUp={isSettingUp}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default SuperAdminLogin;
