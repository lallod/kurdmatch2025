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
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
      {/* Add Story */}
      <button
        onClick={onAddStory}
        className="flex flex-col items-center gap-1 min-w-[64px]"
      >
        <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-primary/80 to-accent/60 flex items-center justify-center">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-[10px] text-muted-foreground">Your Story</span>
      </button>

      {/* User Stories */}
      {userStories.map((story) => (
        <button
          key={story.id}
          onClick={() => onStoryClick(story)}
          className="flex flex-col items-center gap-1 min-w-[64px]"
        >
          <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-primary via-accent to-secondary p-[2px]">
            <Avatar className="w-full h-full border-2 border-background">
              <AvatarImage src={story.profiles.profile_image} alt={story.profiles.name} />
              <AvatarFallback className="text-xs bg-muted">{story.profiles.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-[10px] text-foreground truncate max-w-[60px]">
            {story.profiles.name.split(' ')[0]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StoryBubbles;
