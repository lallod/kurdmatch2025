import { useState, useEffect } from 'react';
import { Hash, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Hashtag {
  id: string;
  name: string;
  usage_count: number;
}

export const CompactExploreHashtags = () => {
  const navigate = useNavigate();
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHashtags();
  }, []);

  const loadHashtags = async () => {
    try {
      const { data, error } = await supabase
        .from('hashtags')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setHashtags(data || []);
    } catch (error) {
      console.error('Error loading explore hashtags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
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
    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Explore</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/hashtags')}
          className="text-xs text-blue-300 hover:text-white h-6 px-1.5"
        >
          All
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {hashtags.slice(0, 5).map((hashtag) => (
          <button
            key={hashtag.id}
            onClick={() => navigate(`/hashtag/${hashtag.name}`)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm transition-all hover:scale-105"
          >
            <Hash className="w-3 h-3 text-blue-300" />
            <span className="text-xs font-medium text-white">{hashtag.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
