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
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            photos (url, is_primary)
          `)
          .eq('id', id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch posts, stories, and stats in parallel
        const [postsData, storiesData, statsData] = await Promise.all([
          getPostsByUserId(id),
          getStoriesByUserId(id),
          getUserStats(id)
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <button onClick={() => navigate(-1)} className="text-purple-300 hover:text-purple-200">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUserId === id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-pink-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">{profile.name}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <ProfileHeader 
          profile={profile} 
          stats={stats}
          isOwnProfile={isOwnProfile}
        />

        {/* Story creation button for own profile */}
        {isOwnProfile && (
          <div className="mb-4">
            <Button
              onClick={() => setShowCreateStory(true)}
              variant="outline"
              className="w-full gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Plus className="w-4 h-4" />
              Create Story
            </Button>
          </div>
        )}

        {/* Story Highlights */}
        {stories.length > 0 && (
          <StoryHighlights 
            stories={stories}
            isOwnProfile={isOwnProfile}
          />
        )}

        {/* Content Tabs */}
        <ProfileTabs 
          profile={profile}
          posts={posts}
          onRefreshPosts={() => getPostsByUserId(id!).then(setPosts)}
        />
      </div>

      {/* Create Story Modal */}
      {id && (
        <CreateStoryModal
          open={showCreateStory}
          onOpenChange={setShowCreateStory}
          onStoryCreated={() => {
            getStoriesByUserId(id).then(setStories);
          }}
          userId={id}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default InstagramProfile;
