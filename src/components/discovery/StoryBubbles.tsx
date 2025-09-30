import React from 'react';
import { Story } from '@/api/posts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

interface StoryBubblesProps {
  stories: Story[];
  onStoryClick: (story: Story) => void;
  onAddStory: () => void;
}

const StoryBubbles: React.FC<StoryBubblesProps> = ({ stories, onStoryClick, onAddStory }) => {
  // Group stories by user
  const storiesByUser = stories.reduce((acc, story) => {
    if (!acc[story.user_id]) {
      acc[story.user_id] = [];
    }
    acc[story.user_id].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  const userStories = Object.values(storiesByUser).map(stories => stories[0]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {/* Add Story Button */}
      <button
        onClick={onAddStory}
        className="flex flex-col items-center gap-1 min-w-[72px] group"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">Add Story</span>
      </button>

      {/* User Stories */}
      {userStories.map((story) => (
        <button
          key={story.id}
          onClick={() => onStoryClick(story)}
          className="flex flex-col items-center gap-1 min-w-[72px] group"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary via-accent to-secondary p-[2px]">
              <Avatar className="w-full h-full border-2 border-background">
                <AvatarImage src={story.profiles.profile_image} alt={story.profiles.name} />
                <AvatarFallback>{story.profiles.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <span className="text-xs text-foreground truncate max-w-[72px]">
            {story.profiles.name.split(' ')[0]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StoryBubbles;
