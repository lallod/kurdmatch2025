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
import { PenSquare, Loader2, Calendar, Plus, Filter, Users as UsersIcon, Hash, X, Sparkles, Search, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import StoryViewer from '@/components/stories/StoryViewer';
import CreateStoryModal from '@/components/stories/CreateStoryModal';
import { supabase } from '@/integrations/supabase/client';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useRealtimePosts } from '@/hooks/useRealtimePosts';
import { CompactDiscoveryDropdowns } from '@/components/discovery/CompactDiscoveryDropdowns';

type FeedTab = 'posts' | 'events' | 'groups';

const DiscoveryFeed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FeedTab>('posts');
  const [showEventFilters, setShowEventFilters] = useState(false);
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  
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

  const getCreateAction = () => {
    switch (activeTab) {
      case 'events': return handleCreateEvent;
      case 'groups': return () => navigate('/groups');
      default: return handleCreatePost;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs: { key: FeedTab; label: string; icon: React.ReactNode }[] = [
    { key: 'posts', label: 'Posts', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: 'events', label: 'Events', icon: <Calendar className="w-3.5 h-3.5" /> },
    { key: 'groups', label: 'Groups', icon: <UsersIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Native app header */}
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/search')}
                className="text-muted-foreground h-9 w-9 rounded-full"
              >
                <Search className="w-[18px] h-[18px]" />
              </Button>
              <NotificationBell />
              <Button
                variant="ghost"
                size="icon"
                onClick={getCreateAction()}
                className="text-foreground h-9 w-9 rounded-full"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Stories Row */}
        <div className="px-3 pt-3 pb-2">
          <StoryBubbles
            stories={stories}
            onStoryClick={handleStoryClick}
            onAddStory={handleAddStory}
          />
        </div>

        {/* Segmented tab control — native iOS style */}
        <div className="px-4 py-2">
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-1 flex gap-0.5 border border-border/10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-xl whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'text-muted-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact filter chips for posts */}
        {activeTab === 'posts' && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setShowFollowingOnly(!showFollowingOnly)}
                className={`text-[11px] font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  showFollowingOnly
                    ? 'bg-primary/15 text-primary border border-primary/25'
                    : 'bg-card/60 text-muted-foreground border border-border/15'
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
          </div>
        )}

        {activeTab === 'events' && (
          <div className="px-4 pb-2 flex items-center justify-end">
            <button
              onClick={() => setShowEventFilters(!showEventFilters)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-card/60 text-muted-foreground border border-border/15 flex items-center gap-1"
            >
              <Filter className="w-3 h-3" />
              Filters
            </button>
          </div>
        )}

        {/* Active filter banner */}
        {(activeHashtag || activeGroup) && (
          <div className="mx-4 mb-2 px-3 py-2 flex items-center justify-between bg-primary/10 rounded-xl border border-primary/15">
            <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
              {activeHashtag && <><Hash className="w-3 h-3 text-primary" /><span>#{activeHashtag}</span></>}
              {activeGroup && <><UsersIcon className="w-3 h-3 text-primary" /><span>Group</span></>}
            </div>
            <button onClick={clearDiscoveryFilters} className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-muted/50 active:scale-90 transition-transform">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Posts Feed */}
        {activeTab === 'posts' && (
          <div className="space-y-3 px-4 pt-1">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <PenSquare className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">No posts yet</h3>
                <p className="text-xs text-muted-foreground mb-5">Be the first to share something</p>
                <Button onClick={handleCreatePost} size="sm" className="gap-2 rounded-xl h-10 text-xs px-6 shadow-lg shadow-primary/20">
                  <PenSquare className="w-3.5 h-3.5" />
                  Create Post
                </Button>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-card rounded-2xl overflow-hidden shadow-lg shadow-black/10 border border-border/10">
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

        {/* Events Feed */}
        {activeTab === 'events' && (
          <div className="px-4 pt-1 space-y-3">
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
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {events.length === 0 ? 'No upcoming events' : 'No events match'}
                </h3>
                <p className="text-xs text-muted-foreground mb-5">
                  {events.length === 0 ? 'Create the first one' : 'Try different filters'}
                </p>
                <Button onClick={events.length === 0 ? handleCreateEvent : handleClearEventFilters} size="sm" className="rounded-xl h-10 text-xs px-6 shadow-lg shadow-primary/20">
                  {events.length === 0 ? 'Create Event' : 'Clear Filters'}
                </Button>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onJoin={handleJoinEvent} onLeave={handleLeaveEvent} />
              ))
            )}
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="px-4 pt-1">
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4 shadow-lg">
                <UsersIcon className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Community Groups</h3>
              <p className="text-xs text-muted-foreground mb-5">Find your people</p>
              <Button onClick={() => navigate('/groups')} size="sm" className="rounded-xl h-10 text-xs px-6 shadow-lg shadow-primary/20">
                Browse Groups
              </Button>
            </div>
          </div>
        )}
      </div>

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
