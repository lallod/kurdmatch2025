import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getStories, likePost, unlikePost, Post, Story, getFollowingPosts } from '@/api/posts';
import { getPostsByHashtag } from '@/api/hashtags';
import StoryBubbles from '@/components/discovery/StoryBubbles';
import PostCard from '@/components/discovery/PostCard';
import { Loader2, Heart, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StoryViewer from '@/components/stories/StoryViewer';
import CreateStoryModal from '@/components/stories/CreateStoryModal';
import { supabase } from '@/integrations/supabase/client';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useRealtimePosts } from '@/hooks/useRealtimePosts';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/hooks/useTranslations';

type FeedFilter = 'for_you' | 'following';

const DiscoveryFeed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslations();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('for_you');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchingHashtag, setSearchingHashtag] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [postsData, storiesData] = await Promise.all([
        feedFilter === 'following' ? getFollowingPosts() : getPosts(),
        getStories()
      ]);
      setPosts(postsData);
      setStories(storiesData);
    } catch (error) {
      console.error('Error loading feed:', error);
      toast({ title: 'Error', description: 'Failed to load feed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [feedFilter]);

  const loadPosts = useCallback(async () => {
    try {
      let postsData: Post[];
      if (searchingHashtag) {
        postsData = await getPostsByHashtag(searchingHashtag) as Post[];
      } else {
        postsData = feedFilter === 'following' ? await getFollowingPosts() : await getPosts();
      }
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }, [feedFilter, searchingHashtag]);

  useEffect(() => { loadData(); }, [feedFilter]);
  useEffect(() => { if (searchingHashtag) loadPosts(); }, [searchingHashtag]);

  useRealtimePosts({ onPostInserted: loadPosts, onPostUpdated: loadPosts, onPostDeleted: loadPosts });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post?.is_liked) await unlikePost(postId);
      else await likePost(postId);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to like post', variant: 'destructive' });
    }
  };

  const handleComment = (postId: string) => { navigate(`/post/${postId}`); };
  const handleStoryClick = (story: Story) => navigate(`/stories/${story.user_id}`);
  const handleAddStory = () => navigate('/stories/create');
  const handleStoryCreated = async () => { const s = await getStories(); setStories(s); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) { setSearchingHashtag(null); return; }
    if (q.startsWith('#')) { setSearchingHashtag(q.slice(1)); } else { setSearchingHashtag(q); }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchingHashtag(null);
    setShowSearch(false);
    loadPosts();
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (a.media_url && !b.media_url) return -1;
    if (!a.media_url && b.media_url) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-2xl border-b border-border/10">
        <div className="max-w-md mx-auto px-4" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <div className="h-12 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Heart className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold text-foreground tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                KurdMatch
              </h1>
            </div>
            <div className="flex items-center gap-0.5">
              <button onClick={() => setShowSearch(!showSearch)} className="text-muted-foreground h-9 w-9 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                <Search className="w-[18px] h-[18px]" />
              </button>
              <NotificationBell />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {showSearch && (
          <div className="px-4 pt-3 pb-1 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('discovery.search', 'Search by word or #hashtag...')} className="h-10 rounded-xl bg-card/60 border-border/15 text-foreground placeholder:text-muted-foreground/50 pr-16 text-sm" autoFocus />
              <div className="absolute right-1 top-1 flex items-center gap-0.5">
                {searchQuery && (
                  <button type="button" onClick={clearSearch} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground"><X className="w-4 h-4" /></button>
                )}
                <button type="submit" className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium">{t('common.search', 'Search')}</button>
              </div>
            </form>
          </div>
        )}

        {searchingHashtag && (
          <div className="mx-4 mt-2 px-3 py-2 flex items-center justify-between bg-primary/10 rounded-xl border border-primary/15">
            <span className="text-xs text-foreground font-medium">#{searchingHashtag}</span>
            <button onClick={clearSearch} className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-muted/50 active:scale-90 transition-transform"><X className="w-3 h-3 text-muted-foreground" /></button>
          </div>
        )}

        <div className="px-3 pt-3 pb-2">
          <StoryBubbles stories={stories} onStoryClick={handleStoryClick} onAddStory={handleAddStory} />
        </div>

        <div className="px-4 py-2">
          <div className="flex gap-0 border-b border-border/10">
            {([
              { key: 'for_you' as FeedFilter, label: t('discovery.feed.for_you', 'For You') },
              { key: 'following' as FeedFilter, label: t('discovery.feed.following', 'Following') },
            ]).map((tab) => (
              <button key={tab.key} onClick={() => { setFeedFilter(tab.key); setSearchingHashtag(null); }}
                className={`flex-1 py-2.5 text-[13px] font-semibold text-center transition-all relative ${feedFilter === tab.key ? 'text-foreground' : 'text-muted-foreground'}`}>
                {tab.label}
                {feedFilter === tab.key && <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-primary rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-0">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {feedFilter === 'following' ? t('discovery.feed.no_following_posts', 'No posts from people you follow') : t('discovery.feed.no_posts', 'No posts yet')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {feedFilter === 'following' ? t('discovery.feed.follow_people', 'Follow people to see their posts here') : t('discovery.feed.posts_appear', 'Posts from users will appear here')}
              </p>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <div key={post.id} className="border-b border-border/5">
                <PostCard post={post} onLike={handleLike} onComment={handleComment} />
              </div>
            ))
          )}
        </div>
      </div>

      {selectedStory && (
        <StoryViewer open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)} stories={stories} initialIndex={stories.findIndex(s => s.id === selectedStory.id)} />
      )}

      {currentUserId && (
        <CreateStoryModal open={showCreateStory} onOpenChange={setShowCreateStory} onStoryCreated={handleStoryCreated} userId={currentUserId} />
      )}
    </div>
  );
};

export default DiscoveryFeed;
