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
        .limit(10);

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
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 animate-pulse">
        <div className="h-6 bg-white/10 rounded mb-3"></div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 bg-white/10 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (hashtags.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover-scale">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-semibold text-white">Explore Hashtags</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/hashtags')}
          className="text-xs text-blue-300 hover:text-white h-7 px-2"
        >
          See all
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {hashtags.map((hashtag) => (
          <button
            key={hashtag.id}
            onClick={() => navigate(`/hashtag/${hashtag.name}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <Hash className="w-3 h-3 text-blue-300" />
            <span className="text-xs font-medium text-white">{hashtag.name}</span>
            <span className="text-xs text-white/50">{hashtag.usage_count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
