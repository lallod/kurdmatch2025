import { useState, useEffect } from 'react';
import { Hash, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getTrendingHashtags } from '@/api/hashtags';
import { useTranslations } from '@/hooks/useTranslations';

interface Hashtag {
  id: string;
  name: string;
  usage_count: number;
}

export const CompactTrendingHashtags = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHashtags();
  }, []);

  const loadHashtags = async () => {
    try {
      const data = await getTrendingHashtags(4);
      setHashtags(data);
    } catch (error) {
      console.error('Error loading trending hashtags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-20 mb-2"></div>
        <div className="flex flex-wrap gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-white/10 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (hashtags.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
      <div className="flex items-center gap-1.5 mb-2">
        <TrendingUp className="w-4 h-4 text-pink-400" />
        <h3 className="text-sm font-semibold text-white">{t('discovery.trending', 'Trending')}</h3>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {hashtags.slice(0, 4).map((hashtag) => (
          <button
            key={hashtag.id}
            onClick={() => navigate(`/hashtag/${hashtag.name}`)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 backdrop-blur-sm transition-all hover:scale-105"
          >
            <Hash className="w-3 h-3 text-purple-300" />
            <span className="text-xs font-medium text-white">{hashtag.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
