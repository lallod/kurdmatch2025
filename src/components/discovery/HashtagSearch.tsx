import { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getTrendingHashtags, searchHashtags } from '@/api/hashtags';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';

export const HashtagSearch = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslations();

  useEffect(() => {
    loadTrendingHashtags();
  }, []);

  const loadTrendingHashtags = async () => {
    try {
      const data = await getTrendingHashtags(10);
      setTrending(data);
    } catch (error) {
      console.error('Error loading trending hashtags:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchHashtags(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching hashtags:', error);
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    navigate(`/hashtag/${hashtag}`);
  };

  const displayHashtags = searchQuery ? searchResults : trending;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('hashtag.search_placeholder', 'Search hashtags...')}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-background/50 backdrop-blur-sm"
        />
      </div>

      <div className="space-y-2">
        {!searchQuery && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <TrendingUp className="h-4 w-4" />
            <span>{t('hashtag.trending', 'Trending Hashtags')}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {displayHashtags.map((hashtag) => (
            <button
              key={hashtag.id}
              onClick={() => handleHashtagClick(hashtag.name)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 backdrop-blur-sm transition-all"
            >
              <span className="text-purple-300 font-medium">#{hashtag.name}</span>
              <span className="text-muted-foreground text-xs ml-2">
                {hashtag.usage_count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};