import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getStories, likePost, unlikePost, Post, Story, getFollowingPosts } from '@/api/posts';
import { getEvents, joinEvent, leaveEvent, Event } from '@/api/events';
import { getPostsByHashtag } from '@/api/hashtags';
import { getGroupPosts } from '@/api/groups';
import StoryBubbles from '@/components/discovery/StoryBubbles';
import PostCard from '@/components/discovery/PostCard';
import EventCard from '@/components/discovery/EventCard';
import EventFilters from '@/components/discovery/EventFilters';
import { Button } from '@/components/ui/button';
import { PenSquare, Loader2, Calendar, Plus, Filter, Users as UsersIcon, Hash, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import StoryViewer from '@/components/stories/StoryViewer';
import CreateStoryModal from '@/components/stories/CreateStoryModal';
import { supabase } from '@/integrations/supabase/client';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useRealtimePosts } from '@/hooks/useRealtimePosts';
import { CompactDiscoveryDropdowns } from '@/components/discovery/CompactDiscoveryDropdowns';

const DiscoveryFeed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'events'>('posts');
  const [showEventFilters, setShowEventFilters] = useState(false);
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  
  // Discovery filters
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  
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
      let postsData: Post[];
      
      if (activeHashtag) {
        postsData = await getPostsByHashtag(activeHashtag) as Post[];
      } else if (activeGroup) {
        const groupPostsData = await getGroupPosts(activeGroup);
        postsData = groupPostsData?.map((item: any) => item.posts).filter(Boolean) || [];
      } else {
        postsData = showFollowingOnly ? await getFollowingPosts() : await getPosts();
      }
      
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
  }, [showFollowingOnly, activeHashtag, activeGroup]);

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
      toast({ title: 'Error', description: 'Failed to like post', variant: 'destructive' });
    }
  };

  const handleComment = (postId: string) => {
    toast({ title: 'Comments', description: 'Comment feature coming soon!' });
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

  const handleCreatePost = () => { navigate('/create-post'); };
  const handleCreateEvent = () => { navigate('/create-event'); };

  const handleJoinEvent = async (eventId: string) => {
    try {
      await joinEvent(eventId);
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, is_attending: true, attendees_count: event.attendees_count + 1 }
          : event
      ));
      toast({ title: 'Success', description: 'Joined event successfully!' });
    } catch (error) {
      console.error('Error joining event:', error);
      toast({ title: 'Error', description: 'Failed to join event', variant: 'destructive' });
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
      toast({ title: 'Left event', description: 'You are no longer attending this event' });
    } catch (error) {
      console.error('Error leaving event:', error);
      toast({ title: 'Error', description: 'Failed to leave event', variant: 'destructive' });
    }
  };

  const handleHashtagFilter = (hashtag: string | null) => {
    setActiveHashtag(hashtag);
    setActiveGroup(null);
  };

  const handleGroupFilter = (groupId: string | null) => {
    setActiveGroup(groupId);
    setActiveHashtag(null);
  };

  const clearDiscoveryFilters = () => {
    setActiveHashtag(null);
    setActiveGroup(null);
  };

  const handleClearEventFilters = () => {
    setEventCategory('all');
    setEventLocation('');
    setEventDateFrom('');
    setEventDateTo('');
    setEventSearchQuery('');
  };

  const filteredEvents = events.filter(event => {
    if (eventCategory !== 'all' && event.category !== eventCategory) return false;
    if (eventLocation && !event.location.toLowerCase().includes(eventLocation.toLowerCase())) return false;
    if (eventDateFrom && new Date(event.event_date) < new Date(eventDateFrom)) return false;
    if (eventDateTo && new Date(event.event_date) > new Date(eventDateTo)) return false;
    if (eventSearchQuery) {
      const query = eventSearchQuery.toLowerCase();
      if (!event.title.toLowerCase().includes(query) && !event.description.toLowerCase().includes(query) && !event.location.toLowerCase().includes(query)) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Frosted glass header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            KurdMatch
          </h1>
          <div className="flex items-center gap-0.5">
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              onClick={activeTab === 'posts' ? handleCreatePost : handleCreateEvent}
              className="text-foreground h-10 w-10 rounded-full hover:bg-muted"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Stories Row — breathing room, no border */}
        {stories.length > 0 && (
          <div className="px-4 py-3">
            <StoryBubbles
              stories={stories}
              onStoryClick={handleStoryClick}
              onAddStory={handleAddStory}
            />
          </div>
        )}

        {/* Pill-style segmented control */}
        <div className="px-4 py-2">
          <div className="flex bg-card rounded-full p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-2 text-sm font-semibold rounded-full text-center transition-all duration-200 ${
                activeTab === 'posts' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-muted-foreground'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-2 text-sm font-semibold rounded-full text-center transition-all duration-200 ${
                activeTab === 'events' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-muted-foreground'
              }`}
            >
              Events
            </button>
          </div>
        </div>

        {/* Following + filters row */}
        {activeTab === 'posts' && (
          <div className="px-4 py-2 flex items-center gap-2">
            <button
              onClick={() => setShowFollowingOnly(!showFollowingOnly)}
              className={`text-xs font-medium px-4 h-9 rounded-full transition-all duration-200 ${
                showFollowingOnly 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-card text-muted-foreground shadow-sm'
              }`}
            >
              Following
            </button>
            <CompactDiscoveryDropdowns 
              onHashtagFilter={handleHashtagFilter}
              onGroupFilter={handleGroupFilter}
              activeHashtag={activeHashtag}
              activeGroup={activeGroup}
            />
          </div>
        )}

        {activeTab === 'events' && (
          <div className="px-4 py-2 flex items-center justify-end">
            <Button 
              onClick={() => setShowEventFilters(!showEventFilters)}
              size="sm"
              variant="ghost"
              className="gap-1.5 text-muted-foreground text-xs h-9 rounded-full"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        )}

        {/* Active filter banner */}
        {(activeHashtag || activeGroup) && (
          <div className="mx-4 mb-2 px-4 py-2.5 flex items-center justify-between bg-card rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-sm text-foreground">
              {activeHashtag && <><Hash className="w-4 h-4 text-primary" /><span>#{activeHashtag}</span></>}
              {activeGroup && <><UsersIcon className="w-4 h-4 text-primary" /><span>Group Posts</span></>}
            </div>
            <Button size="sm" variant="ghost" onClick={clearDiscoveryFilters} className="h-8 w-8 p-0 rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Posts Feed — floating cards */}
        {activeTab === 'posts' && (
          <div className="space-y-3 pt-2">
            {posts.length === 0 ? (
              <div className="text-center py-16 px-4">
                <p className="text-muted-foreground mb-4">No posts yet</p>
                <Button onClick={handleCreatePost} className="gap-2 rounded-2xl h-11">
                  <PenSquare className="w-4 h-4" />
                  Create First Post
                </Button>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="mx-4 bg-card rounded-3xl overflow-hidden shadow-lg">
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Events Feed — floating cards */}
        {activeTab === 'events' && (
          <div className="px-4 pt-2 space-y-3">
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
              <div className="text-center py-16">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                <p className="text-muted-foreground mb-4">
                  {events.length === 0 ? 'No upcoming events' : 'No events match your filters'}
                </p>
                <Button onClick={events.length === 0 ? handleCreateEvent : handleClearEventFilters} className="rounded-2xl h-11">
                  {events.length === 0 ? 'Create First Event' : 'Clear Filters'}
                </Button>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onJoin={handleJoinEvent} onLeave={handleLeaveEvent} />
              ))
            )}
          </div>
        )}
      </div>

      <BottomNavigation />

      {selectedStory && (
        <StoryViewer
          open={!!selectedStory}
          onOpenChange={(open) => !open && setSelectedStory(null)}
          stories={stories}
          initialIndex={stories.findIndex(s => s.id === selectedStory.id)}
        />
      )}

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
