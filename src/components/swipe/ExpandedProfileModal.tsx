
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Heart, MessageCircle, Star, MapPin, Sparkles, User, Briefcase, Coffee, Heart as HeartIcon, Book, Camera } from 'lucide-react';
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

  const formatList = (items: string[] | undefined, limit = 5) => {
    if (!items || items.length === 0) return null;
    const displayed = items.slice(0, limit);
    return displayed.join(', ') + (items.length > limit ? ` and ${items.length - limit} more` : '');
  };

  const renderSection = (title: string, icon: React.ReactNode, content: React.ReactNode) => {
    if (!content) return null;
    return (
      <AccordionItem value={title.toLowerCase().replace(' ', '-')} className="border-white/10">
        <AccordionTrigger className="text-white text-sm py-3 flex items-center gap-2">
          {icon}
          {title}
        </AccordionTrigger>
        <AccordionContent className="text-white/90 text-sm space-y-2 pb-4">
          {content}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-full w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-none overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur z-10">
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

          <ScrollArea className="flex-1">
            {/* Photo Gallery */}
            <div className="relative h-96">
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
            <div className="p-6 space-y-6">
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

              {/* Comprehensive Profile Sections */}
              <Accordion type="multiple" className="space-y-2">
                {/* Basic Info */}
                {renderSection("Basic Info", <User className="h-4 w-4" />, (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {profile.occupation && <div><span className="text-white/70">Occupation:</span><br/><span className="text-white">{profile.occupation}</span></div>}
                    {profile.education && <div><span className="text-white/70">Education:</span><br/><span className="text-white">{profile.education}</span></div>}
                    {profile.height && <div><span className="text-white/70">Height:</span><br/><span className="text-white">{profile.height}</span></div>}
                    {profile.ethnicity && <div><span className="text-white/70">Ethnicity:</span><br/><span className="text-white">{profile.ethnicity}</span></div>}
                    {profile.zodiacSign && <div><span className="text-white/70">Zodiac:</span><br/><span className="text-white">{profile.zodiacSign}</span></div>}
                    {profile.personalityType && <div><span className="text-white/70">Personality:</span><br/><span className="text-white">{profile.personalityType}</span></div>}
                  </div>
                ))}

                {/* Career & Goals */}
                {renderSection("Career & Goals", <Briefcase className="h-4 w-4" />, (
                  <div className="space-y-2">
                    {profile.company && <p><strong>Company:</strong> {profile.company}</p>}
                    {profile.careerAmbitions && <p><strong>Career Goals:</strong> {profile.careerAmbitions}</p>}
                    {profile.workLifeBalance && <p><strong>Work-Life Balance:</strong> {profile.workLifeBalance}</p>}
                    {profile.growthGoals && profile.growthGoals.length > 0 && (
                      <p><strong>Personal Goals:</strong> {formatList(profile.growthGoals)}</p>
                    )}
                  </div>
                ))}

                {/* Lifestyle */}
                {renderSection("Lifestyle", <Coffee className="h-4 w-4" />, (
                  <div className="space-y-2">
                    {profile.exerciseHabits && <p><strong>Exercise:</strong> {profile.exerciseHabits}</p>}
                    {profile.drinking && <p><strong>Drinking:</strong> {profile.drinking}</p>}
                    {profile.smoking && <p><strong>Smoking:</strong> {profile.smoking}</p>}
                    {profile.dietaryPreferences && <p><strong>Diet:</strong> {profile.dietaryPreferences}</p>}
                    {profile.havePets && <p><strong>Pets:</strong> {profile.havePets}</p>}
                    {profile.sleepSchedule && <p><strong>Sleep Schedule:</strong> {profile.sleepSchedule}</p>}
                    {profile.travelFrequency && <p><strong>Travel:</strong> {profile.travelFrequency}</p>}
                  </div>
                ))}

                {/* Values & Relationships */}
                {renderSection("Values & Relationships", <HeartIcon className="h-4 w-4" />, (
                  <div className="space-y-2">
                    {profile.relationshipGoals && <p><strong>Looking for:</strong> {profile.relationshipGoals}</p>}
                    {profile.wantChildren && <p><strong>Want Children:</strong> {profile.wantChildren}</p>}
                    {profile.values && profile.values.length > 0 && (
                      <p><strong>Values:</strong> {formatList(profile.values)}</p>
                    )}
                    {profile.loveLanguage && profile.loveLanguage.length > 0 && (
                      <p><strong>Love Language:</strong> {formatList(profile.loveLanguage)}</p>
                    )}
                    {profile.familyCloseness && <p><strong>Family:</strong> {profile.familyCloseness}</p>}
                  </div>
                ))}

                {/* Interests & Hobbies */}
                {renderSection("Interests & Hobbies", <Camera className="h-4 w-4" />, (
                  <div className="space-y-3">
                    {profile.interests && profile.interests.length > 0 && (
                      <div>
                        <p className="text-white/70 text-sm mb-2">Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest, index) => (
                            <Badge key={index} variant="outline" className="border-pink-400/30 text-pink-300 bg-pink-500/10">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.hobbies && profile.hobbies.length > 0 && (
                      <p><strong>Hobbies:</strong> {formatList(profile.hobbies)}</p>
                    )}
                    {profile.creativePursuits && profile.creativePursuits.length > 0 && (
                      <p><strong>Creative Pursuits:</strong> {formatList(profile.creativePursuits)}</p>
                    )}
                    {profile.weekendActivities && profile.weekendActivities.length > 0 && (
                      <p><strong>Weekend Activities:</strong> {formatList(profile.weekendActivities)}</p>
                    )}
                  </div>
                ))}

                {/* Favorites */}
                {renderSection("Favorites", <Book className="h-4 w-4" />, (
                  <div className="space-y-2">
                    {profile.favoriteBooks && profile.favoriteBooks.length > 0 && (
                      <p><strong>Books:</strong> {formatList(profile.favoriteBooks, 3)}</p>
                    )}
                    {profile.favoriteMovies && profile.favoriteMovies.length > 0 && (
                      <p><strong>Movies:</strong> {formatList(profile.favoriteMovies, 3)}</p>
                    )}
                    {profile.favoriteMusic && profile.favoriteMusic.length > 0 && (
                      <p><strong>Music:</strong> {formatList(profile.favoriteMusic, 3)}</p>
                    )}
                    {profile.favoriteFoods && profile.favoriteFoods.length > 0 && (
                      <p><strong>Food:</strong> {formatList(profile.favoriteFoods, 3)}</p>
                    )}
                  </div>
                ))}

                {/* Personal Insights */}
                {(profile.favoriteQuote || profile.dreamVacation || profile.idealDate) && renderSection("Personal Insights", <Sparkles className="h-4 w-4" />, (
                  <div className="space-y-2">
                    {profile.favoriteQuote && <p><strong>Favorite Quote:</strong> "{profile.favoriteQuote}"</p>}
                    {profile.dreamVacation && <p><strong>Dream Vacation:</strong> {profile.dreamVacation}</p>}
                    {profile.idealDate && <p><strong>Ideal Date:</strong> {profile.idealDate}</p>}
                    {profile.hiddenTalents && profile.hiddenTalents.length > 0 && (
                      <p><strong>Hidden Talents:</strong> {formatList(profile.hiddenTalents)}</p>
                    )}
                  </div>
                ))}
              </Accordion>

              {/* Languages */}
              {profile.languages && profile.languages.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="border-blue-400/30 text-blue-300 bg-blue-500/10">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-4 p-6 bg-black/20 backdrop-blur">
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
      </DialogContent>
    </Dialog>
  );
};

export default ExpandedProfileModal;
