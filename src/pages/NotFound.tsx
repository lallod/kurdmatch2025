import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        <div className="text-8xl font-bold mb-4 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
          404
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-purple-200 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-pink-600 hover:bg-pink-700">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-purple-900"
            onClick={() => window.history.back()}
          >
            <Link to="#" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 text-sm text-purple-300">
          <p>If you think this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;