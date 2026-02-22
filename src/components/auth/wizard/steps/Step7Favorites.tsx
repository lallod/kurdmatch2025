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
    { value: 'kurdish_literature', label: t('books.kurdish_literature', 'Kurdish Literature'), emoji: '📚' },
    { value: 'poetry_collections', label: t('books.poetry_collections', 'Poetry Collections'), emoji: '📝' },
    { value: 'historical_novels', label: t('books.historical_novels', 'Historical Novels'), emoji: '🏛️' },
    { value: 'political_essays', label: t('books.political_essays', 'Political Essays'), emoji: '🗳️' },
    { value: 'self_help_books', label: t('books.self_help', 'Self-Help Books'), emoji: '📖' },
    { value: 'world_literature', label: t('books.world_literature', 'World Literature'), emoji: '🌍' },
    { value: 'biographies', label: t('books.biographies', 'Biographies'), emoji: '👤' },
    { value: 'science_fiction', label: t('books.science_fiction', 'Science Fiction'), emoji: '🚀' },
    { value: 'romance', label: t('books.romance', 'Romance'), emoji: '💕' },
    { value: 'mystery', label: t('books.mystery', 'Mystery'), emoji: '🔍' }
  ];

  const favoriteMoviesOptions = [
    { value: 'kurdish_cinema', label: t('movies.kurdish_cinema', 'Kurdish Cinema'), emoji: '🎬' },
    { value: 'historical_films', label: t('movies.historical_films', 'Historical Films'), emoji: '🏛️' },
    { value: 'documentaries', label: t('movies.documentaries', 'Documentaries'), emoji: '📹' },
    { value: 'drama', label: t('movies.drama', 'Drama'), emoji: '🎭' },
    { value: 'comedy', label: t('movies.comedy', 'Comedy'), emoji: '😂' },
    { value: 'action', label: t('movies.action', 'Action'), emoji: '💥' },
    { value: 'romance', label: t('movies.romance', 'Romance'), emoji: '💕' },
    { value: 'thriller', label: t('movies.thriller', 'Thriller'), emoji: '😱' },
    { value: 'animation', label: t('movies.animation', 'Animation'), emoji: '🎨' },
    { value: 'foreign_films', label: t('movies.foreign_films', 'Foreign Films'), emoji: '🌍' }
  ];

  const favoriteMusicOptions = [
    { value: 'traditional_kurdish_music', label: t('music.traditional_kurdish', 'Traditional Kurdish Music'), emoji: '🎵' },
    { value: 'modern_kurdish_music', label: t('music.modern_kurdish', 'Modern Kurdish Music'), emoji: '🎤' },
    { value: 'classical_music', label: t('music.classical', 'Classical Music'), emoji: '🎼' },
    { value: 'pop', label: t('music.pop', 'Pop'), emoji: '🎧' },
    { value: 'folk', label: t('music.folk', 'Folk'), emoji: '🪕' },
    { value: 'rock', label: t('music.rock', 'Rock'), emoji: '🎸' },
    { value: 'jazz', label: t('music.jazz', 'Jazz'), emoji: '🎺' },
    { value: 'hip_hop', label: t('music.hip_hop', 'Hip Hop'), emoji: '🎤' },
    { value: 'electronic', label: t('music.electronic', 'Electronic'), emoji: '🎛️' },
    { value: 'world_music', label: t('music.world_music', 'World Music'), emoji: '🌍' }
  ];

  const favoriteFoodsOptions = [
    { value: 'kurdish_cuisine', label: t('food.kurdish_cuisine', 'Kurdish Cuisine'), emoji: '🥘' },
    { value: 'persian_dishes', label: t('food.persian_dishes', 'Persian Dishes'), emoji: '🍛' },
    { value: 'turkish_food', label: t('food.turkish_food', 'Turkish Food'), emoji: '🥙' },
    { value: 'arabic_dishes', label: t('food.arabic_dishes', 'Arabic Dishes'), emoji: '🍽️' },
    { value: 'mediterranean_cuisine', label: t('food.mediterranean', 'Mediterranean Cuisine'), emoji: '🫒' },
    { value: 'international_food', label: t('food.international', 'International Food'), emoji: '🌍' },
    { value: 'vegetarian_options', label: t('food.vegetarian', 'Vegetarian Options'), emoji: '🥗' },
    { value: 'street_food', label: t('food.street_food', 'Street Food'), emoji: '🌮' },
    { value: 'desserts', label: t('food.desserts', 'Desserts'), emoji: '🍰' },
    { value: 'tea_coffee', label: t('food.tea_coffee', 'Tea & Coffee'), emoji: '☕' }
  ];

  const favoriteGamesOptions = [
    { value: 'backgammon', label: t('games.backgammon', 'Backgammon'), emoji: '🎲' },
    { value: 'chess', label: t('games.chess', 'Chess'), emoji: '♟️' },
    { value: 'traditional_kurdish_games', label: t('games.traditional_kurdish', 'Traditional Kurdish Games'), emoji: '🎯' },
    { value: 'card_games', label: t('games.card_games', 'Card Games'), emoji: '🃏' },
    { value: 'video_games', label: t('games.video_games', 'Video Games'), emoji: '🎮' },
    { value: 'mobile_games', label: t('games.mobile_games', 'Mobile Games'), emoji: '📱' },
    { value: 'board_games', label: t('games.board_games', 'Board Games'), emoji: '🎲' },
    { value: 'puzzle_games', label: t('games.puzzle_games', 'Puzzle Games'), emoji: '🧩' },
    { value: 'sports_games', label: t('games.sports_games', 'Sports Games'), emoji: '⚽' },
    { value: 'strategy_games', label: t('games.strategy_games', 'Strategy Games'), emoji: '🎯' }
  ];

  const favoritePodcastsOptions = [
    { value: 'kurdish_cultural_shows', label: t('podcasts.kurdish_cultural', 'Kurdish Cultural Shows'), emoji: '🎙️' },
    { value: 'history_podcasts', label: t('podcasts.history', 'History Podcasts'), emoji: '🏛️' },
    { value: 'cultural_discussions', label: t('podcasts.cultural_discussions', 'Cultural Discussions'), emoji: '🗣️' },
    { value: 'political_analysis', label: t('podcasts.political_analysis', 'Political Analysis'), emoji: '🗳️' },
    { value: 'self_improvement', label: t('podcasts.self_improvement', 'Self-Improvement'), emoji: '📈' },
    { value: 'language_learning', label: t('podcasts.language_learning', 'Language Learning'), emoji: '🗣️' },
    { value: 'comedy_shows', label: t('podcasts.comedy_shows', 'Comedy Shows'), emoji: '😂' },
    { value: 'true_crime', label: t('podcasts.true_crime', 'True Crime'), emoji: '🔍' },
    { value: 'technology', label: t('podcasts.technology', 'Technology'), emoji: '💻' },
    { value: 'health_wellness', label: t('podcasts.health_wellness', 'Health & Wellness'), emoji: '🧘' }
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
