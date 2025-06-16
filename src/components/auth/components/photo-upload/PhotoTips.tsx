
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PhotoTips = () => {
  return (
    <>
      <Alert variant="default" className="mt-4 bg-blue-500/10 border-blue-400/30 backdrop-blur">
        <ShieldCheck className="h-4 w-4 !text-blue-400" />
        <AlertTitle className="font-semibold text-blue-300">Your safety is our priority</AlertTitle>
        <AlertDescription className="text-blue-200">
          Never share photos that reveal personal information like your home address or workplace. Be mindful of what's in the background of your photos.
        </AlertDescription>
      </Alert>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2 text-white">Photo tips:</h4>
        <ul className="text-xs text-purple-300 space-y-1 list-disc pl-5">
          <li>Your first photo should clearly show your face</li>
          <li>Add up to 5 photos to showcase your personality</li>
          <li>Use our free AI editor to enhance your photos</li>
          <li>Background removal and filters are completely free</li>
          <li>Good lighting makes a big difference</li>
        </ul>
      </div>
    </>
  );
};

export default PhotoTips;
