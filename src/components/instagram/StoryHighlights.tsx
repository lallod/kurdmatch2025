import React from 'react';
import { Plus } from 'lucide-react';
import { Story } from '@/api/posts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface StoryHighlightsProps {
  stories: Story[];
  isOwnProfile: boolean;
}

const StoryHighlights: React.FC<StoryHighlightsProps> = ({ stories, isOwnProfile }) => {
  // Group stories by category
  const groupedStories = stories.reduce((acc, story) => {
    const category = (story as any).category || 'Recent';
    if (!acc[category]) acc[category] = [];
    acc[category].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex gap-4 pb-2">
        {/* Add Story Button (if own profile) */}
        {isOwnProfile && (
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <button className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:opacity-80 transition-opacity">
              <Plus className="w-8 h-8 text-white" />
            </button>
            <span className="text-xs text-white/90 text-center">Add Story</span>
          </div>
        )}

        {/* Story Highlights */}
        {Object.entries(groupedStories).map(([category, categoryStories]) => (
          <div key={category} className="flex flex-col items-center gap-2 min-w-[80px]">
            <button className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-0.5">
                <Avatar className="w-full h-full border-4 border-purple-900">
                  <AvatarImage 
                    src={categoryStories[0].media_url} 
                    alt={category}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {category[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              {categoryStories.length > 1 && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-purple-900">
                  {categoryStories.length}
                </div>
              )}
            </button>
            <span className="text-xs text-white/90 text-center truncate max-w-[80px]">
              {category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryHighlights;
