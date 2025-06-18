
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Profile } from '@/types/swipe';

interface ProfileDetailsProps {
  profile: Profile;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onProfileTap?: () => void;
}

const ProfileDetails = ({ profile, isExpanded, onToggleExpanded, onProfileTap }: ProfileDetailsProps) => {
  const handleProfileTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProfileTap?.();
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpanded();
  };

  const formatList = (items: string[] | undefined) => {
    if (!items || items.length === 0) return null;
    return items.slice(0, 3).join(', ') + (items.length > 3 ? ` +${items.length - 3} more` : '');
  };

  return (
    <div className="p-2 sm:p-3 cursor-pointer" onClick={handleProfileTap}>
      {/* Quick Info */}
      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
        {profile.occupation && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-2 py-0.5">
            {profile.occupation}
          </Badge>
        )}
        {profile.height && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-2 py-0.5">
            {profile.height}
          </Badge>
        )}
        {profile.languages && profile.languages.length > 0 && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-2 py-0.5">
            {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
          </Badge>
        )}
        {profile.relationshipGoals && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-2 py-0.5">
            {profile.relationshipGoals}
          </Badge>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-2 sm:mb-3">
          <p className="text-white text-sm leading-snug">
            {isExpanded ? profile.bio : `${profile.bio.slice(0, 80)}...`}
          </p>
          <button
            onClick={handleReadMoreClick}
            className="text-purple-300 text-sm mt-0.5 hover:text-purple-200 touch-manipulation"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 mt-3">
          <Accordion type="single" collapsible className="space-y-2">
            {/* Basic Info */}
            <AccordionItem value="basic" className="border-white/10">
              <AccordionTrigger className="text-white text-sm py-2">
                Basic Info
              </AccordionTrigger>
              <AccordionContent className="text-white/90 text-xs space-y-1">
                {profile.education && <p><strong>Education:</strong> {profile.education}</p>}
                {profile.ethnicity && <p><strong>Ethnicity:</strong> {profile.ethnicity}</p>}
                {profile.zodiacSign && <p><strong>Zodiac:</strong> {profile.zodiacSign}</p>}
                {profile.personalityType && <p><strong>Personality:</strong> {profile.personalityType}</p>}
              </AccordionContent>
            </AccordionItem>

            {/* Lifestyle */}
            <AccordionItem value="lifestyle" className="border-white/10">
              <AccordionTrigger className="text-white text-sm py-2">
                Lifestyle
              </AccordionTrigger>
              <AccordionContent className="text-white/90 text-xs space-y-1">
                {profile.exerciseHabits && <p><strong>Exercise:</strong> {profile.exerciseHabits}</p>}
                {profile.drinking && <p><strong>Drinking:</strong> {profile.drinking}</p>}
                {profile.smoking && <p><strong>Smoking:</strong> {profile.smoking}</p>}
                {profile.dietaryPreferences && <p><strong>Diet:</strong> {profile.dietaryPreferences}</p>}
                {profile.havePets && <p><strong>Pets:</strong> {profile.havePets}</p>}
              </AccordionContent>
            </AccordionItem>

            {/* Interests & Hobbies */}
            {(profile.interests || profile.hobbies) && (
              <AccordionItem value="interests" className="border-white/10">
                <AccordionTrigger className="text-white text-sm py-2">
                  Interests & Hobbies
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {profile.interests && profile.interests.length > 0 && (
                    <div>
                      <p className="text-white/70 text-xs mb-1">Interests</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.interests.slice(0, 6).map((interest, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-pink-400/30 text-pink-300 px-1.5 py-0.5">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.hobbies && profile.hobbies.length > 0 && (
                    <div>
                      <p className="text-white/70 text-xs mb-1">Hobbies</p>
                      <p className="text-white/90 text-xs">{formatList(profile.hobbies)}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Favorites */}
            {(profile.favoriteBooks || profile.favoriteMovies || profile.favoriteMusic) && (
              <AccordionItem value="favorites" className="border-white/10">
                <AccordionTrigger className="text-white text-sm py-2">
                  Favorites
                </AccordionTrigger>
                <AccordionContent className="text-white/90 text-xs space-y-1">
                  {profile.favoriteBooks && profile.favoriteBooks.length > 0 && (
                    <p><strong>Books:</strong> {formatList(profile.favoriteBooks)}</p>
                  )}
                  {profile.favoriteMovies && profile.favoriteMovies.length > 0 && (
                    <p><strong>Movies:</strong> {formatList(profile.favoriteMovies)}</p>
                  )}
                  {profile.favoriteMusic && profile.favoriteMusic.length > 0 && (
                    <p><strong>Music:</strong> {formatList(profile.favoriteMusic)}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Values & Goals */}
            {(profile.values || profile.growthGoals) && (
              <AccordionItem value="values" className="border-white/10">
                <AccordionTrigger className="text-white text-sm py-2">
                  Values & Goals
                </AccordionTrigger>
                <AccordionContent className="text-white/90 text-xs space-y-1">
                  {profile.values && profile.values.length > 0 && (
                    <p><strong>Values:</strong> {formatList(profile.values)}</p>
                  )}
                  {profile.growthGoals && profile.growthGoals.length > 0 && (
                    <p><strong>Goals:</strong> {formatList(profile.growthGoals)}</p>
                  )}
                  {profile.dreamVacation && <p><strong>Dream Vacation:</strong> {profile.dreamVacation}</p>}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
