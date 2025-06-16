
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, Shield } from 'lucide-react';

interface AdminLoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  errorMessage: string | null;
  isSetupComplete: boolean;
  isSettingUp: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  email,
  password,
  isLoading,
  errorMessage,
  isSetupComplete,
  isSettingUp,
  onEmailChange,
  onPasswordChange,
  onSubmit
}) => {
  return (
    <>
      {errorMessage && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded relative flex items-start" role="alert">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span className="block">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="admin@example.com"
            required
            disabled={isLoading || isSettingUp}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading || isSettingUp || !isSetupComplete}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-purple-800 hover:bg-purple-700 text-white"
          disabled={isLoading || isSettingUp || !isSetupComplete}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying Credentials...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Access Dashboard
            </>
          )}
        </Button>
      </form>
    </>
  );
};

export default AdminLoginForm;
