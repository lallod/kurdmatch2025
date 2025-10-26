import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { useProfileSectionStats } from '@/hooks/useProfileSectionStats';

interface SectionViewStatsProps {
  viewerId: string;
  viewedProfileId: string;
  compact?: boolean;
}

const sectionLabels: Record<string, string> = {
  basics: 'Basic Info',
  career: 'Career & Education',
  lifestyle: 'Lifestyle',
  beliefs: 'Beliefs & Values',
  relationships: 'Relationships',
  interests: 'Interests & Hobbies',
  favorites: 'Favorites',
  growth: 'Personal Growth'
};

const SectionViewStats: React.FC<SectionViewStatsProps> = ({ 
  viewerId, 
  viewedProfileId,
  compact = false 
}) => {
  const { stats, loading } = useProfileSectionStats(viewerId, viewedProfileId);

  if (loading) {
    return (
      <div className="text-xs text-purple-300 animate-pulse">
        Loading view stats...
      </div>
    );
  }

  if (!stats || stats.viewedSections.length === 0) {
    return (
      <div className="text-xs text-purple-300/60 flex items-center gap-1">
        <Eye className="h-3 w-3" />
        No sections viewed yet
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-info/20 text-info border-info/30 text-xs">
          <Eye className="h-3 w-3 mr-1" />
          {stats.viewedSections.length}/{stats.totalSections} sections
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge className="bg-info/20 text-info border-info/30 text-xs">
          <Eye className="h-3 w-3 mr-1" />
          {stats.percentage}% profile viewed
        </Badge>
        <span className="text-xs text-purple-200">
          ({stats.viewedSections.length} of {stats.totalSections} sections)
        </span>
      </div>
      
      {stats.viewedSections.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {stats.viewedSections.map((section) => (
            <Badge 
              key={section}
              className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-xs"
            >
              {sectionLabels[section] || section}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionViewStats;
