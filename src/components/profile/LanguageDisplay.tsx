
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Languages } from 'lucide-react';
import DetailItem from './DetailItem';

interface LanguageDisplayProps {
  languages: string[];
  tinderBadgeStyle: string;
}

const LanguageDisplay: React.FC<LanguageDisplayProps> = ({ languages, tinderBadgeStyle }) => {
  return (
    <DetailItem 
      icon={<Languages size={18} />} 
      label="Can speak" 
      value={
        <div className="flex flex-wrap gap-2 mt-1">
          {languages.length > 0 ? (
            languages.map((language, index) => (
              <Badge key={index} variant="outline" className={tinderBadgeStyle}>{language}</Badge>
            ))
          ) : (
            <span className="text-gray-500">No languages selected</span>
          )}
        </div>
      } 
    />
  );
};

export default LanguageDisplay;
