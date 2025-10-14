import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { X, Heart, Send, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  duration: number;
  views_count: number;
  reactions: any[];
  created_at: string;
  expires_at: string;
  profiles: {
    id: string;
    name: string;
    profile_image: string;
    verified: boolean;
  };
}

const StoriesView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchStories();
  }, [userId]);

  useEffect(() => {
    if (stories.length === 0) return;

    const currentStory = stories[currentIndex];
    const duration = currentStory.duration * 1000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, stories]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('stories')
        .select(`
          *,
          profiles (
            id,
            name,
            profile_image,
            verified
          )
        `)
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      setStories(data || []);

      if (data && data.length > 0 && user) {
        incrementViewCount(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load stories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (storyId: string) => {
    try {
      await (supabase as any)
        .from('stories')
        .update({ views_count: (stories[currentIndex]?.views_count || 0) + 1 })
        .eq('id', storyId);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
      if (stories[currentIndex + 1]) {
        incrementViewCount(stories[currentIndex + 1].id);
      }
    } else {
      navigate('/discovery');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleReaction = async (emoji: string) => {
    if (!user || !stories[currentIndex]) return;

    try {
      const currentStory = stories[currentIndex];
      const reactions = currentStory.reactions || [];
      reactions.push({ userId: user.id, emoji, timestamp: new Date().toISOString() });

      await (supabase as any)
        .from('stories')
        .update({ reactions })
        .eq('id', currentStory.id);

      toast({ description: `Reacted with ${emoji}` });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleDelete = async () => {
    if (!user || !stories[currentIndex]) return;

    const currentStory = stories[currentIndex];
    if (currentStory.user_id !== user.id) return;

    try {
      await (supabase as any)
        .from('stories')
        .delete()
        .eq('id', currentStory.id);

      toast({ description: 'Story deleted' });
      
      const newStories = stories.filter((_, i) => i !== currentIndex);
      if (newStories.length === 0) {
        navigate('/discovery');
      } else {
        setStories(newStories);
        if (currentIndex >= newStories.length) {
          setCurrentIndex(newStories.length - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete story',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white">Loading stories...</div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">No stories available</p>
          <Button onClick={() => navigate('/discovery')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all"
              style={{
                width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3">
          <img
            src={currentStory.profiles.profile_image}
            alt={currentStory.profiles.name}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-white font-semibold">{currentStory.profiles.name}</p>
            <p className="text-white/70 text-xs">
              {new Date(currentStory.created_at).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {currentStory.user_id === user?.id && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-white hover:bg-white/10"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/discovery')}
            className="text-white hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Story content */}
      <div className="h-full flex items-center justify-center">
        {currentStory.media_type === 'image' ? (
          <img
            src={currentStory.media_url}
            alt="Story"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <video
            src={currentStory.media_url}
            className="max-h-full max-w-full object-contain"
            autoPlay
            loop
            muted
          />
        )}
      </div>

      {/* Navigation areas */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-0 bottom-0 w-1/4 cursor-pointer"
        disabled={currentIndex === 0}
      >
        {currentIndex > 0 && (
          <ChevronLeft className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 text-white/50" />
        )}
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-0 bottom-0 w-1/4 cursor-pointer"
      >
        <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 text-white/50" />
      </button>

      {/* Reactions */}
      {currentStory.user_id !== user?.id && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
          {['❤️', '😍', '🔥', '👏', '😂'].map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="lg"
              onClick={() => handleReaction(emoji)}
              className="text-3xl hover:scale-125 transition-transform"
            >
              {emoji}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoriesView;
