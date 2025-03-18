
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Film, Music, Utensils, Headphones, Pencil
} from 'lucide-react';

interface ProfileFavoritesProps {
  details: {
    favoriteBooks: string[];
    favoriteMovies: string[];
    favoriteMusic: string[];
    favoriteFoods: string[];
    favoritePodcasts?: string[] | string;
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
  return (
    <div className="space-y-6 py-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">Books</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {details.favoriteBooks.map((book, index) => (
            <Badge key={index} variant="outline" className={tinderBadgeStyle}>{book}</Badge>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Film size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">Movies</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {details.favoriteMovies.map((movie, index) => (
            <Badge key={index} variant="outline" className={tinderBadgeStyle}>{movie}</Badge>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Music size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">Music</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {details.favoriteMusic.map((music, index) => (
            <Badge key={index} variant="outline" className={tinderBadgeStyle}>{music}</Badge>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Utensils size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">Food</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {details.favoriteFoods.map((food, index) => (
            <Badge key={index} variant="outline" className={tinderBadgeStyle}>{food}</Badge>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Headphones size={16} className="text-tinder-peach" />
          <span className="text-sm font-medium">Podcasts</span>
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
          <span className="text-sm font-medium">Favorite Quote</span>
        </div>
        <p className={isMobile ? "text-gray-300 italic" : "text-muted-foreground italic"}>"{details.favoriteQuote || "Not specified"}"</p>
      </div>
    </div>
  );
};

export default ProfileFavorites;
