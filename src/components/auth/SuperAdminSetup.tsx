
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SuperAdminSetupForm from './components/SuperAdminSetupForm';
import { useTranslations } from '@/hooks/useTranslations';

const SuperAdminSetup = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-400 hover:text-white"
            onClick={() => navigate('/admin-login')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('admin.back_to_admin_login', 'Back to Admin Login')}
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('admin.setup_required', 'Super Admin Setup Required')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('admin.configure_supabase_desc', 'Configure your Supabase environment to enable super admin functionality')}
          </p>
        </div>
        
        <SuperAdminSetupForm />
      </div>
    </div>
  );
};

export default SuperAdminSetup;
