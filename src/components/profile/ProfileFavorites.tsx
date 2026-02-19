
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Film, Music, Utensils, Headphones, Pencil, Youtube, ExternalLink
} from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface ProfileFavoritesProps {
  details: {
    favoriteBooks?: string[] | null;
    favoriteMovies?: string[] | null;
    favoriteMusic?: string[] | null;
    favoriteFoods?: string[] | null;
    favoritePodcasts?: string[] | string | null;
    favoriteQuote?: string;
  };
  tinderBadgeStyle: string;
  formatList: (value: string[] | string | undefined) => string;
  isMobile: boolean;
}

const ProfileFavorites: React.FC<ProfileFavoritesProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile
}) => {
  const { t } = useTranslations();

  const getMusicIcon = (music: string) => {
    const lowerCaseMusic = music.toLowerCase();
    if (lowerCaseMusic.includes('spotify') || lowerCaseMusic.includes('spoti.fi')) {
      return <ExternalLink size={12} className="ml-1 text-green-500" />;
    }
    if (lowerCaseMusic.includes('youtube') || lowerCaseMusic.includes('youtu.be')) {
      return <Youtube size={12} className="ml-1 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">{t('profile.books', 'Books')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(details.favoriteBooks || []).map((book, index) => (
            <Badge key={index} variant="outline" className={tinderBadgeStyle}>{book}</Badge>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Film size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">{t('profile.movies', 'Movies')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(details.favoriteMovies || []).map((movie, index) => (
            <Badge key={index} variant="outline" className={tinderBadgeStyle}>{movie}</Badge>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Music size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">{t('profile.music', 'Music')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(details.favoriteMusic || []).map((music, index) => (
            <Badge key={index} variant="outline" className={tinderBadgeStyle}>
              <span className="flex items-center">
                {music}
                {getMusicIcon(music)}
              </span>
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Utensils size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">{t('profile.food', 'Food')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(details.favoriteFoods || []).map((food, index) => (
            <Badge key={index} variant="outline" className={tinderBadgeStyle}>{food}</Badge>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Headphones size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">{t('profile.podcasts', 'Podcasts')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(details.favoritePodcasts) ? 
            details.favoritePodcasts.map((podcast, i) => (
              <Badge key={i} variant="outline" className={tinderBadgeStyle}>{podcast}</Badge>
            )) : 
            formatList(details.favoritePodcasts).split(", ").map((podcast, i) => (
              <Badge key={i} variant="outline" className={tinderBadgeStyle}>{podcast}</Badge>
            ))
          }
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Pencil size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">{t('profile.favorite_quote', 'Favorite Quote')}</span>
        </div>
        <p className="text-muted-foreground italic">"{details.favoriteQuote || t('common.not_specified', 'Not specified')}"</p>
      </div>
    </div>
  );
};

export default ProfileFavorites;
