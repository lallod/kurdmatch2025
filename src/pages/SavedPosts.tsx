import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';

const SavedPosts = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [savedPostsCount, setSavedPostsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedPostsCount();
  }, [user]);

  const loadSavedPostsCount = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Using type assertion to work around TypeScript until types regenerate
      const { count, error } = await (supabase as any)
        .from('saved_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedPostsCount(count || 0);
    } catch (error) {
      console.error('Error loading saved posts:', error);
      toast.error('Failed to load saved posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-white" />
              <h1 className="text-2xl font-bold text-white">Saved Posts</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {savedPostsCount > 0 
                ? `You have ${savedPostsCount} saved post${savedPostsCount !== 1 ? 's' : ''}`
                : 'No saved posts yet'
              }
            </h3>
            <p className="text-white/70">
              {savedPostsCount > 0 
                ? 'Your saved posts are stored securely'
                : 'Posts you save will appear here'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
