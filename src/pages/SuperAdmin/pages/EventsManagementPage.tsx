import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Calendar, Trash2, Search, MapPin, Users, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/hooks/useTranslations';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  category: string;
  attendees_count: number;
  max_attendees: number;
  created_at: string;
  image_url: string;
  user_id: string;
}

interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
}

const EventsManagementPage = () => {
  const { t } = useTranslations();
  const [events, setEvents] = useState<Event[]>([]);
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('event_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEvents(data || []);
      setTotalEvents(count || 0);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error(t('toast.events_load_failed', 'Failed to load events'));
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAttendees(data || []);
      setTotalAttendees(count || 0);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      toast.error(t('toast.attendees_load_failed', 'Failed to load attendees'));
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm(t('admin.confirm_delete_event', 'Are you sure you want to delete this event?'))) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(t('toast.event_deleted', 'Event deleted successfully'));
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(t('toast.event_delete_failed', 'Failed to delete event'));
    }
  };

  const removeAttendee = async (id: string) => {
    if (!confirm(t('admin.confirm_remove_attendee', 'Are you sure you want to remove this attendee?'))) return;

    try {
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(t('toast.attendee_removed', 'Attendee removed successfully'));
      fetchAttendees();
    } catch (error) {
      console.error('Error removing attendee:', error);
      toast.error(t('toast.attendee_remove_failed', 'Failed to remove attendee'));
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchAttendees();
  }, []);

  const filteredEvents = events.filter(event => {
    const search = searchTerm.toLowerCase();
    return event.title.toLowerCase().includes(search) || event.location.toLowerCase().includes(search);
  });

  const filteredAttendees = attendees.filter(attendee => {
    const search = searchTerm.toLowerCase();
    return attendee.event_id.toLowerCase().includes(search) || attendee.user_id.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.events_management', 'Events Management')}</h1>
          <p className="text-white/60 mt-1">{t('admin.manage_events_attendees', 'Manage all events and attendees')}</p>
        </div>
        <Button onClick={() => { fetchEvents(); fetchAttendees(); }} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          {t('common.refresh', 'Refresh')}
        </Button>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="events" className="data-[state=active]:bg-white/10">
            {t('admin.events', 'Events')} ({totalEvents})
          </TabsTrigger>
          <TabsTrigger value="attendees" className="data-[state=active]:bg-white/10">
            {t('admin.attendees', 'Attendees')} ({totalAttendees})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                {t('admin.all_events', 'All Events')}
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder={t('admin.search_events', 'Search events...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-white/60">{t('admin.loading_events', 'Loading events...')}</div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-8 text-white/60">{t('admin.no_events_found', 'No events found')}</div>
              ) : (
                <div className="grid gap-4">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {event.image_url && (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                              <p className="text-white/60 text-sm mt-1 line-clamp-2">{event.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`/events/${event.id}`, '_blank')}
                                className="text-white/60 hover:text-white hover:bg-white/5"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteEvent(event.id)}
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(event.event_date), 'MMM d, yyyy HH:mm')}
                            </Badge>
                            {event.category && (
                              <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                                {event.category}
                              </Badge>
                            )}
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                              <Users className="h-3 w-3 mr-1" />
                              {event.attendees_count}{event.max_attendees ? `/${event.max_attendees}` : ''} {t('admin.attendees', 'attendees')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees">
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                {t('admin.all_attendees', 'All Attendees')}
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder={t('admin.search_attendees', 'Search attendees...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-white/60">{t('admin.loading_attendees', 'Loading attendees...')}</div>
              ) : filteredAttendees.length === 0 ? (
                <div className="text-center py-8 text-white/60">{t('admin.no_attendees_found', 'No attendees found')}</div>
              ) : (
                <div className="space-y-3">
                  {filteredAttendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1">
                          <p className="text-white font-medium">{t('admin.user_label_short', 'User')}: {attendee.user_id.substring(0, 12)}...</p>
                          <p className="text-white/40 text-sm">{t('admin.event_label', 'Event')}: {attendee.event_id.substring(0, 12)}...</p>
                        </div>

                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(attendee.created_at), 'MMM d, yyyy')}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/profile/${attendee.user_id}`, '_blank')}
                          className="text-white/60 hover:text-white hover:bg-white/5"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttendee(attendee.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsManagementPage;
