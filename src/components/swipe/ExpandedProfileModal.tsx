
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Heart, MessageCircle, Star, MapPin, Sparkles } from 'lucide-react';
import { Profile, SwipeAction } from '@/types/swipe';

interface ExpandedProfileModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSwipeAction: (action: SwipeAction, profileId: number) => void;
  onMessage: (profileId: number) => void;
}

const ExpandedProfileModal = ({
  profile,
  isOpen,
  onClose,
  onSwipeAction,
  onMessage
}: ExpandedProfileModalProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);

  const nextPhoto = () => {
    if (profile.photos && currentPhotoIndex < profile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-full w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-none overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
            <Badge className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              {profile.compatibilityScore}%
            </Badge>
          </div>

          {/* Photo Gallery */}
          <div className="relative flex-1 min-h-0">
            <img
              src={profile.photos?.[currentPhotoIndex] || profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            
            {/* Photo Navigation */}
            {profile.photos && profile.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                  disabled={currentPhotoIndex === 0}
                >
                  <span className="text-xl">‹</span>
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                  disabled={currentPhotoIndex === profile.photos.length - 1}
                >
                  <span className="text-xl">›</span>
                </button>
                
                {/* Photo Indicators */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                  {profile.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                  <span className="text-xl text-white">{profile.age}</span>
                  {profile.verified && (
                    <Badge className="bg-blue-500 text-white text-xs">✓</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-white/90 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location} • {profile.distance}km away</span>
                </div>
                {profile.kurdistanRegion && (
                  <Badge variant="outline" className="bg-purple-500/30 text-white border-purple-400/40 mb-2">
                    {profile.kurdistanRegion}
                  </Badge>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div>
                <h3 className="text-white font-semibold mb-2">About {profile.name}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {profile.occupation && (
                <div>
                  <span className="text-white/70">Occupation</span>
                  <p className="text-white">{profile.occupation}</p>
                </div>
              )}
              {profile.height && (
                <div>
                  <span className="text-white/70">Height</span>
                  <p className="text-white">{profile.height}cm</p>
                </div>
              )}
              {profile.relationshipGoals && (
                <div>
                  <span className="text-white/70">Looking for</span>
                  <p className="text-white">{profile.relationshipGoals}</p>
                </div>
              )}
              {profile.languages && profile.languages.length > 0 && (
                <div>
                  <span className="text-white/70">Languages</span>
                  <p className="text-white">{profile.languages.join(', ')}</p>
                </div>
              )}
            </div>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="border-pink-400/30 text-pink-300 bg-pink-500/10">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-4 pt-4">
              <Button
                onClick={() => onSwipeAction('pass', profile.id)}
                variant="outline"
                className="w-14 h-14 rounded-full bg-red-500/30 border-red-400/40 text-red-300 hover:bg-red-500/40"
              >
                <X className="h-6 w-6" />
              </Button>

              <Button
                onClick={() => onMessage(profile.id)}
                variant="outline"
                className="w-12 h-12 rounded-full bg-blue-500/30 border-blue-400/40 text-blue-300 hover:bg-blue-500/40"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>

              <Button
                onClick={() => onSwipeAction('like', profile.id)}
                variant="outline"
                className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-400/40 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40"
              >
                <Heart className="h-7 w-7" />
              </Button>

              <Button
                onClick={() => onSwipeAction('superlike', profile.id)}
                variant="outline"
                className="w-12 h-12 rounded-full bg-yellow-500/30 border-yellow-400/40 text-yellow-300 hover:bg-yellow-500/40"
              >
                <Star className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpandedProfileModal;
