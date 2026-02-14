import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/api/profiles';
import { Post, Story } from '@/api/posts';
import { getPostsByUserId, getStoriesByUserId, getUserStats } from '@/api/posts';
import ProfileHeader from '@/components/instagram/ProfileHeader';
import StoryHighlights from '@/components/instagram/StoryHighlights';
import ProfileTabs from '@/components/instagram/ProfileTabs';
import CreateStoryModal from '@/components/stories/CreateStoryModal';

import ProfileFans from '@/components/instagram/ProfileFans';

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
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`*, photos (id, url, is_primary)`)
          .eq('id', id)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData);
        const [postsData, storiesData, statsData] = await Promise.all([
          getPostsByUserId(id),
          getStoriesByUserId(id),
          getUserStats(id),
        ]);
        setPosts(postsData);
        setStories(storiesData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
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
    <div className="min-h-screen bg-background pb-24">
      {/* Frosted header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-sm font-bold text-foreground tracking-tight">{profile.name}</h1>
          <div className="flex items-center gap-0.5">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors active:scale-95">
              <Share2 className="w-4 h-4 text-foreground" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors active:scale-95">
              <MoreHorizontal className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="px-4 pt-4 pb-1">
          <ProfileHeader profile={profile} stats={stats} isOwnProfile={isOwnProfile} />
        </div>

        {/* Story Highlights */}
        {(stories.length > 0 || isOwnProfile) && (
          <div className="px-4 py-2">
            <StoryHighlights
              stories={stories}
              isOwnProfile={isOwnProfile}
              onAddStory={() => setShowCreateStory(true)}
            />
          </div>
        )}

        {/* Fans Section */}
        {id && <ProfileFans userId={id} />}

        {/* Full-width Content Tabs */}
        <div className="mt-1">
          <ProfileTabs
            profile={profile}
            posts={posts}
            onRefreshPosts={() => getPostsByUserId(id!).then(setPosts)}
          />
        </div>
      </div>

      {id && (
        <CreateStoryModal
          open={showCreateStory}
          onOpenChange={setShowCreateStory}
          onStoryCreated={() => getStoriesByUserId(id).then(setStories)}
          userId={id}
        />
      )}

      
    </div>
  );
};

export default InstagramProfile;
