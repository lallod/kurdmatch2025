
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, Sparkles, Map, Headphones, Puzzle, Heart, Star
} from 'lucide-react';
import DetailItem from './DetailItem';
import { useTranslations } from '@/hooks/useTranslations';

interface ProfileInterestsProps {
  details: {
    interests: string[];
    hobbies?: string[] | string;
    weekendActivities?: string[] | string;
    idealDate?: string;
    careerAmbitions?: string;
    musicInstruments?: string[] | string;
    favoriteGames?: string[] | string;
  };
  tinderBadgeStyle: string;
  formatList: (value: string[] | string | undefined) => string;
  isMobile: boolean;
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const ProfileInterests: React.FC<ProfileInterestsProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile,
  onFieldEdit
}) => {
  const { t } = useTranslations();
  const notSpecified = t('profile.not_specified', 'Not specified');

  return (
    <div className="py-4">
      <div className="space-y-1">
        <DetailItem 
          icon={<Heart size={18} />} label={t('profile.interests', 'Interests')}
          editable={!!onFieldEdit}
          fieldKey="interests"
          fieldType="multi-select"
          fieldOptions={["Travel", "Photography", "Cooking", "Hiking", "Reading", "Music", "Dancing", "Sports", "Fitness", "Art", "Movies", "Gaming", "Technology", "Fashion", "Food", "Nature", "Animals", "History", "Science", "Politics"]}
          onFieldEdit={onFieldEdit}
          value={
            <div className="flex flex-wrap gap-2 mt-1">
              {details.interests.map((interest, i) => (
                <Badge key={i} variant="outline" className={tinderBadgeStyle}>{interest}</Badge>
              ))}
            </div>
          }
        />
        <Separator />
        <DetailItem 
          icon={<Star size={18} />} label={t('profile.hobbies', 'Hobbies')}
          editable={!!onFieldEdit}
          fieldKey="hobbies"
          fieldType="multi-select"
          fieldOptions={["Drawing", "Painting", "Writing", "Singing", "Playing instruments", "Gardening", "Crafting", "Collecting", "Board games", "Video games", "Yoga", "Meditation", "Running", "Cycling", "Swimming", "Rock climbing", "Martial arts", "Chess"]}
          onFieldEdit={onFieldEdit}
          value={
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(details.hobbies) ? 
                details.hobbies.map((hobby, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{hobby}</Badge>
                )) : 
                (formatList(details.hobbies) || notSpecified).split(", ").filter(Boolean).map((hobby, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{hobby}</Badge>
                ))
              }
            </div>
          }
        />
        <Separator />
      </div>
      
      <div className="space-y-1">
        <DetailItem 
          icon={<Calendar size={18} />} label={t('profile.weekend_activities', 'Weekend Activities')}
          editable={!!onFieldEdit}
          fieldKey="weekendActivities"
          fieldType="multi-select"
          fieldOptions={["Hiking", "Reading", "Socializing", "Gaming", "Cooking", "Sports", "Shopping", "Traveling", "Relaxing", "Volunteering"]}
          onFieldEdit={onFieldEdit}
          value={
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(details.weekendActivities) ? 
                details.weekendActivities.map((act, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{act}</Badge>
                )) : 
                (formatList(details.weekendActivities) || notSpecified).split(", ").filter(Boolean).map((act, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{act}</Badge>
                ))
              }
            </div>
          }
        />
        <Separator />
        <DetailItem 
          icon={<Sparkles size={18} />} label={t('profile.ideal_date', 'Ideal Date')}
          value={details.idealDate || notSpecified}
          editable={!!onFieldEdit}
          fieldKey="idealDate"
          fieldType="select"
          fieldOptions={["Dinner & conversation", "Outdoor adventure", "Coffee shop", "Movie night", "Cooking together", "Cultural event", "Picnic", "Surprise me"]}
          onFieldEdit={onFieldEdit}
        />
        <Separator />
        <DetailItem 
          icon={<Map size={18} />} label={t('profile.career_ambitions', 'Career Ambitions')}
          value={details.careerAmbitions || notSpecified}
          editable={!!onFieldEdit}
          fieldKey="careerAmbitions"
          fieldType="select"
          fieldOptions={["Climbing the ladder", "Entrepreneurial", "Content where I am", "Career change", "Creative pursuit", "Work to live"]}
          onFieldEdit={onFieldEdit}
        />
        <Separator />
        <DetailItem 
          icon={<Headphones size={18} />} label={t('profile.music_instruments', 'Music Instruments')}
          editable={!!onFieldEdit}
          fieldKey="musicInstruments"
          fieldType="multi-select"
          fieldOptions={["Guitar", "Piano", "Drums", "Violin", "Flute", "Oud", "Saz", "Daf", "None"]}
          onFieldEdit={onFieldEdit}
          value={
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(details.musicInstruments) ? 
                details.musicInstruments.map((instrument, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{instrument}</Badge>
                )) : 
                formatList(details.musicInstruments).split(", ").map((instrument, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{instrument}</Badge>
                ))
              }
            </div>
          } 
        />
        <Separator />
        <DetailItem 
          icon={<Puzzle size={18} />} label={t('profile.favorite_games', 'Favorite Games')}
          editable={!!onFieldEdit}
          fieldKey="favoriteGames"
          fieldType="multi-select"
          fieldOptions={["Chess", "Card games", "Video games", "Board games", "Puzzle games", "Sports games", "Strategy games"]}
          onFieldEdit={onFieldEdit}
          value={
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(details.favoriteGames) ? 
                details.favoriteGames.map((game, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{game}</Badge>
                )) : 
                formatList(details.favoriteGames).split(", ").map((game, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{game}</Badge>
                ))
              }
            </div>
          } 
        />
      </div>
    </div>
  );
};

export default ProfileInterests;