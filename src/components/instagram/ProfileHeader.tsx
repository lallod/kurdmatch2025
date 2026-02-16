import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CheckCircle, MapPin, Briefcase, MessageCircle, Sparkles, Gift, CalendarIcon } from 'lucide-react';
import { useProfileAccess } from '@/hooks/useProfileAccess';
import { Profile } from '@/api/profiles';
import { followUser, unfollowUser, checkIsFollowing } from '@/api/posts';
import { toast } from 'sonner';
import { getKurdistanRegionDisplay, parseLocation } from '@/utils/profileDataNormalizer';
import { getUserSubscription } from '@/api/usage';
import { createPremiumCheckout } from '@/api/payments';
import SuperLikeButton from '@/components/discovery/SuperLikeButton';
import SendGiftModal from '@/components/gifts/SendGiftModal';
import ProposeDateModal from '@/components/dates/ProposeDateModal';
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
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const { canSeeDatingDetails } = useProfileAccess('social', profile.id);

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

  const handleUpgrade = async () => {
    try {
      await createPremiumCheckout('premium');
    } catch (error) {
      toast.error('Failed to start checkout');
    }
  };

  const handleEditProfile = () => {
    navigate('/my-profile');
  };

  return (
    <div>
      {/* Centered hero layout */}
      <div className="flex flex-col items-center text-center mb-4">
        <Avatar className="w-20 h-20 mb-3">
          <AvatarImage src={profile.profile_image} alt={profile.name} className="object-cover" />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
            {profile.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-1.5 mb-1">
          <h2 className="text-lg font-bold text-foreground">{profile.name}{canSeeDatingDetails && profile.age ? `, ${profile.age}` : ''}</h2>
          {profile.verified && (
            <CheckCircle className="w-4 h-4 text-primary fill-primary" />
          )}
        </div>

        {canSeeDatingDetails && profile.occupation && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-0.5">
            <Briefcase className="w-3 h-3" />
            <span>{profile.occupation}</span>
          </div>
        )}

        {canSeeDatingDetails && profile.kurdistan_region && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-0.5">
            <MapPin className="w-3 h-3" />
            <span>From {getKurdistanRegionDisplay(profile.kurdistan_region)}</span>
          </div>
        )}

        {canSeeDatingDetails && profile.location && (() => {
          const locationInfo = parseLocation(profile.location);
          return (
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <span>📍 {locationInfo.city}{locationInfo.country ? `, ${locationInfo.country}` : ''}</span>
            </div>
          );
        })()}
      </div>

      {/* Stats Card */}
      <div className="bg-card rounded-2xl p-3 shadow-sm mb-4">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{stats.posts}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Posts</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{followersCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Followers</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{stats.following}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Following</div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-foreground/80 text-sm leading-relaxed mb-4 px-1">{profile.bio}</p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mb-2">
        {isOwnProfile ? (
          <Button
            onClick={handleEditProfile}
            className="flex-1 h-10 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-sm font-medium"
            variant="ghost"
          >
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              onClick={handleFollowToggle}
              disabled={loading}
              className={`flex-1 h-10 rounded-xl text-sm font-semibold ${
                isFollowing
                  ? 'bg-muted hover:bg-muted/80 text-foreground'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button
              onClick={handleMessage}
              className="flex-1 h-10 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-sm font-medium relative"
              variant="ghost"
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              Message
              {!isPremium && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </Button>
            <SuperLikeButton postId={profile.id} userId={profile.id} />
          </>
        )}
      </div>

      {/* Gift & Date buttons for other profiles */}
      {!isOwnProfile && (
        <div className="flex gap-2 mb-2">
          <Button
            onClick={() => setShowGiftModal(true)}
            variant="outline"
            className="flex-1 h-9 rounded-xl text-sm"
          >
            <Gift className="w-4 h-4 mr-1.5" />
            Send Gift
          </Button>
          <Button
            onClick={() => setShowDateModal(true)}
            variant="outline"
            className="flex-1 h-9 rounded-xl text-sm"
          >
            <CalendarIcon className="w-4 h-4 mr-1.5" />
            Propose Date
          </Button>
        </div>
      )}

      {/* Gift & Date Modals */}
      <SendGiftModal
        open={showGiftModal}
        onOpenChange={setShowGiftModal}
        recipientId={profile.id}
        recipientName={profile.name}
      />
      <ProposeDateModal
        open={showDateModal}
        onOpenChange={setShowDateModal}
        recipientId={profile.id}
        recipientName={profile.name}
      />
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-card border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Premium Feature
            </DialogTitle>
            <DialogDescription className="text-muted-foreground space-y-4">
              <p>Send unlimited messages to Premium and Gold members!</p>
              <div className="bg-muted rounded-2xl p-4 space-y-2">
                <p className="font-semibold text-foreground text-sm">Premium Benefits:</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Send messages to anyone</li>
                  <li>✓ 10 Super Likes per day</li>
                  <li>✓ Unlimited regular likes</li>
                  <li>✓ See who liked you</li>
                  <li>✓ 5 Rewinds per day</li>
                </ul>
              </div>
              <Button
                onClick={handleUpgrade}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
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
