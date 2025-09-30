import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CheckCircle, MapPin, Briefcase, Share2, MessageCircle, Sparkles } from 'lucide-react';
import { Profile } from '@/api/profiles';
import { followUser, unfollowUser, checkIsFollowing } from '@/api/posts';
import { toast } from 'sonner';
import { getKurdistanRegionDisplay, parseLocation } from '@/utils/profileDataNormalizer';
import { getUserSubscription } from '@/api/usage';
import { createPremiumCheckout } from '@/api/payments';
import SuperLikeButton from '@/components/discovery/SuperLikeButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProfileHeaderProps {
  profile: Profile;
  stats: { posts: number; followers: number; following: number };
  isOwnProfile: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, stats, isOwnProfile }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(stats.followers);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!isOwnProfile) {
        const following = await checkIsFollowing(profile.id);
        setIsFollowing(following);
      }
    };
    const checkSubscription = async () => {
      const subscription = await getUserSubscription();
      setIsPremium(subscription?.subscriptionType === 'premium' || subscription?.subscriptionType === 'gold');
    };
    checkFollowStatus();
    checkSubscription();
  }, [profile.id, isOwnProfile]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(profile.id);
        setFollowersCount(prev => Math.max(0, prev - 1));
        toast.success('Unfollowed');
      } else {
        await followUser(profile.id);
        setFollowersCount(prev => prev + 1);
        toast.success('Following');
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    if (!isPremium) {
      setShowUpgradeDialog(true);
      return;
    }
    navigate(`/messages?userId=${profile.id}`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/instagram-profile/${profile.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Profile link copied to clipboard');
  };

  const handleUpgrade = async () => {
    try {
      await createPremiumCheckout('premium');
    } catch (error) {
      toast.error('Failed to start checkout');
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="mb-8">
      <div className="flex items-start gap-6 mb-6">
        {/* Profile Picture */}
        <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-purple-400/30">
          <AvatarImage src={profile.profile_image} alt={profile.name} />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            {profile.name[0]}
          </AvatarFallback>
        </Avatar>

        {/* Stats */}
        <div className="flex-1">
          <div className="flex items-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.posts}</div>
              <div className="text-sm text-white/70">posts</div>
            </div>
            <div className="text-center cursor-pointer hover:opacity-80">
              <div className="text-2xl font-bold text-white">{followersCount}</div>
              <div className="text-sm text-white/70">followers</div>
            </div>
            <div className="text-center cursor-pointer hover:opacity-80">
              <div className="text-2xl font-bold text-white">{stats.following}</div>
              <div className="text-sm text-white/70">following</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isOwnProfile ? (
              <Button
                onClick={handleEditProfile}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                variant="outline"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleFollowToggle}
                  disabled={loading}
                  className={`flex-1 ${
                    isFollowing
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button
                  onClick={handleMessage}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white relative"
                  variant="outline"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  PM
                  {!isPremium && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                      PRO
                    </span>
                  )}
                </Button>
                <SuperLikeButton postId={profile.id} userId={profile.id} />
                <Button
                  onClick={handleShare}
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 text-white"
                  variant="outline"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">
            {profile.name}, {profile.age}
          </h2>
          {profile.verified && (
            <CheckCircle className="w-5 h-5 text-pink-400 fill-pink-400" />
          )}
        </div>

        {/* Kurdistan Region Origin */}
        {profile.kurdistan_region && (
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <MapPin className="w-4 h-4" />
            <span>From {getKurdistanRegionDisplay(profile.kurdistan_region)}</span>
          </div>
        )}

        {/* Current Location */}
        {profile.location && (() => {
          const locationInfo = parseLocation(profile.location);
          return (
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span>📍</span>
              <span>Lives in {locationInfo.city}{locationInfo.country ? `, ${locationInfo.country}` : ''}</span>
            </div>
          );
        })()}

        {profile.occupation && (
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Briefcase className="w-4 h-4" />
            <span>{profile.occupation}</span>
          </div>
        )}

        {profile.bio && (
          <p className="text-white/90 text-sm leading-relaxed mt-3">{profile.bio}</p>
        )}
      </div>

      {/* Message Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-pink-400" />
              PM - Premium Feature
            </DialogTitle>
            <DialogDescription className="text-white/70 space-y-4">
              <p>Send unlimited messages to Premium and Gold members!</p>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 space-y-2">
                <p className="font-semibold text-white">Premium Benefits:</p>
                <ul className="space-y-1 text-sm">
                  <li>✓ Send messages to anyone</li>
                  <li>✓ 10 Super Likes per day</li>
                  <li>✓ Unlimited regular likes</li>
                  <li>✓ See who liked you</li>
                  <li>✓ 5 Rewinds per day</li>
                </ul>
              </div>
              <Button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileHeader;
