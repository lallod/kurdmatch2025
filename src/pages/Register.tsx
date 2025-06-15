
import React from 'react';
import DynamicRegistrationForm from '@/components/auth/DynamicRegistrationForm';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl space-y-8 bg-gray-950 p-8 rounded-xl shadow-lg border border-gray-800 relative">
        <div className="absolute top-4 left-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-400 hover:text-white"
          >
            <Link to="/auth">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til innlogging
            </Link>
          </Button>
        </div>
        <div className="text-center pt-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Opprett din konto
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Bli med i vårt fellesskap og start din reise.
          </p>
        </div>
        <DynamicRegistrationForm />
      </div>
    </div>
  );
};

export default Register;
