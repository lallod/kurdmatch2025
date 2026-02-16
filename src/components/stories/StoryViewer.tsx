import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Eye, ChevronUp } from 'lucide-react';
import { Story } from '@/api/posts';
import { supabase } from '@/integrations/supabase/client';
import StoryReactions from './StoryReactions';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { StoryToolbar } from './StoryToolbar';

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
  const [isMuted, setIsMuted] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const currentStory = stories[currentIndex];
  const duration = currentStory?.duration || 15;
  const isOwnStory = currentUserId === currentStory?.user_id;

  useEffect(() => {
    if (open && currentStory) {
      recordStoryView();
      fetchStoryViewers();
      getCurrentUser();
    }
  }, [open, currentStory?.id]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

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

          {/* User info */}
          <div className="absolute top-16 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarImage src={currentStory.profiles.profile_image} />
                <AvatarFallback>{currentStory.profiles.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-white font-semibold">{currentStory.profiles.name}</span>
            </div>
            {/* Views count - visible to everyone, viewer list only for owner */}
            <div className="flex items-center gap-1 px-3 py-1 bg-black/30 rounded-full">
              <Eye className="w-4 h-4 text-white" />
              <span className="text-white text-sm">{currentStory.views_count}</span>
            </div>
          </div>

          {/* Reactions */}
          <div className="absolute bottom-20 right-4">
            <StoryReactions 
              storyId={currentStory.id} 
              reactions={currentStory.reactions || []}
              onReactionAdded={fetchStoryViewers}
            />
          </div>

          {/* Story Toolbar */}
          {currentUserId && (
            <StoryToolbar
              storyId={currentStory.id}
              userId={currentStory.user_id}
              currentUserId={currentUserId}
              onReact={(reaction) => {
                console.log('Toolbar reaction:', reaction);
              }}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
            />
          )}

          {/* Viewers panel - Instagram style, only visible to story owner */}
          {isOwnStory && (
            <button
              onClick={() => setShowViewers(!showViewers)}
              className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-sm rounded-full"
            >
              <ChevronUp className="w-4 h-4 text-white" />
              <div className="flex -space-x-2">
                {viewers.slice(0, 3).map((v) => (
                  <Avatar key={v.id} className="w-6 h-6 border border-black">
                    <AvatarImage src={v.profiles?.profile_image} />
                    <AvatarFallback className="text-[8px]">{v.profiles?.name?.[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-white text-xs font-medium">{viewers.length}</span>
            </button>
          )}

          {showViewers && isOwnStory && viewers.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 max-h-72 bg-black/95 backdrop-blur-md rounded-t-3xl p-5 overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-base">Viewers · {viewers.length}</h3>
                <button onClick={() => setShowViewers(false)} className="p-1">
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
              <div className="space-y-3">
                {viewers.map((viewer) => (
                  <div key={viewer.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={viewer.profiles?.profile_image} />
                      <AvatarFallback className="text-sm bg-muted">{viewer.profiles?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className="text-white text-sm font-medium">{viewer.profiles?.name}</span>
                    </div>
                    <span className="text-white/40 text-xs">
                      {new Date(viewer.viewed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
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
