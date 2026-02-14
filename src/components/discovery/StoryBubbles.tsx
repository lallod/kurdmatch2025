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
    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
      {/* Add Story — 72px with profile overlay */}
      <button
        onClick={onAddStory}
        className="flex flex-col items-center gap-1.5 min-w-[76px] group"
      >
        <div className="relative">
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-primary to-accent/60 flex items-center justify-center shadow-md">
            <Plus className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground font-medium">Your Story</span>
      </button>

      {/* User Stories — 72px with gradient ring */}
      {userStories.map((story) => (
        <button
          key={story.id}
          onClick={() => onStoryClick(story)}
          className="flex flex-col items-center gap-1.5 min-w-[76px] group"
        >
          <div className="relative">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-tr from-primary via-accent to-secondary p-[2.5px] shadow-md">
              <Avatar className="w-full h-full border-[3px] border-background">
                <AvatarImage src={story.profiles.profile_image} alt={story.profiles.name} />
                <AvatarFallback className="text-sm bg-muted">{story.profiles.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <span className="text-[11px] text-foreground truncate max-w-[72px] font-medium">
            {story.profiles.name.split(' ')[0]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StoryBubbles;
