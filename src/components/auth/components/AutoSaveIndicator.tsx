
import React, { useState, useEffect } from 'react';
import { Check, Cloud, CloudOff } from 'lucide-react';
import { formStorage } from '@/utils/formStorage';

const AutoSaveIndicator = () => {
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const checkLastSaved = () => {
      const savedData = formStorage.load();
      if (savedData) {
        setLastSaved(savedData.lastSaved);
      }
    };

    // Check immediately
    checkLastSaved();

    // Check every 5 seconds
    const interval = setInterval(checkLastSaved, 5000);

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
  };

  if (!lastSaved) return null;

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4">
      {isOnline ? (
        <>
          <Check className="w-3 h-3 text-green-400" />
          <span>Auto-saved {getTimeAgo(lastSaved)}</span>
          <Cloud className="w-3 h-3" />
        </>
      ) : (
        <>
          <CloudOff className="w-3 h-3 text-yellow-400" />
          <span>Offline - data saved locally</span>
        </>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
