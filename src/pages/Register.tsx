
import React from 'react';
import SimpleRegistrationForm from '@/components/auth/SimpleRegistrationForm';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-2xl space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200 relative">
        <div className="absolute top-4 left-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="text-center pt-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Join Our Community
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your account in just a few simple steps
          </p>
        </div>
        
        <SimpleRegistrationForm />
        
        <div className="text-center text-sm text-gray-500 border-t pt-6">
          Already have an account?{' '}
          <Link to="/auth" className="text-purple-600 hover:text-purple-700 font-medium">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
