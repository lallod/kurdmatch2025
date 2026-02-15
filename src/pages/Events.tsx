import { useState, useEffect } from 'react';
import { Calendar, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEvents, getUserEvents, Event } from '@/api/events';
import EventCard from '@/components/events/EventCard';

import CreateEventModal from '@/components/events/CreateEventModal';
import { useTranslations } from '@/hooks/useTranslations';

export default function Events() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const { t } = useTranslations();

  const loadEvents = async () => {
    setLoading(true);
    try {
      const [all, mine] = await Promise.all([getEvents(), getUserEvents()]);
      setAllEvents(all);
      setMyEvents(mine);
    } catch (error) { console.error('Error loading events:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadEvents(); }, []);

  const currentEvents = activeTab === 'all' ? allEvents : myEvents;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {/* Slim header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border/30">
          <div className="max-w-lg mx-auto px-4 h-11 flex items-center justify-between">
             <h1 className="text-base font-semibold text-foreground">{t('events.title', 'Events')}</h1>
             <Button onClick={() => setShowCreateModal(true)} size="sm" variant="ghost" className="gap-1 text-sm">
               <Plus className="w-4 h-4" />
               {t('events.create', 'Create')}
             </Button>
          </div>
        </div>

        {/* Underline tabs */}
        <div className="max-w-lg mx-auto flex border-b border-border/20">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2.5 text-sm font-semibold text-center relative ${activeTab === 'all' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {t('events.all_events', 'All Events')}
            {activeTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`flex-1 py-2.5 text-sm font-semibold text-center relative ${activeTab === 'mine' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {t('events.my_events', 'My Events')}
            {activeTab === 'mine' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
          </button>
        </div>

        <div className="max-w-lg mx-auto px-4 py-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">Loading events...</div>
          ) : currentEvents.length > 0 ? (
            <div className="space-y-4">
              {currentEvents.map(event => (
                <EventCard key={event.id} event={event} onUpdate={loadEvents} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                {activeTab === 'all' ? t('events.no_upcoming', 'No upcoming events') : t('events.no_joined', "You haven't joined any events yet.")}
              </p>
            </div>
          )}
        </div>
      </div>

      
      
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); loadEvents(); }}
        />
      )}
    </div>
  );
}
