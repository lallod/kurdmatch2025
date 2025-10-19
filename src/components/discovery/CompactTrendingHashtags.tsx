import { useState, useEffect } from 'react';
import { Hash, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getTrendingHashtags } from '@/api/hashtags';

interface Hashtag {
  id: string;
  name: string;
  usage_count: number;
}

export const CompactTrendingHashtags = () => {
  const navigate = useNavigate();
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHashtags();
  }, []);

  const loadHashtags = async () => {
    try {
      const data = await getTrendingHashtags(6);
      setHashtags(data);
    } catch (error) {
      console.error('Error loading trending hashtags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 animate-pulse">
        <div className="h-6 bg-white/10 rounded mb-3"></div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 bg-white/10 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (hashtags.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover-scale">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-pink-400" />
        <h3 className="text-base font-semibold text-white">Trending</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {hashtags.map((hashtag) => (
          <button
            key={hashtag.id}
            onClick={() => navigate(`/hashtag/${hashtag.name}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <Hash className="w-3 h-3 text-purple-300" />
            <span className="text-xs font-medium text-white">{hashtag.name}</span>
            <span className="text-xs text-white/50">{hashtag.usage_count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
