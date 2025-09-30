import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Story } from '@/api/posts';
import { supabase } from '@/integrations/supabase/client';
import StoryReactions from './StoryReactions';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface StoryViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stories: Story[];
  initialIndex?: number;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  open,
  onOpenChange,
  stories,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [viewers, setViewers] = useState<any[]>([]);
  const [showViewers, setShowViewers] = useState(false);

  const currentStory = stories[currentIndex];
  const duration = currentStory?.duration || 15;

  useEffect(() => {
    if (open && currentStory) {
      recordStoryView();
      fetchStoryViewers();
    }
  }, [open, currentStory?.id]);

  const recordStoryView = async () => {
    if (!currentStory) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id === currentStory.user_id) return;

    await supabase
      .from('story_views')
      .upsert({
        story_id: currentStory.id,
        viewer_id: user.id,
      }, { onConflict: 'story_id,viewer_id' });

    // Update view count
    const { count } = await supabase
      .from('story_views')
      .select('*', { count: 'exact', head: true })
      .eq('story_id', currentStory.id);

    if (count !== null) {
      await supabase
        .from('stories')
        .update({ views_count: count })
        .eq('id', currentStory.id);
    }
  };

  const fetchStoryViewers = async () => {
    if (!currentStory) return;

    const { data, error } = await supabase
      .from('story_views')
      .select(`
        *,
        profiles:viewer_id (
          id,
          name,
          profile_image
        )
      `)
      .eq('story_id', currentStory.id)
      .order('viewed_at', { ascending: false });

    if (!error && data) {
      setViewers(data);
    }
  };

  useEffect(() => {
    if (!open) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / (duration * 10));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [open, currentIndex, duration]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onOpenChange(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  if (!currentStory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-black border-none">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Story content */}
        <div className="relative w-full h-[600px] flex items-center justify-center">
          {currentStory.media_type === 'image' ? (
            <img
              src={currentStory.media_url}
              alt="Story"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={currentStory.media_url}
              className="w-full h-full object-contain"
              autoPlay
              loop
              muted
            />
          )}

          {/* User info and views */}
          <div className="absolute top-16 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarImage src={currentStory.profiles.profile_image} />
                <AvatarFallback>{currentStory.profiles.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-white font-semibold">{currentStory.profiles.name}</span>
            </div>
            <button
              onClick={() => setShowViewers(!showViewers)}
              className="flex items-center gap-1 px-3 py-1 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
            >
              <Eye className="w-4 h-4 text-white" />
              <span className="text-white text-sm">{currentStory.views_count}</span>
            </button>
          </div>

          {/* Reactions */}
          <div className="absolute bottom-20 right-4">
            <StoryReactions 
              storyId={currentStory.id} 
              reactions={currentStory.reactions || []}
              onReactionAdded={fetchStoryViewers}
            />
          </div>

          {/* Viewers panel */}
          {showViewers && viewers.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 max-h-60 bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
              <h3 className="text-white font-semibold mb-3">Viewed by {viewers.length}</h3>
              <div className="space-y-2">
                {viewers.map((viewer) => (
                  <div key={viewer.id} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={viewer.profiles?.profile_image} />
                      <AvatarFallback>{viewer.profiles?.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm">{viewer.profiles?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation areas */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
          {currentIndex < stories.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryViewer;
