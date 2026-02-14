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
  const storiesByUser = stories.reduce((acc, story) => {
    if (!acc[story.user_id]) acc[story.user_id] = [];
    acc[story.user_id].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  const userStories = Object.values(storiesByUser).map(stories => stories[0]);

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1.5">
      {/* Add Story */}
      <button
        onClick={onAddStory}
        className="flex flex-col items-center gap-1.5 min-w-[68px] active:scale-95 transition-transform"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Plus className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground">Your Story</span>
      </button>

      {/* User Stories */}
      {userStories.map((story) => (
        <button
          key={story.id}
          onClick={() => onStoryClick(story)}
          className="flex flex-col items-center gap-1.5 min-w-[68px] active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-primary via-accent to-warning shadow-lg shadow-primary/15">
            <Avatar className="w-full h-full border-[2.5px] border-background">
              <AvatarImage src={story.profiles.profile_image} alt={story.profiles.name} />
              <AvatarFallback className="text-xs bg-card text-foreground">{story.profiles.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-[10px] font-medium text-foreground truncate max-w-[68px]">
            {story.profiles.name.split(' ')[0]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StoryBubbles;
