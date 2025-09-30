import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, UserPlus, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ProfileActionButtonsProps {
  userId: string;
  userName: string;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

const ProfileActionButtons: React.FC<ProfileActionButtonsProps> = ({
  userId,
  userName,
  isFollowing = false,
  onFollowToggle
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMessage = () => {
    navigate('/messages', { state: { userId } });
  };

  const handleLike = () => {
    toast({
      title: 'Liked!',
      description: `You liked ${userName}'s profile`
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/profile/${userId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied!',
      description: 'Profile link copied to clipboard'
    });
  };

  const handleFollow = () => {
    if (onFollowToggle) {
      onFollowToggle();
    }
    toast({
      title: isFollowing ? 'Unfollowed' : 'Following',
      description: isFollowing 
        ? `You unfollowed ${userName}` 
        : `You are now following ${userName}`
    });
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      {/* Follow/Following Button */}
      <Button
        onClick={handleFollow}
        variant={isFollowing ? 'outline' : 'default'}
        className="flex-1 gap-2"
      >
        {isFollowing ? (
          <>
            <UserCheck className="w-4 h-4" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Follow
          </>
        )}
      </Button>

      {/* Message Button */}
      <Button
        onClick={handleMessage}
        variant="outline"
        className="flex-1 gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Message
      </Button>

      {/* Like Button */}
      <Button
        onClick={handleLike}
        variant="outline"
        size="icon"
      >
        <Heart className="w-4 h-4" />
      </Button>

      {/* Share Button */}
      <Button
        onClick={handleShare}
        variant="outline"
        size="icon"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ProfileActionButtons;
