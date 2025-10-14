import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Hash, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TrendingHashtag {
  name: string;
  usage_count: number;
}

export const TrendingHashtags: React.FC = () => {
  const navigate = useNavigate();
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingHashtags();
  }, []);

  const loadTrendingHashtags = async () => {
    try {
      const { data, error } = await supabase
        .from('hashtags')
        .select('name, usage_count')
        .order('usage_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHashtags(data || []);
    } catch (error) {
      console.error('Error loading trending hashtags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    navigate(`/hashtag/${encodeURIComponent(hashtag)}`);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-white/5 rounded" />
        ))}
      </div>
    );
  }

  if (hashtags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-pink-400" />
        <h2 className="text-lg font-semibold text-white">Trending Hashtags</h2>
      </div>
      
      <div className="space-y-2">
        {hashtags.map((hashtag, index) => (
          <Button
            key={hashtag.name}
            variant="ghost"
            onClick={() => handleHashtagClick(hashtag.name)}
            className="w-full justify-between h-auto p-3 hover:bg-white/10 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-sm font-medium w-6">#{index + 1}</span>
              <Hash className="w-4 h-4 text-purple-400" />
              <span className="text-white font-medium">#{hashtag.name}</span>
            </div>
            <span className="text-white/50 text-sm">
              {hashtag.usage_count.toLocaleString()} posts
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
