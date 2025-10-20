import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getStories, likePost, unlikePost, Post, Story, getFollowingPosts } from '@/api/posts';
import { getEvents, joinEvent, leaveEvent, Event } from '@/api/events';
import StoryBubbles from '@/components/discovery/StoryBubbles';
import PostCard from '@/components/discovery/PostCard';
import EventCard from '@/components/discovery/EventCard';
import EventFilters from '@/components/discovery/EventFilters';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenSquare, Loader2, Calendar, Plus, Filter, Users as UsersIcon, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import StoryViewer from '@/components/stories/StoryViewer';
import CreateStoryModal from '@/components/stories/CreateStoryModal';
import { supabase } from '@/integrations/supabase/client';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useRealtimePosts } from '@/hooks/useRealtimePosts';
import { CompactTrendingHashtags } from '@/components/discovery/CompactTrendingHashtags';
import { CompactExploreHashtags } from '@/components/discovery/CompactExploreHashtags';
import { CompactGroups } from '@/components/discovery/CompactGroups';

const DiscoveryFeed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEventFilters, setShowEventFilters] = useState(false);
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  
  // Event filters
  const [eventCategory, setEventCategory] = useState('all');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDateFrom, setEventDateFrom] = useState('');
  const [eventDateTo, setEventDateTo] = useState('');
  const [eventSearchQuery, setEventSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, storiesData, eventsData] = await Promise.all([
        showFollowingOnly ? getFollowingPosts() : getPosts(),
        getStories(),
        getEvents()
      ]);
      setPosts(postsData);
      setStories(storiesData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading feed:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feed',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const postsData = showFollowingOnly ? await getFollowingPosts() : await getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [showFollowingOnly]);

  // Real-time updates for posts
  useRealtimePosts({
    onPostInserted: loadPosts,
    onPostUpdated: loadPosts,
    onPostDeleted: loadPosts
  });

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
      if (post?.is_liked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: 'Error',
        description: 'Failed to like post',
        variant: 'destructive'
      });
    }
  };

  const handleComment = (postId: string) => {
    // Navigate to post detail with comments
    toast({
      title: 'Comments',
      description: 'Comment feature coming soon!'
    });
  };

  const handleStoryClick = (story: Story) => {
    navigate(`/stories/${story.user_id}`);
  };

  const handleAddStory = () => {
    navigate('/stories/create');
  };

  const handleStoryCreated = async () => {
    const storiesData = await getStories();
    setStories(storiesData);
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      await joinEvent(eventId);
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, is_attending: true, attendees_count: event.attendees_count + 1 }
          : event
      ));
      toast({
        title: 'Success',
        description: 'Joined event successfully!'
      });
    } catch (error) {
      console.error('Error joining event:', error);
      toast({
        title: 'Error',
        description: 'Failed to join event',
        variant: 'destructive'
      });
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      await leaveEvent(eventId);
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, is_attending: false, attendees_count: Math.max(0, event.attendees_count - 1) }
          : event
      ));
      toast({
        title: 'Left event',
        description: 'You are no longer attending this event'
      });
    } catch (error) {
      console.error('Error leaving event:', error);
      toast({
        title: 'Error',
        description: 'Failed to leave event',
        variant: 'destructive'
      });
    }
  };

  const handleClearEventFilters = () => {
    setEventCategory('all');
    setEventLocation('');
    setEventDateFrom('');
    setEventDateTo('');
    setEventSearchQuery('');
  };

  const filteredEvents = events.filter(event => {
    // Category filter
    if (eventCategory !== 'all' && event.category !== eventCategory) {
      return false;
    }
    
    // Location filter
    if (eventLocation && !event.location.toLowerCase().includes(eventLocation.toLowerCase())) {
      return false;
    }
    
    // Date from filter
    if (eventDateFrom && new Date(event.event_date) < new Date(eventDateFrom)) {
      return false;
    }
    
    // Date to filter
    if (eventDateTo && new Date(event.event_date) > new Date(eventDateTo)) {
      return false;
    }

    // Search filter
    if (eventSearchQuery) {
      const query = eventSearchQuery.toLowerCase();
      if (
        !event.title.toLowerCase().includes(query) &&
        !event.description.toLowerCase().includes(query) &&
        !event.location.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Discovery</h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
            {activeTab === 'posts' && (
              <Button 
                onClick={() => setShowFollowingOnly(!showFollowingOnly)}
                size="sm"
                variant={showFollowingOnly ? "default" : "outline"}
                className={`gap-2 ${showFollowingOnly ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0' : 'bg-purple-600/50 backdrop-blur-sm border-white/20 text-white hover:bg-purple-600/70'}`}
              >
                <UsersIcon className="w-4 h-4" />
                Following
              </Button>
            )}
            {activeTab === 'events' && (
              <Button 
                onClick={() => setShowEventFilters(!showEventFilters)}
                size="sm"
                variant="outline"
                className="gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            )}
            <Button 
              onClick={activeTab === 'posts' ? handleCreatePost : handleCreateEvent}
              size="sm" 
              className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'posts' ? 'New Post' : 'New Event'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white/70"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white/70"
            >
              Events
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            {/* Stories Section */}
            {stories.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                <StoryBubbles
                  stories={stories}
                  onStoryClick={handleStoryClick}
                  onAddStory={handleAddStory}
                />
              </div>
            )}

            {/* Compact Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CompactExploreHashtags />
              <CompactTrendingHashtags />
              <CompactGroups />
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12 text-white">
                  <p className="text-white/70 mb-4">No posts yet</p>
                  <Button 
                    onClick={handleCreatePost} 
                    className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  >
                    <PenSquare className="w-4 h-4" />
                    Create First Post
                  </Button>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <PostCard
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                    />
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            {/* Event Filters */}
            {showEventFilters && (
              <EventFilters
                category={eventCategory}
                location={eventLocation}
                dateFrom={eventDateFrom}
                dateTo={eventDateTo}
                searchQuery={eventSearchQuery}
                onCategoryChange={setEventCategory}
                onLocationChange={setEventLocation}
                onDateFromChange={setEventDateFrom}
                onDateToChange={setEventDateTo}
                onSearchChange={setEventSearchQuery}
                onClearFilters={handleClearEventFilters}
              />
            )}

            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-white">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-white/50" />
                <p className="text-white/70 mb-4">
                  {events.length === 0 ? 'No upcoming events' : 'No events match your filters'}
                </p>
                {events.length === 0 ? (
                  <Button 
                    onClick={handleCreateEvent} 
                    className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  >
                    <Calendar className="w-4 h-4" />
                    Create First Event
                  </Button>
                ) : (
                  <Button 
                    onClick={handleClearEventFilters} 
                    className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onJoin={handleJoinEvent}
                  onLeave={handleLeaveEvent}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />

      {/* Story Viewer */}
      {selectedStory && (
        <StoryViewer
          open={!!selectedStory}
          onOpenChange={(open) => !open && setSelectedStory(null)}
          stories={stories}
          initialIndex={stories.findIndex(s => s.id === selectedStory.id)}
        />
      )}

      {/* Create Story Modal */}
      {currentUserId && (
        <CreateStoryModal
          open={showCreateStory}
          onOpenChange={setShowCreateStory}
          onStoryCreated={handleStoryCreated}
          userId={currentUserId}
        />
      )}
    </div>
  );
};

export default DiscoveryFeed;
