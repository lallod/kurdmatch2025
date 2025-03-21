
import React from 'react';
import { Check } from 'lucide-react';

interface LanguageItemProps {
  language: string;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ 
  language, 
  isSelected, 
  isDisabled,
  onToggle 
}) => {
  return (
    <div 
      className={`
        flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-all duration-200
        ${isSelected 
          ? 'bg-gradient-to-r from-tinder-rose/5 to-tinder-rose/10 text-tinder-rose border border-tinder-rose/20 shadow-sm' 
          : 'hover:bg-gray-50 cursor-pointer hover:border hover:border-tinder-rose/10 border border-transparent'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={onToggle}
    >
      <span className="font-medium futuristic-text">{language}</span>
      {isSelected && (
        <div className="rounded-full bg-tinder-rose/10 p-1">
          <Check className="h-3 w-3 text-tinder-rose" />
        </div>
      )}
    </div>
  );
};

export default LanguageItem;
