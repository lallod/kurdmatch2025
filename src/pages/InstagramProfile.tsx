import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/api/profiles';
import { Post, Story } from '@/api/posts';
import { getPostsByUserId, getStoriesByUserId, getUserStats } from '@/api/posts';
import { Button } from '@/components/ui/button';
import ProfileHeader from '@/components/instagram/ProfileHeader';
import StoryHighlights from '@/components/instagram/StoryHighlights';
import ProfileTabs from '@/components/instagram/ProfileTabs';
import CreateStoryModal from '@/components/stories/CreateStoryModal';
import BottomNavigation from '@/components/BottomNavigation';

const InstagramProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
        const { data: profileData, error: profileError } = await supabase.from('profiles').select(`*, photos (id, url, is_primary)`).eq('id', id).single();
        if (profileError) throw profileError;
        setProfile(profileData);
        const [postsData, storiesData, statsData] = await Promise.all([getPostsByUserId(id), getStoriesByUserId(id), getUserStats(id)]);
        setPosts(postsData); setStories(storiesData); setStats(statsData);
      } catch (error) { console.error('Error loading profile:', error); }
      finally { setLoading(false); }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Profile not found</h2>
          <button onClick={() => navigate(-1)} className="text-primary text-sm">Go back</button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUserId === id;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Slim header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">{profile.name}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <ProfileHeader profile={profile} stats={stats} isOwnProfile={isOwnProfile} />

        {isOwnProfile && (
          <div className="mb-4">
            <Button onClick={() => setShowCreateStory(true)} variant="outline" size="sm" className="w-full gap-1.5">
              <Plus className="w-3.5 h-3.5" />Create Story
            </Button>
          </div>
        )}

        {stories.length > 0 && <StoryHighlights stories={stories} isOwnProfile={isOwnProfile} />}
        <ProfileTabs profile={profile} posts={posts} onRefreshPosts={() => getPostsByUserId(id!).then(setPosts)} />
      </div>

      {id && (
        <CreateStoryModal open={showCreateStory} onOpenChange={setShowCreateStory}
          onStoryCreated={() => getStoriesByUserId(id).then(setStories)} userId={id} />
      )}

      <BottomNavigation />
    </div>
  );
};

export default InstagramProfile;
