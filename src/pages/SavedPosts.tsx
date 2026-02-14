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
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-base font-semibold text-foreground">Saved Posts</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="text-center py-16">
            <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-base font-semibold text-foreground mb-1">
              {savedPostsCount > 0 
                ? `${savedPostsCount} saved post${savedPostsCount !== 1 ? 's' : ''}`
                : 'No saved posts yet'
              }
            </h3>
            <p className="text-sm text-muted-foreground">
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
