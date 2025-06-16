
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle, Clock, RefreshCw, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SetupStatusProps {
  isSettingUp: boolean;
  setupComplete: boolean;
  setupMessage: string | null;
  retryAfter: number | null;
  countdown: number;
  onRetrySetup: () => void;
  onForceClearCache: () => void;
}

const SetupStatus: React.FC<SetupStatusProps> = ({
  isSettingUp,
  setupComplete,
  setupMessage,
  retryAfter,
  countdown,
  onRetrySetup,
  onForceClearCache
}) => {
  const navigate = useNavigate();

  if (isSettingUp) {
    return (
      <div className="bg-blue-900/50 border border-blue-700 text-blue-200 px-4 py-3 rounded relative flex items-center" role="alert">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        <span>Verifying admin account setup...</span>
      </div>
    );
  }

  if (!isSettingUp && setupMessage && !setupComplete) {
    return (
      <div className="space-y-3">
        <div className={`border px-4 py-3 rounded relative flex items-start ${
          retryAfter ? 'bg-yellow-900/50 border-yellow-700 text-yellow-200' : 'bg-red-900/50 border-red-700 text-red-200'
        }`} role="alert">
          {retryAfter ? (
            <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <span className="block">{setupMessage}</span>
            {setupMessage.includes("Supabase configuration") && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin-setup')}
                  className="text-gray-300 border-gray-600 hover:bg-gray-600"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Supabase Setup
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {retryAfter && (
          <div className="flex items-center justify-between bg-gray-700 p-3 rounded">
            <span className="text-gray-300 text-sm">
              {countdown > 0 ? `Retry available in ${countdown}s` : 'Ready to retry'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetrySetup}
              disabled={countdown > 0}
              className="text-gray-300 border-gray-600 hover:bg-gray-600"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Setup
            </Button>
          </div>
        )}
        
        {!retryAfter && (
          <Button
            variant="outline"
            size="sm"
            onClick={onForceClearCache}
            className="w-full text-gray-300 border-gray-600 hover:bg-gray-600"
          >
            Clear Cache & Retry
          </Button>
        )}
      </div>
    );
  }
  
  if (setupComplete && !isSettingUp) {
    return (
      <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded relative flex items-center" role="alert">
        <CheckCircle className="h-5 w-5 mr-2" />
        <span>Admin account is ready! You can now log in.</span>
      </div>
    );
  }

  return null;
};

export default SetupStatus;
