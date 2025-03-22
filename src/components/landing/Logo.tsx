
import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', withText = true }) => {
  // Define sizes for different variants
  const sizes = {
    small: {
      container: 'h-8',
      icon: 16,
      text: 'text-lg'
    },
    medium: {
      container: 'h-10',
      icon: 24,
      text: 'text-xl'
    },
    large: {
      container: 'h-14',
      icon: 32,
      text: 'text-2xl'
    }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${currentSize.container}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-70"></div>
        <div className="relative bg-gradient-to-r from-purple-400 to-pink-500 p-2 rounded-full z-10">
          <Heart className="text-white" size={currentSize.icon} fill="white" strokeWidth={2} />
        </div>
      </div>
      
      {withText && (
        <div className="flex flex-col">
          <span className={`font-bold ${currentSize.text} text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500`}>
            KurdMatch
          </span>
          {size === 'large' && (
            <span className="text-sm text-gray-300 -mt-1">Connect Kurdish Hearts</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
