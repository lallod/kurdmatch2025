import { useState, useEffect } from 'react';
import { Calendar, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getEvents, getUserEvents, Event } from '@/api/events';
import EventCard from '@/components/events/EventCard';
import BottomNavigation from '@/components/BottomNavigation';
import CreateEventModal from '@/components/events/CreateEventModal';

export default function Events() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const [all, mine] = await Promise.all([
        getEvents(),
        getUserEvents()
      ]);
      setAllEvents(all);
      setMyEvents(mine);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Events</h1>
                  <p className="text-sm text-purple-200">Discover and join community events</p>
                </div>
              </div>
              <Button onClick={() => setShowCreateModal(true)} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/20 backdrop-blur">
              <TabsTrigger value="all" className="data-[state=active]:bg-white/20">
                All Events
              </TabsTrigger>
              <TabsTrigger value="mine" className="data-[state=active]:bg-white/20">
                My Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {loading ? (
                <div className="text-center py-12 text-white">Loading events...</div>
              ) : allEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allEvents.map(event => (
                    <EventCard key={event.id} event={event} onUpdate={loadEvents} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-purple-200">
                  No upcoming events. Be the first to create one!
                </div>
              )}
            </TabsContent>

            <TabsContent value="mine" className="mt-6">
              {loading ? (
                <div className="text-center py-12 text-white">Loading your events...</div>
              ) : myEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myEvents.map(event => (
                    <EventCard key={event.id} event={event} onUpdate={loadEvents} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-purple-200">
                  You haven't joined any events yet.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
      
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadEvents();
          }}
        />
      )}
    </div>
  );
}
