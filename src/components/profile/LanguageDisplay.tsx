import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Languages } from 'lucide-react';
import DetailItem from './DetailItem';

const MAX_VISIBLE = 3;

interface LanguageDisplayProps {
  languages: string[];
  tinderBadgeStyle: string;
}

const LanguageDisplay: React.FC<LanguageDisplayProps> = ({ languages, tinderBadgeStyle }) => {
  const [expanded, setExpanded] = useState(false);
  const hasMore = languages.length > MAX_VISIBLE;
  const visible = expanded ? languages : languages.slice(0, MAX_VISIBLE);

  return (
    <DetailItem 
      icon={<Languages size={18} />} 
      label="Can speak" 
      value={
        <div className="flex flex-wrap gap-2 mt-1 items-center">
          {visible.length > 0 ? (
            <>
              {visible.map((language, index) => (
                <Badge key={index} variant="outline" className={tinderBadgeStyle}>{language}</Badge>
              ))}
              {hasMore && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-primary font-medium hover:underline transition-colors"
                >
                  {expanded ? 'See less' : `+${languages.length - MAX_VISIBLE} more`}
                </button>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">No languages selected</span>
          )}
        </div>
      } 
    />
  );
};

export default LanguageDisplay;
