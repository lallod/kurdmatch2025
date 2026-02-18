import { Heart, MessageCircle, Share2, Volume2, VolumeX, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface StoryToolbarProps {
  storyId: string;
  userId: string;
  currentUserId: string;
  onReact: (reaction: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StoryToolbar = ({
  storyId,
  userId,
  currentUserId,
  onReact,
  isMuted,
  onToggleMute,
}: StoryToolbarProps) => {
  const { t } = useTranslations();
  const handleReply = () => {
    window.location.href = `/messages?user=${userId}`;
  };

  const handleShare = () => {
    toast.success(t('toast.story.shared', 'Story shared!'));
  };

  const handleInfo = () => {
    toast.info(t('toast.story.details', 'Story details'));
  };

  if (userId === currentUserId) {
    // Don't show toolbar for own stories
    return null;
  }

  return (
    <div className="absolute bottom-20 left-0 right-0 flex items-center justify-around px-6 py-4 bg-black/30 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onReact('❤️')}
        className="text-white hover:bg-white/20"
      >
        <Heart className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReply}
        className="text-white hover:bg-white/20"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        className="text-white hover:bg-white/20"
      >
        <Share2 className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMute}
        className="text-white hover:bg-white/20"
      >
        {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleInfo}
        className="text-white hover:bg-white/20"
      >
        <Info className="h-6 w-6" />
      </Button>
    </div>
  );
};
