import React from 'react';
import { TagSelector } from '../fields/TagSelector';
import { Star, Book, Film } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface Step7Data {
  favorite_books?: string[];
  favorite_movies?: string[];
  favorite_music?: string[];
  favorite_foods?: string[];
  favorite_games?: string[];
  favorite_podcasts?: string[];
}

interface Step7FavoritesProps {
  data: Step7Data;
  onChange: (data: Step7Data) => void;
}

export const Step7Favorites: React.FC<Step7FavoritesProps> = ({ data, onChange }) => {
  const { t } = useTranslations();
  const favoriteBooksOptions = [
    { value: 'kurdish_literature', label: 'Kurdish Literature', emoji: '📚' },
    { value: 'poetry_collections', label: 'Poetry Collections', emoji: '📝' },
    { value: 'historical_novels', label: 'Historical Novels', emoji: '🏛️' },
    { value: 'political_essays', label: 'Political Essays', emoji: '🗳️' },
    { value: 'self_help_books', label: 'Self-Help Books', emoji: '📖' },
    { value: 'world_literature', label: 'World Literature', emoji: '🌍' },
    { value: 'biographies', label: 'Biographies', emoji: '👤' },
    { value: 'science_fiction', label: 'Science Fiction', emoji: '🚀' },
    { value: 'romance', label: 'Romance', emoji: '💕' },
    { value: 'mystery', label: 'Mystery', emoji: '🔍' }
  ];

  const favoriteMoviesOptions = [
    { value: 'kurdish_cinema', label: 'Kurdish Cinema', emoji: '🎬' },
    { value: 'historical_films', label: 'Historical Films', emoji: '🏛️' },
    { value: 'documentaries', label: 'Documentaries', emoji: '📹' },
    { value: 'drama', label: 'Drama', emoji: '🎭' },
    { value: 'comedy', label: 'Comedy', emoji: '😂' },
    { value: 'action', label: 'Action', emoji: '💥' },
    { value: 'romance', label: 'Romance', emoji: '💕' },
    { value: 'thriller', label: 'Thriller', emoji: '😱' },
    { value: 'animation', label: 'Animation', emoji: '🎨' },
    { value: 'foreign_films', label: 'Foreign Films', emoji: '🌍' }
  ];

  const favoriteMusicOptions = [
    { value: 'traditional_kurdish_music', label: 'Traditional Kurdish Music', emoji: '🎵' },
    { value: 'modern_kurdish_music', label: 'Modern Kurdish Music', emoji: '🎤' },
    { value: 'classical_music', label: 'Classical Music', emoji: '🎼' },
    { value: 'pop', label: 'Pop', emoji: '🎧' },
    { value: 'folk', label: 'Folk', emoji: '🪕' },
    { value: 'rock', label: 'Rock', emoji: '🎸' },
    { value: 'jazz', label: 'Jazz', emoji: '🎺' },
    { value: 'hip_hop', label: 'Hip Hop', emoji: '🎤' },
    { value: 'electronic', label: 'Electronic', emoji: '🎛️' },
    { value: 'world_music', label: 'World Music', emoji: '🌍' }
  ];

  const favoriteFoodsOptions = [
    { value: 'kurdish_cuisine', label: 'Kurdish Cuisine', emoji: '🥘' },
    { value: 'persian_dishes', label: 'Persian Dishes', emoji: '🍛' },
    { value: 'turkish_food', label: 'Turkish Food', emoji: '🥙' },
    { value: 'arabic_dishes', label: 'Arabic Dishes', emoji: '🍽️' },
    { value: 'mediterranean_cuisine', label: 'Mediterranean Cuisine', emoji: '🫒' },
    { value: 'international_food', label: 'International Food', emoji: '🌍' },
    { value: 'vegetarian_options', label: 'Vegetarian Options', emoji: '🥗' },
    { value: 'street_food', label: 'Street Food', emoji: '🌮' },
    { value: 'desserts', label: 'Desserts', emoji: '🍰' },
    { value: 'tea_coffee', label: 'Tea & Coffee', emoji: '☕' }
  ];

  const favoriteGamesOptions = [
    { value: 'backgammon', label: 'Backgammon', emoji: '🎲' },
    { value: 'chess', label: 'Chess', emoji: '♟️' },
    { value: 'traditional_kurdish_games', label: 'Traditional Kurdish Games', emoji: '🎯' },
    { value: 'card_games', label: 'Card Games', emoji: '🃏' },
    { value: 'video_games', label: 'Video Games', emoji: '🎮' },
    { value: 'mobile_games', label: 'Mobile Games', emoji: '📱' },
    { value: 'board_games', label: 'Board Games', emoji: '🎲' },
    { value: 'puzzle_games', label: 'Puzzle Games', emoji: '🧩' },
    { value: 'sports_games', label: 'Sports Games', emoji: '⚽' },
    { value: 'strategy_games', label: 'Strategy Games', emoji: '🎯' }
  ];

  const favoritePodcastsOptions = [
    { value: 'kurdish_cultural_shows', label: 'Kurdish Cultural Shows', emoji: '🎙️' },
    { value: 'history_podcasts', label: 'History Podcasts', emoji: '🏛️' },
    { value: 'cultural_discussions', label: 'Cultural Discussions', emoji: '🗣️' },
    { value: 'political_analysis', label: 'Political Analysis', emoji: '🗳️' },
    { value: 'self_improvement', label: 'Self-Improvement', emoji: '📈' },
    { value: 'language_learning', label: 'Language Learning', emoji: '🗣️' },
    { value: 'comedy_shows', label: 'Comedy Shows', emoji: '😂' },
    { value: 'true_crime', label: 'True Crime', emoji: '🔍' },
    { value: 'technology', label: 'Technology', emoji: '💻' },
    { value: 'health_wellness', label: 'Health & Wellness', emoji: '🧘' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('wizard.lets_talk_favorites', "Let's talk favorites!")}</h2>
        <p className="text-purple-200">{t('wizard.share_what_you_love', 'Share what you love most')}</p>
      </div>

      <div className="space-y-6">
        {/* Favorite Books */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('profile.favorite_books', 'Favorite Books')}</h3>
          <TagSelector
            options={favoriteBooksOptions}
            value={data.favorite_books || []}
            onChange={(value) => onChange({ ...data, favorite_books: value })}
            placeholder={t('wizard.what_love_read', 'What do you love to read?')}
            maxSelections={5}
          />
        </div>

        {/* Favorite Movies */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('profile.favorite_movies', 'Favorite Movies')}</h3>
          <TagSelector
            options={favoriteMoviesOptions}
            value={data.favorite_movies || []}
            onChange={(value) => onChange({ ...data, favorite_movies: value })}
            placeholder={t('wizard.what_genres_enjoy', 'What genres do you enjoy?')}
            maxSelections={5}
          />
        </div>

        {/* Favorite Music */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('profile.favorite_music', 'Favorite Music')}</h3>
          <TagSelector
            options={favoriteMusicOptions}
            value={data.favorite_music || []}
            onChange={(value) => onChange({ ...data, favorite_music: value })}
            placeholder={t('wizard.what_music_listen', 'What music do you listen to?')}
            maxSelections={5}
          />
        </div>

        {/* Favorite Foods */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('profile.favorite_foods', 'Favorite Foods')}</h3>
          <TagSelector
            options={favoriteFoodsOptions}
            value={data.favorite_foods || []}
            onChange={(value) => onChange({ ...data, favorite_foods: value })}
            placeholder={t('wizard.what_cuisines_love', 'What cuisines do you love?')}
            maxSelections={5}
          />
        </div>

        {/* Favorite Games */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('profile.favorite_games', 'Favorite Games')}</h3>
          <TagSelector
            options={favoriteGamesOptions}
            value={data.favorite_games || []}
            onChange={(value) => onChange({ ...data, favorite_games: value })}
            placeholder={t('wizard.what_games_enjoy', 'What games do you enjoy?')}
            maxSelections={4}
          />
        </div>

        {/* Favorite Podcasts */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('profile.favorite_podcasts', 'Favorite Podcasts')}</h3>
          <TagSelector
            options={favoritePodcastsOptions}
            value={data.favorite_podcasts || []}
            onChange={(value) => onChange({ ...data, favorite_podcasts: value })}
            placeholder={t('wizard.what_podcasts_listen', 'What podcasts do you listen to?')}
            maxSelections={4}
          />
        </div>
      </div>
    </div>
  );
};
