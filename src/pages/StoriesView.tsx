import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Heart, Send, Trash2, Eye, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const BG_MAP: Record<string, string> = {
  sunset: 'from-rose-500 via-orange-400 to-amber-300',
  ocean: 'from-blue-600 via-cyan-400 to-teal-300',
  forest: 'from-emerald-600 via-green-400 to-lime-300',
  night: 'from-indigo-900 via-purple-700 to-pink-500',
  fire: 'from-red-600 via-orange-500 to-yellow-400',
  midnight: 'from-slate-900 via-violet-900 to-fuchsia-900',
};

const TEXT_POS_MAP: Record<string, string> = {
  top: 'top-20 left-4 right-4',
  center: 'top-1/2 left-4 right-4 -translate-y-1/2',
  bottom: 'bottom-24 left-4 right-4',
};

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
  text_overlay?: string;
  text_position?: string;
  background_color?: string;
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
  const [paused, setPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [reactedEmoji, setReactedEmoji] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, [userId]);

  useEffect(() => {
    if (stories.length === 0 || paused) return;

    const currentStory = stories[currentIndex];
    const duration = (currentStory?.duration || 10) * 1000;
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
  }, [currentIndex, stories, paused]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('stories')
        .select(`*, profiles (id, name, profile_image, verified)`)
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      setStories(data || []);

      if (data?.length > 0 && user && data[0].user_id !== user.id) {
        recordStoryView(data[0].id, user.id);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const recordStoryView = async (storyId: string, viewerId: string) => {
    try {
      await (supabase as any)
        .from('story_views')
        .upsert({
          story_id: storyId,
          viewer_id: viewerId,
        }, { onConflict: 'story_id,viewer_id' });
    } catch (error) {
      console.error('Error recording story view:', error);
    }
  };

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setProgress(0);
      setReactedEmoji(null);
      // Record view for next story
      if (user && stories[nextIndex]?.user_id !== user.id) {
        recordStoryView(stories[nextIndex].id, user.id);
      }
    } else {
      navigate('/discovery');
    }
  }, [currentIndex, stories, navigate, user]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      setReactedEmoji(null);
    }
  };

  const handleReaction = async (emoji: string) => {
    if (!user || !stories[currentIndex]) return;
    setReactedEmoji(emoji);

    try {
      const currentStory = stories[currentIndex];
      const reactions = [...(currentStory.reactions || [])];
      reactions.push({ userId: user.id, emoji, timestamp: new Date().toISOString() });

      await (supabase as any)
        .from('stories')
        .update({ reactions })
        .eq('id', currentStory.id);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleDelete = async () => {
    if (!user || !stories[currentIndex]) return;
    const currentStory = stories[currentIndex];
    if (currentStory.user_id !== user.id) return;

    try {
      await (supabase as any).from('stories').delete().eq('id', currentStory.id);
      toast.success('Story deleted');

      const newStories = stories.filter((_, i) => i !== currentIndex);
      if (newStories.length === 0) {
        navigate('/discovery');
      } else {
        setStories(newStories);
        if (currentIndex >= newStories.length) setCurrentIndex(newStories.length - 1);
      }
    } catch (error) {
      toast.error('Failed to delete story');
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !user || !stories[currentIndex]) return;
    // Send as a message to the story creator
    try {
      await supabase.from('messages').insert({
        sender_id: user.id,
        recipient_id: stories[currentIndex].user_id,
        text: `📖 Replied to your story: "${replyText}"`,
      });
      toast.success('Reply sent!');
      setReplyText('');
      setShowReply(false);
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor(diff / 60000);
    if (hours > 0) return `${hours}h ago`;
    return `${mins}m ago`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center space-y-4">
          <p className="text-white/70">No stories available</p>
          <Button onClick={() => navigate('/discovery')} variant="outline" className="rounded-full">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentIndex];
  const isTextStory = currentStory.media_url === 'text-story' || currentStory.background_color;
  const bgGradient = currentStory.background_color ? BG_MAP[currentStory.background_color] || BG_MAP.night : '';
  const textPosClass = TEXT_POS_MAP[currentStory.text_position || 'center'] || TEXT_POS_MAP.center;
  const isOwner = currentStory.user_id === user?.id;

  return (
    <div className="fixed inset-0 bg-black z-50 select-none" onClick={(e) => e.stopPropagation()}>
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 pt-3 z-20">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-[3px] bg-white/25 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              style={{
                width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-3">
          <img
            src={currentStory.profiles.profile_image}
            alt={currentStory.profiles.name}
            className="w-9 h-9 rounded-full border-2 border-white/50 object-cover"
          />
          <div>
            <p className="text-white font-semibold text-sm flex items-center gap-1">
              {currentStory.profiles.name}
              {currentStory.profiles.verified && (
                <span className="text-blue-400 text-xs">✓</span>
              )}
            </p>
            <p className="text-white/50 text-[10px]">{timeAgo(currentStory.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isOwner && (
            <span className="text-white/50 text-xs flex items-center gap-1 mr-2">
              <Eye className="w-3.5 h-3.5" /> {currentStory.views_count}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPaused(!paused)}
            className="text-white hover:bg-white/10 h-8 w-8"
          >
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-white hover:bg-white/10 h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/discovery')}
            className="text-white hover:bg-white/10 h-8 w-8"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Story content */}
      <div className={`h-full flex items-center justify-center ${isTextStory ? `bg-gradient-to-br ${bgGradient}` : ''}`}>
        {!isTextStory && currentStory.media_type === 'image' && (
          <img
            src={currentStory.media_url}
            alt="Story"
            className="h-full w-full object-cover"
          />
        )}
        {!isTextStory && currentStory.media_type === 'video' && (
          <video
            src={currentStory.media_url}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted={false}
            playsInline
          />
        )}

        {/* Text overlay */}
        {currentStory.text_overlay && (
          <div className={`absolute ${textPosClass} text-center z-10`}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] px-4 leading-relaxed ${
                isTextStory ? 'text-white text-2xl' : 'text-white text-xl'
              }`}
            >
              {currentStory.text_overlay}
            </motion.p>
          </div>
        )}
      </div>

      {/* Navigation areas */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-16 bottom-20 w-1/3"
        disabled={currentIndex === 0}
      />
      <button
        onClick={handleNext}
        className="absolute right-0 top-16 bottom-20 w-1/3"
      />
      {/* Hold to pause - center area */}
      <button
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        className="absolute left-1/3 right-1/3 top-16 bottom-20"
      />

      {/* Reaction animation */}
      <AnimatePresence>
        {reactedEmoji && (
          <motion.div
            key={reactedEmoji + Date.now()}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <span className="text-7xl">{reactedEmoji}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom actions */}
      {!isOwner && (
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 px-4">
          {showReply ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex gap-2"
            >
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply to story..."
                className="rounded-full bg-white/15 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleReply()}
              />
              <Button
                size="icon"
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="rounded-full bg-primary shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => { setShowReply(false); setReplyText(''); }}
                className="rounded-full text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setPaused(true); setShowReply(true); }}
                className="text-white/70 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
              >
                Send a reply...
              </button>
              <div className="flex gap-1">
                {['❤️', '🔥', '😍', '😂', '😮'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-2xl hover:scale-125 active:scale-150 transition-transform p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoriesView;
