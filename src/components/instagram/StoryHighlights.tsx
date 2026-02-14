import React from 'react';
import { Plus } from 'lucide-react';
import { Story } from '@/api/posts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface StoryHighlightsProps {
  stories: Story[];
  isOwnProfile: boolean;
  onAddStory?: () => void;
}

const StoryHighlights: React.FC<StoryHighlightsProps> = ({ stories, isOwnProfile, onAddStory }) => {
  const groupedStories = stories.reduce((acc, story) => {
    const category = (story as any).category || 'Recent';
    if (!acc[category]) acc[category] = [];
    acc[category].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 pb-1">
        {isOwnProfile && (
          <button
            onClick={onAddStory}
            className="flex flex-col items-center gap-1.5 min-w-[64px] active:scale-95 transition-transform"
          >
            <div className="w-[60px] h-[60px] rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-[10px] text-muted-foreground">Add</span>
          </button>
        )}

        {Object.entries(groupedStories).map(([category, categoryStories]) => (
          <button
            key={category}
            className="flex flex-col items-center gap-1.5 min-w-[64px] active:scale-95 transition-transform"
          >
            <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-primary via-accent to-secondary p-[2px]">
              <Avatar className="w-full h-full border-2 border-background">
                <AvatarImage
                  src={categoryStories[0].media_url}
                  alt={category}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  {category[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="text-[10px] text-muted-foreground truncate max-w-[64px]">
              {category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoryHighlights;
